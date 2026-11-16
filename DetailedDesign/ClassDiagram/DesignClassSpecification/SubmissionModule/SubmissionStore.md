# SubmissionStore — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `SubmissionStore` |
| Classifier kind | Interface |
| Package / subsystem | `Submission Module (Go)` |
| DCD alias | `SUBSubmissionStore` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`SubmissionStore` is an interface in the `Submission Module (Go)` package/subsystem of the design class diagram.

Persistence port for submissions, judge contexts, results, status transitions, and outbox events.

- Declared outgoing design relationships: `JudgeContext`, `SubmissionFilter`, `SubmissionSummary`, `OutboxEvent`.
- Declared incoming design relationships: `SubmissionCommandService`, `SubmissionQueryService`, `JudgeWorker`, `SubmissionProcessor`, `SubmissionPostgresStore`.
- Realized by: `SubmissionPostgresStore`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `StoreSubmissionAndEvent(ctx: context.Context, submission: *Submission, event: *OutboxEvent)` | `error` | Public | Instance | Writes the submission and its outbox event in one transaction. |
| `LoadSubmission(ctx: context.Context, id: SubmissionID)` | `(*Submission, error)` | Public | Instance | Loads the submission aggregate by identifier. |
| `LoadSubmissionContext(ctx: context.Context, id: SubmissionID)` | `(*JudgeContext, error)` | Public | Instance | Loads the submission, problem context, and ordered test-case metadata for judging. |
| `ReadSubmissionStatus(ctx: context.Context, id: SubmissionID)` | `(*SubmissionStatusResponse, error)` | Public | Instance | Returns the status and timestamp view. |
| `ReadSubmissionResult(ctx: context.Context, id: SubmissionID)` | `(*SubmissionDetailsResponse, error)` | Public | Instance | Returns the stored result view. |
| `ReadSubmissionDetails(ctx: context.Context, id: SubmissionID)` | `(*SubmissionDetailsResponse, error)` | Public | Instance | Returns the stored details view. |
| `QuerySubmissionSummaries(ctx: context.Context, filter: SubmissionFilter, page: PageQuery)` | `(PageResult[SubmissionSummary], error)` | Public | Instance | Returns the administrative page of submission summaries. |
| `ReadOwnSubmissionSummaries(ctx: context.Context, userID: AccountID, page: PageQuery)` | `(PageResult[SubmissionSummary], error)` | Public | Instance | Returns the caller's page of submission summaries. |
| `PersistTerminalResult(ctx: context.Context, result: *JudgeResult)` | `error` | Public | Instance | Writes the terminal verdict, metrics, case results, and compilation output. |
| `PersistInternalError(ctx: context.Context, id: SubmissionID, reason: string)` | `error` | Public | Instance | Writes the internal-error outcome and reason. |
| `MarkInternalError(ctx: context.Context, id: SubmissionID, reason: string)` | `error` | Public | Instance | Marks the submission as internally failed with the reason. |
| `ResetToQueued(ctx: context.Context, id: SubmissionID)` | `error` | Public | Instance | Returns an interrupted submission to `QUEUED` for another attempt. |
| `UpdateStatus(ctx: context.Context, id: SubmissionID, status: SubmissionStatus)` | `error` | Public | Instance | Updates only the submission status. |
| `IncrementAttemptAndSetCompiling(ctx: context.Context, id: SubmissionID)` | `error` | Public | Instance | Increments the attempt count and moves the submission to `COMPILING`. |
| `SetRunning(ctx: context.Context, id: SubmissionID)` | `error` | Public | Instance | Moves the submission to `RUNNING` and records the start time. |
| `RollBackUncommittedChanges(ctx: context.Context)` | `error` | Public | Instance | Rolls back any uncommitted submission changes in the current transaction. |

## 4. Parameter design

### `StoreSubmissionAndEvent(ctx: context.Context, submission: *Submission, event: *OutboxEvent)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `submission` | `*Submission` | — | in | Supplies the submission used by the operation. |
| `event` | `*OutboxEvent` | — | in | Carries the outbox event to publish. |

### `LoadSubmission(ctx: context.Context, id: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `SubmissionID` | — | in | Identifies the target object. |

### `LoadSubmissionContext(ctx: context.Context, id: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `SubmissionID` | — | in | Identifies the target object. |

### `ReadSubmissionStatus(ctx: context.Context, id: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `SubmissionID` | — | in | Identifies the target object. |

### `ReadSubmissionResult(ctx: context.Context, id: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `SubmissionID` | — | in | Identifies the target object. |

### `ReadSubmissionDetails(ctx: context.Context, id: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `SubmissionID` | — | in | Identifies the target object. |

### `QuerySubmissionSummaries(ctx: context.Context, filter: SubmissionFilter, page: PageQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `filter` | `SubmissionFilter` | — | in | Supplies optional filtering criteria. |
| `page` | `PageQuery` | — | in | Supplies pagination and sort criteria. |

### `ReadOwnSubmissionSummaries(ctx: context.Context, userID: AccountID, page: PageQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `userID` | `AccountID` | — | in | Identifies the target account. |
| `page` | `PageQuery` | — | in | Supplies pagination and sort criteria. |

### `PersistTerminalResult(ctx: context.Context, result: *JudgeResult)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `result` | `*JudgeResult` | — | in | Terminal verdict, metrics, case results, and compilation output. |

### `PersistInternalError(ctx: context.Context, id: SubmissionID, reason: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `SubmissionID` | — | in | Identifies the target object. |
| `reason` | `string` | — | in | Supplies the failure reason recorded by the operation. |

### `MarkInternalError(ctx: context.Context, id: SubmissionID, reason: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `SubmissionID` | — | in | Identifies the target object. |
| `reason` | `string` | — | in | Supplies the failure reason recorded by the operation. |

### `ResetToQueued(ctx: context.Context, id: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `SubmissionID` | — | in | Identifies the target object. |

### `UpdateStatus(ctx: context.Context, id: SubmissionID, status: SubmissionStatus)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `SubmissionID` | — | in | Identifies the target object. |
| `status` | `SubmissionStatus` | — | in | Supplies the requested status value. |

### `IncrementAttemptAndSetCompiling(ctx: context.Context, id: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `SubmissionID` | — | in | Identifies the target object. |

### `SetRunning(ctx: context.Context, id: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `SubmissionID` | — | in | Identifies the target object. |

### `RollBackUncommittedChanges(ctx: context.Context)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-RES-005` | Submission not found. | The query is rejected without exposing another user's data. | [SD-UC-U-S-01-ViewSubmissionStatus](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-01-ViewSubmissionStatus.md) |
| `ERR-SYS-001` | Internal system, persistence, or assembly error. | The request fails with an internal error; transactions roll back where applicable. | [SD-UC-U-S-01-ViewSubmissionStatus](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-01-ViewSubmissionStatus.md) |
| `ERR-SYS-003` | PostgreSQL unavailable. | The request fails with an internal error; no partial write is committed. | [SD-UC-SYS-J-01-ProcessSubmission-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md) |

## 6. Method

### `StoreSubmissionAndEvent(ctx: context.Context, submission: *Submission, event: *OutboxEvent)`

Writes the submission and its outbox event in one transaction. It is implemented by `SubmissionPostgresStore`. It is called by `SubmissionCommandService`, `SubmissionQueryService`, `JudgeWorker`, `SubmissionProcessor`. It uses `ctx`, `submission`, `event`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `LoadSubmission(ctx: context.Context, id: SubmissionID)`

Loads the submission aggregate by identifier. It is implemented by `SubmissionPostgresStore`. It is called by `SubmissionCommandService`, `SubmissionQueryService`, `JudgeWorker`, `SubmissionProcessor`. It uses `ctx`, `id`. It returns `(*Submission, error)`. Failures are returned through the declared error result rather than as a successful value.

### `LoadSubmissionContext(ctx: context.Context, id: SubmissionID)`

Loads the submission, problem context, and ordered test-case metadata for judging. It is implemented by `SubmissionPostgresStore`. It is called by `SubmissionCommandService`, `SubmissionQueryService`, `JudgeWorker`, `SubmissionProcessor`. It uses `ctx`, `id`. It returns `(*JudgeContext, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ReadSubmissionStatus(ctx: context.Context, id: SubmissionID)`

Returns the status and timestamp view. It is implemented by `SubmissionPostgresStore`. It is called by `SubmissionCommandService`, `SubmissionQueryService`, `JudgeWorker`, `SubmissionProcessor`. It uses `ctx`, `id`. It returns `(*SubmissionStatusResponse, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ReadSubmissionResult(ctx: context.Context, id: SubmissionID)`

Returns the stored result view. It is implemented by `SubmissionPostgresStore`. It is called by `SubmissionCommandService`, `SubmissionQueryService`, `JudgeWorker`, `SubmissionProcessor`. It uses `ctx`, `id`. It returns `(*SubmissionDetailsResponse, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ReadSubmissionDetails(ctx: context.Context, id: SubmissionID)`

Returns the stored details view. It is implemented by `SubmissionPostgresStore`. It is called by `SubmissionCommandService`, `SubmissionQueryService`, `JudgeWorker`, `SubmissionProcessor`. It uses `ctx`, `id`. It returns `(*SubmissionDetailsResponse, error)`. Failures are returned through the declared error result rather than as a successful value.

### `QuerySubmissionSummaries(ctx: context.Context, filter: SubmissionFilter, page: PageQuery)`

Returns the administrative page of submission summaries. It is implemented by `SubmissionPostgresStore`. It is called by `SubmissionCommandService`, `SubmissionQueryService`, `JudgeWorker`, `SubmissionProcessor`. It uses `ctx`, `filter`, `page`. It returns `(PageResult[SubmissionSummary], error)`. Failures are returned through the declared error result rather than as a successful value.

### `ReadOwnSubmissionSummaries(ctx: context.Context, userID: AccountID, page: PageQuery)`

Returns the caller's page of submission summaries. It is implemented by `SubmissionPostgresStore`. It is called by `SubmissionCommandService`, `SubmissionQueryService`, `JudgeWorker`, `SubmissionProcessor`. It uses `ctx`, `userID`, `page`. It returns `(PageResult[SubmissionSummary], error)`. Failures are returned through the declared error result rather than as a successful value.

### `PersistTerminalResult(ctx: context.Context, result: *JudgeResult)`

Writes the terminal verdict, metrics, case results, and compilation output. It is implemented by `SubmissionPostgresStore`. It is called by `SubmissionCommandService`, `SubmissionQueryService`, `JudgeWorker`, `SubmissionProcessor`. It uses `ctx`, `result`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `PersistInternalError(ctx: context.Context, id: SubmissionID, reason: string)`

Writes the internal-error outcome and reason. It is implemented by `SubmissionPostgresStore`. It is called by `SubmissionCommandService`, `SubmissionQueryService`, `JudgeWorker`, `SubmissionProcessor`. It uses `ctx`, `id`, `reason`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `MarkInternalError(ctx: context.Context, id: SubmissionID, reason: string)`

Marks the submission as internally failed with the reason. It is implemented by `SubmissionPostgresStore`. It is called by `SubmissionCommandService`, `SubmissionQueryService`, `JudgeWorker`, `SubmissionProcessor`. It uses `ctx`, `id`, `reason`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ResetToQueued(ctx: context.Context, id: SubmissionID)`

Returns an interrupted submission to `QUEUED` for another attempt. It is implemented by `SubmissionPostgresStore`. It is called by `SubmissionCommandService`, `SubmissionQueryService`, `JudgeWorker`, `SubmissionProcessor`. It uses `ctx`, `id`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `UpdateStatus(ctx: context.Context, id: SubmissionID, status: SubmissionStatus)`

Updates only the submission status. It is implemented by `SubmissionPostgresStore`. It is called by `SubmissionCommandService`, `SubmissionQueryService`, `JudgeWorker`, `SubmissionProcessor`. It uses `ctx`, `id`, `status`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `IncrementAttemptAndSetCompiling(ctx: context.Context, id: SubmissionID)`

Increments the attempt count and moves the submission to `COMPILING`. It is implemented by `SubmissionPostgresStore`. It is called by `SubmissionCommandService`, `SubmissionQueryService`, `JudgeWorker`, `SubmissionProcessor`. It uses `ctx`, `id`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `SetRunning(ctx: context.Context, id: SubmissionID)`

Moves the submission to `RUNNING` and records the start time. It is implemented by `SubmissionPostgresStore`. It is called by `SubmissionCommandService`, `SubmissionQueryService`, `JudgeWorker`, `SubmissionProcessor`. It uses `ctx`, `id`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `RollBackUncommittedChanges(ctx: context.Context)`

Rolls back any uncommitted submission changes in the current transaction. It is implemented by `SubmissionPostgresStore`. It is called by `SubmissionCommandService`, `SubmissionQueryService`, `JudgeWorker`, `SubmissionProcessor`. It uses `ctx`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
