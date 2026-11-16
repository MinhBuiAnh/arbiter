# ProgressHandler — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ProgressHandler` |
| Classifier kind | Class |
| Package / subsystem | `HTTP API (Go)` |
| DCD alias | `APIProgressHandler` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ProgressHandler` is a class in the `HTTP API (Go)` package/subsystem of the design class diagram.

HTTP boundary handler for statistics and leaderboard routes.

- Declared outgoing design relationships: `ProgressService`.
- Declared incoming design relationships: `Router`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `GetOwnStatistics(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `ProgressService.GetOwnStatistics`, and writes the mapped result or error response. |
| `GetLeaderboard(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `ProgressService.GetLeaderboard`, and writes the mapped result or error response. |

## 4. Parameter design

### `GetOwnStatistics(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `GetLeaderboard(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-AUTH-003` | Missing, invalid, or expired access token. | The request is rejected as unauthenticated and the client clears authentication state. | [SD-UC-U-ST-01-ViewOwnStatistics](../../../../ArchitecturalDesign/SequenceDiagram/User/Progress/SD-UC-U-ST-01-ViewOwnStatistics.md) |
| `ERR-VAL-005` | Invalid pagination parameters. | The query is rejected without reading or changing state. | [SD-UC-COM-04-ViewLeaderboard](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-04-ViewLeaderboard.md) |
| `ERR-LIMIT-001` | Rate limit exceeded. | The request is rejected with retry information; no state is changed. | [SD-UC-U-ST-01-ViewOwnStatistics](../../../../ArchitecturalDesign/SequenceDiagram/User/Progress/SD-UC-U-ST-01-ViewOwnStatistics.md) |
| `ERR-SYS-001` | Internal system, persistence, or assembly error. | The request fails with an internal error; transactions roll back where applicable. | [SD-UC-U-ST-01-ViewOwnStatistics](../../../../ArchitecturalDesign/SequenceDiagram/User/Progress/SD-UC-U-ST-01-ViewOwnStatistics.md) |

## 6. Method

### `GetOwnStatistics(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `ProgressService.GetOwnStatistics`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `GetLeaderboard(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `ProgressService.GetLeaderboard`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
