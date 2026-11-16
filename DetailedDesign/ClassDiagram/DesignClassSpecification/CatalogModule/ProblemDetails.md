# ProblemDetails — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ProblemDetails` |
| Classifier kind | Class |
| Package / subsystem | `Catalog Module (Go)` |
| DCD alias | `CATProblemDetails` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ProblemDetails` is a class in the `Catalog Module (Go)` package/subsystem of the design class diagram.

Public problem read model with statistics and sample cases.

- Declared outgoing design relationships: `Problem`, `PublicStatistics`, `SampleCase`.
- Declared incoming design relationships: `ProblemStore`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `Problem` | `Problem` | Public | Instance | — | Problem submission context captured for judging. |
| `Statistics` | `PublicStatistics` | Public | Instance | — | Derived public statistics. |
| `SampleCases` | `[]SampleCase` | Public | Instance | — | Public sample cases. |

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
