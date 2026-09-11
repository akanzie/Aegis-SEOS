# Tasks & Work In Progress

Thư mục này là trung tâm điều phối các yêu cầu công việc, batch prompts và task fixes:

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
3. **`status: completed`**: Sau khi code đã được sửa, test pass và commit thành công.
