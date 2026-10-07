# Playbook: Quy Trình Chuẩn Điều Tra Lỗi (Bug Investigation SOP)

Playbook này hướng dẫn cách thực hiện một session điều tra (Investigation Session) tinh gọn, chính xác, không gây ảo giác.

---

## Nguyên Tắc Cốt Lõi
- **Investigation Session chỉ xuất tài liệu phân tích, KHÔNG sửa code.**
- Session budget và overflow action theo [AGENTS §8](../../AGENTS.md#context-budget).
- Chỉ đọc các files liên quan trực tiếp đến luồng bị lỗi (Context Package).
- Áp dụng [Agent Workflow](../operations/agent-workflow.md) và [Task Authoring](../task-authoring/README.md). Nếu thiếu package, ghi rõ và trace tối thiểu từ task/spec/boundaries.

---

## Quy Trình 4 Bước

### Bước 1: Tiếp Nhận & Tái Hiện (Locate & Reproduce)
1. Đọc mô tả lỗi từ batch prompt (`docs/tasks/<request-name>/prompt-dieu-tra-*.md` hoặc yêu cầu từ Dev).
2. Định vị file nguồn liên quan thông qua grep/ripgrep hoặc system map.
3. Xác định trạng thái mong muốn (Expected) vs trạng thái thực tế (Actual).

### Bước 2: Phân Tích Nguyên Nhân Gốc Rễ (Root Cause Analysis - RCA)
- Tìm đúng dòng code/logic gây ra lỗi.
- Đặt câu hỏi "Tại sao" ít nhất 3 lần để tránh sửa triệu chứng bề mặt.
- Kiểm tra xem lỗi có liên quan đến ranh giới kiến trúc hoặc dữ liệu seed/migration không.

### Bước 3: Đánh Giá Tác Động Nghiệp Vụ (Spec Impact Assessment)
Phân loại theo định nghĩa canonical trong [Task Authoring — Spec Impact](../task-authoring/README.md#spec-impact). Thiếu mô tả không tự chứng minh behavior đã được xác nhận; dừng và đưa vấn đề chưa rõ vào Open Issues.

### Bước 4: Xuất File Fix Draft (`docs/tasks/<request-name>/task-N-fix.md`)
Dùng đầy đủ [Task fix template](../templates/task-fix.md), cùng [Batch prompt](../templates/batch-prompt.md) khi cần. Task draft ghi metadata, baseline/evidence, root cause, scope/AC, Spec Impact, verification matrix, Open Issues và approval record. Nội dung trong SOP này là yêu cầu quy trình, không phải một template rút gọn.
