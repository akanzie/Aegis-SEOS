# Preflight: Release Checks

Nạp trước release/deployment; bảng này hỗ trợ kiểm tra, không cấp quyền deploy hoặc miễn gate.

<a id="merge-review-gate"></a>
Review PR/MR dùng owner [Merge Review Gate](merge-review.md#merge-review-gate), gồm đủ 10 câu và evidence đúng source/target SHA. Anchor cũ giữ cho task records.

## 1. Kiểm Tra Tính Đúng Đắn Nghiệp Vụ & Spec

- [ ] Task fix document (`docs/tasks/**/task-*-fix.md` / `task-*-feat.md`) đã có `approval_status: approved` với issuer/time/revision đúng scope (với Standard 3-Step Path).
- [ ] Đã đánh giá Spec Impact:
  - Nếu `CHANGE`: Đặc tả nghiệp vụ trong `docs/main_docs/<ACTIVE_VERSION>/fn/` đã được cập nhật tương ứng.
  - Nếu `CLARIFICATION`: Đã làm rõ các edge case trong tài liệu đặc tả.
- [ ] Không có mâu thuẫn (conflict) chưa được giải quyết giữa code và tài liệu.

## 2. Kiểm Tra Ranh Giới Kiến Trúc & An Toàn

- [ ] Fitness PASS Exit code 0 khi [AGENTS §5.D](../../AGENTS.md#quality-gate-applicability) yêu cầu; N/A chỉ khi bảng cho phép, ghi lý do. Thiếu validator bắt buộc là BLOCKED.
- [ ] Tầng Domain thuần khiết, không bị xâm lấn bởi DB, ORM, framework hay UI.
- [ ] Tầng Client không leak Server Secrets hoặc trực tiếp gọi Database.
- [ ] Không có truy cập `process.env.*` trực tiếp ngoài module cấu hình tập trung.
- [ ] Service/Repository singletons là stateless, không lưu request context trong instance state (`this.*`).

## 3. Kiểm Tra Cơ Sở Dữ Liệu & Migrations

- [ ] Tuân thủ nguyên tắc **Expand-and-Contract** (không xóa hoặc đổi tên cột tức thì).
- [ ] User/tenant queries dùng identity/quyền server xác thực; public/master-data/system-job có authority và scope riêng theo [Rule 4](../fitness-functions/architecture-rules.md#rule-server-trust-boundary); client params không cấp quyền.
- [ ] Dữ liệu Seed/Master Data đảm bảo tính lũy đẳng (Idempotent upsert, không sinh duplicate).
- [ ] Các trường tìm kiếm thường xuyên đã có index phù hợp, đánh giá cân đối write overhead.

## 4. Kiểm Thử Tự Động (Testing)

- [ ] Các tests/checks bắt buộc theo [ma trận risk](../standards/verification.md#risk-test-matrix) và gate applicability đã PASS; N/A ghi lý do, skipped/not run không phải PASS.
- [ ] Đã bổ sung test case cho invariants và edge-case classes (boundary values, invalid input, null/empty, concurrency/idempotency).

## 5. Quy Chuẩn Git & Release

- [ ] Code được commit trên branch riêng theo task (`task/*`, `feat/*`, `fix/*`, `hotfix/*`), tuyệt đối không commit trên `main`/`master`.
- [ ] Index/commit chỉ chứa thay đổi task; không có file rác hoặc secrets. Baseline chưa commit đã được ghi nhận và giữ nguyên.
- [ ] Sau commit, `git status --short` sạch sẽ không còn file dở dang ngoài baseline đã ghi nhận.
- [ ] Commit message tuân theo Conventional Commits.
- [ ] AC evidence, required manual checks và local/CI đúng revision theo [Verification Standard](../standards/verification.md); bàn giao theo [Handoff Contract](handoff-contract.md).
