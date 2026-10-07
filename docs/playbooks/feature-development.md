# Playbook: Quy Trình Phát Triển Tính Năng Mới (Feature Development SOP)

Quy trình phát triển tính năng mới tuân thủ nghiêm ngặt mô hình **Docs-as-an-OS** và chu trình 3 bước khép kín.

---

## Chu Trình 3 Bước

```
   [1. Soạn Prompt & Spec] ──▶ [2. Thiết Kế & Task Plan] ──▶ [3. Thực Thi Từng Task]
```

### Bước 1: Soạn Thảo Đặc Tả & Batch Prompt
1. Tiếp nhận yêu cầu nghiệp vụ từ Stakeholder / Developer.
2. Soạn đề xuất đặc tả chức năng; chỉ cập nhật spec canonical tại `docs/main_docs/<ACTIVE_VERSION>/fn/<module-name>.md` khi thay đổi nghiệp vụ đã được Developer duyệt:
   - Mục đích tính năng.
   - User stories & Acceptance Criteria (AC).
   - Input/Output & Edge cases.
3. Tạo file batch prompt tập trung: `docs/tasks/<feat-name>/prompt-dieu-tra-<feat-name>.md`. Mặc định một task cho một kết quả nghiệm thu; mỗi task chứa code/tests/docs cần thiết. Chỉ tách kết quả độc lập và ghi dependencies theo [Task Authoring](../task-authoring/README.md), không tách theo tầng DB/service/UI.

### Bước 2: Thiết Kế Kỹ Thuật (Technical Design & Task Prep)
1. Mở Clean Session điều tra cho từng Task.
2. Xác định các interface, DTOs, entity changes.
3. Xuất file `task-N-fix.md` hoặc `task-N-feat.md` với `status: draft`.
4. Developer duyệt (`status: approved`).

### Bước 3: Thực Thi Kỹ Thuật (Surgical Execution)
1. Tạo branch: `git checkout -b feat/<feat-name>-task-<N>`.
2. Tạo/Sửa Domain logic trước (TDD nếu có thể).
3. Triển khai Service layer và Infrastructure adapters.
4. Triển khai UI Components và routes.
5. Chạy kiểm thử:
   ```bash
   npm test
   npm run test:fitness
   ```
6. Chạy thêm static/build/manual checks cần thiết theo [Verification Standard](../standards/verification.md); Conditional Commit khi đạt gate, bàn giao theo [Handoff Contract](../operations/handoff-contract.md).
