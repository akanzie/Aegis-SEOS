# Context Package: Docs Policy

- Status: Verified paths for this Markdown operating-contract repository; recheck revision before use.
- Scope: AGENTS, workflow, governance, routing, templates và direct summaries.
- Phases: INVESTIGATE, EXECUTE, REVIEW; quyền/gate policy có blast radius P0/CRITICAL, Standard.
- Target Token Budget: <=15,000 tokens cho package; session bands/overflow theo [AGENTS §8](../../AGENTS.md#context-budget).

## Must Load

- `AGENTS.md` (đã luôn nạp; không đọc lại cùng revision).
- Current task plan/request và evidence/dependency artifacts đã xác nhận.
- `docs/operations/agent-workflow.md`, mode và cold-start/resume.
- `docs/operations/project-profile.md`, commands/gates/capability liên quan.
- Owner/direct summaries của policy đang sửa; chọn qua AGENTS §10, không nạp tất cả docs.

## Optional — theo trigger

| Trigger | Nạp |
| :--- | :--- |
| EXECUTE policy / verify evidence | `docs/standards/verification.md`, policy docs/risk/evidence; `docs/operations/definition-of-done.md`, Standard profile |
| Approval/status/close thay đổi | `docs/operations/task-lifecycle.md` |
| P0/P1 hoặc quyền/gate/risk | `docs/operations/review-rework.md`, independent review; required trigger, không tùy ý bỏ |
| Context/token/cache/routing thay đổi | `docs/governance/context-assembly.md`; catalog/package/template bị ảnh hưởng |
| Architecture policy thay đổi | Rules ở `docs/fitness-functions/architecture-rules.md` và validator contracts liên quan |
| Review PR/MR | `docs/operations/merge-review.md`; `docs/templates/review.md` nếu tạo artifact |
| Retention/archive | `docs/governance/knowledge-lifecycle.md` |

Optional nghĩa là nạp khi trigger áp dụng, không miễn owner/check bắt buộc. Trace thêm callers/contracts khi evidence mở blast radius.

## Do Not Load

Auth reference package/module nghiệp vụ không liên quan; tasks ngoài scope; toàn templates/onboarding/memory để dự phòng; `docs/archive/**` trừ yêu cầu lịch sử cụ thể.

## Key invariants

Giữ safety, hierarchy, approval authority, gate applicability và reviewer independence. Policy owner duy nhất; summaries không tạo quyền/gate mới. Thiếu validator/reviewer bắt buộc là blocker; không hạ risk vì Markdown.
