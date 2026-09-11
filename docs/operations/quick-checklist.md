# Quick Checklist: 10 Điều Bất Biến & Definition of Done (One-Pager)

> Checklist này là ranh giới kỹ thuật tối cao. Mọi task (dù lớn hay nhỏ, dù do Dev hay AI thực hiện) đều phải vượt qua các tiêu chí này trước khi kết thúc task.

---

## I. 10 Ranh Giới Kỹ Thuật Bất Biến

1. **Domain Pure (Tầng Nghiệp Vụ Thuần Khiết)**:
   - `src/domain/` tuyệt đối cấm import DB client, ORM, Web framework (Next.js/Express), network client hoặc UI components.
   - *Chi tiết*: [docs/fitness-functions/architecture-rules.md](../fitness-functions/architecture-rules.md#luat-1-domain-is-pure)
2. **Server Trust Boundary (Ranh Giới Phía Máy Chủ)**:
   - Mọi database query phải lọc theo `userId`/`tenantId` từ session đã xác thực ở server; không tin cậy client params.
3. **Stateless Services (Dịch Vụ Phi Trạng Thái)**:
   - Service singletons cấm lưu trạng thái người dùng trong biến `this.*`; toàn bộ context phải truyền qua tham số hàm.
4. **Client/Server Isolation (Cách Ly Khách/Chủ)**:
   - File có `'use client'` cấm import DB client, server secrets, hoặc server-only helpers.
5. **No Raw Env (Biến Môi Trường Tập Trung)**:
   - Cấm gọi trực tiếp `process.env.*` rải rác; mọi biến môi trường phải import qua schema validation (`src/lib/env.ts`).
6. **Master Data Identity (Danh Tính Hạt Giống)**:
   - Mọi dữ liệu seed bắt buộc có canonical deterministic key và upsert lũy đẳng (Idempotent).
7. **Expand-and-Contract (Tiến Hóa CSDL An Toàn)**:
   - Không đổi tên hoặc drop cột trong cùng 1 release; luôn đi theo: Expand -> Backfill -> Read Transition -> Contract.
8. **Critical Flows Sensitivity (Độ Nhạy P0/P1)**:
   - Chạm vào flow P0/P1 (Auth, Core Loop, Billing, Sync) tự động nâng `risk_level: HIGH/CRITICAL` và cấm Fast Track.
9. **Performance & Observability Guardrails**:
   - Cấm unbounded query (`SELECT *` không limit), chống N+1, bắt buộc correlation ID và structured logs cho luồng P0/P1.
   - *Chi tiết*: [docs/standards/performance.md](../standards/performance.md) & [docs/standards/observability.md](../standards/observability.md)
10. **Machine-Verified Fitness (Máy Chấm Tự Động)**:
    - Bắt buộc `npm run test:fitness` trả về Exit code 0 trước khi commit.

---

## II. Tiêu Chuẩn Hoàn Tất Task (Definition of Done - DoD)

Một task chỉ hoàn tất khi thỏa mãn toàn bộ 7 tiêu chí sau:
- [ ] 1. **Approved Task**: Task document (`task-*-fix.md`) có `status: approved`.
- [ ] 2. **Spec Synchronized**: Đặc tả `docs/main_docs/<ACTIVE_VERSION>/fn/` đã cập nhật nếu có thay đổi hành vi.
- [ ] 3. **Automated Tests Pass**: Mọi test suites liên quan đều PASS (nếu dự án có test runner).
- [ ] 4. **Architecture Fitness Pass**: `npm run test:fitness` PASS với Exit code 0.
- [ ] 5. **No Open Assumptions**: Không còn giả định mở hay xung đột chưa giải quyết.
- [ ] 6. **Documentation & Memory**: Đã cập nhật ADR (nếu chạm trigger) và lessons/pitfalls (nếu có).
- [ ] 7. **Clean Conditional Commit**: Commit trên task branch hợp lệ (`task/*`, `feat/*`, `fix/*`), working tree sạch.
