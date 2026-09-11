# Project Memory: Bài Học Kỹ Thuật Đúc Kết (Technical Lessons)

Ghi nhận các bài học đúc kết sau các đợt refactor, xử lý lỗi và vận hành thực tế.

---

## 1. Docs-as-an-OS Giúp Loại Bỏ Ảo Giác AI Triệt Để
- **Bài học**: Khi ép AI Agent phải tuân thủ việc đọc context từ spec (`docs/main_docs/`), hệ thống giảm thiểu tới 90% lỗi phỏng đoán sai logic nghiệp vụ.
- **Áp dụng**: Không bao giờ để AI tự "đoán" hành vi nếu tài liệu chưa mô tả. Hãy dùng `Spec Impact: CLARIFICATION` để bổ sung tài liệu trước.

## 2. Máy Chấm Tự Động Rẻ Hơn Rất Nhiều So Với Code Review Thủ Công
- **Bài học**: Việc kiểm tra quy tắc "Domain không import DB" bằng mắt thường thường xuyên bị bỏ sót trong các PR gấp.
- **Áp dụng**: Đưa toàn bộ quy tắc ranh giới vào script `architecture-fitness.mjs` để máy kiểm tra trong 0.1 giây.

## 3. Quản Lý Git Theo Task Đảm Bảo Tính Hoàn Nguyên
- **Bài học**: Commit lộn xộn nhiều tính năng trên một branch khiến việc rollback khi có sự cố trở thành thảm họa.
- **Áp dụng**: Mỗi task có 1 branch riêng, 1 commit rõ ràng và chỉ merge khi vượt qua preflight checklist.
