# Engineering Standards & Guidelines

Thư mục này quy định các tiêu chuẩn kỹ thuật áp dụng xuyên suốt dự án:
- **Observability Standard** ([observability.md](observability.md)): Quy chuẩn Structured Logging, Correlation ID, Tracing và Alerting cho luồng P0/P1.
- **Performance Standard** ([performance.md](performance.md)): Rào chắn hiệu năng, cấm unbounded query, cấm `SELECT *`, bắt buộc phân trang, chống N+1.
- **TypeScript Standard**: Strict mode, quy ước đặt tên types/interfaces, cấm dùng `any`.
- **Database Standard**: Naming conventions cho tables/columns (snake_case), bắt buộc có timestamps (`created_at`, `updated_at`), foreign keys và index hợp lý.
- **Security Standard**: Nguyên tắc Zero-Trust, sanitized inputs, CSRF/XSS prevention, không log sensitive data/passwords.
