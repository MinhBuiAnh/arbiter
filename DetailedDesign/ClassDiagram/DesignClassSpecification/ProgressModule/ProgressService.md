# ProgressService — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ProgressService` |
| Classifier kind | Class |
| Package / subsystem | `Progress Module (Go)` |
| DCD alias | `PRGProgressService` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ProgressService` is a class in the `Progress Module (Go)` package/subsystem of the design class diagram.

Application service for own statistics and leaderboard queries.

- Declared outgoing design relationships: `ProgressStore`, `UserStatistics`.
- Declared incoming design relationships: `ProgressHandler`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `GetOwnStatistics(ctx: context.Context, principal: Principal)` | `(*UserStatistics, error)` | Public | Instance | Resolves the caller identity and obtains the activity summary for that user. |
| `GetUserActivitySummary(ctx: context.Context, userID: AccountID)` | `(*UserStatistics, error)` | Public | Instance | Reads the user activity projection through `ProgressStore.ReadUserActivitySummary` and fills the derived counts and breakdowns. |
| `GetLeaderboard(ctx: context.Context, page: PageQuery)` | `(PageResult[LeaderboardEntry], error)` | Public | Instance | Validates pagination, reads the leaderboard through `ProgressStore.ReadLeaderboard`, and ranks the returned entries. |
| `CalculateAcceptanceRate(total: int, accepted: int)` | `float64` | Private | Instance | Internal helper that divides `accepted` by `total` and returns zero when `total` is zero. |
| `CalculateAttemptedAndSolvedCounts(rows: []UserStatistics)` | `(int, int)` | Private | Instance | Internal helper that aggregates the attempted and solved values across `rows`. |
| `CalculateDifficultyBreakdown(rows: []UserStatistics)` | `map[Difficulty]Breakdown` | Private | Instance | Internal helper that merges the per-difficulty attempted and solved counts from `rows`. |
| `CalculateTagBreakdown(rows: []UserStatistics)` | `map[string]Breakdown` | Private | Instance | Internal helper that merges the per-tag attempted and solved counts from `rows`. |
| `AssembleRecentSubmissions(rows: []SubmissionSummary)` | `[]SubmissionSummary` | Private | Instance | Internal helper that orders and limits the supplied submission summaries for the recent-submissions view; the exact bound is not specified by the DCD. |
| `RankEntries(entries: []LeaderboardEntry)` | `[]LeaderboardEntry` | Private | Instance | Internal helper that assigns consecutive one-based `Rank` values to the supplied leaderboard entries. |
| `ValidatePagination(page: PageQuery)` | `error` | Private | Instance | Internal helper that checks page number and page size bounds. |

## 4. Parameter design

### `GetOwnStatistics(ctx: context.Context, principal: Principal)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |

### `GetUserActivitySummary(ctx: context.Context, userID: AccountID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `userID` | `AccountID` | — | in | Identifies the target account. |

### `GetLeaderboard(ctx: context.Context, page: PageQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `page` | `PageQuery` | — | in | Supplies pagination and sort criteria. |

### `CalculateAcceptanceRate(total: int, accepted: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `total` | `int` | — | in | Total submission count. |
| `accepted` | `int` | — | in | Accepted submission count. |

### `CalculateAttemptedAndSolvedCounts(rows: []UserStatistics)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `rows` | `[]UserStatistics` | — | in | Statistics rows to aggregate. |

### `CalculateDifficultyBreakdown(rows: []UserStatistics)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `rows` | `[]UserStatistics` | — | in | Statistics rows whose difficulty breakdown is merged. |

### `CalculateTagBreakdown(rows: []UserStatistics)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `rows` | `[]UserStatistics` | — | in | Statistics rows whose tag breakdown is merged. |

### `AssembleRecentSubmissions(rows: []SubmissionSummary)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `rows` | `[]SubmissionSummary` | — | in | Submission summaries to order and limit. |

### `RankEntries(entries: []LeaderboardEntry)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `entries` | `[]LeaderboardEntry` | — | in | Leaderboard rows to rank. |

### `ValidatePagination(page: PageQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `page` | `PageQuery` | — | in | Supplies pagination and sort criteria. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-VAL-005` | Invalid pagination parameters. | The query is rejected without reading or changing state. | [SD-UC-COM-04-ViewLeaderboard](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-04-ViewLeaderboard.md) |
| `ERR-SYS-001` | Internal system, persistence, or assembly error. | The request fails with an internal error; transactions roll back where applicable. | [SD-UC-U-ST-01-ViewOwnStatistics](../../../../ArchitecturalDesign/SequenceDiagram/User/Progress/SD-UC-U-ST-01-ViewOwnStatistics.md) |

## 6. Method

### `GetOwnStatistics(ctx: context.Context, principal: Principal)`

Resolves the caller identity and obtains the activity summary for that user. It uses `ctx`, `principal`. It returns `(*UserStatistics, error)`. Failures are returned through the declared error result rather than as a successful value.

### `GetUserActivitySummary(ctx: context.Context, userID: AccountID)`

Reads the user activity projection through `ProgressStore.ReadUserActivitySummary` and fills the derived counts and breakdowns. It uses `ctx`, `userID`. It returns `(*UserStatistics, error)`. Failures are returned through the declared error result rather than as a successful value.

### `GetLeaderboard(ctx: context.Context, page: PageQuery)`

Validates pagination, reads the leaderboard through `ProgressStore.ReadLeaderboard`, and ranks the returned entries. It uses `ctx`, `page`. It returns `(PageResult[LeaderboardEntry], error)`. Failures are returned through the declared error result rather than as a successful value.

### `CalculateAcceptanceRate(total: int, accepted: int)`

Divides `accepted` by `total` and returns zero when `total` is zero. It uses `total`, `accepted`. It returns `float64`.

### `CalculateAttemptedAndSolvedCounts(rows: []UserStatistics)`

Aggregates the attempted and solved values across `rows`. It uses `rows`. It returns `(int, int)`.

### `CalculateDifficultyBreakdown(rows: []UserStatistics)`

Merges the per-difficulty attempted and solved counts from `rows`. It uses `rows`. It returns `map[Difficulty]Breakdown`.

### `CalculateTagBreakdown(rows: []UserStatistics)`

Merges the per-tag attempted and solved counts from `rows`. It uses `rows`. It returns `map[string]Breakdown`.

### `AssembleRecentSubmissions(rows: []SubmissionSummary)`

Orders and limits the supplied submission summaries for the recent-submissions view; the exact bound is not specified by the DCD. It uses `rows`. It returns `[]SubmissionSummary`.

### `RankEntries(entries: []LeaderboardEntry)`

Assigns consecutive one-based `Rank` values to the supplied leaderboard entries. It uses `entries`. It returns `[]LeaderboardEntry`.

### `ValidatePagination(page: PageQuery)`

Checks page number and page size bounds. It uses `page`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
