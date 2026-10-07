# Merge Review

Owner của gate 10 câu theo [AGENTS §3.C](../../AGENTS.md). Dùng [Review template](../templates/review.md) cho artifact; release checks ở [Preflight](preflight-checklist.md).

<a id="merge-review-gate"></a>


## Merge Review Gate: 10 Câu Hỏi Bắt Buộc Trước Merge

Khi nhận yêu cầu review hoặc merge PR/MR, phải trả lời đủ 10 câu dưới đây trước khi kết luận nhánh có thể merge vào `main`/`master`. Gate áp dụng cho cả Standard và Fast Track, bổ sung cho [Preflight release checks](preflight-checklist.md) khi áp dụng.

### Chuẩn Bị Phạm Vi & Bằng Chứng

- Ghi nhận PR/MR hoặc nhánh được yêu cầu, target branch, source HEAD SHA, target SHA và merge-base. Review toàn bộ diff từ merge-base tới source HEAD, đồng thời kiểm tra tương thích với target hiện tại và khả năng merge không conflict. Nếu chưa có target ref đủ mới để xác minh, ghi `UNVERIFIED`.
- Nạp Context Package đúng phạm vi và các file `Must Load`; nếu không có package tương ứng, ghi rõ và đọc tối thiểu tài liệu liên quan. Không nạp archive hoặc package ngoài phạm vi.
- Xác định ticket/yêu cầu gốc, approved task (nếu Standard), AC và spec active theo Hierarchy of Truth trong `AGENTS.md`. Prompt triển khai chỉ là đầu vào hỗ trợ, không thay thế ticket/spec. Thiếu nguồn nghiệm thu cần thiết thì ghi `UNVERIFIED`.
- Trace callers, dependencies, exports và shared contracts của phần thay đổi; ghi nhận blast radius và áp dụng mức P0–P4 cao nhất. Bảo toàn working tree baseline, không tự ý sửa code trong session review.

### 10 Câu Hỏi & Tiêu Chí Trả Lời

| # | Câu hỏi bắt buộc | Kiểm tra và bằng chứng cần ghi |
| :--- | :--- | :--- |
| 1 | **Code có thực sự giải quyết đúng yêu cầu ban đầu không?** | Ánh xạ từng yêu cầu/AC từ ticket, approved task và spec gốc sang code và kịch bản verify. Chỉ ra phần thiếu, diễn giải lệch hoặc Spec Impact chưa đồng bộ. |
| 2 | **Có API, hàm, thư viện hay package nào là “bịa” không?** | Xác minh import, export, method, tham số và dependency version trong phạm vi thay đổi bằng implementation/type definitions thực tế, manifest/lockfile và tài liệu chính thức đúng phiên bản khi cần. Không suy ra API tồn tại chỉ vì code trông hợp lý. |
| 3 | **Code có đi đúng convention và kiến trúc hiện có không?** | So sánh tên, vị trí file, error handling, logging và layer separation với module hiện có cùng standards/system-map. Ghi kết quả fitness và review các invariants máy không kiểm tra được. |
| 4 | **Có xử lý đủ edge case và error path không?** | Kiểm tra null/undefined, empty, input sai, boundary values, timeout, lỗi mạng, retry, race condition, idempotency và dữ liệu lớn theo phạm vi. Ghi hành vi mong đợi và bằng chứng test hoặc trace cho các nhánh lỗi liên quan. |
| 5 | **Có lỗ hổng bảo mật nào không?** | Kiểm tra SQL injection, XSS, authN/authZ, server session scope, input validation, secret/token và logging dữ liệu nhạy cảm; kiểm tra dependency liên quan với nguồn advisory hiện hành. Không đọc/in secrets; bằng chứng phải được làm sạch. Không khẳng định an toàn khi chưa xác minh. |
| 6 | **Test có thực sự kiểm tra hành vi, hay chỉ để “pass”?** | Đối chiếu test với yêu cầu/invariant; đánh giá mock quá nhiều, assert lỏng, test lặp logic implementation và việc sửa test để khớp hành vi sai. Nêu cụ thể lỗi nào sẽ làm test fail; với bugfix, cung cấp regression case tái hiện lỗi cũ khi khả thi. |
| 7 | **Có thay đổi ngoài phạm vi hoặc ảnh hưởng ngầm đến phần khác không?** | Review toàn bộ diff, refactor/xóa code, signatures, config, migrations và callers của module dùng chung. Liệt kê thay đổi ngoài ticket và tác động tương thích; không tự ý dọn dead code ngoài scope. |
| 8 | **Có vấn đề về hiệu năng hoặc tài nguyên không?** | Kiểm tra N+1, nested loops, unbounded queries, pagination, index, load dữ liệu vào bộ nhớ, memory/resource leaks và API calls lặp. Ghi giới hạn dữ liệu và bằng chứng query plan/đo đạc khi blast radius đòi hỏi. |
| 9 | **Code có đơn giản, dễ đọc và bảo trì được không?** | Đánh giá abstraction thừa, over-engineering, duplication, comment lệch logic và dead code do thay đổi tạo ra; so sánh với convention và phương án tối thiểu đáp ứng yêu cầu. |
| 10 | **Có thể rollback an toàn không, và đã chạy thử thật chưa?** | Ghi cách rollback code/config và tương thích dữ liệu; migration tuân thủ Expand-and-Contract, không mặc định revert code sẽ phục hồi dữ liệu. Đánh giá feature flag khi cần. Ghi build/lint/type-check/tests/fitness, CI đúng commit và manual smoke test luồng chính (người chạy, môi trường, kịch bản, kết quả). Không chạy thử phá hủy hoặc trên production khi chưa được cho phép. |

### Quy Tắc Kết Luận

- Mỗi câu phải có một trạng thái: `PASS` (đã kiểm tra, có bằng chứng), `FAIL` (có vấn đề), `UNVERIFIED` (thiếu bằng chứng/chưa chạy) hoặc `N/A` (không áp dụng, nêu lý do cụ thể). Không bỏ câu hỏi hoặc dùng `N/A` để che việc chưa kiểm tra.
- Bằng chứng gồm đường dẫn tương đối và dòng/symbol, ticket/spec/AC, lệnh và exit code, link CI gắn với commit hoặc kết quả chạy thử. Phân biệt rõ kết quả local với CI; kiểm tra chưa chạy không được tính là PASS. Script/CI/luồng runtime không tồn tại chỉ được ghi `N/A` nếu thực sự không áp dụng cho phạm vi, kèm cách verify phù hợp thay thế.
- Chỉ kết luận **ĐỦ ĐIỀU KIỆN MERGE** khi cả 10 câu đều `PASS` hoặc `N/A` hợp lệ, [Preflight checks](preflight-checklist.md) áp dụng đã đạt, không có merge conflict, blocker hoặc kiểm tra bắt buộc chưa xác minh. `FAIL`/`UNVERIFIED` dẫn tới **CHƯA ĐỦ ĐIỀU KIỆN MERGE**, kèm bước cần làm để giải quyết.
- Khi gặp escalation trigger trong `AGENTS.md`, dừng và báo Developer. Findings phải ghi mức độ, vị trí, tác động và hướng xử lý; không tự ý sửa nghiệp vụ để làm review pass.
- Kết luận chỉ có hiệu lực cho cặp source/target SHA đã review. Nếu một trong hai thay đổi, cập nhật diff, kiểm tra lại phần bị ảnh hưởng và bằng chứng liên quan trước khi merge. Review đạt không thay thế yêu cầu rõ ràng của Developer cho thao tác merge hoặc push.

### Báo Cáo Review

Dùng [Review template](../templates/review.md), là mẫu đầy đủ duy nhất. Báo cáo cần ghi source/target SHA, merge-base, nguồn nghiệm thu, scope/risk, kết quả và evidence cho đủ 10 câu, verification, findings/blockers và kết luận merge eligibility. Checklist này quy định gate; template giữ cấu trúc artifact.

---
