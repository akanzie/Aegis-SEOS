---
task_id: task-3
status: approved
critical_flow: P0
risk_level: CRITICAL
spec_impact: NONE
depends_on: [task-1, task-2]
created_by: AI Agent
approved_by: null
approved_at: null
---

# Task 3: Đồng Bộ Tài Liệu Dẫn Chiếu, SOP Và Context

## 1. Nguồn Nghiệm Thu

- Yêu cầu gốc / batch prompt: [prompt-dieu-tra-docs-policy-alignment.md](prompt-dieu-tra-docs-policy-alignment.md); [findings gốc và traceability](findings-and-traceability.md), F11–F12, F17, F19–F22. F03–F07/F13/F18/F24 và các direct summaries liên quan thuộc Task 1, không lặp ownership tại Task 3.
- Spec active / Context Package: Không có package phù hợp. Auth context được sửa như tài liệu tham chiếu nhưng không nạp làm nguồn context cho task này.
- Actual / expected: README/HOW_WE_WORK/checklist/SOP/memory/templates/context package có policy lặp lại, ví dụ/template trùng, route sai hoặc thuật ngữ budget/lifecycle không thống nhất.

| AC | Hành vi cần đạt | Check bảo vệ ý định |
| :--- | :--- | :--- |
| AC-1 | Governance dùng `closed_at` làm retention clock, giữ `merged_at` riêng; chỉ archive request khi mọi task đủ điều kiện; links/index còn truy vết được | Kiểm tra lifecycle và chỉ dẫn link sau archive, không mở archive |
| AC-2 | Spec Impact có định nghĩa canonical: CLARIFICATION dựa trên behavior đã xác nhận; NONE là không đổi business contract; memory dẫn về định nghĩa | Tìm tất cả định nghĩa/enum và so sánh references |
| AC-3 | Production incident hotfix tách approval mitigation khỏi approved task và authority deploy; không có severity-based bypass, chỉ có Developer override rõ scope theo AGENTS §0 và không tự cấp quyền deploy | Đối chiếu SOP với Standard 3-Step, AGENTS §0 và quyền deploy |
| AC-4 | Template đầy đủ chỉ có trong `docs/templates/`; SOP giữ nội dung bắt buộc và link; ví dụ rút gọn được ghi rõ không phải template | Tìm mẫu lặp trong bug investigation, ADR, fn và preflight |
| AC-5 | Auth context giải version active, anchors, ADR naming, Do Not Load exceptions và đánh dấu package chỉ là mẫu nếu không có domain thật | Đối chiếu với ACTIVE_VERSION, trust-boundary anchor và package registry |
| AC-6 | Có một routing map chia theo phase/trigger; bootstrap/onboarding tách rõ; README/HOW_WE_WORK chỉ dẫn entry map; không sửa lại risk/gate/Git summaries do Task 1 sở hữu | Kiểm tra các directory map, file ownership và links theo phase |
| AC-7 | Package target, session budget, hard cap/overflow action được định nghĩa riêng và mọi residual references dẫn đúng nguồn | Tìm các giá trị budget/thuật ngữ trong residual docs |
| AC-8 | Template đầy đủ, incident SOP, governance, memory, context packages và residual routing chỉ dẫn policy owner canonical; không giữ policy duplicate thuộc Task 1/2 | Cross-reference audit theo `findings-and-traceability.md` ownership table |

## 2. Điều Tra Và Root Cause

- Baseline: Branch `task/docs-policy-alignment`; working tree sạch khi bắt đầu; kiểm tra danh sách context packages cho thấy chỉ có template chung và Auth package. Không đọc archive.
- Trace: Evidence từng finding tại [findings-and-traceability.md](findings-and-traceability.md) §1–3. Ví dụ: governance §1 tính 6 tháng từ merge, còn AGENTS §9 tính từ completed; production incident §3 hướng dẫn sửa/deploy nhưng không dẫn approved Standard task/deploy authority; `auth-context.md` hardcode `v1.0`, nêu “Điều 2” trong khi trust boundary là Rule 4; technical-lessons §1 bảo dùng CLARIFICATION cho hành vi chưa mô tả trong khi HOW_WE_WORK giới hạn vào hành vi đã đúng.
- Root cause: Tài liệu onboarding/SOP/memory phát triển độc lập, sao chép policy/template và không trỏ nhất quán về owner. Ownership còn lại của Task 3 chỉ bắt đầu sau khi Task 1/2 đã chốt nguồn và đồng bộ direct summaries thuộc chúng.
- Blast radius / risk: CRITICAL vì task tác động tài liệu hướng dẫn quyền/gate của P0; taxonomy P0 ánh xạ CRITICAL theo AGENTS §7 và task-authoring risk mapping.
- Spec Impact: NONE — không đổi hành vi sản phẩm.

## 3. Thay Đổi Tối Thiểu

- In scope: F11–F12, F17, F19–F22. File owners: `docs/governance/knowledge-lifecycle.md`; `docs/project-memory/technical-lessons.md`; `docs/playbooks/production-incident.md`, `bug-investigation.md`; `docs/decisions/README.md`; `docs/main_docs/v1.0/fn/README.md`; `docs/operations/preflight-checklist.md` template duplication section only (Task 1 owns trust-boundary section); `docs/templates/README.md` and non-task templates; `docs/context-packages/README.md`, `docs/context-packages/template.md`, `auth-context.md`; `docs/operations/project-adoption.md`; `AGENTS.md` §8 budget policy; residual HOW_WE_WORK/README budget and routing pointers. `docs/operations/project-profile.md` source facts and gates are Task 1-owned and are not edited by Task 3. `docs/task-authoring/README.md` owns the canonical Spec Impact definition for F12; Task 2 edits only its status/approval subsection, then Task 3 edits the distinct Spec Impact subsection. Task 3 may update links to outputs of Task 1/2 but must not retake their policy-summary ownership. README/HOW_WE_WORK/quick-checklist Git/DoD/risk/gate summaries are Task 1-owned; Task 2 owns approval/status and EXECUTE-mode summaries; Task 3 owns only budget/routing pointers.
- Out of scope: Nội dung policy canonical thuộc Task 1/2; file trong `docs/archive/**`; runtime.
- Spec synchronization: Không áp dụng.
- Implementation: Cắt nội dung trùng, trỏ tới owner/template duy nhất; cập nhật links/anchors/profile; giữ tài liệu onboarding dễ dùng nhưng không lặp rule text dài.
- Compatibility / recovery: Không archive/move task files trong implementation này; governance chỉ định quy trình tương lai, bao gồm index/link behavior.
- ADR / memory: Cập nhật technical-lessons chỉ nếu Developer chấp thuận nội dung và scope; nếu không, thay phần đang mâu thuẫn bằng link tới policy canonical.

## 4. Verification Matrix

| AC / invariant | Kịch bản và lý do | Lệnh thực tế / manual procedure | Kết quả | Bằng chứng / revision |
| :--- | :--- | :--- | :--- | :--- |
| Automated tests | Standard task; profile xác nhận validator test; chạy trước fitness | PowerShell: `npm.cmd test` | NOT_RUN | Ghi exit code/log và revision tại execution |
| Architecture fitness | Bắt buộc theo AGENTS §5.A/§2.C cho mọi Standard task và trước conditional commit; không xin miễn trừ cho batch này | PowerShell: `npm.cmd run test:fitness` | NOT_RUN | Ghi exit code/log và revision tại execution |
| AC-1–AC-8 | Tìm duplicate enum/template/link/budget, stale version/anchors/conflicting residual policy; kiểm tra Task 1/2 ownership không bị lặp hoặc bỏ trống | `rg -n` trên keywords; kiểm tra Markdown links/anchors; `git diff --check` | NOT_RUN | Sẽ ghi tại execution revision |
| Scope | Không đọc hoặc thay đổi archive/runtime | `git status --short`; kiểm tra `git diff --name-only` | NOT_RUN | Sẽ ghi tại execution revision |

## 5. Open Issues Và Approval

| Vấn đề / assumption | Bằng chứng / phương án | Người có quyền quyết định | Quyết định |
| :--- | :--- | :--- | :--- |
| Routing map và vị trí onboarding | Dùng `docs/operations/agent-workflow.md` làm cold-start/mode/phase entry point; HOW_WE_WORK chỉ giữ bootstrap/onboarding; README là giới thiệu và link; quick checklist là pointer-only; project-adoption dùng cho adoption trigger | Developer / delegated reviewer | Proposed for review |
| Token budgets / overflow | Package budget `<=15,000` là target, không hard cap. Giữ AGENTS §8 session bands Low `<=10k`, Medium `<=30k`, High `<=60k`; `>60k` là overflow trigger bắt buộc: dừng nạp context, ghi checkpoint rồi chia task hoặc tiếp tục ở session mới. Không cần approval riêng chỉ vì overflow. AGENTS §8 là owner; references chỉ dẫn link | Developer / delegated reviewer | Proposed for review |
| Emergency exception trong production incident | Không tạo bypass khẩn cấp tổng quát. Severity, incident role hoặc approval mitigation không cấp quyền sửa/deploy. Chỉ explicit Developer override theo AGENTS §0 mới có thể thay đổi policy cho task/revision được nêu; phải ghi issuer, timestamp, incident ID, action/file scope, expiry/recovery và evidence. Override đó không tự cấp deployment authority; deploy cần quyền riêng theo project profile/operations. | Developer / delegated reviewer | Proposed for review |
| Task archive links | Dùng `closed_at` làm mốc retention, lưu `merged_at` riêng; chỉ chuyển task records khi mọi task con terminal và đủ 6 tháng; giữ `docs/tasks/<request>/README.md` index tại chỗ, cập nhật link tới archived records và giữ evidence links truy vết được | Developer / delegated reviewer | Proposed for review |

- Plan revision được duyệt: Chưa có.
- Approval evidence: Chưa có.

## 6. Execution Checkpoint / Handoff

- Đã làm / checks đã chạy / findings còn mở: Risk metadata đã đồng bộ P0/CRITICAL. Evidence/ownership ở `findings-and-traceability.md`; chưa sửa docs dẫn chiếu/SOP/template. `npm.cmd test` và fitness là gate bắt buộc tại execution, hiện NOT_RUN.
- Branch / revision / staged scope / conditional commit: `task/docs-policy-alignment`; chưa có commit/staged changes.
- DoD / bước tiếp theo / authority: Chờ Task 1/2 được duyệt và thực thi; sau đó đồng bộ references.
