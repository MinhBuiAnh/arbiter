# ProgressPostgresStore — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ProgressPostgresStore` |
| Classifier kind | Class |
| Package / subsystem | `Persistence Subsystem (Go)` |
| DCD alias | `PSProgressStore` |
| Design class diagram | [DesignClassDiagram.md](../../../../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../../../ClassDiagram/Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ProgressPostgresStore` is a class in the `Persistence Subsystem (Go)` package/subsystem of the design class diagram.

PostgreSQL adapter that realizes `ProgressStore`.

- Declared outgoing design relationships: `ProgressStore`.
- Realizes: `ProgressStore`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|---|---|---|---|---|---|
| `db` | `PostgresDB` | Private | Instance | — | Pooled PostgreSQL database used for aggregate reads. |

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|---|---|---|---|---|
| `ReadUserActivitySummary(ctx: context.Context, userID: AccountID)` | `(*UserStatistics, error)` | Public | Instance | Reads activity summary. |
| `ReadLeaderboard(ctx: context.Context, page: PageQuery)` | `(PageResult[LeaderboardEntry], error)` | Public | Instance | Reads leaderboard page. |
| `ReadSubmissionAndProblemAggregates(ctx: context.Context, userID: AccountID)` | `(*UserStatistics, error)` | Public | Instance | Reads aggregate source counts. |

## 4. Parameter design

All operations receive `ctx: context.Context`; `Read...` operations use the exact DCD `userID` or `page` parameter.

## 5. Exception

See [SD-PERS-Progress](../../SubsystemDesign/PersistenceSubsystem/Diagram/SD-PERS-Progress.md) for aggregate/query and `ERR-SYS-003` paths.

## 6. Method

Uses bounded SQL aggregate queries and maps only public progress projections. See [ProgressPostgresStore](../../SubsystemDesign/PersistenceSubsystem/Specification/ProgressPostgresStore.md).

## 7. Other diagrams

[SD-PERS-Progress](../../SubsystemDesign/PersistenceSubsystem/Diagram/SD-PERS-Progress.md)
