# LeaderboardEntry — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `LeaderboardEntry` |
| Classifier kind | Class |
| Package / subsystem | `Progress Module (Go)` |
| DCD alias | `PRGLeaderboardEntry` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`LeaderboardEntry` is a class in the `Progress Module (Go)` package/subsystem of the design class diagram.

Projection row for the public leaderboard.

- Declared incoming design relationships: `ProgressStore`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `Rank` | `int` | Public | Instance | — | One-based leaderboard rank. |
| `UserID` | `AccountID` | Public | Instance | — | Identifier of the owning user. |
| `Username` | `string` | Public | Instance | — | Account login name. |
| `DisplayName` | `string` | Public | Instance | — | Name shown to other users. |
| `SolvedCount` | `int` | Public | Instance | — | Number of solved problems. |
| `SubmissionCount` | `int` | Public | Instance | — | Number of submissions. |
| `AcceptanceRate` | `float64` | Public | Instance | — | Accepted submissions divided by total submissions. |

## 3. Operation design

No operations are specified for this classifier in the DCD.

## 4. Parameter design

No operations are specified, so there are no parameters.

## 5. Exception

None identified in the referenced sequence diagrams.

## 6. Method

No methods are specified for this classifier in the DCD.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
