# Governance: Vòng Đời Tri Thức & Quy Tắc Lưu Trữ (Knowledge Lifecycle SOP)

Áp dụng retention và archive cho task, incident và ADR để tài liệu hoạt động không phình theo thời gian.

---

## 1. Bảng Quy Định Thời Gian Lưu Giữ (Retention Matrix)

| Loại Tài Liệu | Thư Mục Hoạt Động | Thời Gian Lưu Giữ Hoạt Động | Hành Động Sau Chu Kỳ | Thư Mục Đích Lưu Trữ |
| :--- | :--- | :--- | :--- | :--- |
| **Closed Tasks** | `docs/tasks/<request>/` | **6 tháng** kể từ `closed_at` | Archive eligible task records when the whole request is eligible | `docs/archive/tasks/<YYYY>/` |
| **Engineering Incidents** | `docs/engineering-incidents/` | **12 tháng** kể từ ngày giải quyết | Đúc kết bài học -> Archive | `docs/archive/incidents/<YYYY>/` |
| **Superseded ADRs** | `docs/decisions/` | Vĩnh viễn (đổi status) | Đổi status sang `Superseded`, gắn link ADR mới | `docs/decisions/` (hoặc `archive/decisions/`) |
| **Scratchpad & POCs** | `docs/dev_notes/` | **30 ngày** không hoạt động | Xóa hoặc chuyển thành ADR nếu có giá trị | Purge / Migrate to ADR |
| **Obsolete Specs** | `docs/main_docs/vX.X/` | Cho đến khi bump phiên bản mới | Bump version -> Giữ bản cũ trong `vX.X` | `docs/main_docs/<OLD_VERSION>/` |

---

## 2. Quy Trình Lưu Trữ Định Kỳ (Archive Workflow)

<a id="archive-workflow"></a>

### A. Đối Với Task Files Đã Đóng (đủ 6 tháng)

1. Dùng `closed_at` làm retention clock cho task có execution status `completed`, `cancelled` hoặc `superseded`. `merged_at` chỉ ghi ngày merge thật và không thay thế `closed_at`.
2. Chỉ archive request khi mọi task trong request đều terminal và từng task đã đủ 6 tháng kể từ `closed_at`. Task còn active, chưa đóng hoặc chưa đủ thời hạn sẽ giữ toàn bộ request ở vị trí hiện tại.
3. Trước khi di chuyển records, kiểm kê mọi approved task decision trong request bằng approval evidence, scope và `approved_revision` theo [Task Lifecycle](../operations/task-lifecycle.md). Execution status (`completed`, `cancelled` hoặc `superseded`) không tự làm mất hiệu lực approval/decision; chỉ evidence authority revoke hoặc thay thế đúng scope/revision mới xác nhận decision hết hiệu lực.
4. Với mỗi decision còn hiệu lực, bảo đảm nội dung cần dùng nằm đầy đủ trong owner doc đang hoạt động phù hợp, kèm liên kết truy vết tới task, approved revision và approval evidence. Nếu owner đã ghi đầy đủ decision, xác minh nội dung và bổ sung traceability thay vì tạo bản trùng. Việc chuyển/chép decision không cấp approval mới, không đổi authority và không được mâu thuẫn hierarchy tại `AGENTS.md` §0 hoặc Accepted ADR.
5. Nếu không xác định được trạng thái hiệu lực/owner hoặc không thể chuyển decision còn hiệu lực đầy đủ và an toàn, giữ toàn bộ request ở vị trí hoạt động và hỏi Developer/authority. Nếu coi decision là hết hiệu lực thì phải có evidence authority revoke hoặc thay thế đúng scope/revision theo bước 3; nếu thiếu evidence, xử lý decision như còn hiệu lực và làm theo bước 4. Không tự supersede decision để đủ điều kiện archive.
6. Giữ `docs/tasks/<request-name>/README.md` làm index tại chỗ. Khi archive task records, cập nhật liên kết nguồn/evidence trong README và owner docs tới vị trí lưu trữ mới; không chuyển index cùng records. Decision còn hiệu lực phải vẫn đọc được từ owner doc hoạt động; liên kết archive chỉ để truy vết và không cho phép tự nạp archive.
7. Lưu task records đủ điều kiện tại `docs/archive/tasks/<YYYY>/<request-name>/`. Giữ cấu trúc để tra cứu lịch sử; AI Agent không tự nạp archive.

### B. Đối Với Sự Cố Kỹ Thuật (> 12 Tháng)

1. Đảm bảo toàn bộ **Root Cause** và **Action Items** quan trọng đã được chắt lọc vào `docs/project-memory/known-pitfalls.md` hoặc `technical-lessons.md`.
2. Di chuyển file incident sang `docs/archive/incidents/<YYYY>/`.

### C. Đối Với Architecture Decision Records (ADR)

1. **Không bao giờ xóa một ADR cũ**.
2. Khi kiến trúc thay đổi, tạo ADR theo [template canonical](../templates/adr.md) và quy tắc tại [ADR README](../decisions/README.md).
3. Ghi `superseded_by` và liên kết ADR thay thế trong ADR cũ; giữ file cũ để truy vết.

---

## 3. Quy Tắc "Cấm Nạp Thư Mục Archive" (Zero-Archive In Context)

- Các AI Agent tuyệt đối **KHÔNG** được nạp bất kỳ file nào từ thư mục `docs/archive/**` vào Context Package hoặc Session Prompt trừ khi Developer chỉ định rõ ràng yêu cầu tra cứu lịch sử cụ thể.
