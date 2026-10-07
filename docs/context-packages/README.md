# First-Class Context Packages

Context Packages là cơ chế chính thức để kiểm soát ngân sách token và ngăn ngừa hiện tượng ảo giác (hallucination) cho AI Agent.

Thay vì để AI tự do quét toàn bộ cây mã nguồn hoặc đoán xem cần đọc file nào, mỗi domain / tính năng trọng yếu sẽ có 1 Context Package tương ứng trong thư mục này.

---

## 1. Cấu Trúc Của Một Context Package Chuẩn

Mỗi file trong `docs/context-packages/<domain>.md` tuân theo cấu trúc:

1. **Must Load (Bắt Buộc Đọc)**: Danh sách tối thiểu các files đặc tả nghiệp vụ, ranh giới và interfaces.
2. **Optional (Đọc Khi Cần Thiết)**: Các files bổ trợ chỉ đọc khi gặp edge case liên quan.
3. **Do Not Load (Tuyệt Đối Cấm Đọc)**: Các module ngoại vi không liên quan (ví dụ: đang làm Auth thì cấm đọc Billing, Media, Analytics).
4. **Token Budget Target**: Ngân sách token tối đa cho context session (thường `<= 15.000 tokens`).

---

## 2. Danh Sách Context Packages Có Sẵn

- [template.md](template.md) — Mẫu chuẩn để tạo Context Package mới.
- [auth-context.md](auth-context.md) — Context Package cho phân hệ Authentication & Session.

## 3. Package thiếu hoặc chưa đủ

Nếu không có package đúng scope, ghi rõ và đọc tối thiểu task, spec active, boundaries và code/tests trực tiếp. Must Load là điểm bắt đầu; trace thêm contracts/callers khi có bằng chứng nằm trong blast radius, không nạp package ngoại vi đón đầu. Cập nhật package nếu task phát hiện đường dẫn lỗi thời hoặc thiếu interface quan trọng. Không áp dụng package Auth cho task chỉ làm quy trình tài liệu.
