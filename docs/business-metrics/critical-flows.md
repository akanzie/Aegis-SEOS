# Business Metrics: Chuẩn Hóa Phân Cấp User Flows Trọng Yếu (P0 - P4)

Tài liệu này chuẩn hóa thang phân cấp các luồng trải nghiệm người dùng trong toàn bộ hệ thống. Thang điểm này quyết định trực tiếp đến **Mức Độ Rủi Ro (Risk Level)** và phạm vi kiểm thử bắt buộc khi AI Agent hoặc Developer can thiệp vào mã nguồn.

---

## 1. Bảng Chuẩn Hóa Phân Cấp Mức Độ (P0 - P4)

| Cấp Độ | Tên Cấp Độ | Phạm Vi Điển Hình | Tác Động Khi Gặp Sự Cố | Mức Độ Rủi Ro Tự Động (Auto Risk) |
| :--- | :--- | :--- | :--- | :--- |
| **P0** | **System Survival** | Xác thực, đăng nhập, session context; Core execution loop; Tính sẵn sàng & an toàn cổng thanh toán (Payment availability, webhook authenticity, unauthorized charge prevention) | Hệ thống tê liệt toàn phần hoặc vi phạm ranh giới bảo mật | **CRITICAL** (Yêu cầu review kỹ thuật cao nhất, cấm Fast Track) |
| **P1** | **Revenue & Data Integrity** | Toàn vẹn giao dịch thanh toán (Charging, renewal, refund, ledger updates, reconciliation, idempotency); Đồng bộ CSDL, data persistence; Master data seeding | Mất doanh thu trực tiếp hoặc sai lệch dữ liệu vĩnh viễn | **HIGH** (Bắt buộc full regression test, cấm Fast Track) |
| **P2** | **Core Business** | Luồng bài học, tiến trình luyện tập chính; Tạo/sửa tài nguyên nghiệp vụ chính của người dùng | Người dùng bị gián đoạn tính năng chính nhưng hệ thống vẫn duy trì hoạt động | **MEDIUM** (Cần unit + integration test) |
| **P3** | **Convenience** | Tìm kiếm nâng cao, bộ lọc phụ; Xuất file CSV/PDF, thông báo đẩy | Giảm tính tiện dụng, có phương án thay thế thủ công | **LOW** (Unit test cơ bản) |
| **P4** | **Nice to Have** | Micro-animations, tinh chỉnh CSS/layout; Sửa lỗi chính tả (typo), micro-copy | Ảnh hưởng thẩm mỹ nhẹ, không thay đổi hành vi | **TRIVIAL** (Được áp dụng Fast Track) |

> [!IMPORTANT]
> **Nguyên tắc ưu tiên mức rủi ro cao nhất (Tie-Breaking Rule):**  
> Nếu một luồng, tính năng hoặc tác vụ đồng thời chạm vào nhiều cấp độ, bắt buộc áp dụng cấp độ rủi ro cao nhất (**P0 > P1 > P2 > P3 > P4**).

---

## 2. Quy Tắc Nhạy Cảm Theo Tác Động (Impact-Based Risk Escalation)

Khi AI Agent thực hiện **Investigation Session** và xuất tài liệu `docs/tasks/**/task-N-fix.md`:

> [!IMPORTANT]
> **Phân loại rủi ro theo bán kính tác động (Blast Radius):**  
> Mức độ rủi ro không chỉ đánh giá dựa trên vị trí file mà căn cứ vào hành vi, invariants, shared contracts và runtime path.  
> Nếu một task có khả năng **ảnh hưởng trực tiếp hoặc gián tiếp** đến invariant, contract hoặc runtime execution của luồng **P0 (System Survival)** hoặc **P1 (Revenue & Integrity)**:
> - **Metadata `risk_level`** BẮT BUỘC phải đặt là `HIGH` hoặc `CRITICAL`.
> - **Verification Plan** BẮT BUỘC phải bao gồm:
>   1. Kiểm thử đầy đủ các invariants và edge-case classes đã xác định (boundary values, invalid input, empty/null states, concurrency, idempotency khi có liên quan).
>   2. Kiểm thử hồi quy tích hợp (Integration regression test).
>   3. Xác minh máy chấm kiến trúc `npm run test:fitness` trả về Exit code 0.
> - **Tuyệt đối CẤM áp dụng Fast Track** cho các thay đổi có blast radius thuộc luồng P0 hoặc P1.
