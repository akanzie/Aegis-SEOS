# Quick Checklist: 10 Điều Bất Biến & Definition of Done (One-Pager)

> Đây là checklist tóm tắt, không có authority riêng. Quyền/Git/DoD/gate applicability thuộc [AGENTS](../../AGENTS.md#quality-gate-applicability); invariants thuộc architecture rules, taxonomy thuộc critical flows, test matrix/evidence thuộc verification standard. Chọn mục áp dụng theo diff và risk; N/A phải ghi lý do.

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
   - User/tenant queries dùng identity/quyền server xác thực; public/master-data/system-job dùng authority và scope riêng theo Rule 4. Client params không cấp quyền.
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
   - Thay đổi có blast radius chạm vào flow P0 (Auth, core execution loop, Payment availability/security) hoặc P1 (Payment integrity, Sync, Seeds) tự động nâng `risk_level: HIGH/CRITICAL` và cấm Fast Track.
   - *Chi tiết*: [critical-flows.md](critical-flows.md)
9. **Performance & Observability Guardrails**:
   - Cấm query danh sách không giới hạn (unbounded query), chỉ select cột cần thiết trên hot path, chống N+1, bắt buộc correlation ID và structured logs cho luồng P0/P1.
   - *Chi tiết*: [performance.md](../standards/performance.md) & [observability.md](../standards/observability.md)
10. **Machine-Verified Fitness Pass**:
    - Xác định applicability tại [AGENTS §5.D](../../AGENTS.md#quality-gate-applicability); khi bắt buộc phải PASS Exit code 0. Thiếu validator là BLOCKED, không phải N/A.

---

## II. Tiêu Chuẩn Hoàn Tất Task (Definition of Done - DoD)

DoD đầy đủ thuộc [AGENTS §5](../../AGENTS.md); các mục dưới đây chỉ hỗ trợ kiểm tra. Test scope theo [ma trận canonical](../standards/verification.md#risk-test-matrix), applicability theo [AGENTS §5.D](../../AGENTS.md#quality-gate-applicability):

### A. Standard DoD (Cho Standard 3-Step Path)
- [ ] 1. **Approved Task**: Task document (`task-*-fix.md` / `task-*-feat.md`) có `status: approved`.
- [ ] 2. **Spec Synchronized**: Đặc tả `docs/main_docs/<ACTIVE_VERSION>/fn/` đã cập nhật nếu có thay đổi hành vi.
- [ ] 3. **Automated Tests Pass**: Checks bắt buộc theo test matrix/gate applicability đã PASS; N/A ghi lý do.
- [ ] 4. **Architecture Fitness Pass**: Gate Standard theo AGENTS §5.D đã PASS Exit code 0.
- [ ] 5. **No Open Assumptions**: Không còn giả định mở hay xung đột chưa giải quyết.
- [ ] 6. **Documentation & Memory**: Đã cập nhật ADR (nếu chạm trigger) và lessons/pitfalls (nếu phát hiện bẫy mới).
- [ ] 7. **Clean Conditional Commit**: Commit trên branch hợp lệ (`task/*`, `feat/*`, `fix/*`, `hotfix/*`); index chỉ có thay đổi task, baseline giữ nguyên, không còn thay đổi task sau commit.
- [ ] 8. **Evidence & Handoff**: AC có bằng chứng đúng revision; manual checks bắt buộc đã hoàn tất; bàn giao theo handoff-contract.md.

### B. Fast Track DoD (Cho Thay Đổi Nhanh / An Toàn)
- [ ] 1. **Scope Validity**: Thuộc phạm vi Fast Track (typo, markdown, comments, formatting, CSS thuần, test thuần).
- [ ] 2. **No Hard Stop**: Không chạm Public API, DB schema/seed, Auth/Authz, business runtime logic hay blast radius P0/P1.
- [ ] 3. **Minimal Surgical Diff**: Diff chỉ chứa các thay đổi tối thiểu cần thiết cho task.
- [ ] 4. **Verification Pass**: Kiểm tra phù hợp (format, lint, unit test liên quan) đã PASS.
- [ ] 5. **Architecture Fitness Pass**: PASS khi AGENTS §5.D yêu cầu; N/A chỉ khi bảng cho phép và có lý do.
- [ ] 6. **No Open Assumptions**: Không còn giả định mở hoặc xung đột chưa giải quyết.
- [ ] 7. **Conditional Commit**: Commit trên branch hợp lệ nếu task có thay đổi mã nguồn/tài liệu cần lưu trữ (task read-only không cần commit).
- [ ] 8. **Evidence & Handoff**: Kiểm chứng và báo cáo đúng phạm vi; skipped/not run không phải PASS.
