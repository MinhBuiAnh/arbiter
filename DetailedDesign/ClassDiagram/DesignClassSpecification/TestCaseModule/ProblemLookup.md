# ProblemLookup — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ProblemLookup` |
| Classifier kind | Interface |
| Package / subsystem | `Test Case Module (Go)` |
| DCD alias | `TCProblemLookup` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ProblemLookup` is an interface in the `Test Case Module (Go)` package/subsystem of the design class diagram.

Narrow cross-module port used by test cases to check problem existence and lifecycle.

- Declared incoming design relationships: `TestCaseService`, `ProblemLookupAdapter`.
- Realized by: `ProblemLookupAdapter`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `ProblemExists(ctx: context.Context, problemID: ProblemID)` | `(bool, error)` | Public | Instance | Reports whether the problem exists. |
| `GetProblemLifecycle(ctx: context.Context, problemID: ProblemID)` | `(LifecycleStatus, error)` | Public | Instance | Returns the current lifecycle status of the problem. |

## 4. Parameter design

### `ProblemExists(ctx: context.Context, problemID: ProblemID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |

### `GetProblemLifecycle(ctx: context.Context, problemID: ProblemID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-RES-001` | Problem not found. | The operation is rejected without changing state. | [SD-UC-AD-T-01-CreateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase.md) |

## 6. Method

### `ProblemExists(ctx: context.Context, problemID: ProblemID)`

Reports whether the problem exists. It is implemented by `ProblemLookupAdapter`. It is called by `TestCaseService`. It uses `ctx`, `problemID`. It returns `(bool, error)`. Failures are returned through the declared error result rather than as a successful value.

### `GetProblemLifecycle(ctx: context.Context, problemID: ProblemID)`

Returns the current lifecycle status of the problem. It is implemented by `ProblemLookupAdapter`. It is called by `TestCaseService`. It uses `ctx`, `problemID`. It returns `(LifecycleStatus, error)`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
