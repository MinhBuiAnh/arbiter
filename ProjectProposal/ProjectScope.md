# Arbiter — v1 Project Scope

**Status:** Agreed baseline (v1.0)
**Date:** 2026-11-13
**Based on:** [`ProjectProposal.md`](./ProjectProposal.md)
**Effort budget:** 60–80 hours (planned: 77 h)
**Change control:** This document is the source of truth for v1. Anything not listed in §5 is out of scope until explicitly traded in.

---

## 1. Purpose

The proposal describes a broad platform (auth, problems, judge, contests, discussions, stats, leaderboard). Building all of it at 120–163 hours would spread effort too thin and put the highest-risk component — the judge — at risk.

v1 narrows the product to the **core practice loop**:

> An administrator publishes a problem with sample and hidden test cases. A user finds it, writes C++17 or Python 3 in the browser, submits, and receives a trustworthy verdict with per-test results and execution metrics. They can review their history and see basic progress.

Everything else is deferred, not cancelled. Contests and discussions remain the top post-v1 candidates.

---

## 2. v1 Definition (one sentence)

**Arbiter v1 is a working online judge: authentication, problem browsing, a two-language code editor, asynchronous Docker-isolated judging with seven verdicts, submission history, and basic progress/leaderboard pages — backed by an admin UI for problems, test cases, and users.**

The platform is "done" when the end-to-end workflow in §11 passes repeatedly on a clean Docker Compose environment.

---

## 3. Decision Log

| ID | Decision | Rationale |
|----|----------|-----------|
| D-01 | Target 60–80 hours; plan 77 h | Leaves contingency; avoids a half-finished contest module. |
| D-02 | Contests are out of v1 | Highest cost-to-value ratio before the judge is proven; needs scoring and standings rules. |
| D-03 | Discussions are out of v1 | Moderation, reactions, and reporting add surface area without strengthening the core loop. |
| D-04 | Judge supports C++17 and Python 3 only; Go deferred | Covers both compiled and interpreted paths. A third image adds build/test time for little marginal learning. |
| D-05 | Admin UI covers problems, test cases, and users | These are required to operate the core loop; contests/discussions admin is unnecessary without those modules. |
| D-06 | Stats are basic: solved/attempted, difficulty/tag breakdown, acceptance rate, global leaderboard | Cheap queries over existing data. Streaks and activity feeds are deferred. |
| D-07 | Judge hardening = Docker limits only | CPU/memory/pids/time limits, no network, read-only rootfs, non-root, dropped capabilities, tmpfs, cleanup. seccomp/AppArmor/gVisor documented as future work. |
| D-08 | Result delivery uses HTTP polling | Already the SRS decision; WebSocket/SSE deferred. |
| D-09 | Test case contents live on a protected filesystem volume, metadata in PostgreSQL | Matches the SRS option; object storage is unnecessary at this scale. |
| D-10 | One submission → one compilation container; one execution container **per test case** | Prevents state leakage between test cases and keeps limits per-case, at an acceptable performance cost. |
| D-11 | Stop judging at the first failing test case | Standard OJ behavior; saves worker time. Per-test results are stored for executed cases only. |
| D-12 | Token-based output comparison only | Whitespace-insensitive, order-sensitive token comparison. No float tolerance or special judges. |
| D-13 | Stateless JWT auth (24 h), client-side logout; disabled accounts rejected on every request; password change invalidates all tokens via `password_changed_at` | Refresh-token rotation, email verification, and password reset are deferred. A single timestamp check provides revocation without a token table. |
| D-14 | Single Judge Worker deployment, but Redis Streams consumer groups from day one | Proves the architecture scales horizontally without requiring multi-worker testing in v1. |
| D-15 | Simplify schema: `users.role` enum instead of `Role`/`UserRole`; verdict on `submissions` instead of `submission_results` | Fewer joins and tables for the same MVP behavior. |
| D-16 | Merge "topics" and "tags" into a single `tags` concept | The proposal treats them as overlapping filters; one concept is enough for v1. |

---

## 4. Actors

| Actor | v1 capabilities |
|-------|-----------------|
| Guest | Browse published problems, search/filter, view details and samples, view leaderboard, register, log in |
| User | Everything a guest can do, plus submit, poll results, view own submissions and source code, view own stats, change password, update profile |
| Administrator | Everything a user can do, plus manage problems, tags, test cases, publication state, and user account status; view any submission |
| Judge Worker | Internal process: consume jobs, compile, execute, compare, persist results |

No other human roles exist in v1 (no moderators, contest organizers, etc.).

---

## 5. In Scope

The use-case definitions for this scope are maintained in [`DesignAnalysis/UCSpec/UseCaseCatalog.md`](../DesignAnalysis/UCSpec/UseCaseCatalog.md).

### 5.1 Authentication and Account Management

- Registration with username, email, password. Unique username and email.
- Login with username **or** email plus password.
- Passwords hashed with Argon2id (bcrypt is an acceptable fallback).
- Logout clears the client token (no server-side denylist).
- JWT access token, HS256, 24 h expiry, carrying user ID and role.
- Tokens issued before `users.password_changed_at` are rejected, so a password change invalidates all existing sessions.
- `GET /auth/me` for session bootstrap.
- Profile view and update: display name, bio, email (username immutable in v1).
- Password change (requires current password; logs the user out everywhere).
- Role-based access control: `user`, `admin`.
- Account status: `active`, `disabled`. Disabled users cannot log in or use existing tokens.
- Admin: list/search users, view user details, enable/disable accounts.
- First administrator is created by a seed command/migration, not self-registration.

**Not in this module for v1:** email verification, password reset, refresh tokens, avatar upload, account deletion, social login, 2FA, admin password resets.

### 5.2 Problem Management

- Public problem list with pagination.
- Search by title (case-insensitive substring; full-text search deferred).
- Filter by difficulty (`easy`, `medium`, `hard`) and by one or more tags.
- Problem detail: title, description (Markdown), input format, output format, constraints, examples, difficulty, tags, time limit, memory limit, supported languages, sample test cases.
- Public problem statistics: total submissions, accepted submissions, acceptance rate.
- Problem visibility is split into two fields: `status` (`active`, `inactive`; stored as the `is_active` boolean) and `publication_status` (`draft`, `published`). Only `active` + `published` problems are visible to guests/users; `inactive` is the soft-deleted/archived state.
- Stable, human-friendly problem slugs for URLs.
- Admin: create, update, archive/delete (soft delete), publish/unpublish, manage tags.
- Tags: create and assign from the problem form (create-on-type). No separate tag-management page.

**Out of this module for v1:** topics as a separate concept, per-problem editorials, hints, company tags, problem likes/bookmarks, bulk import, rich attachments, custom checkers.

### 5.3 Test Case Management

- Test cases belong to exactly one problem.
- Fields: input, expected output, `is_sample`, display order.
- Sample test cases are exposed through the public problem API; hidden cases never are.
- Admin: create, update, delete, reorder, toggle sample/hidden. All test-case mutations require the problem to be `active` + `draft`.
- Input/output stored as files under a protected path; PostgreSQL stores metadata, ordering, and the sample flag.
- Validation: a problem cannot be published without at least one sample and one hidden test case.
- Hidden test data is never returned by any public endpoint, including submission results.

**Out of this module for v1:** test-case groups, per-group scoring/weights, custom validators, generators, bulk upload archives, encrypted-at-rest test data.

### 5.4 Code Editor and Submission

- Monaco Editor on the problem page, lazy-loaded.
- Language selector: C++17, Python 3.
- Per-problem default code templates (optional but cheap; store as a static map in the frontend).
- Client-side guards: non-empty source, size ≤ 64 KiB.
- Submit → `POST /submissions` returns `202` with submission ID immediately.
- Submission record: user, problem, language, source code, status, created time.
- Server-side validation: problem published, language supported, source size, per-user throttle (1 submission per 5 s).
- Poll `GET /submissions/{id}` every 1 s with backoff until a terminal status, then stop.
- Submission lifecycle: `queued` → `compiling` → `running` → `completed` (with a verdict) or `internal_error`.
- Verdicts: `accepted`, `wrong_answer`, `time_limit_exceeded`, `memory_limit_exceeded`, `runtime_error`, `compilation_error`. `internal_error` is a terminal status, not a verdict.
- Submission history for the current user, filterable by problem and verdict, paginated.
- Submission detail: verdict, language, timestamp, total runtime, peak memory, compile output (CE), per-test results (pass/fail, runtime, memory), source code.
- Source code is visible only to its owner and administrators.
- Admins can view any submission for support/debugging.

**Out of this module for v1:** "Run against samples" without creating a submission, auto-save drafts, multiple files per submission, custom input runs, editor themes/settings, code sharing, submission rejudge UI (CLI/admin API is enough).

### 5.5 Judge System

Pipeline:

1. Consume a job from Redis Streams via a consumer group.
2. Load submission, problem configuration, and ordered test cases.
3. Compile C++ once in a fresh container; syntax-check Python with `py_compile` in a fresh container.
4. Execute each test case in a fresh container, in order.
5. Capture stdout/stderr, exit code, wall time, and peak memory.
6. Compare output with expected using token-based comparison.
7. Stop at the first non-passing case.
8. Persist the verdict, aggregate metrics, and per-test results atomically.
9. Acknowledge the job only after a durable commit.
10. Clean up containers and temporary workspaces.

Verdicts: AC, WA, TLE, MLE, RE, CE. `INTERNAL_ERROR` is a terminal status for infrastructure failure and is never treated as a user-caused verdict.

Comparison rules:

- Normalize CRLF → LF.
- Split on any whitespace; compare token sequences exactly.
- Case-sensitive.
- Trailing/leading whitespace and blank lines are insignificant.
- Output larger than 1 MiB is truncated/treated as WA (documented).

Limits:

- Per-problem time limit (default 1000 ms) and memory limit (default 256 MB).
- Compilation: fixed 10 s timeout, 512 MB.
- Source size: 64 KiB.
- Process limit: 64 PIDs.
- CPU: 1 vCPU.

Isolation per container:

- `--network none`
- `--memory <limit>`, `--memory-swap` equal to memory
- `--cpus 1`
- `--pids-limit 64`
- `--read-only` root filesystem
- `--tmpfs /tmp:rw,noexec,nosuid,size=64m` and an executable workspace tmpfs
- `--cap-drop ALL`
- `--security-opt no-new-privileges`
- Non-root user inside the image
- No Docker socket, no host directory mounts other than the read-only input/artifact
- Container removed after each step

Reliability:

- Transactional outbox: the submission and its judge event are committed in one PostgreSQL transaction; a dispatcher publishes the event to Redis and retries until it succeeds.
- Redis Stream `judge:submissions` with consumer group `judge-workers` and `XACK` after the result commit.
- `XAUTOCLAIM` to recover pending jobs after worker crashes.
- Idempotency: a submission already in a terminal state is not re-judged.
- `judge_attempts` counter: at most 2 attempts, then `internal_error` with a logged reason.
- One failed submission must not stop the worker loop.

**Out of this module for v1:** Go, Java, JavaScript, or other languages; special judges; interactive problems; float tolerance; per-test-case weights; multi-worker load testing; gVisor/seccomp/AppArmor profiles; distributed judging; real-time queue dashboards.

### 5.6 User Progress and Leaderboard

- Own profile stats: attempted problems, solved problems, acceptance rate.
- Attempted = distinct non-archived problems with at least one submission. Solved = distinct non-archived problems with at least one accepted submission.
- Breakdown of solved and attempted problems by difficulty and by tag.
- Recent submissions (last 10) on the profile.
- Global leaderboard: active users ranked by distinct solved non-archived problems (descending), then total submissions (ascending), then username.
- Public read access to the leaderboard.
- Problem-level public stats: total submissions, accepted submissions, acceptance rate.

**Out of this module for v1:** streaks, activity heatmaps, contest rating, per-language stats, time-series charts, CSV export, private profiles, daily challenges.

### 5.7 Administration

- Admin-only web section, guarded by role on both frontend and backend.
- Problem management: list, create, edit, publish/unpublish, archive.
- Test case management: list, create, edit, delete, reorder, mark sample.
- User management: list/search, view, enable/disable.
- Submission inspection: view any submission and its results.
- No admin action for contests or discussions (modules absent).

**Out of this module for v1:** audit logs, granular permissions, admin activity history, bulk operations, impersonation, content moderation queue.

### 5.8 Platform and Operations

- Docker Compose: `frontend`, `api`, `judge-worker`, `postgres`, `redis`, plus language images built on demand.
- Environment-based configuration; `.env.example` committed, real secrets never committed.
- Database migrations (golang-migrate) with up/down scripts.
- Seed data: 1 admin, 1 demo user, 8–10 published problems covering all difficulties/tags, each with sample and hidden tests.
- Structured logging (`slog`) for API and worker.
- Health endpoints for API and worker.
- Consistent JSON error envelope.
- Unit tests for business logic; integration tests for API + database; judge scenario tests (§11.2).
- README with setup, run, test, and demo instructions.
- API documentation (OpenAPI or a Markdown endpoint reference).
- ERD and updated architecture diagram.

---

## 6. Out of Scope for v1

| Feature | Why deferred | Target |
|---------|--------------|--------|
| Programming contests (create, register, contest submissions, scoring, standings) | Large module; depends on a stable judge; needs ranking rules | Post-v1, P1 |
| Discussion system (threads, comments, replies, edit/delete, likes, reports, moderation) | Independent CRUD module; does not strengthen the core loop | Post-v1, P1 |
| Go language support | Third runtime; incremental value after two languages work | Post-v1, P1 |
| "Run against samples" (no submission record) | Extra job type and judge path; can reuse the pipeline later | Post-v1, P1 |
| Advanced statistics (streaks, activity feed, heatmaps, per-language stats) | Nice-to-have; requires derived data | Post-v1, P2 |
| Contest ranking / rating system | Only meaningful with contests | Post-v1, P2 |
| Activity/audit log | Operational nicety, not user-facing | Post-v1, P2 |
| Email verification, password reset, refresh tokens, 2FA | Not required for the core loop; adds email infrastructure | Post-v1, P2 |
| Floating-point tolerance / special judge / interactive problems | Comparison engine extension | Post-v1, P2 |
| Object storage (S3/MinIO) for test cases | Filesystem works at this scale | Post-v1, P3 |
| WebSocket/SSE live results | Polling satisfies the requirement | Post-v1, P3 |
| Advanced rate limiting and abuse detection | A submission throttle is sufficient for v1 | Post-v1, P3 |
| seccomp/AppArmor/gVisor hardening | Docker limits meet v1 security requirements; documented as future work | Post-v1, P3 |
| Multi-worker load testing, autoscaling | Architecture supports it; not validated in v1 | Post-v1, P3 |
| Kubernetes/production orchestration | Compose is the agreed deployment target | Post-v1, P3 |
| AI code review, AI solutions, plagiarism detection | Explicitly out of the original proposal | Future |
| Social login, premium access, mobile apps, collaborative editing | Explicitly out of the original proposal | Future |
| User-defined execution environments, multi-region judging | Explicitly out of the original proposal | Future |

---

## 7. Deferred Backlog (ordered)

1. Contests with ICPC-style standings and registration.
2. Discussions with flat comments, edit/delete, and admin moderation.
3. Go language image and judge configuration.
4. "Run against samples" using the existing judge path.
5. Email verification and password reset.
6. Streaks and an activity feed.
7. Special judge / float tolerance.
8. WebSocket or SSE result push.
9. Contest ratings.
10. Audit log and richer admin tooling.

---

## 8. Requirement Deltas vs Proposal and SRS

### 8.1 Requirements removed

| Source ID | Requirement | Reason |
|-----------|-------------|--------|
| FR-027 – FR-032 (proposal) | Contest management | Out of scope (D-02) |
| FR-033 – FR-036 (proposal) | Discussion system | Out of scope (D-03) |
| FR-SUB-03 (SRS) | Support C++17, Python 3, **and Go** | Amended to two languages (D-04) |
| SRS §2.5 constraint 10 | Initial release supports three languages | Amended to two |
| SRS §1.2 / §3.2 | Global leaderboard excluded | Superseded: basic leaderboard included (D-06) |

### 8.2 Requirements amended

| Source ID | Change |
|-----------|--------|
| FR-023 – FR-026 (proposal) | Reduced to basic stats + global leaderboard; no streaks or contest ranking |
| FR-006 (proposal) / FR-ADMIN-03 (SRS) | Admin manages account **status** only (enable/disable); no full account editing |
| FR-011 (proposal) | Tags only; topics merged into tags (D-16) |
| FR-022 (proposal) | Evaluation details limited to per-test pass/fail and metrics; hidden I/O never exposed |
| FR-JUDGE-07 (SRS) | Confirmed: one isolated execution per test case (D-10) |
| FR-JUDGE-13/14 (SRS) | Implemented via consumer groups, `XAUTOCLAIM`, terminal-state idempotency, and a 2-attempt retry cap |

### 8.3 Requirements added

| ID | Requirement |
|----|-------------|
| FR-STATS-01 | The system shall compute each user's attempted and solved problem counts from distinct non-archived problems. |
| FR-STATS-02 | The system shall show solved and attempted counts grouped by difficulty and by tag. |
| FR-STATS-03 | The system shall compute a user's acceptance rate as accepted submissions / total submissions. |
| FR-STATS-04 | The system shall provide a public global leaderboard ranked by distinct solved problems, with deterministic tie-breaking. |
| FR-STATS-05 | The system shall display public aggregate statistics for each published problem. |
| FR-OPS-01 | The system shall provide seed data sufficient to demonstrate the full workflow on a clean install. |
| FR-OPS-02 | The system shall throttle submissions to one per user per 5 seconds. |

### 8.4 Schema simplifications

v1 tables:

`users`, `problems`, `tags`, `problem_tags`, `test_cases`, `submissions`, `submission_test_results`, `outbox_events`.

| Proposed entity | v1 treatment |
|-----------------|--------------|
| `Role`, `UserRole` | Replaced by `users.role` enum (`user`, `admin`) |
| `User` | Adds `password_changed_at` for token invalidation and `status` (`active`, `disabled`) |
| `SubmissionResult` | Merged into `submissions` (status, verdict, runtime, memory, compile output, `judge_attempts`) |
| `Contest`, `ContestProblem`, `ContestRegistration`, `ContestSubmission` | Deferred |
| `Discussion`, `Comment`, `Reaction` | Deferred |
| `ActivityLog` | Deferred |
| `TestCase` | Kept as metadata + file paths (`type` = sample/hidden, `ordinal`) |
| `OutboxEvent` | New table required by the transactional outbox pattern |

Indexes planned for: `submissions(user_id, created_at)`, `submissions(problem_id, status)`, `submissions(status)`, `problems(is_active, difficulty)`, `test_cases(problem_id, ordinal)`, `problem_tags(tag_id)`, `outbox_events(published_at, id)`.

---

## 9. Locked Technical Decisions

| Area | Decision |
|------|----------|
| Frontend | React + TypeScript + Vite, React Router, TanStack Query, Tailwind CSS, Monaco Editor, Axios |
| Backend | Go, Chi router, pgx, golang-migrate, golang-jwt, slog |
| Database | PostgreSQL |
| Queue | Redis Streams with a consumer group (`judge-workers`) |
| Judge worker | Separate Go binary/process; no HTTP server |
| Execution | Docker Engine API or CLI; one compile container, one container per test case |
| Test case storage | Local protected filesystem volume; DB stores metadata and relative paths |
| Auth | Argon2id, JWT HS256 (24 h), `user`/`admin` roles |
| Result delivery | HTTP polling |
| Deployment | Docker Compose |
| Output comparison | Token-based, whitespace-insensitive, case-sensitive |
| API style | REST under `/api/v1`, consistent JSON envelope, cursor or page/limit pagination |

---

## 10. Milestones and Budget

| Milestone | Deliverable | Hours | Exit criteria |
|-----------|-------------|-------|---------------|
| M0 | Scope + design finalization | 2 | This document approved; SRS deltas applied |
| M1 | Foundation | 7 | Compose stack starts; migrations run; API/worker health checks; Docker execution smoke test passes |
| M2 | Auth, users, admin user management | 9 | Register/login/logout/me, RBAC, profile, password change, disable/enable |
| M3 | Problems, tags, test cases | 12 | Public browse/search/filter/detail; admin CRUD; publish validation; hidden data protected |
| M4 | Submissions and editor | 11 | Monaco page; submit → queued; polling; history + detail; throttle |
| M5 | Judge worker | 17 | All seven verdicts reproducible; per-test results; recovery/idempotency; cleanup |
| M6 | Stats, leaderboard, admin UI | 9 | Profile stats, leaderboard, problem stats, admin screens |
| M7 | Testing, hardening, deployment, docs | 10 | §11 acceptance passes from clean checkout; docs complete; seed data demo works |
| **Total** | | **77** | |

Order matters: M5 is the critical path and starts immediately after M4. M6 can overlap M5 only on the frontend.

---

## 11. Definition of Done

### 11.1 Acceptance workflow

On a clean machine with Docker installed:

1. `docker compose up` starts PostgreSQL, Redis, API, worker, and frontend.
2. Migrations and seed data run successfully.
3. Admin logs in and creates a problem with sample and hidden test cases, then publishes it.
4. Guest can find the problem via search and filter, and read it without logging in.
5. A new user registers and logs in.
6. The user writes a correct C++17 solution and submits it.
7. The API returns immediately; the UI polls and shows `Accepted` with runtime and memory.
8. The user submits a wrong solution, an infinite loop, a memory hog, a syntax error, and a runtime exception; the UI shows WA, TLE, MLE, CE, and RE respectively.
9. Hidden test-case input/output is never visible in the browser or API responses.
10. The user submits a correct Python 3 solution and gets `Accepted`.
11. Submission history filters by problem and verdict; detail shows per-test results and source code.
12. Profile shows attempted/solved counts, difficulty/tag breakdown, and acceptance rate.
13. Leaderboard ranks users by solved problems.
14. Restarting the worker while a job is queued does not lose the submission.

### 11.2 Judge test matrix

| Scenario | Expected |
|----------|----------|
| Correct solution | AC |
| Incorrect output | WA |
| Infinite loop | TLE |
| Excessive allocation | MLE |
| Syntax error | CE |
| Runtime exception / non-zero exit | RE |
| Whitespace-only differences | AC |
| Empty output vs expected | WA |
| Output > 1 MiB | WA (documented) |
| Multiple test cases, fails on case 3 | WA with cases 1–3 recorded |
| Worker killed mid-job | Job reclaimed; no duplicate terminal result |
| Malicious filesystem/network access attempt | Denied; no host impact |
| Missing test case file | IE, not AC |

### 11.3 Quality gates

- `go test ./...` and frontend build pass.
- No secrets in the repository.
- Hidden test data absent from API responses (covered by an automated test).
- Lint/format clean.
- README steps verified by someone other than the author, or by a fresh clone.

---

## 12. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Docker execution unavailable/permission issues on the dev machine | Blocks M5 | Prove a container run in M1; document requirements early |
| Peak memory measurement is unreliable | Wrong MLE/metrics | Prefer cgroup v2 `memory.peak`; fall back to OOMKilled flag; store "unknown" rather than a wrong value |
| Python startup overhead causes false TLE | Bad UX | Measure execution only; document limits; consider a small fixed startup allowance if data shows it is needed |
| Large output or fork bombs | Worker/host instability | 1 MiB output cap, 64 PID limit, timeouts, `--pids-limit`, `--cap-drop ALL` |
| Hidden test leakage | Integrity failure | Never expose hidden I/O; separate sample endpoints; automated leakage test |
| Redis Streams recovery complexity | Lost/stuck jobs | Consumer group + `XAUTOCLAIM` + idempotent terminal states + retry cap |
| Judge becomes a time sink | Schedule slip | Timebox M5; languages fixed at two; no special judges; no "run" feature |
| Scope creep (contests, discussions, extras) | Slip | §6/§7 are frozen; additions require cutting equal hours |
| Monaco bundle size | Slow first load | Lazy-load the editor route |

---

## 13. Open Decisions (defaults proposed)

| # | Question | Proposed default |
|---|----------|------------------|
| 1 | Include "Run against samples" in v1? | No; revisit after the judge is stable |
| 2 | Should the leaderboard be public? | Yes, read-only for guests |
| 3 | Username immutable? | Yes, for v1; display name editable |
| 4 | Profile fields | Display name + bio only; no avatar |
| 5 | Soft delete vs hard delete for problems | Soft delete (`archived`) so submissions stay valid |
| 6 | Seed content volume | 8–10 problems, 2–4 test cases each |
| 7 | Per-test result visibility for hidden cases | Pass/fail + metrics only, no I/O |
| 8 | Time limit semantics | Per test case, wall-clock, measured inside the execution container |

---

## 14. Change Control

- New feature → add to §7 backlog unless it replaces an equal or greater amount of in-scope work.
- Any change to §5 requires updating this document, the SRS, and the affected use-case specs.
- The judge's security requirements (§5.5) and the acceptance workflow (§11.1) are not negotiable for v1.
