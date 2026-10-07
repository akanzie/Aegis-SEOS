# Context Packages

Context Package liệt kê tài liệu và interfaces cần đọc cho từng scope, giúp giới hạn token và tránh nạp ngoài scope. Đây là catalog, không thay [routing map](../../AGENTS.md#routing-map).

| Package | Scope / phase | Trạng thái | Target |
| :--- | :--- | :--- | :--- |
| [Docs policy](docs-policy-context.md) | Workflow/governance/docs; investigate/execute/review | Verified paths; xác minh revision khi dùng | <=15k |
| [Validator](validator-context.md) | Validator/rules; investigate/execute/review | Verified paths/commands; xác minh revision khi dùng | <=15k |
| [Auth](auth-context.md) | Authentication/identity | Reference example; chưa có runtime auth được xác minh | <=15k |
| [Template](template.md) | Tạo package | Mẫu, không phải package active | Theo scope |

## Cách dùng

1. Must Load là tập tối thiểu; chọn sections trong scope, không đọc lại file đã nạp cùng revision.
2. Optional ghi trigger cụ thể; trigger áp dụng thì nạp owner/check bắt buộc.
3. Do Not Load loại scope ngoài task; trace thêm callers/contracts khi có evidence trong blast radius.
4. Target mặc định <=15k là mục tiêu package, không hard cap session. Ngưỡng/overflow thuộc [AGENTS §8](../../AGENTS.md#context-budget).

Thiếu package: ghi rõ, đọc tối thiểu task/spec active/boundaries/code/tests trực tiếp; không đoán đường dẫn hoặc dùng Auth cho docs policy. Cập nhật đường dẫn/interface lỗi thời trong scope được phép. Thứ tự/cập nhật prefix ở [Context Assembly](../governance/context-assembly.md).
