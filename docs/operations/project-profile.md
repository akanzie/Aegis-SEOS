# Project Profile: Aegis-SEOS

- Khảo sát: 2026-10-07, repository baseline trước task bổ sung templates.
- Phạm vi: Bộ khung quy trình Markdown và architecture validators; không có ứng dụng nghiệp vụ `src/` trong baseline.
- Stack: Node.js, ES modules (`package.json` có `type: module`), scripts `.mjs`; manifest chưa khai báo phiên bản Node bắt buộc.

## 1. Commands Và Gates Đã Xác Minh

| Mục đích | Lệnh | Nguồn | Phạm vi / giới hạn |
| :--- | :--- | :--- | :--- |
| Automated tests | `npm test` | `package.json` -> `scripts/validators/architecture-fitness.test.mjs` | Tests cho validator, không phải regression ứng dụng nghiệp vụ |
| Architecture fitness | `npm run test:fitness` | `package.json` -> `scripts/validators/architecture-fitness.mjs` | Luật machine-enforced theo architecture-rules; không chứng minh toàn bộ security invariants |
| Docs verification | Review diff, links và tính nhất quán | `docs/standards/verification.md` | Kiểm tra theo diff của task |
| Setup / lint / typecheck / build / E2E | Chưa khai báo scripts tương ứng | `package.json` | Không suy ra lệnh từ ví dụ bootstrap |

Chạy `npm test` xong rồi mới chạy fitness: tests validator có thể tạo fixture cấu hình tạm ở root. Xem `docs/project-memory/known-pitfalls.md`, mục 4.

Trên Windows PowerShell nếu execution policy chặn `npm.ps1`, dùng `npm.cmd test` và `npm.cmd run test:fitness`; không cần thay execution policy.

## 2. Environments Và CI

- Local/test: Node.js và npm cho validator; chưa khai báo runtime ứng dụng.
- Staging/production: Chưa có cấu hình trong phạm vi khảo sát.
- Không tìm thấy workflow `.github/` trong baseline; cấu hình trong `docs/fitness-functions/ci-enforcement.md` là ví dụ.
- Required remote CI checks / branch protection: UNVERIFIED; không suy ra từ tài liệu ví dụ.
- Khi áp dụng cho ứng dụng khác, cập nhật profile với stack, environments, commands và gates thực tế trước khi tuyên bố đạt DoD.

## 3. Sources Of Truth Và Ownership

- Operating contract: `AGENTS.md`; Developer cung cấp approval, agent không tự duyệt.
- Spec active: `docs/main_docs/ACTIVE_VERSION.md` khai báo `v1.0`, trạng thái Initializing; `docs/main_docs/v1.0/fn/` hiện có README hướng dẫn, chưa có spec nghiệp vụ module.
- Architecture: `docs/system-map/` và `docs/fitness-functions/architecture-rules.md`; policy validator tại `scripts/validators/architecture-fitness-policy.mjs`.
- Task decisions / AC / evidence: `docs/tasks/`, theo workflow và verification standards.
- Schema/ORM, dữ liệu nghiệp vụ và generated artifacts: Chưa có trong baseline; không gán owner hoặc generate command suy đoán.

## 4. Authority Và Boundaries

- Context Packages hiện có phục vụ Auth và mẫu chung; task chỉ sửa quy trình tài liệu không nạp package Auth.
- Local branch/commit theo điều kiện trong `AGENTS.md`; push/merge/deploy theo quyền được cấp, profile không cấp quyền mới.
- Không đọc/in secrets. Tài liệu môi trường chỉ ghi tên biến/schema, không ghi giá trị credentials.

Mẫu cho dự án tiếp nhận: [Project profile template](../templates/project-profile.md).
