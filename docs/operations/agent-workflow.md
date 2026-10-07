# Agent Workflow: Mode Và Cold-start

[AGENTS](../../AGENTS.md) giữ quyền và quality gates. Tài liệu này sở hữu mode/permission và cold-start/resume, áp dụng cho mọi stack, nhà cung cấp AI và công cụ. Các tài liệu dẫn xuất không cấp quyền mới.

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


## 2. Cold-start / resume


1. Xác nhận task/request, mode, track và lifecycle output/DoD; đọc AGENTS và plan đúng scope.
2. Kiểm tra branch, HEAD, index và baseline; ghi nhận trước khi sửa.
3. Đối chiếu approval authority/time/revision với scope hiện hành; status không tự chứng minh approval.
4. Xác nhận dependencies bằng result/contract và revision evidence.
5. Đọc project profile, ACTIVE_VERSION/spec/package, boundaries và memory liên quan; nếu thiếu package ghi rõ và đọc tối thiểu theo AGENTS §8; không nạp archive/package ngoại vi.
6. Kiểm tra AC, lệnh verification, gates và reviewer độc lập khi áp dụng.
7. Resume: so checkpoint với branch/HEAD/diff, approval, dependencies, checks và findings; evidence cũ bị ảnh hưởng cần verify lại. Ghi next action/authority.
8. Nếu gặp giả định/mơ hồ cần quyết định hoặc finding ngoài scope: ghi evidence, impact và owner trong Open Issues/checkpoint của task; giữ nguyên scope đã duyệt, hỏi authority hoặc escalate theo AGENTS §4. Không tự quyết hoặc triển khai phần phụ thuộc quyết định còn mở.


### Điều phối task và tài nguyên

- Request folder là namespace của `task_id` và `depends_on`; mỗi ID duy nhất trong folder đó. Trước khi giao task, ghi owner chịu trách nhiệm, write scope (đường dẫn/tài nguyên được phép sửa), branch và worktree trong task record.
- Dependency chỉ cho phép bắt đầu khi thỏa readiness tại [Task Lifecycle](task-lifecycle.md#dependency-readiness-and-checkpoints): approval còn bao revision/contract được dùng, execution đã `completed`, và output/evidence được link tới revision đó. Thiếu hoặc lệch điều kiện nào thì dừng task phụ thuộc và báo authority; không suy từ status riêng lẻ.
- Chạy song song chỉ khi mỗi task có worktree riêng và write scope/tài nguyên không xung đột. Nếu dùng chung checkout hoặc tài nguyên ghi chung, chạy tuần tự. Không để nhiều owner ghi vào cùng checkout.
- Task có thể qua nhiều session. Kết thúc session tại checkpoint có ý nghĩa và cập nhật task record; không tạo handoff riêng cho mỗi bước nhỏ. Handoff session chỉ trỏ checkpoint hiện hành và bổ sung finding/evidence mới theo [Handoff Contract](handoff-contract.md).

## 3. Handoff giữa các session


Session mới nhận task/request, approval record, execution status, branch/revision, baseline, AC evidence, findings và next action từ repository/handoff được yêu cầu. Không dựa ký ức chat. Chỉ đọc đúng scope và kiểm tra artifact còn khớp trạng thái thực tế trước tiếp tục.

Task phụ thuộc phải dùng kết quả/contract tiền đề đã được xác nhận. Nếu chạy đồng thời, dùng worktree và branch riêng, ghi ownership; không để nhiều agent ghi cùng checkout. Không tự tích hợp/merge khi chưa được phép.

## Liên kết tương thích

Các anchor cũ giữ để truy vết task records; chỉ đọc owner khi có trigger.

<a id="lifecycle-transitions"></a>

- Approval/transitions: [Task Lifecycle](task-lifecycle.md#lifecycle-transitions).
<a id="close-sequence"></a>

- Close sequence: [Task Lifecycle](task-lifecycle.md#close-sequence).
<a id="independent-review"></a>

- Reviewer independence và findings: [Review & Rework](review-rework.md#independent-review).
