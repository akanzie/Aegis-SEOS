# System Map: Modules & Ranh Giới Phân Tầng (Layer Boundaries)

Hệ thống tuân thủ kiến trúc phân tầng phân ly trách nhiệm rõ rệt (Clean / Hexagonal Architecture).
*Nguồn sự thật cho các luật cấm và máy chấm tự động*: [docs/fitness-functions/architecture-rules.md](../fitness-functions/architecture-rules.md).

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
- **Ranh giới cốt lõi**: Hoàn toàn thuần khiết (Pure). Cấm import database, web frameworks, UI components hoặc `process.env`.
- *Chi tiết*: [architecture-rules.md#luat-1-domain-is-pure](../fitness-functions/architecture-rules.md#luat-1-domain-is-pure)

## 2. Service Layer (`src/services/` hoặc `src/application/`)
- **Trách nhiệm**: Điều phối luồng nghiệp vụ (use cases), kết hợp Domain logic với Infrastructure adapters.
- **Quy tắc**: Phải là **Stateless** (cấm lưu request-state trong singleton instance). Nhận input từ Controller, gọi Domain & Repo, trả về Result DTO.

## 3. Infrastructure Layer (`src/infrastructure/` hoặc `src/infra/`, `src/lib/`)
- **Trách nhiệm**: Giao tiếp với môi trường ngoài: kết nối DB, gọi 3rd-party APIs, gửi email, caching, logging.
- **Quy tắc**: Triển khai các port/interface do Domain định nghĩa; chuẩn hóa lỗi kỹ thuật thành Domain Errors. Tuân thủ [performance.md](../standards/performance.md) (chống N+1, cấm unbounded queries).

## 4. Presentation Layer (`src/app/`, `src/components/`, `src/ui/`)
- **Trách nhiệm**: Render giao diện, tiếp nhận HTTP requests/events, validate input thô.
- **Quy tắc**: Phân tách rành mạch Client Components (`'use client'`) và Server Components. Client component cấm import DB client hoặc secrets (xem [architecture-rules.md#luat-2](../fitness-functions/architecture-rules.md#luat-2-clientserver-isolation-cach-ly-khach--chu-tuyet-doi)).
