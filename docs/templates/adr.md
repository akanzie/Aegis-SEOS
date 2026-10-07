---
adr_id: ADR-XXXX
title: "[Tiêu đề quyết định]"
status: proposed
decision_owner: "[Developer hoặc Tech Lead]"
date: YYYY-MM-DD
supersedes: null
superseded_by: null
---

# ADR-XXXX: [Tiêu đề quyết định]

## 1. Context

[Vấn đề, constraints, bằng chứng và mandatory trigger; liên kết task/spec/system map liên quan.]

## 2. Options Và Đề Xuất Decision

| Phương án | Lợi ích | Chi phí / rủi ro / compatibility |
| :--- | :--- | :--- |
| [Phương án] | [Bằng chứng] | [Trade-offs] |

[Đề xuất tối thiểu và lý do; chưa phải quyết định accepted.]

## 3. Consequences Và Recovery

- Tác động tích cực / đánh đổi: [Thông tin].
- Module boundaries / public contracts / dữ liệu bị ảnh hưởng: [Thông tin].
- Rollout / verification / rollback: [Khi áp dụng].

## 4. Approval Và Lifecycle

- Owner approval / thời điểm / revision: [Chờ phê duyệt].
- AI chỉ khởi tạo `proposed`; chỉ chuyển `accepted` khi owner/Developer approve rõ ràng.
- Khi superseded, giữ ADR cũ, ghi `superseded_by` và liên kết ADR thay thế; không xóa.
