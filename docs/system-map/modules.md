# System Map: Modules & Ranh Giới Phân Tầng (Layer Boundaries)

Hệ thống tuân thủ kiến trúc phân tầng phân ly trách nhiệm rõ rệt (Clean / Hexagonal Architecture):

```
┌────────────────────────────────────────────────────────┐
│               Presentation Layer (UI)                  │
│       Pages, Client/Server Components, Route Handlers   │
└───────────────────────────┬────────────────────────────┘
                            │ uses
┌───────────────────────────▼────────────────────────────┐
│                  Service Layer (Use Cases)             │
│       Business Orchestration, Workflows, Coordinators  │
└───────────────────────────┬────────────────────────────┘
              ┌─────────────┴─────────────┐
              ▼                           ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│       Domain Layer        │ │   Infrastructure Layer    │
│  Pure Entities, Logic,    │ │  Database, External APIs, │
│  Value Objects, Rules     │ │  Cache, File Storage      │
└───────────────────────────┘ └───────────────────────────┘
```

---

## 1. Domain Layer (`src/domain/`)
- **Trách nhiệm**: Chứa các quy tắc nghiệp vụ cốt lõi, công thức tính toán, entities, value objects và domain interfaces/ports.
- **Ranh giới bất biến**:
  - Không phụ thuộc bất kỳ thư viện bên ngoài nào (ngoại trừ các utility thuần túy như date/uuid độc lập).
  - Không import database client (Prisma, Drizzle, TypeORM, Mongo, v.v.).
  - Không import framework Web (Next.js, Express, Fastify, v.v.).
  - Không import HTTP client hoặc UI components.

## 2. Service Layer (`src/services/` hoặc `src/application/`)
- **Trách nhiệm**: Điều phối luồng nghiệp vụ (use cases), kết hợp Domain logic với Infrastructure adapters.
- **Quy tắc**:
  - Dịch vụ phải là **Stateless**: Không lưu request-state trong singleton attributes.
  - Nhận input từ Controller/Presentation, gọi Domain và Repo, trả về Result DTO.

## 3. Infrastructure Layer (`src/infrastructure/` hoặc `src/infra/`, `src/lib/`)
- **Trách nhiệm**: Giao tiếp với thế giới bên ngoài: kết nối database, gọi 3rd party APIs, gửi email, caching, logging.
- **Quy tắc**:
  - Triển khai các interface do Domain/Service định nghĩa.
  - Xử lý các lỗi kỹ thuật (Network error, DB timeout, Serialization) và chuẩn hóa thành Domain/App Errors.

## 4. Presentation Layer (`src/app/`, `src/components/`, `src/ui/`)
- **Trách nhiệm**: Render giao diện người dùng, tiếp nhận request HTTP/UI events, validate input thô.
- **Quy tắc**:
  - Phân tách rành mạch Client Components (`'use client'`) và Server Components.
  - Client component cấm import trực tiếp DB client hoặc secret env vars.
