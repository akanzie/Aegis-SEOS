# Aegis-SEOS — AI-Native Engineering Operating System

> **Triết lý cốt lõi (Core Philosophy):**  
> *"Tài liệu là hệ điều hành (Docs-as-an-OS), Code là kết quả phái sinh, Session AI là tiến trình độc lập và dùng một lần (Disposable Process)."*

**Aegis-SEOS** là bộ khung vận hành phần mềm theo mô hình AI-Native có kỷ luật kỹ thuật khắt khe. Hệ thống giải quyết triệt để các vấn đề thường gặp khi phát triển phần mềm cùng AI: **Ảo giác (Hallucination)**, **Phình token (Context bloat)**, **Mất kiểm soát ranh giới kiến trúc (Architectural decay)** và **Kho tài liệu biến thành bãi rác (Project Junkyard)**.

---

## 🌟 Điểm Nhấn Kiến Trúc & Tính Năng Nổi Bật

* **Hiến pháp Tối cao ([AGENTS.md](AGENTS.md))**: Quy chuẩn vận hành xác định (Deterministic Operating Contract) dành cho mọi AI Agent và Developer, thiết lập rõ thứ bậc nguồn sự thật (Hierarchy of Truth) và rào chắn an toàn.
* **Máy Chấm Tự Động ([Fitness Functions](docs/fitness-functions/architecture-rules.md))**: Xác thực ranh giới phân tầng qua `npm run test:fitness` — tự động chặn đứng mã nguồn vi phạm tầng Domain, rò rỉ secrets ra Client components, hoặc truy cập biến môi trường không qua schema.
* **Ngăn Ngừa Ảo Giác Với [Context Packages](docs/context-packages/README.md)**: Thiết kế gói ngữ cảnh chuyên biệt với giới hạn Token trần (`Must Load`, `Optional`, `Do Not Load`), giữ session tinh gọn (< 30k tokens).
* **Phân Tách Definition of Done (DoD)**:
  * **Standard DoD**: Chu trình 3 bước chuẩn mực cho tính năng mới, tái cấu trúc hoặc sửa lỗi nghiệp vụ.
  * **Fast Track DoD**: Luồng xử lý nhanh cho tài liệu, typo, CSS layout thuần và kiểm thử đơn vị độc lập.
* **Ranh Giới Luồng Sống Còn ([Critical Flows](docs/business-metrics/critical-flows.md))**: Phân cấp rõ nét từ P0 (System Survival) đến P4 (Nice to have), kích hoạt mức độ nhạy cảm tự động dựa trên bán kính tác động (Blast Radius).
* **Quản Lý Vòng Đời Tri Thức ([Knowledge Lifecycle](docs/governance/knowledge-lifecycle.md))**: Chu kỳ dọn dẹp, đóng băng và lưu trữ tự động sau 6–12 tháng cho Task files, Incidents và ADRs.

---

## 🗺️ Bản Đồ Cấu Trúc Hệ Thống (Directory Map)

```text
[Aegis-SEOS Root]
├── AGENTS.md                            # Hiến pháp vận hành AI-Native tối cao
├── README.md                            # Tổng quan hệ thống & hướng dẫn bắt đầu
├── package.json                         # Scripts kiểm tra và cấu hình dự án
├── docs/
│   ├── HOW_WE_WORK.md                   # Cẩm nang toàn diện: Onboarding & Bootstrap
│   ├── context-packages/                # First-Class Context Packages (< 15k tokens)
│   ├── operations/
│   │   ├── quick-checklist.md           # One-Pager: 10 điều bất biến & DoD
│   │   └── preflight-checklist.md       # Checklist kiểm định trước release/PR
│   ├── system-map/
│   │   ├── modules.md                   # Phân tầng kiến trúc (Domain, Service, Infra, UI)
│   │   ├── dependencies.md              # Ma trận import cho phép / bị cấm
│   │   └── critical-paths.md            # Các luồng sống còn (Auth, Core Loop, Payment, Sync)
│   ├── business-metrics/
│   │   └── critical-flows.md            # Chuẩn hóa phân cấp luồng trọng yếu P0 - P4
│   ├── fitness-functions/
│   │   ├── architecture-rules.md        # Ranh giới kiến trúc (Machine vs Review enforced)
│   │   └── ci-enforcement.md            # Hướng dẫn chạy máy chấm & tích hợp CI/CD
│   ├── playbooks/
│   │   ├── feature-development.md       # SOP phát triển tính năng mới
│   │   ├── bug-investigation.md         # SOP điều tra lỗi RCA không sinh ảo giác
│   │   ├── database-migration.md        # SOP Expand-and-Contract Migration & Seeds
│   │   └── production-incident.md       # SOP ứng phó sự cố khẩn cấp (SEV-1/2/3)
│   ├── standards/
│   │   ├── observability.md             # Chuẩn Logging, Tracing ID & Tiered Alerting
│   │   └── performance.md               # Rào chắn hiệu năng: Phân trang, chống N+1, Indexing
│   ├── decisions/                       # Architecture Decision Records (ADR)
│   ├── project-memory/                  # Ký ức kỹ thuật (Lessons, Pitfalls, Rejected)
│   ├── main_docs/                       # Đặc tả chức năng chuẩn (Business "WHAT")
│   └── tasks/                           # Nơi lưu trữ Batch Prompts và Task Fix plans
└── scripts/
    └── validators/
        └── architecture-fitness.mjs     # Script máy chấm ranh giới kiến trúc tự động
```

---

## ⚡ Hướng Dẫn Bắt Đầu Nhanh (Quick Start)

### 1. Cài Đặt & Chạy Máy Chấm Kiến Trúc
```bash
# Kiểm tra máy chấm ranh giới kiến trúc tự động
npm run test:fitness
```

### 2. Chu Trình Làm Việc Hàng Ngày Giữa Dev & AI

Quy trình phát triển tuân thủ nghiêm ngặt **Quy trình Chuẩn 3 bước (Standard 3-Step Path)**:

```text
[BƯỚC 1: SOẠN BATCH PROMPT]  ──▶  [BƯỚC 2: SESSION ĐIỀU TRA]  ──▶  [BƯỚC 3: SESSION THỰC THI]
  Tạo 1 file prompt tập trung      Trace code, nạp Context Package      Kiểm tra approved -> Sửa spec
  tại docs/tasks/<request>.md       Xuất task-N-fix.md (status: draft)   Sửa code phẫu thuật -> Run fitness
  Không sửa code sớm.              Dev duyệt -> status: approved        Conditional Commit trên branch riêng
```

### 3. Quy Chuẩn Nhánh Git & Cam Kết Có Điều Kiện
- **Tuyệt đối không commit trực tiếp lên `main` / `master`**.
- Mọi công việc bắt buộc thực hiện trên branch riêng:
  - `task/<ten-task>`: Yêu cầu công việc tổng hợp.
  - `feat/<ten-feature>`: Phát triển tính năng mới.
  - `fix/<ten-bug>`: Sửa lỗi hệ thống.
  - `hotfix/<incident-code>`: Vá khẩn cấp lỗi production.
- **Conditional Commit**: AI chỉ được phép commit khi:
  1. Working tree chỉ chứa thay đổi thuộc phạm vi task (bảo toàn baseline nếu có trước đó).
  2. Toàn bộ automated tests liên quan đều PASS.
  3. Máy chấm kiến trúc PASS với Exit code 0 (`npm run test:fitness`).
  4. Không còn giả định mở hay mâu thuẫn tài liệu chưa giải quyết.
  5. Đang ở trên task branch hợp lệ.
  6. Sau commit, working tree sạch sẽ không còn file dở dang.

---

## 🛡️ 10 Ranh Giới Kỹ Thuật Bất Biến

1. **Domain Pure**: `src/domain/` độc lập hoàn toàn, cấm import DB client, ORMs, frameworks hoặc UI. *(Machine-enforced)*
2. **Client/Server Isolation**: File `'use client'` cấm import DB client hoặc secrets. *(Machine-enforced)*
3. **No Raw Env**: Cấm gọi `process.env` trực tiếp, bắt buộc qua schema validate tập trung (`src/lib/env.ts`). *(Machine-enforced)*
4. **Server Trust Boundary**: Mọi truy vấn CSDL phải scope theo `userId` từ session đã xác thực ở server. *(Review-enforced)*
5. **Stateless Services**: Service singletons cấm lưu trạng thái người dùng trong biến `this.*`. *(Review-enforced)*
6. **Idempotent Master Seeds**: Dữ liệu hạt giống bắt buộc có canonical key và upsert lũy đẳng. *(Review-enforced)*
7. **Expand-and-Contract Migrations**: Không bao giờ xóa hoặc đổi tên cột DB cùng một lần release. *(Review-enforced)*
8. **Độ Nhạy Theo Bán Kính Tác Động**: Task chạm luồng P0/P1 tự động nâng `risk_level: HIGH/CRITICAL`, cấm Fast Track. *(Review-enforced)*
9. **Performance & Observability Guardrails**: Cấm truy vấn không giới hạn, bắt buộc phân trang chuẩn, structured logs và correlation ID. *(Review-enforced)*
10. **Machine-Verified Fitness**: Bắt buộc `npm run test:fitness` trả về Exit code 0 trước khi kết thúc task. *(Machine-enforced)*

---

## 📖 Tài Liệu Tham Khảo Nhanh

* 📘 [Cẩm nang vận hành SEOS (HOW_WE_WORK.md)](docs/HOW_WE_WORK.md)
* 📋 [Checklist 10 điều bất biến & DoD One-Pager (quick-checklist.md)](docs/operations/quick-checklist.md)
* 🚀 [Checklist kiểm định trước release (preflight-checklist.md)](docs/operations/preflight-checklist.md)
* 🏛️ [Ranh giới kiến trúc & Fitness rules (architecture-rules.md)](docs/fitness-functions/architecture-rules.md)
* ⚖️ [Quy chế Quyết định Kiến trúc ADR (decisions/README.md)](docs/decisions/README.md)
