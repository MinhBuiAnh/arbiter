# ProblemPostgresStore — Subsystem Element Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Subsystem element specification |
| Element | `ProblemPostgresStore` |
| Owning subsystem | Persistence Subsystem (Go) |
| Classifier kind | Class |
| Realized interface | [ProblemStore](../../../../../ClassDiagram/DesignClassSpecification/CatalogModule/ProblemStore.md) |
| Interface-facing specification | [ProblemPostgresStore](../../../SubsystemInterfaceDesign/PersistenceSubsystem/ProblemPostgresStore.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-19 |

## 1. Identification

`ProblemPostgresStore` realizes `ProblemStore` by reading and writing the problem aggregate and normalized tags/languages, preserving optimistic versions and publication invariants.

## 2. Attribute Design

| Name | Data type | Visibility | Scope | Default value | Description |
|---|---|---|---|---|---|
| `db` | `PostgresDB` | Private | Instance | — | Pooled SQL database used for queries and transactions. |

## 3. Operation Design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|---|---|---|---|---|
| `FindProblem(ctx: context.Context, id: ProblemID)` | `(*Problem, error)` | Public | Instance | Loads a problem aggregate. |
| `SaveProblem(ctx: context.Context, problem: *Problem)` | `error` | Public | Instance | Inserts problem and normalized collections. |
| `UpdateProblem(ctx: context.Context, problem: *Problem, expectedVersion: int)` | `error` | Public | Instance | Performs a version-checked aggregate update. |
| `SaveProblemState(ctx: context.Context, id: ProblemID, state: LifecycleStatus, expectedVersion: int)` | `error` | Public | Instance | Updates lifecycle state with optimistic concurrency. |
| `SavePublicationState(ctx: context.Context, id: ProblemID, state: PublicationStatus, expectedVersion: int)` | `error` | Public | Instance | Updates publication state with optimistic concurrency. |
| `ReadProblemState(ctx: context.Context, id: ProblemID)` | `(*ProblemState, error)` | Public | Instance | Reads lifecycle, publication, and version. |
| `ListPublishedProblems(ctx: context.Context, query: ProblemQuery)` | `(PageResult[Problem], error)` | Public | Instance | Lists published active problems. |
| `SearchPublishedProblems(ctx: context.Context, query: ProblemQuery)` | `(PageResult[Problem], error)` | Public | Instance | Filters published active problems. |
| `ReadPublicProblem(ctx: context.Context, id: ProblemID)` | `(*ProblemDetails, error)` | Public | Instance | Reads public detail projection. |
| `ReadProblemForSubmission(ctx: context.Context, id: ProblemID)` | `(*ProblemSubmissionContext, error)` | Public | Instance | Reads submission validation context. |
| `ReadPublicStatistics(ctx: context.Context, id: ProblemID)` | `(PublicStatistics, error)` | Public | Instance | Reads derived public statistics. |

## 4. Parameter Design

| Operation | Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|---|
| `FindProblem` | `id` | `ProblemID` | — | in | Target problem identifier. |
| `SaveProblem` | `problem` | `*Problem` | — | in | Aggregate and collections to persist. |
| `UpdateProblem` | `problem` | `*Problem` | — | in | Updated aggregate. |
| `UpdateProblem` | `expectedVersion` | `int` | — | in | Optimistic version. |
| `SaveProblemState` | `id` | `ProblemID` | — | in | Target problem. |
| `SaveProblemState` | `state` | `LifecycleStatus` | — | in | Target lifecycle state. |
| `SaveProblemState` | `expectedVersion` | `int` | — | in | Optimistic version. |
| `SavePublicationState` | `id` | `ProblemID` | — | in | Target problem. |
| `SavePublicationState` | `state` | `PublicationStatus` | — | in | Target publication state. |
| `SavePublicationState` | `expectedVersion` | `int` | — | in | Optimistic version. |
| `ReadProblemState` | `id` | `ProblemID` | — | in | Target problem. |
| `ListPublishedProblems` | `query` | `ProblemQuery` | — | in | Pagination and browse criteria. |
| `SearchPublishedProblems` | `query` | `ProblemQuery` | — | in | Search and filter criteria. |
| `ReadPublicProblem` | `id` | `ProblemID` | — | in | Target public problem. |
| `ReadProblemForSubmission` | `id` | `ProblemID` | — | in | Problem submission context. |
| `ReadPublicStatistics` | `id` | `ProblemID` | — | in | Target problem. |

All operations receive `ctx: context.Context` as their first in parameter.

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-SYS-003` | PostgreSQL connection, SQL, scan, or transaction failure. | Roll back and return no partial aggregate. | [SD-PERS-Problem](../Diagram/SD-PERS-Problem.md) |
| Not found | Problem or public projection row is absent. | Return a not-found result. | [SD-PERS-Problem](../Diagram/SD-PERS-Problem.md) |
| Optimistic conflict | State or aggregate update affects zero rows. | Return a conflict/stale-write result. | [SD-PERS-Problem](../Diagram/SD-PERS-Problem.md) |
| Constraint violation | Check, unique, or FK invariant fails. | Map to a module-safe validation/conflict outcome. | [SD-PERS-Problem](../Diagram/SD-PERS-Problem.md) |

## 6. Method

`FindProblem` and public read operations load the base row and normalized collections in one transaction or with a consistent snapshot. `SaveProblem` creates the problem, test-case-set row, tags, and allowed languages atomically. `UpdateProblem` replaces mutable scalar fields and refreshes tags/languages while checking `expectedVersion`.

`SaveProblemState` and `SavePublicationState` update one state column and increment `version` only after the expected version matches. `ReadProblemState` returns lifecycle, publication, and version. Browse/search/derived statistics are bounded, indexed reads and return no private hidden test-case content.

## 7. Other Diagrams

- [Problem persistence family](../Diagram/SD-PERS-Problem.md)
