# Preflight Checklist: Quy Trình Kiểm Tra Trước Release

Checklist này dành cho Developer và AI Agent trước khi hoàn tất PR hoặc kích hoạt deployment lên Production/Staging.

---

## 1. Kiểm Tra Tính Đúng Đắn Nghiệp Vụ & Spec
- [ ] Task fix document (`docs/tasks/**/task-*-fix.md`) đã có `status: approved`.
- [ ] Đã đánh giá Spec Impact:
  - Nếu `CHANGE`: Đặc tả nghiệp vụ trong `docs/main_docs/<ACTIVE_VERSION>/fn/` đã được cập nhật tương ứng.
  - Nếu `CLARIFICATION`: Đã làm rõ các edge case trong tài liệu đặc tả.
- [ ] Không có mâu thuẫn (conflict) chưa được giải quyết giữa code và tài liệu.

## 2. Kiểm Tra Ranh Giới Kiến Trúc & An Toàn
- [ ] Lệnh `npm run test:fitness` chạy thành công với Exit code 0.
- [ ] Tầng Domain không bị xâm lấn bởi DB, ORM, framework hay UI.
- [ ] Tầng Client không leak Server Secrets hoặc trực tiếp gọi Database.
- [ ] Không có truy cập `process.env.*` trực tiếp ngoài module cấu hình tập trung.

## 3. Kiểm Tra Cơ Sở Dữ Liệu & Migrations
- [ ] Tuân thủ nguyên tắc **Expand-and-Contract** (không xóa hoặc đổi tên cột tức thì).
- [ ] Các câu lệnh query đều được scope theo `userId`/`tenantId` hợp lệ từ session.
- [ ] Dữ liệu Seed/Master Data đảm bảo tính lũy đẳng (Idempotent upsert, không sinh duplicate).
- [ ] Các trường tìm kiếm thường xuyên đã có index phù hợp.

## 4. Kiểm Thử Tự Động (Testing)
- [ ] Toàn bộ Unit Tests và Integration Tests đều PASS.
- [ ] Đã bổ sung test case cho lỗi vừa được sửa hoặc tính năng mới vừa thêm.
- [ ] Đã kiểm thử các edge case (null, undefined, rỗng, tải lớn, lỗi mạng).

## 5. Quy Chuẩn Git & Release
- [ ] Code được commit trên branch riêng theo task (`task/*`, `feat/*`, `fix/*`).
- [ ] Không có file rác, file `.env.local` hoặc secret keys bị commit nhầm.
- [ ] Commit message tuân theo Conventional Commits.
