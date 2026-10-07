# Fitness Functions: Ranh Giới Kiến Trúc & Quy Chuẩn Kiểm Định (Architecture Rules)

Hệ thống ranh giới kiến trúc được chia làm 2 nhóm rõ rệt: **Machine-Enforced Rules** (máy chấm tự động thực thi qua `scripts/validators/architecture-fitness.mjs`) và **Review-Enforced Invariants** (kiểm định qua điều tra, code review và preflight checklist).

---

## PHẦN 1: MACHINE-ENFORCED RULES (MÁY CHẤM TỰ ĐỘNG)

Các quy tắc này được kiểm tra tự động qua lệnh `npm run test:fitness` bằng công cụ quét tĩnh kiến trúc (`scripts/validators/architecture-fitness.mjs`). Bất kỳ vi phạm nào cũng khiến quá trình build và CI thất bại với Exit code 1.

> [!NOTE]
> **Cơ Chế vs Chính Sách (Engine vs Policy)**:
> - **Scanner Engine** (`scripts/validators/architecture-fitness.mjs`): Lexer nhẹ cho JavaScript/TypeScript có thu thập file, bỏ comment, nhận diện một số import và process.env forms, lần theo import tương đối tĩnh. Đây không phải parser/AST và không chứng minh toàn bộ dependency hoặc data flow.
> - **Reference Policy** (`scripts/validators/architecture-fitness-policy.mjs`): Chính sách tham chiếu mặc định cho dự án Node.js/TypeScript theo layout `src/`.
> - **Custom Policy (`architecture-fitness.config.mjs`)**: Cấu hình ứng dụng phải khai báo source roots thật; mọi root phải tồn tại và có ít nhất một file source được hỗ trợ. Các dự án có cấu trúc khác biệt có thể ghi đè roots/patterns/lists, nhưng empty deny lists và vô hiệu hóa client directive không được hỗ trợ. Custom arrays thay thế defaults, nên phải giữ mọi rule cần thiết.

### Scanner support boundary

- Machine checks cover literal static imports/exports, `require('literal')`, `import('literal')`, transitive relative imports resolvable within scanned roots, common direct/bracket/destructured process environment access forms, and configured network globals such as `fetch()` in domain dependency graphs.
- Unsupported or unresolved cases include computed/dynamic module names, package export conditions, TypeScript path aliases that do not resolve as relative paths, generated modules, arbitrary variable/data-flow aliases, regular-expression/JSX syntax, and language syntax the lexer does not understand. Route these cases to source/type-aware review; do not claim the scanner proves them safe.
- Output reports profile mode, configured roots, scanned count, and these limitations. `application` profiles fail if a configured root is absent or no supported file is scanned. `reference` mode may report zero source files only with an explicit statement that no rules were evaluated. Unresolved aliases or computed/dynamic module expressions produce REVIEW REQUIRED and exit code 2; they cannot be reported as fitness PASS until resolved and rerun.
- Fixture isolation and machine-rule regression tests run with `npm test`; task structure and Markdown links use `npm run validate:tasks` and `npm run validate:docs`.

<a id="rule-domain-purity"></a>
### Luật 1: Domain Is Pure (Tầng Nghiệp Vụ Thuần Khiết Tuyệt Đối)
- **Cơ chế kiểm tra**: Máy chấm tự động (`scripts/validators/architecture-fitness.mjs`).
- **Nội dung ràng buộc**: Mã nguồn trong domain roots cấu hình không được phụ thuộc trực tiếp hoặc qua relative imports có thể resolve vào:
  - Database clients / ORMs (`prisma`, `drizzle-orm`, `typeorm`, `mongoose`, `pg`, `mysql2`, `@/lib/db`, `@/infra/db`, v.v.).
  - Web frameworks (`next`, `express`, `fastify`, `react`, `react-dom`, v.v.).
  - Network / HTTP clients (`axios`, `node:http`, `node:https`, `fetch()` global).
- **Mục đích**: Đảm bảo logic nghiệp vụ lõi độc lập hoàn toàn với hạ tầng công nghệ, dễ kiểm thử đơn vị độc lập và bền vững theo thời gian.

<a id="rule-client-isolation"></a>
### Luật 2: Client/Server Isolation (Cách Ly Khách / Chủ Tuyệt Đối)
- **Cơ chế kiểm tra**: Máy chấm tự động (`scripts/validators/architecture-fitness.mjs`).
- **Nội dung ràng buộc**: Các file chứa chỉ thị `'use client'` không được phép import:
  - Database clients / ORMs (`prisma`, `drizzle-orm`, `typeorm`, `@/lib/db`, v.v.).
  - Server secrets hoặc server-only modules (`server-only`, `node:fs`, `node:child_process`).
- **Mục đích**: Ngăn chặn rò rỉ secrets, database credentials và làm phình to kích thước JS bundle phía client.

<a id="rule-no-raw-env"></a>
### Luật 3: No Raw Process Env (Môi Trường Tập Trung Có Schema)
- **Cơ chế kiểm tra**: Máy chấm tự động (`scripts/validators/architecture-fitness.mjs`).
- **Nội dung ràng buộc**: Cấm raw process environment access dạng dot/bracket hoặc các destructured/local aliases phổ biến trong source đã scan (ngoài file schema validation tập trung cấu hình và test files được nhận diện).
- **Mục đích**: Tránh lỗi runtime do thiếu biến môi trường hoặc sai chính tả cấu hình, bảo đảm fail-fast ngay khi khởi động ứng dụng.

---

## PHẦN 2: REVIEW-ENFORCED INVARIANTS (KIỂM ĐỊNH QUA QUY TRÌNH & REVIEW)

Các quy tắc dưới đây bắt buộc được rà soát trong Investigation Session, Code Review và Preflight Checklist cho đến khi có validator tự động chuyên biệt:

<a id="rule-server-trust-boundary"></a>
### Luật 4: Server Trust Boundary & User Scoping (Ranh Giới Phía Máy Chủ)
- **Cơ chế kiểm tra**: Review-enforced / Preflight Checklist.
- **Nội dung ràng buộc**: Mọi query phải có authority và phạm vi truy cập được server xác minh theo loại dữ liệu; client params/body chỉ là input, không là căn cứ cấp quyền.

| Loại query | Authority tin cậy | Scope bắt buộc |
| :--- | :--- | :--- |
| User/tenant-owned (đọc hoặc ghi) | Identity từ Server Session đã xác thực; tenant membership/quyền do server kiểm tra | Predicate `userId`/`tenantId` và ownership/permission của tài nguyên tương ứng; kiểm tra quyền trước mutation. Tenant do client chọn phải được xác minh membership |
| Public data | Public access contract đã xác nhận ở server/spec | Chỉ records/fields được công khai theo contract; không dùng nhãn public để đọc dữ liệu private |
| Shared master data / seed | Read contract của dữ liệu dùng chung; write/seed qua principal hoặc tiến trình quản trị được cấp quyền ở server | Dataset và canonical identity key tương ứng; upsert lũy đẳng. Master data riêng tenant vẫn phải tenant-scoped |
| System job / webhook không có user session | Service principal hoặc trigger được server xác thực (ví dụ chữ ký webhook) và quyền đã được cấp | Job scope/dataset/tenant allowlist được xác minh; thao tác user/tenant data vẫn scope đúng chủ sở hữu. Cấm truy cập toàn bộ DB chỉ vì là job |

- Với mọi loại query: scope được thực thi tại server/repository, không giả lập user session cho dữ liệu system/public và không bỏ kiểm tra quyền. Áp dụng thêm [performance guardrails](../standards/performance.md).
- **Mục đích**: Ngăn IDOR và truy cập chéo user/tenant; các trường hợp không có session vẫn có authority và scope tường minh.

<a id="rule-stateless-services"></a>
### Luật 5: Stateless Services & Repositories (Dịch Vụ Phi Trạng Thái)
- **Cơ chế kiểm tra**: Review-enforced / Preflight Checklist.
- **Nội dung ràng buộc**: Service và Repository singletons cấm lưu trữ `userId`, session token hoặc request context trong biến instance (`this.*`). Mọi context phải được truyền tường minh qua tham số hàm.
- **Mục đích**: Chống rò rỉ dữ liệu chéo người dùng (cross-user data contamination) trong môi trường xử lý đồng thời (concurrency).

<a id="rule-expand-and-contract"></a>
### Luật 6: Expand-and-Contract Migrations (Tiến Hóa CSDL An Toàn)
- **Cơ chế kiểm tra**: Review-enforced / Migration SOP.
- **Nội dung ràng buộc**: Không bao giờ đổi tên hoặc xóa cột trong cùng một lần release. Luôn tuân thủ chu trình 4 pha: Expand (thêm cột mới) -> Backfill (đồng bộ dữ liệu) -> Read Transition (chuyển luồng đọc/ghi) -> Contract (dọn cột cũ).
- **Mục đích**: Đảm bảo zero-downtime và an toàn dữ liệu, cho phép rollback ứng dụng mà không gây lỗi schema.

<a id="rule-performance-guardrails"></a>
### Luật 7: Performance Guardrails (Rào Chắn Hiệu Năng Vận Hành)
- **Cơ chế kiểm tra**: Review-enforced / Preflight Checklist.
- **Nội dung ràng buộc**:
  - Mọi query danh sách phải có giới hạn (`limit`/`take`). Chỉ query các cột cần thiết trên hot path.
  - Ngăn chặn triệt để N+1 queries bằng eager loading, batching (`IN (...)`) hoặc DataLoader.
  - Cấm sync I/O làm nghẽn Event Loop (`fs.readFileSync`, tính toán CPU nặng trên main thread).
- **Mục đích**: Đảm bảo độ trễ thấp và ngăn ngừa cạn kiệt tài nguyên máy chủ.

<a id="rule-idempotent-seeds"></a>
### Luật 8: Idempotent Master Seeds (Dữ Liệu Khởi Tạo Lũy Đẳng)
- **Cơ chế kiểm tra**: Review-enforced / Preflight Checklist.
- **Nội dung ràng buộc**: Mọi script seeding trong `scripts/seeds/` phải sử dụng canonical key bất biến (UUID v5, slug deterministic) và cơ chế Upsert lũy đẳng. Chạy lặp lại nhiều lần không sinh bản ghi nhân bản hay làm lệch ID quan hệ.
- **Mục đích**: Đảm bảo môi trường phát triển, CI/CD và Staging luôn tái lập trạng thái đồng nhất.
