# Fitness Functions: Hướng Dẫn Thực Thi Máy Chấm CI (CI Enforcement)

Tài liệu này hướng dẫn cách tích hợp và kích hoạt máy chấm tự động trong quy trình phát triển cục bộ và trên CI pipeline.

---

## 1. Chạy Cục Bộ (Local Verification)

Bất kỳ lúc nào trước khi commit hoặc hoàn tất task, Developer và AI Agent chạy:

```bash
npm run test:fitness
```

### Kết Quả Mong Đợi
- Nếu code tuân thủ đầy đủ ranh giới:
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

Ví dụ cấu hình trong GitHub Actions (`.github/workflows/ci.yml`):

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
      - name: Architecture Fitness Check
        run: npm run test:fitness
      - name: Run Tests
        run: npm test
```
