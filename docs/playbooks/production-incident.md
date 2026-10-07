# Playbook: Xử Lý Sự Cố Khẩn Cấp (Production Incident SOP)

Khi xảy ra sự cố trên môi trường Production, bảo toàn dữ liệu và khôi phục hoạt động cho người dùng là ưu tiên số 1.

---

## Các Cấp Độ Sự Cố (Severity Levels)

- **SEV-1 (Critical)**: Hệ thống ngừng hoạt động hoàn toàn, rò rỉ dữ liệu hoặc luồng P0 (Auth / Payment availability) hỏng toàn diện.
- **SEV-2 (Major)**: Một tính năng chính hoặc luồng P1 (Payment ledger / Sync) bị gián đoạn, ảnh hưởng tới nhiều người dùng nhưng có giải pháp tạm thời.
- **SEV-3 (Minor)**: Lỗi giao diện nhỏ, tính năng phụ bị lỗi, không ảnh hưởng dữ liệu cốt lõi.

---

## Quy Trình 4 Bước Ứng Phó Khẩn Cấp

Incident severity và approval mitigation không cấp quyền sửa code, tạo task approved, commit hoặc deploy. Hotfix execution phải theo Standard task đã được duyệt; mọi exception cần explicit, scoped Developer override theo [AGENTS §0](../../AGENTS.md) và vẫn cần quyền deploy riêng theo project/operations. Không tồn tại severity-based bypass.

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

### 3. Thực Thi Hotfix Và Phát Hành
- Tạo Standard task cho hotfix theo [Agent Workflow](../operations/agent-workflow.md) và [Task Authoring](../task-authoring/README.md); chờ approval bao phủ đúng revision, scope, AC và risk trước khi sửa.
- Dùng branch `hotfix/<incident-code>` theo [AGENTS §2.C](../../AGENTS.md). Severity hoặc incident role không thay approval hay quyền Git.
- Sửa tối thiểu trong approved scope; chạy required tests/checks và fitness theo [gate applicability](../../AGENTS.md#quality-gate-applicability) và project profile; conditional commit chỉ sau khi gates đạt.
- Deploy lên staging rồi production chỉ bởi người có deployment authority theo project operations. Approval task, mitigation hoặc Developer override không tự cấp quyền deploy.
- Nếu có explicit Developer override theo AGENTS §0, ghi issuer, timestamp, incident ID, action/file scope, expiry/recovery và evidence; override chỉ áp dụng cho scope nêu rõ và không tạo deployment authority.

### 4. Đúc Kết & Post-Mortem (Learning & Prevention)
- Tạo file ghi nhận sự cố theo mẫu: `docs/engineering-incidents/YYYY-MM-DD-<incident-title>.md`.
- Ghi nhận bài học kinh nghiệm vào `docs/project-memory/technical-lessons.md`.
- Cập nhật quy tắc vào máy chấm `scripts/validators/architecture-fitness.mjs` hoặc test suite để đảm bảo lỗi không bao giờ lặp lại.
