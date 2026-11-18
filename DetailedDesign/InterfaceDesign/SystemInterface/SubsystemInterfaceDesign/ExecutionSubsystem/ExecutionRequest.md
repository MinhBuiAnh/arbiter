# ExecutionRequest — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ExecutionRequest` |
| Classifier kind | Class |
| Package / subsystem | `Execution Subsystem (Go)` |
| DCD alias | `EXEExecutionRequest` |
| Design class diagram | [DesignClassDiagram.md](../../../../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../../../ClassDiagram/Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ExecutionRequest` is a class in the `Execution Subsystem (Go)` package/subsystem of the design class diagram.

Execution request value carrying the artifact, input, expected output, and limits.

- Declared incoming design relationships: `TestCaseExecutor`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `SubmissionID` | `SubmissionID` | Public | Instance | — | Identifies the submission that owns the execution resources. |
| `ArtifactPath` | `string` | Public | Instance | — | Path of the compiled artifact used for execution. |
| `Input` | `string` | Public | Instance | — | Standard input supplied to the executed program. |
| `ExpectedOutput` | `string` | Public | Instance | — | Expected standard output used for comparison. |
| `Limits` | `ExecutionLimits` | Public | Instance | — | Time and memory limits for the execution. |

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
