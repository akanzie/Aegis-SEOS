# Human Onboarding


Dành cho Developer mới tham gia hoặc tiếp nhận SEOS.

### 1. Sự Khác Biệt Giữa "Chat-and-Pray" và "AI-Native SEOS"

| Tiêu Chí | Cách Làm Tự Phát ("Chat-and-Pray") | Cách Chúng Ta Làm Việc (AI-Native SEOS) |
| :--- | :--- | :--- |
| **Bản chất cuộc chat** | Trò chuyện dài vô tận, code dở dang tích lũy trong chat | Mỗi session chat là 1 tiến trình độc lập, xong task là đóng session |
| **Nguồn sự thật** | Nằm trong đầu Dev hoặc trôi nổi trong lịch sử chat | Lưu trên đĩa (`docs/main_docs/fn/`, `system-map/`, `project-memory/`) |
| **Chi phí token** | Phình to theo thời gian, AI bắt đầu quên và sinh ảo giác | Dùng package target và session budget/overflow theo [AGENTS §8](../../AGENTS.md#context-budget) |
| **Bảo vệ kiến trúc** | Trông chờ vào trí nhớ của Dev hoặc AI | **Máy chấm tự động** (`npm run test:fitness` fail ngay nếu vi phạm) |
| **Nghiệp vụ vs Code** | Code đổi nhưng spec không đổi, sinh hàng tá bug ngầm | Bắt buộc đánh giá **Spec Impact** (`NONE/CLARIFICATION/CHANGE/CONFLICT`) |

---

### 2. Quy Trình Vận Hành Hàng Ngày (Day-to-Day Workflow)

Khi có một tính năng mới hoặc một danh sách lỗi cần sửa, bạn **KHÔNG** nhảy vào chat bảo AI code ngay. Hãy đi theo chu trình 3 bước chuẩn:

```
[BƯỚC 1: SOẠN BATCH PROMPT TẬP TRUNG]
- Dev chat gửi danh sách yêu cầu / bugs thô vào session.
- AI phân tích, bẻ nhỏ thành các tasks độc lập và TẠO 1 FILE PROMPT DUY NHẤT:
  File: docs/tasks/<request-name>/prompt-dieu-tra-<request-name>.md
  (hoặc docs/tasks/<request-name>.md)
- Dev kiểm tra lướt file prompt (hoặc đưa AI khác review phản biện) trước khi chạy.
               │
               ▼
[BƯỚC 2: SESSION ĐIỀU TRA (Investigation)]
- Mở Clean Session -> Chỉ thị: "Chạy điều tra cho Task N trong docs/tasks/.../prompt-dieu-tra-<name>.md"
- AI trace code, phân loại Spec Impact -> TỰ ĐỘNG XUẤT FILE FIX:
  File: docs/tasks/<name>/task-N-fix.md (chứa đầy đủ root cause, scope, verification plan)
               │
               ▼
[BƯỚC 3: DUYỆT & THỰC THI (Execution)]
- Dev xem plan -> Ghi approval record cho revision/scope được duyệt
- Mở Clean Session mới -> Chỉ thị: "Thực thi docs/tasks/<name>/task-N-fix.md"
- AI cập nhật Spec -> Sửa Code phẫu thuật -> Chạy test & fitness -> Tự động Commit
```

#### A. Khi Nào Dùng Luồng Nhanh (Fast Track)?
Để không bị mệt mỏi vì thủ tục, bạn được dùng **Fast Track** (không cần task file/approved Standard plan riêng; cần yêu cầu trực tiếp của Developer với scope rõ) khi thỏa mãn:
- Sửa lỗi chính tả (typo), cập nhật markdown, viết comment, format code.
- Chỉnh sửa CSS thuần túy không đổi cấu trúc layout/DOM.
- Viết bổ sung Unit test thuần túy không sửa logic runtime.
- Task read-only: Giải thích kiến trúc, trace code, review logic.
- **Quy trình Fast Track**: `Điều tra nhanh -> Sửa đổi -> Verify theo AGENTS §5.D -> Nghiệm thu Fast Track DoD -> Conditional Commit (nếu có thay đổi cần lưu trữ)`.
- **Căn cứ EXECUTE**: Standard dùng approved plan đúng revision/scope; Fast Track dùng yêu cầu trực tiếp, rõ scope của Developer khi đủ điều kiện AGENTS §3.B. Mode permission tại [Agent Workflow](../operations/agent-workflow.md).

#### B. Quy Tắc Vàng Về Git & Cam Kết Có Điều Kiện:
Theo [AGENTS §2.C](../../AGENTS.md), dùng branch task hợp lệ và giữ nguyên baseline. Index chỉ chứa thay đổi task, các gate bắt buộc theo [§5.D](../../AGENTS.md#quality-gate-applicability) đã PASS, không còn giả định mở; sau commit không còn thay đổi task chưa xử lý. Baseline được ghi nhận có thể vẫn còn trong working tree. Điều kiện đầy đủ và quyền Git thuộc AGENTS; tài liệu này chỉ hướng dẫn. Task read-only/investigation thuần túy không commit code.

---

#### C. Khi Nhận Yêu Cầu Review / Merge Request

Sau Conditional Commit và trước khi kết luận nhánh có thể merge vào `main`, thực hiện [Merge Review Gate: 10 câu hỏi bắt buộc](../operations/merge-review.md#merge-review-gate). Gate áp dụng cho cả Standard và Fast Track:

`Yêu cầu review/merge -> Xác định source/target commit và diff -> Đối chiếu ticket/spec gốc -> Trả lời 10 câu kèm bằng chứng -> Kết luận đủ/chưa đủ điều kiện merge`.

- Mỗi câu ghi `PASS`, `FAIL`, `UNVERIFIED` hoặc `N/A` có lý do; test chưa chạy, CI chưa xác minh hoặc thiếu bằng chứng không được ghi PASS.
- Chỉ kết luận đủ điều kiện merge khi đủ 10 câu, không còn blocker hoặc kiểm tra bắt buộc chưa xác minh. Nếu commit source/target thay đổi, cập nhật review và kiểm tra lại phần bị ảnh hưởng.
- Review không tự động cho phép merge/push. Chỉ merge khi Developer yêu cầu rõ ràng và gate đã đạt; nếu chưa đạt, báo cáo vấn đề và bước cần làm tiếp theo.

---

### 3. Đánh Giá Spec Impact

Mỗi khi sửa bất kỳ dòng code nào, AI bắt buộc phải trả lời câu hỏi: **"Sửa đổi này tác động gì đến tài liệu đặc tả nghiệp vụ?"**:
1. **`NONE`**: Code đang chạy sai so với spec chuẩn -> Sửa code, giữ nguyên spec.
2. **`CLARIFICATION`**: Hành vi thực tế đúng nhưng spec chưa diễn đạt rõ edge case -> Bổ sung làm rõ spec, không đổi code.
3. **`CHANGE`**: Yêu cầu nghiệp vụ thay đổi -> **Bắt buộc cập nhật spec trong `docs/main_docs/vX.X/fn/` trước hoặc song song với code**.
4. **`CONFLICT`**: Phát hiện spec và code mâu thuẫn sâu sắc -> Dừng lại, báo cáo Dev giải quyết.

---
