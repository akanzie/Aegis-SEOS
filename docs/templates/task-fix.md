---
task_id: task-N
approval_status: pending
approved_revision: null
execution_status: not_started
closed_at: null
merged_at: null
critical_flow: "[P0 | P1 | P2 | P3 | P4]"
risk_level: "[CRITICAL | HIGH | MEDIUM | LOW | TRIVIAL]"
spec_impact: "[NONE | CLARIFICATION | CHANGE | CONFLICT]"
depends_on: []
created_by: "[author]"
approved_by: null
approved_at: null
---

# Task N: Sửa [Hành vi lỗi]

## 1. Nguồn Nghiệm Thu

- Yêu cầu gốc / batch prompt: [Đường dẫn hoặc ticket].
- Spec active / Context Package: [Nguồn đã xác minh; ghi rõ nếu không có package phù hợp].
- Actual / expected: [Điều kiện, hành vi lỗi và hành vi đúng theo spec].

| AC | Hành vi quan sát được theo acceptance source | Check bảo vệ ý định |
| :--- | :--- | :--- |
| AC-1 | [Điều kiện -> kết quả quan sát được, pass/fail rõ] | [AUTOMATED_TEST / STATIC_CHECK / E2E / MANUAL] |

Task cần ít nhất một AC hoàn chỉnh, không còn placeholder, và verification matrix phải bao phủ từng AC. Bao gồm happy path, boundary, error path và auth/concurrency/compatibility khi áp dụng.

## 2. Điều Tra Và Root Cause

- Baseline: [Branch, HEAD, thay đổi có sẵn cần bảo toàn].
- Reproduction: [Kịch bản an toàn, kết quả và bằng chứng đã làm sạch].
- Trace: [File:symbol, callers, dependencies, exports, shared contracts].
- Root cause: [Kết luận có bằng chứng; nếu chưa rõ giữ trong Open Issues].
- Blast radius / risk: [Áp dụng mức cao nhất; nêu tác động P0/P1 nếu có].
- Spec Impact: [Giải thích; conflict phải chờ Developer quyết định].

## 3. Thay Đổi Tối Thiểu

- In scope / out of scope: [Files và hành vi đã xác minh].
- Spec synchronization: [Cập nhật trước/song song khi CHANGE hoặc CLARIFICATION].
- Implementation: [Các bước sửa tối thiểu, bảo toàn invariants].
- Compatibility / recovery: [Contracts, dữ liệu, rollback khi áp dụng].
- ADR / memory: [Trigger hoặc N/A có lý do].

## 4. Verification Matrix

| AC / invariant | Kịch bản và lý do | Lệnh thực tế / manual procedure | Kết quả | Bằng chứng / revision |
| :--- | :--- | :--- | :--- | :--- |
| AC-1 | [Test fail với lỗi cũ khi khả thi] | [Đã xác minh từ project profile] | NOT_RUN | [Chưa có] |
| Fitness | [Luật kiến trúc áp dụng] | [Lệnh đã xác minh] | NOT_RUN | [Chưa có] |

Ghi PASS / FAIL / SKIPPED / NOT_RUN / BLOCKED / N/A có lý do. Manual checks ghi người chạy, môi trường và kết quả. Không coi local là required CI trên commit bàn giao.

## 5. Open Issues Và Approval

| Vấn đề / assumption | Bằng chứng / phương án | Người có quyền quyết định | Quyết định |
| :--- | :--- | :--- | :--- |
| [Mục còn mở hoặc không có] | [Thông tin] | [Owner] | [Pending / quyết định đã xác nhận] |

- Plan revision được duyệt (`approved_revision`): [Revision hoặc bản ghi nhận diện nội dung].
- Approval evidence: [Developer hoặc reviewer được ủy quyền, timestamp có timezone, nguồn approval].
- Chỉ đặt `approval_status: approved` khi có approval rõ ràng đúng revision và giải quyết các vấn đề cần quyết định. `execution_status` chuyển độc lập theo [Task Lifecycle](../operations/task-lifecycle.md).

## 6. Execution Checkpoint / Handoff

### Scope change (khi áp dụng)

- Current diff/branch/HEAD/baseline và blocker: [Evidence; giữ diff/checkpoint].
- Change request / AC-contract-risk-dependencies bị ảnh hưởng: [Delta và lý do].
- Approval/evidence nào bị revoke, phần nào còn hiệu lực: [Revision/scope; lưu lịch sử].
- Plan/AC/verification cập nhật, authority duyệt delta và reviewer: [Evidence/revision].
- Re-verification và next action: [Checks cần chạy trước resume].

- Đã làm / checks đã chạy / findings còn mở: [Trạng thái thật và bằng chứng].
- Branch / revision / staged scope / conditional commit: [Thông tin đã xác minh].
- DoD / bước tiếp theo / authority: [Pending items; link handoff khi cần].
- Chỉ chuyển `execution_status: completed` khi đạt Standard DoD, lifecycle review và close sequence; không để skipped/not run thành PASS.
- Self-review trước handoff: AC/evidence khớp revision; không xóa/skip tests, dùng `.only`, giảm discovery/coverage, thêm exclusion/suppression không hỗ trợ hoặc fallback âm thầm; ghi scope và replacement evidence cho ngoại lệ đã duyệt.
