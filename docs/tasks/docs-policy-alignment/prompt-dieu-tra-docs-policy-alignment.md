# Yêu Cầu Điều Tra: Đồng Bộ Policy Và Tài Liệu SEOS

- Mode: COMPOSE; session tiếp theo là INVESTIGATE.
- Người yêu cầu / ngày: Developer / 2026-10-07.
- Ticket hoặc yêu cầu gốc: Yêu cầu chat “fix hết luôn” kèm findings F01–F24.

## 1. Intent Và Hiện Trạng

- FACT: Audit cấu trúc/tính nhất quán tài liệu hiện hành nêu 24 findings F01–F24. Nội dung lưu bền vững, gồm vị trí, mâu thuẫn, hướng xử lý và bảng `Finding → Task → AC → tài liệu`, nằm tại [findings-and-traceability.md](findings-and-traceability.md); không phụ thuộc session chat.
- FACT: Kiểm tra ban đầu xác nhận các ví dụ mâu thuẫn ở workflow, quick checklist, CI enforcement, system map, critical flows, trust-boundary rule, task lifecycle, handoff, context package và các trang README/HOW_WE_WORK.
- REQUIREMENT: Xử lý đủ F01–F24, giữ nguyên ý định của đề xuất, tạo một nguồn chuẩn cho mỗi policy và đồng bộ mọi tài liệu dẫn chiếu.
- ASSUMPTION: Có thể chia implementation thành các task theo kết quả nghiệm thu độc lập, với tài liệu nguồn chuẩn trước và tài liệu dẫn chiếu sau.
- OPEN QUESTION: Các lựa chọn policy về risk/test matrix, đóng task, reviewer độc lập và overflow budget phải được Developer duyệt trong task plan trước execution.

## 2. Phạm Vi Và Ràng Buộc

- In scope: Tài liệu Markdown hiện hành trong root và `docs/`, bao gồm AGENTS, workflow/operations, task-authoring/tasks/templates, risk/architecture/fitness, README/HOW_WE_WORK, playbooks, context packages, memory và governance có liên quan.
- Out of scope: Runtime code, thay đổi nghiệp vụ sản phẩm, đọc/sửa `docs/archive/**`, push/merge/deploy.
- Invariants: AGENTS.md giữ authority về quyền và gate; không để bản tóm tắt tự nhận authority; approval của Developer tách khỏi việc agent tạo plan; không làm yếu security, P0/P1 hoặc conditional commit.
- Critical flow / risk: P0, CRITICAL — thay đổi diễn giải policy có thể ảnh hưởng gián tiếp tới quyền thực thi và gate của mọi flow.
- Dependencies: Các task implementation phải chờ plan được Developer duyệt; task đồng bộ tài liệu dẫn chiếu phụ thuộc các task chốt nguồn policy.

## 3. Acceptance Criteria

| AC | Điều kiện | Kết quả quan sát được / pass-fail | Ý định kiểm chứng |
| :--- | :--- | :--- | :--- |
| AC-1 | Khi rà soát các policy được nêu trong F01–F24 tại [findings-and-traceability.md](findings-and-traceability.md) | Mỗi finding được ánh xạ tới đúng một task owner, AC và tài liệu cần sửa; không có ID thiếu/trùng owner hoặc mâu thuẫn/authority kép trong phạm vi | STATIC_CHECK |
| AC-2 | Khi xác định căn cứ thực thi và quyền của từng mode/track | Standard, Fast Track, READ_ONLY, REVIEW, artifacts, escalation và approval có quyền, trigger và đường chuyển tiếp rõ ràng | STATIC_CHECK |
| AC-3 | Khi xác định quality gates theo task type/risk | Bảng canonical phân biệt bắt buộc, N/A có lý do và thiếu gate; mọi checklist/SOP dẫn chiếu bảng đó | STATIC_CHECK |
| AC-4 | Khi phân loại flow và query scope | Mỗi P0–P4 có định nghĩa không chồng lấn; trust boundary nêu rõ user/tenant, public/master/system-job scope và authority tương ứng | STATIC_CHECK |
| AC-5 | Khi đóng, tạm dừng, resume, đổi scope hoặc archive task | Approval, execution status, checkpoint, timestamps, evidence, task dependencies và links có lifecycle nhất quán; không chuyển task active vào archive | STATIC_CHECK |
| AC-6 | Khi tra cứu policy hoặc dùng tài liệu mẫu | Một routing/authority map chỉ rõ entry points theo phase; template đầy đủ có một nguồn; context package và token budget không lỗi thời hoặc mơ hồ | STATIC_CHECK |
| AC-7 | Khi kiểm tra thay đổi tài liệu cuối cùng | Diff chỉ gồm tài liệu hiện hành trong scope; Markdown links/anchors, thuật ngữ, cross-references và `git diff --check` đã được kiểm tra, không có archive/runtime changes | STATIC_CHECK |

## 4. Đầu Ra Điều Tra

Xác minh phạm vi từ các finding được cung cấp và policy hiện hành; lập task plans `task-N-fix.md` ở trạng thái `draft`, chia theo kết quả nghiệm thu có dependencies rõ ràng. Liệt kê Open Issues cần Developer quyết định. Chưa thực thi sửa đổi policy canonical, chưa tự approve plan.
