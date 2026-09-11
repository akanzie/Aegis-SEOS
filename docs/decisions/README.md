# Architecture Decision Records (ADR)

Thư mục này ghi nhận các quyết định kiến trúc quan trọng có tầm ảnh hưởng lâu dài.

---

## 1. Điều Kiện Bắt Buộc Tạo ADR (ADR Mandatory Triggers)

Developer và AI Agent **bắt buộc phải tạo ADR** trước khi bắt tay vào triển khai code nếu thay đổi chạm vào bất kỳ trường hợp nào sau đây:

1. **Thay đổi ranh giới module**: Tách module mới, gộp module hoặc thay đổi luồng phụ thuộc giữa các tầng (`Domain`, `Service`, `Infra`, `UI`).
2. **Thay đổi Public API Contracts**: Thay đổi cấu trúc request/response, versioning hoặc cơ chế phân trang của các endpoint công khai.
3. **Thay đổi chiến lược Database**: Chuyển đổi ORM, thay đổi chiến lược indexing diện rộng, bổ sung DB engine mới (Redis, Elasticsearch).
4. **Thay đổi luồng Auth / Session**: Thay đổi chiến lược JWT, cơ chế refresh token rotation, OAuth providers hoặc phân quyền RBAC/ABAC.
5. **Đưa vào công nghệ hạ tầng mới**: Bổ sung Message Queue, Cron Worker, Caching Layer hoặc giải pháp File Storage mới.

---

## 2. Định Dạng Đặt Tên & Vòng Đời

- **Định dạng file**: `ADR-XXXX-<slug-tieu-de>.md` (ví dụ: `ADR-0001-drizzle-orm-adoption.md`).
- **Trạng thái**: `Proposed` -> `Accepted` -> `Superseded by ADR-YYYY` (Không bao giờ xóa ADR cũ).

---

## 3. Mẫu ADR Chuẩn

```markdown
# ADR-XXXX: [Tiêu Đề Quyết Định]

- **Trạng thái**: Proposed | Accepted | Deprecated | Superseded
- **Ngày**: YYYY-MM-DD
- **Tác giả**: [Tên người đề xuất / Agent]

## Bối Cảnh (Context)
Vấn đề chúng ta đang gặp phải là gì? Những yếu tố nào thúc đẩy quyết định này?

## Quyết Định (Decision)
Chúng ta quyết định chọn giải pháp nào và triển khai ra sao?

## Đánh Đổi & Hệ Quả (Consequences & Trade-offs)
- **Tích cực**: Lợi ích đạt được.
- **Tiêu cực / Đánh đổi**: Chi phí bảo trì, độ phức tạp phát sinh.
```
