# Handoff: [Task / Session / PR]

## 1. What / Why Và Trạng Thái

- Yêu cầu / approved plan / spec: [Nguồn nghiệm thu].
- Kết quả / scope / Spec Impact: [Thay đổi và lý do].
- `approval_status`: [pending / approved / revoked].
- `approved_by` / `approved_at` / `approved_revision`: [Giá trị thực hoặc link evidence].
- Execution status: [not_started / in_progress / blocked / pending_verification / failed / cancelled / completed / superseded].
- `ready for review`: [Có / Không; nhãn handoff riêng, không phải execution status].
- `closed_at` / `merged_at`: [ISO timestamp hoặc null; merged_at chỉ sau merge thật].
- DoD profile: [Standard / Fast Track / investigation / read-only; evidence tương ứng].

## 2. Revision Và Baseline

- Branch / HEAD / diff đã kiểm tra: [Revision; chưa commit ghi rõ].
- PR source / target SHA: [Khi áp dụng].
- Baseline được bảo toàn / conditional commit: [Thông tin thực tế].

## 3. AC Evidence

| AC | Expected behavior | Verification | Result | Evidence / revision |
| :--- | :--- | :--- | :--- | :--- |
| AC-1 | [Điều kiện -> kết quả] | [Test/check/manual] | NOT_RUN | [Chưa có] |

Ghi lệnh, exit code, local/CI và revision; manual checks ghi người chạy, môi trường, scenario. Kết quả dùng PASS / FAIL / SKIPPED / NOT_RUN / BLOCKED / N/A có lý do. Task nhỏ có thể thay bảng bằng báo cáo ngắn tương xứng phạm vi.

## 4. Reviewer Attention / Open Items / Recovery

- Điểm cần xem kỹ và lý do: [File:symbol, nghiệp vụ/security/schema/contracts].
- Findings / manual checks / required CI còn mở: [IDs và trạng thái thật].
- Rủi ro / giới hạn / rollback: [Thông tin khi áp dụng].
- Independent review (nếu trigger): [Reviewer, independence basis, scope/revision, findings hoặc blocked chờ reviewer].
- Checkpoint session chưa xong: [Đã làm, bằng chứng, blocker và bước tiếp theo].

## 5. Next Authority

- Bước tiếp theo / người có quyền approve, merge hoặc deploy: [Thông tin; approval và authority riêng].
- `ready for review` không đồng nghĩa merge-ready. Chỉ tuyên bố completed khi đạt DoD; không chứa secrets, auth headers hoặc PII thô.
