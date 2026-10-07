---
task_id: task-1
status: approved
critical_flow: P0
risk_level: CRITICAL
spec_impact: NONE
depends_on: []
created_by: AI Agent
approved_by: null
approved_at: null
---

# Task 1: Chốt Nguồn Chuẩn Cho Policy Vận Hành Và Kỹ Thuật

## 1. Nguồn Nghiệm Thu

- Yêu cầu gốc / batch prompt: [prompt-dieu-tra-docs-policy-alignment.md](prompt-dieu-tra-docs-policy-alignment.md); [findings gốc và traceability](findings-and-traceability.md), F03–F07, F13, F18, F24. F08 thuộc Task 2 duy nhất.
- Spec active / Context Package: `docs/main_docs/ACTIVE_VERSION.md` khai báo `v1.0` ở trạng thái Initializing; không có functional spec liên quan. Không có context package phù hợp cho policy docs.
- Actual / expected: Nhiều policy được lặp lại hoặc mâu thuẫn giữa AGENTS, architecture rules, risk taxonomy, checklist, verification, CI guide và HOW_WE_WORK; cần một owner canonical cho từng policy và link từ bản tóm tắt.

| AC | Hành vi cần đạt | Check bảo vệ ý định |
| :--- | :--- | :--- |
| AC-1 | Risk taxonomy và P0–P4 không chồng lấn; system map ánh xạ flow cụ thể về nguồn chuẩn; mọi direct summary bị ảnh hưởng được cập nhật cùng task | Đối chiếu taxonomy với system map, AGENTS, README, HOW_WE_WORK, quick checklist và các link |
| AC-2 | Quality-gate applicability và test matrix được định nghĩa một lần; README/HOW_WE_WORK/checklist/CI/verification cùng task không giữ wording cũ | Tìm kiếm mọi câu fitness/regression trong danh sách owner và đối chiếu matrix |
| AC-3 | User-data trust boundary phân biệt query user/tenant-scoped với public, master-data và system-job; AGENTS/README/checklist/preflight cùng task dùng cùng rule | Rà architecture rule, AGENTS, checklist, README và preflight |
| AC-4 | Accepted ADR, approved task, system map, technical architecture và project profile có thứ bậc/ranh giới authority rõ | Đối chiếu hierarchy và docs ownership |
| AC-5 | Git/commit summary chỉ nhắc đúng điều kiện index/task và baseline; README/HOW_WE_WORK/quick checklist không tự nhận authority hoặc lặp policy mâu thuẫn | So sánh các summaries với AGENTS và authority owners |
| AC-6 | Tóm tắt `SELECT *` giữ ngoại lệ theo contract/review; tên phase migration không nhập nhằng | Đối chiếu performance standard và migration playbook |

## 2. Điều Tra Và Root Cause

- Baseline: Branch `task/docs-policy-alignment`; baseline ban đầu tại `main`, working tree sạch. Không có context package phù hợp; Auth package không được nạp.
- Trace: Bảng evidence theo finding tại [findings-and-traceability.md](findings-and-traceability.md) §1/§3. Ví dụ: `system-map/critical-paths.md` §2 gán “tiến trình luyện tập, luồng học” P0; `business-metrics/critical-flows.md` §1 và `AGENTS.md` §7 gán cùng ví dụ P2. `AGENTS.md` §7 yêu cầu P1 integration, trong khi `critical-flows.md` yêu cầu P1 full regression và HOW_WE_WORK §7 yêu cầu P0/P1 full regression. `AGENTS.md` §6.B.4 nói mọi query scope `userId`, còn architecture-rules Rule 4 chỉ giới hạn truy vấn dữ liệu người dùng và nêu `userId`/`tenantId`.
- Root cause: Policy trùng lặp không có ma trận applicability/ownership thống nhất; tên gọi P0 core loop giao với P2 core business; trust-boundary và quality-gate được diễn đạt với phạm vi khác nhau.
- Blast radius / risk: P0/CRITICAL vì policy điều khiển quyền, verification và bảo vệ các flow P0/P1.
- Spec Impact: NONE — chỉ sửa policy tài liệu vận hành/kỹ thuật, không thay đổi business behavior/spec sản phẩm.

## 3. Thay Đổi Tối Thiểu

- In scope: F03–F07, F13, F18, F24. File owners: `AGENTS.md` policy sections for Technical HOW authority hierarchy, gates, invariants and risk; README; HOW_WE_WORK summaries for Git/DoD/gates/risk/invariants only; `docs/operations/quick-checklist.md`; `docs/business-metrics/critical-flows.md` cùng `docs/operations/critical-flows.md` nếu taxonomy được chuyển; `docs/system-map/critical-paths.md`; `docs/fitness-functions/architecture-rules.md`/`ci-enforcement.md`; `docs/standards/verification.md`/`README.md`/`performance.md`; `docs/playbooks/database-migration.md`; `docs/decisions/README.md`; `docs/architecture/README.md`; `docs/operations/project-profile.md` source-of-truth/gate mapping for F13; `docs/operations/preflight-checklist.md` trust-boundary section. Task 2 owns approval/lifecycle/status clauses in `AGENTS.md` and HOW_WE_WORK; Task 3 owns AGENTS §8 budget policy and residual routing pointers. To avoid an unsafe interim state, Task 1 updates all direct summaries in its policy domains in the same task; later tasks edit only their explicitly assigned sections.
- Out of scope: Task lifecycle/mode permissions (Task 2), đồng bộ các SOP/routing/context package còn lại (Task 3), runtime và archive.
- Spec synchronization: Không áp dụng; không thay đổi functional spec.
- Implementation: Chọn owner canonical cho risk taxonomy, test matrix/gates, trust boundary, Technical HOW authority hierarchy và standards; biến các nơi khác thành tóm tắt/link. Nếu chuyển vị trí risk taxonomy, giữ compatibility pointer và cập nhật mọi liên kết/direct summary trong cùng Task 1. Task 1 does not edit approval/status semantics in AGENTS §0 or HOW_WE_WORK; those clauses are owned by Task 2. Task 3 does not own or defer any AC/summary in F03–F07/F18.
- Compatibility / recovery: Không áp dụng runtime; bảo toàn đường dẫn cũ bằng redirect/link nếu tài liệu bị chuyển.
- ADR / memory: Không tạo ADR trừ khi investigation của execution phát hiện mandatory trigger; không suy diễn từ policy documentation alone.

## 4. Verification Matrix

| AC / invariant | Kịch bản và lý do | Lệnh thực tế / manual procedure | Kết quả | Bằng chứng / revision |
| :--- | :--- | :--- | :--- | :--- |
| Automated tests | Standard task; profile xác nhận validator test có trong `npm test`; chạy trước fitness do tests có thể tạo root fixtures | PowerShell: `npm.cmd test` | NOT_RUN | Ghi exit code/log và revision tại execution |
| Architecture fitness | Bắt buộc theo AGENTS §5.A/§2.C cho mọi Standard task và trước conditional commit; không xin miễn trừ cho batch này | PowerShell: `npm.cmd run test:fitness` | NOT_RUN | Ghi exit code/log và revision tại execution |
| AC-1–AC-6 | Tìm mọi bản policy liên quan, đối chiếu source owner/authority và xác nhận mọi direct summary cùng task đã đồng bộ | `rg -n` các policy terms; review diff/links; `git diff --check` | NOT_RUN | Sẽ ghi tại execution revision |
| Scope | Xác nhận không có runtime/archive changes | `git status --short`; kiểm tra `git diff --name-only` | NOT_RUN | Sẽ ghi tại execution revision |

## 5. Open Issues Và Approval

| Vấn đề / assumption | Bằng chứng / phương án | Người có quyền quyết định | Quyết định |
| :--- | :--- | :--- | :--- |
| Owner/vị trí risk taxonomy | Đề xuất: canonical tại `docs/operations/critical-flows.md`; system map chỉ ánh xạ flow; cập nhật references | Developer | Pending |
| Regression matrix P0/P1 | Đề xuất: “full regression” là toàn bộ automated/integration/manual checks gắn với impacted critical flow và invariants của nó, không phải toàn bộ suite không liên quan; P0/P1 đều cần integration regression, P0 cần full flow regression | Developer | Pending |
| Authority order | Đề xuất đặt Accepted ADR trong Technical HOW; approved task quyết định scope/AC hiện hành, ADR quyết định architecture đã accepted; profile chỉ ánh xạ khả năng thực tế | Developer | Pending |

- Plan revision được duyệt: Chưa có.
- Approval evidence: Chưa có.
- Chỉ chuyển `approved` sau khi Developer duyệt plan và Open Issues liên quan.

## 6. Execution Checkpoint / Handoff

- Đã làm / checks đã chạy / findings còn mở: Điều tra ghi evidence và ownership tại `findings-and-traceability.md`; chưa sửa tài liệu policy. `npm.cmd test` và fitness là gate bắt buộc tại execution, hiện NOT_RUN.
- Branch / revision / staged scope / conditional commit: `task/docs-policy-alignment`; chưa có commit/staged changes.
- DoD / bước tiếp theo / authority: Chờ Developer duyệt; sau đó thực thi theo scope đã duyệt và xác minh docs/link consistency.
