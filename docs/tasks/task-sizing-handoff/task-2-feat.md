---
task_id: task-2
approval_status: approved
approved_by: Developer
approved_at: "2026-10-07T13:56:10+07:00"
approved_revision: 541cfcdc9603ad78ebe0afc06bba153699180dbe
execution_status: pending_verification
closed_at: null
merged_at: null
critical_flow: P0
risk_level: CRITICAL
spec_impact: NONE
depends_on: [task-1]
created_by: Codex
owner: "Codex (current execution)"
write_scope:
  - scripts/validators/validate-task-records.mjs
  - scripts/validators/quality-guardrails.test.mjs
  - docs/operations/project-profile.md
  - docs/tasks/task-sizing-handoff/task-2-feat.md
branch: "task/task-sizing-handoff"
worktree: "shared checkout; execute sequentially"
---

# Task 2: Validate task dependencies and handoff metadata

## 1. Nguồn Nghiệm Thu

- Yêu cầu gốc / batch prompt: [Prompt điều tra](prompt-dieu-tra-task-sizing-handoff.md).
- Intent / user flow / expected: Validator phát hiện task dependency thiếu/chu trình và yêu cầu handoff metadata tối thiểu theo contract đã duyệt.
- Spec active / Context Package: Không có functional spec runtime liên quan; Docs Policy package đã được nạp.

| AC | Hành vi quan sát được theo acceptance source | Check bảo vệ ý định |
| :--- | :--- | :--- |
| AC-1 | Mỗi dependency được phân giải trong đúng request folder; dependency thiếu được báo cùng file task và ID bị thiếu, kể cả khi ID đó có ở request folder khác. | AUTOMATED_TEST |
| AC-2 | Dependency graph phát hiện self-cycle và cycle nhiều task; ID trùng trong cùng request bị báo lỗi; DAG hợp lệ và cùng ID ở hai request folder khác nhau được chấp nhận. | AUTOMATED_TEST |
| AC-3 | Record hiện hành thiếu/sai owner, write_scope, branch, worktree hoặc trường checkpoint theo Task 1 bị báo lỗi có file/vị trí. Validator báo conflict cụ thể nếu branch frontmatter khác branch trong §6; `execution_status` terminal không khớp `closed_at`; hoặc `approval_status: approved` thiếu issuer/time/revision. Legacy chỉ được miễn kiểm tra metadata/checkpoint nếu đạt điều kiện grandfather ở §3; các kiểm tra cấu trúc khác vẫn áp dụng. | AUTOMATED_TEST |
| AC-4 | Tests dùng temp root riêng; sentinel config trong repo root còn nguyên sau cả fixture hợp lệ và fixture gây lỗi. | AUTOMATED_TEST |

## 2. Điều Tra Và Thiết Kế

- Baseline: Branch `task/task-sizing-handoff`, HEAD `618cd55dcef242ae44a08c33a867f38a89ede64c`; Task 2 plan trước rework có blob `ec822c9b13d55a58a337adf275d7c298677420bc`. Giữ nguyên diff docs/templates và task artifacts có trước trong working tree; không đưa chúng vào scope Task 2.
- Hiện trạng: `scripts/validators/validate-task-records.mjs` kiểm tra task AC/verification/completed evidence; hiện không parse/validate `depends_on` graph. Tests ở `scripts/validators/quality-guardrails.test.mjs` dùng temp root.
- Callers / dependencies / exports / contracts: `npm run validate:tasks`, `npm test`, task metadata contract từ Task 1 và `docs/operations/project-profile.md`.
- Thiết kế tối thiểu: Validator hỗ trợ subset YAML frontmatter đang dùng trong task records: mapping, scalar quoted/plain/null, inline sequence và block sequence; cú pháp malformed/không hỗ trợ phải fail-closed với file và vị trí. Không thêm runtime dependency nếu kiểm tra manifest/source xác nhận không có parser hiện có. Dependency graph dùng namespace mỗi request folder, phát hiện ID trùng/thiếu và chu trình. Metadata hiện hành yêu cầu owner, write_scope không rỗng, branch, worktree và checkpoint §6 có branch/HEAD/diff, việc đã làm, checks/revision, evidence/findings, blocker và next action/authority. Conflict oracle giới hạn ở: branch frontmatter khác branch ghi trong §6; status terminal (`completed`, `cancelled`, `superseded`) không khớp `closed_at` (terminal cần timestamp, nonterminal phải null); và `approval_status: approved` thiếu `approved_by`, `approved_at` hoặc `approved_revision`. Lỗi nêu file và key/section liên quan.
- Critical flow / risk: P0 / CRITICAL vì gate task có thể kiểm soát approval/dependency; review độc lập bắt buộc.
- Spec Impact: NONE; validator docs-only/runtime project chưa có ứng dụng.

## 3. Scope Và Kế Hoạch

- In scope: `scripts/validators/validate-task-records.mjs`, `scripts/validators/quality-guardrails.test.mjs`, profile/docs nếu command/limitation cần cập nhật. Không sửa task records lịch sử trong task này.
- Out of scope: Tự approve, tự sắp lịch, quyết định nghiệp vụ, thay task records lịch sử hàng loạt.
- Spec synchronization: Không áp dụng.
- Implementation: Sau independent review và approval của revision rework, kiểm tra dependency IDs trong đúng request folder, ID trùng và cycle; kiểm tra metadata owner/write_scope/branch/worktree, checkpoint và ba conflict oracle nêu tại §2; dùng positive/negative temp fixtures cho từng trường hợp và parser error.
- Compatibility / rollout / recovery: Theo quyết định Developer trong chat ngày 2026-10-07, grandfather chỉ task record có path + blob hash khớp manifest baseline `618cd55dcef242ae44a08c33a867f38a89ede64c`. Evidence oracle: hoặc record tự có checked revision/commit SHA 7–40 hex và bảng có `PASS`/policy-permitted `N/A` + evidence cho mọi AC; hoặc một linked local execution/evidence/handoff artifact cùng request folder có frontmatter `task_id` khớp, checked revision/commit SHA, và một bảng kết quả cho mọi AC. Toàn bộ bảng trong cùng record/artifact được gắn với checked revision ở header/checkpoint của nó; SHA rời rạc, evidence từ task khác, thiếu AC hoặc evidence trống không đủ. Chỉ record đạt cả path/blob và evidence oracle mới vào manifest. Record baseline đã sửa hoặc record mới phải đáp ứng metadata hiện hành. Ngoại lệ chỉ bỏ qua owner/write_scope/branch/worktree/checkpoint checks, không bỏ qua YAML/frontmatter parse, AC/verification structure hay dependency graph. Không migrate records lịch sử. Record baseline thiếu evidence/revision phải fail-closed. Rollback bằng revert task commit.
- Ràng buộc nhận diện evidence artifact: Artifact được chấp nhận nếu là Markdown link trực tiếp từ task record trong cùng request folder hoặc là `execution-task-N.md` cùng folder với N khớp ID task. Nếu artifact có frontmatter `task_id` thì giá trị phải khớp. Nếu không có `task_id`, chỉ chấp nhận artifact được link trực tiếp khi folder có đúng một task record và filename/title xác định cùng task ID. Artifact có `task_id` sai luôn fail; thiếu ID ở folder nhiều task không đủ.
- ADR / memory: N/A nếu không xuất hiện trade-off nền tảng hoặc pitfall mới có bằng chứng.
- Dependencies: `task-1` phải completed/contract được duyệt và hiện diện ở revision thực tế trước execution.

## 4. Verification Matrix

| AC / invariant | Kịch bản và lý do | Lệnh thực tế / manual procedure | Kết quả | Bằng chứng / revision |
| :--- | :--- | :--- | :--- | :--- |
| AC-1 | Thiếu dependency trong cùng folder; ID chỉ có ở folder khác; assert lỗi nêu file task và dependency ID | Temp fixture qua `npm.cmd test` | PASS | `npm.cmd test`, 13/13 quality suites; chạy trên HEAD `1eb891999b82b280a40cef07f82dc000a85d2b2f` + working diff |
| AC-2 | Self-cycle, multi-task cycle, duplicate ID cùng folder, DAG hợp lệ, cùng ID khác folder | Temp fixture qua `npm.cmd test` | PASS | `npm.cmd test`, self/multi-cycle, duplicate, DAG và folder namespace fixtures PASS trên HEAD + diff |
| AC-3 | Thiếu/từng metadata field sai; checkpoint thiếu trường; test từng conflict oracle (branch mismatch kể cả nhắc branch lịch sử, terminal/closed_at mismatch, approved metadata thiếu key); grandfather PASS với exact baseline blob và linked/canonical execution artifact cùng request có đúng task identity + checked SHA + PASS/N/A/evidence cho mọi AC; fail riêng cho sai task_id/frontmatter artifact lỗi, canonical unlinked hợp lệ/sai identity, thiếu identity ở folder nhiều task, SHA không gắn bảng AC, evidence-row SHA khác checked SHA (có nhãn và SHA trần), evidence thiếu, blob đổi hoặc record mới thiếu metadata; YAML malformed/không hỗ trợ fail-closed | Temp fixture qua `npm.cmd test` | PASS | `npm.cmd test`, metadata/lifecycle/YAML, exact-baseline, task identity, canonical unlinked, malformed artifact frontmatter và labeled/bare checked-SHA mismatch fixtures PASS; Task validator kiểm tra 7 records PASS |
| AC-4 | Sentinel config root được so trước/sau fixture pass và fail; cleanup chỉ trong temp root | Temp fixture qua `npm.cmd test` | PASS | Sentinel giữ nguyên trên cả graph fixture pass và dependency-missing fixture fail; temp root được cleanup |
| Task records | Toàn bộ record sau implementation, gồm legacy compatibility policy và dependency graph | `npm.cmd run validate:tasks` | PASS | Exit 0; checked 7 records, metadata/dependency coverage đầy đủ |
| Docs/profile | Commands và links đúng | `npm.cmd run validate:docs` | PASS | Exit 0; 77 Markdown files, toàn bộ internal links/anchors resolve |
| Fitness | Required Standard gate | `npm.cmd run test:fitness` | PASS (limitation) | Exit 0, reference mode, không có `src/` nên 0 files/rules được đánh giá; không phải bằng chứng architecture compliance của application |

## 5. Open Issues Và Approval

| Vấn đề / assumption | Bằng chứng / phương án | Người có quyền quyết định | Quyết định |
| :--- | :--- | :--- | :--- |
| Cách phân biệt legacy records với records hiện hành thiếu owner/write_scope/branch/worktree/checkpoint | Developer chọn grandfather các record baseline có evidence/revision. Discriminator là path + blob hash chính xác tại baseline commit; sửa nội dung làm mất exemption. Evidence phải có checked revision trong cùng record/artifact với PASS/N/A và evidence cho mọi AC; linked artifact phải khớp task_id. Evidence-row SHA nếu có phải bằng checked SHA. Test pass khi khớp hết; fail khi blob đổi, task_id sai, SHA thiếu/lệch bảng hoặc evidence thiếu. | Developer | Resolved; confirmed in chat 2026-10-07 |
| Oracle cho “metadata conflicts” | Giới hạn thành ba cross-check xác định trong §2: branch vs checkpoint; terminal execution status vs `closed_at`; approved status vs approval issuer/time/revision. | Task 2 plan revision này; không mở rộng beyond lifecycle contract. | Resolved; tests bắt buộc cho từng case |

- Plan revision được duyệt (`approved_revision`): `541cfcdc9603ad78ebe0afc06bba153699180dbe` (blob hash nội dung plan sau R13, trước cập nhật approval metadata).
- Approval evidence: Developer yêu cầu sửa Task 2 rồi chạy, chọn quy tắc grandfather và xác nhận review độc lập Task 1 hoàn tất trong chat ngày 2026-10-07. Independent plan review: reviewer session `/root/task2_plan_review_artifact`, scope Task 2 plan, revision `541cfcdc9603ad78ebe0afc06bba153699180dbe`, kết quả PASS/no findings ngày 2026-10-07.
- Phải có independent review plan trước approval/execution do P0/CRITICAL trigger; review implementation/evidence độc lập trước completed.

- Rework R01–R13: R01 chuyển approval về pending và xóa trạng thái approved không có evidence; R02 ghi discriminator baseline path/blob hash theo Developer decision; R03 cụ thể hóa test matrix cho namespace, duplicate/self-cycle, metadata và malformed YAML; R04 ghi HEAD/blob và giữ nguyên thay đổi Task 1 có trước; R05 xác nhận Task 1 completed tại `1eb891999b82b280a40cef07f82dc000a85d2b2f` với review/evidence được Developer xác nhận; R06 định nghĩa điều kiện evidence cho từng grandfather record; R07 khóa ba metadata conflict oracles và fixture âm/dương; R08 ràng buộc mọi AC evidence với cùng checked revision; R09 thêm `validate:tasks` vào verification; R10 nêu negative fixtures cho task_id/SHA mismatch; R11 thêm ca evidence-row SHA mâu thuẫn checked SHA; R12 nhận diện artifact không task_id trong single-task folder; R13 chấp nhận canonical `execution-task-N.md` cùng folder khi task_id/title khớp, để không cần sửa records lịch sử. Revision này được Developer yêu cầu thực hiện sau independent plan review PASS.

## 6. Execution Checkpoint / Handoff

- Đã làm / checks đã chạy / findings còn mở: Task 1 completed trên HEAD `1eb891999b82b280a40cef07f82dc000a85d2b2f`; Developer xác nhận review độc lập Task 1 hoàn tất, implementation commit được review là `f9f7c3a660e5000c5107f5161b422fecc8b9048d`. Plan Task 2 revision `541cfcdc9603ad78ebe0afc06bba153699180dbe` được independent review `/root/task2_plan_review_artifact` PASS/no findings và Developer yêu cầu thực hiện. Implementation review phát hiện và đã sửa: fail-closed khi artifact có frontmatter lỗi/trùng key; fixtures canonical artifact không link/sai identity và linked artifact thiếu identity trong folder nhiều task; phát hiện SHA trần trong evidence row; branch oracle so đúng giá trị §6 kể cả có nhắc branch lịch sử. Reviewer `/root/task2_plan_review_artifact` kiểm tra working diff hiện tại, PASS/no blockers, scope gồm validator/tests/Task 2 record; không chỉnh sửa implementation. `npm.cmd test` PASS (9/9 architecture; 13/13 quality guardrails); `validate:tasks` PASS (7 records); `validate:docs` PASS (77 Markdown files); `test:fitness` PASS, reference mode/0 source files; `git diff --check` PASS.
- Branch / revision / diff / staged scope / conditional commit: `task/task-sizing-handoff`; HEAD `1eb891999b82b280a40cef07f82dc000a85d2b2f`; baseline compatibility `618cd55dcef242ae44a08c33a867f38a89ede64c`. Diff hiện có implementation validator, fixtures và Task 2 checkpoint; prompt điều tra là baseline untracked, không thuộc scope. Chỉ stage các file trong write_scope; không stage prompt hoặc baseline.
- DoD / bước tiếp theo / authority: Independent implementation review PASS. Task ở `pending_verification`; review staged scope, conditional commit các file trong write_scope, chạy post-commit gates, rồi ghi `completed`/`closed_at`. Developer giữ authority cho scope change, merge/push/deploy.
