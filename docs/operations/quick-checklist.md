# Quick Checklist: 10 Điều Bất Biến Của Hệ Thống (One-Pager)

> Checklist này là ranh giới kỹ thuật tối cao. Mọi task (dù lớn hay nhỏ, dù do Dev hay AI thực hiện) đều phải vượt qua 10 điều kiểm tra này trước khi merge.

---

1. **Domain Pure (Tầng Nghiệp Vụ Thuần Khiết)**:
   - Thư mục `src/domain/` (hoặc core domain) tuyệt đối cấm import database client, ORM, framework (Next.js/Express), network client hoặc UI components.
   - Domain chỉ chứa entity, value object, logic tính toán thuần túy và domain interfaces.

2. **Server Trust Boundary (Ranh Giới Tin Cậy Phía Máy Chủ)**:
   - Mọi thao tác truy vấn, cập nhật, xóa trong database bắt buộc phải lọc theo `userId` hoặc `tenantId` được giải mã từ session/token đã xác thực ở server-side.
   - Không bao giờ tin cậy `userId` truyền lên từ client body hoặc route parameters mà không qua xác thực quyền sở hữu.

3. **Stateless Services (Dịch Vụ Phi Trạng Thái)**:
   - Các service singleton tuyệt đối cấm lưu trữ trạng thái người dùng (request-specific state) trong biến instance (`this.currentUser`, `this.state`).
   - Mọi trạng thái người dùng phải được truyền qua function parameters.

4. **Client/Server Isolation (Cách Ly Khách/Chủ)**:
   - Các file có directive `'use client'` (hoặc UI frontend) tuyệt đối cấm import database client, secret keys, server-only helpers.

5. **No Raw Env (Không Đọc process.env Tùy Tiện)**:
   - Cấm truy cập trực tiếp `process.env.*` rải rác trong code ứng dụng.
   - Mọi biến môi trường phải được import qua module validate tập trung (ví dụ: `src/lib/env.ts` hoặc `src/config/env.ts`).

6. **Master Data Identity (Danh Tính Dữ Liệu Hạt Giống)**:
   - Mọi dữ liệu hạt giống (seed data) bắt buộc phải có canonical identity key cố định (UUID v5, slug, hoặc unique code).
   - Script seed phải chạy lũy đẳng (Idempotent upsert), chạy nhiều lần không nhân bản dữ liệu.

7. **Expand-and-Contract (Mở Rộng và Thu Hẹp Schema)**:
   - Không bao giờ đổi tên hoặc xóa cột trong database trong cùng 1 lần release.
   - Bước 1: Thêm cột mới nullable hoặc default (Expand).
   - Bước 2: Deploy code đọc/ghi song song hoặc ghi vào cột mới.
   - Bước 3: Backfill dữ liệu.
   - Bước 4: Chuyển code đọc hoàn toàn từ cột mới.
   - Bước 5: Release sau mới drop cột cũ (Contract).

8. **Critical Flows Sensitivity (Độ Nhạy Luồng Trọng Yếu)**:
   - Mọi thay đổi chạm vào các flow P0/P1 (Đăng nhập/Auth, Core Loop, Thanh toán/Billing, Đồng bộ dữ liệu) tự động được nâng mức rủi ro lên `>= HIGH`.
   - Bắt buộc kiểm thử hồi quy nghiêm ngặt (Unit + Integration test).

9. **Fast Track Boundary (Ranh Giới Luồng Nhanh)**:
   - Chỉ áp dụng Fast Track cho: Sửa typo, markdown docs, comments, format code, CSS thuần túy không đổi DOM, bổ sung test thuần túy.
   - Mọi thay đổi logic runtime, routing, database đều bắt buộc qua chu trình Standard 3 bước.

10. **Machine-Verified Fitness (Máy Chấm Tự Động)**:
    - Bắt buộc chạy `npm run test:fitness` pass (Exit code 0) trước khi kết thúc task hoặc tạo Pull Request.
