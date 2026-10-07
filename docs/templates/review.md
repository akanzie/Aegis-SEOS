# Review: [Artifact / PR / MR]

- Mode: REVIEW (read-only).
- Scope: [Plan review / implementation review / merge review].
- Ticket / approved task / spec active / AC: [Nguồn nghiệm thu].
- Source branch / SHA: [Thông tin đã xác minh].
- Target branch / SHA / merge-base: [Khi review merge; target freshness chưa rõ ghi UNVERIFIED].
- Artifact revision / baseline / Context Package / risk: [Bằng chứng].

## 1. Findings

| ID | Mức độ | File:dòng / symbol | Bằng chứng và tác động | Hành động cần làm |
| :--- | :--- | :--- | :--- | :--- |
| F-001 | [Mức độ] | [Vị trí] | [Thông tin] | [Đề xuất trong scope] |

Nếu không có findings, ghi rõ phạm vi đã kiểm tra và giới hạn bằng chứng.

## 2. Merge Review Gate (Chỉ Khi Review / Merge PR hoặc MR)

Giữ đủ 10 câu khi áp dụng; với review artifact thuần túy, bỏ mục này và nêu lý do. Chi tiết bằng chứng theo `docs/operations/preflight-checklist.md`.

| # | Câu hỏi | Trạng thái | Trả lời và bằng chứng | Bước tiếp theo |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Giải quyết đúng yêu cầu gốc? | UNVERIFIED | [AC -> implementation/check] | [Việc cần làm] |
| 2 | API/hàm/package tồn tại và đúng phiên bản? | UNVERIFIED | [Implementation/types/manifest] | [Việc cần làm] |
| 3 | Đúng convention và kiến trúc? | UNVERIFIED | [Standards/fitness/invariants] | [Việc cần làm] |
| 4 | Đủ edge cases và error paths? | UNVERIFIED | [Trace/tests] | [Việc cần làm] |
| 5 | Có lỗ hổng bảo mật? | UNVERIFIED | [Trust boundary/validation/advisories khi liên quan] | [Việc cần làm] |
| 6 | Tests bảo vệ hành vi và ý định? | UNVERIFIED | [Regression/assert/mock] | [Việc cần làm] |
| 7 | Có thay đổi ngoài scope hoặc tác động ngầm? | UNVERIFIED | [Toàn bộ diff/callers/contracts] | [Việc cần làm] |
| 8 | Hiệu năng và tài nguyên phù hợp? | UNVERIFIED | [Giới hạn/query/đo đạc] | [Việc cần làm] |
| 9 | Đơn giản, dễ đọc và bảo trì? | UNVERIFIED | [Convention/diff] | [Việc cần làm] |
| 10 | Rollback an toàn và đã chạy thử thật? | UNVERIFIED | [Recovery/checks/manual/CI đúng SHA] | [Việc cần làm] |

Trạng thái gate: PASS / FAIL / UNVERIFIED / N/A có lý do. Chỉ kết luận đủ điều kiện merge khi cả 10 câu PASS hoặc N/A hợp lệ, checklist áp dụng đã đạt, không conflict/blocker/check bắt buộc chưa xác minh.

## 3. Verification Và Kết Luận

- Checks: [Lệnh, exit code, local/CI, revision và bằng chứng].
- Manual smoke test: [Người chạy, môi trường, scenario, kết quả hoặc pending/N/A có lý do].
- Kết luận: [Artifact cần rework / ready for review; với merge: CHƯA ĐỦ hoặc ĐỦ ĐIỀU KIỆN MERGE].
- Blockers / residual risks / authority: [Bước tiếp theo và người có quyền].

Kết luận chỉ có hiệu lực cho revision đã review. Source/target thay đổi phải kiểm tra lại phần ảnh hưởng. Reviewer chỉ approve khi Developer đã ủy quyền; review đạt không cấp quyền merge/push/deploy.
