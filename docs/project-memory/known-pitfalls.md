# Project Memory: Những Bẫy Kỹ Thuật Thường Gặp (Known Pitfalls & Gotchas)

Tài liệu này lưu lại các "hố bẫy" kỹ thuật đã gặp phải trong dự án để các Session AI và Dev sau không lặp lại sai lầm.

---

## 1. Lưu Trữ State Trong Singleton Service
- **Hiện tượng**: Khai báo thuộc tính người dùng hoặc request trong service class (`this.currentUserId = ...`).
- **Hậu quả**: Race condition nghiêm trọng giữa các request đồng thời, rò rỉ dữ liệu giữa các người dùng.
- **Biện pháp**: Luôn truyền `userId` và context qua tham số hàm (Stateless functions).

## 2. Hardcode Giá Trị Dữ Liệu Trong Code Thay Vì Dùng Seed
- **Hiện tượng**: Gán cứng ID hoặc options cố định trong TypeScript file thay vì lưu vào DB qua Seed Data.
- **Hậu quả**: Khi DB thay đổi ID hoặc cần bổ sung danh mục, code phải sửa và deploy lại.
- **Biện pháp**: Sử dụng Canonical Seeding với slug/code bất biến.

## 3. Quên Phân Trang (Pagination) Khi Query Danh Sách
- **Hiện tượng**: Sử dụng `findMany()` hoặc `SELECT *` không có `limit`/`take`.
- **Hậu quả**: Hệ thống chậm hoặc Out Of Memory khi lượng dữ liệu phình to trên Production.
- **Biện pháp**: Bắt buộc có default limit (ví dụ: `take: 50`) và cursor/offset pagination.
