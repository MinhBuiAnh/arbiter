# SubmissionDetailsResponse — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `SubmissionDetailsResponse` |
| Classifier kind | Class |
| Package / subsystem | `Application Contracts (Go)` |
| DCD alias | `DTOSubmissionDetailsResponse` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`SubmissionDetailsResponse` is a class in the `Application Contracts (Go)` package/subsystem of the design class diagram.

Submission details, source, compilation output, and executed-case views.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `submission` | `SubmissionStatusResponse` | Public | Instance | — | Status and timestamp view for the submission. |
| `source` | `string` | Public | Instance | — | Submitted source code. |
| `problemSummary` | `string` | Public | Instance | — | Retained problem summary. |
| `compilationOutput` | `string` | Public | Instance | — | Bounded compiler diagnostics. |
| `executedCases` | `[]TestCaseResultResponse` | Public | Instance | — | Per-test results with hidden data excluded. |

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
