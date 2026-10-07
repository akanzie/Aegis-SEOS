# Critical Flows: Risk Taxonomy P0–P4 (Canonical)

Tài liệu này sở hữu định nghĩa flow, mapping `critical_flow` -> `risk_level`, tie-breaking và impact escalation được AGENTS §7 phân quyền. Gate applicability thuộc [AGENTS §5.D](../../AGENTS.md#quality-gate-applicability); yêu cầu kiểm thử thuộc [Verification Standard](../standards/verification.md#risk-test-matrix). System map chỉ ánh xạ flow thực tế, không định nghĩa lại taxonomy.

## 1. Phân Cấp Theo Hành Vi Và Tác Động

| Cấp | Tên | Phạm vi / ranh giới | Tác động khi lỗi | Auto risk |
| :--- | :--- | :--- | :--- | :--- |
| P0 | System Survival | Auth/authz, session context; core execution loop điều phối/thực thi sống còn của hệ thống; payment availability, webhook authenticity, ngăn giao dịch trái phép | Hệ thống tê liệt hoặc mất kiểm soát security | CRITICAL |
| P1 | Revenue & Data Integrity | Charging, renewal, refund, ledger, reconciliation, idempotency; persistence/sync bảo vệ tính toàn vẹn DB; master data seeding | Mất doanh thu hoặc sai lệch dữ liệu vĩnh viễn | HIGH |
| P2 | Core Business | Bài học, tiến trình luyện tập, tạo/sửa tài nguyên nghiệp vụ chính của người dùng | Use case chính gián đoạn nhưng hệ thống còn vận hành | MEDIUM |
| P3 | Convenience | Tìm kiếm nâng cao, bộ lọc phụ, export CSV/PDF, push notification | Giảm tiện dụng, có cách thay thế | LOW |
| P4 | Nice to Have | UI polish, CSS, typo, micro-copy không đổi hành vi | Ảnh hưởng thẩm mỹ | TRIVIAL |

Core execution loop P0 là cơ chế thực thi mà lỗi có thể làm hệ thống dừng hoặc mất kiểm soát an toàn; tên “core” của một use case không đủ để xếp P0. Học/luyện tập thuộc P2 khi chỉ ảnh hưởng use case. Payment security/availability thuộc P0; payment transaction/ledger integrity thuộc P1. Một task chạm cả hai dùng P0. Thao tác CRUD thông thường không tự trở thành P1 chỉ vì có DB; khi tác động tới persistence/sync/integrity dùng P1 hoặc mức cao hơn theo blast radius.

## 2. Tie-Breaking Và Impact Escalation

- Phân loại theo hành vi, invariant, shared contract, dependency và runtime path, không chỉ theo vị trí file hoặc nhãn tính năng.
- Khi chạm nhiều cấp, lấy cấp cao nhất: **P0 > P1 > P2 > P3 > P4**; risk tương ứng CRITICAL > HIGH > MEDIUM > LOW > TRIVIAL.
- Ảnh hưởng trực tiếp hoặc gián tiếp tới invariant/contract/runtime P0: `critical_flow: P0`, `risk_level: CRITICAL`; P1: `critical_flow: P1`, `risk_level: HIGH`. Cả hai bắt buộc Standard, cấm Fast Track, kiểm thử theo ma trận canonical.
- P4 chỉ có thể dùng Fast Track nếu toàn bộ điều kiện AGENTS §3.B thỏa mãn. Nhãn P4 không cấp quyền bỏ Hard Stop.
- Docs điều khiển quyền, gate hoặc bảo vệ P0/P1 được nâng risk theo cùng quy tắc. Ghi bằng chứng blast radius và verification scope trong task; không tự suy ra ứng dụng có flow chưa tồn tại.
