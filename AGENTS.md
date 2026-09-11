# AGENTS.md — Unified Operating Contract (Hiến Pháp Vận Hành AI-Native)

> **Tuyên ngôn cốt lõi (Core Philosophy):**  
> *"Tài liệu là hệ điều hành (Docs-as-an-OS), Code là kết quả phái sinh, Session AI là tiến trình độc lập và dùng một lần (Disposable Process)."*

Tài liệu này là Hiến pháp Vận hành (Canonical Operating Contract) tối cao và duy nhất dành cho mọi Developer và AI Agent hoạt động trong kho mã nguồn này. Các hướng dẫn chi tiết, quy trình SOP và tài liệu kỹ thuật chuyên sâu được phân quyền tại `docs/` theo Bản đồ Tra cứu (Mục 10).

---

## 0. Thứ Tự Ưu Tiên Giải Quyết Mâu Thuẫn (Hierarchy of Truth)

Khi phát hiện mâu thuẫn hoặc xung đột thông tin, AI Agent bắt buộc giải quyết theo thứ tự ưu tiên giảm dần:

1. **Safety, Security & Boundary Integrity**: An toàn hệ thống, bảo mật dữ liệu, quyền riêng tư, ranh giới kiến trúc (Mục 2 & Mục 6).
2. **Explicit Approved Developer Override**: Quyết định ghi đè nghiệp vụ rõ ràng của Developer trong prompt hiện tại.  
   *(Lưu ý: Tin nhắn chat thông thường chỉ ghi đè `fn` specs khi Dev tuyên bố rõ ràng đây là thay đổi nghiệp vụ; không tự ý suy diễn lời nói bóng gió để phá vỡ spec).*
3. **Approved Task Decisions (`docs/tasks/**/task-*-fix.md`)**: Các phân tích và quyết định đã được duyệt (`status: approved`).
4. **Functional Specifications (`docs/main_docs/<ACTIVE_VERSION>/fn/`)**: Nguồn sự thật cho logic nghiệp vụ (Business "WHAT").
5. **Project Memory (`docs/project-memory/`)**:
   - `rejected-solutions.md`: Các giải pháp đã bị bác bỏ (cấm đề xuất lại).
   - `known-pitfalls.md`: Các bẫy kỹ thuật đã được cảnh báo.
   - `technical-lessons.md`: Các bài học xương máu đã đúc kết.
6. **Acceptance Criteria (AC)**: Tiêu chí nghiệm thu được xác lập trong task active.
7. **Architecture & Standards (`docs/system-map/`, `docs/fitness-functions/`, `docs/standards/`)**: Ranh giới kiến trúc và chuẩn mực kỹ thuật (Technical "HOW").
8. **Existing Code Conventions**: Phong cách trình bày của module đang can thiệp.

*Nguyên tắc xử lý lệch pha:* Khi phát hiện code hoặc yêu cầu mâu thuẫn với `fn` specs, AI bắt buộc chỉ rõ điểm khác biệt và đề xuất cập nhật spec song song/trước khi sửa code. Tuyệt đối không âm thầm pha trộn hai nguồn mâu thuẫn.

---

## 1. 12 Nguyên Tắc Vận Hành Cốt Lõi (Core Principles)

1. **Nghĩ trước khi code (Think Before Coding)**: Nêu rõ giả định. Khi gặp mơ hồ về nghiệp vụ, dữ liệu, public API, security, hoặc thay đổi khó đảo ngược -> Bắt buộc hỏi Dev (Surface Ambiguity). Với quyết định kỹ thuật cục bộ ít rủi ro -> Chủ động chọn theo convention và ghi rõ giả định.
2. **Đơn giản là trên hết (Simplicity First)**: Viết lượng code tối thiểu cần thiết. Không viết speculative code, không tạo abstraction sớm khi chưa có yêu cầu.
3. **Can thiệp tối thiểu (Surgical Changes)**: Chỉ sửa đúng phạm vi task. Bắt buộc dọn sạch orphan do chính mình tạo ra. Dead code có sẵn ngoài scope chỉ ghi nhận vào task note, không tự ý xóa.
4. **Triển khai theo mục tiêu (Goal-Driven Execution)**: Xác định rõ AC và kịch bản verify trước khi gõ phím.
5. **Chỉ dùng AI cho việc cần phán đoán (Model for Judgment Only)**: Dùng AI cho phân loại, tóm tắt, trích xuất dữ liệu. KHÔNG dùng AI cho routing, retry logic, HTTP status codes hay deterministic business math.
6. **Quản lý Context & Nén thông tin (Token Discipline)**: Nguyên tắc: `Correctness > Safety > Đủ Context Verify > Tối ưu Token`. Sử dụng targeted search, đọc theo symbol/interface thay vì nạp cả file.
7. **Chỉ ra mâu thuẫn, không trung hòa (Surface Conflicts)**: Nêu rõ xung đột kiến trúc hoặc tài liệu, không tự ý trung hòa (compromise) ngầm.
8. **Đọc trước khi viết (Read Before Write)**: Trace callers, dependencies, exports và shared contracts trước khi sửa đổi file.
9. **Xác minh mục đích (Verify Intent)**: Kiểm thử TẠI SAO một hành vi lại quan trọng và bảo vệ invariants, không chỉ test kết quả tĩnh.
10. **Checkpoints theo Phase (Phase-level Checkpoints)**: Dừng lại báo cáo sau mỗi phase (soạn prompt -> xong điều tra -> xong thực thi). Tránh checkpoint vụn vặt sau mỗi lệnh đọc/grep.
11. **Nhất quán quan trọng hơn mới lạ (Convention Beats Novelty)**: Ưu tiên sự đồng nhất của toàn bộ codebase hơn việc áp dụng cú pháp hay thư viện mới lạ.
12. **Thất bại một cách tường minh (Fail Loud)**: Báo cáo rõ ràng mọi rủi ro và lỗi ngầm thay vì âm thầm bỏ qua hoặc giả định thành công.

---

## 2. An Toàn, Bảo Mật & Quy Chuẩn Git (Safety & Git Protocol)

### A. Quản Lý Bí Mật & Dữ Liệu Nhạy Cảm (Secrets & Data Privacy)
- **Cấm đọc/in secrets**: Tuyệt đối không đọc, ghi, in ra console/chat nội dung của `.env`, `.env.local`, `*.key`, `*.pem`, database credentials, JWT tokens.
- **Phạm vi cho phép**: Được phép đọc `.env.example`, tên biến môi trường và module schema validation (`src/lib/env.ts` hoặc `src/config/env.ts`).
- **Không log dữ liệu nhạy cảm**: Cấm log passwords, session tokens, cookies, auth headers hoặc PII thô (xem [docs/standards/observability.md](docs/standards/observability.md)).

### B. Thao Tác Phá Hủy Bị Cấm
- Cấm tự tiện chạy: `rm -rf`, `del /f /s /q`, `git reset --hard`, `git push --force`, `drop database`, format ổ đĩa hoặc các lệnh ghi đè không thể phục hồi.
- Khi cần thao tác rủi ro cao: Giải thích rõ lý do, đề xuất phương án sao lưu an toàn (backup/rename) và yêu cầu Developer duyệt.

### C. Quy Chuẩn Git An Toàn & Cam Kết Có Điều Kiện (Conditional Commit)
- **Cấm commit trực tiếp lên `main` / `master`**: Mọi công việc bắt buộc thực hiện trên branch riêng:
  - `task/<ten-task>`: Task theo yêu cầu tổng hợp.
  - `feat/<ten-tinh-nang>`: Tính năng mới.
  - `fix/<ten-loi>`: Sửa lỗi / bugfix.
  - `hotfix/<incident-code>`: Bản vá khẩn cấp cho sự cố production đã được xác nhận.
- **Tự động chuyển branch an toàn**: Trước khi code, kiểm tra `git branch --show-current`. Nếu đang ở `main`/`master`, tự động tạo và checkout branch mới theo format trên.
- **Bảo toàn Baseline Repository**: Nếu working tree đã có các thay đổi từ trước khi bắt đầu task, AI không được tự ý sửa, stash, reset hoặc commit các thay đổi đó. Phải ghi nhận baseline và bảo đảm không pha trộn chúng vào commit của task.
- **Cam Kết Có Điều Kiện (Conditional Commit)**: AI **chỉ được phép commit** khi thỏa mãn **TOÀN BỘ** các điều kiện sau:
  1. **Pre-commit working tree**: Working tree chỉ chứa các thay đổi thuộc phạm vi task; không chứa file rác, file `.env`, credentials hoặc thay đổi ngoài scope.
  2. **Automated tests pass**: Toàn bộ automated tests liên quan đều PASS (`npm test` nếu có test runner).
  3. **Architecture fitness pass**: Máy chấm kiến trúc PASS với Exit code 0 (`npm run test:fitness`).
  4. **No open assumptions**: Không còn giả định mở (open assumptions) hay xung đột chưa giải quyết.
  5. **Valid task branch**: Đang ở trên task branch hợp lệ (`task/*`, `feat/*`, `fix/*`, hoặc `hotfix/*`), tuyệt đối không phải `main`/`master`.
  6. **Post-commit clean tree**: Sau khi commit, `git status --short` phải không còn thay đổi chưa được xử lý thuộc phạm vi task.
- **Phạm vi áp dụng Commit**: Chỉ thực hiện commit nếu task tạo ra thay đổi cần lưu trữ vào repository. Các task read-only hoặc investigation thuần túy không tạo commit.
- **Giới hạn Git**: AI được phép tạo branch và commit cục bộ; **tuyệt đối không tự ý push, rebase, stash, reset hoặc xóa branch** trừ khi Developer yêu cầu đích danh.

### D. Quy Chuẩn Trình Bày & Đường Dẫn
- **Cấm LaTeX / MathJax phức tạp**: Không dùng `$...$`, `$$...$$`, `\approx`, `\ge`, `\le`, `\rightarrow`. Dùng text thuần hoặc ký tự Unicode chuẩn (`~`, `>=`, `<=`, `->`, `→`) để tránh vỡ giao diện Git/IDE preview.
- **Đường dẫn tương đối**: Luôn dùng relative path từ thư mục gốc của repository (ví dụ: `src/domain/user.ts`, `docs/tasks/task-1-fix.md`). Cấm hardcode absolute path máy cá nhân.

---

## 3. Quy Trình Vận Hành: Standard vs Fast Track

### A. Quy Trình Chuẩn (Standard 3-Step Path)
Áp dụng cho mọi tính năng mới, thay đổi nghiệp vụ, sửa lỗi phức tạp, đụng chạm schema/DB, đa module hoặc luồng rủi ro cao:
```
[BƯỚC 1: SOẠN BATCH PROMPT]  ──▶  [BƯỚC 2: SESSION ĐIỀU TRA]  ──▶  [BƯỚC 3: SESSION THỰC THI]
  Tạo 1 file prompt tập trung      Trace code, đánh giá Spec Impact     Kiểm tra approved -> Sửa spec
  tại docs/tasks/<request>.md       Xuất task-N-fix.md (status: draft)   Sửa code phẫu thuật -> Run fitness
  Không sửa code sớm.              Dev duyệt -> status: approved        Conditional Commit trên task branch
```

### B. Luồng Nhanh (Fast Track) & Rào Chắn Dừng Khẩn Cấp (Hard Stop)
- **Phạm vi áp dụng**:
  - Sửa lỗi chính tả (typo), cập nhật markdown docs, viết comment, format code.
  - Chỉnh sửa CSS thuần túy không thay đổi cấu trúc DOM / layout tree.
  - Viết bổ sung Unit test thuần túy không sửa logic runtime.
  - Task read-only: Giải thích kiến trúc, trace code, review logic.
- **Chu trình Fast Track**: `Điều tra nhanh -> Sửa code -> Chạy test & npm run test:fitness -> Nghiệm thu Fast Track DoD -> Conditional Commit (nếu có thay đổi mã nguồn)`.
- **RÀO CHẮN DỪNG KHẨN CẤP (FAST TRACK HARD STOP)**:
  > [!CAUTION]
  > Fast Track **lập tức vô hiệu lực** nếu phát sinh bất kỳ yếu tố nào sau đây (bắt buộc quay lại Quy trình Chuẩn 3 bước):
  > 1. Thay đổi Public API contracts hoặc Route signatures.
  > 2. Đụng chạm Schema Database, migrations, hoặc dữ liệu seed.
  > 3. Thay đổi logic Authentication hoặc Authorization.
  > 4. Thay đổi logic nghiệp vụ (Business logic runtime).
  > 5. Chạm vào bất kỳ thành phần nào thuộc luồng **P0** hoặc **P1** (dựa trên blast radius).

---

## 4. Điểm Dừng Báo Cáo & Leo Thang Quyết Định (Escalation Triggers)

AI Agent bắt buộc **DỪNG LẠI NGAY LẬP TỨC**, không tự ý đoán hoặc tự ra quyết định, phải báo cáo Developer khi gặp:
1. **Spec & Code Conflict**: Phát hiện mâu thuẫn sâu sắc giữa spec `fn` và code hiện hành.
2. **Ambiguous Business Logic**: Có từ 2 cách diễn giải nghiệp vụ hợp lý trở lên nhưng tài liệu chưa nêu rõ.
3. **Migration Uncertainty**: Kịch bản migration dữ liệu chưa rõ tính tương thích ngược hoặc nguy cơ schema drift.
4. **Security / Privacy Exposure**: Phát hiện lỗ hổng bảo mật, leak secrets hoặc vi phạm Server Trust Boundary.
5. **Breaking API Changes**: Sửa đổi làm gãy contracts đang phục vụ client khác.
6. **Irreversible Operations**: Thao tác xóa cột, drop table, purge cache diện rộng không thể rollback an toàn tức thì.
7. **Architectural Trade-offs**: Phân vân kỹ thuật nền tảng (Queue vs Cron, Redis vs DB, Event-Driven vs Sync, chia module mới). Bắt buộc dừng lại, phân tích trade-offs và yêu cầu tạo ADR theo [docs/decisions/README.md](docs/decisions/README.md).

---

## 5. Tiêu Chuẩn Hoàn Tất (Definition of Done - DoD)

Một task chỉ được coi là hoàn tất (`status: completed`) khi đáp ứng **DoD profile tương ứng**:

### A. Standard DoD (Áp dụng cho Standard 3-Step Path)
1. **Approved Task**: Task plan (`task-*-fix.md` hoặc `task-*-feat.md`) đã được Developer duyệt (`status: approved`).
2. **Spec Synchronized**: Đặc tả nghiệp vụ (`docs/main_docs/<ACTIVE_VERSION>/fn/`) đã được cập nhật đồng bộ nếu có thay đổi hành vi (`Spec Impact: CHANGE/CLARIFICATION`).
3. **Automated Tests Pass**: Mọi test suites liên quan đều PASS (nếu dự án có cấu hình test runner).
4. **Architecture Fitness Pass**: Máy chấm `npm run test:fitness` thực thi thành công với Exit code 0.
5. **No Open Assumptions**: Toàn bộ giả định mở hoặc xung đột kiến trúc/nghiệp vụ đã được giải quyết triệt để.
6. **Documentation & Memory Updated**: Đã cập nhật ADR (nếu chạm trigger), pitfalls/lessons (nếu phát hiện bẫy mới).
7. **Clean Conditional Commit**: Commit cục bộ thành công trên task branch hợp lệ (`task/*`, `feat/*`, `fix/*`, hoặc `hotfix/*`), không sót file nhạy cảm hay file rác.

### B. Fast Track DoD (Áp dụng cho Fast Track Changes)
1. **Scope Validity**: Phạm vi thay đổi vẫn nằm trọn vẹn trong các trường hợp cho phép của Fast Track.
2. **No Hard Stop**: Không phát sinh bất kỳ điều kiện nào thuộc Fast Track Hard Stop.
3. **Minimal Surgical Diff**: Diff chỉ chứa thay đổi tối thiểu cần thiết cho task.
4. **Verification Pass**: Các kiểm tra phù hợp với loại thay đổi đã PASS (format, lint, unit tests liên quan).
5. **Architecture Fitness Pass**: Máy chấm `npm run test:fitness` PASS với Exit code 0 nếu script tồn tại và thay đổi có khả năng chạm vào source code hoặc ranh giới kiến trúc.
6. **No Open Assumptions**: Không còn giả định mở hoặc xung đột chưa được giải quyết.
7. **Conditional Commit**: Commit cục bộ trên task branch hợp lệ nếu task tạo ra thay đổi cần lưu trữ vào kho mã nguồn.

### C. Phân Định Kết Quả Theo Vòng Đời Task (Lifecycle Outputs)
- **Investigation Session**: Hoàn tất khi tài liệu phân tích `task-N-fix.md` hoặc `task-N-feat.md` được tạo với `status: draft`. Không yêu cầu commit code.
- **Execution Task**: Hoàn tất khi đáp ứng Standard DoD (hoặc Fast Track DoD tương ứng).
- **Read-only Task**: Hoàn tất khi báo cáo, phân tích và bằng chứng xác minh đã được cung cấp (không tạo commit code).

---

## 6. Ranh Giới Kiến Trúc & Phân Định Kiểm Định (Architectural Invariants)

Nguồn sự thật chuẩn hóa cho các quy tắc kiến trúc được quy định tại [docs/fitness-functions/architecture-rules.md](docs/fitness-functions/architecture-rules.md), bao gồm hai nhóm cơ chế kiểm tra:

### A. Machine-Enforced Invariants (Máy Chấm Tự Động Qua `npm run test:fitness`)
1. **Domain Purity (`src/domain/`)**: Logic nghiệp vụ thuần khiết, cấm import DB, ORMs, Web frameworks, Network clients, UI components.
2. **Client/Server Isolation (`'use client'`)**: Client components cấm import DB client, server secrets, server-only helpers.
3. **No Raw Env**: Cấm gọi trực tiếp `process.env.*` rải rác; bắt buộc import qua schema validation tập trung (`src/lib/env.ts`).

### B. Review-Enforced Invariants (Kiểm Định Qua Investigation, Review & Preflight)
4. **Server Trust Boundary**: Mọi query DB phải scope theo `userId` từ session đã xác thực ở server; cấm tin cậy client params.
5. **Stateless Services & Repositories**: Service singletons cấm lưu `userId` hay request context trong biến instance (`this.*`).
6. **Expand-and-Contract Migrations**: Không bao giờ đổi tên hoặc drop cột cùng lúc; tuân thủ chu trình Expand -> Backfill -> Read Transition -> Contract.
7. **Performance Guardrails**: Cấm query danh sách không giới hạn (unbounded query), chỉ query cột cần thiết trên hot path, bắt buộc phân trang, chống N+1 (xem [docs/standards/performance.md](docs/standards/performance.md)).
8. **Idempotent Master Seeds**: Dữ liệu hạt giống phải có canonical identity key và upsert lũy đẳng.

---

## 7. Phân Cấp Luồng Trọng Yếu & Độ Nhạy Rủi Ro (Critical Flows P0 - P4)

| Mức Độ | Tên Luồng | Phạm Vi Điển Hình | Tác Động Khi Lỗi | Auto Risk & Ràng Buộc |
| :--- | :--- | :--- | :--- | :--- |
| **P0** | **System Survival** | Xác thực, session context, core execution loop, tính sẵn sàng & an toàn cổng thanh toán (Payment availability, webhook authenticity, unauthorized charge prevention) | Hệ thống tê liệt hoàn toàn hoặc mất kiểm soát bảo mật | **CRITICAL** (Cấm Fast Track, full regression test) |
| **P1** | **Revenue & Integrity** | Toàn vẹn giao dịch thanh toán (Charging, renewal, refund, ledger updates, reconciliation, idempotency), đồng bộ CSDL, master data seeding | Mất doanh thu, sai lệch DB vĩnh viễn | **HIGH** (Cấm Fast Track, integration test bắt buộc) |
| **P2** | **Core Business** | Luồng bài học, tiến trình luyện tập chính, quản lý tài nguyên nghiệp vụ chính | Tính năng chính bị gián đoạn nhưng hệ thống còn hoạt động | **MEDIUM** (Unit + Integration test) |
| **P3** | **Convenience** | Tìm kiếm nâng cao, bộ lọc phụ, xuất file CSV/PDF, push notification | Giảm tính tiện dụng, có giải pháp thay thế | **LOW** (Unit test chuẩn) |
| **P4** | **Nice to Have** | UI polish, CSS, typo, micro-copy | Thẩm mỹ, không đổi hành vi | **TRIVIAL** (Được dùng Fast Track) |

> [!IMPORTANT]
> **Nguyên tắc ưu tiên mức rủi ro cao nhất (Tie-Breaking Rule):**  
> Nếu một luồng, tính năng hoặc tác vụ đồng thời chạm vào nhiều cấp độ, bắt buộc áp dụng cấp độ rủi ro cao nhất (**P0 > P1 > P2 > P3 > P4**).

*Luật nâng rủi ro theo tác động (Impact-Based Risk Escalation):*  
Rủi ro được phân loại theo hành vi và bán kính tác động (blast radius), không chỉ theo vị trí file. Một task được tự động nâng lên `risk_level: HIGH` hoặc `CRITICAL` nếu thay đổi có thể ảnh hưởng trực tiếp hoặc gián tiếp đến invariant, contract hoặc runtime execution của luồng **P0 / P1**, bắt buộc tuân thủ Standard 3-Step Path.

---

## 8. Quản Lý Ngân Sách Ngữ Cảnh & Context Packages (Context Budget)

Mỗi session AI là một tiến trình dùng một lần. Giữ context tinh gọn để chống ảo giác:

| Mức Độ | Ngưỡng Token | Áp Dụng Cho |
| :--- | :--- | :--- |
| **Low** | <= 10k tokens | Fast Track, sửa typo, cập nhật docs, viết unit test đơn |
| **Medium** | <= 30k tokens | Investigation session, phân tích 1 task độc lập, audit file |
| **High** | <= 60k tokens | Execution session liên quan nhiều module, refactor tầng |
| **Critical** | > 60k tokens | **Cảnh báo**: Cần ngắt session hoặc bẻ nhỏ task thành các sub-tasks |

**Quy Tắc Context Packages (`docs/context-packages/`):**
- Trước khi thực hiện task, AI bắt buộc tìm và nạp Context Package tương ứng (ví dụ: `auth-context.md`).
- **Load Minimum**: Chỉ nạp danh sách files được liệt kê trong mục `Must Load`.
- **Zero Cross-Loading**: Tuyệt đối **CẤM nạp các package không liên quan** (Ví dụ: Đang làm Auth thì CẤM nạp Billing, Media, Analytics).

---

## 9. Vòng Đời Tri Thức & Quy Tắc Lưu Trữ (Knowledge Lifecycle)

Để ngăn ngừa việc sau 2-5 năm kho tri thức biến thành "bãi rác tài liệu" (Document Cemetery/Junkyard), toàn bộ dự án tuân thủ [docs/governance/knowledge-lifecycle.md](docs/governance/knowledge-lifecycle.md):

1. **Completed Tasks (`docs/tasks/**`)**: Sau **6 tháng** hoàn thành -> chuyển vào `docs/archive/tasks/<YYYY>/`.
2. **Resolved Incidents (`docs/engineering-incidents/**`)**: Sau **12 tháng** -> chắt lọc bài học vào `known-pitfalls.md` hoặc `technical-lessons.md` rồi chuyển vào `docs/archive/incidents/<YYYY>/`.
3. **Superseded ADRs (`docs/decisions/**`)**: Không bao giờ xóa; cập nhật trạng thái `Superseded by ADR-XXXX` và trỏ link sang ADR mới.
4. **Quy Tắc Cấm Nạp Archive (Zero-Archive In Context)**: AI Agent tuyệt đối **KHÔNG** được tự ý nạp tài liệu từ thư mục `docs/archive/**` vào context session trừ khi Developer yêu cầu tra cứu lịch sử cụ thể.

---

## 10. Bản Đồ Tra Cứu Theo Nhu Cầu (On-Demand Routing Map)

Khi cần tra cứu sâu, AI truy cập các điểm neo tương ứng (không nạp toàn bộ vào một lần):

| Lĩnh Vực | Nguồn Sự Thật Cần Tra Cứu |
| :--- | :--- |
| **Cẩm Nang & Bootstrap** | [docs/HOW_WE_WORK.md](docs/HOW_WE_WORK.md) (Hướng dẫn toàn diện SEOS) |
| **10 Điều Bất Biến (One-Pager)**| [docs/operations/quick-checklist.md](docs/operations/quick-checklist.md) |
| **Kiểm Định Trước Release** | [docs/operations/preflight-checklist.md](docs/operations/preflight-checklist.md) |
| **Đặc Tả Nghiệp Vụ ("WHAT")** | `docs/main_docs/<ACTIVE_VERSION>/fn/*.md` |
| **Ranh Giới Phân Tầng & Luồng Sống Còn** | `docs/system-map/modules.md`, `dependencies.md`, `critical-paths.md` |
| **SOP Tác Chiến (Playbooks)** | `docs/playbooks/` (bug-investigation, feature-dev, db-migration, incident) |
| **Máy Chấm Tự Động (Fitness)** | [docs/fitness-functions/architecture-rules.md](docs/fitness-functions/architecture-rules.md), [ci-enforcement.md](docs/fitness-functions/ci-enforcement.md) |
| **Ký Ức Kỹ Thuật (Memory)** | `docs/project-memory/` (known-pitfalls, rejected-solutions, technical-lessons) |
| **Quy Chuẩn Code & Tiêu Chuẩn Kỹ Thuật** | `docs/standards/` ([observability.md](docs/standards/observability.md), [performance.md](docs/standards/performance.md), README) |
| **Quyết Định Kiến Trúc (ADR)** | [docs/decisions/README.md](docs/decisions/README.md) (Quy chế & 5 Mandatory Triggers) |
| **Vòng Đời Tài Liệu (Governance)**| [docs/governance/knowledge-lifecycle.md](docs/governance/knowledge-lifecycle.md) |
