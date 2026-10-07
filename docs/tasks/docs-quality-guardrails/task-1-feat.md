---
task_id: task-1
approval_status: approved
approved_revision: null
execution_status: not_started
closed_at: null
merged_at: null
critical_flow: P0
risk_level: CRITICAL
spec_impact: NONE
depends_on: []
created_by: Developer request, composed by agent
approved_by: null
approved_at: null
---

# Task 1: Make AI coding quality gates safer and verifiable

## 1. Acceptance Source

- Original request: Review the repository's operating docs for code quality and provide concrete improvements.
- Approved direction: The Developer replied “approve” to the review recommendations. This plan records the proposed implementation scope; approval applies only after the Developer approves this plan revision.
- Active business spec: `docs/main_docs/ACTIVE_VERSION.md` points to v1.0, status Initializing; no business spec applies to this governance task.
- Context: `docs/context-packages/docs-policy-context.md` and relevant owners in `AGENTS.md` §10.

| AC | Observable result | Intent check |
| :--- | :--- | :--- |
| AC-1 | Validator tests never delete or overwrite pre-existing root config files; tests use isolated owned fixtures and preserve baseline on pass and fail. | Automated regression test with sentinel config files and cleanup checks. |
| AC-2 | Fitness reports the policy, roots, scanned-file count, and limitations; an application profile cannot claim a successful architecture check when a required source root is absent or no applicable source was scanned. Docs-only/reference mode states its zero-source result plainly. | Automated validator tests for missing roots, empty roots, configured roots, and strict/reference mode. |
| AC-3 | Architecture validator has regression tests for client/server isolation and documented parser limitations; supported checks catch relative/aliased or indirect dependency cases within the declared implementation scope, and unsupported cases are explicitly routed to review. | Automated positive/negative fixtures; verify all rules named machine-enforced have tests. |
| AC-4 | Task templates and authoring instructions require at least one complete, observable AC, expected behavior from an acceptance source, and verification coverage for applicable happy, boundary, error, and relevant auth/concurrency/compatibility scenarios. No unresolved placeholders can pass task validation. | Automated task-record validator tests covering placeholder, missing AC/check, and valid records; manual sample review against templates. |
| AC-5 | DoD/handoff evidence maps every AC to actual result and revision; required gates cannot be marked N/A/SKIPPED/NOT_RUN without the policy-defined outcome; scope deltas and test/gate weakening are disclosed. | Task validator tests where structurally enforceable; manual review for authority, applicability, and evidence semantics. |
| AC-6 | Guardrails explicitly prohibit hiding failures by deleting/skipping tests, `.only`, weakening discovery/coverage/validator exclusions, unsupported suppressions, or silent fallback; any approved exception has scope and replacement evidence. | Policy consistency review plus examples in task validator/self-review checklist. |
| AC-7 | Architecture onboarding identifies actual module paths, entry points, conventions and exemplar status; API/library claims require versioned implementation/type evidence. | Manual link and consistency review of adoption, packages, profile and system map. |
| AC-8 | Self-review and independent review are operational for a single operator: author self-review is required, independent reviewer eligibility/evidence is clear, and AI review does not grant approval or merge authority. | Manual lifecycle and authority consistency review. |
| AC-9 | Memory contains no unsupported quantitative efficacy/runtime claims or conflicting one-commit requirement; hierarchy wording makes safety/security/privacy prerequisites consistent. | Diff review and cross-reference consistency check. |
| AC-10 | Internal Markdown links and anchors in the changed policy surface have a runnable validator and all relevant links pass. | New verified docs-link command passes; fixtures cover valid, missing file, and missing anchor links. |

## 2. Investigation and Design

- Baseline: `main`, HEAD `390777fe6b55be16ee73d9b447820e2004bd4ad2`, clean worktree before plan creation. Working branch: `task/docs-quality-guardrails`.
- Evidence: `npm.cmd test` passed 6/6 suites. `npm.cmd run test:fitness` passed with 0 scanned files because this repository has no `src/`. The fitness engine has `--strict`, but the package script does not invoke it. Validator test cleanup removes root `architecture-fitness.config.mjs` and `.js` unconditionally. Direct parser checks did not detect relative DB imports, bracket/destructured/aliased raw env access, or global `fetch()` as a domain network dependency. Custom empty deny lists and `clientDirective: null` pass config validation.
- Scope/risk: Governance policy and quality gate changes affect P0/P1 protection; classify P0 / CRITICAL and use Standard workflow. No live application, business-data, auth implementation, or CI configuration is present in the baseline.
- Spec impact: NONE; this plan concerns process and technical verification policy, not business behavior.
- Minimal design: Make test fixtures non-destructive first. Improve validator enforcement and false-pass behavior; define support boundaries rather than overstate scanner guarantees. Add task-record and Markdown-link validators only for checks that can be automated safely. Clarify the remaining human review duties and preserve authority boundaries.

## 3. Scope and Plan

- In scope: `AGENTS.md`; task authoring and fix/feature templates; verification, DoD, review/rework, project adoption and fitness docs; technical lessons; architecture fitness engine, policy, tests and package scripts; new focused validator tests and docs-link/task-record validators if needed to meet ACs.
- Out of scope: business specs, application runtime, secrets, deployment/remote CI or branch protection configuration, external messaging, broad framework-wide refactor, universal semantic analysis beyond a defensible validator scope.
- Implementation order: (1) isolate fixtures and preserve baseline; (2) tests for current validator gaps and strict source-root behavior; (3) close or accurately bound architecture scanner gaps; (4) add task-record and docs-link checks with tests; (5) update canonical owner docs and templates; (6) reconcile summaries/memory and verify links/authority consistency.
- Docs synchronization: Update canonical owners first, then affected direct summaries/templates in the same task. No business spec update is applicable.
- Compatibility/recovery: No database/API migration. Keep existing task metadata and paths compatible. If validator behavior or config contract must change incompatibly, stop and update this plan for approval before implementation.
- ADR/memory: No architecture ADR expected for bounded repository validators. Correct `technical-lessons.md` quantitative claims and commit-count contradiction as part of this task.
- Dependencies: None.

## 4. Verification Matrix

| AC / invariant | Scenario and rationale | Verified command / manual procedure | Result | Evidence / revision |
| :--- | :--- | :--- | :--- | :--- |
| AC-1, AC-3 | Validator regression suite, including pre-existing config preservation and supported architecture fixtures | `npm.cmd test` | NOT_RUN | To record at execution revision |
| AC-2, AC-3 | Fitness behavior for this docs-only repository and strict fixture cases | `npm.cmd run test:fitness`; strict behavior exercised by automated fixtures | NOT_RUN | To record at execution revision; current baseline scans 0 files |
| AC-4, AC-5 | Task schema and evidence validation fixtures | New documented task-validation command from project profile | BLOCKED | Command does not exist in baseline; implementation is in scope |
| AC-6, AC-7, AC-8, AC-9 | Policy, hierarchy, templates, handoff and memory consistency | Manual review against AGENTS hierarchy and task lifecycle; record paths/anchors and findings | NOT_RUN | To record reviewer and revision |
| AC-10 | Internal Markdown link and anchor validation | New documented docs-validation command from project profile | BLOCKED | Command does not exist in baseline; implementation is in scope |
| Required architecture fitness | Repository-wide fitness gate | `npm.cmd run test:fitness` | NOT_RUN | Must pass at final revision; disclose zero-source limitation |

Existing confirmed commands are only `npm.cmd test` and `npm.cmd run test:fitness` from `docs/operations/project-profile.md`. No lint, typecheck, build, docs-link validator, task-record validator, or remote CI/branch protection is configured in the baseline. Add only the new scripts needed by this task; do not report nonexistent checks as PASS. Independent review is required by the P0/CRITICAL policy trigger and must occur before completed.

## 5. Open Issues and Approval

| Question / assumption | Evidence / proposed handling | Decision owner | Decision |
| :--- | :--- | :--- | :--- |
| Does “approve” authorize all recommendations A–K as one task? | Plan defines one bounded governance task; approval must identify this plan revision. Any scope reduction/expansion can be decided before approval. | Developer | Pending plan approval |
| Which exact source layouts are runtime profiles expected to support? | Current repository has no runtime source. Keep reference defaults and test config-driven roots; document adoption-specific roots in profile. | Developer / project owner | Pending if scope differs |
| Can an independent reviewer be made available for this P0/CRITICAL policy task? | Review policy requires independent reviewer; a fresh read-only reviewer session may be used if it meets current independence rules. | Developer | Pending execution scheduling |

- Plan revision: This file as committed/identified by the Developer at approval time; record the approved revision in frontmatter and approval evidence only after explicit approval of this task plan.
- Approval evidence: Pending. The chat message “approve” acknowledged the preceding recommendations; it did not identify this task-plan revision.
- Do not execute policy changes until approval explicitly covers this task plan and scope.

## 6. Checkpoint / Handoff

- Completed: Review and compose phase; evidence and checks above; no implementation changes made.
- Branch / revision: `task/docs-quality-guardrails`; plan worktree pending.
- Next action: Developer reviews this plan and approves/revises scope. After approval, execute in Standard track, obtain required independent review, complete verification and handoff.
- DoD: Standard DoD, required gates, independent review and conditional commit per `AGENTS.md`.
