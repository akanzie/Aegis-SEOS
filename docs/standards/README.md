# Engineering Standards & Guidelines

Thư mục này quy định các tiêu chuẩn kỹ thuật áp dụng xuyên suốt dự án:
- **Verification Standard** ([verification.md](verification.md)): Chọn checks theo stack/risk, mock boundary, AC evidence, local/CI và manual checks.
- Standards đặc thù công nghệ được tạo theo [Project Adoption](../operations/project-adoption.md), dựa trên công cụ và nhu cầu thực tế; danh sách dưới đây không chứng minh một standard hoặc script đã tồn tại.
- **Observability Standard** ([observability.md](observability.md)): Quy chuẩn Structured Logging, Correlation ID, Tracing và Alerting cho luồng P0/P1.
- **Performance Standard** ([performance.md](performance.md)): Rào chắn hiệu năng, cấm unbounded query, bắt buộc projection trên hot paths và phân trang, chống N+1; `SELECT *` chỉ khi contract cần toàn bộ entity và đã review theo performance standard §1.A.
- **TypeScript Standard**: Strict mode, quy ước đặt tên types/interfaces, cấm dùng `any`.
- **Database Standard**: Naming conventions cho tables/columns (snake_case), bắt buộc có timestamps (`created_at`, `updated_at`), foreign keys và index hợp lý.
- **Security Standard**: Nguyên tắc Zero-Trust, sanitized inputs, CSRF/XSS prevention, không log sensitive data/passwords.
