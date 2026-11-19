# Persistence Subsystem Design

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Persistence subsystem design |
| Owning subsystem | Persistence Subsystem (Go) |
| DCD | [DesignClassDiagram.md](../../../../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Subsystem Design Ruleset](../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-19 |

## 1. Responsibility

The Persistence Subsystem realizes the account, problem, test-case, submission, progress, and outbox module ports with PostgreSQL adapters. It owns SQL transactions, optimistic-concurrency checks, row-to-domain mapping, and database error translation. It does not own queue delivery, protected-file content, judge policies, or HTTP concerns.

The subsystem is an internal part of the modular monolith, not a separately deployed service. PostgreSQL is the source of truth for durable application data.

## 2. Realized Interfaces

| Realized interface | PostgreSQL adapter | Internal operation families | Sequence diagram |
|---|---|---|---|
| `AccountStore` | `AccountPostgresStore` | Account lookup, existence, write/status, and projection operations | [SD-PERS-Account](Diagram/SD-PERS-Account.md) |
| `ProblemStore` | `ProblemPostgresStore` | Problem aggregate, state, public browse/read, and statistics operations | [SD-PERS-Problem](Diagram/SD-PERS-Problem.md) |
| `TestCaseRepository` | `TestCasePostgresRepository` | Test-case lookup, set mutation, ordering, type, and version operations | [SD-PERS-TestCase](Diagram/SD-PERS-TestCase.md) |
| `SubmissionStore` | `SubmissionPostgresStore` | Submission/outbox transaction, judging context, terminal writes, recovery, and queries | [SD-PERS-Submission](Diagram/SD-PERS-Submission.md) |
| `ProgressStore` | `ProgressPostgresStore` | Activity, aggregate, and leaderboard reads | [SD-PERS-Progress](Diagram/SD-PERS-Progress.md) |
| `OutboxStore` | `OutboxPostgresStore` | Pending-event scan and publication timestamp update | [SD-PERS-Outbox](Diagram/SD-PERS-Outbox.md) |

## 3. Internal Elements

| Element | Kind | Responsibility | Specification |
|---|---|---|---|
| `AccountPostgresStore` | Class | Realizes `AccountStore` against the account tables. | [AccountPostgresStore.md](Specification/AccountPostgresStore.md) |
| `ProblemPostgresStore` | Class | Realizes `ProblemStore` against problem, tag, language, and derived-statistic reads. | [ProblemPostgresStore.md](Specification/ProblemPostgresStore.md) |
| `TestCasePostgresRepository` | Class | Realizes `TestCaseRepository` with test-case-set version and ordinal invariants. | [TestCasePostgresRepository.md](Specification/TestCasePostgresRepository.md) |
| `SubmissionPostgresStore` | Class | Realizes `SubmissionStore`, including transaction boundaries and judging writes. | [SubmissionPostgresStore.md](Specification/SubmissionPostgresStore.md) |
| `ProgressPostgresStore` | Class | Realizes `ProgressStore` with aggregate reads. | [ProgressPostgresStore.md](Specification/ProgressPostgresStore.md) |
| `OutboxPostgresStore` | Class | Realizes `OutboxStore` for pending event dispatch. | [OutboxPostgresStore.md](Specification/OutboxPostgresStore.md) |

The interface-facing specifications remain under [Subsystem Interface Design](../../SubsystemInterfaceDesign/PersistenceSubsystem/).

## 4. Dependencies

| Source element | Target interface or package | Reason | Kind | Exception justification |
|---|---|---|---|---|
| `PostgresDB` adapters | PostgreSQL driver/SQL package | Acquire pooled connections, execute queries, and manage transactions. | Allowed exception | The DCD defines no lower-level PostgreSQL subsystem interface; direct use is confined to this subsystem. |
| Each PostgreSQL adapter | Go standard-library `context` package | Propagate cancellation and deadlines to database calls. | Package | — |
| `ProblemPostgresStore` | Test-case-set and problem tables | Read publication, public detail, submission context, and statistics projections. | Package | Database table package is part of the Persistence Subsystem. |
| `SubmissionPostgresStore` | Submission, outbox, and test-case-result tables | Enforce submission/outbox and terminal-result transaction boundaries. | Package | Database table package is part of the Persistence Subsystem. |

## 5. Shared Persistence Rules

- PostgreSQL operations receive `context.Context` and stop before or after a database call when the context is canceled.
- Read operations return an explicit not-found result only for their declared missing-row case; unexpected SQL and connectivity failures map to `ERR-SYS-003`.
- Mutations begin a transaction when more than one row/table or an invariant is involved. No partial mutation is reported as success.
- Optimistic updates compare `expectedVersion` or set versions in `UPDATE` predicates and verify affected-row count. A mismatch maps to `ERR-CONFLICT-*` behavior defined by the consuming module.
- Unique and check constraint violations map to the declared validation/conflict outcome rather than raw SQL details.
- Every adapter closes rows, releases transactions, and returns no entity data from an incomplete read.
- SQL text and row data are not logged. Credential hashes and source code are excluded from normal logs and error text.
- PostgreSQL server credentials and DSNs are deployment configuration; no credentials appear in this design or in returned domain objects.

## 6. Transaction Boundaries

| Operation family | Boundary |
|---|---|
| Account insert/status/profile writes | Single account update; status version check and status actor update are atomic. |
| Problem aggregate/state writes | Problem and normalized tags/languages are inserted or updated in one transaction; state versions are checked in-row. |
| Test-case create/update/delete/reorder/type | Test-case-set version, ordinals, and test-case rows are atomic. |
| Submission create | Submission and matching outbox event are inserted atomically. |
| Terminal judging result | Submission state/verdict/metrics and executed case rows are written atomically. |
| Outbox publication marker | One event update with its unpublished predicate. |

## 7. Failure Ownership

| Outcome | Subsystem behavior | Caller responsibility |
|---|---|---|
| `ERR-SYS-003` | Return a persistence error for connection, transaction, query, or scan failures. | Retry or report internal failure; do not accept partial state. |
| Optimistic conflict | Return a conflict or stale-write result after affected-row count is zero. | Reload current state and ask the caller to retry. |
| Not found | Return the domain/store not-found result for a missing required row. | Apply module-specific resource-not-found behavior. |
| Constraint violation | Map unique/check/FK violations to validation or conflict results, with no SQL-sensitive detail. | Display only module-safe field or conflict information. |
| Context canceled | Roll back an open transaction and return `ctx.Err()` or a caller-mapped persistence error. | Stop the operation and leave work retryable. |

## 8. Owned Sequence Diagrams

- [Account adapters](Diagram/SD-PERS-Account.md)
- [Problem adapter](Diagram/SD-PERS-Problem.md)
- [Test-case adapter](Diagram/SD-PERS-TestCase.md)
- [Submission adapter](Diagram/SD-PERS-Submission.md)
- [Progress adapter](Diagram/SD-PERS-Progress.md)
- [Outbox adapter](Diagram/SD-PERS-Outbox.md)
