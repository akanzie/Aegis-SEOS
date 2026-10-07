# Technical Architecture Documentation

Thư mục này chứa các tài liệu thiết kế kỹ thuật chi tiết của hệ thống. Đây là thiết kế triển khai dẫn xuất, không tự định nghĩa Business WHAT, scope/AC hay quyền/gate.

Theo [AGENTS §0](../../AGENTS.md), Technical HOW ưu tiên Accepted ADR còn hiệu lực -> invariants/standards -> system map -> thiết kế trong thư mục này. Khi ADR được accepted hoặc thay đổi, đồng bộ các thiết kế bị ảnh hưởng; phát hiện lệch phải báo conflict trước triển khai. Project profile ánh xạ stack/commands/capability, không ghi đè quyết định kiến trúc. Xem [ADR authority](../decisions/README.md).

Nội dung thiết kế gồm:
- Sơ đồ kiến trúc tổng thể (High-level Architecture).
- Thiết kế cơ sở dữ liệu và Data Model diagrams.
- Thiết kế tích hợp bên thứ ba (Third-party integrations, OAuth, Webhooks).
- Chiến lược Caching, Queueing và Performance Tuning.
