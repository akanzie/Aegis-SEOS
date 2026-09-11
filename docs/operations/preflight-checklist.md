# Preflight Checklist: Quy Trình Kiểm Tra Trước Release

Checklist này dành cho Developer và AI Agent trước khi hoàn tất PR hoặc kích hoạt deployment lên Production/Staging.

---

## 1. Kiểm Tra Tính Đúng Đắn Nghiệp Vụ & Spec
- [ ] Task fix document (`docs/tasks/**/task-*-fix.md`) đã có `status: approved` (với Standard 3-Step Path).
- [ ] Đã đánh giá Spec Impact:
  - Nếu `CHANGE`: Đặc tả nghiệp vụ trong `docs/main_docs/<ACTIVE_VERSION>/fn/` đã được cập nhật tương ứng.
  - Nếu `CLARIFICATION`: Đã làm rõ các edge case trong tài liệu đặc tả.
- [ ] Không có mâu thuẫn (conflict) chưa được giải quyết giữa code và tài liệu.

## 2. Kiểm Tra Ranh Giới Kiến Trúc & An Toàn
- [ ] Lệnh `npm run test:fitness` chạy thành công với Exit code 0 (Machine-Enforced).
- [ ] Tầng Domain thuần khiết, không bị xâm lấn bởi DB, ORM, framework hay UI.
- [ ] Tầng Client không leak Server Secrets hoặc trực tiếp gọi Database.
- [ ] Không có truy cập `process.env.*` trực tiếp ngoài module cấu hình tập trung.
- [ ] Service/Repository singletons là stateless, không lưu request context trong instance state (`this.*`).

## 3. Kiểm Tra Cơ Sở Dữ Liệu & Migrations
- [ ] Tuân thủ nguyên tắc **Expand-and-Contract** (không xóa hoặc đổi tên cột tức thì).
- [ ] Các câu lệnh query đều được scope theo `userId`/`tenantId` hợp lệ từ server session.
- [ ] Dữ liệu Seed/Master Data đảm bảo tính lũy đẳng (Idempotent upsert, không sinh duplicate).
- [ ] Các trường tìm kiếm thường xuyên đã có index phù hợp, đánh giá cân đối write overhead.

## 4. Kiểm Thử Tự Động (Testing)
- [ ] Toàn bộ Unit Tests và Integration Tests liên quan đều PASS.
- [ ] Đã bổ sung test case cho invariants và edge-case classes (boundary values, invalid input, null/empty, concurrency/idempotency).

## 5. Quy Chuẩn Git & Release
- [ ] Code được commit trên branch riêng theo task (`task/*`, `feat/*`, `fix/*`, `hotfix/*`), tuyệt đối không commit trên `main`/`master`.
- [ ] Working tree chỉ chứa các thay đổi thuộc phạm vi task; không có file rác, file `.env.local` hoặc secret keys bị commit nhầm.
- [ ] Sau commit, `git status --short` sạch sẽ không còn file dở dang ngoài baseline đã ghi nhận.
- [ ] Commit message tuân theo Conventional Commits.
