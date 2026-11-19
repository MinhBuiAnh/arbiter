# SubmissionPostgresStore — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `SubmissionPostgresStore` |
| Classifier kind | Class |
| Package / subsystem | `Persistence Subsystem (Go)` |
| DCD alias | `PSSubmissionStore` |
| Design class diagram | [DesignClassDiagram.md](../../../../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../../../ClassDiagram/Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`SubmissionPostgresStore` is a class in the `Persistence Subsystem (Go)` package/subsystem of the design class diagram.

PostgreSQL adapter that realizes `SubmissionStore`.

- Declared outgoing design relationships: `SubmissionStore`.
- Realizes: `SubmissionStore`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|---|---|---|---|---|---|
| `db` | `PostgresDB` | Private | Instance | — | Pooled PostgreSQL database used for Submission and judging transactions. |

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|---|---|---|---|---|
| `StoreSubmissionAndEvent(ctx: context.Context, submission: *Submission, event: *OutboxEvent)` | `error` | Public | Instance | Inserts Submission and outbox event atomically. |
| `LoadSubmission(ctx: context.Context, id: SubmissionID)` | `(*Submission, error)` | Public | Instance | Loads one Submission. |
| `LoadSubmissionContext(ctx: context.Context, id: SubmissionID)` | `(*JudgeContext, error)` | Public | Instance | Loads judging context. |
| `ReadSubmissionStatus(ctx: context.Context, id: SubmissionID)` | `(*SubmissionStatusResponse, error)` | Public | Instance | Reads status projection. |
| `ReadSubmissionResult(ctx: context.Context, id: SubmissionID)` | `(*SubmissionDetailsResponse, error)` | Public | Instance | Reads terminal result. |
| `ReadSubmissionDetails(ctx: context.Context, id: SubmissionID)` | `(*SubmissionDetailsResponse, error)` | Public | Instance | Reads details projection. |
| `QuerySubmissionSummaries(ctx: context.Context, filter: SubmissionFilter, page: PageQuery)` | `(PageResult[SubmissionSummary], error)` | Public | Instance | Queries administrative summaries. |
| `ReadOwnSubmissionSummaries(ctx: context.Context, userID: AccountID, page: PageQuery)` | `(PageResult[SubmissionSummary], error)` | Public | Instance | Queries own summaries. |
| `PersistTerminalResult(ctx: context.Context, result: *JudgeResult)` | `error` | Public | Instance | Atomically persists terminal result and case rows. |
| `PersistInternalError(ctx: context.Context, id: SubmissionID, reason: string)` | `error` | Public | Instance | Persists internal error. |
| `MarkInternalError(ctx: context.Context, id: SubmissionID, reason: string)` | `error` | Public | Instance | Marks Submission internally failed. |
| `ResetToQueued(ctx: context.Context, id: SubmissionID)` | `error` | Public | Instance | Requeues interrupted work. |
| `UpdateStatus(ctx: context.Context, id: SubmissionID, status: SubmissionStatus)` | `error` | Public | Instance | Updates status. |
| `IncrementAttemptAndSetCompiling(ctx: context.Context, id: SubmissionID)` | `error` | Public | Instance | Increments attempt and starts compilation. |
| `SetRunning(ctx: context.Context, id: SubmissionID)` | `error` | Public | Instance | Sets Running. |
| `RollBackUncommittedChanges(ctx: context.Context)` | `error` | Public | Instance | Rolls back current transaction. |

## 4. Parameter design

All operations receive `ctx: context.Context`; remaining parameters are the exact DCD signature parameters. Source code and hidden test data are never included in normal result errors.

## 5. Exception

See [SD-PERS-Submission](../../SubsystemDesign/PersistenceSubsystem/Diagram/SD-PERS-Submission.md) for transaction, not-found, conflict, rollback, and `ERR-SYS-003` paths.

## 6. Method

Uses `db` for submission/outbox and terminal-result transactions, conditional status transitions, context loads, and bounded user/admin queries. See [SubmissionPostgresStore](../../SubsystemDesign/PersistenceSubsystem/Specification/SubmissionPostgresStore.md).

## 7. Other diagrams

[SD-PERS-Submission](../../SubsystemDesign/PersistenceSubsystem/Diagram/SD-PERS-Submission.md)
