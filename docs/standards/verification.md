# Verification Standard: Kiểm Chứng Và Bằng Chứng

## 1. Chọn kiểm tra theo dự án và blast radius

Đọc manifest, cấu hình test, CI và standards của dự án trước khi chọn lệnh. `npm test` và `npm run test:fitness` là lệnh tham chiếu của SEOS Node.js; stack khác phải khai báo lệnh tương đương trong project profile, không bịa script hoặc bỏ gate âm thầm.

Quyền và applicability của gates được định nghĩa duy nhất tại [AGENTS §5.D](../../AGENTS.md#quality-gate-applicability). Bảng dưới đây chọn checks theo diff; áp dụng thêm ma trận risk ở §1.A, không dùng bảng này để miễn gate Standard.

| Thay đổi | Kiểm tra cần xem xét |
| :--- | :--- |
| Docs/format | Diff, link/format và tính nhất quán |
| Logic/runtime | Regression tái hiện lỗi, unit/integration theo risk, static checks |
| Types/build/config/dependencies | Typecheck/lint tương ứng, build nếu có ảnh hưởng compilation, packaging hoặc startup |
| Public contracts/schema | Compatibility, integration và migration/rollback theo scope |
| UI/interaction/media | Kiểm tra hành vi; visual, accessibility hoặc thiết bị thật khi cần |
| P0/P1 | Áp dụng ma trận risk ở §1.A; không hạ gate vì môi trường thiếu |

Architecture fitness là gate bắt buộc khi áp dụng; nếu không có validator phù hợp phải báo thiếu gate và cấu hình trước khi tuyên bố đạt DoD yêu cầu gate đó. Không coi validator import là bằng chứng cho mọi invariant bảo mật.

<a id="risk-test-matrix"></a>
### 1.A. Ma Trận Kiểm Thử Theo Risk (Canonical)

Phân loại theo [Critical Flows](../operations/critical-flows.md). Các hàng dưới đây quy định kiểm thử hành vi runtime trong blast radius, cộng với checks theo loại diff và gate applicability của AGENTS.

| Flow / risk | Kiểm thử bắt buộc trong phạm vi ảnh hưởng |
| :--- | :--- |
| P0 / CRITICAL | Unit cho logic/invariants liên quan, integration regression và full flow regression; tất cả automated/integration/manual checks của impacted critical flow và invariants của nó |
| P1 / HIGH | Unit cho logic/invariants liên quan và integration regression; bao phủ các invariant/edge-case classes bị ảnh hưởng, concurrency/idempotency khi liên quan; manual checks khi scope yêu cầu |
| P2 / MEDIUM | Unit + integration cho core business flow bị ảnh hưởng; manual checks khi scope yêu cầu |
| P3 / LOW | Unit cho hành vi bị ảnh hưởng; bổ sung integration/manual checks khi diff/contract cần |
| P4 / TRIVIAL | Format/diff, docs links hoặc visual/manual checks phù hợp; automated tests khi hành vi/source bị ảnh hưởng |

**Full flow regression** là toàn bộ checks đã xác định cho critical flow bị ảnh hưởng và các invariants/dependencies của nó; không có nghĩa chạy mọi suite không liên quan trong repository. Shared contracts mở rộng blast radius thì phải mở rộng regression tương ứng. Full flow regression đã bao gồm integration, không thay thế nó. Verification plan phải liệt kê checks cụ thể và lý do coverage trước execution.

Với policy docs P0/P1 không sửa runtime: phải review toàn bộ owner/direct summaries liên quan, links/anchors, authority và các tình huống áp dụng gate/trust boundary. Runtime integration/manual flow checks có thể N/A nếu diff/profile chứng minh không có runtime tác động hoặc ứng dụng nghiệp vụ; vẫn chạy các automated suites liên quan đang có và fitness bắt buộc của Standard. Thiếu môi trường cho một flow runtime có thật là BLOCKED. Project profile ghi capability thực tế, không tự miễn gate.

## 2. Test bảo vệ ý định

- Test hành vi và invariants; bugfix nên có regression case thất bại với lỗi cũ khi khả thi.
- Mock external boundaries (DB/network/provider), không mock logic nghiệp vụ đang kiểm chứng để làm test pass.
- Bao phủ error paths, boundary values, concurrency/idempotency khi blast radius yêu cầu.
- Không sửa expectation để hợp thức hóa hành vi sai spec. Không tự khai báo coverage nếu chưa đo.
- Không che lỗi để đạt PASS: cấm xóa/bỏ qua test liên quan, `.only`, giảm test discovery/coverage, thêm validator exclusion/suppression không được hỗ trợ, hoặc fallback âm thầm. Mọi ngoại lệ phải được authority duyệt đúng scope và nêu replacement evidence; reviewer kiểm tra test/gate changes cùng production changes.

## 3. Ghi bằng chứng

Mỗi AC ánh xạ tới test/check/manual scenario và kết quả thực tế. Báo rõ `PASS`, `FAIL`, `SKIPPED`, `NOT_RUN`, `BLOCKED` hoặc `N/A` có lý do. Lỗi baseline ghi riêng với bằng chứng; không dùng nhãn baseline để miễn kiểm tra bắt buộc.

Bằng chứng gồm lệnh/kịch bản, exit code hoặc kết quả, môi trường, revision được kiểm tra và nơi lưu log/CI nếu có. Với thay đổi chưa commit, mô tả HEAD cùng diff được kiểm tra; sửa tiếp thì kiểm tra lại phần ảnh hưởng. Bằng chứng local không thay thế required CI checks trên commit bàn giao.

Chỉ chạy checks song song khi chúng không sửa cùng cấu hình, fixtures, build output hoặc database. Checks dùng tài nguyên chung chạy tuần tự hoặc trong môi trường riêng để tránh kết quả nhiễu.

Kiểm tra thủ công ghi người kiểm tra, môi trường/thiết bị, kịch bản và kết quả. Mục bắt buộc chưa thực hiện phải giữ pending; có thể bàn giao chờ kiểm tra nhưng không đánh dấu completed/merge-ready. Không chạy thao tác phá hủy hoặc kiểm tra production khi chưa được phép.
