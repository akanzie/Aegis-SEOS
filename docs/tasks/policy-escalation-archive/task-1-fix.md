---
task_id: task-1
approval_status: approved
approved_by: Developer
approved_at: 2026-10-07T14:33:38+07:00
approved_revision: r1 (decision content; independent review snapshot SHA-256 8A9B6EA12B39133690B3F3CC002C5E796EAA1DE9D927D4BE0A406BBDC44C8A59)
execution_status: completed
closed_at: 2026-10-07T14:48:21+07:00
merged_at: null
critical_flow: P0
risk_level: CRITICAL
spec_impact: NONE
depends_on: []
created_by: Codex
owner: Developer / assigned implementer
write_scope:
  - AGENTS.md
  - docs/governance/knowledge-lifecycle.md
  - docs/context-packages/docs-policy-context.md
  - docs/tasks/policy-escalation-archive/task-1-fix.md
branch: task/policy-archive-escalation
worktree: shared checkout; execute sequentially
---

# Task 1: Làm rõ escalation nghiệp vụ và bảo toàn task decisions khi archive

## 1. Nguồn nghiệm thu

- Yêu cầu gốc: Developer yêu cầu sửa các vấn đề được xác nhận trong review cold-start/red-team.
- Acceptance source: `AGENTS.md` §§0–1, §4; `docs/governance/knowledge-lifecycle.md` §§2.A, 3; `docs/operations/review-rework.md` phần Independent review.
- Spec active: `docs/main_docs/ACTIVE_VERSION.md` khai báo v1.0/Initializing; task chỉ thay đổi operating policy, không đổi business behavior.

| AC | Hành vi quan sát được theo acceptance source | Check bảo vệ ý định |
| :--- | :--- | :--- |
| AC-1 | AGENTS §4 nêu rõ một câu hỏi nghiệp vụ trọng yếu chưa được xác nhận cũng yêu cầu dừng phần thực thi phụ thuộc và hỏi authority; không còn ngưỡng số lượng diễn giải có thể bị hiểu là cho phép tự quyết. | Static review nhất quán với AGENTS §1 và `agent-workflow.md` §2; kiểm tra liên kết/anchor. |
| AC-2 | Trước khi archive request, mọi approved task decision còn hiệu lực đã được đưa vào owner doc đang hoạt động với liên kết truy vết tới task/revision; nếu chưa chuyển được hoặc chưa xác định được trạng thái hiệu lực thì giữ request ở vị trí hoạt động. Không để quyết định còn hiệu lực chỉ tồn tại trong `docs/archive/**`. | Manual scenario: task đã completed, approval còn hiệu lực, request đủ hạn; xác nhận archive bị chặn đến khi decision được chuyển hoặc supersede. Kiểm tra liên kết/anchor. |
| AC-3 | Docs-policy context package dẫn agent tới quy tắc archive decision hiện hành; package không tạo authority mới hoặc làm yếu lệnh cấm nạp archive. | Review owner/package consistency và Markdown links. |

## 2. Điều tra và bằng chứng

- Baseline: branch `task/policy-archive-escalation`, HEAD `ff9f987777ced730c95bd39823dca93fe2721493`; worktree sạch trước khi tạo task plan.
- Finding 1: `AGENTS.md` §1 yêu cầu hỏi khi mơ hồ nghiệp vụ; §4 dùng điều kiện `>=2 diễn giải nghiệp vụ chưa rõ`, có thể khiến agent hiểu sai rằng chỉ một cách hiểu chưa được xác nhận không cần escalation.
- Finding 2: AGENTS §0 giữ approved task decisions độc lập với execution status; Knowledge Lifecycle cho phép archive request sau 6 tháng và cấm tự nạp archive. Quy trình archive hiện chưa yêu cầu chuyển quyết định còn hiệu lực sang owner docs hoặc giữ request hoạt động.
- Blast radius: policy về authority và quy trình archive; P0 / CRITICAL theo AGENTS §5.D, §7 và docs-policy package.
- Root cause: trigger escalation có ngưỡng số lượng không cần thiết; archive workflow không kiểm tra trạng thái hiệu lực của approved decisions trước khi di chuyển records.

## 3. Thay đổi tối thiểu

- In scope: sửa trigger escalation tại `AGENTS.md` §4; thêm bước kiểm tra và xử lý task decisions còn hiệu lực trong archive workflow tại `docs/governance/knowledge-lifecycle.md`; đồng bộ direct summary trong `docs/context-packages/docs-policy-context.md`.
- Quy tắc archive dự kiến: trước khi archive, chuyển quyết định còn hiệu lực vào owner doc phù hợp và liên kết ngược tới task/revision; nếu không thể xác định hoặc chuyển an toàn, giữ request hoạt động. Không thay đổi thời hạn retention hoặc quyền truy cập archive.
- Out of scope: business specs, runtime code, thay đổi retention duration, migration metadata cũ, thay đổi authority/approval model.
- Không có ADR dự kiến; task làm rõ áp dụng policy hiện hành, không đề xuất thay kiến trúc.

### Nội dung đề xuất để duyệt — plan revision r1

- Escalation: thay riêng điều kiện `>=2 diễn giải nghiệp vụ chưa rõ` tại AGENTS §4 bằng `câu hỏi nghiệp vụ trọng yếu chưa được xác nhận, kể cả khi chỉ có một cách hiểu đang được giả định`. Giữ nguyên yêu cầu dừng phần thực thi phụ thuộc và quyền tiếp tục khảo sát độc lập an toàn; quyết định kỹ thuật cục bộ ít rủi ro vẫn theo §1.
- Archive: sau kiểm tra thời hạn của toàn request, rà từng approved task decision và evidence approval/revision theo [Task Lifecycle](../../operations/task-lifecycle.md). `completed`, `cancelled` hoặc `superseded` của execution không tự chứng minh decision hết hiệu lực.
- Decision còn hiệu lực phải được thể hiện đầy đủ trong owner doc đang hoạt động trước khi di chuyển task records. Nếu owner đã chứa đúng decision thì xác minh và bổ sung traceability, không tạo bản policy trùng lặp. Ghi nguồn task, approved revision và approval evidence; việc chuyển nội dung không cấp approval mới, đổi authority hoặc ghi đè owner/Accepted ADR trái hierarchy.
- Chỉ coi decision đã hết hiệu lực khi có evidence revoke hoặc thay thế được authority chấp thuận đúng scope/revision. Không tự supersede để đạt điều kiện archive. Chưa rõ hiệu lực, chưa xác định owner hoặc không chuyển an toàn được thì giữ toàn bộ request hoạt động và hỏi authority.
- Khi archive đủ điều kiện, giữ request README tại chỗ và cập nhật các liên kết nguồn/evidence ở README lẫn owner docs tới vị trí mới. Liên kết tới archive chỉ phục vụ truy vết; không cho phép agent tự nạp archive. Nội dung decision cần cho công việc hiện tại phải đọc được từ owner doc hoạt động.
- Docs-policy package chỉ thêm direct summary và link tới Knowledge Lifecycle §§2.A, 3; không tạo owner hoặc ngoại lệ archive mới. Giữ nguyên retention 6 tháng và write scope đã nêu.

## 4. Verification matrix

| AC / invariant | Kịch bản và lý do | Lệnh thực tế / manual procedure | Kết quả | Bằng chứng / revision |
| :--- | :--- | :--- | :--- | :--- |
| AC-1 | Một câu hỏi nghiệp vụ trọng yếu chưa xác nhận phải dừng phần phụ thuộc; khảo sát độc lập an toàn và lựa chọn kỹ thuật cục bộ ít rủi ro vẫn được phép. | Manual review `AGENTS.md` §4 sau sửa và `docs/operations/agent-workflow.md` §2. | PASS | Static review trên HEAD `ff9f987777ced730c95bd39823dca93fe2721493` + diff; trigger một câu hỏi trọng yếu chưa xác nhận yêu cầu hỏi authority, đoạn cuối §4 giữ khảo sát độc lập an toàn. |
| AC-2 | Request đủ hạn, decision còn hiệu lực nhưng chưa chuyển: giữ toàn request; đã có đầy đủ trong owner và traceability: có thể archive nếu các điều kiện khác đạt; hiệu lực/owner chưa rõ: giữ request, hỏi authority; chỉ coi decision hết hiệu lực khi có authority evidence revoke/thay thế; một task chưa terminal/đủ hạn: giữ toàn request. Sau di chuyển, owner vẫn đọc được decision và links nguồn còn đúng, không cấp quyền đọc archive. | Manual scenario review Knowledge Lifecycle §2.A, §3 sau sửa; đối chiếu hierarchy và [Task Lifecycle](../../operations/task-lifecycle.md). | PASS | Static review trên HEAD `ff9f987777ced730c95bd39823dca93fe2721493` + diff: bước 2 giữ request theo retention; bước 3–5 giữ status/evidence và chặn trường hợp không rõ; bước 6–7 giữ owner/readability, request index và zero-archive. Rework IMPL-1 đã được reviewer độc lập xác nhận resolved. |
| AC-3 | Kiểm tra direct summary cùng links/anchors sau sửa. | `npm.cmd run validate:docs` | PASS | Exit 0; checked 78 Markdown files, all internal links/anchors resolve trên HEAD + implementation diff. |
| Standard gates | Chạy các suite/validators của project profile và architecture fitness bắt buộc. | `npm.cmd test`; `npm.cmd run validate:tasks`; `npm.cmd run validate:docs`; `npm.cmd run test:fitness` tuần tự theo profile. | PASS | 2026-10-07, Windows/Node, HEAD `ff9f987777ced730c95bd39823dca93fe2721493` + implementation diff: `npm.cmd test` Exit 0 (9/9 architecture + 13/13 quality suites); `validate:tasks` Exit 0 (8 records); `validate:docs` Exit 0 (78 files); `test:fitness` Exit 0, profile reference mode quét 0 source files, nên không tuyên bố đây là bằng chứng kiến trúc cho source code. |

## 5. Open issues và approval

| Vấn đề / assumption | Bằng chứng / phương án | Người có quyền quyết định | Quyết định |
| :--- | :--- | :--- | :--- |
| OI-1: Cơ chế bảo toàn decision khi archive. | Phương án cụ thể tại §3, revision r1: owner hoạt động chứa đầy đủ decision + traceability trước archive; chưa rõ hiệu lực hoặc chưa chuyển an toàn thì giữ cả request. Không thay authority, retention hoặc quyền nạp archive. | Developer | RESOLVED: Developer duyệt r1 trong chat ngày 2026-10-07 (“tôi approved hãy fix cho tôi luôn”). |
| OI-2: Reviewer độc lập cho plan/decision P0/CRITICAL. | Reviewer session riêng `/root/independent_plan_review`, REVIEW read-only; không tham gia soạn r1 hoặc implementation. Reviewed r1 tại HEAD `ff9f987777ced730c95bd39823dca93fe2721493`, snapshot SHA-256 `8A9B6EA12B39133690B3F3CC002C5E796EAA1DE9D927D4BE0A406BBDC44C8A59`; scope theo §§3–6 và acceptance sources. Kết luận: no findings, no blocker; không approve task. Lượt review implementation/evidence vẫn cần trước completed. | Developer cho phép session review; reviewer báo findings; Developer duyệt task | RESOLVED cho plan: reviewer độc lập hoàn tất, không findings/blocker; approval vẫn do Developer. |

- Plan revision được duyệt: r1, đúng decision content được reviewer đọc; approval chat của Developer ngày 2026-10-07 và independent review snapshot được ghi ở trên.
- Execution bắt đầu sau approval và review plan; implementer chỉ ghi nhận approval nhận được. Reviewer không phê duyệt task.

## 6. Checkpoint / handoff

- Phase: EXECUTE / hoàn tất implementation, verification, independent review, commit và handoff.
- Branch / HEAD / baseline phiên này: `task/policy-archive-escalation` / `583f4b985fb31965c9482531438b201709b464e2`; task folder vốn untracked tại baseline. Developer đã duyệt commit; policy changes được ghi trong commit này, task record được lưu riêng theo approval.
- Đã làm: cập nhật escalation tại `AGENTS.md` §4; quy tắc archive tại Knowledge Lifecycle §2.A; direct summary trong Docs Policy package; hoàn tất AC manual review và lấy independent plan + implementation review.
- Independent plan review: `/root/independent_plan_review`, separate read-only session; no findings/no blocker trên r1; reviewer SHA snapshot và scope tại §5.
- Independent implementation review: `/root/independent_plan_review`, static read-only; finding `IMPL-1` MEDIUM tại Knowledge Lifecycle §2.A.5 đã rework và RESOLVED. Re-review xác nhận thiếu evidence revoke/thay thế nghĩa là xử lý decision là active, vẫn archive được khi owner doc đầy đủ và retention đạt; không có finding mới. Reviewer SHA-256 cho `knowledge-lifecycle.md`: `3B70B618BCB132F01A4E9AC5FEFFE853C41331F7A2978CDEE32B6E8D31961D43`. Review là static policy diff, không tuyên bố chạy tests.
- Self-review: scope 4 file, AC-1–3, P0/CRITICAL, spec impact NONE; kiểm tra không đổi authority/gates và không xóa/skip tests hoặc sửa validator.
- Checks plan trước EXECUTE: `npm.cmd run validate:tasks` PASS, Exit 0; `npm.cmd run validate:docs` PASS, Exit 0. Kết quả execution gates nằm trong verification matrix §4.
- Blocker còn mở: none.
- Next action / authority: none; task đã completed sau commit, required checks và independent review. Policy commit: `583f4b985fb31965c9482531438b201709b464e2`.
