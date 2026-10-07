# Context Package: [Tên Phân Hệ / Module]

- **Status**: [Verified paths hoặc reference example; không suy runtime tồn tại]
- **Phases**: [Mode/phase áp dụng]
- **Domain Scope**: `src/domain/[module]/`, `src/services/[module]/`
- **Path status / entry points / conventions**: [Actual verified paths and entry points, or mark paths as exemplar/reference; identify local conventions and versioned evidence]
- **Critical Flow Level**: `P0` | `P1` | `P2` | `P3` | `P4`
- **Target Token Budget**: `<= 15,000 tokens` (package target; session budget/overflow theo [AGENTS §8](../../AGENTS.md#context-budget))

---

## 1. Must Load (Bắt Buộc Đọc Đầu Session)
Chọn file/section tối thiểu đã xác minh. AGENTS đã luôn nạp; không đọc lại cùng revision. Đường dẫn dưới đây là placeholder, chỉ dùng nếu tồn tại trong project profile:
- `docs/main_docs/<ACTIVE_VERSION>/fn/[module].md`
- `docs/system-map/modules.md`
- `docs/standards/[relevant-standard].md`
- Các file interfaces/types cốt lõi trong domain: `src/domain/[module]/types.ts`

## 2. Optional (Chỉ Đọc Khi Cần Đi Sâu Edge Case)

- Khi blast radius chạm critical flow: `docs/system-map/critical-paths.md`, sections liên quan
- Khi có quyết định kiến trúc liên quan: `docs/decisions/ADR-[relevant].md`
- Khi verify hoặc trace regression: các file test hiện tại: `src/__tests__/[module].test.ts`

## 3. Do Not Load (Tuyệt Đối Không Nạp Vào Context)
Các tài liệu và mã nguồn cấm nạp để bảo toàn token và chống nhiễu tư duy AI:
- `docs/tasks/**` (ngoại trừ task hiện tại và dependency artifacts đã xác nhận)
- Các modules nghiệp vụ khác (Billing, Media, Notification, Analytics)
- Toàn bộ thư mục `node_modules/` hoặc schema DB đầy đủ nếu chỉ cần 1 bảng

## 4. Key Boundaries & Invariants

- Liệt kê 2-3 quy tắc bất biến quan trọng nhất của phân hệ này.
