# Playbook: Xử Lý Sự Cố Khẩn Cấp (Production Incident SOP)

Khi xảy ra sự cố trên môi trường Production, bảo toàn dữ liệu và khôi phục hoạt động cho người dùng là ưu tiên số 1.

---

## Các Cấp Độ Sự Cố (Severity Levels)

- **SEV-1 (Critical)**: Hệ thống ngừng hoạt động hoàn toàn, rò rỉ dữ liệu hoặc luồng P0 (Auth/Thanh toán) hỏng toàn diện.
- **SEV-2 (Major)**: Một tính năng chính bị gián đoạn, ảnh hưởng tới nhiều người dùng nhưng có giải pháp tạm thời.
- **SEV-3 (Minor)**: Lỗi giao diện nhỏ, tính năng phụ bị lỗi, không ảnh hưởng dữ liệu cốt lõi.

---

## Quy Trình 4 Bước Ứng Phó Khẩn Cấp

### 1. Cách Ly & Giảm Thiểu (Triage & Mitigate)
- **Nếu lỗi do bản release mới**: Thực hiện **Rollback ngay lập tức** về phiên bản ổn định trước đó. Không cố fix code trực tiếp trên production đang cháy.
- Nếu do lỗi DB lock hoặc traffic bất thường: Tạm thời bật chế độ bảo trì hoặc kích hoạt circuit breaker.

### 2. Điều Tra Trong Môi Trường Bản Sao (Investigate in Staging)
- Trích xuất error logs, correlation IDs, và stack traces.
- Tái hiện lỗi trên môi trường Staging/Local bằng dữ liệu mô phỏng.
- Thực hiện Session Điều Tra theo chuẩn `docs/playbooks/bug-investigation.md`.

### 3. Phát Hành Bản Vá (Hotfix Deployment)
- Tạo branch: `hotfix/<incident-code>`.
- Sửa lỗi phẫu thuật tối thiểu (surgical fix), tránh đính kèm refactoring.
- Chạy toàn bộ test suites và `npm run test:fitness`.
- Deploy bản vá lên Staging kiểm tra trước khi đưa lên Production.

### 4. Đúc Kết & Post-Mortem (Learning & Prevention)
- Tạo file ghi nhận sự cố theo mẫu: `docs/engineering-incidents/YYYY-MM-DD-<incident-title>.md`.
- Ghi nhận bài học kinh nghiệm vào `docs/project-memory/technical-lessons.md`.
- Bổ sung quy tắc vào máy chấm `scripts/validators/architecture-fitness.mjs` hoặc test suite để đảm bảo lỗi không bao giờ lặp lại.
