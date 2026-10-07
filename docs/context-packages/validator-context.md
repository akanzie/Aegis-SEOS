# Context Package: Architecture Validator

- Status: Verified paths/commands for this repository; recheck revision before use.
- Scope: `scripts/validators/architecture-fitness*.mjs` và policy docs liên quan.
- Phases: INVESTIGATE, EXECUTE, REVIEW. Enforcement thay đổi có blast radius quyền/boundary P0/CRITICAL, Standard; không suy Fast Track từ đuôi file.
- Target Token Budget: <=15,000 tokens; session bands/overflow theo [AGENTS §8](../../AGENTS.md#context-budget).

## Must Load

- `AGENTS.md` (đã luôn nạp), task/request hiện tại.
- `docs/operations/project-profile.md`, commands/gates; `package.json`, scripts.
- `docs/fitness-functions/architecture-rules.md`, rules bị ảnh hưởng.
- `scripts/validators/architecture-fitness.mjs`, entry/exports/rule calls trong scope.
- `scripts/validators/architecture-fitness-policy.mjs`, contracts/config liên quan.
- `scripts/validators/architecture-fitness.test.mjs`, tests/fixtures cho rule bị ảnh hưởng.
- `docs/project-memory/known-pitfalls.md`, mục 4: tests tạo fixture config tạm; chạy tests trước fitness.

## Optional — theo trigger

| Trigger | Nạp |
| :--- | :--- |
| Config/errors/CLI thay đổi | Callers, config parsing và fail-loud tests tương ứng |
| Enforcement/authority/permission thay đổi | `docs/operations/review-rework.md`, independent review bắt buộc |
| EXECUTE | `docs/standards/verification.md`, risk/evidence; `docs/operations/definition-of-done.md`, Standard profile |
| CI mapping thay đổi | `docs/fitness-functions/ci-enforcement.md`; CI thực tế nếu tồn tại, không dùng ví dụ làm evidence |
| Review PR/MR | `docs/operations/merge-review.md` |

## Do Not Load

Auth reference package, spec chưa tồn tại, tasks ngoài scope, archive/dependencies ngoài blast radius. Không đọc secrets; config examples chỉ tên biến/schema.

## Verification intent

Chứng minh validator bắt vi phạm và chấp nhận trường hợp hợp lệ, không chỉ Exit 0 trên repo chưa có `src/`. Chạy `npm.cmd test` rồi `npm.cmd run test:fitness` trên Windows, tuần tự vì shared fixtures. Fitness không chứng minh review-enforced security invariants.
