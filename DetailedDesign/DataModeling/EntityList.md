# Database Entity List

**Arbiter — Online Judge Platform**

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Database entity inventory |
| Basis | [Design Class Diagram](../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Class specifications | [Class Design Specifications](../ClassDiagram/DesignClassSpecification/Index.md) |
| ACD disposition | [DCD traceability, §5.1](../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md#51-acd-class-disposition) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-17 |

## 1. Purpose and Scope

This inventory identifies the design Entity classes whose state must be durable in the relational database. It is based on the Entity dispositions in the DCD and the read/write contracts of the database persistence ports. It identifies logical persisted entities and ownership, not a physical table schema; table names, normalization, keys, and column types are to be decided in the data model.

An Entity-derived classifier is included as a database entity when its state is explicitly saved, updated, or loaded through a database persistence port. A projection or value object is not treated as an independent database entity merely because it is returned by a database-backed query.

## 2. Database-Persisted Entities

| Design class | ACD entity | Persistence and storage basis |
|---|---|---|
| [`Account`](../ClassDiagram/DesignClassSpecification/AccountModule/Account.md) | Account | Account aggregate persisted by `AccountStore` (`SaveAccount`, account lookup and update operations), realized by `AccountPostgresStore`. Credential hash and account status/profile attributes belong to this persisted aggregate; sensitive fields must not be exposed in API projections. |
| [`Problem`](../ClassDiagram/DesignClassSpecification/CatalogModule/Problem.md) | Problem | Problem aggregate persisted and updated by `ProblemStore` (`SaveProblem`, `UpdateProblem`, and lifecycle/publication state updates), realized by `ProblemPostgresStore`. Lifecycle, publication, version, and problem metadata are durable state. |
| [`TestCase`](../ClassDiagram/DesignClassSpecification/TestCaseModule/TestCase.md) | Test Case | Test-case metadata is inserted, updated, queried, reordered, and deleted through `TestCaseRepository`, realized by `TestCasePostgresRepository`. This includes the case's protected-file references. The input and expected-output contents are stored by `TestCaseStore` in the protected file store, not in the database. |
| [`TestCaseSet`](../ClassDiagram/DesignClassSpecification/TestCaseModule/TestCaseSet.md) | Test Case | Persist its set version and ordered membership as part of the test-case data managed by `TestCaseRepository` (`ReadTestCaseSet`, `SaveTestCaseOrder`, and `ReadTestCaseSetVersion`). It is a logical aggregate over its `TestCase` records; the DCD does not require a separate physical table. |
| [`Submission`](../ClassDiagram/DesignClassSpecification/SubmissionModule/Submission.md) | Submission | Submission aggregate persisted by `SubmissionStore` (`StoreSubmissionAndEvent`, status/recovery operations, and terminal-result operations), realized by `SubmissionPostgresStore`. Source, lifecycle status, verdict, attempts, timestamps, metrics, and retained problem summary are durable submission state. |
| [`TestCaseResult`](../ClassDiagram/DesignClassSpecification/SubmissionModule/TestCaseResult.md) | Test Case Result | Persist each executed case result as an owned part of its `Submission`. `Submission` composes zero or more `TestCaseResult` records, and `SubmissionStore.PersistTerminalResult` persists case results with the terminal result. The DCD does not prescribe whether they are separate rows or an embedded representation. |
| [`OutboxEvent`](../ClassDiagram/DesignClassSpecification/OutboxModule/OutboxEvent.md) | Outbox Event | Durable outbox record persisted atomically with a new submission and managed through `OutboxStore` (`FindUnpublishedEvents`, `MarkEventPublished`), realized by `OutboxPostgresStore`. Its publication timestamp is updated after queue publication. |

## 3. Not Separate Database Entities

The following Entity-derived or supporting design classes are not included as independent database entities because the DCD/specifications identify them as projections, derived data, value objects, or data held outside the database:

| Design class or data | Reason for exclusion as a separate database entity |
|---|---|
| `ProblemState` | State projection of the durable `Problem`; lifecycle/publication state and version are already part of `Problem`. Do not duplicate them in a separate entity without a later schema requirement. |
| `TestCaseData` | Test-case input and expected-output content belongs to the protected file store, not the database. |
| `TestCaseFileRefs` | Carries the references associated with `TestCase`; persist the references with the test-case metadata, not as an independent entity. |
| `TestCaseMetadata` | Read/judge projection of persisted test-case metadata and file references; no independent identity or write lifecycle is specified. |
| `AccountSummary`, `AccountDetails`, `AccountProfile` | Account query projections of the persisted `Account`. |
| `ProblemDetails`, `ProblemSubmissionContext`, `SampleCase`, `PublicStatistics` | Problem-facing projections or derived values assembled from persisted problem, test-case, and submission data. |
| `SubmissionSummary`, `JudgeContext`, `JudgeResult`, `ResultMetrics` | Query, judging, and result-transfer structures. Durable submission state and owned `TestCaseResult` records are persisted instead. |
| `LeaderboardEntry`, `UserStatistics`, `Breakdown` | Progress projections and aggregates read through `ProgressStore`; its contract specifies read operations and derived aggregation, not independent entity writes. |
| `TestCaseSetSummary` | Shared publication-readiness summary derived from test-case set state; it is not an independently persisted entity. |

## 4. Inventory Notes

- The DCD intentionally omits physical database schemas and subsystem internals. This list therefore does not imply a one-class-to-one-table mapping.
- `TestCaseSet` is listed as persisted logical state because the repository contract loads the set and explicitly persists its ordering/version. Its state may be represented by `TestCase` rows and associated set-version data.
- `TestCaseResult` is included because the submission persistence contract explicitly persists per-case results as part of the terminal result. Its physical representation remains a data-modeling decision.
- File references are persisted with test-case metadata as needed to locate protected files; the file contents themselves remain in the protected test-case store.
- Progress, public-statistics, and other query projections should be computed from durable source entities unless a separate materialization/caching requirement is approved.