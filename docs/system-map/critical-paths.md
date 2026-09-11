# System Map: Critical Paths (Các Luồng Sống Còn)

Mọi thay đổi liên quan đến các luồng dưới đây tự động kích hoạt mức độ nhạy cảm **HIGH** hoặc **CRITICAL** dựa trên bán kính tác động (blast radius). Bắt buộc phải có review kỹ lưỡng và kiểm thử hồi quy.

---

## 1. Authentication & Authorization (Xác Thực & Phân Quyền)
- **Mức độ**: `P0 - Critical`
- **Mô tả**: Tiếp nhận thông tin đăng nhập, xác thực phiên làm việc (Session/JWT), giải mã danh tính người dùng và gán `userId` tin cậy.
- **Ranh giới an toàn**:
  - `userId` dùng để query DB chỉ được lấy từ Server Context đã được chứng thực.
  - Cấm chấp nhận `userId` tùy tiện từ request body/params.

## 2. Core Business Loop (Vòng Lặp Nghiệp Vụ Cốt Lõi)
- **Mức độ**: `P0 - Critical`
- **Mô tả**: Luồng tạo ra giá trị cốt lõi của ứng dụng (ví dụ: tiến trình luyện tập, luồng học, xử lý dữ liệu chính).
- **Ranh giới an toàn**:
  - Logic tính toán phải nằm ở Tầng Domain thuần túy.
  - Phải có bộ Unit test bao phủ các phân lớp invariant và edge-case classes đã xác định trong spec/task (boundary values, invalid input, chia cho 0, overflow/underflow, null/empty states).

## 3. Payment Gateway Availability & Security (Cổng Thanh Toán & Ranh Giới An Toàn)
- **Mức độ**: `P0 - Critical`
- **Mô tả**: Tiếp nhận webhook từ đối tác thanh toán, xác thực nguồn gốc chữ ký, kiểm tra tính sẵn sàng của gateway, ngăn chặn giao dịch trái phép.
- **Ranh giới an toàn**:
  - Bắt buộc xác thực chữ ký số (cryptographic signature) của webhook trước khi xử lý payload.
  - Endpoint webhook phải được bảo vệ chống replay attack và giả mạo IP.

## 4. Payment Transaction & Ledger Integrity (Giao Dịch Thanh Toán & Sổ Cái)
- **Mức độ**: `P1 - High`
- **Mô tả**: Khởi tạo giao dịch tính phí (charge), gia hạn gói định kỳ, hoàn tiền (refund), ghi nhận bút toán sổ cái (ledger balance) và đối soát doanh thu.
- **Ranh giới an toàn**:
  - Mọi thao tác trừ tiền hoặc cộng quyền lợi bắt buộc có Idempotency Key duy nhất.
  - Sử dụng Database Transactions cho toàn bộ chuỗi cập nhật đơn hàng - sổ cái.

## 5. Data Synchronization & Persistence (Đồng Bộ & Lưu Trữ Dữ Liệu)
- **Mức độ**: `P1 - High`
- **Mô tả**: Lưu trữ trạng thái xuống CSDL, batch updates, sync offline-to-online.
- **Ranh giới an toàn**:
  - Sử dụng Transactions cho các chuỗi mutation liên quan nhiều bảng.
  - Tuân thủ nguyên tắc Expand-and-Contract khi thay đổi schema.

## 6. Master Data & Seeding (Dữ Liệu Nguồn Khởi Tạo)
- **Mức độ**: `P1 - High`
- **Mô tả**: Nạp các danh mục tĩnh, bài tập mẫu, bảng cấu hình ban đầu vào CSDL.
- **Ranh giới an toàn**:
  - Phải có canonical key (UUID v5, slug, deterministic ID).
  - Thao tác phải là Upsert lũy đẳng (Idempotent), chạy lặp lại nhiều lần không sinh duplicate hay thay đổi ID quan hệ.
