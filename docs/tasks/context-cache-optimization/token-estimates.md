# Token Estimates — Docs Context

Baseline `f946c78`; nội dung UTF-8 đọc qua Python, newline chuẩn hóa để so cùng công thức `ký tự Unicode / 3`, làm tròn token gần nhất. Không dùng tokenizer của model; range tham khảo ký tự/4–ký tự/2, không dùng estimate chứng minh hard cap hoặc cache hit.

AGENTS: 26,969 → 12,761 ký tự; ~8,990 → ~4,254 token, giảm ~52.7%. Không đạt target gợi ý 2.5–3.5k: giữ đầy đủ bảng applicability và các điều kiện quyền/safety là ưu tiên. Target trong report là thiết kế dự kiến, không gate miễn policy.

Common four-file set (AGENTS + workflow + profile + ACTIVE_VERSION): ~13,908 → ~7,011 token, giảm ~49.6%. Đây chỉ là cùng tập file; execution/resume/review phải nạp thêm owner theo trigger. Không hiểu con số này là tổng cost của mọi Standard task. Detailed docs được chuyển sang on-demand, không xóa obligations hoặc giả định không cần đọc.

Task/evidence artifacts không thuộc prefix policy và bị loại khỏi bảng so sánh này. File mới không có baseline độc lập; đối chiếu source đã tách, không cộng tiết kiệm từng hàng chồng scope.

| File | Trước | Sau |
| :--- | ---: | ---: |
| `AGENTS.md` | 8990 | 4254 |
| `README.md` | 3096 | 536 |
| `docs/context-packages/docs-policy-context.md` | — (file mới) | 733 |
| `docs/context-packages/README.md` | 578 | 502 |
| `docs/context-packages/template.md` | 412 | 540 |
| `docs/context-packages/validator-context.md` | — (file mới) | 694 |
| `docs/governance/context-assembly.md` | — (file mới) | 1445 |
| `docs/governance/knowledge-lifecycle.md` | 1036 | 968 |
| `docs/HOW_WE_WORK.md` | 5162 | 211 |
| `docs/onboarding/bootstrap.md` | — (file mới) | 3306 |
| `docs/onboarding/human.md` | — (file mới) | 1721 |
| `docs/operations/agent-workflow.md` | 3602 | 1391 |
| `docs/operations/definition-of-done.md` | — (file mới) | 1142 |
| `docs/operations/handoff-contract.md` | 622 | 621 |
| `docs/operations/merge-review.md` | — (file mới) | 2080 |
| `docs/operations/preflight-checklist.md` | 2934 | 979 |
| `docs/operations/project-profile.md` | 1273 | 1324 |
| `docs/operations/quick-checklist.md` | 1888 | 728 |
| `docs/operations/review-rework.md` | — (file mới) | 850 |
| `docs/operations/task-lifecycle.md` | — (file mới) | 1725 |
| `docs/playbooks/feature-development.md` | 600 | 631 |
| `docs/project-memory/known-pitfalls.md` | 568 | 754 |
| `docs/task-authoring/README.md` | 1194 | 1212 |
| `docs/templates/batch-prompt.md` | 475 | 489 |
| `docs/templates/README.md` | 873 | 870 |
| `docs/templates/review.md` | 1019 | 1027 |
| `docs/templates/task-fix.md` | 1194 | 1206 |
