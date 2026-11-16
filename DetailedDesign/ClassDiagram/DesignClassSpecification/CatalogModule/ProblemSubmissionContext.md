# ProblemSubmissionContext — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ProblemSubmissionContext` |
| Classifier kind | Class |
| Package / subsystem | `Catalog Module (Go)` |
| DCD alias | `CATProblemSubmissionContext` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ProblemSubmissionContext` is a class in the `Catalog Module (Go)` package/subsystem of the design class diagram.

Read model containing the problem fields needed to validate a submission.

- Declared incoming design relationships: `ProblemStore`, `SubmissionCommandService`, `JudgeContext`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `ID` | `ProblemID` | Public | Instance | — | Unique identifier for the record. |
| `Title` | `string` | Public | Instance | — | Problem title. |
| `TimeLimitMS` | `int` | Public | Instance | — | Per-test time limit in milliseconds. |
| `MemoryLimitMB` | `int` | Public | Instance | — | Per-test memory limit in megabytes. |
| `AllowedLanguages` | `[]Language` | Public | Instance | — | Languages accepted for submissions to the problem. |
| `LifecycleStatus` | `LifecycleStatus` | Public | Instance | — | Problem lifecycle state. |
| `PublicationStatus` | `PublicationStatus` | Public | Instance | — | Problem publication state. |

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
