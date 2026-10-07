---
task_id: task-1
approval_status: approved
approved_by: Developer
approved_at: "2026-10-07T13:10:10+07:00"
approved_revision: e1aceac80d8b81d5618a201dd5a9e6bbb7cd6f0f
execution_status: completed
closed_at: "2026-10-07T13:31:50+07:00"
merged_at: null
critical_flow: P0
risk_level: CRITICAL
spec_impact: NONE
depends_on: []
created_by: Codex
owner: "Codex (current execution)"
write_scope:
  - docs/task-authoring/README.md
  - docs/operations/agent-workflow.md
  - docs/operations/handoff-contract.md
  - docs/operations/task-lifecycle.md
  - docs/tasks/README.md
  - docs/templates/task-feat.md
  - docs/templates/task-fix.md
  - docs/templates/handoff.md
  - docs/tasks/task-sizing-handoff/task-1-feat.md
branch: "task/task-sizing-handoff"
worktree: "shared checkout; execute sequentially"
---

# Task 1: Làm rõ task sizing, điều phối và checkpoint

## 1. Nguồn Nghiệm Thu

- Yêu cầu gốc / batch prompt: [Prompt điều tra](prompt-dieu-tra-task-sizing-handoff.md).
- Intent / user flow / expected: Một operator có thể chia, giao và resume task mà không cần ký ức hội thoại trước.
- Spec active / Context Package: Không có functional spec runtime liên quan; Docs Policy package đã được nạp. Đây là policy docs ảnh hưởng governance P0.

| AC | Hành vi quan sát được theo acceptance source | Check bảo vệ ý định |
| :--- | :--- | :--- |
| AC-1 | Agent mới xác định được task cần tách/gộp và context cần thiết từ docs, với ví dụ cụ thể. | STATIC_CHECK |
| AC-2 | Request record chỉ ra owner, write scope/worktree, dependency readiness và checkpoint hiện hành, tránh đụng checkout/tài nguyên dùng chung. | STATIC_CHECK |
| AC-3 | Session mới tìm được trạng thái hiện hành, bước tiếp theo và authority; finding mơ hồ/ngoài scope được ghi hoặc escalate đúng nơi. | STATIC_CHECK |
| AC-4 | Một operator có thể dùng quy trình mà không phải tạo handoff cho mỗi bước nhỏ hoặc lặp cùng dữ liệu giữa plan, evidence và handoff. | STATIC_CHECK |

## 2. Điều Tra Và Thiết Kế

- Baseline: Branch `task/task-sizing-handoff`, HEAD `618cd55dcef242ae44a08c33a867f38a89ede64c` trước khi tạo task artifacts; thư mục `docs/tasks/task-sizing-handoff/` hiện là untracked task input cần bảo toàn.
- Hiện trạng: `docs/task-authoring/README.md` quy định chia theo outcome nhưng không định nghĩa task/session sizing hay gộp task; `docs/operations/agent-workflow.md` có cold-start, dependency và worktree; `docs/operations/handoff-contract.md` có nội dung checkpoint; `docs/tasks/README.md` là request index.
- Callers / dependencies / exports / contracts: AGENTS §0–§8; Task Lifecycle; task feature template; handoff template; Context Assembly; validator dependency contract là đầu ra task này cho Task 2.
- Thiết kế tối thiểu:
  - Một task là một kết quả quan sát được có thể nghiệm thu. Tách khi mỗi phần có AC và bằng chứng nghiệm thu độc lập, có thể chạy tuần tự qua contract rõ ràng; gộp khi nhiều thay đổi cùng tạo một kết quả và không có trạng thái trung gian an toàn để nghiệm thu. Task có thể qua nhiều session; session kết thúc tại checkpoint có ý nghĩa như khi bị ngắt, chờ quyết định hoặc bàn giao, không tạo handoff cho từng bước nhỏ.
  - `task_id` có dạng `task-N` và chỉ cần duy nhất trong thư mục của một request; `depends_on` chỉ tham chiếu ID trong cùng thư mục. Mỗi task record ghi owner chịu trách nhiệm, write scope (đường dẫn/tài nguyên được phép sửa), branch và worktree; khi chạy song song phải dùng worktree riêng và write scope không xung đột. Nếu dùng chung checkout/tài nguyên thì chạy tuần tự.
  - Một dependency chỉ sẵn sàng khi task tiền đề có approval còn bao phủ revision/contract được tiêu thụ, execution đã `completed`, và evidence/output được link rõ tới revision đó. `completed` tự nó không chứng minh contract sẵn sàng. Dependency thiếu, chu trình, approval lệch revision hoặc evidence/output thiếu đều chặn việc bắt đầu task phụ thuộc.
  - Task record là nguồn canonical cho approval/execution metadata và checkpoint hiện hành: §6 ghi HEAD/diff, việc đã làm, evidence/findings, blocker và next action/authority. Request index chỉ link tới task record/dependencies, không sao chép status/checkpoint. Handoff session ngắn link tới task record và chỉ bổ sung evidence/finding mới chưa có ở đó.
  - Ví dụ quy trình giả lập OAuth: một task cỡ vừa có thể nghiệm thu tài liệu luồng redirect → callback → success/error cùng checklist resume trong một kết quả. Chỉ tách thành task contract/provider và task callback/error khi từng kết quả có thể nghiệm thu riêng; nếu task sau cần contract trước thì ghi dependency, không chạy song song. Ví dụ mô tả quy trình, không khẳng định repo có OAuth runtime.
  - Chỉnh owners hiện hành và templates trực tiếp; không tạo scheduler/manifest mới.
- Critical flow / risk: P0 / CRITICAL do quy trình kiểm soát auth/security approval và review; independent review cần thiết.
- Spec Impact: NONE; không đổi behavior nghiệp vụ.

## 3. Scope Và Kế Hoạch

- In scope: `docs/task-authoring/README.md`, `docs/operations/agent-workflow.md`, `docs/operations/handoff-contract.md`, `docs/operations/task-lifecycle.md`, `docs/tasks/README.md`, `docs/templates/task-feat.md`, `docs/templates/task-fix.md`, `docs/templates/handoff.md` và links/summaries trực tiếp bị ảnh hưởng.
- Out of scope: Validator code (Task 2), AGENTS authority/gates, runtime, ADR, migration hay functional specs.
- Spec synchronization: Không áp dụng; không đổi business behavior.
- Implementation: Cập nhật đúng owner cho sizing tại Task Authoring, cold-start/resume và resource coordination tại Agent Workflow, checkpoint lifecycle tại Task Lifecycle, độ dài handoff tại Handoff Contract, request links tại Tasks README và metadata/checkpoint fields tại templates. Bảo đảm mỗi policy chỉ có một owner, summaries chỉ link; thêm ví dụ OAuth giả lập theo thiết kế §2.
- Compatibility / rollout / recovery: Chỉ docs/templates. Giữ tương thích records hiện có; không bắt buộc migrate lịch sử. Rollback bằng revert thay đổi task commit theo authority Git hiện hành.
- ADR / memory: N/A; không có trade-off kiến trúc nền tảng hay bài học mới đã xác minh.
- Dependencies: Task 2 tiêu thụ metadata/checkpoint/dependency contract do Task 1 xác định; không thực thi Task 2 trước khi contract được duyệt.

## 4. Verification Matrix

| AC / invariant | Kịch bản và lý do | Lệnh thực tế / manual procedure | Result / Kết quả | Evidence / revision |
| :--- | :--- | :--- | :--- | :--- |
| AC-1 | Operator mới gặp một outcome có hai phần tách được và một outcome không có trạng thái trung gian an toàn; áp dụng sizing rules và ví dụ để chọn tách/gộp, rồi phân biệt task kéo dài nhiều session với handoff cho bước nhỏ. PASS khi hai trường hợp cho ra quyết định nhất quán và có lý do dựa trên AC/khả năng nghiệm thu độc lập. | Static review Task Authoring và OAuth example | PASS | Manual review tại working tree trên branch `task/task-sizing-handoff`; task plan `approved_revision` `e1aceac80d8b81d5618a201dd5a9e6bbb7cd6f0f` |
| AC-2 | Hai task cùng request chạy tuần tự; hai task không xung đột chạy song song; hai task có cùng checkout/write scope thì không chạy đồng thời. Kiểm tra ID, owner, write scope/worktree, `depends_on`, và điều kiện readiness gồm approval/revision + completed + linked output evidence. PASS khi record mẫu biểu diễn đủ thông tin và mọi xung đột/thiếu dependency đều chặn chạy song song/tiếp tục. | Static review workflow, lifecycle, templates; `npm.cmd run validate:tasks` | PASS | Static review PASS; `npm.cmd run validate:tasks` Exit 0, checked 7 records; branch `task/task-sizing-handoff` |
| AC-3 | Resume từ task record có diff mới, blocker và finding ngoài scope; đối chiếu frontmatter, approval revision và §6 checkpoint. PASS khi operator tìm được một trạng thái canonical, next action/authority; approval/revision mismatch dừng việc phụ thuộc và finding được ghi/escalate đúng owner. | Cold-start walkthrough từ request index qua task record và handoff | PASS | Workflow §2.5–8, task lifecycle §6/dependency readiness, task record §6; static walkthrough PASS trên working tree |
| AC-4 | So sánh task record và handoff cho một session nhỏ. PASS khi handoff chỉ link trạng thái/evidence đã ghi, bổ sung finding/evidence mới, không yêu cầu handoff cho từng bước nhỏ và không lặp approval/AC/status đã có. | Static consistency review Tasks README, Handoff Contract và template | PASS | Static consistency review PASS trên working tree; Handoff Contract và template link task/checkpoint, chỉ ghi evidence/findings mới |
| Docs/policy gates | Kiểm tra toàn bộ owner/direct summaries, links, anchors, authority/gate language và tình huống trust boundary; profile xác nhận repo không có ứng dụng runtime OAuth. Runtime full-flow checks N/A vì task chỉ sửa policy docs/templates và ví dụ OAuth được ghi rõ là giả lập. | `npm.cmd run validate:docs`; `npm.cmd run validate:tasks`; `npm.cmd test`; `npm.cmd run test:fitness`; manual policy review | PASS | Validators Exit 0 (77 Markdown files, 7 task records); tests Exit 0 (9/9 architecture, 6/6 quality); fitness Exit 0, reference mode / 0 source files; self-review PASS; Developer independent implementation review PASS trong chat `2026-10-07T13:26:27+07:00`, không có findings; post-commit checks PASS trên `f9f7c3a660e5000c5107f5161b422fecc8b9048d` |

## 5. Open Issues Và Approval

| Vấn đề / assumption | Bằng chứng / phương án | Người có quyền quyết định | Quyết định |
| :--- | :--- | :--- | :--- |
| Có cần tạo file checkpoint riêng không? | Không; task record hiện hành là nguồn canonical. Request index và handoff trỏ tới task record; §6 giữ next action/evidence/blocker, không lặp approval/AC. | Đã quyết định trong plan; không cần thêm file/manifest. | Resolved |
| Namespace ID và điều kiện dependency-ready | ID duy nhất trong request folder; dependency chỉ trỏ cùng folder. Ready cần approval bao phủ revision/contract, `execution_status: completed`, và output/evidence được link tới revision; status đơn lẻ không đủ. | Đã quyết định trong plan; Task 2 dùng contract này khi được duyệt. | Resolved |
| Owner, write scope và chạy song song | Owner chịu trách nhiệm, write scope tường minh; worktree riêng và scope không xung đột khi chạy song song, nếu dùng chung checkout/tài nguyên thì tuần tự. | Đã quyết định trong plan. | Resolved |

- Plan revision được duyệt (`approved_revision`): `e1aceac80d8b81d5618a201dd5a9e6bbb7cd6f0f` (`git hash-object docs/tasks/task-sizing-handoff/task-1-feat.md`, nội dung plan trước khi ghi metadata execution).
- Independent review / approval evidence: Developer xác nhận đã review và chấp thuận trong chat ngày `2026-10-07T13:10:10+07:00`; reviewer độc lập với plan author (Codex) và implementer của execution này. Approval bao phủ revision hash nêu trên.
- Rework R01–R04: R01 approval/header mâu thuẫn -> ghi Developer/revision/time từ chat approval; R02 contract dependency/ownership/checkpoint -> quy định tại §2–§3 và các owner docs; R03 test oracle -> scenario/pass-fail tại §4; R04 baseline -> SHA và task input ghi tại §2. Plan review/approval và independent review implementation/evidence đều PASS.

## 6. Execution Checkpoint / Handoff

- Đã làm / checks đã chạy / findings còn mở: Đã cập nhật Task Authoring, Agent Workflow, Task Lifecycle, Handoff Contract, Tasks index, task templates và handoff template; AC-1–AC-4/manual consistency self-review PASS. Developer independent review implementation/evidence PASS trong chat `2026-10-07T13:26:27+07:00`, không có findings. Implementation commit `f9f7c3a660e5000c5107f5161b422fecc8b9048d` trên baseline `618cd55dcef242ae44a08c33a867f38a89ede64c`; docs/templates diff fingerprint `3a35961a01c33944df1c0812774ffab3a8388119`. Pre-commit và post-commit: `npm.cmd run validate:docs` Exit 0 (77 files); `npm.cmd run validate:tasks` Exit 0 (7 records); `npm.cmd test` Exit 0 (9/9 architecture, 6/6 quality); `npm.cmd run test:fitness` Exit 0 (reference mode, 0 source files; không chứng minh runtime architecture). `git diff --check` PASS. Không có dependency đầu vào (`depends_on: []`).
- Branch / revision / staged scope / conditional commit: Branch `task/task-sizing-handoff`; implementation commit `f9f7c3a660e5000c5107f5161b422fecc8b9048d` trên baseline `618cd55dcef242ae44a08c33a867f38a89ede64c`; close commit chỉ cập nhật lifecycle metadata. Prompt và Task 2 vẫn là untracked baseline inputs, không thuộc commit Task 1.
- DoD / bước tiếp theo / authority: Standard DoD hoàn tất; `execution_status: completed`, `closed_at: 2026-10-07T13:31:50+07:00`, `merged_at: null`. Không còn task action; merge/deploy vẫn theo authority riêng.
