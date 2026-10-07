# Execution Evidence: Context Cache Optimization

Baseline `f946c78f4692731b8ecf75644c9158cd1cf15e12` + task diff trên branch `task/context-cache-optimization`. Approval ở [Task 1](task-1-fix.md); [token estimates](token-estimates.md) ghi công thức và giới hạn. Chưa commit; chờ independent review và Git close sequence.

## AC evidence

| AC | Result | Evidence |
| :--- | :--- | :--- |
| AC-1 | PASS | AGENTS giảm ~52.7%; manual trace §0–9 và table-preservation checks; gate applicability vẫn canonical và nguyên văn |
| AC-2 | PASS | Tách lifecycle/review/DoD/merge/human/bootstrap; anchor cũ giữ; relative links/anchors không lỗi; historical tracked task records không có Git diff, normalized contents khớp baseline |
| AC-3 | PASS | README/checklist dùng owner links; active direct summaries/template metadata dùng hai trục approval/execution; legacy shorthand chỉ ở compatibility/historical records |
| AC-4 | PASS | Catalog có docs-policy/validator verified paths/commands và trigger/sections; Auth reference không đổi; manifest/validator paths thực tồn tại |
| AC-5 | PASS | Context Assembly có order/update/measurement/client limits; survey metadata cuối profile; cache hit/cost ghi UNVERIFIED |
| AC-6 | PENDING | Local checks và independent review PASS; còn Git close sequence bên dưới |

## Automated và manual checks

| Check | Result | Evidence |
| :--- | :--- | :--- |
| Docs links/anchors/encoding | PASS | One-off Python verifier Exit 0: 263 local Markdown links, 0 missing destination/anchor, 0 baseline link issues; scope docs ngoài archive; đọc prose ngoài code fences |
| Required policy tables | PASS | So baseline nguyên văn: gate applicability, mode permissions, execution transitions, independent review triggers, 10 merge questions; DoD obligations giữ sau đổi owner links |
| Historical task records | PASS | `git diff --name-only f946c78 -- docs/tasks/docs-policy-alignment` không có tracked changes; chỉ thêm request README; không khẳng định raw Git blob = CRLF checkout bytes |
| Diff format | PASS | `git diff --cached --check`, Exit 0; bỏ legacy two-space hard break trong bootstrap mới; independent reviewer follow-up xác minh delta format và PASS vẫn áp dụng |
| Automated tests | PASS | `npm.cmd test`, Exit 0, 6/6 architecture-validator suites. Fail-loud fixture diagnostics trong output là expected negative cases; suite tổng PASS |
| Architecture fitness | PASS | `npm.cmd run test:fitness`, Exit 0 sau tests; 0 violations/0 configured source files. Gate có thực thi; không dùng kết quả này chứng minh runtime app/security invariants chưa tồn tại |
| Independent implementation review | PASS | `/root/independent_docs_review` review baseline + current diff, không tham gia author/implementation; [review record](review.md), R-CACHE-01 resolved, không blocker |
| Runtime integration/manual business flow | N/A | Docs-only; profile chưa có business runtime/src; manual policy/links review có áp dụng |
| Required remote CI | UNVERIFIED | Profile chưa xác minh CI/branch protection. Không có required remote gate được xác định cho local task; không suy merge eligibility hoặc nhận local = remote PASS |
| Cache hit/cost | UNVERIFIED | Không request telemetry/API client; file size và cache cost khác nhau |

## Policy scenarios (manual trace)

| Scenario | Expected và observed contract | Result |
| :--- | :--- | :--- |
| Standard sửa policy P0 | Standard approval và fitness Exit 0 bắt buộc; independent decision/implementation review, không Fast Track | PASS |
| Fast Track docs-only không P0/P1/boundary | Format/links/consistency; runtime/fitness N/A chỉ với lý do hợp lệ theo §5.D | PASS |
| CSS/source Fast Track | Required fitness không bị DoD hoặc checklist miễn | PASS |
| Thiếu validator/environment/reviewer bắt buộc | BLOCKED/pending, không N/A hoặc completed | PASS |
| Completed/legacy status: approved | Approval không suy từ status; issuer/time/revision/scope/evidence phải khớp | PASS |
| PR review hoặc đổi source/target SHA | Đủ 10 câu và re-review phần ảnh hưởng; review không cấp quyền merge/push/deploy | PASS |
| Cache optimization | Không hạ message role, bỏ safety/gates, trì hoãn spec hoặc giữ policy lỗi để giữ cache | PASS |

## Review và recovery

Reviewer finding R-CACHE-01 (LOW): merge owner còn nói “checklists bên dưới” sau khi tách file. Đã sửa hai vị trí thành linked Preflight checks khi áp dụng; reviewer đã xác minh RESOLVED và kết luận PASS, không blocker. Substantive docs fingerprint ở review record; thay đổi sau review chỉ bổ sung result/Git close metadata.

Pitfall mới: PowerShell pipe có thể làm mất Unicode trong source; ba file đã sửa bằng script UTF-8 và encoding checks PASS. Lesson ghi ở known-pitfalls §5. Các incidental formatting changes ngoài scope đã hoàn nguyên về baseline checkout; không stage scratch scripts/metrics.

## Handoff / close sequence

Execution `pending_verification`, chưa completed. Next: task-only staged diff, conditional local commit và post-commit clean tree; sau commit ghi terminal metadata/handoff trong metadata commit theo close sequence. Chưa có push/merge/deploy authorization; không tạo PR hoặc kết luận merge-ready. Recovery không tác động DB/runtime; Developer có thể revert task commit qua Git action được cấp quyền.
