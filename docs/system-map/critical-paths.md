# System Map: Critical Paths (Các Luồng Sống Còn)

Mọi thay đổi liên quan đến các luồng dưới đây tự động kích hoạt mức độ nhạy cảm **HIGH** hoặc **CRITICAL**. Bắt buộc phải có review kỹ lưỡng và kiểm thử hồi quy.

---

## 1. Authentication & Authorization (Xác Thực & Phân Quyền)
- **Mức độ**: `P0 - Critical`
- **Mô tả**: Tiếp nhận thông tin đăng nhập, xác thực phiên làm việc (Session/JWT), giải mã danh tính người dùng và gán `userId` tin cậy.
- **Ranh giới an toàn**:
  - `userId` dùng để query DB chỉ được lấy từ Server Context đã được chứng thực.
  - Cấm chấp nhận `userId` tùy tiện từ request body/params.

## 2. Core Business Loop (Vòng Lặp Nghiệp Vụ Cốt Lõi)
- **Mức độ**: `P0 - Critical`
- **Mô tả**: Luồng tạo ra giá trị cốt lõi của ứng dụng (ví dụ: tiến trình luyện tập, đặt hàng, thanh toán, xử lý dữ liệu chính).
- **Ranh giới an toàn**:
  - Logic tính toán phải nằm ở Tầng Domain thuần túy.
  - Phải có bộ Unit test bao phủ 100% các edge cases (chia cho 0, số âm, overflow, null options).

## 3. Data Synchronization & Persistence (Đồng Bộ & Lưu Trữ Dữ Liệu)
- **Mức độ**: `P1 - High`
- **Mô tả**: Lưu trữ trạng thái xuống CSDL, batch updates, sync offline-to-online.
- **Ranh giới an toàn**:
  - Sử dụng Transactions cho các chuỗi mutation liên quan nhiều bảng.
  - Tuân thủ nguyên tắc Expand-and-Contract khi thay đổi schema.

## 4. Master Data & Seeding (Dữ Liệu Nguồn Khởi Tạo)
- **Mức độ**: `P1 - High`
- **Mô tả**: Nạp các danh mục tĩnh, bài tập mẫu, bảng cấu hình ban đầu vào CSDL.
- **Ranh giới an toàn**:
  - Phải có canonical key (UUID v5, slug, deterministic ID).
  - Thao tác phải là Upsert lũy đẳng (Idempotent), chạy lặp lại nhiều lần không sinh duplicate hay thay đổi ID quan hệ.
