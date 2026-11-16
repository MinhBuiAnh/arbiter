# ProgressDashboard — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ProgressDashboard` |
| Classifier kind | Class |
| Package / subsystem | `React SPA (TypeScript)` |
| DCD alias | `UIProgressDashboard` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ProgressDashboard` is a class in the `React SPA (TypeScript)` package/subsystem of the design class diagram.

React view for own statistics and the public leaderboard.

- Declared outgoing design relationships: `ProgressApi`.
- Declared incoming design relationships: `AppShell`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `requestOwnStatistics()` | `Promise<void>` | Public | Instance | Calls `ProgressApi.getOwnStatistics` and passes the result to `displayStatistics`. |
| `displayStatistics(stats: UserStatisticsResponse)` | `void` | Public | Instance | Renders own counts, breakdowns, and recent submissions. |
| `refreshStatistics()` | `Promise<void>` | Public | Instance | Repeats `requestOwnStatistics` and replaces the displayed statistics. |
| `displayLeaderboard(page: PageResult<LeaderboardEntryResponse>)` | `void` | Public | Instance | Renders the supplied leaderboard page. |

## 4. Parameter design

### `requestOwnStatistics()`

This operation has no parameters.

### `displayStatistics(stats: UserStatisticsResponse)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `stats` | `UserStatisticsResponse` | — | in | Own-statistics view to render. |

### `refreshStatistics()`

This operation has no parameters.

### `displayLeaderboard(page: PageResult<LeaderboardEntryResponse>)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `page` | `PageResult<LeaderboardEntryResponse>` | — | in | Supplies pagination and sort criteria. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-VAL-005` | Invalid pagination parameters. | The query is rejected without reading or changing state. | [SD-UC-COM-04-ViewLeaderboard](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-04-ViewLeaderboard.md) |
| `ERR-NET-001` | Network error or interrupted request/response. | The UI cannot confirm the outcome and informs the user rather than assuming success. | [SD-UC-U-ST-01-ViewOwnStatistics](../../../../ArchitecturalDesign/SequenceDiagram/User/Progress/SD-UC-U-ST-01-ViewOwnStatistics.md) |
| `ERR-LIMIT-001` | Rate limit exceeded. | The request is rejected with retry information; no state is changed. | [SD-UC-U-ST-01-ViewOwnStatistics](../../../../ArchitecturalDesign/SequenceDiagram/User/Progress/SD-UC-U-ST-01-ViewOwnStatistics.md) |
| `ERR-SYS-001` | Internal system, persistence, or assembly error. | The request fails with an internal error; transactions roll back where applicable. | [SD-UC-U-ST-01-ViewOwnStatistics](../../../../ArchitecturalDesign/SequenceDiagram/User/Progress/SD-UC-U-ST-01-ViewOwnStatistics.md) |

## 6. Method

### `requestOwnStatistics()`

Calls `ProgressApi.getOwnStatistics` and passes the result to `displayStatistics`. It has no parameters. It returns `Promise<void>`.

### `displayStatistics(stats: UserStatisticsResponse)`

Renders own counts, breakdowns, and recent submissions. It uses `stats`. No value is returned.

### `refreshStatistics()`

Repeats `requestOwnStatistics` and replaces the displayed statistics. It has no parameters. It returns `Promise<void>`.

### `displayLeaderboard(page: PageResult<LeaderboardEntryResponse>)`

Renders the supplied leaderboard page. It uses `page`. No value is returned.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
