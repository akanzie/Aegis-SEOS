# Aegis-SEOS

Bộ khung vận hành AI-native: tài liệu quyết định hành vi và ranh giới, code là kết quả triển khai, session AI dùng một lần và bàn giao bằng evidence.

Repo hiện có Markdown policy/templates và architecture validators chạy Node.js ES modules; chưa có ứng dụng nghiệp vụ `src/`. [Project Profile](docs/operations/project-profile.md) ghi commands/capability thực tế; examples không chứng minh runtime hoặc CI đã tồn tại.

## Bắt đầu

- Developer mới: [Human Onboarding](docs/onboarding/human.md).
- Khởi tạo/tiếp nhận SEOS khi được yêu cầu: [AI Bootstrap](docs/onboarding/bootstrap.md) và [Project Adoption](docs/operations/project-adoption.md).
- Agent làm task: luôn nạp [AGENTS](AGENTS.md), chọn owner qua [routing map duy nhất](AGENTS.md#routing-map) và [Context Packages](docs/context-packages/README.md). README/onboarding không thuộc prefix mặc định.

Quyền/Git/gate applicability thuộc AGENTS; lifecycle, DoD, review, specs và technical owners được contract phân quyền. Trang này không định nghĩa policy thứ hai.

## Kiểm tra repository

Chạy tests trước fitness vì fixtures dùng chung config:

```text
npm test
npm run test:fitness
```

Trên PowerShell nếu `npm.ps1` bị chặn, dùng `npm.cmd test` và `npm.cmd run test:fitness`. Tests hiện kiểm tra validator, không là regression ứng dụng nghiệp vụ.

## Tài liệu

operations giữ owners theo phase; onboarding dành cho onboarding/bootstrap; context-packages chọn scope; templates giữ mẫu; tasks giữ plans/evidence. Specs ở main_docs; technical docs ở standards/fitness/system-map/decisions. Tra cứu cụ thể qua AGENTS, không nạp cả cây docs.
