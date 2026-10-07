# Đặc Tả Chức Năng: [Tên tính năng]

- Trạng thái bản đề xuất / owner / revision: [Thông tin].
- Nguồn yêu cầu / approval: [Ticket/task/quyết định đã xác nhận hoặc pending].

Bản đề xuất chưa duyệt lưu tại task, chưa là spec canonical. Chỉ cập nhật spec active theo approved task hoặc approved business override; không tự hợp thức hóa code lệch spec.

## 1. Mục Đích Và Bối Cảnh Nghiệp Vụ

[Người dùng, vấn đề cần giải quyết và kết quả mong muốn.]

## 2. User Flows Và Interactions

[Điều kiện trước, các bước từ góc nhìn người dùng và kết quả cuối.]

## 3. Business Rules Và Invariants

- BR-1: [Quy tắc deterministic, điều kiện và kết quả].
- [Quyền truy cập, ownership dữ liệu, compatibility khi liên quan].

## 4. Edge Cases Và Error Paths

| Điều kiện | Hành vi mong đợi | Invariant được bảo toàn |
| :--- | :--- | :--- |
| [Input rỗng / lỗi mạng / concurrency khi liên quan] | [Kết quả] | [Quy tắc] |

## 5. Acceptance Criteria

| AC | Điều kiện | Kết quả pass/fail quan sát được | Ý định kiểm chứng |
| :--- | :--- | :--- | :--- |
| AC-1 | [Khi ...] | [Thì ...] | [AUTOMATED_TEST / STATIC_CHECK / E2E / MANUAL] |

## 6. Open Questions Và Spec Impact

- [Quyết định còn thiếu, owner; không lấp bằng giả định].
- Spec Impact / task liên quan: [NONE / CLARIFICATION / CHANGE / CONFLICT và lý do].
- [Thay đổi so với spec trước, approval và compatibility khi áp dụng].
