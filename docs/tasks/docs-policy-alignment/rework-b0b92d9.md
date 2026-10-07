# Rework: Docs Policy Alignment Plans

- Mode / phase gốc: REWORK / INVESTIGATE.
- Review nguồn / artifact revision / baseline: Developer review `b0b92d9`, branch `task/docs-policy-alignment`.
- Approved scope / authority: Quyền sửa plan draft và investigation artifacts; không có quyền sửa canonical policy đích hoặc tự approve.

## 1. Ánh Xạ Findings

| Finding ID | Hành động / file:symbol | Bằng chứng verification | Trạng thái xử lý | Lý do còn mở |
| :--- | :--- | :--- | :--- | :--- |
| R01 | Thêm `findings-and-traceability.md` với F01–F24, evidence/authority table, `Finding → Task → AC → docs`; bỏ F08 khỏi Task 1 và sở hữu tại Task 2 | Coverage table: 24 IDs; Task 1/2/3 matrices; metadata vẫn draft | Pending re-review | Developer cần duyệt policy choices trước execution |
| R02 | Thêm `npm.cmd test` rồi `npm.cmd run test:fitness` thành required gate cho từng Standard task/conditional commit; thêm evidence row trong cả ba matrices | Theo `docs/operations/project-profile.md` §1, Windows PowerShell commands; results để NOT_RUN tới execution | Pending re-review | Checks chưa chạy trong phase REWORK |
| R03 | Định nghĩa ownership từng file theo traceability table; Task 1 cập nhật taxonomy và mọi direct summary cùng task, Task 2 owns workflow/lifecycle, Task 3 owns residual SOP/template/context references | Task 1 AC-1/2/3/5/6 và Task 3 AC-8 nêu same-task cross-reference boundary; dependency Task 3 sau Task 1/2 | Pending re-review | Approval của plan chưa có |
| R04 | Thêm bảng vị trí A → B → mâu thuẫn → authority → phương án với evidence cụ thể | Ví dụ P0/P2, P1 regression matrix, trust boundary, fitness applicability, approval/status đã đối chiếu với nguồn hiện hành | Pending re-review | Các policy đề xuất phải được Developer chốt/duyệt |
| R05 | Đổi Task 3 `critical_flow` thành P0 và `risk_level` thành CRITICAL; blast radius đã thống nhất cùng risk | P0 → CRITICAL theo AGENTS §7 và task-authoring risk mapping | Pending re-review | Không còn mismatch metadata trong artifact hiện tại |
| R03 follow-up | Đồng bộ ownership: Task 2 nhận AGENTS §0 approval semantics và HOW_WE_WORK approval/status summaries; Task 3 nhận task-authoring Spec Impact section, AGENTS §8 và context-package template; không giao các phần đó cho Task 1 | File ownership trong cả ba plans khớp bảng Finding → Task → AC; các section chia sẻ có task/dependency rõ | Pending re-review | Các task vẫn draft |
| R06 | Thay Open Issues chung bằng execution/approval transition model, actor/preconditions, independent review trigger/independence/authority và quyết định không có severity-based emergency bypass | Task 2 §5 có state transition table và reviewer rule; Task 3 §5 nêu Developer override/deploy boundary | Pending re-review | Các đề xuất quyền/gate cần reviewer chấp thuận trước approval |
| R07 | Thêm `docs/templates/task-feat.md` vào Task 2 scope và verification, cùng schema với fix-task template | Task 2 scope, AC-3 và verification matrix kiểm tra cả hai task templates | Pending re-review | Task 2 chưa approved |

## 2. Re-verification Và Bàn Giao

- Phần bị ảnh hưởng / regression liên quan: Bốn task artifacts trong `docs/tasks/docs-policy-alignment/`; không sửa tài liệu policy đích.
- Checks và manual scenarios: Kiểm tra coverage/ownership/gates bằng đọc diff và metadata. Không chạy tests trong REWORK; implementation gates được ghi NOT_RUN.
- Revision mới / baseline bảo toàn: Branch `task/docs-policy-alignment`; source review HEAD `b0b92d9`; các artifacts hiện là untracked và giữ nguyên scope.
- Open items / approval cần thêm / next authority: Developer review lại plan draft và quyết định policy choices tại Open Issues; không có execution approval.
- Kết luận: Chờ review lại artifact revision mới.
