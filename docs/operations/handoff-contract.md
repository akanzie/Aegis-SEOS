# Handoff Contract: Task, Session Và Pull Request

Task record là nguồn canonical duy nhất cho approval, execution status và checkpoint hiện hành. Handoff là phần bổ sung theo nhu cầu: link task/checkpoint, ghi evidence hoặc finding mới và next authority; không chép lại AC, approval, status hay evidence đã có. Một task có thể qua nhiều session, nên chỉ lập handoff khi cần truyền trạng thái có ý nghĩa (ngắt, chờ quyết định, bàn giao), không phải sau mỗi bước nhỏ.

Mẫu copy dùng trực tiếp: [Handoff](../templates/handoff.md).

Bàn giao có độ dài tương xứng thay đổi. Task nhỏ chỉ cần tóm tắt và verification; task phức tạp dùng bảng AC. Không cần tạo PR cho mọi task; tạo/push/merge/deploy vẫn theo quyền được cấp.

## Nội dung cần có

1. **What/Why**: Vấn đề, kết quả đạt được, scope và Spec Impact; link yêu cầu/approved plan/spec liên quan.
2. **Revision & Baseline**: Branch, HEAD/revision được kiểm tra, baseline giữ nguyên; với PR ghi source/target SHA và phạm vi diff.
3. **AC Evidence**: AC -> hành vi -> check -> kết quả -> bằng chứng, theo verification.md.
4. **Reviewer Attention**: Vị trí và lý do cần xem kỹ (nghiệp vụ, security, schema, contracts, fallback); không tuyên bố máy đã chứng minh UI hoặc mọi security invariant.
5. **Open Items & Recovery**: Findings còn mở, manual checks, rủi ro/giới hạn và rollback khi áp dụng. Ghi riêng `approval_status`/approval revision và `execution_status`; ready for review là nhãn bàn giao, không phải lifecycle state hay merge-ready.
6. **Next Authority**: Bước tiếp theo và chủ thể có quyền approve/merge/deploy. Kết luận merge-ready chỉ sau Merge Review Gate đạt trên đúng source/target SHA.

```markdown
| AC | Expected behavior | Verification | Actual result | Evidence / revision |
| :--- | :--- | :--- | :--- | :--- |
| AC-1 | [Expected behavior from acceptance source] | [Actual command or manual scenario] | [PASS/FAIL/BLOCKED/N/A with reason] | [Evidence location and checked revision] |
```

Thông tin bàn giao không chứa secrets, auth headers hoặc PII thô. Session chưa hoàn tất cần lưu checkpoint trong task với bước đã làm, bằng chứng, blocker và bước tiếp theo; không thay plan approved âm thầm. Reviewer độc lập bắt buộc theo [decision table](review-rework.md#independent-review); ghi reviewer, scope và revision đã xem. Close order/timestamps theo [lifecycle contract](task-lifecycle.md#close-sequence).
