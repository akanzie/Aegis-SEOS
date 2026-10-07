# Task Authoring: Từ Yêu Cầu Đến Approved Plan

Mẫu dùng trực tiếp: [Batch prompt](../templates/batch-prompt.md), [Task fix](../templates/task-fix.md), [Task feature](../templates/task-feat.md). Copy tới `docs/tasks/<request>/`, điền bằng chứng thực tế và giữ `approval_status: pending`, `execution_status: not_started` tới khi được duyệt.

## 1. Chuẩn hóa yêu cầu trong COMPOSE

Phân biệt FACT (quan sát/bằng chứng), REQUIREMENT (mong muốn), ASSUMPTION (cần xác minh) và OPEN QUESTION (quyết định còn thiếu). Không biến giả định thành yêu cầu; không phát minh tính năng hoặc nguyên nhân kỹ thuật để lấp mẫu.

Prompt chỉ cần intent, actual/expected và AC quan sát được. Thêm scope, invariants, risk P0–P4 và dependencies khi có ý nghĩa. Không đoán file code/test hay lệnh chưa được xác minh; investigator tìm vị trí thật.

AC mô tả hành vi với điều kiện và kết quả pass/fail rõ ràng. Gắn ý định kiểm chứng `AUTOMATED_TEST`, `STATIC_CHECK`, `E2E` hoặc `MANUAL`; chưa có bằng chứng thì không ghi PASS. Ví dụ: “Khi mất mạng, thao tác đã xác nhận không bị mất sau tải lại”, thay vì “viết hook tối ưu”.

## 2. Phân rã theo kết quả

- Mặc định một task cho một mục tiêu có thể nghiệm thu; giữ code, tests và docs của mục tiêu đó cùng task.
- Chỉ tách khi kết quả có thể điều tra, thực thi và nghiệm thu độc lập; không chia chỉ theo DB/service/UI/tests.
- Task quá lớn được tách theo hành vi hoặc giai đoạn chuyển đổi có trạng thái trung gian an toàn và tiêu chí riêng.
- Ghi `depends_on` nếu task dùng contract/kết quả tiền đề. Dependencies phải tồn tại và không có chu trình. Chỉ chạy song song khi không xung đột ownership hoặc dữ liệu đang thay đổi.

## 3. Plan sau INVESTIGATE

Mẫu metadata tối thiểu; bỏ trường tùy chọn nếu không áp dụng:

```yaml
task_id: task-1
approval_status: pending
approved_by: null
approved_at: null
approved_revision: null
execution_status: not_started
closed_at: null
merged_at: null
critical_flow: P2
risk_level: MEDIUM
spec_impact: NONE
depends_on: []
created_by: <author>
```

Risk dùng `TRIVIAL | LOW | MEDIUM | HIGH | CRITICAL`, tương ứng P4 đến P0; ghi mức cao nhất của blast radius.

Plan cần: yêu cầu gốc/AC/spec active; root cause hoặc thiết kế có bằng chứng; scope và callers/contracts bị ảnh hưởng; thay đổi tối thiểu; test matrix và lệnh thật; compatibility/rollback khi cần; Open Issues nếu còn. Approval độc lập execution, nhận diện nội dung được duyệt qua `approved_revision`; ghi người duyệt và timestamp có timezone, không suy đoán metadata. Còn Open Issues cần quyết định thì giữ `approval_status: pending`. Hai status trục cũ có compatibility tại [Task Lifecycle](../operations/task-lifecycle.md#lifecycle-transitions).

Không yêu cầu manifest JSON, hash, DAG scheduler hoặc pipeline riêng cho task thủ công. Mục tiêu là traceability đủ dùng.

<a id="spec-impact"></a>
## Spec Impact

Dùng đúng một giá trị và phân loại theo business contract đã được xác nhận:

- **`NONE`**: Task không thay đổi business behavior/contract đã cam kết. Ghi rõ lý do; ví dụ, sửa lỗi triển khai để khớp spec hiện hành.
- **`CLARIFICATION`**: Behavior hiện có đã được xác nhận là đúng, nhưng spec chưa diễn đạt rõ một edge case; cập nhật spec để mô tả behavior đó mà không đổi behavior.
- **`CHANGE`**: Yêu cầu làm thay đổi business behavior/contract; cập nhật spec theo approval trước hoặc cùng implementation.
- **`CONFLICT`**: Spec mâu thuẫn với behavior/requirement cần thiết; dừng phần phụ thuộc và yêu cầu Developer quyết định trước khi sửa.

Thiếu mô tả hoặc chưa xác nhận behavior không tự đủ căn cứ cho `CLARIFICATION`; giữ câu hỏi trong Open Issues. Đây là định nghĩa canonical cho task plans và SOP.
