# Context Assembly: Token Và Prefix Cache

Owner của thứ tự nạp, độ ổn định prefix và evidence token theo [AGENTS §8](../../AGENTS.md#context-budget). Không cấp quyền execute, giảm risk hoặc miễn gates. Nạp khi thiết kế/cập nhật context, package hoặc điều tra chi phí/cache.

## 1. Các lớp context

Luôn nạp AGENTS một lần. Chọn owner theo routing/package; không nạp README, onboarding, toàn bộ templates, memory hoặc task directory để bắt đầu task thường ngày. File đã có trong context không cần đọc lại nếu revision còn khớp; resume/compaction phải xác minh lại nguồn liên quan.

Khi kiểm soát request assembly, dùng thứ tự cố định:

| Thứ tự | Nội dung | Quy tắc |
| :--- | :--- | :--- |
| 1 | Instructions và tool schemas | Giữ thứ tự/settings ổn định trong workflow; chỉ bật tools cần thiết |
| 2 | AGENTS | Policy chung, không timestamp, task status hoặc repo HEAD |
| 3 | Policy theo phase | Chọn đúng owner; cùng tập files/sections dùng cùng thứ tự |
| 4 | Spec/contracts liên quan | Chỉ active version và blast radius đã xác minh |
| 5 | Memory liên quan | Chọn mục theo scope; không nạp cả memory dự phòng |
| 6 | Task và trạng thái dự án | Request, approval, profile, branch/revision/dependencies |
| 7 | Evidence biến động | Findings, logs, diff, next action và yêu cầu hiện tại |

Thứ tự chỉ áp dụng nội dung project kiểm soát; không giả định client cho phép đổi system/tools/messages của nền tảng. Đổi cấu trúc trên đĩa không tự đổi rendered context. Không hạ role instructions hoặc tách approval khỏi scope để tăng cache hit.

## 2. Progressive disclosure

Package catalog ghi scope, phase, verified/reference status và target. Must Load chỉ gồm file/section tối thiểu; Optional phải có trigger cụ thể. Đọc section bằng công cụ hỗ trợ range/symbol, hoặc tách file theo trigger độc lập; link anchor không làm output toàn file ngắn đi.

Request README trỏ plan/evidence hiện hành, dependencies và findings liên quan. Không sao chép toàn findings vào từng plan/handoff. Giữ records cũ để truy vết; archive chỉ theo [retention policy](knowledge-lifecycle.md), không sớm chỉ để tiết kiệm token.

## 3. Cập nhật docs

- AGENTS chỉ đổi khi policy/routing cần đổi. Status, SHA, timestamp, checks và changelog ở task/evidence, không ở đầu prefix chung.
- Giữ một owner cho mỗi rule; summary dùng ID/check/evidence/link. Thay rule phải cập nhật owner/direct summaries/links cùng task theo quyền/gates hiện hành.
- Gom chỉnh sửa thuần biên tập của prefix thành đợt khi phù hợp. Sửa lỗi safety/quyền/gate ngay theo workflow; không giữ policy sai hoặc trì hoãn spec vì cache.
- Khi kiểm soát assembly, chuẩn hóa UTF-8, Unicode và LF trước serialize; giữ cùng message boundaries/thứ tự. Checkout CRLF không tự chứng minh request khác/giống; fingerprint trên nội dung render thực tế.
- Có thể dùng version riêng cho bộ context/policy đã xác minh. Không dùng toàn repo HEAD, ngày hoặc task ID làm key của prefix chung; key không thay exact-prefix matching hay authority/revision checks.
- Không bắt buộc manifest/hash pipeline cho task thủ công. Automation mới cần task/quyền phù hợp.

## 4. Đo token và cache

Đo bằng tokenizer của model/provider khi có. Estimate từ ký tự phải ghi công thức/sai số; không dùng estimate để chứng minh hard cap đã đạt. Phân biệt kích thước file, context thực nạp và API token usage, gồm overhead messages/tools.

Khi có telemetry, ghi model/settings, input tokens, cached tokens, cache-write tokens nếu API hỗ trợ, độ dài/fingerprint prefix và latency. Không log raw prompt, secrets hoặc PII; fingerprint chỉ metadata được phép. So workload/cửa sổ retention tương đương; tính chi phí theo giá read/write/uncached của model, không cộng phần trăm tiết kiệm token và cache.

Cache tái sử dụng rendered prefix khớp chính xác; phần sau vị trí thay đổi không khớp cache cũ, phần trước có thể tái sử dụng ở boundary hợp lệ. Tools/settings/compaction cũng có thể đổi prefix. Sửa file chỉ ảnh hưởng khi bản mới được nạp. API hỗ trợ explicit breakpoints thì cân nhắc boundary sau phần tái sử dụng; không suy client hiện tại cho phép cấu hình đó. Minimum length, retention và giá tùy model/provider: [OpenAI Prompt Caching](https://developers.openai.com/api/docs/guides/prompt-caching).

Không có telemetry thì cache hit/cost là UNVERIFIED. Giảm token không chứng minh cache hit; cached content vẫn chiếm context.
