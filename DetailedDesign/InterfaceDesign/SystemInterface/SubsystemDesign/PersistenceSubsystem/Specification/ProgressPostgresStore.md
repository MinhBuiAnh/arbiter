# ProgressPostgresStore — Subsystem Element Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Subsystem element specification |
| Element | `ProgressPostgresStore` |
| Owning subsystem | Persistence Subsystem (Go) |
| Classifier kind | Class |
| Realized interface | [ProgressStore](../../../../../ClassDiagram/DesignClassSpecification/ProgressModule/ProgressStore.md) |
| Interface-facing specification | [ProgressPostgresStore](../../../SubsystemInterfaceDesign/PersistenceSubsystem/ProgressPostgresStore.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-19 |

## 1. Identification

`ProgressPostgresStore` realizes `ProgressStore` by executing activity, aggregate, and leaderboard read queries.

## 2. Attribute Design

| Name | Data type | Visibility | Scope | Default value | Description |
|---|---|---|---|---|---|
| `db` | `PostgresDB` | Private | Instance | — | Pooled SQL database used for aggregate reads. |

## 3. Operation Design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|---|---|---|---|---|
| `ReadUserActivitySummary(ctx: context.Context, userID: AccountID)` | `(*UserStatistics, error)` | Public | Instance | Reads activity, breakdown, and recent-submission views. |
| `ReadLeaderboard(ctx: context.Context, page: PageQuery)` | `(PageResult[LeaderboardEntry], error)` | Public | Instance | Reads and ranks one bounded leaderboard page. |
| `ReadSubmissionAndProblemAggregates(ctx: context.Context, userID: AccountID)` | `(*UserStatistics, error)` | Public | Instance | Reads source submission/problem aggregate counts. |

## 4. Parameter Design

| Operation | Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|---|
| `ReadUserActivitySummary` | `userID` | `AccountID` | — | in | Target account. |
| `ReadLeaderboard` | `page` | `PageQuery` | — | in | Pagination and sorting criteria. |
| `ReadSubmissionAndProblemAggregates` | `userID` | `AccountID` | — | in | Target account. |

All operations receive `ctx: context.Context` as their first in parameter.

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-SYS-003` | PostgreSQL connectivity, query, or scan failure. | Return no partial activity or leaderboard data. | [SD-PERS-Progress](../Diagram/SD-PERS-Progress.md) |
| Invalid page | Pagination is out of contract or invalid. | Return validation error before querying. | [SD-PERS-Progress](../Diagram/SD-PERS-Progress.md) |

## 6. Method

Each method executes a read-only query or a bounded set of aggregate queries. `ReadUserActivitySummary` combines counts and recent submissions without exposing source or hidden test data. `ReadLeaderboard` applies stable ranking and bounded pagination. `ReadSubmissionAndProblemAggregates` reads submitted and accepted counts and solved problem counts for the service to assemble.

## 7. Other Diagrams

- [Progress persistence family](../Diagram/SD-PERS-Progress.md)
