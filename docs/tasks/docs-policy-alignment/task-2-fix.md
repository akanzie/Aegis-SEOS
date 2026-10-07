---
task_id: task-2
status: approved
critical_flow: P0
risk_level: CRITICAL
spec_impact: NONE
depends_on: [task-1]
created_by: AI Agent
approved_by: null
approved_at: null
---

# Task 2: Làm Rõ Quyền Mode, Lifecycle Task Và Handoff

## 1. Nguồn Nghiệm Thu

- Yêu cầu gốc / batch prompt: [prompt-dieu-tra-docs-policy-alignment.md](prompt-dieu-tra-docs-policy-alignment.md); [findings gốc và traceability](findings-and-traceability.md), F01–F02, F08–F10, F14–F16, F23.
- Spec active / Context Package: Không có functional spec/context package áp dụng cho workflow policy.
- Actual / expected: EXECUTE/Fast Track, READ_ONLY/REVIEW, task statuses, rework, checkpoint và cold-start chưa được mô tả thành một hợp đồng xuyên suốt.

| AC | Hành vi cần đạt | Check bảo vệ ý định |
| :--- | :--- | :--- |
| AC-1 | EXECUTE nêu rõ căn cứ Standard approved plan và Fast Track request trực tiếp có scope rõ; Fast Track exclusion và AGENTS escalation trigger là hai khái niệm riêng | Đối chiếu workflow với AGENTS và HOW_WE_WORK |
| AC-2 | Bảng mode ghi quyền đọc, sửa target và tạo artifact; READ_ONLY có thể trả lời trong chat, ghi file chỉ khi được yêu cầu/policy cho phép | Rà workflow, review/handoff templates |
| AC-3 | Approval record độc lập execution status theo transition model cụ thể tại §5; mọi task template fix/feature và handoff dùng cùng fields, states, transitions và ownership | Kiểm tra bảng transitions và đối chiếu `task-fix.md`, `task-feat.md`, tasks README, handoff |
| AC-4 | Quy định thứ tự đóng task, timestamp, commit/revision evidence và handoff; không bắt buộc một commit duy nhất | Trace trình tự task → conditional commit → evidence |
| AC-5 | Scope change checkpoint current diff, change request, vô hiệu hóa phần approval/evidence bị ảnh hưởng, cập nhật AC/plan, duyệt delta và verify lại | Đối chiếu workflow, task template và handoff |
| AC-6 | Cold-start/resume checklist ngắn bao gồm task/mode/track, branch/baseline, revision/approval, dependencies, profile/spec/package, AC/verify và checkpoint freshness | Review entry checklist và liên kết tới nguồn chi tiết |
| AC-7 | Glossary định nghĩa mode, track, phase, task/session, finding severity; quy định trigger, independence criteria và authority của independent reviewer; handoff phân biệt track với lifecycle output/DoD | Đối chiếu glossary và decision table tại §5 với workflow/review/handoff templates |

## 2. Điều Tra Và Root Cause

- Baseline: Branch `task/docs-policy-alignment`; working tree sạch khi bắt đầu; không có context package phù hợp.
- Trace: Evidence đối chiếu từng finding nằm tại [findings-and-traceability.md](findings-and-traceability.md) §1–3. Ví dụ: workflow §1 giới hạn EXECUTE theo approved plan nhưng HOW_WE_WORK §2.A cho Fast Track bỏ qua approval; task README chỉ có draft/approved/completed trong cùng field mà AGENTS §0 dùng làm approval evidence; handoff dùng pending verification/blocked/ready for review không có lifecycle mapping trong tasks README.
- Root cause: Workflow mode, task status, approval, artifact permission, DoD track và session output profile bị gộp hoặc định nghĩa ở nhiều nơi; không có transition/ownership table chung.
- Blast radius / risk: P0/CRITICAL vì sai cách diễn giải có thể cấp sai quyền thực thi hoặc bỏ qua approval.
- Spec Impact: NONE — thay đổi quy trình nội bộ, không đổi business spec.

## 3. Thay Đổi Tối Thiểu

- In scope: F01–F02, F08–F10, F14–F16, F23. File owners: `AGENTS.md` §0 approval record/status semantics and §3.B/§4 trigger references; `docs/operations/agent-workflow.md` (mode, cold-start, glossary); `docs/tasks/README.md` (execution status/transition); `docs/task-authoring/README.md` status/approval portion; `docs/operations/handoff-contract.md`; `docs/templates/task-fix.md`, `task-feat.md`, `handoff.md`, `review.md`. HOW_WE_WORK owner split: Task 1 owns Git/DoD/gate/risk/invariant summaries; Task 2 owns Standard/Fast Track EXECUTE approval basis and task approval/lifecycle/status summaries; Task 3 owns budget/routing pointers only.
- Out of scope: Chốt nội dung matrix chính thức (Task 1); đồng bộ các SOP và routing khác (Task 3).
- Spec synchronization: Không áp dụng.
- Implementation: Dùng approval record độc lập gồm `approval_status` (`pending`, `approved`, `revoked`), `approved_by`, `approved_at`, `approved_revision`; approval được giữ nguyên sau khi execution hoàn tất. Dùng `execution_status` (`not_started`, `in_progress`, `blocked`, `pending_verification`, `failed`, `cancelled`, `completed`, `superseded`) và áp dụng cùng schema cho fix/feature templates. Workflow là owner của transition/permission definitions; task README, handoff và templates chỉ triển khai/link đúng định nghĩa đó.
- Compatibility / recovery: Giữ khả năng lưu checkpoint và diff đang có khi blocked/cancelled/superseded; không tự xóa hoặc loại bỏ thay đổi cũ khi scope đổi.
- ADR / memory: Không áp dụng trừ khi phát sinh trigger kiến trúc trong execution.

## 4. Verification Matrix

| AC / invariant | Kịch bản và lý do | Lệnh thực tế / manual procedure | Kết quả | Bằng chứng / revision |
| :--- | :--- | :--- | :--- | :--- |
| Automated tests | Standard task; profile xác nhận validator test; phải chạy trước fitness | PowerShell: `npm.cmd test` | NOT_RUN | Ghi exit code/log và revision tại execution |
| Architecture fitness | Bắt buộc theo AGENTS §5.A/§2.C cho mọi Standard task và trước conditional commit; không xin miễn trừ cho batch này | PowerShell: `npm.cmd run test:fitness` | NOT_RUN | Ghi exit code/log và revision tại execution |
| AC-1–AC-7 | Lập transition/reviewer decision tables theo §5; đối chiếu cả fix và feature templates cùng các summaries do Task 2 sở hữu | `rg -n` tìm enum/transition/permission; review links/diff; `git diff --check` | NOT_RUN | Sẽ ghi tại execution revision |
| Scope | Xác nhận chỉ thay đổi docs hiện hành trong scope | `git status --short`; kiểm tra `git diff --name-only` | NOT_RUN | Sẽ ghi tại execution revision |

## 5. Open Issues Và Approval

| Vấn đề / assumption | Bằng chứng / phương án | Người có quyền quyết định | Quyết định |
| :--- | :--- | :--- | :--- |
| Lifecycle transitions | Áp dụng bảng dưới đây: approval record tách khỏi execution status; transitions có actor, precondition và diff/evidence retention rõ | Developer / delegated reviewer | Proposed for review |
| Independent review trigger | Bắt buộc với P0/P1, risk HIGH/CRITICAL, auth/payment/trust boundary/public contract/schema/migration/seed, hoặc thay đổi quyền/gate/risk policy. Reviewer khác plan author/implementer và ở REVIEW read-only; nếu không có reviewer đủ điều kiện thì giữ blocked/pending review. Approval vẫn do Developer hoặc reviewer được ủy quyền riêng. | Developer / delegated reviewer | Proposed for review |
| Scope-change rework | Giữ diff/checkpoint; change request liệt kê AC/contracts/risk bị ảnh hưởng; chỉ phần approval/evidence liên quan revision cũ bị revoke; cập nhật plan và xin duyệt delta trước phần execution phụ thuộc; verify lại AC bị ảnh hưởng và invariant liên quan | Developer / delegated reviewer | Proposed for review |
| Đóng task / metadata | `closed_at` ghi thời điểm đạt completed/cancelled/superseded; `merged_at` riêng khi có merge. Chốt status, AC evidence và handoff trước commit; commit task metadata cùng nội dung khi có thể. Nếu evidence chứa SHA hậu-commit, ghi trong handoff/chat sau commit và không tạo metadata commit bắt buộc thứ hai. | Developer / delegated reviewer | Proposed for review |

### Transition model đề xuất

| Execution status | Chuyển tiếp hợp lệ | Actor / điều kiện | Giữ diff và evidence |
| :--- | :--- | :--- | :--- |
| `not_started` | `in_progress`, `cancelled`, `superseded` | `in_progress` chỉ khi approval là `approved` cho revision hiện hành; cancel/supersede do Developer hoặc owner được ủy quyền | Luôn giữ plan, branch/diff và approval record |
| `in_progress` | `blocked`, `pending_verification`, `failed`, `cancelled`, `superseded` | Owner ghi blocker/reason; pending verification khi thay đổi xong; failed khi execution/check thất bại; cancel/supersede cần quyết định có thẩm quyền | Không discard diff; lưu checks, logs/revision, blocker và next action |
| `blocked` | `in_progress`, `cancelled`, `superseded` | Owner ghi blocker đã gỡ; chỉ resume nếu scope/revision vẫn được approval bao phủ; nếu không, chạy scope-change rework trước | Giữ diff/checkpoint cũ và thêm trạng thái mới |
| `pending_verification` | `in_progress`, `blocked`, `completed`, `failed`, `cancelled`, `superseded` | Verification fail/need fix -> in progress; thiếu môi trường -> blocked; completed chỉ khi DoD, required gates, commit và handoff xong | Ghi từng check/result/revision; NOT_RUN/SKIPPED không tính PASS |
| `failed` | `in_progress`, `cancelled`, `superseded` | Resume sau recovery plan; reapproval chỉ nếu scope/risk/contracts thay đổi; cancel/supersede do authority | Giữ nguyên diff và failure evidence; không tự reset/stash |
| `cancelled`, `completed`, `superseded` | Không có transition ngược | Terminal. Mở lại bằng task mới; completed chỉ re-open qua task mới hoặc approved rework riêng | Giữ artifacts; task superseding trỏ task cũ |

Approval record transitions riêng: `pending → approved` khi Developer/delegated reviewer approve đúng revision; `approved → revoked` khi policy-required scope-change review xác định revision không còn bao phủ phần thay đổi. Completed execution không xóa/rewrite approval record.

- Plan revision được duyệt: Chưa có.
- Approval evidence: Chưa có.

## 6. Execution Checkpoint / Handoff

- Đã làm / checks đã chạy / findings còn mở: Evidence và owner ghi trong `findings-and-traceability.md`; chưa sửa policy. `npm.cmd test` và fitness là gate bắt buộc tại execution, hiện NOT_RUN.
- Branch / revision / staged scope / conditional commit: `task/docs-policy-alignment`; chưa có commit/staged changes.
- DoD / bước tiếp theo / authority: Chờ Task 1 và re-review các proposed decisions; sau đó thực thi/kiểm tra transitions, fix/feature templates và quyền.
