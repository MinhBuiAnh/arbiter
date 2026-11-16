# Breakdown — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `Breakdown` |
| Classifier kind | Class |
| Package / subsystem | `Progress Module (Go)` |
| DCD alias | `PRGBreakdown` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`Breakdown` is a class in the `Progress Module (Go)` package/subsystem of the design class diagram.

Attempted and solved counts for one difficulty or tag bucket.

- Declared incoming design relationships: `UserStatistics`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `Attempted` | `int` | Public | Instance | — | Attempted count for the bucket. |
| `Solved` | `int` | Public | Instance | — | Solved count for the bucket. |

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
