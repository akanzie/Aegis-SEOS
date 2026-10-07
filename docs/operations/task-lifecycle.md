# Task Lifecycle: Approval, Transitions Và Close Sequence

Owner của approval record, execution transitions và close sequence theo [AGENTS](../../AGENTS.md). Nạp khi duyệt, thay scope, đổi status, resume evidence hoặc đóng task. [Agent Workflow](agent-workflow.md) giữ mode/permission; [Review & Rework](review-rework.md) giữ reviewer independence.

## Approval và checkpoints


- Standard: COMPOSE -> INVESTIGATE -> approval -> EXECUTE -> verify -> handoff. Báo cáo khi kết thúc mỗi phase.
- Approval là record độc lập execution status: `approval_status` (`pending`, `approved`, `revoked`), `approved_by`, `approved_at`, `approved_revision`. Approval chat rõ ràng có thể được ghi lại cùng issuer/time/revision/evidence; không bắt buộc duyệt lại cùng scope/revision.
- Execution dùng `execution_status`: `not_started`, `in_progress`, `blocked`, `pending_verification`, `failed`, `cancelled`, `completed`, `superseded`. Bảng canonical về transition, actor, precondition và diff/evidence retention nằm trong tài liệu này; [Tasks & Work In Progress](../tasks/README.md#task-lifecycle) tóm tắt và dẫn về đây.
- Reviewer chỉ có quyền approve khi Developer đã ủy quyền rõ ràng. Tự review không thay thế approval hoặc review độc lập bắt buộc.
- Completed không xóa/rewrite approval; `closed_at` ghi thời điểm completed/cancelled/superseded, `merged_at` riêng khi có merge thật. `ready for review` là nhãn handoff, không phải execution status hoặc completed.
- Plan đổi decision/scope/AC/risk/contracts: lưu diff/checkpoint, ghi change request và phần AC/contracts/dependencies bị ảnh hưởng; chỉ revoke approval/evidence của phần không còn được bao phủ, giữ lịch sử phần không đổi. Cập nhật plan/verification, duyệt delta trước execution phụ thuộc rồi verify lại phần bị ảnh hưởng.
- Khi điều tra gặp mâu thuẫn/trade-off: báo ngay, ghi bằng chứng và phương án vào Open Issues; không tự chốt. Chỉ tiếp tục khảo sát read-only độc lập khi an toàn và không phụ thuộc quyết định còn mở.
- Hard Stop loại trừ Fast Track; quay về Standard theo đoạn trên. Escalation tại AGENTS §4 dừng phần execution phụ thuộc quyết định mở trên mọi track, không xóa diff.


<a id="lifecycle-transitions"></a>
### Lifecycle transitions

Approval transitions: `pending -> approved` khi authority duyệt đúng revision và Open Issues liên quan đã giải quyết; `approved -> revoked` khi review xác định approval không còn bao phủ delta; delta sau đó quay `pending -> approved`. Giữ issuer, timestamp, revision, scope và evidence trong log/checkpoint; agent chỉ ghi nhận approval nhận được.

| Execution status | Chuyển tiếp hợp lệ | Actor / điều kiện | Giữ diff và evidence |
| :--- | :--- | :--- | :--- |
| `not_started` | `in_progress`, `cancelled`, `superseded` | Owner chỉ bắt đầu Standard khi approval đúng revision/scope; Fast Track dùng request hợp lệ. Cancel/supersede do authority | Giữ plan/request, baseline, branch/diff và approval |
| `in_progress` | `blocked`, `pending_verification`, `failed`, `cancelled`, `superseded` | Owner ghi reason; pending verification khi sửa xong; failed khi check/execution thất bại; cancel/supersede do authority | Giữ checks/logs/revision, diff, checkpoint và next action |
| `blocked` | `in_progress`, `cancelled`, `superseded` | Owner ghi blocker đã gỡ; resume nếu approval/request còn bao scope, nếu không phải rework delta | Giữ checkpoint cũ và thêm evidence; không discard diff |
| `pending_verification` | `in_progress`, `blocked`, `completed`, `failed`, `cancelled`, `superseded` | Owner sửa lỗi, ghi missing environment/reviewer là blocked; completed chỉ sau DoD, required gates/review, commit và handoff | Ghi từng check/revision; NOT_RUN/SKIPPED không phải PASS |
| `failed` | `in_progress`, `cancelled`, `superseded` | Resume sau recovery; reapproval delta nếu scope/risk/contracts đổi; terminal decisions do authority | Giữ failure evidence và diff; không reset/stash |
| `cancelled`, `completed`, `superseded` | Không có transition ngược | Terminal; mở lại qua task mới hoặc approved rework record | Giữ artifacts; superseding task link task cũ |

<a id="close-sequence"></a>
### Close sequence

`closed_at` ghi khi task đóng completed/cancelled/superseded; `merged_at` chỉ ghi khi merge xảy ra. Chuẩn bị status/evidence/handoff trước commit khi có thể; chỉ xác nhận completed sau conditional commit và post-commit checks. Không bắt buộc một commit duy nhất; SHA hậu-commit có thể ghi trong handoff/chat trỏ commit chứa artifact.

## Legacy metadata compatibility

`status: draft | approved | completed` chỉ là shorthand cũ. Đối chiếu issuer/time/revision và approval evidence đúng scope trước resume; status approved/completed tự nó không chứng minh approval. Không tự migrate baseline records; metadata/handoff mới dùng hai trục approval và execution, giữ liên kết evidence lịch sử.

## Thuật ngữ

Track là Standard/Fast Track, không thay mode; phase là bước soạn/điều tra/duyệt/thực thi/verify/handoff; task là kết quả có scope/AC độc lập qua nhiều session; session là tiến trình dùng một lần, resume từ artifacts đã xác minh. Lifecycle output/DoD profile theo [DoD](definition-of-done.md); finding severity khác risk task và không cấp quyền bypass.
