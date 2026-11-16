# LeaderboardEntryResponse — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `LeaderboardEntryResponse` |
| Classifier kind | Class |
| Package / subsystem | `Application Contracts (Go)` |
| DCD alias | `DTOLeaderboardEntryResponse` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`LeaderboardEntryResponse` is a class in the `Application Contracts (Go)` package/subsystem of the design class diagram.

Leaderboard row contract.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `rank` | `int` | Public | Instance | — | One-based rank. |
| `userID` | `string` | Public | Instance | — | Account identifier. |
| `username` | `string` | Public | Instance | — | Account login name. |
| `displayName` | `string` | Public | Instance | — | Displayed account name. |
| `solvedCount` | `int` | Public | Instance | — | Number of solved problems. |
| `submissionCount` | `int` | Public | Instance | — | Number of submissions. |
| `acceptanceRate` | `float64` | Public | Instance | — | Accepted submissions divided by total submissions. |

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
