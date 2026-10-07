---
task_id: task-1
approval_status: approved
approved_by: Developer
approved_at: "2026-10-07T12:09:19+07:00"
approved_revision: "chat-review-context-cache-v1@f946c78f4692731b8ecf75644c9158cd1cf15e12"
execution_status: completed
closed_at: "2026-10-07T12:25:03+07:00"
merged_at: null
critical_flow: P0
risk_level: CRITICAL
spec_impact: NONE
depends_on: []
created_by: Codex
---

# Task 1: Tối Ưu Docs Context Và Prefix Cache

## 1. Approval và nguồn nghiệm thu

Developer yêu cầu review sáu khía cạnh token/cache, nhận report gồm estimates, đề xuất theo mức tiết kiệm và cây thư mục, rồi trả lời `approved`. Approval nhận diện **report v1 ở baseline f946c78**, không phải agent tự duyệt plan mới. Record này chép scope đã được duyệt để thực thi; `approved_at` là thời điểm ghi nhận approval quan sát bằng clock, không phải timestamp gửi chat. Decision review: Developer đã đọc/duyệt proposal; implementation phải được reviewer độc lập kiểm tra trước completed. Developer sau đó cho phép gọi agent REVIEW độc lập trong reply cho câu hỏi review, không cấp quyền push/merge.

| AC | Kết quả cần đạt | Verification |
| :--- | :--- | :--- |
| AC-1 | AGENTS ngắn hơn; giữ hierarchy, safety/Git, Hard Stop/escalation, risk/budget và gate applicability | Baseline diff; policy preservation scenarios; estimates trước/sau |
| AC-2 | Tách workflow/lifecycle/review/DoD/merge và human/bootstrap theo trigger, giữ anchor lịch sử | Links/anchors; owner coverage; historical task bytes |
| AC-3 | Checklist/README dẫn owner; summaries dùng approval record đúng revision | Search active docs; checklist/manual consistency |
| AC-4 | Catalog có docs-policy/validator packages dùng paths thật, Auth giữ reference status | Package paths/triggers, manifest/tests trace |
| AC-5 | Context Assembly quy định prefix order/update/evidence, metadata profile xuống cuối | Manual policy review; không bịa telemetry/client support |
| AC-6 | Checks bắt buộc PASS, independent review, evidence/handoff và conditional commit đúng scope | npm tests rồi fitness; docs checks; review và Git evidence |

## 2. Điều tra và phạm vi

Baseline: branch main, HEAD `f946c78f4692731b8ecf75644c9158cd1cf15e12`, index/working tree sạch. Branch execution: `task/context-cache-optimization`.

Nguyên nhân: AGENTS 26,969 ký tự; workflow/preflight/onboarding trộn triggers; policy lặp ở summaries; catalog chỉ có Auth reference; survey metadata nằm đầu profile. Repo có validators Node.js, chưa có runtime business `src/` hoặc verified remote CI. Package phù hợp chưa có ở baseline; đọc workflow/profile/verification/memory trực tiếp, không nạp Auth/archive.

In scope: các docs được report chỉ ra, owner files/catalog/context packages/context assembly, active direct summaries/template refs và request index. Giữ byte của task records `docs/tasks/docs-policy-alignment/**`; thêm index tại chỗ để downstream đọc đúng scope. Không tự rút gọn/archive records cũ hoặc viết client/runtime caching code. Estimates dùng ký tự/3 với range ký tự/4–ký tự/2; không tuyên bố tokenizer chính xác/cache hit/tiền tiết kiệm.

Spec Impact NONE: không đổi business behavior; active version v1.0 Initializing chưa có functional spec liên quan. Risk P0/CRITICAL vì phân quyền policy và gates; Standard, không Fast Track. ADR N/A: chỉ tái tổ chức docs owner đã được Developer duyệt, không đổi module/runtime/public API/database/hạ tầng. Automation/telemetry client không nằm scope.

## 3. Implementation theo proposal đã duyệt

1. Rút gọn AGENTS, giữ applicability canonical; delegate DoD chi tiết theo approval.
2. Di chuyển nội dung lifecycle/independence/merge/DoD, giữ obligations và compatibility anchors; đổi direct links sang owner mới.
3. HOW_WE_WORK thành entry, tách human/bootstrap, README/checklist ngắn, sửa summaries approval fields.
4. Thêm catalog packages đúng workload và trigger/sections; thêm Context Assembly; metadata khảo sát ở cuối profile.
5. Verify docs/token/policy scenarios, tests tuần tự rồi fitness; independent reviewer read-only; conditional local commit. Recovery là revert task diff/commit qua Developer-authorized Git action; không tác động dữ liệu/schema.

## 4. Verification và handoff

Evidence/results/review nằm ở [Evidence](evidence.md). Approval scope không đổi khi thêm results/checkpoint; delta quyết định/scope cần theo Task Lifecycle. Không open business/architecture assumptions. Required checks/review chưa chạy không coi PASS; execution chỉ completed sau DoD/commit/post-commit checks.
