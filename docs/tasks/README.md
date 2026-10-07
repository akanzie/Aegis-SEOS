# Tasks & Work In Progress

Các mẫu prompt/plan và báo cáo nằm tại [Bộ template vận hành](../templates/README.md); template chưa điền không phải task active.

Thư mục này là trung tâm điều phối các yêu cầu công việc, batch prompts và task fixes:

Soạn prompt/plan theo [Task Authoring](../task-authoring/README.md); quyền từng phase theo [Agent Workflow](../operations/agent-workflow.md). Quy tắc áp dụng cho cả `task-N-fix.md` và `task-N-feat.md`.

## Cấu Trúc Khuyến Nghị
```
docs/tasks/
└── <request-name>/
    ├── prompt-dieu-tra-<request-name>.md   # File batch prompt tổng hợp từ Dev
    ├── task-1-fix.md                       # Kế hoạch thực thi Task 1
    ├── task-2-fix.md                       # Kế hoạch thực thi Task 2
    └── ...
```

## Vòng Đời Của Một File Task (`task-N-fix.md`)
1. **`status: draft`**: Do AI Agent tạo ra sau Session Điều Tra (Investigation).
2. **`status: approved`**: Do Developer xem xét và chuyển trạng thái, cho phép Session Thực Thi (Execution) bắt đầu.
3. **`status: completed`**: Sau khi đạt DoD tương ứng, gồm verification, manual checks bắt buộc, Conditional Commit và handoff. Chưa đủ bằng chứng thì ghi checkpoint/pending items, không đánh dấu completed.

Approval ghi người duyệt, thời điểm và nội dung/revision đã duyệt. Agent không tự duyệt plan; reviewer cần được Developer ủy quyền. Findings/rework phải truy vết theo ID, không âm thầm thay quyết định approved.
