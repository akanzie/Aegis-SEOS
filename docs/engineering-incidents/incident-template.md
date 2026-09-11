# Engineering Incident Post-Mortem Template

```markdown
# Incident Post-Mortem: [Tiêu Đề Ngắn Gọn Về Sự Cố]

- **Ngày xảy ra**: YYYY-MM-DD
- **Thời gian gián đoạn**: HH:MM -> HH:MM (Thời lượng: XX phút)
- **Mức độ (Severity)**: SEV-1 / SEV-2 / SEV-3
- **Người chủ trì điều tra**: @username / Agent Session ID
- **Các thành phần ảnh hưởng**: [Ví dụ: Auth, Database, Payment]

---

## 1. Tóm Tắt Sự Cố (Executive Summary)
Mô tả tóm tắt ngắn gọn sự cố đã diễn ra như thế nào, người dùng bị ảnh hưởng ra sao và hệ thống đã được khôi phục như thế nào.

## 2. Dòng Thời Gian (Timeline)
- **HH:MM** - Sự cố bắt đầu phát sinh (phát hiện qua alert/báo cáo người dùng).
- **HH:MM** - Đội ngũ kỹ thuật tiếp nhận thông tin và bắt đầu triage.
- **HH:MM** - Xác định nguyên nhân ban đầu và tiến hành rollback/mitigate.
- **HH:MM** - Triển khai bản vá (hotfix) hoặc hoàn tất rollback.
- **HH:MM** - Dịch vụ trở lại trạng thái bình thường.

## 3. Phân Tích Nguyên Nhân Gốc Rễ (Root Cause Analysis - RCA)
- Phân tích 5 Whys.
- Dòng code hoặc cấu hình cụ thể gây ra sự cố.
- Vì sao test suite hoặc máy chấm fitness không phát hiện ra lỗi trước khi deploy?

## 4. Hành Động Phòng Ngừa (Action Items)
- [ ] Bổ sung test case tự động tái hiện lỗi.
- [ ] Cập nhật quy tắc máy chấm kiến trúc `architecture-fitness.mjs`.
- [ ] Cập nhật tài liệu `docs/project-memory/known-pitfalls.md`.
```
