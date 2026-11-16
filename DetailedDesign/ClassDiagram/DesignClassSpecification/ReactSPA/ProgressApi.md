# ProgressApi — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ProgressApi` |
| Classifier kind | Class |
| Package / subsystem | `React SPA (TypeScript)` |
| DCD alias | `UIProgressApi` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ProgressApi` is a class in the `React SPA (TypeScript)` package/subsystem of the design class diagram.

Typed client for own statistics and leaderboard endpoints.

- Declared outgoing design relationships: `HttpClient`.
- Declared incoming design relationships: `ProgressDashboard`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `getOwnStatistics()` | `Promise<UserStatisticsResponse>` | Public | Instance | Issues the typed HTTP request for get Own Statistics through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `getLeaderboard(query: PageQuery)` | `Promise<PageResult<LeaderboardEntryResponse>>` | Public | Instance | Issues the typed HTTP request for get Leaderboard through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |

## 4. Parameter design

### `getOwnStatistics()`

This operation has no parameters.

### `getLeaderboard(query: PageQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `query` | `PageQuery` | — | in | Supplies search, filter, and pagination criteria. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-VAL-005` | Invalid pagination parameters. | The query is rejected without reading or changing state. | [SD-UC-COM-04-ViewLeaderboard](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-04-ViewLeaderboard.md) |
| `ERR-NET-001` | Network error or interrupted request/response. | The UI cannot confirm the outcome and informs the user rather than assuming success. | [SD-UC-U-ST-01-ViewOwnStatistics](../../../../ArchitecturalDesign/SequenceDiagram/User/Progress/SD-UC-U-ST-01-ViewOwnStatistics.md) |
| `ERR-LIMIT-001` | Rate limit exceeded. | The request is rejected with retry information; no state is changed. | [SD-UC-U-ST-01-ViewOwnStatistics](../../../../ArchitecturalDesign/SequenceDiagram/User/Progress/SD-UC-U-ST-01-ViewOwnStatistics.md) |

## 6. Method

### `getOwnStatistics()`

Issues the typed HTTP request for get Own Statistics through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It has no parameters. It returns `Promise<UserStatisticsResponse>`.

### `getLeaderboard(query: PageQuery)`

Issues the typed HTTP request for get Leaderboard through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `query`. It returns `Promise<PageResult<LeaderboardEntryResponse>>`.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
