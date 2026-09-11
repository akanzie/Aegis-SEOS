# Context Package: [Tên Phân Hệ / Module]

- **Domain Scope**: `src/domain/[module]/`, `src/services/[module]/`
- **Critical Flow Level**: `P0` | `P1` | `P2` | `P3`
- **Target Token Budget**: `<= 15.000 tokens`

---

## 1. Must Load (Bắt Buộc Đọc Đầu Session)
Các tài liệu và code sau bắt buộc phải đọc trước khi phân tích hoặc sửa đổi:
- `docs/main_docs/<ACTIVE_VERSION>/fn/[module].md`
- `docs/system-map/modules.md`
- `docs/standards/[relevant-standard].md`
- Các file interfaces/types cốt lõi trong domain: `src/domain/[module]/types.ts`

## 2. Optional (Chỉ Đọc Khi Cần Đi Sâu Edge Case)
- `docs/system-map/critical-paths.md`
- `docs/decisions/ADR-[relevant].md`
- Các file test hiện tại: `src/__tests__/[module].test.ts`

## 3. Do Not Load (Tuyệt Đối Không Nạp Vào Context)
Các tài liệu và mã nguồn cấm nạp để bảo toàn token và chống nhiễu tư duy AI:
- `docs/tasks/**` (ngoại trừ task hiện tại)
- Các modules nghiệp vụ khác (Billing, Media, Notification, Analytics)
- Toàn bộ thư mục `node_modules/` hoặc schema DB đầy đủ nếu chỉ cần 1 bảng

## 4. Key Boundaries & Invariants
- Liệt kê 2-3 quy tắc bất biến quan trọng nhất của phân hệ này.
