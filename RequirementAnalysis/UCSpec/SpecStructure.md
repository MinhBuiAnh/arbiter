# Use Case Specification Structure

**Arbiter — Online Judge Platform**

**Version:** 1.1

This document is the guide for writing a use case specification. It defines the required structure, the rules for writing flows, the error-code model, and the standard error-handling procedure.

| Document control | Value |
|------------------|-------|
| Project | Arbiter — Online Judge Platform |
| Applies to | Every specification under `DesignAnalysis/UCSpec/` |
| Status | Active |
| Last updated | 2026-11-13 |
| Supersedes | Version 1.0 |

---

## 1. Use Case Specification Structure

### 1.1. Use Case ID and File Naming

Use case identifiers are stable and follow this pattern:

`UC-<AREA>-<NUMBER>`

- `UC` — use case.
- `<AREA>` — the functional area.
- `<NUMBER>` — two-digit sequence within the area.

| Area | Meaning | Example |
|------|---------|---------|
| `UC-G` | Guest-only use case | `UC-G-01` Register Account |
| `UC-COM` | Shared Guest/User use case | `UC-COM-01` Browse Problems |
| `UC-U-A` | User account and authentication | `UC-U-A-01` Log Out |
| `UC-U-P` | User problem practice | `UC-U-P-01` Write Solution |
| `UC-U-S` | User submission history | `UC-U-S-01` View Submission Status |
| `UC-U-ST` | User statistics | `UC-U-ST-01` View Own Statistics |
| `UC-AD-P` | Administrator problem management | `UC-AD-P-01` Create Problem |
| `UC-AD-T` | Administrator test-case management | `UC-AD-T-01` Create Test Case |
| `UC-AD-U` | Administrator user management | `UC-AD-U-01` View User List |
| `UC-AD-S` | Administrator submission inspection | `UC-AD-S-01` View Any Submission |
| `UC-SYS-J` | System/judge processing | `UC-SYS-J-01` Process Submission |

Specification files use:

`UC-<AREA>-<NUMBER>-<PascalCaseName>.md`

Example: `UC-AD-T-05-ReorderTestCases.md`.

The ID and name in the file must match the entry in [`UseCaseCatalog.md`](./UseCaseCatalog.md). If they do not match, the catalog is authoritative until both are corrected.

### 1.2. Required Fields

Every use case has the following fields. “Required” means the field must be present; “Conditional” means it must be present when the condition applies.

| Field | Required | About |
|-------|----------|-------|
| Use Case ID | Yes | Unique identifier from §1.1. |
| Use Case Name | Yes | Verb-object name that matches the catalog. |
| Version | Yes | Specification version. Increment when the specification changes materially. |
| Brief Description | Yes | The use case's objective, primary actor, and observable result. |
| Primary Actor(s) | Yes | Actor(s) who initiate the use case and receive its main benefit. |
| Supporting Actor(s) | Conditional | External systems or services that participate but do not initiate the use case. |
| Trigger | Yes | The event that starts the use case. For system use cases, this may be a queue message, timer, or recovery event. |
| Priority | Recommended | `High`, `Medium`, or `Low`, consistent with the catalog. |
| Status | Recommended | `Draft`, `In Review`, `Approved`, or `Deprecated`. |
| Preconditions | Yes | Conditions that must already be true before the use case starts. |
| Postconditions | Yes | System state after the use case ends, separated into success and failure outcomes. |
| Main Flow | Yes | The happy-path business flow with numbered steps. |
| Alternative Flow | Conditional | A valid business branch with a different outcome. It is not an error. |
| Exception Flow | Conditional | An error scenario, its error code, and its handling flow. |
| Related Use Cases | Recommended | Includes, extends, generalizes, triggers, or is triggered by another use case. |
| Related Requirements | Recommended | Functional or non-functional requirement IDs, when assigned. |
| Assumptions | Recommended | Conditions assumed true but not enforced by the use case. |
| Special Requirements | Recommended | Security, privacy, concurrency, idempotency, performance, or compliance constraints. |
| Open Issues | Optional | Unresolved decisions or questions that affect the specification. |
| Change History | Yes | A short table of version, date, and change. |

Do not duplicate authoritative catalog data unnecessarily. If the catalog and the specification disagree on priority or actors, correct both in the same change.

The catalog's `Status` column records the change type (`Existing`, `Amended`, `New`), while the specification's `Status` field records the review lifecycle (`Draft`, `In Review`, `Approved`, `Deprecated`). They are related but not the same value.

### 1.3. Alternative Flow vs. Exception Flow

| Flow | Meaning | Error code? | Examples |
|------|---------|-------------|----------|
| Alternative Flow | The actor makes a different valid choice, or the business outcome differs but the request is still valid. | No | No search results; actor cancels; actor chooses to register instead of logging in. |
| Exception Flow | The operation cannot complete normally because of invalid input, an unavailable dependency, a permission problem, a conflict, or another error. | Yes | Invalid input; database unavailable; expired token; rate limit exceeded. |

Do not use an exception flow for an empty result, a cancelled action, or a user choosing another path. Do not use an alternative flow to hide an error.

### 1.4. Flow-Writing Rules

1. **One action per numbered step.** If two actions must happen together, say so explicitly rather than hiding them in one sentence.
2. **Name the responsible party.** Use the actor name, `System` for backend behavior, or `UI` for client behavior. Do not alternate between `System`, `Backend`, and `Server` for the same responsibility.
3. **Use active voice.** Prefer “System validates the request” over “The request is validated”.
4. **Number steps sequentially.** Do not skip or repeat numbers within one flow.
5. **State the branch point.** Every alternative or exception flow begins with “At step N, …” or explains the external event that triggers it.
6. **State the rejoin point or the end.** Every branch ends with either “Use Case continues at step M” or “Use Case ends”.
7. **Keep preconditions honest.** A precondition is something that must be true before the use case starts. If the system checks it during the flow, it belongs in the main flow and its failure belongs in an exception flow.
8. **Separate success and failure postconditions.** State what is true after success and what is guaranteed after failure.
9. **Do not put implementation detail in user-facing use cases.** Use logical terms such as `database`, `queue`, and `sandbox`. Concrete technologies such as PostgreSQL, Redis, and Docker belong in system use cases or an **Internal Processing Note**.
10. **Cross-reference by ID and name.** Write `UC-G-02 – Log In`, not just `Log In` or `the login use case`.
11. **Do not claim success when the outcome is unknown.** For network failures, state that the UI must verify the result before retrying.

### 1.5. Abstraction and Internal Processing

User-facing use cases describe what the actor does and what the system guarantees, not how the system is implemented. When asynchronous or infrastructure processing is essential to the use case but is not a direct actor interaction, add a clearly labeled **Internal Processing Note** after the main flow.

Example:

> **Internal Processing Note:** After the transaction commits, the outbox dispatcher publishes the event to the judging queue. The judge worker consumes the event asynchronously. This is internal processing, not a user interaction step.

### 1.6. Copy-Paste Template

```markdown
# Use Case Specification

**UC-<AREA>-<NN> - <Use Case Name>**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-<AREA>-<NN>
- Use Case Name: <Use Case Name>
- Brief Description: Allow <actor> to <goal> so that <result>.
- Primary Actor(s): <actor(s)>
- Supporting Actor(s): <actor(s), or "None">
- Trigger: <event that starts the use case>
- Priority: <High | Medium | Low>
- Status: <Draft | In Review | Approved | Deprecated>
- Related Use Cases: <UC-... – Name, or "None">
- Related Requirements: <FR-... / NFR-..., or "Not yet assigned">

# 2. Preconditions

- <condition that must already be true>

# 3. Postconditions

## 3.1. Success

- <state after successful completion>

## 3.2. Failure

- <state after an unsuccessful completion; what is guaranteed not to happen>

# 4. Main Flow

1. <actor or System action>
2. <action>
3. <action>
4. Use Case ends.

# 5. Alternative Flow

**A1 – <Title>**

1. At step <N>, <actor> chooses <valid alternative>.
2. <System response>
3. Use Case continues at step `<M>` / Use Case ends.

# 6. Exception Flow

**E1 – ERR-<CAT>-<NNN>: <Title>**

1. At step <N>, System detects <error condition>.
2. System stops the affected operation.
3. <Data/transaction outcome: rolled back, not created, left pending, etc.>
4. System logs the error with the request/correlation ID. No secrets or sensitive data are logged.
5. System returns `ERR-<CAT>-<NNN>` with an appropriate message.
6. UI displays <user-visible result and next step>.
7. <Retry is allowed / Use Case ends / Use Case continues at step M>.

# 7. Assumptions

- <assumption, or "None">

# 8. Special Requirements

- <security, concurrency, idempotency, performance, or other constraint, or "None">

# 9. Open Issues

- <open issue, or "None">

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | YYYY-MM-DD | Initial specification. |
```

---

## 2. Exception Flow

### 2.1. Error Code

Error codes are mandatory for every exception flow. Use this form:

`ERR-<CAT>-<NNN>`

- `ERR` — literal prefix for an error.
- `<CAT>` — uppercase category from the table in §2.1.1.
- `<NNN>` — three-digit, zero-padded sequence number within the category.

Examples: `ERR-VAL-001`, `ERR-AUTH-003`, `ERR-CONFLICT-002`.

#### 2.1.1. Error Categories

| Category | Category Name | Use for | Default HTTP status |
|----------|---------------|---------|---------------------|
| `ERR-VAL` | Validation Error | Missing, malformed, or semantically invalid input; unsupported values. | 400 / 422 |
| `ERR-AUTH` | Authentication Error | Missing, invalid, or expired credentials or access token. | 401 |
| `ERR-ACC` | Account Error | An account exists but is disabled, locked, or otherwise ineligible. | 403 |
| `ERR-RES` | Resource Error | A requested resource does not exist. | 404 |
| `ERR-PERM` | Permission Error | The actor is authenticated but lacks the required role, ownership, or privilege. | 403 |
| `ERR-CONFLICT` | State Conflict Error | The resource exists but is in the wrong state, has changed concurrently, or conflicts with another resource. | 409 |
| `ERR-LIMIT` | Rate Limit Error | A request limit, quota, or throttle has been exceeded. | 429 |
| `ERR-SYS` | System Error | An internal system or dependency failure prevents a trustworthy result. | 500 / 503 |
| `ERR-NET` | Network Error | The connection was interrupted or timed out before a definitive result was received. | Client-side |

Category boundaries:

- `ERR-AUTH` answers “who are you?”; `ERR-ACC` answers “is your account allowed to act?”; `ERR-PERM` answers “is your role or ownership sufficient?”.
- `ERR-RES` is only for “the resource does not exist”. A resource that exists but cannot be used in its current state is `ERR-CONFLICT`, not `ERR-RES`.
- `ERR-VAL` is for input the actor can correct. An internal configuration mismatch that the actor cannot correct is `ERR-SYS` or `ERR-CONFLICT`, depending on the cause.
- `ERR-NET` is raised by the client or the integration boundary when no definitive server response was received. It is not a substitute for a server-side system error.

> **Migration note:** Existing specifications use `ERR-RES-002` for several state-conflict conditions. When a specification is next revised, split those cases into distinct `ERR-CONFLICT-<NNN>` codes. Do not renumber codes that existing clients may depend on.

#### 2.1.2. Allocation Rules

1. **One code per distinct condition.** Do not reuse one code for different causes, resource types, or HTTP statuses. For example, “problem not found”, “submission not found”, and “user not found” must not all be `ERR-RES-001`.
2. **Codes are global and stable.** Allocate the next unused number in the category. Gaps are allowed.
3. **Never renumber or reuse a retired code.** If a condition is removed, retire the code and record that it is no longer used.
4. **Declare every code in an exception flow.** A code mentioned only in prose is not specified.
5. **Register new codes centrally.** When the project maintains an error registry, add the code there with its title, HTTP status, user-facing message, retryable flag, and owner. If no registry exists yet, the use case's exception flow is the declaration until the registry is created.
6. **Do not use an error code for an alternative flow.** Alternatives are valid outcomes.

### 2.2. Error Response Shape

The backend returns a consistent error body. Adapt the transport format as needed, but preserve the semantics.

```json
{
  "code": "ERR-VAL-001",
  "message": "Invalid registration data.",
  "details": [
    { "field": "email", "reason": "invalid_format" }
  ],
  "request_id": "8f4c2a1e-...",
  "retry_after": 5
}
```

| Field | Required | Meaning |
|-------|----------|---------|
| `code` | Yes | Stable error code in `ERR-<CAT>-<NNN>` form. |
| `message` | Yes | Human-readable summary. It may be localized; the code remains the stable contract. |
| `details` | Conditional | Field-level or item-level reasons. Do not include internal identifiers that the caller does not need. |
| `request_id` | Yes | Correlation ID for support and tracing. |
| `retry_after` | Conditional | Seconds to wait before retrying, when the error is retryable and the wait is known. |

Never expose stack traces, SQL, container internals, hidden test data, secrets, passwords, or tokens in any error field.

### 2.3. General Error Handling

All exception flows follow this standardized order. The owner column identifies who performs the step.

| # | Owner | Action |
|---|-------|--------|
| 1 | Backend / Worker | Detect the error during validation, processing, persistence, or an external call. Capture the error code, cause, and request/correlation ID. |
| 2 | Backend / Worker | Stop the affected operation if it cannot continue safely. Do not continue with invalid state. |
| 3 | Backend / Worker | Protect data consistency. For write operations, use a transaction and roll back when necessary. For asynchronous work, leave the job pending or retryable rather than recording a false terminal result. |
| 4 | Backend / Worker | Log structured error information with the request/correlation ID and, where appropriate, the actor and resource identifiers. **Do not** log passwords, tokens, secrets, full source code, hidden test data, or unnecessary personal data. |
| 5 | Backend | Return the error code, message, details, and request ID. Map the category to the HTTP status in §2.1.1. Do not reveal stack traces or internal implementation details. |
| 6 | UI | Display an actionable notification. Show field-level errors next to the relevant fields where possible. Do not claim success when the outcome is unknown. |
| 7 | UI / Worker | Allow retry only when it is safe and, for write operations, idempotent. Honor `retry_after`. If retry is not safe, end the use case with a clear final state. |

Additional rules:

- **Idempotency:** Write operations that can be retried should accept an idempotency key, or the UI must verify current state before resubmitting. This is especially important for registration, submission, and password change.
- **Unknown outcome:** After a network failure, the UI must not assume success or failure. It must check the relevant state before retrying.
- **Account enumeration:** Do not reveal whether a username or email exists unless the product explicitly accepts that trade-off. If registration or login must return a generic message, state that in the exception flow.
- **Asynchronous processing:** For worker and dispatcher use cases, “UI” steps may be replaced by monitoring, alerting, or recovery steps. Do not acknowledge a queue message until the result is durable.
- **One place for HTTP mapping:** Keep the category-to-status mapping here or in a single shared reference. Do not maintain conflicting mappings in several documents.

### 2.4. Exception Flow Block Requirements

Use this heading format:

`**E<N> – ERR-<CAT>-<NNN>: <Title>**`

Every exception flow must state:

1. **Detection point** — the main-flow step or external event where the error is detected.
2. **System action** — what the system stops, rejects, retries, or recovers.
3. **Data outcome** — whether data was created, rolled back, left pending, or preserved.
4. **User-visible result** — the notification and the next step the actor can take.
5. **Retry/end state** — whether retry is allowed, and whether the use case ends or rejoins the main flow.

If the same exception condition appears in several use cases, reference a shared common exception block rather than duplicating the text. Duplicated blocks drift out of sync.

### 2.5. Alternative Flow Block Requirements

Use this heading format:

`**A<N> – <Title>**`

Every alternative flow must state:

1. **Branch point** — the main-flow step or external event where the actor chooses the alternative.
2. **Valid outcome** — what the actor does and how the system responds.
3. **Rejoin/end state** — where the flow continues, or that the use case ends.

Alternative flows must not contain error codes or describe system failures.

---

## 3. Quality Checklist

Use this checklist before marking a specification as `In Review` or `Approved`.

- [ ] The use case ID, name, actors, priority, and status match the catalog.
- [ ] The version and change history are updated.
- [ ] The trigger is stated.
- [ ] Every precondition is true before the use case starts and is not re-validated as a flow step.
- [ ] Success and failure postconditions are both stated.
- [ ] Main-flow steps are numbered sequentially and contain one action each.
- [ ] Every step names the responsible actor, `System`, or `UI`.
- [ ] Every alternative and exception flow states its branch point and rejoin/end point.
- [ ] Alternative flows are valid outcomes and contain no error codes.
- [ ] Every exception flow has a unique code, detection point, data outcome, user-visible result, and retry/end state.
- [ ] Every error code follows `ERR-<CAT>-<NNN>` and is used for exactly one condition.
- [ ] New or changed codes are recorded in the central registry when one exists.
- [ ] No passwords, tokens, secrets, full source code, hidden test data, or unnecessary personal data appear in logs or error responses.
- [ ] User-facing use cases use logical terms; concrete technologies appear only in system use cases or Internal Processing Notes.
- [ ] Cross-references use the form `UC-... – Name`.
- [ ] Related requirements, assumptions, special requirements, and open issues are recorded where applicable.

---

## 4. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial structure, error categories, and general error handling. |
| 1.1 | 2026-11-13 | Expanded required fields; added ID/file-naming rules, flow-writing rules, abstraction guidance, copy-paste template, response shape, exception/alternative block requirements, quality checklist, and category boundaries. Added `ERR-CONFLICT`; clarified one-code-per-condition allocation. Fixed typographical errors. |
