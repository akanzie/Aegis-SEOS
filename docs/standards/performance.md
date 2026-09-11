# Engineering Standard: Performance Guardrails (Chuẩn Mực Hiệu Năng)

Tài liệu này quy định các rào chắn kỹ thuật nhằm đảm bảo hệ thống vận hành với độ trễ thấp, chịu tải cao và không gây nghẽn tài nguyên phần cứng.

---

## 1. Các Rào Chắn Bất Biến (Non-Negotiable Guardrails)

### A. Giới Hạn Truy Vấn Danh Sách (Bounded List Queries)
- **Giới hạn số dòng bắt buộc**: Mọi truy vấn danh sách trên môi trường production bắt buộc phải có điều kiện giới hạn số lượng trả về (`limit` / `take`). Cấm tuyệt đối truy vấn danh sách không giới hạn (unbounded queries).
- **Phạm vi trường dữ liệu (Column Projection)**:
  - Trên các hot paths, API public hoặc các bảng có nhiều cột / cột text lớn: Bắt buộc chỉ `SELECT` các cột cần thiết để giảm tải I/O và băng thông mạng.
  - Sử dụng `SELECT *` chỉ khi contract thực sự yêu cầu toàn bộ entity và đã được review kỹ lưỡng.
- **Chính sách Limit theo Contract**:
  - Mỗi endpoint danh sách phải quy định rõ `default_limit` và `max_limit` trong API contract.
  - Nếu API contract chưa có quy định riêng, áp dụng giá trị mặc định toàn hệ thống: `default: 20`, `max: 100`.

### B. Bắt Buộc Phân Trang Chuẩn Hóa (Mandatory Pagination)
- **Ưu tiên Keyset / Cursor Pagination**: Đối với các tập dữ liệu tăng trưởng liên tục hoặc có kích thước lớn (lịch sử giao dịch, nhật ký log, bài tập): Ưu tiên áp dụng Cursor-based pagination nhằm tránh chi phí scan tăng dần theo độ sâu trang của Offset pagination (`OFFSET N`).
- **Yêu cầu kỹ thuật**: Trường dùng làm cursor (`id`, `created_at`) bắt buộc phải có Index và thứ tự sắp xếp (sort order) xác định, ổn định.
- **Định dạng phản hồi chuẩn**:
  ```json
  {
    "data": [...],
    "pagination": {
      "next_cursor": "rec_123456",
      "has_more": true
    }
  }
  ```

### C. Ngăn Chặn Vấn Đề N+1 Query
- **Hiện tượng**: Thực hiện 1 truy vấn danh sách cha, sau đó lặp qua từng phần tử để gọi tiếp truy vấn con.
- **Quy tắc bắt buộc**:
  - Tận dụng cơ chế `JOIN`, `include` hoặc batching query (`WHERE id IN (...)`).
  - Sử dụng pattern `DataLoader` nếu làm việc với GraphQL hoặc nested resolvers.

### D. Cấm Sync I/O Trong Request Loop (Non-Blocking Event Loop)
- Tuyệt đối cấm sử dụng các API đồng bộ gây nghẽn Event Loop trong luồng xử lý HTTP request (ví dụ: `fs.readFileSync`, `crypto.pbkdf2Sync`).
- Các tác vụ nặng về tính toán CPU (mã hóa video, nén file zip lớn, sinh PDF phức tạp) phải được đẩy vào Worker Thread hoặc Background Queue.

---

## 2. Quy Chuẩn Đánh Chỉ Mục Database (Indexing Rules)

- **Foreign Keys**: Các khóa ngoại (`user_id`, `organization_id`) thường xuyên xuất hiện trong JOIN, filtering, ownership checks hoặc thao tác cascade bắt buộc phải được đánh giá và tạo index. Quyết định thêm index phải cân nhắc giữa lợi ích đọc và chi phí ghi (write overhead).
- **Trường Lọc Thường Xuyên**: Các trường thường xuyên xuất hiện trong mệnh đề `WHERE` (ví dụ: `status`, `created_at`, `email`) phải được đánh index đơn hoặc composite index dựa trên query pattern thực tế.
- **Thứ Tự Composite Index (Index Column Order)**:
  - Sắp xếp cột trong composite index phải dựa trên:
    1. Các trường lọc chính xác (Equality predicates: `=`) đặt trước.
    2. Các trường lọc khoảng (Range predicates: `>`, `<`, `BETWEEN`) và sắp xếp (`ORDER BY`) đặt sau.
    3. Kết quả phân tích kế hoạch thực thi (`EXPLAIN / EXPLAIN ANALYZE`).
  - Tuyệt đối không quyết định thứ tự composite index chỉ dựa trên tính chọn lọc (high cardinality) một cách máy móc.

---

## 3. Quản Lý Kết Nối & Tài Nguyên (Connection Pooling & Resiliency)

- Luôn sử dụng Connection Pool cho Database thay vì mở kết nối đơn lẻ cho mỗi request.
- **Timeout & Latency Budget**:
  - Mọi cuộc gọi mạng ra bên ngoài (External/3rd-party calls) phải thiết lập timeout cụ thể phù hợp với latency budget của endpoint.
- **Retry & Circuit Breaker**:
  - Cơ chế Retry và Circuit Breaker chỉ được áp dụng khi thao tác mạng có tính chất lũy đẳng (Idempotent) hoặc endpoint đã có Idempotency Key bảo vệ, tránh gây ra tình trạng xử lý lặp giao dịch ngoài ý muốn.
