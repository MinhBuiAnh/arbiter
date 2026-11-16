# UserStatistics — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `UserStatistics` |
| Classifier kind | Class |
| Package / subsystem | `Progress Module (Go)` |
| DCD alias | `PRGUserStatistics` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`UserStatistics` is a class in the `Progress Module (Go)` package/subsystem of the design class diagram.

Projection of attempted and solved counts, breakdowns, and recent submissions.

- Declared outgoing design relationships: `Breakdown`, `SubmissionSummary`.
- Declared incoming design relationships: `ProgressService`, `ProgressStore`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `UserID` | `AccountID` | Public | Instance | — | Identifier of the owning user. |
| `AttemptedCount` | `int` | Public | Instance | — | Number of attempted problems. |
| `SolvedCount` | `int` | Public | Instance | — | Number of solved problems. |
| `AcceptanceRate` | `float64` | Public | Instance | — | Accepted submissions divided by total submissions. |
| `DifficultyBreakdown` | `map[Difficulty]Breakdown` | Public | Instance | — | Attempted and solved counts by difficulty. |
| `TagBreakdown` | `map[string]Breakdown` | Public | Instance | — | Attempted and solved counts by tag. |
| `RecentSubmissions` | `[]SubmissionSummary` | Public | Instance | — | Recent submission summaries. |

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
