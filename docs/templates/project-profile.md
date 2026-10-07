# Project Profile: [Tên dự án]

- Ngày / revision khảo sát: [YYYY-MM-DD / HEAD].
- Stack / manifest / runtime: [Bằng chứng thực tế; không suy ra từ ví dụ SEOS].
- Phạm vi: [Docs framework hoặc ứng dụng thực tế].

## 1. Commands Và Gates

| Mục đích | Lệnh đã xác minh | Nguồn cấu hình | Gate / giới hạn |
| :--- | :--- | :--- | :--- |
| Setup | [Lệnh hoặc chưa cấu hình] | [Manifest/lockfile] | [Điều kiện] |
| Automated tests | [Lệnh] | [Script/config] | [Suite và blast radius] |
| Architecture fitness | [Lệnh tương đương] | [Validator/config] | [Machine invariants được hỗ trợ] |
| Static checks / build | [Lệnh hoặc chưa cấu hình] | [Config] | [Không bịa script] |
| Manual / E2E | [Kịch bản khi áp dụng] | [Nguồn] | [Người chạy, môi trường] |

## 2. Environments Và CI

- Local / test / staging / production: [Môi trường đã xác minh; chưa biết ghi rõ].
- CI config / required checks: [Path và quyền cấu hình remote đã xác minh hoặc UNVERIFIED].
- Shared resources / thứ tự chạy: [Checks cần tuần tự hoặc cách ly].
- Gate thiếu / cách bổ sung: [Trạng thái thật, owner; không miễn gate bắt buộc].

## 3. Sources Of Truth Và Ownership

| Artifact | Nguồn canonical | Owner | Generate / validate |
| :--- | :--- | :--- | :--- |
| Business spec | [Active version / spec path] | [Owner] | [Approval và kiểm chứng] |
| Schema / dữ liệu | [Nguồn hoặc N/A] | [Owner] | [Migration/seed quy định] |
| Generated artifacts | [Nguồn hoặc không có] | [Owner] | [Lệnh thật] |

## 4. Boundaries Và Authority

- System map / critical flows / Context Packages: [Đường dẫn thực tế].
- Local-only commands / tác vụ cần approval: [Theo operating contract và quyền hiện có].
- Secrets: Chỉ ghi tên biến và schema; không chứa giá trị, credentials hoặc PII.
- Project profile mô tả hiện trạng, không tự cấp quyền remote, merge hoặc deployment.
