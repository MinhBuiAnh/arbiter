# JudgeResult — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `JudgeResult` |
| Classifier kind | Class |
| Package / subsystem | `Submission Module (Go)` |
| DCD alias | `SUBJudgeResult` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`JudgeResult` is a class in the `Submission Module (Go)` package/subsystem of the design class diagram.

Terminal judge result carrying verdict, metrics, case results, and compilation output.

- Declared outgoing design relationships: `TestCaseResult`, `ResultMetrics`.
- Declared incoming design relationships: `SubmissionProcessor`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `SubmissionID` | `SubmissionID` | Public | Instance | — | Submission judged by this result. |
| `Verdict` | `Verdict` | Public | Instance | — | Terminal verdict. |
| `Metrics` | `ResultMetrics` | Public | Instance | — | Aggregate runtime and peak-memory metrics. |
| `CaseResults` | `[]TestCaseResult` | Public | Instance | — | Per-test results. |
| `CompilationOutput` | `string` | Public | Instance | — | Compiler diagnostics for the submission. |

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
