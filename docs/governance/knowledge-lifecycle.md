# Governance: Vòng Đời Tri Thức & Quy Tắc Lưu Trữ (Knowledge Lifecycle SOP)

Sau 2–5 năm phát triển, số lượng ADRs, Incidents và Task files sẽ lên tới hàng trăm files. Nếu không có quy chế vòng đời, **Project Memory sẽ biến thành Project Junkyard**, gây nổ token và làm AI Agent bị phân tán sự chú ý.

Tài liệu này định nghĩa chu kỳ lưu trữ (retention) và lưu trữ lịch sử (archive) tự động.

---

## 1. Bảng Quy Định Thời Gian Lưu Giữ (Retention Matrix)

| Loại Tài Liệu | Thư Mục Hoạt Động | Thời Gian Lưu Giữ Hoạt Động | Hành Động Sau Chu Kỳ | Thư Mục Đích Lưu Trữ |
| :--- | :--- | :--- | :--- | :--- |
| **Completed Tasks** | `docs/tasks/<request>/` | **6 tháng** kể từ ngày merge | Archive | `docs/archive/tasks/<YYYY>/` |
| **Engineering Incidents** | `docs/engineering-incidents/` | **12 tháng** kể từ ngày giải quyết | Đúc kết bài học -> Archive | `docs/archive/incidents/<YYYY>/` |
| **Superseded ADRs** | `docs/decisions/` | Vĩnh viễn (đổi status) | Đổi status sang `Superseded`, gắn link ADR mới | `docs/decisions/` (hoặc `archive/decisions/`) |
| **Scratchpad & POCs** | `docs/dev_notes/` | **30 ngày** không hoạt động | Xóa hoặc chuyển thành ADR nếu có giá trị | Purge / Migrate to ADR |
| **Obsolete Specs** | `docs/main_docs/vX.X/` | Cho đến khi bump phiên bản mới | Bump version -> Giữ bản cũ trong `vX.X` | `docs/main_docs/<OLD_VERSION>/` |

---

## 2. Quy Trình Lưu Trữ Định Kỳ (Archive Workflow)

### A. Đối Với Task Files Đã Hoàn Thành (> 6 Tháng)
1. Kiểm tra trạng thái: Task file đã ghi `status: completed` và PR đã merge vào `main` trên 6 tháng.
2. Di chuyển cả thư mục task sang `docs/archive/tasks/<YYYY>/<request-name>/`.
3. Giữ nguyên cấu trúc để vẫn có thể tra cứu khi cần điều tra pháp y (forensic analysis) nhưng AI Agent không bao giờ tự động load thư mục archive này.

### B. Đối Với Sự Cố Kỹ Thuật (> 12 Tháng)
1. Đảm bảo toàn bộ **Root Cause** và **Action Items** quan trọng đã được chắt lọc vào `docs/project-memory/known-pitfalls.md` hoặc `technical-lessons.md`.
2. Di chuyển file incident sang `docs/archive/incidents/<YYYY>/`.

### C. Đối Với Architecture Decision Records (ADR)
1. **Không bao giờ xóa một ADR cũ**.
2. Khi kiến trúc thay đổi, tạo ADR mới (ví dụ: `ADR-0012-drizzle-migration.md`).
3. Cập nhật header của ADR cũ:
   ```markdown
   - **Trạng thái**: Superseded by [ADR-0012](../decisions/ADR-0012-drizzle-migration.md)
   ```

---

## 3. Quy Tắc "Cấm Nạp Thư Mục Archive" (Zero-Archive In Context)
- Các AI Agent tuyệt đối **KHÔNG** được nạp bất kỳ file nào từ thư mục `docs/archive/**` vào Context Package hoặc Session Prompt trừ khi Developer chỉ định rõ ràng yêu cầu tra cứu lịch sử cụ thể.
