# Fitness Functions: Hướng Dẫn Thực Thi Máy Chấm CI (CI Enforcement)

Tài liệu này hướng dẫn cách tích hợp và kích hoạt máy chấm tự động trong quy trình phát triển cục bộ và trên CI pipeline.

---

## 1. Chạy Cục Bộ (Local Verification)

Chọn gate theo [AGENTS §5.D](../../AGENTS.md#quality-gate-applicability), test scope theo [Verification Standard](../standards/verification.md#risk-test-matrix), commands theo project profile. Khi fitness bắt buộc, chạy:

Tests dùng chung fixtures/config phải hoàn tất trước fitness (xem [known pitfalls §4](../project-memory/known-pitfalls.md)). Với profile hiện tại: `npm test` rồi `npm run test:fitness`; PowerShell có thể dùng `npm.cmd`. Docs-only Fast Track có thể N/A theo bảng; thiếu validator cho gate bắt buộc là BLOCKED.

```bash
npm run test:fitness
```

### Kết Quả Mong Đợi
- Nếu không có vi phạm các luật machine-enforced mà validator hiện hỗ trợ (không chứng minh mọi invariant bảo mật):
  ```text
  [FITNESS] Checking Architecture Rules...
  [PASS] Domain layer is pure (0 violations)
  [PASS] Client components are isolated from server secrets (0 violations)
  [PASS] Environment variables accessed via centralized config (0 violations)
  [SUCCESS] All architecture fitness rules PASSED!
  ```
  Exit code: `0`.

- Nếu có vi phạm:
  ```text
  [FAIL] Domain layer purity violation in src/domain/user.ts:
         Line 3: import { prisma } from "@/lib/db";
  [ERROR] Architecture fitness check FAILED with 1 violation(s).
  ```
  Exit code: `1`.

---

## 2. Cấu Hình Tích Hợp Continuous Integration (CI Pipeline)

Ví dụ cấu hình trong GitHub Actions (`.github/workflows/ci.yml`), không phải CI đang tồn tại hay bằng chứng branch protection. Pipeline có thể luôn chạy cả tests và fitness; applicability tối thiểu vẫn thuộc AGENTS. Xác minh required checks thực tế trên đúng commit khi bàn giao:

```yaml
name: CI Pipeline

on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]

jobs:
  fitness-and-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - name: Run Tests
        run: npm test
      - name: Architecture Fitness Check
        run: npm run test:fitness
```
