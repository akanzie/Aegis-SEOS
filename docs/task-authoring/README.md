# Task Authoring: Từ Yêu Cầu Đến Approved Plan

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
status: draft
critical_flow: P2
risk_level: MEDIUM
spec_impact: NONE
depends_on: []
created_by: <author>
approved_by: null
approved_at: null
```

Spec Impact dùng thống nhất `NONE | CLARIFICATION | CHANGE | CONFLICT`. Risk dùng `TRIVIAL | LOW | MEDIUM | HIGH | CRITICAL`, tương ứng P4 đến P0; ghi mức cao nhất của blast radius.

Plan cần: yêu cầu gốc/AC/spec active; root cause hoặc thiết kế có bằng chứng; scope và callers/contracts bị ảnh hưởng; thay đổi tối thiểu; test matrix và lệnh thật; compatibility/rollback khi cần; Open Issues nếu còn. Approval nhận diện nội dung plan được duyệt bằng revision hoặc bản ghi rõ ràng. Còn vấn đề cần quyết định thì giữ draft.

Không yêu cầu manifest JSON, hash, DAG scheduler hoặc pipeline riêng cho task thủ công. Mục tiêu là traceability đủ dùng.
