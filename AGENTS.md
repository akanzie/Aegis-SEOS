# AGENTS.md — Operating Contract

Tài liệu là hệ điều hành; code là kết quả phái sinh; session AI là tiến trình dùng một lần. Đây là contract canonical cho Developer và AI Agent. Luôn nạp file này; mở chi tiết theo §10, không nạp tất cả docs.

## 0. Hierarchy of Truth

Giải quyết mâu thuẫn theo thứ tự:

1. Safety, security, privacy và boundary integrity (§2, §6).
2. Explicit Approved Developer Override trong prompt hiện tại. Chat chỉ ghi đè functional spec khi Developer tuyên bố rõ thay đổi nghiệp vụ.
3. Approved task decisions: `docs/tasks/**/task-*-fix.md`, `task-*-feat.md`; approval đúng scope/revision, độc lập execution status, được giữ sau completed. Không suy approval từ completed; metadata cũ theo [Task Lifecycle](docs/operations/task-lifecycle.md).
4. Functional specs tại `docs/main_docs/<ACTIVE_VERSION>/fn/`: Business WHAT.
5. Project memory liên quan: rejected solutions (cấm đề xuất lại), known pitfalls, technical lessons.
6. AC của task active.
7. Technical HOW: Accepted ADR còn hiệu lực -> invariants/standards -> system map -> implementation design. Approved task quyết định scope/AC, không thay Accepted ADR; thay kiến trúc cần ADR được chấp thuận và đồng bộ docs dẫn xuất trước triển khai. Profile chỉ ánh xạ stack/commands/capability, không cấp quyền hay miễn gate. HOW không làm yếu safety hoặc sửa WHAT ngầm.
8. Convention của code đang sửa.

Code/yêu cầu lệch spec: chỉ rõ khác biệt và đề xuất cập nhật spec trước/song song; không pha trộn ngầm.

## 1. Nguyên tắc làm việc

Nêu giả định; hỏi khi mơ hồ về nghiệp vụ, dữ liệu, API, security hoặc thay đổi khó đảo ngược. Quyết định kỹ thuật cục bộ ít rủi ro theo convention và ghi giả định. Xác định AC/checks trước sửa; trace callers, dependencies, exports và shared contracts; sửa tối thiểu, dọn orphan mình tạo, chỉ ghi nhận dead code ngoài scope. Không speculative code hoặc abstraction sớm. AI dùng cho judgment, không cho routing/retry/status codes/business math deterministic. Verify ý định và invariants; báo lỗi/rủi ro rõ, không suy thành công. Ưu tiên correctness > safety > đủ context verify > token; đọc có mục tiêu. Báo cáo sau mỗi phase, không sau mỗi lệnh.

## 2. Safety & Git

Không làm checks xanh bằng cách xóa/bỏ qua test, thêm `.only`, thu hẹp test discovery/coverage, nới validator exclusions, thêm suppression không được hỗ trợ, hoặc fallback im lặng. Thay đổi gate cần lý do, scope, authority và evidence thay thế được review; implementation không tự cấp ngoại lệ.

### A. Secrets và privacy

Cấm đọc, ghi hoặc in nội dung `.env`, `.env.local`, `*.key`, `*.pem`, DB credentials, JWT tokens. Được đọc `.env.example`, tên biến và env schema (`src/lib/env.ts` hoặc `src/config/env.ts`). Không log password, session token, cookie, auth header hoặc PII thô; theo [Observability](docs/standards/observability.md).

### B. Thao tác phá hủy

Không tự chạy `rm -rf`, `del /f /s /q`, `git reset --hard`, `git push --force`, drop database, format ổ đĩa hoặc ghi đè không thể phục hồi. Khi cần thao tác rủi ro cao: giải thích, đề xuất backup/rename và yêu cầu Developer duyệt.

### C. Branch và conditional commit

Trước sửa kiểm tra branch; nếu `main`/`master`, tự tạo branch `task/*`, `feat/*`, `fix/*` hoặc `hotfix/*` (production incident đã xác nhận). Không commit vào main/master. Ghi baseline trước task; không sửa, stash, reset hoặc commit baseline.

Chỉ commit khi **tất cả** điều kiện đạt: index chỉ có task changes (không rác/secrets/baseline; review staged diff); required automated checks PASS; fitness PASS Exit 0 khi §5.D bắt buộc; không còn open assumptions/conflicts; branch task hợp lệ; sau commit không còn task changes chưa xử lý. Baseline đã ghi nhận có thể còn. Không tách scope an toàn được thì dùng worktree hoặc báo Developer.

Chỉ commit nếu task tạo thay đổi cần lưu; read-only/investigation thuần không commit code. Được tạo branch/commit local; không tự push, rebase, stash, reset hoặc xóa branch nếu Developer chưa yêu cầu đích danh.

### D. Trình bày

Dùng relative paths từ repo root, không hardcode đường dẫn máy cá nhân. Không LaTeX/MathJax phức tạp; dùng text/Unicode (`~`, `>=`, `<=`, `->`, `→`).

## 3. Standard và Fast Track

Nhận diện mode theo [Agent Workflow](docs/operations/agent-workflow.md); không tự nâng quyền hoặc duyệt plan mình tạo. Approval chỉ do Developer/reviewer được ủy quyền. Stack khác ánh xạ commands qua [Project Adoption](docs/operations/project-adoption.md), không miễn gate.

### A. Standard

Tính năng mới, thay đổi nghiệp vụ, bug phức tạp, schema/DB, đa module hoặc high risk: COMPOSE -> INVESTIGATE -> Developer duyệt revision/scope -> EXECUTE -> verify/handoff. Soạn request và chia task theo [Task Authoring](docs/task-authoring/README.md); không sửa code sớm. Approval/transitions theo [Task Lifecycle](docs/operations/task-lifecycle.md).

### B. Fast Track và Hard Stop

Cho typo/Markdown, comments/format, CSS thuần không đổi DOM/layout tree, unit tests thuần không sửa runtime; read-only cũng thuộc scope nhanh. EXECUTE cần yêu cầu trực tiếp, rõ scope của Developer; không cần Standard plan riêng. Điều tra nhanh -> sửa -> verify §5.D -> Fast Track DoD -> conditional commit nếu có thay đổi.

**Hard Stop loại trừ Fast Track** khi thay Public API/route signatures; DB schema/migrations/seed; authN/authZ; business runtime logic; hoặc blast radius chạm P0/P1. Giữ checkpoint và quay về Standard trước phần vượt scope. Standard đã duyệt có thể sửa các thành phần đó trong scope; escalation §4 vẫn áp dụng mọi track.

### C. Merge review

Review PR/MR là read-only. Trả đủ [10 câu Merge Review Gate](docs/operations/merge-review.md#merge-review-gate), evidence và PASS/FAIL/UNVERIFIED/N/A có lý do trên source/target branch và SHA. Đối chiếu ticket, task/spec gốc; prompt triển khai không là nguồn nghiệm thu duy nhất. Chỉ đủ điều kiện merge khi tất cả PASS/N/A hợp lệ và không blocker/required check chưa xác minh. Đổi SHA phải review lại phần ảnh hưởng. Review đạt không cấp quyền merge; chỉ merge khi Developer yêu cầu rõ.

## 4. Escalation

Dừng ngay hành động phụ thuộc và hỏi Developer/authority khi có câu hỏi nghiệp vụ trọng yếu chưa được xác nhận, kể cả khi chỉ có một cách hiểu đang được giả định; đồng thời dừng khi: spec/code conflict; migration compatibility/schema drift chưa rõ; security/privacy/trust boundary exposure; breaking API; irreversible operation; hoặc trade-off kiến trúc nền tảng. Trade-off cần phân tích và [ADR được chấp thuận](docs/decisions/README.md). Không tự quyết hoặc hòa giải ngầm. INVESTIGATE/READ_ONLY chỉ tiếp tục khảo sát độc lập an toàn; EXECUTE giữ diff/checkpoint và dừng phần phụ thuộc quyết định mở.

## 5. Definition of Done

Phân quyền danh sách DoD Standard/Fast Track và lifecycle outputs cho [Definition of Done](docs/operations/definition-of-done.md). EXECUTE phải nạp profile tương ứng và chỉ completed sau đủ DoD, required checks, review và conditional commit. Approval/transitions thuộc Task Lifecycle; [review độc lập](docs/operations/review-rework.md#independent-review) bắt buộc cho P0/P1, HIGH/CRITICAL và các trigger ở owner. Thiếu reviewer thì blocked/pending review, không completed. SKIPPED/NOT_RUN không phải PASS.

<a id="quality-gate-applicability"></a>

### D. Bảng Áp Dụng Quality Gates (Canonical)

AGENTS sở hữu applicability và quyền miễn áp dụng; [Verification Standard](docs/standards/verification.md#risk-test-matrix) sở hữu ma trận kiểm thử và cách ghi evidence. Project profile ánh xạ từng gate sang command thực tế của stack.

| Loại công việc | Automated tests / checks | Architecture fitness | Commit |
| :--- | :--- | :--- | :--- |
| Standard EXECUTE, kể cả docs ảnh hưởng policy P0/P1 | Chạy các suites liên quan nếu có test runner, checks theo ma trận risk và diff; docs phải review links/tính nhất quán | Bắt buộc PASS, Exit code 0 | Có thay đổi cần lưu trữ: conditional commit theo §2.C |
| Fast Track có source changes (CSS, comments/format source, unit tests thuần) hoặc có khả năng ảnh hưởng ranh giới kiến trúc | Checks phù hợp với diff, tests liên quan; UI cần manual checks khi áp dụng | Bắt buộc PASS, Exit code 0 | Theo §2.C |
| Fast Track docs-only, không ảnh hưởng source/ranh giới kiến trúc và không chạm Hard Stop | Diff, links/format, tính nhất quán; tests runtime N/A nếu không có tác động, ghi lý do | N/A có lý do; có thể chạy thêm nếu hữu ích | Theo §2.C |
| COMPOSE / INVESTIGATE / READ_ONLY / REVIEW thuần túy | Checks cần cho kết luận khảo sát/review; execution gates N/A vì không thực thi thay đổi | N/A cho phase thuần túy; review vẫn phải xác minh evidence gate của implementation khi áp dụng | Không commit code theo profile đầu ra; quyền artifact theo workflow |

- Thiếu validator hoặc command tương đương ở hàng bắt buộc là **BLOCKED / thiếu gate**, không phải N/A; phải cấu hình gate trước khi tuyên bố đạt DoD. Không bịa script.
- Không có test runner: ghi N/A cho automated suite, vẫn phải thực hiện checks/manual evidence phù hợp với ma trận risk. Thiếu môi trường cho integration/manual check bắt buộc là BLOCKED, không phải N/A.
- Risk xác định theo blast radius trước khi dùng bảng; docs điều khiển quyền/gate P0/P1 vẫn là Standard. N/A phải có căn cứ từ diff/profile; SKIPPED/NOT_RUN không phải PASS. Gate remote CI bắt buộc phải được xác minh trên đúng commit.

## 6. Architectural invariants

Owner: [Architecture Rules](docs/fitness-functions/architecture-rules.md). Nạp rules thuộc blast radius trước sửa: domain purity, client/server isolation, env schema; server trust boundary; stateless services/repositories; Expand-and-Contract; bounded/paginated queries, hot-path columns, chống N+1; canonical idempotent seeds. Machine fitness chỉ chứng minh rules validator hỗ trợ; các invariants còn lại phải review. Client params không cấp authority cho user/tenant/public/master/job queries.

## 7. Risk P0–P4

[Critical Flows](docs/operations/critical-flows.md) sở hữu taxonomy, mapping, tie-breaking/escalation; system map ánh xạ flow; Verification sở hữu test matrix. P0 là system survival/security/core execution loop, học/luyện tập thông thường P2. Blast radius chạm P0/P1 dùng mức cao nhất, bắt buộc Standard; không hạ risk vì file Markdown.

## 8. Context budget

<a id="context-budget"></a>

| Session | Giới hạn | Scope |
| :--- | :--- | :--- |
| Low | <= 10k tokens | Fast Track/docs/unit test đơn |
| Medium | <= 30k tokens | Investigation/audit task độc lập |
| High | <= 60k tokens | Execution nhiều module |
| Overflow | > 60k tokens | Dừng nạp, ghi checkpoint; chia task hoặc session mới, không cần approval riêng |

Package target mặc định <=15k, không là hard cap session; vượt target thì thu hẹp/nạp theo nhu cầu. Trước task tìm [package đúng scope](docs/context-packages/README.md), bắt đầu Must Load; chỉ trace thêm contracts/callers có evidence trong blast radius. Thiếu package: ghi rõ, đọc tối thiểu task/spec/boundaries/code/tests liên quan, không đoán đường dẫn. Cấm cross-load package không liên quan. [Context Assembly](docs/governance/context-assembly.md) quy định thứ tự, cập nhật prefix và đo token; không đổi quyền/gates.

## 9. Knowledge lifecycle

Retention/archive theo [Knowledge Lifecycle](docs/governance/knowledge-lifecycle.md). Không tự nạp `docs/archive/**` trừ khi Developer yêu cầu tra cứu lịch sử cụ thể. Không xóa ADR cũ; superseded ADR phải link bản thay thế.

<a id="routing-map"></a>
## 10. Routing map

Đây là entry map duy nhất. Đọc owner/section đúng trigger; anchor không giảm token nếu tool trả cả file.

| Phase / trigger | Owner |
| :--- | :--- |
| Session start, mode, resume | [Agent Workflow](docs/operations/agent-workflow.md) |
| Approval, status, close sequence | [Task Lifecycle](docs/operations/task-lifecycle.md) |
| Review/rework, independent review | [Review & Rework](docs/operations/review-rework.md) |
| Compose/investigate | [Task Authoring](docs/task-authoring/README.md); chỉ [template](docs/templates/README.md) cần dùng |
| Execute / DoD | §§0–7; [DoD](docs/operations/definition-of-done.md), [risk](docs/operations/critical-flows.md) |
| Verification / commands | [Verification](docs/standards/verification.md); [Project Profile](docs/operations/project-profile.md) |
| Handoff / PR review / release | [Handoff](docs/operations/handoff-contract.md); [Merge Review](docs/operations/merge-review.md); [Preflight](docs/operations/preflight-checklist.md) theo action |
| Bootstrap / adoption | [Project Adoption](docs/operations/project-adoption.md); [Bootstrap](docs/onboarding/bootstrap.md) khi được yêu cầu |
| Human onboarding | [Human Onboarding](docs/onboarding/human.md) |
| Production incident | [Incident Playbook](docs/playbooks/production-incident.md) và boundaries liên kết |
| Business / technical / ADR | `docs/main_docs/ACTIVE_VERSION.md`; spec active; system map/standards trong scope; [ADR](docs/decisions/README.md) |
| Package / memory / retention / cache | [Packages](docs/context-packages/README.md); memory liên quan; [Retention](docs/governance/knowledge-lifecycle.md); [Context Assembly](docs/governance/context-assembly.md) |
| Quick reference | [Checklist](docs/operations/quick-checklist.md) dẫn tới owners |

README/HOW_WE_WORK chỉ giới thiệu; không tạo routing/policy thứ hai.
