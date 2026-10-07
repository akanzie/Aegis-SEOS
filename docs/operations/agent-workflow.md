# Agent Workflow: Mode, Approval, Review & Rework

Mẫu artifacts theo phase: [Bộ template](../templates/README.md), [Review](../templates/review.md), [Rework](../templates/rework.md).

Áp dụng cho mọi dự án dùng SEOS, không phụ thuộc nhà cung cấp AI, IDE hoặc công cụ điều phối. AGENTS.md là hợp đồng cao nhất; tài liệu này hướng dẫn thực hiện.

## 1. Nhận diện mode và quyền

| Mode | Công việc được phép | Giới hạn |
| :--- | :--- | :--- |
| COMPOSE | Chuẩn hóa yêu cầu, viết prompt hoặc đề xuất spec | Không sửa runtime; đề xuất spec chưa được duyệt không trở thành spec canonical |
| INVESTIGATE | Trace code/spec/tests, tái hiện an toàn, viết plan draft | Không sửa runtime hoặc tự duyệt plan |
| REVIEW | Đánh giá artifact/diff và báo findings | Không sửa target đang review |
| REWORK | Xử lý findings trên artifact hoặc implementation đã được phép | Giữ quyền và scope của phase gốc; rework plan không cho phép sửa runtime |
| EXECUTE | Sửa spec/code/tests theo approved plan | Không mở rộng scope hoặc thay quyết định nghiệp vụ đã duyệt |
| READ_ONLY | Giải thích, so sánh, trace, audit | Không thay đổi repository |

Mode được xác định từ yêu cầu; nếu chưa rõ, thực hiện khảo sát read-only và làm rõ trước thao tác phụ thuộc. Fast Track vẫn phải đúng mode và không chạm Hard Stop.

## 2. Approval và checkpoints

- Standard: COMPOSE -> INVESTIGATE -> approval -> EXECUTE -> verify -> handoff. Báo cáo khi kết thúc mỗi phase.
- Approval ghi rõ người duyệt, thời điểm và phiên bản plan được duyệt. Chấp thuận rõ ràng trong chat có thể được ghi vào plan; không yêu cầu duyệt lại cùng phạm vi.
- Reviewer chỉ có quyền approve khi Developer đã ủy quyền rõ ràng. Tự review không thay thế approval hoặc review độc lập bắt buộc.
- Plan thay đổi quyết định nghiệp vụ, scope, risk hoặc contracts phải được duyệt lại phần thay đổi trước execution.
- Khi điều tra gặp mâu thuẫn/trade-off: báo ngay, ghi bằng chứng và phương án vào Open Issues; không tự chốt. Chỉ tiếp tục khảo sát read-only độc lập khi an toàn và không phụ thuộc quyết định còn mở.
- Execution gặp Hard Stop phải dừng sửa code và báo Developer.

## 3. Review và rework

Mỗi finding cần ID ổn định, mức độ, vị trí, tác động và hành động cần thực hiện. Rework ánh xạ từng ID sang thay đổi và bằng chứng; mục không xử lý phải nêu lý do để reviewer/Developer quyết định, không tự đánh dấu resolved.

Review lại phần bị ảnh hưởng và regression liên quan. Nếu source/target SHA hoặc artifact được review thay đổi, kết luận cũ không tự áp dụng. Review trước merge vẫn phải trả lời đủ 10 câu trong preflight-checklist.md.

## 4. Handoff giữa các session

Session mới nhận task/plan, approval, branch và revision, baseline, bằng chứng đã có, findings còn mở và bước tiếp theo từ repository. Không dựa vào ký ức chat. Chỉ đọc tài liệu đúng scope và kiểm tra artifact còn khớp trạng thái thực tế trước tiếp tục.

Task phụ thuộc phải dùng kết quả/contract tiền đề đã được xác nhận. Nếu chạy đồng thời, dùng worktree và branch riêng, ghi ownership; không để nhiều agent ghi cùng checkout. Không tự tích hợp/merge khi chưa được phép.
