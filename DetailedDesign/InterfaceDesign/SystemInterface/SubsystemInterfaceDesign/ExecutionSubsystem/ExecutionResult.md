# ExecutionResult — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ExecutionResult` |
| Classifier kind | Class |
| Package / subsystem | `Execution Subsystem (Go)` |
| DCD alias | `EXEExecutionResult` |
| Design class diagram | [DesignClassDiagram.md](../../../../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../../../ClassDiagram/Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ExecutionResult` is a class in the `Execution Subsystem (Go)` package/subsystem of the design class diagram.

Execution result value carrying process output, metrics, and limit flags.

- Declared incoming design relationships: `TestCaseExecutor`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `Stdout` | `string` | Public | Instance | — | Captured standard output. |
| `Stderr` | `string` | Public | Instance | — | Captured standard error. |
| `ExitCode` | `int` | Public | Instance | — | Process exit code; zero indicates normal termination. |
| `RuntimeMS` | `int` | Public | Instance | — | Measured aggregate or per-test runtime in milliseconds. |
| `PeakMemoryKB` | `int` | Public | Instance | — | Measured peak memory in kilobytes. |
| `TimedOut` | `bool` | Public | Instance | — | Set when the process exceeded its time limit. |
| `MemoryExceeded` | `bool` | Public | Instance | — | Set when the process exceeded its memory limit. |

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `IsSuccessful()` | `bool` | Public | Instance | Implements the declared is Successful behavior for its port. |

## 4. Parameter design

### `IsSuccessful()`

This operation has no parameters.

## 5. Exception

None identified in the referenced sequence diagrams.

## 6. Method

### `IsSuccessful()`

Implements the declared is Successful behavior for its port. It has no parameters. It reads the declared attribute(s) `ExitCode`, `TimedOut`, `MemoryExceeded`. It returns `bool`.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
