# Yêu cầu: Làm rõ chia task, dependency và handoff

- Mode: COMPOSE; session tiếp theo là INVESTIGATE.
- Người yêu cầu / ngày: Developer / 2026-10-07.
- Ticket hoặc yêu cầu gốc: Review quy trình task/handoff và chấp thuận các đề xuất trong review.

## 1. Intent Và Hiện Trạng

- FACT: Docs hiện yêu cầu task theo kết quả nghiệm thu, ghi `depends_on`, dùng worktree khi chạy đồng thời và lưu checkpoint để resume. Chưa có tiêu chí thực hành để đánh giá task vừa một session, giao ownership, chọn checkpoint hiện hành; task validator chưa kiểm tra dependency.
- REQUIREMENT: Làm quy trình chia/giao/resume task tự đủ ngữ cảnh, biểu diễn được dependency và giảm giấy tờ lặp cho một operator.
- ASSUMPTION: Giữ quy trình thủ công gọn; chỉ thêm automation deterministic có thể kiểm tra từ task records hiện có.
- OPEN QUESTION: Không có câu hỏi nghiệp vụ còn mở; chi tiết kỹ thuật validator cần xác minh trong investigation.

## 2. Phạm Vi Và Ràng Buộc

- In scope: Task sizing/gộp; task cold-start; dependency readiness và ownership; checkpoint hiện hành; xử lý uncertainty/out-of-scope; quy trình một operator; validator dependency và tests tương ứng.
- Out of scope: Thay approval authority, quality gates, risk taxonomy, merge/deploy authority, functional behavior hoặc kiến trúc runtime.
- Invariants: AGENTS.md là authority; mọi task Standard cần approval đúng revision; dependency không suy từ status; không giảm gate/review; không dựa vào ký ức chat.
- Critical flow / risk: Chưa xác minh; docs thay đổi có thể ảnh hưởng policy P0/P1 nên không dùng Fast Track.
- Dependencies: Task 2 phụ thuộc contract được chấp thuận ở Task 1.

## 3. Acceptance Criteria

| AC | Điều kiện | Kết quả quan sát được / pass-fail | Ý định kiểm chứng |
| :--- | :--- | :--- | :--- |
| AC-1 | Một agent bắt đầu session trống từ task bất kỳ trong scope | Tiêu chí task vừa sức, gộp/tách và cold-start nêu cụ thể, có ví dụ task cỡ vừa | STATIC_CHECK |
| AC-2 | Hai task cần chạy tuần tự hoặc song song | Ownership, dependency readiness, conflict scope và handoff contract được biểu diễn đủ để operator điều phối | STATIC_CHECK |
| AC-3 | Session bị ngắt hoặc phát hiện bất định/việc ngoài scope | Có một nơi checkpoint hiện hành, next action và quy tắc hỏi/dừng/escalate/ghi finding | STATIC_CHECK |
| AC-4 | Request có dependency thiếu hoặc chu trình | Validator phát hiện và test có fixture âm/dương phù hợp; không cần DAG scheduler | AUTOMATED_TEST |
| AC-5 | Thay đổi docs/validator hoàn tất | Required tests, task/doc validators và architecture fitness có evidence theo profile | AUTOMATED_TEST |

## 4. Đầu Ra Điều Tra

Xác minh owner docs, task templates, validator parsing và test harness. Tạo Task 1 cho quy trình/format records; Task 2 cho validation dependency, phụ thuộc Task 1. Mỗi task có plan revision riêng, scope, AC, commands, risk và verification matrix. Chưa sửa runtime/canonical policy trước approval.
