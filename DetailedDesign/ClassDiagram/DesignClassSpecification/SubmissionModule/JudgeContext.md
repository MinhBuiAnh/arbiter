# JudgeContext — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `JudgeContext` |
| Classifier kind | Class |
| Package / subsystem | `Submission Module (Go)` |
| DCD alias | `SUBJudgeContext` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`JudgeContext` is a class in the `Submission Module (Go)` package/subsystem of the design class diagram.

Read model carrying the submission, problem context, and test-case metadata needed by the judge.

- Declared outgoing design relationships: `Submission`, `ProblemSubmissionContext`, `TestCaseMetadata`.
- Declared incoming design relationships: `SubmissionStore`, `SubmissionProcessor`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `Submission` | `Submission` | Public | Instance | — | Submission loaded for judging. |
| `Problem` | `ProblemSubmissionContext` | Public | Instance | — | Problem limits and language context. |
| `TestCases` | `[]TestCaseMetadata` | Public | Instance | — | Ordered test-case metadata to execute. |

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
