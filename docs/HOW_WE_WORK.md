# How We Work: AI-Native Engineering Operating System (SEOS)
## Cẩm Nang Vận Hành & Khởi Tạo Dự Án Mới Dành Cho Developer & AI Agent

> **Tuyên ngôn cốt lõi:**  
> *"Tài liệu là hệ điều hành (Docs-as-an-OS), Code là kết quả phái sinh, Session AI là tiến trình độc lập và dùng một lần (Disposable Process)."*

Tài liệu này phục vụ **2 mục đích song song**:
1. **Dành cho Người mới (Developer Onboarding)**: Đọc 10 phút là hiểu toàn bộ văn hóa kỹ thuật, quy trình làm việc hàng ngày, cách ra lệnh cho AI mà không gây nợ kỹ thuật và không bị ảo giác.
2. **Dành cho AI Agent (Cold-Start Bootstrap Protocol)**: Khi sang một dự án mới hoàn toàn, Developer chỉ cần đưa file này cho AI và ra lệnh: *"Khởi tạo hệ thống theo tài liệu này"*, AI sẽ khởi tạo bộ khung theo tài liệu này và chủ động làm rõ các điểm mơ hồ (`surface any ambiguity`) để thống nhất trước khi đào sâu triển khai.

---

# PHẦN 1: DÀNH CHO CON NGƯỜI (HUMAN ONBOARDING)

Nếu bạn là Developer mới tham gia dự án hoặc bắt đầu áp dụng mô hình này: **Chào mừng bạn đến với kỷ nguyên phát triển phần mềm AI-Native có kỷ luật.**

### 1. Sự Khác Biệt Giữa "Chat-and-Pray" và "AI-Native SEOS"

| Tiêu Chí | Cách Làm Tự Phát ("Chat-and-Pray") | Cách Chúng Ta Làm Việc (AI-Native SEOS) |
| :--- | :--- | :--- |
| **Bản chất cuộc chat** | Trò chuyện dài vô tận, code dở dang tích lũy trong chat | Mỗi session chat là 1 tiến trình độc lập, xong task là đóng session |
| **Nguồn sự thật** | Nằm trong đầu Dev hoặc trôi nổi trong lịch sử chat | Lưu trên đĩa (`docs/main_docs/fn/`, `system-map/`, `project-memory/`) |
| **Chi phí token** | Phình to theo thời gian, AI bắt đầu quên và sinh ảo giác | Tối ưu tuyệt đối theo **Context Packages** (< 30k tokens/session) |
| **Bảo vệ kiến trúc** | Trông chờ vào trí nhớ của Dev hoặc AI | **Máy chấm tự động** (`npm run test:fitness` fail ngay nếu vi phạm) |
| **Nghiệp vụ vs Code** | Code đổi nhưng spec không đổi, sinh hàng tá bug ngầm | Bắt buộc đánh giá **Spec Impact** (`NONE/CLARIFY/CHANGE/CONFLICT`) |

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
- Dev xem lướt file fix -> Đổi metadata sang "status: approved" (hoặc đưa AI khác review)
- Mở Clean Session mới -> Chỉ thị: "Thực thi docs/tasks/<name>/task-N-fix.md"
- AI cập nhật Spec -> Sửa Code phẫu thuật -> Chạy test & fitness -> Tự động Commit
```

#### A. Khi Nào Dùng Luồng Nhanh (Fast Track)?
Để không bị mệt mỏi vì thủ tục, bạn được dùng **Fast Track** (bỏ qua bước tạo task file và approval gate) khi thỏa mãn:
- Sửa lỗi chính tả (typo), cập nhật markdown, viết comment, format code.
- Chỉnh sửa CSS thuần túy không đổi cấu trúc layout/DOM.
- Viết bổ sung Unit test thuần túy không sửa logic runtime.
- **Quy trình Fast Track**: `Điều tra nhanh -> Sửa code -> Chạy test & npm run test:fitness -> Commit ngay`.

#### B. Quy Tắc Vàng Về Git:
- **Tuyệt đối KHÔNG commit trực tiếp lên `main` / `master`**.
- Luôn làm việc trên branch riêng theo task: `task/<ten-task>`, `feat/<ten-feature>`, `fix/<ten-bug>`.
- AI chỉ commit khi toàn bộ test và fitness functions đều PASS (Exit code 0).

---

### 3. Nguyên Tắc "Spec Impact Assessment" (Trái Tim Nghiệp Vụ)

Mỗi khi sửa bất kỳ dòng code nào, AI bắt buộc phải trả lời câu hỏi: **"Sửa đổi này tác động gì đến tài liệu đặc tả nghiệp vụ?"**:
1. **`NONE`**: Code đang chạy sai so với spec chuẩn -> Sửa code, giữ nguyên spec.
2. **`CLARIFICATION`**: Hành vi thực tế đúng nhưng spec chưa diễn đạt rõ edge case -> Bổ sung làm rõ spec, không đổi code.
3. **`CHANGE`**: Yêu cầu nghiệp vụ thay đổi -> **Bắt buộc cập nhật spec trong `docs/main_docs/vX.X/fn/` trước hoặc song song với code**.
4. **`CONFLICT`**: Phát hiện spec và code mâu thuẫn sâu sắc -> Dừng lại, báo cáo Dev giải quyết.

---

# PHẦN 2: DÀNH CHO AI AGENT (COLD-START BOOTSTRAP PROTOCOL)

> [!IMPORTANT]
> **Chỉ thị dành riêng cho AI khi nhận file này trong một repository mới**:  
> Nếu Developer yêu cầu: *"Khởi tạo hệ thống theo HOW_WE_WORK.md"* (hoặc bootstrap repository), AI phải **tự động khởi tạo toàn bộ bộ khung thư mục và các file mẫu** dưới đây mà không cần hỏi lại từng file.

### 1. Ma Trận Thư Mục Cần Khởi Tạo Ngay Lập Tức

```
[Root Repository]
├── AGENTS.md                            # Hợp đồng vận hành tối cao (Operating Contract)
├── docs/
│   ├── HOW_WE_WORK.md                   # File cẩm nang này
│   ├── context-packages/                # First-Class Context Packages (Load/Do Not Load/Token Budget)
│   ├── operations/
│   │   ├── quick-checklist.md           # 1 trang One-Pager: 10 điều bất biến
│   │   └── preflight-checklist.md       # Checklist chi tiết trước release
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
│   │   └── critical-flows.md            # Phân cấp User flows trọng yếu (P0-P4)
│   ├── engineering-incidents/
│   │   └── incident-template.md         # Mẫu ghi nhận sự cố post-mortem
│   ├── main_docs/
│   │   ├── ACTIVE_VERSION.md            # Khai báo phiên bản spec đang active (v1.0)
│   │   └── v1.0/fn/                     # Thư mục chứa các specs nghiệp vụ
│   ├── architecture/                    # Thiết kế kỹ thuật chi tiết
│   ├── decisions/                       # Architecture Decision Records (ADR)
│   ├── standards/                       # Quy chuẩn code (TypeScript, DB, Security)
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
- Định nghĩa rõ thứ tự ưu tiên giải quyết mâu thuẫn: `An Toàn > Dev Override > Approved Task > Functional Specs > Architecture > Code Style`.
- Khai báo quy chuẩn Git an toàn: Cấm commit lên `main`, tự tạo branch theo task, cấm tự ý `push`/`reset --hard`.
- Khai báo Token Budget: Low (<= 10k), Medium (<= 30k), High (<= 60k), Critical (Cần duyệt).
- Khai báo 2 luồng: Fast Track và Standard 3-Step Path.

#### B. `docs/operations/quick-checklist.md` (10 Điều Bất Biến)
1. **Domain Pure**: Tầng domain cấm import DB, framework, network, UI.
2. **Server Trust Boundary**: Mọi query DB phải lọc theo `userId` từ session đã xác thực.
3. **Stateless Services**: Service singleton cấm lưu state người dùng trong biến `this`.
4. **Client/Server Isolation**: Client components cấm import server-only modules hoặc DB client.
5. **No Raw Env**: Cấm đọc `process.env` rải rác ngoài module schema validate tập trung (`src/lib/env.ts`).
6. **Master Data Identity**: Mọi dữ liệu hạt giống (seed) phải có canonical identity key và upsert lũy đẳng.
7. **Expand-and-Contract**: Không bao giờ đổi tên hoặc xóa cột DB trong cùng 1 lần release.
8. **Critical Flows Sensitivity**: Thay đổi chạm vào flow P0/P1 tự động nâng Risk >= HIGH.
9. **Fast Track Boundary**: Chỉ áp dụng cho typo, markdown, comments, formatting, CSS thuần, test thuần.
10. **Machine-Verified Fitness**: Bắt buộc chạy `npm run test:fitness` pass trước khi kết thúc task.

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
  - **Token Budget**: Ngưỡng token trần cho package (thường `<= 15.000 tokens`).

#### F. `docs/governance/knowledge-lifecycle.md` (Chống Biến Thành "Project Junkyard")
- Quy tắc lưu trữ và dọn dẹp tài liệu theo thời gian:
  - **Task files (`docs/tasks/**`)**: Sau 6 tháng đóng task -> di chuyển vào `archive/`.
  - **Incidents (`docs/engineering-incidents/**`)**: Sau 12 tháng -> tổng hợp bài học vào `technical-lessons.md` rồi archive.
  - **ADRs (`docs/decisions/**`)**: Khi bị thay thế bởi quyết định mới -> đổi trạng thái sang `Superseded` và liên kết sang ADR mới.

#### G. Chuẩn Hóa Phân Cấp Luồng Trọng Yếu (Critical Flows P0 - P4)
- **P0 - System Survival**: Luồng sống còn (Auth, Session, Core Loop, Payment Gateways). Lỗi = Blocker.
- **P1 - Revenue & Integrity**: Ảnh hưởng doanh thu hoặc mất tính toàn vẹn dữ liệu.
- **P2 - Core Business**: Các use case nghiệp vụ chính của người dùng.
- **P3 - Convenience**: Các tính năng hỗ trợ, tiện ích bổ sung.
- **P4 - Nice to Have**: Chỉnh chu UI/UX, micro-interactions, copy text.
- *Quy tắc độ nhạy*: Bất kỳ task nào chạm vào luồng **P0 / P1** tự động nâng mức rủi ro lên `>= HIGH` và bắt buộc chạy full regression test.

---

### 3. Cheat Sheet Dành Cho AI Khi Nhận Chỉ Thị Trong Dự Án

| Chỉ Thị Của Dev | Hành Động Chuẩn Của AI |
| :--- | :--- |
| *"Khởi tạo hệ thống theo HOW_WE_WORK.md"* | Dựng toàn bộ bộ khung thư mục + context-packages + governance + các file mẫu + script fitness function. Chủ động surface ambiguity. |
| *"Soạn batch prompt cho yêu cầu X"* | Phân tích yêu cầu -> Chia task độc lập -> Xuất vào `docs/tasks/X.md`. Không sửa code. |
| *"Chạy điều tra Task N"* | Đọc đúng Context Package tương ứng -> Trace code -> Phân tích Spec Impact -> Xuất `task-N-fix.md` (draft). |
| *"Thực thi Task N"* | Kiểm tra file fix đã approved -> Cập nhật Spec -> Sửa Code -> Chạy test/fitness -> Auto commit trên branch riêng. |
| *"Sửa nhanh lỗi chính tả / format này"* | Áp dụng Fast Track -> Sửa trực tiếp -> Chạy test -> Commit ngay. |

