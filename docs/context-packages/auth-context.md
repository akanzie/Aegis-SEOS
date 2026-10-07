# Context Package: Authentication & Identity

> **Status: Reference example, not a verified project-domain package.** The current project profile has no application `src/` or verified runtime auth module. Confirm actual files and active version before using this package.

- **Domain Scope**: `src/domain/auth/`, `src/services/auth/`, `src/app/api/auth/`
- **Critical Flow Level**: `P0 - System Survival`
- **Target Token Budget**: `<= 15,000 tokens` (package target; session budget/overflow theo [AGENTS §8](../../AGENTS.md#context-budget))

---

## 1. Must Load (Bắt Buộc Đọc Đầu Session)
- `docs/main_docs/ACTIVE_VERSION.md`, rồi `docs/main_docs/<ACTIVE_VERSION>/fn/auth.md` nếu spec tồn tại
- `docs/system-map/critical-paths.md` (mục 1: Authentication & Authorization)
- `docs/standards/security.md` (hoặc `docs/standards/README.md`)
- `docs/fitness-functions/architecture-rules.md` (Rule 2: Client/Server Isolation & [Rule 4: Server Trust Boundary](../fitness-functions/architecture-rules.md#rule-server-trust-boundary))

## 2. Optional (Chỉ Đọc Khi Cần Thiết)
- `docs/decisions/ADR-XXXX-<slug>.md` liên quan nếu có, theo [ADR naming/lifecycle](../decisions/README.md#adr-lifecycle)
- [Quick Checklist](../operations/quick-checklist.md) chỉ khi cần pointer sang invariant owner

## 3. Do Not Load (Tuyệt Đối Không Nạp Vào Context)
- Billing / Payment modules (`src/domain/billing/`, `docs/main_docs/**/billing.md`)
- Content / Media modules (`src/domain/media/`)
- Analytics & Reporting modules
- Task ngoài scope (`docs/tasks/**`), ngoại trừ task hiện tại và dependency artifacts đã xác nhận cần đọc

## 4. Key Invariants
- `userId` chỉ được giải mã và tin cậy từ Server Context / Session token đã ký.
- Cấm expose hashed passwords, session secrets hoặc private keys về Client.
- Token refresh phải xoay vòng (rotation) và xử lý race conditions an toàn.
