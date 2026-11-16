# TestCaseSetReader — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `TestCaseSetReader` |
| Classifier kind | Interface |
| Package / subsystem | `Catalog Module (Go)` |
| DCD alias | `CATTestCaseSetReader` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`TestCaseSetReader` is an interface in the `Catalog Module (Go)` package/subsystem of the design class diagram.

Cross-module read port used by the catalog to assess publication readiness.

- Declared incoming design relationships: `ProblemAdminService`, `TestCaseSetReaderAdapter`.
- Realized by: `TestCaseSetReaderAdapter`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `GetRequiredCaseTypes(ctx: context.Context, problemID: ProblemID)` | `(TestCaseSetSummary, error)` | Public | Instance | Returns the case count and required sample/hidden types for the problem. |
| `VerifyTestCaseFilesReadable(ctx: context.Context, problemID: ProblemID)` | `error` | Public | Instance | Checks that every required test-case file can be read. |

## 4. Parameter design

### `GetRequiredCaseTypes(ctx: context.Context, problemID: ProblemID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |

### `VerifyTestCaseFilesReadable(ctx: context.Context, problemID: ProblemID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |

## 5. Exception

None identified in the referenced sequence diagrams.

## 6. Method

### `GetRequiredCaseTypes(ctx: context.Context, problemID: ProblemID)`

Returns the case count and required sample/hidden types for the problem. It is implemented by `TestCaseSetReaderAdapter`. It is called by `ProblemAdminService`. It uses `ctx`, `problemID`. It returns `(TestCaseSetSummary, error)`. Failures are returned through the declared error result rather than as a successful value.

### `VerifyTestCaseFilesReadable(ctx: context.Context, problemID: ProblemID)`

Checks that every required test-case file can be read. It is implemented by `TestCaseSetReaderAdapter`. It is called by `ProblemAdminService`. It uses `ctx`, `problemID`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
