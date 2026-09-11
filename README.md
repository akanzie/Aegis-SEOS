# Aegis-SEOS: AI-Native Engineering Operating System

> **Triết lý cốt lõi (Core Philosophy):**  
> *"Tài liệu là hệ điều hành (Docs-as-an-OS), Code là kết quả phái sinh, Session AI là tiến trình độc lập và dùng một lần (Disposable Process)."*

**Aegis-SEOS** là bộ khung vận hành phát triển phần mềm AI-Native, tập trung giảm thiểu các vấn đề thường gặp khi Developer làm việc cùng AI: **Ảo giác (Hallucination)**, **Phình token (Context bloat)**, **Xói mòn ranh giới kiến trúc (Architectural decay)** và **Kho tài liệu biến thành bãi rác (Document sprawl / Project Junkyard)**.

---

## 🌟 Tính Năng & Rào Chắn Nổi Bật

- **[Hiến pháp Tối cao](AGENTS.md)**: Bản thỏa ước vận hành chuẩn mực (Unified Operating Contract) cho cả Developer và AI Agent, xác lập thứ bậc nguồn sự thật (Hierarchy of Truth) và các ranh giới bất biến.
- **[Máy Chấm Ranh Giới Tự Động](docs/fitness-functions/architecture-rules.md)**: Xác thực các luật Machine-enforced qua `npm run test:fitness` — ngăn chặn sớm việc vi phạm tính thuần khiết của tầng Domain, rò rỉ server secrets sang Client components, hoặc gọi trực tiếp biến môi trường không qua schema.
- **[Ngăn Ngừa Ảo Giác Với Context Packages](docs/context-packages/README.md)**: Gói ngữ cảnh thiết kế tinh gọn theo từng task (khuyến nghị <= 15k tokens); toàn bộ Investigation Session duy trì trong ngưỡng an toàn (<= 30k tokens).
- **Phân Tách Definition of Done (DoD)**:
  - **Standard DoD**: Áp dụng cho Standard 3-Step Path đối với tính năng mới, thay đổi nghiệp vụ, sửa lỗi phức tạp hoặc can thiệp schema.
  - **Fast Track DoD**: Luồng xử lý tinh gọn cho tài liệu, sửa lỗi chính tả (typo), CSS thuần không đổi layout tree, hoặc bổ sung unit test độc lập.
- **[Phân Cấp Luồng Sống Còn](docs/business-metrics/critical-flows.md)**: Phân tầng rõ rệt từ P0 (System Survival) đến P4 (Nice to have), kích hoạt mức độ nhạy cảm tự động dựa trên bán kính tác động (Impact-based risk / Blast Radius).
- **[Quản Lý Vòng Đời Tri Thức](docs/governance/knowledge-lifecycle.md)**: Quy định chu kỳ rà soát, dọn dẹp và lưu trữ (Retention & Archive) Task files, Incidents và ADRs sau 6–12 tháng nhằm giữ kho tài liệu luôn gọn gàng, chống quá tải token.

---

## ⚡ Hướng Dẫn Bắt Đầu Nhanh (Quick Start)

### 1. Khởi Tạo & Chạy Máy Chấm Kiến Trúc
Xem hướng dẫn chi tiết về cấu hình môi trường tại [HOW_WE_WORK.md](docs/HOW_WE_WORK.md). Sau khi chuẩn bị môi trường, bạn có thể chạy máy chấm ranh giới kiến trúc:

```bash
npm run test:fitness
```

### 2. Quy Trình Làm Việc Hàng Ngày: Standard Path vs Fast Track

- **Standard 3-Step Path**: Bắt buộc áp dụng cho các thay đổi nghiệp vụ, đa module, schema/database hoặc các tác vụ có khả năng ảnh hưởng đến luồng P0/P1:
  ```text
  [BƯỚC 1: SOẠN BATCH PROMPT]  ──▶  [BƯỚC 2: SESSION ĐIỀU TRA]  ──▶  [BƯỚC 3: SESSION THỰC THI]
    Tạo 1 file prompt tập trung      Trace code, nạp Context Package      Kiểm tra approved -> Sửa spec
    tại docs/tasks/<request>.md       Xuất task-N-fix.md (status: draft)   Sửa code phẫu thuật -> Run fitness
    Không sửa code sớm.              Dev duyệt -> status: approved        Conditional Commit trên branch riêng
  ```
- **Fast Track**: Dành cho các thay đổi nhỏ, không thay đổi runtime behavior và không chạm vào bất kỳ Hard Stop nào (Public API, Database, Auth, Business logic, P0/P1). Quy trình: `Điều tra nhanh -> Sửa code -> Chạy test/fitness -> Nghiệm thu Fast Track DoD -> Conditional Commit`.

> [!NOTE]
> Chi tiết điều kiện Fast Track và rào chắn dừng khẩn cấp (Hard Stop) được quy định tại [AGENTS.md](AGENTS.md).

### 3. Quy Chuẩn Nhánh Git & Cam Kết Có Điều Kiện

- **Tuyệt đối không commit trực tiếp lên `main` / `master`**. Mọi công việc bắt buộc thực hiện trên branch riêng:
  - `task/<ten-task>`: Yêu cầu công việc tổng hợp.
  - `feat/<ten-feature>`: Phát triển tính năng mới.
  - `fix/<ten-bug>`: Sửa lỗi hệ thống.
  - `hotfix/<incident-code>`: Vá khẩn cấp cho sự cố production đã xác nhận.
- **Cam Kết Có Điều Kiện (Conditional Commit)**: AI chỉ tạo local commit khi Developer hoặc repository policy cho phép và toàn bộ điều kiện sau được thỏa mãn:
  1. Working tree chỉ chứa các thay đổi thuộc phạm vi task; không chứa file rác, file `.env`, credentials hoặc thay đổi ngoài scope. Nếu có baseline bẩn từ trước, phải bảo toàn baseline và không pha trộn vào commit.
  2. Toàn bộ automated tests liên quan đều PASS (`npm test` nếu có cấu hình).
  3. Máy chấm kiến trúc PASS với Exit code 0 (`npm run test:fitness`).
  4. Không còn giả định mở hay mâu thuẫn tài liệu chưa giải quyết.
  5. Đang ở trên task branch hợp lệ (`task/*`, `feat/*`, `fix/*`, `hotfix/*`).
  6. Sau commit, không còn thay đổi chưa xử lý thuộc scope của task; mọi thay đổi baseline có sẵn từ trước phải được giữ nguyên và ghi nhận rõ.

---

## 🛡️ 9 Ranh Giới Kỹ Thuật & 1 Verification Gate

1. **Domain Pure**: `src/domain/` độc lập hoàn toàn, cấm import DB client, ORMs, frameworks, network clients hoặc UI. _Machine-enforced_
2. **Client/Server Isolation**: File `'use client'` cấm import DB client, server secrets hoặc server-only modules. _Machine-enforced_
3. **No Raw Env**: Cấm gọi trực tiếp `process.env.*` rải rác; bắt buộc import qua schema validation tập trung (`src/lib/env.ts`). _Machine-enforced_
4. **Server Trust Boundary**: Mọi truy vấn CSDL phải scope theo `userId`/`tenantId` từ session đã xác thực ở server; không tin cậy client params. _Review-enforced_
5. **Stateless Services**: Service singletons cấm lưu trạng thái người dùng trong biến `this.*`; toàn bộ context phải truyền qua tham số hàm. _Review-enforced_
6. **Idempotent Master Seeds**: Mọi dữ liệu hạt giống (seed) bắt buộc có canonical deterministic key và upsert lũy đẳng. _Review-enforced_
7. **Expand-and-Contract Migrations**: Không bao giờ xóa hoặc đổi tên cột DB cùng một lần release; tuân thủ chu trình Expand -> Backfill -> Read Transition -> Contract. _Review-enforced_
8. **Độ Nhạy Theo Tác Động (Blast Radius)**: Task có khả năng ảnh hưởng trực tiếp hoặc gián tiếp đến invariant, contract hoặc runtime path của luồng P0/P1 phải được nâng lên `risk_level: HIGH/CRITICAL` và không được dùng Fast Track. _Review-enforced_
9. **Performance & Observability Guardrails**: List queries trên runtime path phải có giới hạn theo API contract; các flow P0/P1 phải đáp ứng yêu cầu structured logging, correlation ID và alerting tương ứng. _Review-enforced_
10. **Architecture Fitness Gate**: Bắt buộc chạy `npm run test:fitness` khi script tồn tại và phạm vi công việc yêu cầu. Kết quả PASS xác nhận các luật Machine-enforced hiện được validator hỗ trợ. _Verification gate_

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
│   │   ├── quick-checklist.md           # One-Pager: 9 ranh giới, verification gate & DoD
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

## 📖 Mục Lục Tài Liệu Cốt Lõi

* 📘 [Cẩm nang vận hành SEOS (HOW_WE_WORK.md)](docs/HOW_WE_WORK.md)
* 📋 [Checklist 10 điều bất biến & DoD One-Pager (quick-checklist.md)](docs/operations/quick-checklist.md)
* 🚀 [Checklist kiểm định trước release (preflight-checklist.md)](docs/operations/preflight-checklist.md)
* 🏛️ [Ranh giới kiến trúc & Fitness rules (architecture-rules.md)](docs/fitness-functions/architecture-rules.md)
* ⚖️ [Quy chế Quyết định Kiến trúc ADR (decisions/README.md)](docs/decisions/README.md)
