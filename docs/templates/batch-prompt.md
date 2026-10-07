# Yêu Cầu Điều Tra: [Tên yêu cầu]

- Mode: COMPOSE; session tiếp theo là INVESTIGATE.
- Người yêu cầu / ngày: [Developer / YYYY-MM-DD].
- Ticket hoặc yêu cầu gốc: [Nguồn có thể truy vết].

## 1. Intent Và Hiện Trạng

- FACT: [Hành vi thực tế, điều kiện tái hiện và bằng chứng đã làm sạch].
- REQUIREMENT: [Kết quả mong muốn và lý do].
- ASSUMPTION: [Điều cần xác minh; không coi là requirement].
- OPEN QUESTION: [Quyết định còn thiếu và người có quyền quyết định].

## 2. Phạm Vi Và Ràng Buộc

- In scope / out of scope: [Phạm vi được yêu cầu].
- Invariants phải bảo toàn: [Nghiệp vụ, security, compatibility liên quan].
- Critical flow / risk: [Chưa xác minh hoặc P0–P4 / mức risk có bằng chứng].
- Dependencies: [Kết quả tiền đề hoặc không có].

## 3. Acceptance Criteria

| AC | Điều kiện | Kết quả quan sát được / pass-fail | Ý định kiểm chứng |
| :--- | :--- | :--- | :--- |
| AC-1 | [Khi ...] | [Thì ...] | [AUTOMATED_TEST / STATIC_CHECK / E2E / MANUAL] |

## 4. Đầu Ra Điều Tra

Trace spec active, code, callers/contracts và tests thực tế; không đoán root cause hoặc đường dẫn. Tạo `task-N-fix.md` hoặc `task-N-feat.md` với `status: draft`, Spec Impact, scope, test matrix và Open Issues. Chia task theo kết quả nghiệm thu độc lập, ghi `depends_on` khi cần.

Chưa sửa runtime hoặc tự approve plan. Nếu gặp conflict, security exposure hoặc trade-off kiến trúc, báo Developer và chỉ tiếp tục khảo sát độc lập an toàn.
