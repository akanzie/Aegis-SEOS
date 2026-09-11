# Engineering Standard: Observability (Logging, Tracing & Alerting)

Tài liệu này định nghĩa các quy chuẩn giám sát, theo dõi và cảnh báo lỗi trong toàn bộ hệ thống.

---

## 1. Ràng Buộc Bắt Buộc Cho Luồng Trọng Yếu (P0 & P1)

Đối với mọi luồng thuộc **P0 (System Survival)** và **P1 (Revenue & Integrity)**:
- **Bắt buộc có Structured Log**: Ghi nhận thời điểm bắt đầu, kết quả (success/failure) và thời gian thực thi (latency ms).
- **Bắt buộc có Correlation / Trace ID**: Mỗi request hoặc mutation phải mang theo một định danh duy nhất xuyên suốt qua các tầng (Presentation -> Service -> Database).
- **Bắt buộc có Alerting cho Failure**: Mọi ngoại lệ (unhandled exception) hoặc lỗi giao dịch đều phải phát tín hiệu cảnh báo lập tức (ví dụ qua Sentry, webhook alert).

---

## 2. Quy Chuẩn Structured Logging (Nhật Ký Có Cấu Trúc)

### A. Định Dạng JSON
Mọi log ở môi trường staging/production phải được xuất dưới dạng structured JSON, tối thiểu bao gồm:
```json
{
  "timestamp": "2026-09-11T16:40:00.000Z",
  "level": "INFO",
  "correlation_id": "req-98fbc1-492a",
  "module": "auth-service",
  "action": "user.login.attempt",
  "user_id": "usr_deterministic_id_or_hash",
  "status": "success",
  "duration_ms": 42
}
```

### B. Quy Định Phân Cấp Mức Log (Log Levels)
- **`DEBUG`**: Thông tin chi tiết phục vụ quá trình điều tra tại môi trường cục bộ (tự động tắt trên production).
- **`INFO`**: Các mốc trạng thái vòng đời bình thường của hệ thống (service khởi động, job hoàn thành, login thành công).
- **`WARN`**: Các tình huống bất thường nhưng hệ thống tự phục hồi được (retry kết nối lần 1, deprecation warning).
- **`ERROR`**: Lỗi xử lý nghiệp vụ hoặc lỗi hạ tầng cần can thiệp kỹ thuật (giao dịch thất bại, DB query timeout).

### C. Cấm Tuyệt Đối Log Dữ Liệu Nhạy Cảm (Data Privacy)
- **CẤM ghi**: Mật khẩu dạng thô (plaintext passwords), session tokens, API keys, số thẻ tín dụng/CVV, CCCD/CMND.
- Nếu cần log danh tính: Chỉ dùng `userId` hoặc chuỗi hash 1 chiều.

---

## 3. Correlation ID & Distributed Tracing

1. **Sinh Trace ID tại ranh giới ngoài cùng**:
   - API Gateway, Middleware hoặc Route Handler sinh `x-correlation-id` (UUID v4 hoặc nanoid) nếu client chưa truyền header này.
2. **Lan truyền xuyên suốt (Context Propagation)**:
   - Truyền `correlationId` qua AsyncLocalStorage, request context hoặc tham số hàm xuống Service và Infrastructure.
3. **Đính kèm trong mọi response lỗi**:
   - Khi trả về mã lỗi HTTP 5xx / 4xx cho client, luôn đính kèm `correlationId` trong response body để người dùng/hỗ trợ kỹ thuật tra cứu nhanh trong log.

---

## 4. Health Checks & Hệ Thống Đo Lường (Metrics)

- **Liveness Endpoint (`/api/health/live`)**: Phục vụ kiểm tra tiến trình ứng dụng còn sống hay bị treo.
- **Readiness Endpoint (`/api/health/ready`)**: Kiểm tra kết nối sẵn sàng tới các dịch vụ phụ thuộc (Database, Cache, Third-party APIs).
