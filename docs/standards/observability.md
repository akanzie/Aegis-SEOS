# Engineering Standard: Observability (Logging, Tracing & Alerting)

Tài liệu này định nghĩa các quy chuẩn giám sát, theo dõi và cảnh báo lỗi trong toàn bộ hệ thống.

---

## 1. Ràng Buộc Bắt Buộc Cho Luồng Trọng Yếu (P0 & P1)

Đối với mọi luồng thuộc **P0 (System Survival)** và **P1 (Revenue & Integrity)** dựa trên bán kính tác động:
- **Bắt buộc có Structured Log**: Ghi nhận thời điểm bắt đầu, kết quả (`success`/`failure`) và thời gian thực thi (`duration_ms`).
- **Bắt buộc có Correlation / Trace ID**: Mỗi request hoặc mutation phải mang theo một định danh duy nhất xuyên suốt qua các tầng (Presentation -> Service -> Database).
- **Cảnh báo lỗi có phân tầng (Tiered Alerting)**: Phân định rõ mức độ nghiêm trọng để tránh hiện tượng mệt mỏi vì cảnh báo (Alert Fatigue).

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
- **`WARN`**: Các tình huống bất thường nhưng hệ thống tự phục hồi hoặc từ chối nghiệp vụ hợp lệ (retry kết nối lần 1, deprecation warning, invalid user credentials).
- **`ERROR`**: Lỗi xử lý nghiệp vụ bất thường hoặc lỗi hạ tầng cần can thiệp kỹ thuật (giao dịch thanh toán thất bại kỹ thuật, DB query timeout, unhandled exception).

### C. Cấm Tuyệt Đối Log Dữ Liệu Nhạy Cảm (Data Privacy)
- **CẤM ghi**: Mật khẩu dạng thô (plaintext passwords), session tokens, API keys, số thẻ tín dụng/CVV, CCCD/CMND.
- Nếu cần log danh tính: Chỉ dùng `userId` hoặc chuỗi hash 1 chiều.

---

## 3. Correlation ID & Distributed Tracing

### A. Tiếp Nhận & Khởi Tạo Trace ID An Toàn
1. **Kiểm tra và Khử độc đầu vào (Sanitize & Validate)**:
   - Nếu nhận header `x-correlation-id` từ upstream đáng tin cậy: Bắt buộc validate định dạng (alphanumeric, dấu gạch nối, chuẩn UUID) và giới hạn độ dài (tối đa 128 ký tự) để ngăn ngừa tấn công log injection.
   - Đối với client công khai (public client không đáng tin cậy): Hệ thống luôn chủ động sinh `correlation_id` nội bộ mới (UUID v4 hoặc nanoid) và có thể lưu request ID do client gửi vào trường metadata phụ `client_request_id` đã được sanitize.
2. **Lan truyền xuyên suốt (Context Propagation)**:
   - Truyền `correlation_id` qua AsyncLocalStorage, request context hoặc tham số hàm xuống Service và Infrastructure.
3. **Đính kèm trong Response**:
   - Luôn trả `correlation_id` trong HTTP header: `x-correlation-id`.
   - Chỉ đính kèm vào response body nếu schema/contract của API đó quy định cho phép (tránh làm gãy contract công khai đã cam kết).

---

## 4. Phân Tầng Cảnh Báo (Tiered Alerting Policy)

Để đảm bảo các cảnh báo khẩn cấp được xử lý tức thì mà không gây tê liệt vì cảnh báo rác (Alert Fatigue), việc kích hoạt alert phải tuân thủ phân loại:

1. **Expected Business Rejections** (Thẻ không đủ số dư, nhập sai OTP/mật khẩu, validation input error):
   - Xử lý: Ghi log `INFO` hoặc `WARN`, tăng business metrics counter. **CẤM kích hoạt pager/alert khẩn cấp**.
2. **Transient Infrastructure Failures** (Network flicker, retry lần 1 thành công):
   - Xử lý: Ghi log `WARN`, theo dõi qua biểu đồ tỷ lệ lỗi (Error Rate Metric). Chỉ kích hoạt alert nếu vượt quá ngưỡng (threshold, ví dụ: > 2% request lỗi trong 5 phút).
3. **Unhandled Exceptions / System 5xx**:
   - Xử lý: Ghi log `ERROR`, capture stack trace kèm correlation ID, gửi cảnh báo qua hệ thống error tracking (Sentry).
4. **Data Integrity Violations** (Sai lệch sổ cái, mất dữ liệu giao dịch, schema drift runtime):
   - Xử lý: Kích hoạt **Immediate High-Severity Alert (SEV-1/SEV-2)** tới đội ngũ kỹ thuật 24/7.
5. **Security Events** (Phát hiện tấn công brute-force, IDOR attempt, chữ ký webhook giả mạo):
   - Xử lý: Ghi log security audit và kích hoạt security alert theo chính sách ứng phó sự cố.

---

## 5. Health Checks & Giám Sát Độ Sẵn Sàng (Health & Metrics)

- **Liveness Endpoint (`/api/health/live`)**:
  - Phục vụ bộ điều phối (orchestrator / Kubernetes) kiểm tra tiến trình ứng dụng còn sống hay bị treo (deadlock).
  - Yêu cầu: Xử lý siêu nhẹ (lightweight), **tuyệt đối không thực hiện database query hay network call nặng** để tránh restart nhầm pod khi DB bị chậm.
- **Readiness Endpoint (`/api/health/ready`)**:
  - Kiểm tra xem instance đã sẵn sàng tiếp nhận traffic của người dùng hay chưa.
  - **Phân loại phụ thuộc (Dependency Classification)**:
    - *Critical Dependencies (CSDL chính, Cache chính)*: Nếu mất kết nối, endpoint trả về 503 và tạm thời ngắt instance khỏi Load Balancer.
    - *Optional / Non-critical Dependencies (Third-party analytics, dịch vụ phụ)*: Nếu mất kết nối, trả về HTTP 200 kèm trạng thái `"status": "degraded"`, **không ngắt readiness** toàn bộ instance để đảm bảo các tính năng cốt lõi vẫn phục vụ được người dùng.
