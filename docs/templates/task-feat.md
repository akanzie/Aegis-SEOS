---
task_id: task-N
status: draft
critical_flow: "[P0 | P1 | P2 | P3 | P4]"
risk_level: "[CRITICAL | HIGH | MEDIUM | LOW | TRIVIAL]"
spec_impact: "[NONE | CLARIFICATION | CHANGE | CONFLICT]"
depends_on: []
created_by: "[author]"
approved_by: null
approved_at: null
---

# Task N: Thêm [Kết quả nghiệp vụ]

## 1. Nguồn Nghiệm Thu

- Yêu cầu gốc / batch prompt: [Đường dẫn hoặc ticket].
- Intent / user flow / expected: [Ai cần gì, trong điều kiện nào].
- Spec active / Context Package: [Nguồn đã xác minh; ghi rõ nếu không có package phù hợp].

| AC | Hành vi cần đạt | Check bảo vệ ý định |
| :--- | :--- | :--- |
| AC-1 | [Điều kiện -> kết quả quan sát được] | [AUTOMATED_TEST / STATIC_CHECK / E2E / MANUAL] |

## 2. Điều Tra Và Thiết Kế

- Baseline: [Branch, HEAD, thay đổi có sẵn cần bảo toàn].
- Hiện trạng: [Code/spec/tests thực tế, file:symbol và bằng chứng].
- Callers / dependencies / exports / contracts: [Blast radius đã trace].
- Thiết kế tối thiểu: [Hành vi, error paths và invariants; convention được tái sử dụng].
- Critical flow / risk: [Mức cao nhất, tác động P0/P1 nếu có].
- Spec Impact: [Giải thích; conflict phải chờ Developer quyết định].

## 3. Scope Và Kế Hoạch

- In scope / out of scope: [Files và kết quả nghiệm thu].
- Spec synchronization: [Đề xuất/cập nhật trước hoặc cùng implementation theo approval].
- Implementation: [Các bước tối thiểu; không thêm abstraction suy đoán].
- Compatibility / rollout / recovery: [Ảnh hưởng contracts, dữ liệu; migration nếu áp dụng].
- ADR / memory: [Trigger hoặc N/A có lý do].
- Dependencies: [Task/contract tiền đề đã xác nhận; không có chu trình].

## 4. Verification Matrix

| AC / invariant | Kịch bản và lý do | Lệnh thực tế / manual procedure | Kết quả | Bằng chứng / revision |
| :--- | :--- | :--- | :--- | :--- |
| AC-1 | [Happy path, boundary hoặc error path] | [Đã xác minh từ project profile] | NOT_RUN | [Chưa có] |
| Fitness | [Luật kiến trúc áp dụng] | [Lệnh đã xác minh] | NOT_RUN | [Chưa có] |

Ghi PASS / FAIL / SKIPPED / NOT_RUN / BLOCKED / N/A có lý do. Manual checks ghi người chạy, môi trường và kết quả. Required CI phải gắn với commit bàn giao.

## 5. Open Issues Và Approval

| Vấn đề / assumption | Bằng chứng / phương án | Người có quyền quyết định | Quyết định |
| :--- | :--- | :--- | :--- |
| [Mục còn mở hoặc không có] | [Thông tin] | [Owner] | [Pending / quyết định đã xác nhận] |

- Plan revision được duyệt: [Revision hoặc bản ghi nhận diện nội dung].
- Approval evidence: [Developer hoặc reviewer được ủy quyền, thời điểm, nguồn approval].
- Chỉ chuyển `approved` sau approval rõ ràng và giải quyết các vấn đề cần quyết định; thay scope/risk/contracts/nghiệp vụ cần duyệt lại phần thay đổi.

## 6. Execution Checkpoint / Handoff

- Đã làm / checks đã chạy / findings còn mở: [Trạng thái thật và bằng chứng].
- Branch / revision / staged scope / conditional commit: [Thông tin đã xác minh].
- DoD / bước tiếp theo / authority: [Pending items; link handoff khi cần].
- Chỉ chuyển `completed` khi đạt Standard DoD.
