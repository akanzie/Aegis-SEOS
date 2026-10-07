# AI Bootstrap


Phần này không phải hướng dẫn onboarding thường ngày. Dùng khi Developer yêu cầu tạo/tiếp nhận SEOS trên repository mới; với session trong repository đang hoạt động, theo cold-start/resume tại [Agent Workflow](../operations/agent-workflow.md).

Lõi quy trình dùng chung gồm [Agent Workflow](../operations/agent-workflow.md), [Task Authoring](../task-authoring/README.md), [Verification Standard](../standards/verification.md) và [Handoff Contract](../operations/handoff-contract.md). Workflow sở hữu mode/permission và cold-start; Task Lifecycle sở hữu approval/transitions; Review & Rework sở hữu independence; các entry points này dẫn tới định nghĩa thay vì chép transitions. Nhận diện mode trước thao tác; không tự duyệt plan, chuyển mode hoặc coi skipped/manual pending là PASS.

Khởi tạo hoặc tiếp nhận dự án theo [Project Adoption](../operations/project-adoption.md). Xác minh stack, scripts, CI và tài liệu hiện có trước tạo/cập nhật; không ghi đè baseline. Tạo project profile với commands tương đương và sources of truth thực tế. Các đường dẫn `src/`, Node.js và npm dưới đây là mẫu tham chiếu, cần điều chỉnh theo stack.

> [!IMPORTANT]
> **Chỉ thị dành riêng cho AI khi nhận file này trong một repository mới**:
> Nếu Developer yêu cầu: *"Khởi tạo hệ thống theo HOW_WE_WORK.md"* (hoặc bootstrap repository), AI phải **tự động khởi tạo toàn bộ bộ khung thư mục và các file mẫu** dưới đây mà không cần hỏi lại từng file.

### 1. Ma Trận Thư Mục Cần Khởi Tạo Ngay Lập Tức

```
[Root Repository]
├── AGENTS.md                            # Hợp đồng vận hành tối cao (Operating Contract)
├── docs/
│   ├── HOW_WE_WORK.md                   # Entry page
│   ├── onboarding/                      # human.md và bootstrap.md
│   ├── task-authoring/README.md         # Chuẩn hóa yêu cầu, AC và phân rã task
│   ├── templates/                       # Prompt, task, profile, review/rework, handoff, ADR, spec
│   ├── context-packages/                # First-Class Context Packages (Load/Do Not Load/Token Budget)
│   ├── operations/
│   │   ├── critical-flows.md            # Taxonomy canonical P0–P4 và blast radius
│   │   ├── quick-checklist.md           # 1 trang One-Pager: 10 điều bất biến
│   │   ├── preflight-checklist.md       # Checklist chi tiết trước release
│   │   ├── agent-workflow.md            # Mode và cold-start/resume
│   │   ├── task-lifecycle.md            # Approval, transitions, close
│   │   ├── review-rework.md             # Reviewer independence/findings
│   │   ├── definition-of-done.md        # DoD chi tiết
│   │   ├── merge-review.md              # Gate 10 câu
│   │   ├── handoff-contract.md          # Bằng chứng và bàn giao
│   │   ├── project-adoption.md          # Áp dụng theo stack thực tế
│   │   └── project-profile.md           # Lệnh, môi trường và gate của dự án
│   ├── governance/
│   │   ├── knowledge-lifecycle.md       # Retention/archive
│   │   └── context-assembly.md          # Prefix/token/cache evidence
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

- Dẫn [hierarchy canonical tại AGENTS §0](../../AGENTS.md): Approved task quyết định scope/AC, Accepted ADR quyết định Technical HOW còn hiệu lực; system map/technical architecture là tài liệu dẫn xuất, profile chỉ ánh xạ capability. Không tạo hierarchy rút gọn có authority riêng.
- Khai báo quy chuẩn Git an toàn: Cấm commit lên `main`, tự tạo branch theo task (`task/*`, `feat/*`, `fix/*`, `hotfix/*`), bảo toàn baseline, cấm tự ý `push`/`reset --hard`.
- Dẫn tới [AGENTS §8](../../AGENTS.md#context-budget) cho session budget, package target và overflow action; không sao chép ngưỡng.
- Khai báo 2 luồng: Fast Track (Fast Track DoD) và Standard 3-Step Path (Standard DoD).

#### B. `docs/operations/quick-checklist.md` (10 Điều Bất Biến & Split DoD)
Checklist chỉ tóm tắt/link tới [architecture rules](../fitness-functions/architecture-rules.md), [risk taxonomy](../operations/critical-flows.md), [test matrix](../standards/verification.md#risk-test-matrix) và [DoD/gate applicability của AGENTS](../../AGENTS.md#quality-gate-applicability). Không sao chép bộ policy độc lập khi bootstrap.

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
  - **Target Token Budget**: Mục tiêu riêng cho package; session budgets và overflow action theo [AGENTS §8](../../AGENTS.md#context-budget).

#### F. `docs/governance/knowledge-lifecycle.md` (Chống Biến Thành "Project Junkyard")

- Quy tắc lưu trữ và dọn dẹp tài liệu theo thời gian:
  - **Task records (`docs/tasks/**`)**: Dẫn tới [Knowledge Lifecycle](../governance/knowledge-lifecycle.md) về `closed_at`, retention, archive eligibility và request index.
  - **Incidents (`docs/engineering-incidents/**`)**: Sau 12 tháng -> tổng hợp bài học vào `technical-lessons.md` rồi archive.
  - **ADRs (`docs/decisions/**`)**: Khi bị thay thế bởi quyết định mới -> đổi trạng thái sang `Superseded` và liên kết sang ADR mới.

#### G. Chuẩn Hóa Phân Cấp Luồng Trọng Yếu (Critical Flows P0 - P4)
Nguồn canonical là [operations/critical-flows.md](../operations/critical-flows.md); đường dẫn business-metrics cũ giữ compatibility pointer. Core execution loop của hệ thống thuộc P0, học/luyện tập thông thường thuộc P2; system map ánh xạ theo blast radius và mức cao nhất.

Yêu cầu unit/integration/full flow regression được định nghĩa một lần tại [Verification Standard](../standards/verification.md#risk-test-matrix). P0/P1 cấm Fast Track; docs ảnh hưởng policy bảo vệ các flow này vẫn dùng Standard và fitness bắt buộc. Không tự miễn gate qua project profile.

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
