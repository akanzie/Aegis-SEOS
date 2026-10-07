# Rework: [Artifact / revision]

- Mode / phase gốc: REWORK / [COMPOSE, INVESTIGATE hoặc EXECUTE đã được phép].
- Review nguồn / artifact revision / baseline: [Đường dẫn và revision].
- Approved scope / authority: [Approval đã có hoặc quyền viết plan draft].

Rework giữ nguyên quyền phase gốc. Sửa plan không cho phép sửa runtime. Thay đổi scope, risk, contracts hoặc quyết định nghiệp vụ cần approval mới cho phần thay đổi.

## 1. Ánh Xạ Findings

| Finding ID | Hành động / file:symbol | Bằng chứng verification | Trạng thái xử lý | Lý do còn mở |
| :--- | :--- | :--- | :--- | :--- |
| F-001 | [Thay đổi tối thiểu] | [Check và revision] | [Pending / chờ review lại] | [Lý do hoặc không có] |

Giữ ID từ review. Mục không xử lý phải ghi lý do để reviewer/Developer quyết định; không tự đánh dấu resolved.

## 2. Re-verification Và Bàn Giao

- Phần bị ảnh hưởng / regression liên quan: [Blast radius].
- Checks và manual scenarios: [Lệnh, exit code, người chạy, môi trường, kết quả thật].
- Revision mới / baseline bảo toàn: [Thông tin].
- Open items / approval cần thêm / next authority: [Thông tin].
- Kết luận: [Chờ review lại hoặc blocked với lý do; không tái sử dụng kết luận revision cũ].
