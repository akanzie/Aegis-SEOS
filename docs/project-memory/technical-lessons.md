# Project Memory: Bài Học Kỹ Thuật Đúc Kết (Technical Lessons)

Ghi nhận các bài học có bằng chứng từ refactor, xử lý lỗi và vận hành thực tế. Không giữ tỷ lệ hiệu quả, runtime hoặc độ chính xác định lượng nếu không có benchmark có thể tái lập.

---

## 1. Docs-as-an-OS Giúp Loại Bỏ Ảo Giác AI Triệt Để
- **Bài học**: Đọc acceptance source trước khi thiết kế giúp phát hiện khoảng trống và tránh suy đoán hành vi chưa xác nhận.
- **Áp dụng**: Không suy ra hành vi còn thiếu từ code hoặc phỏng đoán. Phân loại `Spec Impact` theo định nghĩa canonical trong [Task Authoring](../task-authoring/README.md#spec-impact); thiếu mô tả tự nó không chứng minh behavior đã được xác nhận để chọn `CLARIFICATION`.

## 2. Máy Chấm Tự Động Rẻ Hơn Rất Nhiều So Với Code Review Thủ Công
- **Bài học**: Việc kiểm tra quy tắc "Domain không import DB" bằng mắt thường thường xuyên bị bỏ sót trong các PR gấp.
- **Áp dụng**: Tự động hóa các pattern có thể kiểm chứng, công bố rõ parser coverage/limitations, và giữ phần còn lại ở review-enforced invariants.

## 3. Quản Lý Git Theo Task Đảm Bảo Tính Hoàn Nguyên
- **Bài học**: Commit lộn xộn nhiều tính năng trên một branch khiến việc rollback khi có sự cố trở thành thảm họa.
- **Áp dụng**: Mỗi task dùng branch riêng và conditional commit theo DoD. Một hay nhiều commit phụ thuộc việc giữ scope/evidence sạch; merge chỉ theo authority và merge gate.
