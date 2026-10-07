# How We Work: AI-Native Engineering Operating System (SEOS)
## Cẩm Nang Vận Hành & Khởi Tạo Dự Án Mới Dành Cho Developer & AI Agent

> **Tuyên ngôn cốt lõi:**  
> *"Tài liệu là hệ điều hành (Docs-as-an-OS), Code là kết quả phái sinh, Session AI là tiến trình độc lập và dùng một lần (Disposable Process)."*

Tài liệu chia rõ hai phần: **Human Onboarding** hướng dẫn Developer làm việc hàng ngày; **AI Bootstrap** chỉ áp dụng khi Developer yêu cầu khởi tạo SEOS cho repository mới. Dùng [AGENTS §10 routing map](../AGENTS.md#routing-map) để chọn entry point theo phase/trigger; HOW_WE_WORK không tạo routing map riêng.

---

<a id="human-onboarding"></a>
# PHẦN 1: DÀNH CHO CON NGƯỜI (HUMAN ONBOARDING)

Nếu bạn là Developer mới tham gia dự án hoặc bắt đầu áp dụng mô hình này: **Chào mừng bạn đến với kỷ nguyên phát triển phần mềm AI-Native có kỷ luật.**

### 1. Sự Khác Biệt Giữa "Chat-and-Pray" và "AI-Native SEOS"

| Tiêu Chí | Cách Làm Tự Phát ("Chat-and-Pray") | Cách Chúng Ta Làm Việc (AI-Native SEOS) |
| :--- | :--- | :--- |
| **Bản chất cuộc chat** | Trò chuyện dài vô tận, code dở dang tích lũy trong chat | Mỗi session chat là 1 tiến trình độc lập, xong task là đóng session |
| **Nguồn sự thật** | Nằm trong đầu Dev hoặc trôi nổi trong lịch sử chat | Lưu trên đĩa (`docs/main_docs/fn/`, `system-map/`, `project-memory/`) |
| **Chi phí token** | Phình to theo thời gian, AI bắt đầu quên và sinh ảo giác | Dùng package target và session budget/overflow theo [AGENTS §8](../AGENTS.md#context-budget) |
| **Bảo vệ kiến trúc** | Trông chờ vào trí nhớ của Dev hoặc AI | **Máy chấm tự động** (`npm run test:fitness` fail ngay nếu vi phạm) |
| **Nghiệp vụ vs Code** | Code đổi nhưng spec không đổi, sinh hàng tá bug ngầm | Bắt buộc đánh giá **Spec Impact** (`NONE/CLARIFICATION/CHANGE/CONFLICT`) |

---

### 2. Quy Trình Vận Hành Hàng Ngày (Day-to-Day Workflow)

Khi có một tính năng mới hoặc một danh sách lỗi cần sửa, bạn **KHÔNG** nhảy vào chat bảo AI code ngay. Hãy đi theo chu trình 3 bước chuẩn:

```
[BƯỚC 1: SOẠN BATCH PROMPT TẬP TRUNG]
- Dev chat gửi danh sách yêu cầu / bugs thô vào session.
- AI phân tích, bẻ nhỏ thành các tasks độc lập và TẠO 1 FILE PROMPT DUY NHẤT:
  File: docs/tasks/<request-name>/prompt-dieu-tra-<request-name>.md
  (hoặc docs/tasks/<request-name>.md)
- Dev kiểm tra lướt file prompt (hoặc đưa AI khác review phản biện) trước khi chạy.
               │
               ▼
[BƯỚC 2: SESSION ĐIỀU TRA (Investigation)]
- Mở Clean Session -> Chỉ thị: "Chạy điều tra cho Task N trong docs/tasks/.../prompt-dieu-tra-<name>.md"
- AI trace code, phân loại Spec Impact -> TỰ ĐỘNG XUẤT FILE FIX:
  File: docs/tasks/<name>/task-N-fix.md (chứa đầy đủ root cause, scope, verification plan)
               │
               ▼
[BƯỚC 3: DUYỆT & THỰC THI (Execution)]
- Dev xem plan -> Ghi approval record cho revision/scope được duyệt
- Mở Clean Session mới -> Chỉ thị: "Thực thi docs/tasks/<name>/task-N-fix.md"
- AI cập nhật Spec -> Sửa Code phẫu thuật -> Chạy test & fitness -> Tự động Commit
```

#### A. Khi Nào Dùng Luồng Nhanh (Fast Track)?
Để không bị mệt mỏi vì thủ tục, bạn được dùng **Fast Track** (không cần task file/approved Standard plan riêng; cần yêu cầu trực tiếp của Developer với scope rõ) khi thỏa mãn:
- Sửa lỗi chính tả (typo), cập nhật markdown, viết comment, format code.
- Chỉnh sửa CSS thuần túy không đổi cấu trúc layout/DOM.
- Viết bổ sung Unit test thuần túy không sửa logic runtime.
- Task read-only: Giải thích kiến trúc, trace code, review logic.
- **Quy trình Fast Track**: `Điều tra nhanh -> Sửa đổi -> Verify theo AGENTS §5.D -> Nghiệm thu Fast Track DoD -> Conditional Commit (nếu có thay đổi cần lưu trữ)`.
- **Căn cứ EXECUTE**: Standard dùng approved plan đúng revision/scope; Fast Track dùng yêu cầu trực tiếp, rõ scope của Developer khi đủ điều kiện AGENTS §3.B. Mode permission tại [Agent Workflow](operations/agent-workflow.md).

#### B. Quy Tắc Vàng Về Git & Cam Kết Có Điều Kiện:
Theo [AGENTS §2.C](../AGENTS.md), dùng branch task hợp lệ và giữ nguyên baseline. Index chỉ chứa thay đổi task, các gate bắt buộc theo [§5.D](../AGENTS.md#quality-gate-applicability) đã PASS, không còn giả định mở; sau commit không còn thay đổi task chưa xử lý. Baseline được ghi nhận có thể vẫn còn trong working tree. Điều kiện đầy đủ và quyền Git thuộc AGENTS; tài liệu này chỉ hướng dẫn. Task read-only/investigation thuần túy không commit code.

---

#### C. Khi Nhận Yêu Cầu Review / Merge Request

Sau Conditional Commit và trước khi kết luận nhánh có thể merge vào `main`, thực hiện [Merge Review Gate: 10 câu hỏi bắt buộc](operations/preflight-checklist.md#merge-review-gate). Gate áp dụng cho cả Standard và Fast Track:

`Yêu cầu review/merge -> Xác định source/target commit và diff -> Đối chiếu ticket/spec gốc -> Trả lời 10 câu kèm bằng chứng -> Kết luận đủ/chưa đủ điều kiện merge`.

- Mỗi câu ghi `PASS`, `FAIL`, `UNVERIFIED` hoặc `N/A` có lý do; test chưa chạy, CI chưa xác minh hoặc thiếu bằng chứng không được ghi PASS.
- Chỉ kết luận đủ điều kiện merge khi đủ 10 câu, không còn blocker hoặc kiểm tra bắt buộc chưa xác minh. Nếu commit source/target thay đổi, cập nhật review và kiểm tra lại phần bị ảnh hưởng.
- Review không tự động cho phép merge/push. Chỉ merge khi Developer yêu cầu rõ ràng và gate đã đạt; nếu chưa đạt, báo cáo vấn đề và bước cần làm tiếp theo.

---

### 3. Đánh Giá Spec Impact

Mỗi khi sửa bất kỳ dòng code nào, AI bắt buộc phải trả lời câu hỏi: **"Sửa đổi này tác động gì đến tài liệu đặc tả nghiệp vụ?"**:
1. **`NONE`**: Code đang chạy sai so với spec chuẩn -> Sửa code, giữ nguyên spec.
2. **`CLARIFICATION`**: Hành vi thực tế đúng nhưng spec chưa diễn đạt rõ edge case -> Bổ sung làm rõ spec, không đổi code.
3. **`CHANGE`**: Yêu cầu nghiệp vụ thay đổi -> **Bắt buộc cập nhật spec trong `docs/main_docs/vX.X/fn/` trước hoặc song song với code**.
4. **`CONFLICT`**: Phát hiện spec và code mâu thuẫn sâu sắc -> Dừng lại, báo cáo Dev giải quyết.

---

<a id="ai-bootstrap"></a>
# PHẦN 2: DÀNH CHO AI AGENT KHI DEVELOPER YÊU CẦU BOOTSTRAP

Phần này không phải hướng dẫn onboarding thường ngày. Dùng khi Developer yêu cầu tạo/tiếp nhận SEOS trên repository mới; với session trong repository đang hoạt động, theo cold-start/resume tại [Agent Workflow](operations/agent-workflow.md).

Lõi quy trình dùng chung gồm [Agent Workflow](operations/agent-workflow.md), [Task Authoring](task-authoring/README.md), [Verification Standard](standards/verification.md) và [Handoff Contract](operations/handoff-contract.md). Workflow sở hữu permission, approval/execution lifecycle, cold-start và reviewer independence; các entry points này dẫn tới định nghĩa thay vì chép transitions. Nhận diện mode trước thao tác; không tự duyệt plan, chuyển mode hoặc coi skipped/manual pending là PASS.

Khởi tạo hoặc tiếp nhận dự án theo [Project Adoption](operations/project-adoption.md). Xác minh stack, scripts, CI và tài liệu hiện có trước tạo/cập nhật; không ghi đè baseline. Tạo project profile với commands tương đương và sources of truth thực tế. Các đường dẫn `src/`, Node.js và npm dưới đây là mẫu tham chiếu, cần điều chỉnh theo stack.

> [!IMPORTANT]
> **Chỉ thị dành riêng cho AI khi nhận file này trong một repository mới**:  
> Nếu Developer yêu cầu: *"Khởi tạo hệ thống theo HOW_WE_WORK.md"* (hoặc bootstrap repository), AI phải **tự động khởi tạo toàn bộ bộ khung thư mục và các file mẫu** dưới đây mà không cần hỏi lại từng file.

### 1. Ma Trận Thư Mục Cần Khởi Tạo Ngay Lập Tức

```
[Root Repository]
├── AGENTS.md                            # Hợp đồng vận hành tối cao (Operating Contract)
├── docs/
│   ├── HOW_WE_WORK.md                   # File cẩm nang này
│   ├── task-authoring/README.md         # Chuẩn hóa yêu cầu, AC và phân rã task
│   ├── templates/                       # Prompt, task, profile, review/rework, handoff, ADR, spec
│   ├── context-packages/                # First-Class Context Packages (Load/Do Not Load/Token Budget)
│   ├── operations/
│   │   ├── critical-flows.md            # Taxonomy canonical P0–P4 và blast radius
│   │   ├── quick-checklist.md           # 1 trang One-Pager: 10 điều bất biến
│   │   ├── preflight-checklist.md       # Checklist chi tiết trước release
│   │   ├── agent-workflow.md            # Mode, approval, review/rework
│   │   ├── handoff-contract.md          # Bằng chứng và bàn giao
│   │   ├── project-adoption.md          # Áp dụng theo stack thực tế
│   │   └── project-profile.md           # Lệnh, môi trường và gate của dự án
│   ├── governance/
│   │   └── knowledge-lifecycle.md       # Vòng đời tài liệu, Retention & Archive rules
│   ├── system-map/
│   │   ├── modules.md                   # Ranh giới phân tầng (Domain, Service, Infra, UI)
│   │   ├── dependencies.md              # Ma trận import cho phép / cấm
│   │   └── critical-paths.md            # Các luồng sống còn (Auth, Core Loop, Sync, DB)
│   ├── playbooks/
│   │   ├── bug-investigation.md         # SOP điều tra lỗi
│   │   ├── feature-development.md       # SOP phát triển tính năng mới
│   │   ├── database-migration.md        # SOP migration Expand-and-Contract & Seed
│   │   └── production-incident.md       # SOP xử lý sự cố khẩn cấp
│   ├── fitness-functions/
│   │   ├── architecture-rules.md        # 5 luật kiến trúc bất biến
│   │   └── ci-enforcement.md            # Hướng dẫn kiểm tra máy chấm
│   ├── project-memory/
│   │   ├── known-pitfalls.md            # Bẫy kỹ thuật & gotchas
│   │   ├── rejected-solutions.md        # Phương án đã loại bỏ & lý do
│   │   └── technical-lessons.md         # Bài học đúc kết
│   ├── business-metrics/
│   │   └── critical-flows.md            # Compatibility pointer tới operations/critical-flows.md
│   ├── engineering-incidents/
│   │   └── incident-template.md         # Mẫu ghi nhận sự cố post-mortem
│   ├── main_docs/
│   │   ├── ACTIVE_VERSION.md            # Khai báo phiên bản spec đang active (v1.0)
│   │   └── v1.0/fn/                     # Thư mục chứa các specs nghiệp vụ
│   ├── architecture/                    # Thiết kế kỹ thuật chi tiết
│   ├── decisions/                       # Architecture Decision Records (ADR)
│   ├── standards/                       # Quy chuẩn code (TypeScript, DB, Security)
│   │   └── verification.md              # AC evidence và chính sách kiểm chứng
│   ├── tasks/                           # Nơi chứa các batch prompts và file fix
│   └── dev_notes/                       # Khu vực sandbox nháp
└── scripts/
    └── validators/
        └── architecture-fitness.mjs     # Script kiểm tra ranh giới kiến trúc tự động
```

---

### 2. Nội Dung Cốt Lõi Cần Có Trong Các File Mẫu Khi Khởi Tạo

Khi tạo mới các file trên, AI phải điền sẵn nội dung khung chuẩn mực:

#### A. `AGENTS.md` (Root Contract)
- Dẫn [hierarchy canonical tại AGENTS §0](../AGENTS.md): Approved task quyết định scope/AC, Accepted ADR quyết định Technical HOW còn hiệu lực; system map/technical architecture là tài liệu dẫn xuất, profile chỉ ánh xạ capability. Không tạo hierarchy rút gọn có authority riêng.
- Khai báo quy chuẩn Git an toàn: Cấm commit lên `main`, tự tạo branch theo task (`task/*`, `feat/*`, `fix/*`, `hotfix/*`), bảo toàn baseline, cấm tự ý `push`/`reset --hard`.
- Dẫn tới [AGENTS §8](../AGENTS.md#context-budget) cho session budget, package target và overflow action; không sao chép ngưỡng.
- Khai báo 2 luồng: Fast Track (Fast Track DoD) và Standard 3-Step Path (Standard DoD).

#### B. `docs/operations/quick-checklist.md` (10 Điều Bất Biến & Split DoD)
Checklist chỉ tóm tắt/link tới [architecture rules](fitness-functions/architecture-rules.md), [risk taxonomy](operations/critical-flows.md), [test matrix](standards/verification.md#risk-test-matrix) và [DoD/gate applicability của AGENTS](../AGENTS.md#quality-gate-applicability). Không sao chép bộ policy độc lập khi bootstrap.

User/tenant queries phải dùng identity/quyền server xác thực; public/master-data/system-job có authority và scope riêng theo Rule 4. Fitness bắt buộc hay N/A được xác định theo bảng gate, không theo câu “mọi task đều chạy”.

#### C. `scripts/validators/architecture-fitness.mjs` (Máy Chấm Ranh Giới)
- Viết 1 script Node.js quét AST hoặc regex import:
  - Kiểm tra `src/domain/` không chứa import từ database, framework, hoặc các tầng bên ngoài.
  - Kiểm tra file có `'use client'` không import database client hoặc server config.
  - Kiểm tra không đọc `process.env` trực tiếp trong mã nguồn ứng dụng (ngoài file env chuẩn).
- Bổ sung lệnh vào `package.json`: `"test:fitness": "node scripts/validators/architecture-fitness.mjs"`.

#### D. `docs/main_docs/ACTIVE_VERSION.md`
```markdown
# Active Specification Version
- Active version: v1.0
- Effective from: [YYYY-MM-DD]
- Related branch: main
- Status: Initializing
```

#### E. `docs/context-packages/` (First-Class Context Packages)
- Mỗi domain/feature có 1 file package quy định rõ:
  - **Must Load**: Danh sách files tài liệu & interfaces bắt buộc nạp.
  - **Optional**: Files chỉ nạp khi cần đào sâu edge cases.
  - **Do Not Load**: Danh sách các module cấm nạp (ngăn ngừa phình token & ảo giác).
  - **Target Token Budget**: Mục tiêu riêng cho package; session budgets và overflow action theo [AGENTS §8](../AGENTS.md#context-budget).

#### F. `docs/governance/knowledge-lifecycle.md` (Chống Biến Thành "Project Junkyard")
- Quy tắc lưu trữ và dọn dẹp tài liệu theo thời gian:
  - **Task records (`docs/tasks/**`)**: Dẫn tới [Knowledge Lifecycle](governance/knowledge-lifecycle.md) về `closed_at`, retention, archive eligibility và request index.
  - **Incidents (`docs/engineering-incidents/**`)**: Sau 12 tháng -> tổng hợp bài học vào `technical-lessons.md` rồi archive.
  - **ADRs (`docs/decisions/**`)**: Khi bị thay thế bởi quyết định mới -> đổi trạng thái sang `Superseded` và liên kết sang ADR mới.

#### G. Chuẩn Hóa Phân Cấp Luồng Trọng Yếu (Critical Flows P0 - P4)
Nguồn canonical là [operations/critical-flows.md](operations/critical-flows.md); đường dẫn business-metrics cũ giữ compatibility pointer. Core execution loop của hệ thống thuộc P0, học/luyện tập thông thường thuộc P2; system map ánh xạ theo blast radius và mức cao nhất.

Yêu cầu unit/integration/full flow regression được định nghĩa một lần tại [Verification Standard](standards/verification.md#risk-test-matrix). P0/P1 cấm Fast Track; docs ảnh hưởng policy bảo vệ các flow này vẫn dùng Standard và fitness bắt buộc. Không tự miễn gate qua project profile.

---

### 3. Cheat Sheet Dành Cho AI Khi Nhận Chỉ Thị Trong Dự Án

| Chỉ Thị Của Dev | Hành Động Chuẩn Của AI |
| :--- | :--- |
| *"Khởi tạo hệ thống theo HOW_WE_WORK.md"* | Dựng toàn bộ bộ khung thư mục + context-packages + governance + các file mẫu + script fitness function. Chủ động surface ambiguity. |
| *"Soạn batch prompt cho yêu cầu X"* | Phân tích yêu cầu -> Chia task độc lập -> Xuất vào `docs/tasks/X.md`. Không sửa code. |
| *"Chạy điều tra Task N"* | Đọc đúng Context Package tương ứng -> Trace code -> Phân tích Spec Impact -> Xuất `task-N-fix.md` (draft). |
| *"Thực thi Task N"* | Kiểm tra file fix đã approved -> Cập nhật Spec -> Sửa Code -> Verify theo AGENTS §5.D -> Conditional commit trên branch riêng. |
| *"Review / merge request vào main"* | Xác định source/target commit -> Đối chiếu ticket/spec gốc -> Trả lời đủ 10 câu trong Merge Review Gate kèm bằng chứng -> Kết luận đủ/chưa đủ điều kiện; chỉ merge khi được yêu cầu rõ ràng và gate đạt. |
| *"Sửa nhanh lỗi chính tả / format này"* | Áp dụng Fast Track hợp lệ -> Sửa -> Verify/DoD theo AGENTS -> Conditional commit. |

