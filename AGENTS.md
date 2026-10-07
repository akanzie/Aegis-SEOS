# AGENTS.md — Unified Operating Contract (Hiến Pháp Vận Hành AI-Native)

> **Tuyên ngôn cốt lõi (Core Philosophy):**  
> *"Tài liệu là hệ điều hành (Docs-as-an-OS), Code là kết quả phái sinh, Session AI là tiến trình độc lập và dùng một lần (Disposable Process)."*

Tài liệu này là Hiến pháp Vận hành (Canonical Operating Contract) tối cao và duy nhất dành cho mọi Developer và AI Agent hoạt động trong kho mã nguồn này. Các hướng dẫn chi tiết, quy trình SOP và tài liệu kỹ thuật chuyên sâu được phân quyền tại `docs/` theo Bản đồ Tra cứu (Mục 10).

---

## 0. Thứ Tự Ưu Tiên Giải Quyết Mâu Thuẫn (Hierarchy of Truth)

Khi phát hiện mâu thuẫn hoặc xung đột thông tin, AI Agent bắt buộc giải quyết theo thứ tự ưu tiên giảm dần:

1. **Safety, Security & Boundary Integrity**: An toàn hệ thống, bảo mật dữ liệu, quyền riêng tư, ranh giới kiến trúc (Mục 2 & Mục 6).
2. **Explicit Approved Developer Override**: Quyết định ghi đè nghiệp vụ rõ ràng của Developer trong prompt hiện tại.  
   *(Lưu ý: Tin nhắn chat thông thường chỉ ghi đè `fn` specs khi Dev tuyên bố rõ ràng đây là thay đổi nghiệp vụ; không tự ý suy diễn lời nói bóng gió để phá vỡ spec).*
3. **Approved Task Decisions (`docs/tasks/**/task-*-fix.md`, `task-*-feat.md`)**: Các quyết định có `approval_status: approved`, `approved_by`, `approved_at`, `approved_revision` nhận diện đúng scope/revision. Approval độc lập `execution_status` và được giữ sau completed; compatibility status cũ theo [Agent Workflow](docs/operations/agent-workflow.md), không suy ra approval từ completed.
4. **Functional Specifications (`docs/main_docs/<ACTIVE_VERSION>/fn/`)**: Nguồn sự thật cho logic nghiệp vụ (Business "WHAT").
5. **Project Memory (`docs/project-memory/`)**:
   - `rejected-solutions.md`: Các giải pháp đã bị bác bỏ (cấm đề xuất lại).
   - `known-pitfalls.md`: Các bẫy kỹ thuật đã được cảnh báo.
   - `technical-lessons.md`: Các bài học xương máu đã đúc kết.
6. **Acceptance Criteria (AC)**: Tiêu chí nghiệm thu được xác lập trong task active.
7. **Architecture & Standards (Technical "HOW")**: Trong phạm vi kỹ thuật, ưu tiên Accepted ADR còn hiệu lực (`docs/decisions/`) -> invariants/standards (`docs/fitness-functions/`, `docs/standards/`) -> system map (`docs/system-map/`) -> thiết kế triển khai (`docs/architecture/`). Approved task quyết định scope/AC hiện hành, không tự thay thế Accepted ADR; nếu cần đổi kiến trúc, phải có ADR mới được chấp thuận và đồng bộ các tài liệu dẫn xuất trước triển khai. Project profile chỉ ánh xạ stack, commands và khả năng kiểm tra thực tế, không cấp quyền hoặc miễn gate. Không nguồn Technical HOW nào được làm yếu safety/security hay sửa Business WHAT ngầm.
8. **Existing Code Conventions**: Phong cách trình bày của module đang can thiệp.

*Nguyên tắc xử lý lệch pha:* Khi phát hiện code hoặc yêu cầu mâu thuẫn với `fn` specs, AI bắt buộc chỉ rõ điểm khác biệt và đề xuất cập nhật spec song song/trước khi sửa code. Tuyệt đối không âm thầm pha trộn hai nguồn mâu thuẫn.

---

## 1. 12 Nguyên Tắc Vận Hành Cốt Lõi (Core Principles)

1. **Nghĩ trước khi code (Think Before Coding)**: Nêu rõ giả định. Khi gặp mơ hồ về nghiệp vụ, dữ liệu, public API, security, hoặc thay đổi khó đảo ngược -> Bắt buộc hỏi Dev (Surface Ambiguity). Với quyết định kỹ thuật cục bộ ít rủi ro -> Chủ động chọn theo convention và ghi rõ giả định.
2. **Đơn giản là trên hết (Simplicity First)**: Viết lượng code tối thiểu cần thiết. Không viết speculative code, không tạo abstraction sớm khi chưa có yêu cầu.
3. **Can thiệp tối thiểu (Surgical Changes)**: Chỉ sửa đúng phạm vi task. Bắt buộc dọn sạch orphan do chính mình tạo ra. Dead code có sẵn ngoài scope chỉ ghi nhận vào task note, không tự ý xóa.
4. **Triển khai theo mục tiêu (Goal-Driven Execution)**: Xác định rõ AC và kịch bản verify trước khi gõ phím.
5. **Chỉ dùng AI cho việc cần phán đoán (Model for Judgment Only)**: Dùng AI cho phân loại, tóm tắt, trích xuất dữ liệu. KHÔNG dùng AI cho routing, retry logic, HTTP status codes hay deterministic business math.
6. **Quản lý Context & Nén thông tin (Token Discipline)**: Nguyên tắc: `Correctness > Safety > Đủ Context Verify > Tối ưu Token`. Sử dụng targeted search, đọc theo symbol/interface thay vì nạp cả file.
7. **Chỉ ra mâu thuẫn, không trung hòa (Surface Conflicts)**: Nêu rõ xung đột kiến trúc hoặc tài liệu, không tự ý trung hòa (compromise) ngầm.
8. **Đọc trước khi viết (Read Before Write)**: Trace callers, dependencies, exports và shared contracts trước khi sửa đổi file.
9. **Xác minh mục đích (Verify Intent)**: Kiểm thử TẠI SAO một hành vi lại quan trọng và bảo vệ invariants, không chỉ test kết quả tĩnh.
10. **Checkpoints theo Phase (Phase-level Checkpoints)**: Dừng lại báo cáo sau mỗi phase (soạn prompt -> xong điều tra -> xong thực thi). Tránh checkpoint vụn vặt sau mỗi lệnh đọc/grep.
11. **Nhất quán quan trọng hơn mới lạ (Convention Beats Novelty)**: Ưu tiên sự đồng nhất của toàn bộ codebase hơn việc áp dụng cú pháp hay thư viện mới lạ.
12. **Thất bại một cách tường minh (Fail Loud)**: Báo cáo rõ ràng mọi rủi ro và lỗi ngầm thay vì âm thầm bỏ qua hoặc giả định thành công.

---

## 2. An Toàn, Bảo Mật & Quy Chuẩn Git (Safety & Git Protocol)

### A. Quản Lý Bí Mật & Dữ Liệu Nhạy Cảm (Secrets & Data Privacy)
- **Cấm đọc/in secrets**: Tuyệt đối không đọc, ghi, in ra console/chat nội dung của `.env`, `.env.local`, `*.key`, `*.pem`, database credentials, JWT tokens.
- **Phạm vi cho phép**: Được phép đọc `.env.example`, tên biến môi trường và module schema validation (`src/lib/env.ts` hoặc `src/config/env.ts`).
- **Không log dữ liệu nhạy cảm**: Cấm log passwords, session tokens, cookies, auth headers hoặc PII thô (xem [docs/standards/observability.md](docs/standards/observability.md)).

### B. Thao Tác Phá Hủy Bị Cấm
- Cấm tự tiện chạy: `rm -rf`, `del /f /s /q`, `git reset --hard`, `git push --force`, `drop database`, format ổ đĩa hoặc các lệnh ghi đè không thể phục hồi.
- Khi cần thao tác rủi ro cao: Giải thích rõ lý do, đề xuất phương án sao lưu an toàn (backup/rename) và yêu cầu Developer duyệt.

### C. Quy Chuẩn Git An Toàn & Cam Kết Có Điều Kiện (Conditional Commit)
- **Cấm commit trực tiếp lên `main` / `master`**: Mọi công việc bắt buộc thực hiện trên branch riêng:
  - `task/<ten-task>`: Task theo yêu cầu tổng hợp.
  - `feat/<ten-tinh-nang>`: Tính năng mới.
  - `fix/<ten-loi>`: Sửa lỗi / bugfix.
  - `hotfix/<incident-code>`: Bản vá khẩn cấp cho sự cố production đã được xác nhận.
- **Tự động chuyển branch an toàn**: Trước khi code, kiểm tra `git branch --show-current`. Nếu đang ở `main`/`master`, tự động tạo và checkout branch mới theo format trên.
- **Bảo toàn Baseline Repository**: Nếu working tree đã có các thay đổi từ trước khi bắt đầu task, AI không được tự ý sửa, stash, reset hoặc commit các thay đổi đó. Phải ghi nhận baseline và bảo đảm không pha trộn chúng vào commit của task.
- **Cam Kết Có Điều Kiện (Conditional Commit)**: AI **chỉ được phép commit** khi thỏa mãn **TOÀN BỘ** các điều kiện sau:
  1. **Staged Scope**: Index chỉ chứa thay đổi thuộc task; không chứa file rác, secrets hoặc thay đổi baseline. Working tree có thể còn baseline đã ghi nhận. Kiểm tra staged diff trước commit; nếu không tách được thay đổi an toàn, dùng worktree riêng hoặc báo Developer.
  2. **Automated tests pass**: Các automated tests bắt buộc theo [bảng áp dụng gate](#quality-gate-applicability) đều PASS; mục N/A có lý do được ghi trong evidence.
  3. **Architecture fitness pass**: Gate fitness theo [bảng áp dụng](#quality-gate-applicability) PASS với Exit code 0 khi bắt buộc; N/A chỉ trong trường hợp bảng cho phép, không dùng thiếu validator để miễn gate.
  4. **No open assumptions**: Không còn giả định mở (open assumptions) hay xung đột chưa giải quyết.
  5. **Valid task branch**: Đang ở trên task branch hợp lệ (`task/*`, `feat/*`, `fix/*`, hoặc `hotfix/*`), tuyệt đối không phải `main`/`master`.
  6. **Post-commit clean tree**: Sau khi commit, `git status --short` phải không còn thay đổi chưa được xử lý thuộc phạm vi task.
- **Phạm vi áp dụng Commit**: Chỉ thực hiện commit nếu task tạo ra thay đổi cần lưu trữ vào repository. Các task read-only hoặc investigation thuần túy không tạo commit.
- **Giới hạn Git**: AI được phép tạo branch và commit cục bộ; **tuyệt đối không tự ý push, rebase, stash, reset hoặc xóa branch** trừ khi Developer yêu cầu đích danh.

### D. Quy Chuẩn Trình Bày & Đường Dẫn
- **Cấm LaTeX / MathJax phức tạp**: Không dùng `$...$`, `$$...$$`, `\approx`, `\ge`, `\le`, `\rightarrow`. Dùng text thuần hoặc ký tự Unicode chuẩn (`~`, `>=`, `<=`, `->`, `→`) để tránh vỡ giao diện Git/IDE preview.
- **Đường dẫn tương đối**: Luôn dùng relative path từ thư mục gốc của repository (ví dụ: `src/domain/user.ts`, `docs/tasks/task-1-fix.md`). Cấm hardcode absolute path máy cá nhân.

---

## 3. Quy Trình Vận Hành: Standard vs Fast Track

### A. Quy Trình Chuẩn (Standard 3-Step Path)
Nhận diện mode trước khi làm việc theo [Agent Workflow](docs/operations/agent-workflow.md). `COMPOSE`, `INVESTIGATE`, `REVIEW`, `REWORK`, `EXECUTE`, `READ_ONLY` có phạm vi quyền riêng; không tự chuyển từ mode ít quyền sang mode nhiều quyền. Approval phải do Developer hoặc reviewer được Developer ủy quyền; agent không tự duyệt plan do mình tạo.

Các lệnh npm và layout `src/` là tham chiếu Node.js/TypeScript. Dự án dùng stack khác khai báo commands và boundaries tương đương theo [Project Adoption](docs/operations/project-adoption.md), giữ nguyên gate chất lượng và quyền phê duyệt.

Soạn yêu cầu và chia task theo [Task Authoring](docs/task-authoring/README.md): giữ nguyên ý định, phân biệt facts/requirements/assumptions, không đoán root cause, và chia theo kết quả nghiệm thu độc lập thay vì tầng kỹ thuật.

Áp dụng cho mọi tính năng mới, thay đổi nghiệp vụ, sửa lỗi phức tạp, đụng chạm schema/DB, đa module hoặc luồng rủi ro cao:
```
[BƯỚC 1: SOẠN BATCH PROMPT]  ──▶  [BƯỚC 2: SESSION ĐIỀU TRA]  ──▶  [BƯỚC 3: SESSION THỰC THI]
  Tạo 1 file prompt tập trung      Trace code, đánh giá Spec Impact     Kiểm tra approval -> Sửa spec
  tại docs/tasks/<request>.md       Xuất plan (approval: pending)       Sửa code phẫu thuật -> Run fitness
  Không sửa code sớm.              Dev duyệt revision -> approved       Conditional Commit trên task branch
```

### B. Luồng Nhanh (Fast Track) & Rào Chắn Dừng Khẩn Cấp (Hard Stop)
- **Phạm vi áp dụng**:
  - Sửa lỗi chính tả (typo), cập nhật markdown docs, viết comment, format code.
  - Chỉnh sửa CSS thuần túy không thay đổi cấu trúc DOM / layout tree.
  - Viết bổ sung Unit test thuần túy không sửa logic runtime.
  - Task read-only: Giải thích kiến trúc, trace code, review logic.
- **Chu trình Fast Track**: `Điều tra nhanh -> Sửa đổi -> Verify theo bảng áp dụng gate -> Nghiệm thu Fast Track DoD -> Conditional Commit (nếu có thay đổi cần lưu trữ)`.
- **Căn cứ EXECUTE**: Fast Track cần yêu cầu trực tiếp của Developer với scope rõ và đủ điều kiện §3.B; không cần approved Standard plan riêng. Standard cần approval bao phủ revision/scope. Quyền mode/artifact tại [Agent Workflow](docs/operations/agent-workflow.md).
- **RÀO CHẮN DỪNG KHẨN CẤP (FAST TRACK HARD STOP)**:
  > [!CAUTION]
  > Fast Track **lập tức vô hiệu lực** nếu phát sinh bất kỳ yếu tố nào sau đây (bắt buộc quay lại Quy trình Chuẩn 3 bước):
  > 1. Thay đổi Public API contracts hoặc Route signatures.
  > 2. Đụng chạm Schema Database, migrations, hoặc dữ liệu seed.
  > 3. Thay đổi logic Authentication hoặc Authorization.
  > 4. Thay đổi logic nghiệp vụ (Business logic runtime).
  > 5. Chạm vào bất kỳ thành phần nào thuộc luồng **P0** hoặc **P1** (dựa trên blast radius).

Hard Stop loại trừ Fast Track; checkpoint và quay về Standard trước phần sửa ngoài phạm vi. Nó không cấm Standard task đã duyệt sửa thành phần đó trong scope. Escalation tại §4 áp dụng riêng cho mọi track và dừng phần phụ thuộc quyết định còn mở.

---

### C. Kiểm Tra Merge Request Trước Khi Vào `main` (Merge Review Gate)
- Khi nhận yêu cầu review hoặc merge PR/MR, AI bắt buộc thực hiện [Merge Review Gate](docs/operations/preflight-checklist.md#merge-review-gate) và trả lời đủ **10 câu hỏi**, kèm bằng chứng cho từng câu, trước khi kết luận nhánh có thể merge vào `main`/`master`.
- Đối chiếu với ticket gốc, approved task và functional specs theo Hierarchy of Truth; không lấy prompt triển khai làm nguồn nghiệm thu duy nhất.
- Báo cáo phải xác định source branch, target branch, commit SHA đã review và kết quả từng câu: `PASS`, `FAIL`, `UNVERIFIED` hoặc `N/A` có lý do. Chỉ kết luận đủ điều kiện merge khi cả 10 câu đều `PASS` hoặc `N/A` hợp lệ, không còn blocker hay kiểm tra bắt buộc chưa xác minh.
- Review áp dụng cho cả Standard và Fast Track; không thay thế approval gate, DoD hay quyền cho phép thao tác Git. Yêu cầu review là read-only; chỉ thực hiện merge khi Developer yêu cầu rõ ràng và gate đã đạt. Nếu source/target commit thay đổi, phải cập nhật review và kiểm tra lại phần bị ảnh hưởng trước khi merge.

---

## 4. Điểm Dừng Báo Cáo & Leo Thang Quyết Định (Escalation Triggers)

AI Agent bắt buộc **DỪNG LẠI NGAY LẬP TỨC**, không tự ý đoán hoặc tự ra quyết định, phải báo cáo Developer khi gặp:
1. **Spec & Code Conflict**: Phát hiện mâu thuẫn sâu sắc giữa spec `fn` và code hiện hành.
2. **Ambiguous Business Logic**: Có từ 2 cách diễn giải nghiệp vụ hợp lý trở lên nhưng tài liệu chưa nêu rõ.
3. **Migration Uncertainty**: Kịch bản migration dữ liệu chưa rõ tính tương thích ngược hoặc nguy cơ schema drift.
4. **Security / Privacy Exposure**: Phát hiện lỗ hổng bảo mật, leak secrets hoặc vi phạm Server Trust Boundary.
5. **Breaking API Changes**: Sửa đổi làm gãy contracts đang phục vụ client khác.
6. **Irreversible Operations**: Thao tác xóa cột, drop table, purge cache diện rộng không thể rollback an toàn tức thì.
7. **Architectural Trade-offs**: Phân vân kỹ thuật nền tảng (Queue vs Cron, Redis vs DB, Event-Driven vs Sync, chia module mới). Bắt buộc dừng lại, phân tích trade-offs và yêu cầu tạo ADR theo [docs/decisions/README.md](docs/decisions/README.md).

Dừng ngay hành động phụ thuộc vào quyết định còn mở, báo Developer và ghi bằng chứng. Trong INVESTIGATE/READ_ONLY chỉ tiếp tục khảo sát độc lập khi an toàn; không tự chốt mâu thuẫn. Trong EXECUTE dừng phần phụ thuộc trigger, giữ diff/checkpoint theo [Agent Workflow](docs/operations/agent-workflow.md).

---

## 5. Tiêu Chuẩn Hoàn Tất (Definition of Done - DoD)

Execution chỉ completed (`execution_status: completed`) khi đạt **DoD profile tương ứng**. Approval/status semantics và transition ownership theo [Agent Workflow](docs/operations/agent-workflow.md):

### A. Standard DoD (Áp dụng cho Standard 3-Step Path)
1. **Approved Task**: Task plan (`task-*-fix.md` hoặc `task-*-feat.md`) có approval record hợp lệ cho revision/scope hiện hành (`approval_status: approved`); agent không tự duyệt. Approval độc lập execution và được giữ khi completed.
2. **Spec Synchronized**: Đặc tả nghiệp vụ (`docs/main_docs/<ACTIVE_VERSION>/fn/`) đã được cập nhật đồng bộ nếu có thay đổi hành vi (`Spec Impact: CHANGE/CLARIFICATION`).
3. **Automated Tests Pass**: Các checks bắt buộc theo [bảng áp dụng gate](#quality-gate-applicability) và [ma trận kiểm thử](docs/standards/verification.md#risk-test-matrix) đã PASS; N/A có lý do được ghi rõ.
4. **Architecture Fitness Pass**: Gate Standard theo [bảng áp dụng](#quality-gate-applicability) thực thi thành công với Exit code 0.
5. **No Open Assumptions**: Toàn bộ giả định mở hoặc xung đột kiến trúc/nghiệp vụ đã được giải quyết triệt để.
6. **Documentation & Memory Updated**: Đã cập nhật ADR (nếu chạm trigger), pitfalls/lessons (nếu phát hiện bẫy mới).
7. **Clean Conditional Commit**: Commit cục bộ thành công trên task branch hợp lệ (`task/*`, `feat/*`, `fix/*`, hoặc `hotfix/*`), không sót file nhạy cảm hay file rác.
8. **Evidence & Handoff**: Mỗi AC có kết quả và bằng chứng theo [Verification Standard](docs/standards/verification.md); hoàn tất kiểm tra bắt buộc, gồm independent review và kiểm tra thủ công khi áp dụng theo [Agent Workflow](docs/operations/agent-workflow.md). Bàn giao theo [Handoff Contract](docs/operations/handoff-contract.md). Không xem skipped/not run là PASS.

### B. Fast Track DoD (Áp dụng cho Fast Track Changes)
1. **Scope Validity**: Phạm vi thay đổi vẫn nằm trọn vẹn trong các trường hợp cho phép của Fast Track.
2. **No Hard Stop**: Không phát sinh bất kỳ điều kiện nào thuộc Fast Track Hard Stop.
3. **Minimal Surgical Diff**: Diff chỉ chứa thay đổi tối thiểu cần thiết cho task.
4. **Verification Pass**: Các checks bắt buộc theo [bảng áp dụng gate](#quality-gate-applicability) đã PASS, có evidence tương xứng với thay đổi.
5. **Architecture Fitness Pass**: Fitness PASS với Exit code 0 khi [bảng áp dụng](#quality-gate-applicability) yêu cầu; N/A được ghi rõ lý do khi bảng cho phép.
6. **No Open Assumptions**: Không còn giả định mở hoặc xung đột chưa được giải quyết.
7. **Conditional Commit**: Commit cục bộ trên task branch hợp lệ nếu task tạo ra thay đổi cần lưu trữ vào kho mã nguồn.
8. **Evidence & Handoff**: Báo cáo kiểm tra và bằng chứng tương xứng phạm vi; không bỏ qua kiểm tra thủ công cần thiết chỉ vì dùng Fast Track.

### C. Phân Định Kết Quả Theo Vòng Đời Task (Lifecycle Outputs)
- **Investigation Session**: Hoàn tất khi plan `task-N-fix.md` hoặc `task-N-feat.md` được tạo với `approval_status: pending`, `execution_status: not_started`. Không yêu cầu commit code; đây không phải execution completed.
- **Execution Task**: Hoàn tất khi đáp ứng Standard DoD (hoặc Fast Track DoD tương ứng).
- **Read-only Task**: Hoàn tất khi báo cáo, phân tích và bằng chứng xác minh đã được cung cấp (không tạo commit code).

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

---

## 6. Ranh Giới Kiến Trúc & Phân Định Kiểm Định (Architectural Invariants)

Nguồn sự thật chuẩn hóa cho các quy tắc kiến trúc được quy định tại [docs/fitness-functions/architecture-rules.md](docs/fitness-functions/architecture-rules.md), bao gồm hai nhóm cơ chế kiểm tra:

### A. Machine-Enforced Invariants (Máy Chấm Tự Động Qua `npm run test:fitness`)
1. **Domain Purity (`src/domain/`)**: Logic nghiệp vụ thuần khiết, cấm import DB, ORMs, Web frameworks, Network clients, UI components.
2. **Client/Server Isolation (`'use client'`)**: Client components cấm import DB client, server secrets, server-only helpers.
3. **No Raw Env**: Cấm gọi trực tiếp `process.env.*` rải rác; bắt buộc import qua schema validation tập trung (`src/lib/env.ts`).

### B. Review-Enforced Invariants (Kiểm Định Qua Investigation, Review & Preflight)
4. **Server Trust Boundary**: Query dữ liệu user/tenant phải scope theo identity và quyền được server xác thực; public/master-data/system-job dùng authority và scope tương ứng theo [Rule 4](docs/fitness-functions/architecture-rules.md#rule-server-trust-boundary). Cấm lấy client params làm authority hoặc dùng nhãn public/job để bỏ kiểm tra quyền.
5. **Stateless Services & Repositories**: Service singletons cấm lưu `userId` hay request context trong biến instance (`this.*`).
6. **Expand-and-Contract Migrations**: Không bao giờ đổi tên hoặc drop cột cùng lúc; tuân thủ chu trình Expand -> Backfill -> Read Transition -> Contract.
7. **Performance Guardrails**: Cấm query danh sách không giới hạn (unbounded query), chỉ query cột cần thiết trên hot path, bắt buộc phân trang, chống N+1 (xem [docs/standards/performance.md](docs/standards/performance.md)).
8. **Idempotent Master Seeds**: Dữ liệu hạt giống phải có canonical identity key và upsert lũy đẳng.

---

## 7. Phân Cấp Luồng Trọng Yếu & Độ Nhạy Rủi Ro (Critical Flows P0 - P4)

Nguồn chuẩn duy nhất cho P0–P4, mapping risk, tie-breaking và impact escalation là [Critical Flows](docs/operations/critical-flows.md). [System map](docs/system-map/critical-paths.md) ánh xạ flow cụ thể; [Verification Standard](docs/standards/verification.md#risk-test-matrix) quy định test matrix.

P0 bảo vệ system survival/security và core execution loop của hệ thống; luồng học/luyện tập thông thường là P2. Nếu blast radius chạm invariant/contract/runtime P0 hoặc P1, áp dụng mức cao nhất theo taxonomy và bắt buộc Standard, cấm Fast Track. Applicability của gate theo §5.D; không hạ risk chỉ vì file là Markdown.

---

## 8. Quản Lý Ngân Sách Ngữ Cảnh & Context Packages (Context Budget)

<a id="context-budget"></a>

Mỗi session AI là một tiến trình dùng một lần. Giữ context tinh gọn để chống ảo giác:

| Mức Độ | Ngưỡng Token | Áp Dụng Cho |
| :--- | :--- | :--- |
| **Low** | <= 10k tokens | Fast Track, sửa typo, cập nhật docs, viết unit test đơn |
| **Medium** | <= 30k tokens | Investigation session, phân tích 1 task độc lập, audit file |
| **High** | <= 60k tokens | Execution session liên quan nhiều module, refactor tầng |
| **Overflow** | > 60k tokens | **Bắt buộc**: Dừng nạp context, ghi checkpoint, rồi chia nhỏ task hoặc tiếp tục trong session mới. Không cần approval riêng chỉ vì overflow. |

Mức session là ngân sách theo phạm vi công việc; các hàng Low/Medium/High dùng ngưỡng trên làm giới hạn trên tương ứng. `Target Token Budget` trong Context Package là mục tiêu riêng (mặc định `<= 15,000` tokens), không phải hard cap cho session. Nếu vượt target, thu hẹp package/nạp theo nhu cầu; nếu session vượt 60k, áp dụng overflow action ở trên.

**Quy Tắc Context Packages (`docs/context-packages/`):**
- Trước khi thực hiện task, AI bắt buộc tìm và nạp Context Package tương ứng (ví dụ: `auth-context.md`).
- **Load Minimum**: Bắt đầu từ `Must Load`; trace thêm callers/contracts trong blast radius khi có bằng chứng cần thiết. Nếu không có package phù hợp, ghi rõ và đọc tối thiểu task, spec, boundaries, code/tests liên quan; không đoán đường dẫn.
- **Zero Cross-Loading**: Tuyệt đối **CẤM nạp các package không liên quan** (Ví dụ: Đang làm Auth thì CẤM nạp Billing, Media, Analytics).

---

## 9. Vòng Đời Tri Thức & Quy Tắc Lưu Trữ (Knowledge Lifecycle)

Để ngăn ngừa việc sau 2-5 năm kho tri thức biến thành "bãi rác tài liệu" (Document Cemetery/Junkyard), toàn bộ dự án tuân thủ [docs/governance/knowledge-lifecycle.md](docs/governance/knowledge-lifecycle.md):

1. **Task records (`docs/tasks/**`)**: Retention và điều kiện archive theo [`knowledge-lifecycle.md`](docs/governance/knowledge-lifecycle.md); dùng `closed_at`, giữ `merged_at` riêng và không archive request còn task chưa đủ điều kiện.
2. **Resolved Incidents (`docs/engineering-incidents/**`)**: Sau **12 tháng** -> chắt lọc bài học vào `known-pitfalls.md` hoặc `technical-lessons.md` rồi chuyển vào `docs/archive/incidents/<YYYY>/`.
3. **Superseded ADRs (`docs/decisions/**`)**: Không bao giờ xóa; cập nhật trạng thái `Superseded by ADR-XXXX` và trỏ link sang ADR mới.
4. **Quy Tắc Cấm Nạp Archive (Zero-Archive In Context)**: AI Agent tuyệt đối **KHÔNG** được tự ý nạp tài liệu từ thư mục `docs/archive/**` vào context session trừ khi Developer yêu cầu tra cứu lịch sử cụ thể.

---

<a id="routing-map"></a>
## 10. Bản Đồ Tra Cứu Theo Phase Và Trigger (On-Demand Routing Map)

Đây là entry map duy nhất theo phase/trigger. Mở đúng owner cần thiết; không nạp toàn bộ tài liệu cùng lúc.

| Phase / trigger | Entry point / owner |
| :--- | :--- |
| New project / adoption / bootstrap | [Project Adoption](docs/operations/project-adoption.md); bootstrap instructions in [HOW_WE_WORK](docs/HOW_WE_WORK.md#ai-bootstrap) |
| Human onboarding | [HOW_WE_WORK — Human Onboarding](docs/HOW_WE_WORK.md#human-onboarding) |
| Session start, mode, approval, resume, review, rework | [Agent Workflow](docs/operations/agent-workflow.md) |
| Compose request or investigate task | [Task Authoring](docs/task-authoring/README.md); artifact forms in [Templates](docs/templates/README.md) |
| Execute / risk / gates / Git / safety | This contract, especially §§0–7; details by risk at [Critical Flows](docs/operations/critical-flows.md) and [Verification](docs/standards/verification.md) |
| Verify AC, tests, or architecture fitness | [Verification Standard](docs/standards/verification.md); actual project commands in [Project Profile](docs/operations/project-profile.md) |
| Handoff or merge review | [Handoff Contract](docs/operations/handoff-contract.md); [Preflight / Merge Review Gate](docs/operations/preflight-checklist.md#merge-review-gate) |
| Production incident | [Production Incident Playbook](docs/playbooks/production-incident.md) and the approved-task/deploy boundaries it links |
| Business behavior / technical boundary / ADR trigger | Active spec from `docs/main_docs/ACTIVE_VERSION.md`; system maps under `docs/system-map/`; [standards](docs/standards/); [ADR rules](docs/decisions/README.md) |
| Context package, memory, or document retention | [`docs/context-packages/`](docs/context-packages/README.md); [`docs/project-memory/`](docs/project-memory/); [Knowledge Lifecycle](docs/governance/knowledge-lifecycle.md) |
| Quick reference | [Quick Checklist](docs/operations/quick-checklist.md); it points to canonical policy owners |

README and HOW_WE_WORK introduce this map and onboarding/bootstrap; they do not define a second routing map.
