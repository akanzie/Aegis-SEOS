# Bộ Template Vận Hành SEOS

Copy mẫu tới vị trí đích, thay các placeholder `[ ... ]` bằng thông tin đã xác minh và bỏ mục tùy chọn không áp dụng. Đường dẫn trong nội dung điền theo repository root; khi copy, điều chỉnh Markdown links nếu có. Không biến ví dụ thành facts hoặc ghi PASS khi chưa có bằng chứng.

Templates hỗ trợ quy trình; nguồn quy định vẫn là `AGENTS.md` và các tài liệu được liên kết bên dưới. Việc copy mẫu không cấp quyền approve, execute, push, merge hoặc deploy.

| Mẫu | Vị trí đích | Quy trình |
| :--- | :--- | :--- |
| [Batch prompt](batch-prompt.md) | `docs/tasks/<request>/prompt-dieu-tra-<request>.md` | COMPOSE |
| [Task fix](task-fix.md) | `docs/tasks/<request>/task-N-fix.md` | INVESTIGATE -> approval -> EXECUTE |
| [Task feature](task-feat.md) | `docs/tasks/<request>/task-N-feat.md` | INVESTIGATE -> approval -> EXECUTE |
| [Project profile](project-profile.md) | `docs/operations/project-profile.md` | Bootstrap / adoption |
| [Review](review.md) | `docs/tasks/<request>/review-<revision>.md` | REVIEW, gồm Merge Review Gate khi áp dụng |
| [Rework](rework.md) | `docs/tasks/<request>/rework-<revision>.md` | REWORK trong quyền phase gốc |
| [Handoff](handoff.md) | `docs/tasks/<request>/handoff-<revision>.md` | Checkpoint / bàn giao |
| [ADR](adr.md) | `docs/decisions/ADR-XXXX-<slug>.md` | Quyết định kiến trúc, chờ owner duyệt |
| [Functional spec](functional-spec.md) | `docs/main_docs/<ACTIVE_VERSION>/fn/<module>.md` sau approval | Đề xuất WHAT; bản chưa duyệt lưu tại `docs/tasks/<request>/` |
| [Context Package](../context-packages/template.md) | `docs/context-packages/<domain>-context.md` | Nạp context đúng phạm vi |
| [Incident](../engineering-incidents/incident-template.md) | `docs/engineering-incidents/YYYY-MM-DD-<title>.md` | Ghi nhận sự cố |

- [Task Authoring](../task-authoring/README.md), [Agent Workflow](../operations/agent-workflow.md).
- [Verification](../standards/verification.md), [Handoff Contract](../operations/handoff-contract.md).
- [Merge Review Gate](../operations/preflight-checklist.md#merge-review-gate), [ADR](../decisions/README.md).

Task plans khởi tạo với `approval_status: pending`, `execution_status: not_started`; approval có issuer/time/revision và tách khỏi execution. Chỉ chuyển completed sau DoD và lifecycle close sequence. Template chứa placeholder không phải task active hoặc functional spec canonical. Chi tiết transitions tại [Agent Workflow](../operations/agent-workflow.md).
