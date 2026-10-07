# Agent Workflow: Mode, Approval, Review & Rework

Mẫu artifacts theo phase: [Bộ template](../templates/README.md), [Review](../templates/review.md), [Rework](../templates/rework.md).

Áp dụng cho mọi dự án dùng SEOS, không phụ thuộc nhà cung cấp AI, IDE hoặc công cụ điều phối. [AGENTS.md](../../AGENTS.md) giữ quyền và quality gates; tài liệu này sở hữu định nghĩa mode, permission, approval và lifecycle. Task README/handoff/templates triển khai các định nghĩa này, không cấp quyền mới.

## 1. Nhận diện mode và quyền

| Mode | Đọc/khảo sát | Sửa target | Tạo/sửa artifact được phép |
| :--- | :--- | :--- | :--- |
| COMPOSE | Yêu cầu và nguồn đúng scope | Không sửa runtime/canonical policy/spec | Prompt, đề xuất spec; chưa duyệt không thành canonical |
| INVESTIGATE | Trace spec/code/tests, tái hiện an toàn | Không sửa implementation/canonical policy | Plan draft, evidence, Open Issues; không tự approve |
| REVIEW | Artifact/diff và nguồn nghiệm thu | Không sửa target đang review | Findings theo yêu cầu/policy; có thể trả trong chat |
| REWORK | Findings và nguồn phase gốc | Chỉ target/scope phase gốc cho phép | Mapping/checkpoint; rework plan không cấp quyền sửa runtime |
| EXECUTE | Plan/request, callers/contracts và dependencies | Theo căn cứ Standard/Fast Track bên dưới | Tests, AC evidence, metadata/checkpoint và handoff trong scope |
| READ_ONLY | Giải thích, so sánh, trace, audit | Không sửa target | Mặc định trả lời trong chat; ghi file khi Developer yêu cầu hoặc policy cho phép artifact cụ thể |

Mode xác định từ yêu cầu; nếu chưa rõ, khảo sát read-only và làm rõ trước hành động phụ thuộc. Quyền ghi báo cáo không cấp quyền sửa target, đổi mode hoặc approve. REVIEW/READ_ONLY ghi artifact phải nêu căn cứ, vị trí và revision; không cần tạo file/commit chỉ để báo cáo trong chat.

EXECUTE có hai căn cứ:

- **Standard**: approved plan bao phủ đúng revision, scope/AC/risk/contracts hiện hành; approval do Developer hoặc reviewer được Developer ủy quyền. Chưa có approval thì chỉ điều tra/soạn plan, không sửa target.
- **Fast Track**: yêu cầu trực tiếp của Developer có scope rõ và thỏa AGENTS §3.B; không cần approved plan Standard riêng. Vẫn ghi request/revision, scope/risk, checks, baseline và handoff tương xứng; vẫn đạt Fast Track DoD.

Fast Track exclusion tại AGENTS §3.B làm mất quyền dùng Fast Track: checkpoint diff và quay về Standard trước phần sửa vượt scope. Standard đã duyệt có thể sửa business logic, schema hoặc P0/P1 trong scope. Escalation trigger tại AGENTS §4 áp dụng mọi track: dừng hành động phụ thuộc quyết định còn mở và báo evidence; chỉ tiếp tục khảo sát độc lập an toàn. Hai loại trigger không thay thế nhau.

### Glossary và mức độ finding

| Thuật ngữ | Ý nghĩa |
| :--- | :--- |
| Track | Quy trình `Standard` hoặc `Fast Track`; không thay mode |
| Phase | Bước như soạn yêu cầu, điều tra, duyệt, thực thi, verify và bàn giao |
| Task | Kết quả có AC và scope độc lập, có thể trải qua nhiều session |
| Session | Tiến trình AI dùng một lần; resume từ artifacts đã xác minh |
| Lifecycle output / DoD profile | Đầu ra COMPOSE/INVESTIGATE/REVIEW/READ_ONLY hoặc execution Standard/Fast Track theo AGENTS §5 |
| Finding severity | Mức tác động của finding; khác risk task và không cấp quyền bypass |

| Severity | Tiêu chí áp dụng |
| :--- | :--- |
| `CRITICAL` | Đe dọa system survival/security, privacy hoặc trust boundary; dừng hành động phụ thuộc, báo AGENTS §4 |
| `HIGH` | Có thể cấp sai quyền/gate, phá public contract hoặc gây sai/mất dữ liệu đáng kể; blocker phần ảnh hưởng |
| `MEDIUM` | Sai hành vi/thiếu evidence ảnh hưởng AC nhưng chưa có tác động cao hơn; cần rework hoặc quyết định |
| `LOW` | Vấn đề cục bộ về clarity, format hoặc bảo trì; hành động tương xứng |
| `INFO` | Quan sát/giới hạn evidence chưa chứng minh lỗi; không che blocker |

Chọn severity cao nhất có bằng chứng. Blocker còn phụ thuộc AC, required gates và escalation.

## 2. Approval và checkpoints

- Standard: COMPOSE -> INVESTIGATE -> approval -> EXECUTE -> verify -> handoff. Báo cáo khi kết thúc mỗi phase.
- Approval là record độc lập execution status: `approval_status` (`pending`, `approved`, `revoked`), `approved_by`, `approved_at`, `approved_revision`. Approval chat rõ ràng có thể được ghi lại cùng issuer/time/revision/evidence; không bắt buộc duyệt lại cùng scope/revision.
- Execution dùng `execution_status`: `not_started`, `in_progress`, `blocked`, `pending_verification`, `failed`, `cancelled`, `completed`, `superseded`. Bảng canonical về transition, actor, precondition và diff/evidence retention nằm trong workflow này; [Tasks & Work In Progress](../tasks/README.md#task-lifecycle) tóm tắt và dẫn về đây.
- Reviewer chỉ có quyền approve khi Developer đã ủy quyền rõ ràng. Tự review không thay thế approval hoặc review độc lập bắt buộc.
- Completed không xóa/rewrite approval; `closed_at` ghi thời điểm completed/cancelled/superseded, `merged_at` riêng khi có merge thật. `ready for review` là nhãn handoff, không phải execution status hoặc completed.
- Plan đổi decision/scope/AC/risk/contracts: lưu diff/checkpoint, ghi change request và phần AC/contracts/dependencies bị ảnh hưởng; chỉ revoke approval/evidence của phần không còn được bao phủ, giữ lịch sử phần không đổi. Cập nhật plan/verification, duyệt delta trước execution phụ thuộc rồi verify lại phần bị ảnh hưởng.
- Khi điều tra gặp mâu thuẫn/trade-off: báo ngay, ghi bằng chứng và phương án vào Open Issues; không tự chốt. Chỉ tiếp tục khảo sát read-only độc lập khi an toàn và không phụ thuộc quyết định còn mở.
- Hard Stop loại trừ Fast Track; quay về Standard theo đoạn trên. Escalation tại AGENTS §4 dừng phần execution phụ thuộc quyết định mở trên mọi track, không xóa diff.

### Cold-start / resume

1. Xác nhận task/request, mode, track và lifecycle output/DoD; đọc AGENTS và plan đúng scope.
2. Kiểm tra branch, HEAD, index và baseline; ghi nhận trước khi sửa.
3. Đối chiếu approval authority/time/revision với scope hiện hành; status không tự chứng minh approval.
4. Xác nhận dependencies bằng result/contract và revision evidence.
5. Đọc project profile, ACTIVE_VERSION/spec/package, boundaries và memory liên quan; nếu thiếu package ghi rõ và đọc tối thiểu theo AGENTS §8; không nạp archive/package ngoại vi.
6. Kiểm tra AC, lệnh verification, gates và reviewer độc lập khi áp dụng.
7. Resume: so checkpoint với branch/HEAD/diff, approval, dependencies, checks và findings; evidence cũ bị ảnh hưởng cần verify lại. Ghi next action/authority.

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

### Independent review

| Trigger | Phạm vi và thời điểm |
| :--- | :--- |
| P0/P1 hoặc risk HIGH/CRITICAL | Review plan/decisions trước approval/execution; review implementation/evidence trước completed |
| Auth/payment/trust boundary/public contract/schema/migration/seed hoặc quyền/gate/risk policy | Review decision, contracts/invariants và implementation/evidence bị ảnh hưởng bất kể risk label |
| Không có trigger trên | Review theo AC/yêu cầu; gates/verification vẫn bắt buộc |
| PR/MR review | Thêm Merge Review Gate 10 câu trên source/target SHA; không thay independent review |

Reviewer independent là người/session khác plan author và implementer, không tham gia decision/implementation đang review, ở mode REVIEW read-only, truy cập đủ evidence và báo findings. Developer có thể review nếu thỏa independence. Đổi session nhưng vẫn author/implementer không tạo independence. Reviewer chỉ approve khi Developer ủy quyền riêng. Thiếu reviewer đủ điều kiện thì `blocked` hoặc pending review, không completed; không tự tạo quyền delegation/công cụ.

## 3. Review và rework

Mỗi finding cần ID ổn định, mức độ, vị trí, tác động và hành động cần thực hiện. Rework ánh xạ từng ID sang thay đổi và bằng chứng; mục không xử lý phải nêu lý do để reviewer/Developer quyết định, không tự đánh dấu resolved.

Review lại phần bị ảnh hưởng và regression liên quan. Nếu source/target SHA hoặc artifact được review thay đổi, kết luận cũ không tự áp dụng. Review trước merge vẫn phải trả lời đủ 10 câu trong preflight-checklist.md.

## 4. Handoff giữa các session

Session mới nhận task/request, approval record, execution status, branch/revision, baseline, AC evidence, findings và next action từ repository/handoff được yêu cầu. Không dựa ký ức chat. Chỉ đọc đúng scope và kiểm tra artifact còn khớp trạng thái thực tế trước tiếp tục.

Task phụ thuộc phải dùng kết quả/contract tiền đề đã được xác nhận. Nếu chạy đồng thời, dùng worktree và branch riêng, ghi ownership; không để nhiều agent ghi cùng checkout. Không tự tích hợp/merge khi chưa được phép.
