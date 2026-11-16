# ProblemState — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ProblemState` |
| Classifier kind | Class |
| Package / subsystem | `Catalog Module (Go)` |
| DCD alias | `CATProblemState` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ProblemState` is a class in the `Catalog Module (Go)` package/subsystem of the design class diagram.

Read model for a problem lifecycle/publication state and version.

- Declared incoming design relationships: `ProblemStore`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `ID` | `ProblemID` | Public | Instance | — | Unique identifier for the record. |
| `LifecycleStatus` | `LifecycleStatus` | Public | Instance | — | Problem lifecycle state. |
| `PublicationStatus` | `PublicationStatus` | Public | Instance | — | Problem publication state. |
| `Version` | `int` | Public | Instance | — | Optimistic-concurrency version used to detect conflicting updates. |

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
