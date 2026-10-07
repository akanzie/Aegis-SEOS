# Handoff Contract: Task, Session Và Pull Request

Bàn giao có độ dài tương xứng thay đổi. Task nhỏ chỉ cần tóm tắt và verification; task phức tạp dùng bảng AC. Không cần tạo PR cho mọi task; tạo/push/merge/deploy vẫn theo quyền được cấp.

## Nội dung cần có

1. **What/Why**: Vấn đề, kết quả đạt được, scope và Spec Impact; link yêu cầu/approved plan/spec liên quan.
2. **Revision & Baseline**: Branch, HEAD/revision được kiểm tra, baseline giữ nguyên; với PR ghi source/target SHA và phạm vi diff.
3. **AC Evidence**: AC -> hành vi -> check -> kết quả -> bằng chứng, theo verification.md.
4. **Reviewer Attention**: Vị trí và lý do cần xem kỹ (nghiệp vụ, security, schema, contracts, fallback); không tuyên bố máy đã chứng minh UI hoặc mọi security invariant.
5. **Open Items & Recovery**: Findings còn mở, manual checks, rủi ro/giới hạn và rollback khi áp dụng. Ghi trạng thái thật: completed, pending verification, blocked hoặc ready for review; ready for review không đồng nghĩa merge-ready.
6. **Next Authority**: Bước tiếp theo và chủ thể có quyền approve/merge/deploy. Kết luận merge-ready chỉ sau Merge Review Gate đạt trên đúng source/target SHA.

```markdown
| AC | Expected behavior | Verification | Result | Evidence |
| :--- | :--- | :--- | :--- | :--- |
| AC-1 | <observable outcome> | <test/check/manual> | <actual status> | <location/revision> |
```

Thông tin bàn giao không chứa secrets, auth headers hoặc PII thô. Session chưa hoàn tất cần lưu checkpoint trong task với bước đã làm, bằng chứng, blocker và bước tiếp theo; không thay plan approved âm thầm.
