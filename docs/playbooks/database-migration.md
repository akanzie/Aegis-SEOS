# Playbook: Quy Trình Database Migration & Seeding (Database SOP)

Tài liệu này định nghĩa chiến lược quản lý CSDL an toàn tuyệt đối, ngăn chặn downtime và mất mát dữ liệu.

---

## 1. Chiến Lược Expand-and-Contract (Không Bao Giờ Phá Vỡ Tương Thích)

Tuyệt đối **KHÔNG** xóa hoặc đổi tên cột trong một release duy nhất. Luôn chia làm các giai đoạn:

### Phase 1: Mở Rộng (Expand)
- Tạo migration thêm cột mới (`new_column`).
- Cột mới bắt buộc phải là `NULLABLE` hoặc có `DEFAULT VALUE`.
- Ứng dụng triển khai phiên bản mới: ghi đồng thời cả vào `old_column` và `new_column`.

### Phase 2: Backfill Dữ Liệu
- Viết script idempotent để đồng bộ dữ liệu cũ từ `old_column` sang `new_column`.
- Xác minh dữ liệu khớp 100% giữa 2 cột.

### Phase 3: Chuyển Đổi Đọc (Contract - Read Transition)
- Cập nhật code ứng dụng chuyển sang đọc hoàn toàn từ `new_column`.
- Chỉ ghi vào `new_column`.

### Phase 4: Thu Hẹp (Contract - Deprecate & Drop)
- Sau khi kiểm tra ổn định trong production ít nhất 1 chu kỳ release:
- Tạo migration xóa bỏ `old_column`.

---

## 2. Quy Chuẩn Dữ Liệu Hạt Giống (Master Data Seeding)

1. **Canonical Identity Key**:
   - Mỗi record trong seed data phải có khóa định danh bất biến (Deterministic UUID, fixed string slug, code).
   - Tuyệt đối không dựa vào autoincrement ID ngẫu nhiên.
2. **Idempotency (Tính Lũy Đẳng)**:
   - Script seed phải dùng câu lệnh `UPSERT` (hoặc check `findUnique -> create/update`).
   - Chạy `npm run db:seed` 1 lần hay 100 lần thì kết quả trong DB vẫn đồng nhất, không sinh bản ghi trùng lặp.
3. **Seed Isolation**:
   - Phân biệt rõ `core-seeds` (dữ liệu bắt buộc để hệ thống chạy được) và `demo-seeds` (dữ liệu mẫu phục vụ phát triển/test).
