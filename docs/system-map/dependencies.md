# System Map: Dependency Matrix (Ma Trận Import Cho Phép / Cấm)

Ma trận này xác định chiều import hợp lệ giữa các module trong codebase.
*Quy chuẩn kiểm tra tự động*: [docs/fitness-functions/architecture-rules.md](../fitness-functions/architecture-rules.md).

| Tầng Hiện Tại (Source) | Được Import Từ (Allowed Targets) | Cấm Tuyệt Đối Import (Forbidden Targets) |
| :--- | :--- | :--- |
| **Domain** (`src/domain/`) | Domain nội bộ, Shared pure utils | Database, ORM, Services, Infra, Web Frameworks, UI Components, `process.env` |
| **Service** (`src/services/`) | Domain, Infra interfaces, Service nội bộ, Utils | UI Components, Request/Response objects trực tiếp của framework |
| **Infrastructure** (`src/infra/`, `src/lib/`) | Domain interfaces, DB clients, External SDKs, Env Config | Presentation/UI layer |
| **Client UI** (`'use client'`) | UI components, Client hooks, Shared DTOs, API fetchers | Database clients, Server-only secrets, Private Env |
| **Server UI** (Server Components, Route Handlers) | Services, Domain, Shared DTOs, UI components | Client-only hooks (`useState`, `useEffect`, browser globals) |

---

## Các Ranh Giới Kiểm Tra Bằng Máy (Fitness Enforcement)

1. **Rule 1 - Domain Isolation**: `src/domain/**` -> cấm import ORM, framework, react, express.
2. **Rule 2 - Client Safety Boundary**: File có `'use client'` -> cấm import DB client, server-only secrets.
3. **Rule 3 - Centralized Environment**: `src/**` -> cấm gọi trực tiếp `process.env.*` (ngoại trừ file schema env tập trung).

*Chi tiết máy chấm*: [architecture-fitness.mjs](../../scripts/validators/architecture-fitness.mjs).
