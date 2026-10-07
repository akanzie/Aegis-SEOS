# Verification Standard: Kiểm Chứng Và Bằng Chứng

## 1. Chọn kiểm tra theo dự án và blast radius

Đọc manifest, cấu hình test, CI và standards của dự án trước khi chọn lệnh. `npm test` và `npm run test:fitness` là lệnh tham chiếu của SEOS Node.js; stack khác phải khai báo lệnh tương đương trong project profile, không bịa script hoặc bỏ gate âm thầm.

| Thay đổi | Kiểm tra cần xem xét |
| :--- | :--- |
| Docs/format | Diff, link/format và tính nhất quán |
| Logic/runtime | Regression tái hiện lỗi, unit/integration theo risk, static checks |
| Types/build/config/dependencies | Typecheck/lint tương ứng, build nếu có ảnh hưởng compilation, packaging hoặc startup |
| Public contracts/schema | Compatibility, integration và migration/rollback theo scope |
| UI/interaction/media | Kiểm tra hành vi; visual, accessibility hoặc thiết bị thật khi cần |
| P0/P1 | Full regression hoặc integration bắt buộc theo AGENTS.md; không hạ gate vì môi trường thiếu |

Architecture fitness là gate bắt buộc khi áp dụng; nếu không có validator phù hợp phải báo thiếu gate và cấu hình trước khi tuyên bố đạt DoD yêu cầu gate đó. Không coi validator import là bằng chứng cho mọi invariant bảo mật.

## 2. Test bảo vệ ý định

- Test hành vi và invariants; bugfix nên có regression case thất bại với lỗi cũ khi khả thi.
- Mock external boundaries (DB/network/provider), không mock logic nghiệp vụ đang kiểm chứng để làm test pass.
- Bao phủ error paths, boundary values, concurrency/idempotency khi blast radius yêu cầu.
- Không sửa expectation để hợp thức hóa hành vi sai spec. Không tự khai báo coverage nếu chưa đo.

## 3. Ghi bằng chứng

Mỗi AC ánh xạ tới test/check/manual scenario và kết quả thực tế. Báo rõ `PASS`, `FAIL`, `SKIPPED`, `NOT_RUN`, `BLOCKED` hoặc `N/A` có lý do. Lỗi baseline ghi riêng với bằng chứng; không dùng nhãn baseline để miễn kiểm tra bắt buộc.

Bằng chứng gồm lệnh/kịch bản, exit code hoặc kết quả, môi trường, revision được kiểm tra và nơi lưu log/CI nếu có. Với thay đổi chưa commit, mô tả HEAD cùng diff được kiểm tra; sửa tiếp thì kiểm tra lại phần ảnh hưởng. Bằng chứng local không thay thế required CI checks trên commit bàn giao.

Chỉ chạy checks song song khi chúng không sửa cùng cấu hình, fixtures, build output hoặc database. Checks dùng tài nguyên chung chạy tuần tự hoặc trong môi trường riêng để tránh kết quả nhiễu.

Kiểm tra thủ công ghi người kiểm tra, môi trường/thiết bị, kịch bản và kết quả. Mục bắt buộc chưa thực hiện phải giữ pending; có thể bàn giao chờ kiểm tra nhưng không đánh dấu completed/merge-ready. Không chạy thao tác phá hủy hoặc kiểm tra production khi chưa được phép.
