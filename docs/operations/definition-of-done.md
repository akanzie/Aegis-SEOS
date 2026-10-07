# Definition of Done

[AGENTS §5](../../AGENTS.md) phân quyền chi tiết DoD cho tài liệu này; applicability và quyền miễn gate vẫn thuộc AGENTS §5.D. Chỉ EXECUTE nạp profile tương ứng. Approval và close sequence thuộc [Task Lifecycle](task-lifecycle.md); review độc lập thuộc [Review & Rework](review-rework.md#independent-review).

### A. Standard DoD (Áp dụng cho Standard 3-Step Path)

1. **Approved Task**: Task plan (`task-*-fix.md` hoặc `task-*-feat.md`) có approval record hợp lệ cho revision/scope hiện hành (`approval_status: approved`); agent không tự duyệt. Approval độc lập execution và được giữ khi completed.
2. **Spec Synchronized**: Đặc tả nghiệp vụ (`docs/main_docs/<ACTIVE_VERSION>/fn/`) đã được cập nhật đồng bộ nếu có thay đổi hành vi (`Spec Impact: CHANGE/CLARIFICATION`).
3. **Automated Tests Pass**: Các checks bắt buộc theo [bảng áp dụng gate](../../AGENTS.md#quality-gate-applicability) và [ma trận kiểm thử](../standards/verification.md#risk-test-matrix) đã PASS; N/A có lý do được ghi rõ.
4. **Architecture Fitness Pass**: Gate Standard theo [bảng áp dụng](../../AGENTS.md#quality-gate-applicability) thực thi thành công với Exit code 0.
5. **No Open Assumptions**: Toàn bộ giả định mở hoặc xung đột kiến trúc/nghiệp vụ đã được giải quyết triệt để.
6. **Documentation & Memory Updated**: Đã cập nhật ADR (nếu chạm trigger), pitfalls/lessons (nếu phát hiện bẫy mới).
7. **Clean Conditional Commit**: Commit cục bộ thành công trên task branch hợp lệ (`task/*`, `feat/*`, `fix/*`, hoặc `hotfix/*`), không sót file nhạy cảm hay file rác.
8. **Evidence & Handoff**: Mỗi AC có kết quả và bằng chứng theo [Verification Standard](../standards/verification.md); hoàn tất kiểm tra bắt buộc, gồm independent review và kiểm tra thủ công khi áp dụng theo [Review & Rework](review-rework.md#independent-review). Bàn giao theo [Handoff Contract](handoff-contract.md). Không xem skipped/not run là PASS.

### B. Fast Track DoD (Áp dụng cho Fast Track Changes)

1. **Scope Validity**: Phạm vi thay đổi vẫn nằm trọn vẹn trong các trường hợp cho phép của Fast Track.
2. **No Hard Stop**: Không phát sinh bất kỳ điều kiện nào thuộc Fast Track Hard Stop.
3. **Minimal Surgical Diff**: Diff chỉ chứa thay đổi tối thiểu cần thiết cho task.
4. **Verification Pass**: Các checks bắt buộc theo [bảng áp dụng gate](../../AGENTS.md#quality-gate-applicability) đã PASS, có evidence tương xứng với thay đổi.
5. **Architecture Fitness Pass**: Fitness PASS với Exit code 0 khi [bảng áp dụng](../../AGENTS.md#quality-gate-applicability) yêu cầu; N/A được ghi rõ lý do khi bảng cho phép.
6. **No Open Assumptions**: Không còn giả định mở hoặc xung đột chưa được giải quyết.
7. **Conditional Commit**: Commit cục bộ trên task branch hợp lệ nếu task tạo ra thay đổi cần lưu trữ vào kho mã nguồn.
8. **Evidence & Handoff**: Báo cáo kiểm tra và bằng chứng tương xứng phạm vi; không bỏ qua kiểm tra thủ công cần thiết chỉ vì dùng Fast Track.

### C. Phân Định Kết Quả Theo Vòng Đời Task (Lifecycle Outputs)

- **Investigation Session**: Hoàn tất khi plan `task-N-fix.md` hoặc `task-N-feat.md` được tạo với `approval_status: pending`, `execution_status: not_started`. Không yêu cầu commit code; đây không phải execution completed.
- **Execution Task**: Hoàn tất khi đáp ứng Standard DoD (hoặc Fast Track DoD tương ứng).
- **Read-only Task**: Hoàn tất khi báo cáo, phân tích và bằng chứng xác minh đã được cung cấp (không tạo commit code).
