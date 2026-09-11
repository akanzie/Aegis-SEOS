# Business Metrics: Chuẩn Hóa Phân Cấp User Flows Trọng Yếu (P0 - P4)

Tài liệu này chuẩn hóa thang phân cấp các luồng trải nghiệm người dùng trong toàn bộ hệ thống. Thang điểm này quyết định trực tiếp đến **Mức Độ Rủi Ro (Risk Level)** và phạm vi kiểm thử bắt buộc khi AI Agent hoặc Developer can thiệp vào mã nguồn.

---

## 1. Bảng Chuẩn Hóa Phân Cấp Mức Độ (P0 - P4)

| Cấp Độ | Tên Cấp Độ | Phạm Vi Điển Hình | Tác Động Khi Gặp Sự Cố | Mức Độ Rủi Ro Tự Động (Auto Risk) |
| :--- | :--- | :--- | :--- | :--- |
| **P0** | **System Survival** | - Xác thực, Đăng nhập, Session context<br>- Core Execution Loop<br>- Cổng thanh toán (Payment Gateway) | Hệ thống chết toàn phần hoặc mất kiểm soát bảo mật | **CRITICAL** (Yêu cầu review kỹ thuật cao nhất) |
| **P1** | **Revenue & Data Integrity** | - Thanh toán, Gia hạn gói, Xử lý giao dịch<br>- Đồng bộ CSDL, Data Persistence<br>- Master Data Seeding | Mất doanh thu trực tiếp hoặc sai lệch dữ liệu vĩnh viễn | **HIGH** (Bắt buộc full regression test) |
| **P2** | **Core Business** | - Luồng bài học, tiến trình luyện tập<br>- Tạo/sửa tài nguyên nghiệp vụ chính | Người dùng bị gián đoạn tính năng chính nhưng hệ thống còn hoạt động | **MEDIUM** (Cần unit + integration test) |
| **P3** | **Convenience** | - Tìm kiếm nâng cao, Bộ lọc phụ<br>- Xuất file CSV/PDF, Thông báo đẩy | Giảm tính tiện dụng, có phương án thay thế thủ công | **LOW** (Unit test cơ bản) |
| **P4** | **Nice to Have** | - Micro-animations, chỉnh chu CSS/Layout<br>- Sửa lỗi chính tả (Typo), Copywriting | Ảnh hưởng thẩm mỹ nhẹ, không đổi hành vi | **TRIVIAL** (Áp dụng Fast Track) |

---

## 2. Quy Tắc Nhạy Cảm Tự Động (Automated Risk Escalation)

Khi AI Agent thực hiện **Investigation Session** và xuất tài liệu `docs/tasks/**/task-N-fix.md`:

> [!IMPORTANT]
> **Quy tắc bất biến:**  
> Nếu task chạm vào bất kỳ file hoặc logic nào thuộc danh mục **P0 (System Survival)** hoặc **P1 (Revenue & Integrity)**:
> - **Metadata `risk_level`** BẮT BUỘC phải đặt là `HIGH` hoặc `CRITICAL`.
> - **Verification Plan** BẮT BUỘC phải bao gồm:
>   1. Kiểm thử đơn vị cho toàn bộ các edge cases.
>   2. Kiểm thử hồi quy tích hợp (Integration regression test).
>   3. Xác minh `npm run test:fitness` pass.
> - **Tuyệt đối CẤM áp dụng Fast Track** cho các thay đổi chạm vào luồng P0 hoặc P1.
