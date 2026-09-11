# Quick Checklist: 10 Điều Bất Biến & Definition of Done (One-Pager)

> Checklist này là ranh giới kỹ thuật tối cao. Mọi task (dù lớn hay nhỏ, dù do Dev hay AI thực hiện) đều phải vượt qua các tiêu chí này trước khi kết thúc task.

---

## I. 10 Ranh Giới Kỹ Thuật Bất Biến

### A. Machine-Enforced (Máy Chấm Tự Động: `npm run test:fitness`)
1. **Domain Pure (Tầng Nghiệp Vụ Thuần Khiết)**:
   - `src/domain/` tuyệt đối cấm import DB client, ORM, Web framework (Next.js/Express), network client hoặc UI components.
   - *Chi tiết*: [architecture-rules.md](../fitness-functions/architecture-rules.md#rule-domain-purity)
2. **Client/Server Isolation (Cách Ly Khách/Chủ)**:
   - File có `'use client'` cấm import DB client, server secrets, hoặc server-only helpers.
   - *Chi tiết*: [architecture-rules.md](../fitness-functions/architecture-rules.md#rule-client-isolation)
3. **No Raw Env (Biến Môi Trường Tập Trung Có Schema)**:
   - Cấm gọi trực tiếp `process.env.*` rải rác; mọi biến môi trường phải import qua schema validation tập trung (`src/lib/env.ts`).
   - *Chi tiết*: [architecture-rules.md](../fitness-functions/architecture-rules.md#rule-no-raw-env)

### B. Review-Enforced (Kiểm Định Qua Review, Investigation & Preflight)
4. **Server Trust Boundary (Ranh Giới Phía Máy Chủ)**:
   - Mọi database query phải lọc theo `userId`/`tenantId` từ session đã xác thực ở server; không tin cậy client params.
   - *Chi tiết*: [architecture-rules.md](../fitness-functions/architecture-rules.md#rule-server-trust-boundary)
5. **Stateless Services (Dịch Vụ Phi Trạng Thái)**:
   - Service singletons cấm lưu trạng thái người dùng trong biến `this.*`; toàn bộ context phải truyền qua tham số hàm.
   - *Chi tiết*: [architecture-rules.md](../fitness-functions/architecture-rules.md#rule-stateless-services)
6. **Master Data Identity (Danh Tính Hạt Giống Bất Biến)**:
   - Mọi dữ liệu seed bắt buộc có canonical deterministic key và upsert lũy đẳng (Idempotent).
   - *Chi tiết*: [architecture-rules.md](../fitness-functions/architecture-rules.md#rule-idempotent-seeds)
7. **Expand-and-Contract (Tiến Hóa CSDL An Toàn)**:
   - Không đổi tên hoặc drop cột trong cùng 1 release; luôn đi theo: Expand -> Backfill -> Read Transition -> Contract.
   - *Chi tiết*: [architecture-rules.md](../fitness-functions/architecture-rules.md#rule-expand-and-contract)
8. **Critical Flows Sensitivity (Độ Nhạy Theo Blast Radius P0/P1)**:
   - Thay đổi có blast radius chạm vào flow P0 (Auth, Core Loop, Payment availability) hoặc P1 (Payment integrity, Sync, Seeds) tự động nâng `risk_level: HIGH/CRITICAL` và cấm Fast Track.
   - *Chi tiết*: [critical-flows.md](../business-metrics/critical-flows.md)
9. **Performance & Observability Guardrails**:
   - Cấm query danh sách không giới hạn (unbounded query), chỉ select cột cần thiết trên hot path, chống N+1, bắt buộc correlation ID và structured logs cho luồng P0/P1.
   - *Chi tiết*: [performance.md](../standards/performance.md) & [observability.md](../standards/observability.md)
10. **Machine-Verified Fitness Pass**:
    - Bắt buộc `npm run test:fitness` trả về Exit code 0 trước khi hoàn tất commit.

---

## II. Tiêu Chuẩn Hoàn Tất Task (Definition of Done - DoD)

Một task chỉ được coi là hoàn tất khi đáp ứng **DoD profile tương ứng**:

### A. Standard DoD (Cho Standard 3-Step Path)
- [ ] 1. **Approved Task**: Task document (`task-*-fix.md` / `task-*-feat.md`) có `status: approved`.
- [ ] 2. **Spec Synchronized**: Đặc tả `docs/main_docs/<ACTIVE_VERSION>/fn/` đã cập nhật nếu có thay đổi hành vi.
- [ ] 3. **Automated Tests Pass**: Mọi test suites liên quan đều PASS (nếu dự án có test runner).
- [ ] 4. **Architecture Fitness Pass**: `npm run test:fitness` PASS với Exit code 0.
- [ ] 5. **No Open Assumptions**: Không còn giả định mở hay xung đột chưa giải quyết.
- [ ] 6. **Documentation & Memory**: Đã cập nhật ADR (nếu chạm trigger) và lessons/pitfalls (nếu phát hiện bẫy mới).
- [ ] 7. **Clean Conditional Commit**: Commit trên branch hợp lệ (`task/*`, `feat/*`, `fix/*`, `hotfix/*`), working tree chỉ chứa thay đổi in-scope trước khi commit và sạch hoàn toàn sau khi commit.

### B. Fast Track DoD (Cho Thay Đổi Nhanh / An Toàn)
- [ ] 1. **Scope Validity**: Thuộc phạm vi Fast Track (typo, markdown, comments, formatting, CSS thuần, test thuần).
- [ ] 2. **No Hard Stop**: Không chạm Public API, DB schema/seed, Auth/Authz, business runtime logic hay blast radius P0/P1.
- [ ] 3. **Minimal Surgical Diff**: Diff chỉ chứa các thay đổi tối thiểu cần thiết cho task.
- [ ] 4. **Verification Pass**: Kiểm tra phù hợp (format, lint, unit test liên quan) đã PASS.
- [ ] 5. **Architecture Fitness Pass**: `npm run test:fitness` PASS với Exit code 0 nếu chạm source/kiến trúc.
- [ ] 6. **No Open Assumptions**: Không còn giả định mở hoặc xung đột chưa giải quyết.
- [ ] 7. **Conditional Commit**: Commit trên branch hợp lệ nếu task có thay đổi mã nguồn/tài liệu cần lưu trữ (task read-only không cần commit).
