# TestCaseSetSummary — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `TestCaseSetSummary` |
| Classifier kind | Class |
| Package / subsystem | `Shared Domain Types (Go)` |
| DCD alias | `DTTestCaseSetSummary` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`TestCaseSetSummary` is a class in the `Shared Domain Types (Go)` package/subsystem of the design class diagram.

Shared publication-readiness read model reporting case count and required sample/hidden coverage.

- Declared incoming design relationships: `Problem`, `TestCaseSet`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `ProblemID` | `ProblemID` | Public | Instance | — | Identifier of the owning problem. |
| `Version` | `int` | Public | Instance | — | Optimistic-concurrency version used to detect conflicting updates. |
| `CaseCount` | `int` | Public | Instance | — | Number of cases in the set. |
| `RequiredTypes` | `[]TestCaseType` | Public | Instance | — | Test-case types required for publication. |

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `HasSample()` | `bool` | Public | Instance | Implements has Sample using the declared members and collaborators. |
| `HasHidden()` | `bool` | Public | Instance | Implements has Hidden using the declared members and collaborators. |

## 4. Parameter design

### `HasSample()`

This operation has no parameters.

### `HasHidden()`

This operation has no parameters.

## 5. Exception

None identified in the referenced sequence diagrams.

## 6. Method

### `HasSample()`

Implements has Sample using the declared members and collaborators. It has no parameters. It reads the declared attribute(s) `RequiredTypes`, `CaseCount`. It returns `bool`.

### `HasHidden()`

Implements has Hidden using the declared members and collaborators. It has no parameters. It reads the declared attribute(s) `RequiredTypes`, `CaseCount`. It returns `bool`.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
