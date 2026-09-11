# Playbook: Xử Lý Sự Cố Khẩn Cấp (Production Incident SOP)

Khi xảy ra sự cố trên môi trường Production, bảo toàn dữ liệu và khôi phục hoạt động cho người dùng là ưu tiên số 1.

---

## Các Cấp Độ Sự Cố (Severity Levels)

- **SEV-1 (Critical)**: Hệ thống ngừng hoạt động hoàn toàn, rò rỉ dữ liệu hoặc luồng P0 (Auth / Payment availability) hỏng toàn diện.
- **SEV-2 (Major)**: Một tính năng chính hoặc luồng P1 (Payment ledger / Sync) bị gián đoạn, ảnh hưởng tới nhiều người dùng nhưng có giải pháp tạm thời.
- **SEV-3 (Minor)**: Lỗi giao diện nhỏ, tính năng phụ bị lỗi, không ảnh hưởng dữ liệu cốt lõi.

---

## Quy Trình 4 Bước Ứng Phó Khẩn Cấp

### 1. Cách Ly & Giảm Thiểu (Triage & Mitigate)
- **Đánh giá phương án phục hồi có phê duyệt**:
  - Nếu sự cố có tương quan rõ rệt với bản release mới: Ưu tiên lựa chọn phương án phục hồi phù hợp nhất đã được phê duyệt:
    1. **Feature Flag Disable**: Tắt tính năng lỗi ngay lập tức nếu đã được bọc trong feature toggle (an toàn nhất).
    2. **Traffic Isolation**: Định tuyến traffic ra khỏi cụm instance bị lỗi hoặc bật chế độ bảo trì tạm thời.
    3. **Rollback**: Chỉ thực hiện Rollback mã nguồn nếu bản migration trước đó là tương thích ngược (backward compatible) và không có nguy cơ làm hỏng trạng thái CSDL.
    4. **Roll-forward**: Triển khai bản vá khẩn cấp nếu việc rollback có thể gây sai lệch dữ liệu (ví dụ: migration đã chuyển đổi cấu trúc dữ liệu không thể hoàn nguyên ngay).
  - **CẢNH BÁO**: Tuyệt đối không thực hiện rollback tự động nếu chưa xác minh tính an toàn của database schema.

### 2. Điều Tra Trong Môi Trường Bản Sao (Investigate in Staging)
- Trích xuất error logs, correlation IDs, và stack traces từ structured logging.
- Tái hiện lỗi trên môi trường Staging/Local bằng dữ liệu mô phỏng.
- Thực hiện Session Điều Tra theo chuẩn `docs/playbooks/bug-investigation.md`.

### 3. Phát Hành Bản Vá (Hotfix Deployment)
- Tạo branch: `hotfix/<incident-code>`.
- Sửa lỗi phẫu thuật tối thiểu (surgical fix), tránh đính kèm refactoring lan man.
- Chạy toàn bộ test suites và kiểm tra máy chấm `npm run test:fitness`.
- Thực hiện Conditional Commit trên branch `hotfix/*`.
- Deploy bản vá lên Staging kiểm tra trước khi đưa lên Production.

### 4. Đúc Kết & Post-Mortem (Learning & Prevention)
- Tạo file ghi nhận sự cố theo mẫu: `docs/engineering-incidents/YYYY-MM-DD-<incident-title>.md`.
- Ghi nhận bài học kinh nghiệm vào `docs/project-memory/technical-lessons.md`.
- Cập nhật quy tắc vào máy chấm `scripts/validators/architecture-fitness.mjs` hoặc test suite để đảm bảo lỗi không bao giờ lặp lại.
