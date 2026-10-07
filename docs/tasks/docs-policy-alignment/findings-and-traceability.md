# Findings Gốc Và Bảng Truy Vết — Docs Policy Alignment

- Nguồn: review của Developer trong chat, findings F01–F24, rework trên artifact revision `b0b92d9`.
- Phạm vi: tài liệu hiện hành. Không đọc hoặc sửa `docs/archive/**`.
- Mục đích: lưu đầy đủ yêu cầu để session tiếp theo không phụ thuộc lịch sử chat.
- Authority trong bảng là căn cứ xử lý mâu thuẫn; nếu phát sinh policy choice chưa được AGENTS quyết định, plan vẫn cần Developer duyệt trước execution.

## 1. Findings gốc

| ID | Mức | Vị trí và hai phát biểu liên quan | Mâu thuẫn / lỗ hổng | Cách sửa được yêu cầu |
| :--- | :--- | :--- | :--- | :--- |
| F01 | Cao | `docs/operations/agent-workflow.md` §2 nói EXECUTE gặp Hard Stop phải dừng sửa code; `AGENTS.md` §3.B định nghĩa Fast Track Hard Stop gồm business logic, schema, Auth, P0/P1 | Dùng loại trừ Fast Track như lệnh dừng cho mọi EXECUTE sẽ chặn Standard task đã duyệt | Phân biệt Fast Track exclusion (đổi sang Standard) với escalation trigger tại AGENTS §4 (dừng việc phụ thuộc trigger) |
| F02 | Cao | `agent-workflow.md` §1 nói EXECUTE theo approved plan; `docs/HOW_WE_WORK.md` §2.A nói Fast Track bỏ qua task file/approval gate | Không có căn cứ mode để sửa Fast Track chưa có approved plan | Cho EXECUTE hai căn cứ: approved plan cho Standard; yêu cầu trực tiếp, rõ scope cho Fast Track hợp lệ |
| F03 | Cao | README §3 yêu cầu working tree chỉ có task changes; `AGENTS.md` §2.C cho phép giữ baseline đã ghi nhận ngoài task | README cấm baseline bẩn rồi lại yêu cầu bảo toàn baseline | Trỏ AGENTS §2.C; nếu tóm tắt thì giới hạn vào index/staged scope |
| F04 | Cao | `AGENTS.md` §5.A yêu cầu fitness cho Standard; §5.B chỉ yêu cầu conditional fitness Fast Track nếu chạm source/architecture; quick checklist và CI guide diễn đạt fitness vô điều kiện | Docs/read-only và Fast Track bị áp cùng gate bất kể applicability | Canonical applicability table: bắt buộc / N/A có lý do / thiếu gate; các checklist và CI guide dẫn tới bảng |
| F05 | Cao | `docs/system-map/critical-paths.md` §2 xếp “Core Business Loop” (học/luyện tập) P0; `docs/business-metrics/critical-flows.md` §1 xếp ví dụ học/luyện tập P2 | Cùng hành vi có P0/CRITICAL và P2/MEDIUM | Tách “core execution loop” khỏi “core business flow”; một owner taxonomy, system map chỉ ánh xạ |
| F06 | Cao | `AGENTS.md` §7 yêu cầu P1 integration test; `critical-flows.md` yêu cầu P1 full regression; HOW_WE_WORK yêu cầu P0/P1 full regression | Cùng risk có phạm vi verify khác nhau; “full regression” không định nghĩa | Chốt matrix P0–P4 và định nghĩa regression scope một lần |
| F07 | Cao | `AGENTS.md` §6.B.4 nói mọi DB query phải scope `userId`; `architecture-rules.md` §4 giới hạn query dữ liệu người dùng và cho phép `userId`/`tenantId` | Quy tắc tổng quát không áp dụng được cho seed/master, public data, job không có session | Đồng bộ theo loại query; nêu rõ identity authority cho user/tenant, public, master và system job |
| F08 | Cao | `AGENTS.md` §0 nhận approved decision qua `status: approved`; `docs/tasks/README.md` gộp `draft → approved → completed` | Khi completed, approval không còn nhận diện được; approval và execution progress dùng chung field | Approval record độc lập execution status; approval còn hiệu lực vẫn nhận diện được sau completed |
| F09 | Trung | `tasks/README.md` đánh dấu completed sau commit/handoff; `AGENTS.md` §2.C yêu cầu sau commit không còn thay đổi task chưa xử lý | Không có trình tự chốt metadata, commit, revision evidence | Quy định close sequence; cho phép metadata commit cuối khi cần, không ép một commit duy nhất |
| F10 | Trung | `agent-workflow.md` §1 cấm READ_ONLY thay đổi repository; templates/handoff có nơi lưu artifact/checkpoint; handoff §4 yêu cầu checkpoint trong task | Chưa rõ quyền tạo artifact của READ_ONLY/REVIEW | Tách quyền đọc, sửa target, tạo artifact; read-only có thể báo chat, file chỉ khi yêu cầu hoặc policy cho phép |
| F11 | Trung | `AGENTS.md` §9 tính 6 tháng từ hoàn thành; `knowledge-lifecycle.md` tính từ merge và archive cả request folder | Không có mốc cho task không có PR; folder có task active có thể bị archive; link evidence có thể đứt | Dùng `closed_at`, giữ `merged_at`; chỉ chuyển task records khi mọi task đủ điều kiện; giữ request index và evidence links truy vết được |
| F12 | Cao | HOW_WE_WORK định nghĩa CLARIFICATION khi hành vi đã đúng và cần diễn đạt; `technical-lessons.md` nói hành vi chưa mô tả thì dùng CLARIFICATION | Thiếu mô tả không chứng minh hành vi đúng; CLARIFICATION có thể tự bổ sung nghiệp vụ; NONE bị thu hẹp vào bugfix | Định nghĩa Spec Impact một lần: CLARIFICATION dựa trên behavior đã xác nhận; NONE không đổi business contract; memory dẫn link |
| F13 | Trung | `AGENTS.md` hierarchy thiếu ADR/architecture; `decisions/README.md` ghi Accepted ADR; project profile chứa gate theo project | Không rõ Accepted ADR xung đột task/system-map thì nguồn nào ưu tiên; profile có thể bị hiểu là policy | Đặt Accepted ADR trong Technical HOW; architecture là implementation; profile chỉ ánh xạ công cụ; đồng bộ khi ADR accepted |
| F14 | Trung | `tasks/README.md` chỉ có draft/approved/completed; handoff có blocked/pending verification/ready for review | Thiếu lifecycle cho fail, cancel, resume, supersede và owner/điều kiện chuyển trạng thái | Định nghĩa execution status/transitions, owner, blocker, resume condition và cách giữ diff; handoff dùng cùng enum |
| F15 | Trung | `agent-workflow.md` yêu cầu duyệt lại khi scope/risk/contracts đổi; handoff cấm âm thầm đổi approved plan | Thiếu xử lý AC, diff, approval cũ và evidence bị ảnh hưởng | Checkpoint diff → change request → invalidate phần approval/evidence bị ảnh hưởng → cập nhật AC/plan → duyệt delta → re-verify; giữ diff cũ |
| F16 | Trung | `agent-workflow.md` nói mode xác định từ yêu cầu; handoff và adoption rải rác các bước session | Thiếu cold-start/resume checklist thống nhất | Checklist task/mode/track, branch/baseline, revision/approval, deps, profile/spec/package, AC/verify; resume kiểm tra checkpoint freshness |
| F17 | Cao | `production-incident.md` bước 1 yêu cầu mitigation được duyệt; bước 3 ra lệnh sửa/deploy hotfix; AGENTS yêu cầu P0/P1 Standard | Approval mitigation có thể bị hiểu thành quyền sửa/deploy | Mặc định không có severity-based/emergency bypass; hotfix dùng approved Standard task. Chỉ explicit Developer override theo AGENTS §0, ghi issuer/scope/evidence, và không tự cấp deploy authority |
| F18 | Trung | AGENTS, README, HOW_WE_WORK, quick checklist lặp Git/DoD/risk/invariants; quick checklist tự gọi mình là ranh giới tối cao | Nhiều nơi tự nhận authority và dễ lệch policy | AGENTS giữ quyền/gate; architecture rules giữ invariants; critical flows giữ taxonomy; README/HOW giải thích/link; checklist pointer/rule ID |
| F19 | Trung | Bug investigation, decisions README, fn README, preflight đều chép mẫu; bản chuẩn đã có trong `docs/templates/` | Nhiều mẫu hợp lệ với metadata/sections khác nhau | `docs/templates/` là nguồn template đầy đủ duy nhất; SOP nêu nội dung và link; ví dụ ngắn ghi rõ không phải template |
| F20 | Trung | `auth-context.md` hardcode `v1.0`, ADR naming không canonical, dẫn “Điều 2” trong khi trust boundary là Rule 4, cấm toàn bộ task glob | Context package stale/overbroad và không theo active version | Resolve ACTIVE_VERSION; link anchor; dùng ADR pattern; cho phép task hiện tại/dependencies xác nhận; đánh dấu package là mẫu nếu chưa có domain thật |
| F21 | Trung | AGENTS §10 là routing map; HOW_WE_WORK gộp onboarding/bootstrap; README có directory map; critical flows đặt dưới business metrics | Không có entry path theo phase; bootstrap/onboarding trộn; risk policy khó tìm | Một routing map phân phase/trigger; chia bootstrap và onboarding; đặt risk taxonomy dưới operations |
| F22 | Trung | HOW_WE_WORK giới hạn <30k; AGENTS §8 cho High <=60k; Critical yêu cầu duyệt trong HOW nhưng AGENTS yêu cầu checkpoint/chia task; package budget gọi target/max lẫn nhau | Recommendation/target/hard cap/overflow không nhất quán | Tách package target, session budget, hard cap và overflow action; các tài liệu khác dẫn AGENTS §8 |
| F23 | Trung | Workflow nói independent review bắt buộc nhưng thiếu trigger/independence; review template để severity placeholder; handoff gộp track với lifecycle output/DoD | Reviewer, severity, mode/track/output chưa được định nghĩa | Glossary; điều kiện reviewer độc lập; severity chuẩn; handoff tách track khỏi lifecycle output |
| F24 | Thấp | `standards/README.md` nói cấm `SELECT *`; `performance.md` cho phép theo contract/review; migration playbook gọi phase 3 “Contract - Read Transition” và phase 4 “Contract” | Summary mất ngoại lệ; tên phase trùng nghĩa | README tóm tắt/link rule đầy đủ; phase 3 là Read Transition, phase 4 là Contract |

## 2. Bảng Finding → Task → AC → Tài liệu cần sửa

| Finding | Task | AC | Tài liệu owner trong scope | Trạng thái / dependency |
| :--- | :--- | :--- | :--- | :--- |
| F01–F02 | Task 2 | AC-1 | `docs/operations/agent-workflow.md`; HOW_WE_WORK Fast Track/Standard EXECUTE authority clause (Task 1 owns its unrelated Git/DoD/gate/risk summaries) | Draft; Task 2 depends on Task 1 policy |
| F03 | Task 1 | AC-5 | `README.md`, `AGENTS.md` | Draft |
| F04 | Task 1 | AC-2 | `AGENTS.md`, `docs/fitness-functions/ci-enforcement.md`, `docs/standards/verification.md`, `docs/operations/quick-checklist.md`, `docs/HOW_WE_WORK.md` | Draft; all direct summaries updated in same task |
| F05 | Task 1 | AC-1 | `docs/operations/critical-flows.md` (new canonical), `docs/business-metrics/critical-flows.md` (compatibility pointer), `docs/system-map/critical-paths.md`, `AGENTS.md`, `README.md`, `HOW_WE_WORK.md`, checklist | Draft; safe transition is same-task link update |
| F06 | Task 1 | AC-2 | Canonical matrix in AGENTS/verification owner; `critical-flows.md`, `HOW_WE_WORK.md`, checklist references | Draft; all direct policy summaries updated in same task |
| F07 | Task 1 | AC-3 | `docs/fitness-functions/architecture-rules.md`, `AGENTS.md`, `README.md`, checklist, preflight | Draft; all direct summaries updated in same task |
| F08 | Task 2 | AC-3 | `AGENTS.md` §0 approval record semantics, `docs/tasks/README.md`, `docs/task-authoring/README.md` status section, `docs/templates/task-fix.md`, `docs/templates/task-feat.md`, HOW_WE_WORK approval/status summary | Draft; all lifecycle/approval summaries owned by Task 2 |
| F09 | Task 2 | AC-4 | `docs/tasks/README.md`, `docs/operations/handoff-contract.md`, handoff/task templates | Draft |
| F10 | Task 2 | AC-2 | `agent-workflow.md`, review/handoff templates, handoff contract | Draft |
| F11 | Task 3 | AC-1 | `docs/governance/knowledge-lifecycle.md`, `docs/tasks/README.md` archive references (status model owner Task 2) | Draft; Task 3 depends on Task 2 |
| F12 | Task 3 | AC-2 | `docs/task-authoring/README.md` Spec Impact subsection (canonical definition owner), `docs/project-memory/technical-lessons.md`, bug-investigation | Draft; Task 3 depends on Task 2 and edits a distinct subsection |
| F13 | Task 1 | AC-4 | `AGENTS.md` Technical HOW hierarchy portion, `docs/decisions/README.md`, `docs/architecture/README.md`, `docs/operations/project-profile.md` | Draft; Task 1 leaves approval-status semantics in AGENTS to Task 2 |
| F14 | Task 2 | AC-3 | `docs/tasks/README.md`, `docs/operations/handoff-contract.md`, task/handoff templates | Draft |
| F15 | Task 2 | AC-5 | `agent-workflow.md`, task template, handoff contract | Draft |
| F16 | Task 2 | AC-6 | `agent-workflow.md` cold-start/resume entry point | Draft |
| F17 | Task 3 | AC-3 | `docs/playbooks/production-incident.md`, task/deploy authority links | Draft; Task 3 depends on Task 2; no severity-based bypass |
| F18 | Task 1 | AC-5 | `AGENTS.md`, README, HOW_WE_WORK, checklist and source-owner files above | Draft; remove duplicated policy in same task |
| F19 | Task 3 | AC-4 | bug-investigation, decisions README, fn README, preflight, `docs/templates/README.md` | Draft; Task 3 depends on Task 2 |
| F20 | Task 3 | AC-5 | `docs/context-packages/auth-context.md`, context package README, ACTIVE_VERSION pointer | Draft |
| F21 | Task 3 | AC-6 | workflow routing map is owned by Task 2; HOW_WE_WORK/README/project adoption are residual routing pointers owned by Task 3; risk taxonomy location is Task 1 | Draft; Task 3 depends on Task 1/2 and only edits distinct sections/links |
| F22 | Task 3 | AC-7 | `AGENTS.md` §8 owner; `docs/context-packages/README.md`, `docs/context-packages/template.md`, HOW_WE_WORK, bug investigation, README | Draft |
| F23 | Task 2 | AC-7 | workflow glossary, review/handoff templates, handoff contract | Draft |
| F24 | Task 1 | AC-6 | `docs/standards/README.md`, `performance.md`, `docs/playbooks/database-migration.md` | Draft |

## 3. Bằng Chứng Cụ Thể / Authority / Phương Án

| Vị trí A → vị trí B | Mâu thuẫn được quan sát | Authority | Phương án trong plan |
| :--- | :--- | :--- | :--- |
| `docs/system-map/critical-paths.md` §2: “Core Business Loop”, P0, ví dụ tiến trình luyện tập/luồng học → `docs/business-metrics/critical-flows.md` §1 P2; `AGENTS.md` §7 P0 “core execution loop”, P2 “luồng bài học, tiến trình luyện tập chính” | Học/luyện tập được gán cả P0 và P2 | AGENTS §0/§7; taxonomy canonical duy nhất theo F05 | Định nghĩa execution loop là vòng điều phối/thực thi sống còn của hệ thống, giữ user-facing study/learning flow ở P2; Developer duyệt nếu có diễn giải nghiệp vụ khác |
| `AGENTS.md` §7 P1: integration test → `critical-flows.md` P1: full regression → HOW_WE_WORK P0/P1: full regression | Gate cùng risk khác nhau, regression không rõ phạm vi | AGENTS §5/§7 và project profile commands | Matrix và regression scope đề xuất ghi ở Task 1 Open Issues; không tự bỏ gate |
| `AGENTS.md` §6.B.4: mọi query `userId` → architecture-rules Rule 4: chỉ user-data query, `userId`/`tenantId` | Seed/public/system jobs không có user session | AGENTS §6.B.4 và architecture-rules Rule 4; cần đồng bộ, Developer duyệt boundary | User-owned query lấy user/tenant authority từ server session; system/public/master data dùng authority/canonical key theo loại nguồn, không giả lập user scope |
| `AGENTS.md` §5.A Standard DoD fitness → README/quick checklist/CI guide diễn đạt fitness vô điều kiện; Fast Track DoD có điều kiện | Applicability khác theo task type | AGENTS §5A cho Standard, §5B cho Fast Track, project profile cho commands | Batch này là Standard: test validator rồi fitness là required gate; global applicability table phải thể hiện Standard bắt buộc và các trường hợp N/A riêng |
| `AGENTS.md` §0 chỉ `status: approved` → tasks README chuyển chính field thành `completed` | Không thể nhận biết approval còn hiệu lực sau completion | AGENTS §2/§5 và Developer approval record | Task 2 tách approval record khỏi execution status, giữ revision/approver/time trong AGENTS §0, tasks README, HOW_WE_WORK và cả hai task templates; Task 1 chỉ sửa Technical HOW hierarchy |

## 4. Verification / Approval State

- Tất cả ba task vẫn `status: draft`; chưa có approval.
- Các phát biểu policy đề xuất ở trên là nội dung đưa ra để Developer duyệt; không phải policy đã được chấp nhận.
- Verification implementation: `NOT_RUN`. Theo project profile, chạy `npm.cmd test` trước `npm.cmd run test:fitness`; Task 1–3 là Standard task nên fitness gate bắt buộc theo AGENTS §5.A/§2.C trước conditional commit.
