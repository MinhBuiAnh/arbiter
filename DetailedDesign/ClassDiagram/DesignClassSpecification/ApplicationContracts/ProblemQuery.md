# ProblemQuery — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ProblemQuery` |
| Classifier kind | Class |
| Package / subsystem | `Application Contracts (Go)` |
| DCD alias | `DTOProblemQuery` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ProblemQuery` is a class in the `Application Contracts (Go)` package/subsystem of the design class diagram.

Problem search and filter contract.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `keywords` | `string` | Public | Instance | — | Free-text search terms. |
| `difficulty` | `string` | Public | Instance | — | Optional difficulty filter. |
| `category` | `string` | Public | Instance | — | Optional category filter. |
| `tags` | `[]string` | Public | Instance | — | Optional tag filters. |
| `page` | `PageQuery` | Public | Instance | — | Pagination and sort criteria. |

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
