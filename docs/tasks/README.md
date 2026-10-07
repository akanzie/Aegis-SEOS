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

<a id="task-lifecycle"></a>
## Vòng Đời Của Một File Task (`task-N-fix.md` / `task-N-feat.md`)

Task có hai trạng thái độc lập:

- **Approval record**: `approval_status: pending | approved | revoked`; kèm `approved_by`, `approved_at`, `approved_revision`. Chỉ Developer hoặc reviewer được ủy quyền rõ ràng mới approve. Agent chỉ ghi nhận approval/revision nhận được.
- **Execution**: `execution_status: not_started | in_progress | blocked | pending_verification | failed | cancelled | completed | superseded`; kèm `closed_at` khi completed/cancelled/superseded và `merged_at` riêng khi merge thật.

Transition/actor/precondition canonical nằm trong [Task Lifecycle](../operations/task-lifecycle.md#lifecycle-transitions). Summary: chỉ bắt đầu Standard khi approval bao phủ revision/scope; giữ diff/evidence khi blocked/failed/cancelled/superseded; terminal state không chuyển ngược, mở lại qua task/rework riêng. `ready for review` là nhãn handoff, không phải execution status. Không suy ra approval từ status completed.

Đóng task theo [close sequence](../operations/task-lifecycle.md#close-sequence): AC/gates/review/handoff sẵn sàng trước conditional commit; xác nhận completed và `closed_at` sau commit/post-commit checks. Không bắt buộc một commit duy nhất. Handoff ghi revision/SHA có thể trỏ commit chứa evidence.

Retention clock, điều kiện archive theo request, và giữ request index/evidence links được quy định tại [Knowledge Lifecycle](../governance/knowledge-lifecycle.md). Trang này chỉ dẫn tới policy đó; `closed_at` là field của task lifecycle, còn `merged_at` chỉ ghi merge thật.

Metadata cũ `status: draft | approved | completed` chỉ là compatibility shorthand; đối chiếu approval evidence/revision trước resume. Không tự migrate baseline metadata. Findings/rework truy vết theo ID, không âm thầm thay quyết định được duyệt.
