# Architecture Decision Records (ADR)

File mẫu riêng để copy: [ADR template](../templates/adr.md). Giữ `status: proposed` tới khi owner/Developer phê duyệt.

Thư mục này ghi nhận các quyết định kiến trúc quan trọng có tầm ảnh hưởng lâu dài.

## Authority Trong Technical HOW

Theo [AGENTS §0](../../AGENTS.md), Accepted ADR còn hiệu lực là nguồn quyết định kiến trúc trong Technical HOW. Approved task quyết định scope/AC của công việc hiện hành, không tự supersede ADR; thay đổi quyết định kiến trúc cần ADR mới được owner chấp thuận và trỏ supersedes/superseded_by rõ ràng. Proposed/Superseded/Deprecated ADR không là quyết định hiện hành.

Khi ADR được accepted, đồng bộ invariants/standards, system map, technical architecture và profile/validator mapping bị ảnh hưởng trước triển khai. Nếu tài liệu dẫn xuất lệch ADR, phải nêu conflict và đồng bộ, không tự pha trộn. ADR không làm yếu safety/security hoặc tự đổi functional spec. Profile chỉ ghi công cụ/capability, không cấp quyền hoặc miễn gate.

---

## 1. Điều Kiện Bắt Buộc Tạo ADR (ADR Mandatory Triggers)

Developer và AI Agent **bắt buộc phải tạo ADR** trước khi bắt tay vào triển khai code nếu thay đổi chạm vào bất kỳ trường hợp nào sau đây:

1. **Thay đổi ranh giới module**: Tách module mới, gộp module hoặc thay đổi luồng phụ thuộc giữa các tầng (`Domain`, `Service`, `Infra`, `UI`).
2. **Thay đổi Public API Contracts**: Thay đổi cấu trúc request/response, versioning hoặc cơ chế phân trang của các endpoint công khai.
3. **Thay đổi chiến lược Database**: Chuyển đổi ORM, thay đổi chiến lược indexing diện rộng, bổ sung DB engine mới (Redis, Elasticsearch).
4. **Thay đổi luồng Auth / Session**: Thay đổi chiến lược JWT, cơ chế refresh token rotation, OAuth providers hoặc phân quyền RBAC/ABAC.
5. **Đưa vào công nghệ hạ tầng mới**: Bổ sung Message Queue, Cron Worker, Caching Layer hoặc giải pháp File Storage mới.

---

<a id="adr-lifecycle"></a>
## 2. Định Dạng Đặt Tên & Vòng Đời Quyết Định (Lifecycle & Ownership)

- **Định dạng file**: `ADR-XXXX-<slug-tieu-de>.md` (ví dụ: `ADR-0001-drizzle-orm-adoption.md`).
- **Chuỗi trạng thái hợp lệ**: `Proposed` -> `Accepted` -> `Superseded` | `Deprecated` (Không bao giờ xóa ADR cũ).
- **Quy tắc sở hữu (Ownership Protocol)**:
  - Mọi ADR bắt buộc có `decision_owner` (Developer hoặc Tech Lead phụ trách).
  - **Giới hạn AI Agent**: AI Agent chỉ được phép khởi tạo ADR ở trạng thái `status: proposed`. Tuyệt đối **CẤM** AI Agent tự động chuyển trạng thái ADR sang `accepted` nếu chưa có sự phê duyệt rõ ràng từ Developer hoặc Architecture Owner.

---

## 3. Nội Dung ADR

Dùng [ADR template đầy đủ](../templates/adr.md) để tạo record. ADR cần ghi context/bằng chứng, options và quyết định được owner chấp thuận, consequences/recovery, ownership và lifecycle fields. Phần mô tả này là hướng dẫn, không phải template thay thế.
