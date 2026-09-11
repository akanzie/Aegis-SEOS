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

## 2. Định Dạng Đặt Tên & Vòng Đời Quyết Định (Lifecycle & Ownership)

- **Định dạng file**: `ADR-XXXX-<slug-tieu-de>.md` (ví dụ: `ADR-0001-drizzle-orm-adoption.md`).
- **Chuỗi trạng thái hợp lệ**: `Proposed` -> `Accepted` -> `Superseded` | `Deprecated` (Không bao giờ xóa ADR cũ).
- **Quy tắc sở hữu (Ownership Protocol)**:
  - Mọi ADR bắt buộc có `decision_owner` (Developer hoặc Tech Lead phụ trách).
  - **Giới hạn AI Agent**: AI Agent chỉ được phép khởi tạo ADR ở trạng thái `status: proposed`. Tuyệt đối **CẤM** AI Agent tự động chuyển trạng thái ADR sang `accepted` nếu chưa có sự phê duyệt rõ ràng từ Developer hoặc Architecture Owner.

---

## 3. Mẫu ADR Chuẩn

```markdown
---
adr_id: ADR-XXXX
title: "[Tiêu Đề Quyết Định]"
status: proposed # [proposed | accepted | superseded | deprecated]
decision_owner: "@username"
date: YYYY-MM-DD
supersedes: null # hoặc "ADR-YYYY"
superseded_by: null # hoặc "ADR-ZZZZ"
---

# ADR-XXXX: [Tiêu Đề Quyết Định]

- **Trạng thái**: Proposed | Accepted | Deprecated | Superseded
- **Chủ trì quyết định (Owner)**: @username
- **Ngày**: YYYY-MM-DD

## Bối Cảnh (Context)
Vấn đề chúng ta đang gặp phải là gì? Những yếu tố và ràng buộc nào thúc đẩy quyết định này?

## Quyết Định (Decision)
Chúng ta quyết định chọn giải pháp nào và triển khai ra sao?

## Đánh Đổi & Hệ Quả (Consequences & Trade-offs)
- **Tích cực (Pros)**: Lợi ích đạt được về kiến trúc, hiệu năng hoặc vận hành.
- **Đánh đổi / Rủi ro (Cons)**: Chi phí bảo trì, độ phức tạp phát sinh, lộ trình di trú.
```
