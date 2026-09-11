# Playbook: Quy Trình Phát Triển Tính Năng Mới (Feature Development SOP)

Quy trình phát triển tính năng mới tuân thủ nghiêm ngặt mô hình **Docs-as-an-OS** và chu trình 3 bước khép kín.

---

## Chu Trình 3 Bước

```
   [1. Soạn Prompt & Spec] ──▶ [2. Thiết Kế & Task Plan] ──▶ [3. Thực Thi Từng Task]
```

### Bước 1: Soạn Thảo Đặc Tả & Batch Prompt
1. Tiếp nhận yêu cầu nghiệp vụ từ Stakeholder / Developer.
2. Viết tài liệu đặc tả chức năng vào `docs/main_docs/<ACTIVE_VERSION>/fn/<module-name>.md`:
   - Mục đích tính năng.
   - User stories & Acceptance Criteria (AC).
   - Input/Output & Edge cases.
3. Tạo file batch prompt tập trung: `docs/tasks/<feat-name>/prompt-dieu-tra-<feat-name>.md` chia nhỏ thành các task độc lập (Task 1: Schema/Domain -> Task 2: Service/Logic -> Task 3: UI/Integration).

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
6. Commit khi toàn bộ test PASS.
