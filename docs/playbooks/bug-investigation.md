# Playbook: Quy Trình Chuẩn Điều Tra Lỗi (Bug Investigation SOP)

Playbook này hướng dẫn cách thực hiện một session điều tra (Investigation Session) tinh gọn, chính xác, không gây ảo giác.

---

## Nguyên Tắc Cốt Lõi
- **Investigation Session chỉ xuất tài liệu phân tích, KHÔNG sửa code.**
- Giữ Token Budget trong ngưỡng `<= 30k tokens`.
- Chỉ đọc các files liên quan trực tiếp đến luồng bị lỗi (Context Package).

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
Xác định một trong 4 cấp độ:
- **`NONE`**: Code viết sai so với spec đã cam kết. Cần sửa code.
- **`CLARIFICATION`**: Spec chưa diễn đạt rõ edge case này. Cần bổ sung spec giải thích rõ.
- **`CHANGE`**: Sửa lỗi này kéo theo thay đổi luồng nghiệp vụ. Cần cập nhật spec trước/song song.
- **`CONFLICT`**: Spec và code mâu thuẫn sâu sắc. Cần Dev đưa ra phán quyết.

### Bước 4: Xuất File Fix Draft (`docs/tasks/<request-name>/task-N-fix.md`)
Tạo file fix với metadata chuẩn mực:

```markdown
---
task_id: task-N
title: "Mô tả ngắn gọn lỗi"
status: draft
spec_impact: NONE # [NONE | CLARIFICATION | CHANGE | CONFLICT]
risk_level: LOW # [LOW | MEDIUM | HIGH | CRITICAL]
target_files:
  - src/services/example.ts
---

# Task Fix: [Tiêu Đề]

## 1. Root Cause
Giải thích cụ thể tại sao lỗi xảy ra, trích dẫn file và dòng code.

## 2. Proposed Solution (Phẫu Thuật Code Tối Thiểu)
Mô tả chính xác các thay đổi cần thực hiện. Tránh refactor lan man ngoài scope.

## 3. Verification & Testing Plan
- Test case cần thêm để tái hiện và chặn hồi quy.
- Lệnh chạy kiểm tra: `npm test`, `npm run test:fitness`.
```
