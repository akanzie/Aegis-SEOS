# System Map: Dependency Matrix (Ma Trận Import Cho Phép / Cấm)

Ma trận này xác định chiều import hợp lệ giữa các module trong codebase:

| Tầng Hiện Tại (Source) | Được Import Từ (Allowed Targets) | Cấm Tuyệt Đối Import (Forbidden Targets) |
| :--- | :--- | :--- |
| **Domain** (`src/domain/`) | Domain nội bộ, Shared pure utils | Database, ORM, Services, Infra, Web Frameworks, UI Components, `process.env` |
| **Service** (`src/services/`) | Domain, Infra interfaces, Service nội bộ, Utils | UI Components, Request/Response objects trực tiếp của framework |
| **Infrastructure** (`src/infra/`, `src/lib/`) | Domain interfaces, DB clients, External SDKs, Env Config | Presentation/UI layer |
| **Client UI** (`'use client'`) | UI components, Client hooks, Shared DTOs, API fetchers | Database clients, Server-only secrets, Private Env |
| **Server UI** (Server Components, Route Handlers) | Services, Domain, Shared DTOs, UI components | Client-only hooks (`useState`, `useEffect`, browser globals) |

---

## Các Ranh Giới Kiểm Tra Bằng Máy (Fitness Enforcement)

1. **Rule 1 - Domain Isolation**:
   ```
   src/domain/** -> CANNOT import from (db, prisma, drizzle, next, express, react)
   ```
2. **Rule 2 - Client Safety Boundary**:
   ```
   files with 'use client' -> CANNOT import from (prisma, server-only, database, secret config)
   ```
3. **Rule 3 - Centralized Environment**:
   ```
   src/** (except src/lib/env.ts) -> CANNOT call `process.env.*` directly
   ```
