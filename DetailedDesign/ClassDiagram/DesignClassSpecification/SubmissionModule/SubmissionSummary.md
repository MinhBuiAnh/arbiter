# SubmissionSummary — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `SubmissionSummary` |
| Classifier kind | Class |
| Package / subsystem | `Submission Module (Go)` |
| DCD alias | `SUBSubmissionSummary` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`SubmissionSummary` is a class in the `Submission Module (Go)` package/subsystem of the design class diagram.

Read model for submission-history and administrative list rows.

- Declared incoming design relationships: `SubmissionStore`, `UserStatistics`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `ID` | `SubmissionID` | Public | Instance | — | Unique identifier for the record. |
| `ProblemID` | `ProblemID` | Public | Instance | — | Identifier of the owning problem. |
| `ProblemTitle` | `string` | Public | Instance | — | Title of the submitted problem. |
| `Language` | `Language` | Public | Instance | — | Submission language. |
| `Status` | `SubmissionStatus` | Public | Instance | — | Current submission status. |
| `Verdict` | `*Verdict` | Public | Instance | — | Final verdict, or nil while incomplete. |
| `CreatedAt` | `time.Time` | Public | Instance | — | Submission creation timestamp. |

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
