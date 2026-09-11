# Context Package: Authentication & Identity

- **Domain Scope**: `src/domain/auth/`, `src/services/auth/`, `src/app/api/auth/`
- **Critical Flow Level**: `P0 - System Survival`
- **Target Token Budget**: `<= 15.000 tokens`

---

## 1. Must Load (Bắt Buộc Đọc Đầu Session)
- `docs/main_docs/v1.0/fn/auth.md` (nếu có)
- `docs/system-map/critical-paths.md` (mục 1: Authentication & Authorization)
- `docs/standards/security.md` (hoặc `docs/standards/README.md`)
- `docs/fitness-functions/architecture-rules.md` (Luật 2: Client/Server Isolation & Luật 4: Trust Boundary)

## 2. Optional (Chỉ Đọc Khi Cần Thiết)
- `docs/decisions/ADR-auth-strategy.md` (nếu có)
- `docs/operations/quick-checklist.md` (Điều 2: Server Trust Boundary)

## 3. Do Not Load (Tuyệt Đối Không Nạp Vào Context)
- Billing / Payment modules (`src/domain/billing/`, `docs/main_docs/**/billing.md`)
- Content / Media modules (`src/domain/media/`)
- Analytics & Reporting modules
- Lịch sử task cũ (`docs/tasks/**`)

## 4. Key Invariants
- `userId` chỉ được giải mã và tin cậy từ Server Context / Session token đã ký.
- Cấm expose hashed passwords, session secrets hoặc private keys về Client.
- Token refresh phải xoay vòng (rotation) và xử lý race conditions an toàn.
