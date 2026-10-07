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
- **[Phân Cấp Luồng Sống Còn](docs/operations/critical-flows.md)**: Phân tầng rõ rệt từ P0 (System Survival) đến P4 (Nice to have), kích hoạt mức độ nhạy cảm tự động dựa trên bán kính tác động (Impact-based risk / Blast Radius).
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
- **Fast Track**: Dành cho các thay đổi nhỏ, không thay đổi runtime behavior và không chạm vào bất kỳ Hard Stop nào (Public API, Database, Auth, Business logic, P0/P1). Quy trình: `Điều tra nhanh -> Sửa đổi -> Verify theo AGENTS §5.D -> Nghiệm thu Fast Track DoD -> Conditional Commit`.

> [!NOTE]
> Chi tiết điều kiện Fast Track và rào chắn dừng khẩn cấp (Hard Stop) được quy định tại [AGENTS.md](AGENTS.md).

### 3. Quy Chuẩn Nhánh Git & Cam Kết Có Điều Kiện

Theo [AGENTS §2.C](AGENTS.md), làm việc trên branch `task/*`, `feat/*`, `fix/*` hoặc `hotfix/*`; không commit trực tiếp `main`/`master`. Conditional commit kiểm tra **index chỉ chứa thay đổi task**, giữ nguyên baseline trong working tree, các gate bắt buộc đã PASS và không còn giả định mở. Sau commit không còn thay đổi task chưa xử lý; baseline đã ghi nhận có thể vẫn còn.

Điều kiện đầy đủ thuộc AGENTS; applicability test/fitness tại [§5.D](AGENTS.md#quality-gate-applicability), test scope tại [Verification Standard](docs/standards/verification.md#risk-test-matrix). README chỉ tóm tắt, không cấp quyền Git hoặc miễn gate.

---

## 🛡️ 9 Ranh Giới Kỹ Thuật & 1 Verification Gate

1. **Domain Pure**: `src/domain/` độc lập hoàn toàn, cấm import DB client, ORMs, frameworks, network clients hoặc UI. _Machine-enforced_
2. **Client/Server Isolation**: File `'use client'` cấm import DB client, server secrets hoặc server-only modules. _Machine-enforced_
3. **No Raw Env**: Cấm gọi trực tiếp `process.env.*` rải rác; bắt buộc import qua schema validation tập trung (`src/lib/env.ts`). _Machine-enforced_
4. **Server Trust Boundary**: User/tenant queries dùng identity/quyền được server xác thực; public/master-data/system-job có authority và scope riêng theo [Rule 4](docs/fitness-functions/architecture-rules.md#rule-server-trust-boundary). Client params không cấp quyền. _Review-enforced_
5. **Stateless Services**: Service singletons cấm lưu trạng thái người dùng trong biến `this.*`; toàn bộ context phải truyền qua tham số hàm. _Review-enforced_
6. **Idempotent Master Seeds**: Mọi dữ liệu hạt giống (seed) bắt buộc có canonical deterministic key và upsert lũy đẳng. _Review-enforced_
7. **Expand-and-Contract Migrations**: Không bao giờ xóa hoặc đổi tên cột DB cùng một lần release; tuân thủ chu trình Expand -> Backfill -> Read Transition -> Contract. _Review-enforced_
8. **Độ Nhạy Theo Tác Động (Blast Radius)**: Task có khả năng ảnh hưởng trực tiếp hoặc gián tiếp đến invariant, contract hoặc runtime path của luồng P0/P1 phải được nâng lên `risk_level: HIGH/CRITICAL` và không được dùng Fast Track. _Review-enforced_
9. **Performance & Observability Guardrails**: List queries trên runtime path phải có giới hạn theo API contract; các flow P0/P1 phải đáp ứng yêu cầu structured logging, correlation ID và alerting tương ứng. _Review-enforced_
10. **Architecture Fitness Gate**: Áp dụng [bảng gate của AGENTS](AGENTS.md#quality-gate-applicability); PASS chỉ xác nhận luật Machine-enforced mà validator hỗ trợ. Thiếu validator cho gate bắt buộc là BLOCKED. _Verification gate_

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
│   │   ├── critical-flows.md            # Taxonomy canonical P0–P4 và blast radius
│   │   ├── quick-checklist.md           # One-Pager: 9 ranh giới, verification gate & DoD
│   │   └── preflight-checklist.md       # Checklist kiểm định trước release/PR
│   ├── system-map/
│   │   ├── modules.md                   # Phân tầng kiến trúc (Domain, Service, Infra, UI)
│   │   ├── dependencies.md              # Ma trận import cho phép / bị cấm
│   │   └── critical-paths.md            # Các luồng sống còn (Auth, Core Loop, Payment, Sync)
│   ├── business-metrics/
│   │   └── critical-flows.md            # Compatibility pointer tới operations/critical-flows.md
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

* 📝 [Bộ template vận hành (prompt, task, profile, review, rework, handoff, ADR, spec)](docs/templates/README.md)
* 📘 [Cẩm nang vận hành SEOS (HOW_WE_WORK.md)](docs/HOW_WE_WORK.md)
* 📋 [Checklist 10 điều bất biến & DoD One-Pager (quick-checklist.md)](docs/operations/quick-checklist.md)
* 🚀 [Checklist kiểm định trước release (preflight-checklist.md)](docs/operations/preflight-checklist.md)
* 🏛️ [Ranh giới kiến trúc & Fitness rules (architecture-rules.md)](docs/fitness-functions/architecture-rules.md)
* ⚖️ [Quy chế Quyết định Kiến trúc ADR (decisions/README.md)](docs/decisions/README.md)
