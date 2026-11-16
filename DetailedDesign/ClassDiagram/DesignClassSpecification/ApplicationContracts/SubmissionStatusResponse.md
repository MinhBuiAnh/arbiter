# SubmissionStatusResponse — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `SubmissionStatusResponse` |
| Classifier kind | Class |
| Package / subsystem | `Application Contracts (Go)` |
| DCD alias | `DTOSubmissionStatusResponse` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`SubmissionStatusResponse` is a class in the `Application Contracts (Go)` package/subsystem of the design class diagram.

Submission status and timestamp view.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `submissionID` | `string` | Public | Instance | — | Submission identifier. |
| `problemTitle` | `string` | Public | Instance | — | Title of the submitted problem. |
| `language` | `string` | Public | Instance | — | Submission language. |
| `status` | `string` | Public | Instance | — | Current submission status. |
| `verdict` | `*string` | Public | Instance | — | Verdict, present only when the submission is completed. |
| `createdAt` | `time.Time` | Public | Instance | — | Creation timestamp. |
| `startedAt` | `*time.Time` | Public | Instance | — | Judging start timestamp, or nil. |
| `completedAt` | `*time.Time` | Public | Instance | — | Judging completion timestamp, or nil. |

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
