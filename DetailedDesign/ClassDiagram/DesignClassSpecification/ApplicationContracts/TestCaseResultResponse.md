# TestCaseResultResponse — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `TestCaseResultResponse` |
| Classifier kind | Class |
| Package / subsystem | `Application Contracts (Go)` |
| DCD alias | `DTOTestCaseResultResponse` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`TestCaseResultResponse` is a class in the `Application Contracts (Go)` package/subsystem of the design class diagram.

Per-test result view.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `testCaseID` | `string` | Public | Instance | — | Evaluated test-case identifier. |
| `outcome` | `string` | Public | Instance | — | Per-test outcome. |
| `runtimeMS` | `int` | Public | Instance | — | Measured runtime in milliseconds. |
| `peakMemoryKB` | `int` | Public | Instance | — | Measured peak memory in kilobytes. |
| `message` | `string` | Public | Instance | — | Per-test diagnostic message. |

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
