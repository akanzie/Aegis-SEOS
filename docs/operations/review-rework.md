# Review & Rework

Owner của severity, reviewer independence và mapping findings theo [AGENTS](../../AGENTS.md). Chỉ nạp khi review/rework hoặc khi trigger review độc lập áp dụng. Permission ở [Agent Workflow](agent-workflow.md); approval/transitions ở [Task Lifecycle](task-lifecycle.md).

## Finding severity

| Severity | Tiêu chí áp dụng |
| :--- | :--- |
| `CRITICAL` | Đe dọa system survival/security, privacy hoặc trust boundary; dừng hành động phụ thuộc, báo AGENTS §4 |
| `HIGH` | Có thể cấp sai quyền/gate, phá public contract hoặc gây sai/mất dữ liệu đáng kể; blocker phần ảnh hưởng |
| `MEDIUM` | Sai hành vi/thiếu evidence ảnh hưởng AC nhưng chưa có tác động cao hơn; cần rework hoặc quyết định |
| `LOW` | Vấn đề cục bộ về clarity, format hoặc bảo trì; hành động tương xứng |
| `INFO` | Quan sát/giới hạn evidence chưa chứng minh lỗi; không che blocker |

Chọn severity cao nhất có bằng chứng. Blocker còn phụ thuộc AC, required gates và escalation.


<a id="independent-review"></a>
### Independent review

Author tự review trước handoff: đối chiếu từng AC với thay đổi và kết quả thực tế; rà test/gate changes để phát hiện test bị xóa/skip, `.only`, discovery/coverage bị thu hẹp, validator exclusion/suppression không hỗ trợ hoặc fallback âm thầm; xác nhận ngoại lệ (nếu được duyệt) có scope và replacement evidence; rà unresolved assumptions, policy links và diff ngoài scope. Ghi revision cùng checklist/kết quả; self-review không thay independent review.

| Trigger | Phạm vi và thời điểm |
| :--- | :--- |
| P0/P1 hoặc risk HIGH/CRITICAL | Review plan/decisions trước approval/execution; review implementation/evidence trước completed |
| Auth/payment/trust boundary/public contract/schema/migration/seed hoặc quyền/gate/risk policy | Review decision, contracts/invariants và implementation/evidence bị ảnh hưởng bất kể risk label |
| Không có trigger trên | Review theo AC/yêu cầu; gates/verification vẫn bắt buộc |
| PR/MR review | Thêm Merge Review Gate 10 câu trên source/target SHA; không thay independent review |

Reviewer independent là người/session khác plan author và implementer, không tham gia decision/implementation đang review, ở mode REVIEW read-only, truy cập đủ evidence và báo findings. Developer có thể review nếu thỏa independence. Đổi session nhưng vẫn author/implementer không tạo independence. Reviewer chỉ approve khi Developer ủy quyền riêng. Thiếu reviewer đủ điều kiện thì `blocked` hoặc pending review, không completed; không tự tạo quyền delegation/công cụ.

Với một operator, có thể dùng một reviewer session riêng chỉ khi session đó chưa tham gia soạn quyết định hoặc implementation, được cấp plan/diff/checks/evidence cần thiết, và chỉ làm REVIEW read-only. Cùng người vận hành không tự làm reviewer độc lập nếu họ đã là author/implementer. AI reviewer chỉ báo findings; không cấp task approval, exception, merge hoặc deploy authority. Ghi reviewer identity/session, scope, SHA và findings.


## Review và rework


Mỗi finding cần ID ổn định, mức độ, vị trí, tác động và hành động cần thực hiện. Rework ánh xạ từng ID sang thay đổi và bằng chứng; mục không xử lý phải nêu lý do để reviewer/Developer quyết định, không tự đánh dấu resolved.

Review lại phần bị ảnh hưởng và regression liên quan. Nếu source/target SHA hoặc artifact được review thay đổi, kết luận cũ không tự áp dụng. Review trước merge vẫn phải trả lời đủ 10 câu trong [Merge Review](merge-review.md#merge-review-gate).
