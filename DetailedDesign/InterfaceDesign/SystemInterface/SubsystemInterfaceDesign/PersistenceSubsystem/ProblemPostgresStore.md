# ProblemPostgresStore — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ProblemPostgresStore` |
| Classifier kind | Class |
| Package / subsystem | `Persistence Subsystem (Go)` |
| DCD alias | `PSProblemStore` |
| Design class diagram | [DesignClassDiagram.md](../../../../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../../../ClassDiagram/Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ProblemPostgresStore` is a class in the `Persistence Subsystem (Go)` package/subsystem of the design class diagram.

PostgreSQL adapter that realizes `ProblemStore`.

- Declared outgoing design relationships: `ProblemStore`.
- Realizes: `ProblemStore`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|---|---|---|---|---|---|
| `db` | `PostgresDB` | Private | Instance | — | Pooled PostgreSQL database used for problem and collection operations. |

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|---|---|---|---|---|
| `FindProblem(ctx: context.Context, id: ProblemID)` | `(*Problem, error)` | Public | Instance | Loads a problem aggregate. |
| `SaveProblem(ctx: context.Context, problem: *Problem)` | `error` | Public | Instance | Inserts problem and collections atomically. |
| `UpdateProblem(ctx: context.Context, problem: *Problem, expectedVersion: int)` | `error` | Public | Instance | Performs a version-checked update. |
| `SaveProblemState(ctx: context.Context, id: ProblemID, state: LifecycleStatus, expectedVersion: int)` | `error` | Public | Instance | Updates lifecycle state. |
| `SavePublicationState(ctx: context.Context, id: ProblemID, state: PublicationStatus, expectedVersion: int)` | `error` | Public | Instance | Updates publication state. |
| `ReadProblemState(ctx: context.Context, id: ProblemID)` | `(*ProblemState, error)` | Public | Instance | Reads problem state and version. |
| `ListPublishedProblems(ctx: context.Context, query: ProblemQuery)` | `(PageResult[Problem], error)` | Public | Instance | Lists published problems. |
| `SearchPublishedProblems(ctx: context.Context, query: ProblemQuery)` | `(PageResult[Problem], error)` | Public | Instance | Searches published problems. |
| `ReadPublicProblem(ctx: context.Context, id: ProblemID)` | `(*ProblemDetails, error)` | Public | Instance | Reads public problem details. |
| `ReadProblemForSubmission(ctx: context.Context, id: ProblemID)` | `(*ProblemSubmissionContext, error)` | Public | Instance | Reads submission validation context. |
| `ReadPublicStatistics(ctx: context.Context, id: ProblemID)` | `(PublicStatistics, error)` | Public | Instance | Reads derived public statistics. |

## 4. Parameter design

All operations receive `ctx: context.Context`; operation parameters are the exact DCD signature parameters. The spec returns no private SQL or protected test-case content.

## 5. Exception

See [SD-PERS-Problem](../../SubsystemDesign/PersistenceSubsystem/Diagram/SD-PERS-Problem.md) for read, state, transaction, conflict, and `ERR-SYS-003` paths.

## 6. Method

Uses `db` for bounded reads and transactions; problem, tags, languages, and state changes commit atomically where grouped. Version predicates detect stale writes. See [ProblemPostgresStore](../../SubsystemDesign/PersistenceSubsystem/Specification/ProblemPostgresStore.md).

## 7. Other diagrams

[SD-PERS-Problem](../../SubsystemDesign/PersistenceSubsystem/Diagram/SD-PERS-Problem.md)
