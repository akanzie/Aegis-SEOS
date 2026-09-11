# Fitness Functions: 5 Luật Kiến Trúc Bất Biến

Các quy tắc này được kiểm tra tự động bởi máy chấm `scripts/validators/architecture-fitness.mjs`. Bất kỳ vi phạm nào cũng sẽ khiến build thất bại.

---

## Luật 1: Domain Is Pure (Tầng Domain Thuần Khiết Tuyệt Đối)
- Mã nguồn trong `src/domain/` không được chứa bất kỳ câu lệnh `import` nào từ:
  - Database clients / ORMs (prisma, drizzle-orm, typeorm, mongoose, pg, mysql, v.v.).
  - Web frameworks (next, express, fastify, nestjs, react, vue, v.v.).
  - Network / HTTP clients (axios, fetch polyfills).
- **Lý do**: Đảm bảo nghiệp vụ lõi độc lập hoàn toàn với hạ tầng công nghệ, dễ kiểm thử đơn vị và bền vững theo thời gian.

## Luật 2: Client/Server Isolation (Cách Ly Khách / Chủ Tuyệt Đối)
- Các file chứa chỉ thị `'use client'` không được phép import:
  - Database clients / ORMs.
  - Server secrets hoặc server-only modules (`server-only`, `node:*` modules như `fs`, `path`, `crypto`).
- **Lý do**: Ngăn chặn rò rỉ thông tin nhạy cảm, API keys và làm phình to kích thước JS bundle phía client.

## Luật 3: No Raw Process Env (Môi Trường Tập Trung Có Schema)
- Không được gọi trực tiếp `process.env.<VAR>` trong các file nghiệp vụ, dịch vụ hay components.
- Bắt buộc import các biến môi trường thông qua module xác thực tập trung (`src/lib/env.ts` hoặc `src/config/env.ts`).
- **Lý do**: Tránh lỗi runtime do thiếu biến môi trường cấu hình sai chính tả, bảo đảm fail-fast ngay khi khởi động ứng dụng.

## Luật 4: Trust Boundary & User Scope (Lọc Dữ Liệu An Toàn)
- Mọi database query tương tác dữ liệu người dùng phải chứa mệnh đề ràng buộc định danh tài khoản (`userId` / `tenantId`) được lấy từ session đã xác thực ở server.
- **Lý do**: Ngăn chặn lỗi Insecure Direct Object Reference (IDOR).

## Luật 5: Idempotent Master Seeds (Dữ Liệu Khởi Tạo Lũy Đẳng)
- Mọi script seeding trong `scripts/seeds/` phải được viết dưới dạng upsert có khóa định danh bất biến.
- **Lý do**: Đảm bảo môi trường phát triển, CI/CD và Staging luôn có thể tái thiết lập trạng thái đồng nhất mà không làm sai lệch ID hay nhân bản dữ liệu.
