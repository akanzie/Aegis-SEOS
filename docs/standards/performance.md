# Engineering Standard: Performance Guardrails (Chuẩn Mực Hiệu Năng)

Tài liệu này quy định các rào chắn kỹ thuật nhằm đảm bảo hệ thống vận hành với độ trễ thấp, chịu tải cao và không gây nghẽn tài nguyên phần cứng.

---

## 1. Các Rào Chắn Bất Biến (Non-Negotiable Guardrails)

### A. Cấm Truy Vấn Không Giới Hạn (No Unbounded Queries)
- **Cấm tuyệt đối**: `SELECT *` hoặc `findMany()` / `find()` vào database mà không có điều kiện giới hạn số lượng (`limit` / `take`).
- **Mặc định**: Mọi truy vấn danh sách đều phải có giới hạn mặc định (ví dụ: `take: 20` hoặc `take: 50`) và tối đa không vượt quá `100` bản ghi trên 1 request.

### B. Bắt Buộc Phân Trang Chuẩn Hóa (Mandatory Pagination)
- Với tập dữ liệu tăng trưởng liên tục (lịch sử giao dịch, bài tập, nhật ký log): Bắt buộc áp dụng **Cursor-based Pagination** (dựa vào `id` hoặc `created_at`) để duy trì độ phức tạp `O(1)` thay vì Offset Pagination lớn.
- API trả về danh sách phải cung cấp metadata phân trang:
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
- Các tác vụ nặng về tính toán CPU (mã hóa video, trích xuất file zip lớn) phải được đẩy vào Worker Thread hoặc Background Queue.

---

## 2. Quy Chuẩn Đánh Chỉ Mục Database (Indexing Rules)

- **Foreign Keys**: Mọi trường khóa ngoại (`user_id`, `organization_id`) bắt buộc phải có index.
- **Trường Lọc Thường Xuyên**: Các trường thường xuyên xuất hiện trong mệnh đề `WHERE` (ví dụ: `status`, `created_at`, `email`) phải được đánh index đơn hoặc composite index.
- **Composite Index Order**: Sắp xếp thứ tự cột trong composite index theo nguyên tắc: Cột có tính chọn lọc cao nhất (high cardinality) đứng trước, hoặc theo đúng thứ tự câu query.

---

## 3. Quản Lý Kết Nối & Tài Nguyên (Connection Pooling)

- Luôn sử dụng Connection Pool cho Database thay vì mở kết nối đơn lẻ cho mỗi request.
- Thiết lập thời gian chờ (Query Timeout) rõ ràng cho mọi cuộc gọi mạng bên ngoài (tối đa 3-5 giây cho 3rd-party APIs) kèm Circuit Breaker.
