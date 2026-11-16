# ProgressStore — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ProgressStore` |
| Classifier kind | Interface |
| Package / subsystem | `Progress Module (Go)` |
| DCD alias | `PRGProgressStore` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ProgressStore` is an interface in the `Progress Module (Go)` package/subsystem of the design class diagram.

Read port for user statistics and leaderboard projections.

- Declared outgoing design relationships: `UserStatistics`, `LeaderboardEntry`.
- Declared incoming design relationships: `ProgressService`, `ProgressPostgresStore`.
- Realized by: `ProgressPostgresStore`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `ReadUserActivitySummary(ctx: context.Context, userID: AccountID)` | `(*UserStatistics, error)` | Public | Instance | Returns the activity counts, breakdowns, and recent submissions for the user. |
| `ReadLeaderboard(ctx: context.Context, page: PageQuery)` | `(PageResult[LeaderboardEntry], error)` | Public | Instance | Returns the requested leaderboard page. |
| `ReadSubmissionAndProblemAggregates(ctx: context.Context, userID: AccountID)` | `(*UserStatistics, error)` | Public | Instance | Reads the submission and problem aggregates used to derive user statistics. |

## 4. Parameter design

### `ReadUserActivitySummary(ctx: context.Context, userID: AccountID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `userID` | `AccountID` | — | in | Identifies the target account. |

### `ReadLeaderboard(ctx: context.Context, page: PageQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `page` | `PageQuery` | — | in | Supplies pagination and sort criteria. |

### `ReadSubmissionAndProblemAggregates(ctx: context.Context, userID: AccountID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `userID` | `AccountID` | — | in | Identifies the target account. |

## 5. Exception

None identified in the referenced sequence diagrams.

## 6. Method

### `ReadUserActivitySummary(ctx: context.Context, userID: AccountID)`

Returns the activity counts, breakdowns, and recent submissions for the user. It is implemented by `ProgressPostgresStore`. It is called by `ProgressService`. It uses `ctx`, `userID`. It returns `(*UserStatistics, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ReadLeaderboard(ctx: context.Context, page: PageQuery)`

Returns the requested leaderboard page. It is implemented by `ProgressPostgresStore`. It is called by `ProgressService`. It uses `ctx`, `page`. It returns `(PageResult[LeaderboardEntry], error)`. Failures are returned through the declared error result rather than as a successful value.

### `ReadSubmissionAndProblemAggregates(ctx: context.Context, userID: AccountID)`

Reads the submission and problem aggregates used to derive user statistics. It is implemented by `ProgressPostgresStore`. It is called by `ProgressService`. It uses `ctx`, `userID`. It returns `(*UserStatistics, error)`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
