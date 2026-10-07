# Project Adoption: Áp Dụng SEOS Cho Mọi Dự Án

SEOS cung cấp lõi quy trình; project profile mô tả công nghệ và cách verify thực tế. Không đưa OpenClaw, framework, dịch vụ cloud hoặc luật nghiệp vụ riêng thành yêu cầu chung.

## 1. Khởi tạo hoặc tiếp nhận dự án

- Khảo sát repository trước: stack, scripts, CI, spec active, system map, baseline và quy tắc hiện có. Không ghi đè tài liệu/code chỉ để khớp template.
- Tạo/cập nhật `docs/operations/project-profile.md` từ bằng chứng thực tế: lệnh setup/test/fitness/static checks/build; môi trường local/test/staging/production; gate bắt buộc; các khả năng chưa có và cách bổ sung.
- Xác định sources of truth cho spec, schema, ORM, dữ liệu nguồn và generated artifacts; owner, quy trình generate/validate, lệnh chỉ dùng local và tác vụ cần approval.
- Lập critical flows, context packages đúng domain và commands tương đương cho stack hiện tại. Không tự cho phép thao tác remote hoặc deployment qua project profile.

## 2. Bổ sung standards khi có nhu cầu thực tế

Với state/cache/offline/background work, quy định nguồn dữ liệu chuẩn, lifecycle, isolation, retry/idempotency và recovery. Với UI/media quy định accessibility và platform/manual checks. Với release quy định required CI, environment boundary và rollback compatibility. Chỉ tạo các phần dự án sử dụng.

## 3. Kiểm tra docs còn đúng

Mỗi task xác minh đường dẫn, lệnh và API liên quan tồn tại; kiểm tra active version, approval và bằng chứng còn khớp revision. Khi đổi tooling/contracts cập nhật docs tham chiếu cùng task. Bootstrap và release kiểm tra links, source/generated ownership, gate local/CI và Context Package liên quan.

Tài liệu lỗi thời phải được sửa hoặc gắn trạng thái/nguồn thay thế; không làm theo ví dụ như thể đó là runtime đã được xác minh. Áp dụng knowledge-lifecycle.md cho lưu trữ; không nạp archive để lấp context thiếu.
