# Quick Checklist

Checklist hỗ trợ evidence, không có authority riêng. Đọc owner theo trigger; N/A cần lý do, SKIPPED/NOT_RUN không phải PASS. [AGENTS](../../AGENTS.md) giữ quyền/Git/gate applicability.

| ID | Điều cần xác minh | Evidence | Owner |
| :--- | :--- | :--- | :--- |
| Q01 | Mode/track, scope và approval đúng revision | Request/approval; legacy status không đủ | [Workflow](agent-workflow.md), [Lifecycle](task-lifecycle.md) |
| Q02 | Blast radius, mức P0–P4 cao nhất; không Hard Stop ngoài approved scope | Callers/contracts, risk rationale | [Risk](critical-flows.md), AGENTS §3–4 |
| Q03 | Domain purity, client/server isolation, env schema | Rule checks + fitness | [Machine rules](../fitness-functions/architecture-rules.md) |
| Q04 | Server authority/scope; client params không cấp quyền | Query/identity trace theo loại dữ liệu | [Trust boundary](../fitness-functions/architecture-rules.md#rule-server-trust-boundary) |
| Q05 | Stateless singleton, idempotent seeds, Expand-and-Contract | Invariant/compatibility review trong scope | [Review rules](../fitness-functions/architecture-rules.md) |
| Q06 | Bounded/paginated queries, hot-path columns, N+1, logging không leak | Query/resource/log review | [Performance](../standards/performance.md), [Observability](../standards/observability.md) |
| Q07 | Spec Impact, AC, tests bảo vệ ý định | Spec/AC → check → result/revision | [Authoring](../task-authoring/README.md#spec-impact), [Verification](../standards/verification.md) |
| Q08 | Required gates PASS; thiếu validator/environment không dùng N/A | Commands/exit codes, local/CI revision | [AGENTS §5.D](../../AGENTS.md#quality-gate-applicability), [Profile](project-profile.md) |
| Q09 | Independent review/manual checks khi áp dụng | Reviewer/environment, scope/revision/results | [Review](review-rework.md#independent-review) |
| Q10 | DoD, baseline/index/branch, conditional commit/handoff | Staged diff/post-commit status/AC evidence | [DoD](definition-of-done.md), AGENTS §2.C, [Handoff](handoff-contract.md) |

PR/MR cần thêm đủ [10 câu Merge Review Gate](merge-review.md#merge-review-gate); checklist này không thay gate hoặc cấp quyền merge/deploy.
