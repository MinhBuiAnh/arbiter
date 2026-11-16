# TestCaseResult — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `TestCaseResult` |
| Classifier kind | Class |
| Package / subsystem | `Submission Module (Go)` |
| DCD alias | `SUBTestCaseResult` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`TestCaseResult` is a class in the `Submission Module (Go)` package/subsystem of the design class diagram.

Per-test evaluation result owned by a submission result.

- Declared incoming design relationships: `JudgeResult`, `VerdictEvaluator`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `TestCaseID` | `TestCaseID` | Public | Instance | — | Identifier of the evaluated test case. |
| `Outcome` | `TestOutcome` | Public | Instance | — | `PASSED`, `FAILED`, or `SKIPPED` for this test case. |
| `RuntimeMS` | `int` | Public | Instance | — | Measured aggregate or per-test runtime in milliseconds. |
| `PeakMemoryKB` | `int` | Public | Instance | — | Measured peak memory in kilobytes. |
| `Message` | `string` | Public | Instance | — | Human-readable error message. |

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `IsPassed()` | `bool` | Public | Instance | Coordinates is Passed using the declared ports, entities, and collaborators. |

## 4. Parameter design

### `IsPassed()`

This operation has no parameters.

## 5. Exception

None identified in the referenced sequence diagrams.

## 6. Method

### `IsPassed()`

Coordinates is Passed using the declared ports, entities, and collaborators. It has no parameters. It reads the declared attribute(s) `Outcome`. It returns `bool`.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
