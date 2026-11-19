# SubmissionPostgresStore — Subsystem Element Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Subsystem element specification |
| Element | `SubmissionPostgresStore` |
| Owning subsystem | Persistence Subsystem (Go) |
| Classifier kind | Class |
| Realized interface | [SubmissionStore](../../../../../ClassDiagram/DesignClassSpecification/SubmissionModule/SubmissionStore.md) |
| Interface-facing specification | [SubmissionPostgresStore](../../../SubsystemInterfaceDesign/PersistenceSubsystem/SubmissionPostgresStore.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-19 |

## 1. Identification

`SubmissionPostgresStore` realizes `SubmissionStore`. It owns Submission/outbox creation, Submission judging transitions, terminal result transactions, queries, and recovery state writes.

## 2. Attribute Design

| Name | Data type | Visibility | Scope | Default value | Description |
|---|---|---|---|---|---|
| `db` | `PostgresDB` | Private | Instance | — | Pooled SQL database used for transactions and read queries. |

## 3. Operation Design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|---|---|---|---|---|
| `StoreSubmissionAndEvent(ctx: context.Context, submission: *Submission, event: *OutboxEvent)` | `error` | Public | Instance | Atomically inserts Submission and outbox event. |
| `LoadSubmission(ctx: context.Context, id: SubmissionID)` | `(*Submission, error)` | Public | Instance | Loads one Submission aggregate. |
| `LoadSubmissionContext(ctx: context.Context, id: SubmissionID)` | `(*JudgeContext, error)` | Public | Instance | Loads Submission, Problem, and ordered case context. |
| `ReadSubmissionStatus(ctx: context.Context, id: SubmissionID)` | `(*SubmissionStatusResponse, error)` | Public | Instance | Reads status/timestamp projection. |
| `ReadSubmissionResult(ctx: context.Context, id: SubmissionID)` | `(*SubmissionDetailsResponse, error)` | Public | Instance | Reads stored terminal result. |
| `ReadSubmissionDetails(ctx: context.Context, id: SubmissionID)` | `(*SubmissionDetailsResponse, error)` | Public | Instance | Reads stored Submission details. |
| `QuerySubmissionSummaries(ctx: context.Context, filter: SubmissionFilter, page: PageQuery)` | `(PageResult[SubmissionSummary], error)` | Public | Instance | Queries administrative summaries. |
| `ReadOwnSubmissionSummaries(ctx: context.Context, userID: AccountID, page: PageQuery)` | `(PageResult[SubmissionSummary], error)` | Public | Instance | Queries a caller's summaries. |
| `PersistTerminalResult(ctx: context.Context, result: *JudgeResult)` | `error` | Public | Instance | Atomically stores terminal verdict and case results. |
| `PersistInternalError(ctx: context.Context, id: SubmissionID, reason: string)` | `error` | Public | Instance | Atomically stores an internal-error outcome. |
| `MarkInternalError(ctx: context.Context, id: SubmissionID, reason: string)` | `error` | Public | Instance | Marks a Submission internally failed. |
| `ResetToQueued(ctx: context.Context, id: SubmissionID)` | `error` | Public | Instance | Resets an interrupted Submission to queued. |
| `UpdateStatus(ctx: context.Context, id: SubmissionID, status: SubmissionStatus)` | `error` | Public | Instance | Updates only the Submission status. |
| `IncrementAttemptAndSetCompiling(ctx: context.Context, id: SubmissionID)` | `error` | Public | Instance | Atomically increments attempt and begins compilation. |
| `SetRunning(ctx: context.Context, id: SubmissionID)` | `error` | Public | Instance | Atomically moves a Submission to running. |
| `RollBackUncommittedChanges(ctx: context.Context)` | `error` | Public | Instance | Rolls back an open Submission transaction. |

## 4. Parameter Design

### `StoreSubmissionAndEvent(ctx: context.Context, submission: *Submission, event: *OutboxEvent)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Cancellation and deadline. |
| `submission` | `*Submission` | — | in | Submission to insert. |
| `event` | `*OutboxEvent` | — | in | Matching outbox event. |

### `LoadSubmission(ctx: context.Context, id: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Cancellation and deadline. |
| `id` | `SubmissionID` | — | in | Submission identifier. |

### `LoadSubmissionContext(ctx: context.Context, id: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Cancellation and deadline. |
| `id` | `SubmissionID` | — | in | Submission identifier. |

### `ReadSubmissionStatus(ctx: context.Context, id: SubmissionID)` and `ReadSubmissionResult(ctx: context.Context, id: SubmissionID)` and `ReadSubmissionDetails(ctx: context.Context, id: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Cancellation and deadline. |
| `id` | `SubmissionID` | — | in | Submission identifier. |

### `QuerySubmissionSummaries(ctx: context.Context, filter: SubmissionFilter, page: PageQuery)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Cancellation and deadline. |
| `filter` | `SubmissionFilter` | — | in | Submission filters. |
| `page` | `PageQuery` | — | in | Pagination and sorting. |

### `ReadOwnSubmissionSummaries(ctx: context.Context, userID: AccountID, page: PageQuery)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Cancellation and deadline. |
| `userID` | `AccountID` | — | in | Account owner. |
| `page` | `PageQuery` | — | in | Pagination and sorting. |

### `PersistTerminalResult(ctx: context.Context, result: *JudgeResult)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Cancellation and deadline. |
| `result` | `*JudgeResult` | — | in | Verdict, metrics, case results, and bounded compiler output. |

### `PersistInternalError(ctx: context.Context, id: SubmissionID, reason: string)` and `MarkInternalError(ctx: context.Context, id: SubmissionID, reason: string)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Cancellation and deadline. |
| `id` | `SubmissionID` | — | in | Submission identifier. |
| `reason` | `string` | — | in | User-safe internal-error reason. |

### `ResetToQueued(ctx: context.Context, id: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Cancellation and deadline. |
| `id` | `SubmissionID` | — | in | Submission identifier. |

### `UpdateStatus(ctx: context.Context, id: SubmissionID, status: SubmissionStatus)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Cancellation and deadline. |
| `id` | `SubmissionID` | — | in | Submission identifier. |
| `status` | `SubmissionStatus` | — | in | New lifecycle status. |

### `IncrementAttemptAndSetCompiling(ctx: context.Context, id: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Cancellation and deadline. |
| `id` | `SubmissionID` | — | in | Submission identifier. |

### `SetRunning(ctx: context.Context, id: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Cancellation and deadline. |
| `id` | `SubmissionID` | — | in | Submission identifier. |

### `RollBackUncommittedChanges(ctx: context.Context)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Cancellation and deadline. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-SYS-003` | PostgreSQL connection, query, transaction, or scan failure. | Roll back and return no partial state/result. | [SD-PERS-Submission](../Diagram/SD-PERS-Submission.md) |
| Not found | Submission row is absent. | Return not-found for recovery and query operations. | [SD-PERS-Submission](../Diagram/SD-PERS-Submission.md) |
| Stale/terminal conflict | A conditional state update affects zero rows or overwrites terminal evidence. | Return conflict and preserve committed state. | [SD-PERS-Submission](../Diagram/SD-PERS-Submission.md) |
| Constraint violation | Source, status, verdict, attempt, or FK invariant fails. | Map to validation/conflict behavior without SQL details. | [SD-PERS-Submission](../Diagram/SD-PERS-Submission.md) |

## 6. Method

`StoreSubmissionAndEvent` begins one transaction, inserts the Submission and matching `outbox_events` row, and commits together.

`LoadSubmissionContext` loads the Submission, retained problem context, and ordered test-case metadata; it never reads protected file contents. Query methods apply ownership/filter/page predicates and stable ordering.

`PersistTerminalResult` updates the Submission verdict/status/metrics and replaces or inserts its executed `submission_test_case_results` in one transaction. It does not acknowledge a queue entry and does not expose hidden test data.

`PersistInternalError` and `MarkInternalError` set terminal internal-error state and reason once, while `ResetToQueued` conditionally requeues only interrupted `COMPILING`/`RUNNING` rows.

`IncrementAttemptAndSetCompiling` atomically increments `judge_attempts` and sets `COMPILING`; it rejects attempts beyond two. `SetRunning` sets `RUNNING` and starts the run timestamp. `UpdateStatus` is a constrained status-only transition. `RollBackUncommittedChanges` rolls back the adapter's current transaction only.

## 7. Other Diagrams

- [Submission persistence family](../Diagram/SD-PERS-Submission.md)
