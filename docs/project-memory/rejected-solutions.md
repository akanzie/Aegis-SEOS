# Project Memory: Các Phương Án Đã Bị Loại Bỏ (Rejected Solutions)

Mục đích: Ngăn AI Agent đề xuất lại các giải pháp đã từng được cân nhắc nhưng bị bác bỏ vì lý do kiến trúc hoặc chi phí vận hành.

---

## 1. Lưu Trực Tiếp Config / API Keys Trong File Code
- **Trạng thái**: REJECTED
- **Lý do**: Nguy cơ rò rỉ bảo mật cao khi commit lên Git repository.
- **Phương án thay thế**: Sử dụng biến môi trường được định nghĩa và kiểm tra tập trung qua schema validation (`src/lib/env.ts`).

## 2. Truy Vấn Database Trực Tiếp Từ Client Component
- **Trạng thái**: REJECTED
- **Lý do**: Vi phạm ranh giới cách ly mạng, rò rỉ chuỗi kết nối DB và credentials.
- **Phương án thay thế**: Mọi thao tác ghi/đọc dữ liệu từ client phải thông qua Server Actions hoặc API Route Handlers.

## 3. Drop Cột DB Trực Tiếp Trong Cùng Release Đổi Code
- **Trạng thái**: REJECTED
- **Lý do**: Dẫn đến downtime tức thì cho các phiên bản ứng dụng cũ đang phục vụ lưu lượng trong quá trình rolling update.
- **Phương án thay thế**: Quy trình Expand-and-Contract chuẩn qua 2-3 chu kỳ release.
