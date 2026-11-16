# SampleCase — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `SampleCase` |
| Classifier kind | Class |
| Package / subsystem | `Catalog Module (Go)` |
| DCD alias | `CATSampleCase` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`SampleCase` is a class in the `Catalog Module (Go)` package/subsystem of the design class diagram.

Public sample-case view without hidden test data.

- Declared incoming design relationships: `ProblemDetails`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `ID` | `TestCaseID` | Public | Instance | — | Unique identifier for the record. |
| `Ordinal` | `int` | Public | Instance | — | One-based position in the ordered test-case set. |
| `InputPreview` | `string` | Public | Instance | — | Bounded preview of the sample input. |
| `ExpectedOutputPreview` | `string` | Public | Instance | — | Bounded preview of the sample expected output. |

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
