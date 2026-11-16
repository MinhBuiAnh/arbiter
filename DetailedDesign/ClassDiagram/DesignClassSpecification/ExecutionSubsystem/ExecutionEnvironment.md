# ExecutionEnvironment — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ExecutionEnvironment` |
| Classifier kind | Interface |
| Package / subsystem | `Execution Subsystem (Go)` |
| DCD alias | `EXEExecutionEnvironment` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ExecutionEnvironment` is an interface in the `Execution Subsystem (Go)` package/subsystem of the design class diagram.

Execution port for compilation, test execution, and cleanup; realized by the execution subsystem.

- Declared incoming design relationships: `SubmissionProcessor`, `Compiler`, `TestCaseExecutor`, `ResourceCleaner`, `DockerExecutionEnvironment`.
- Realized by: `DockerExecutionEnvironment`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `Compile(ctx: context.Context, request: CompileRequest)` | `(CompileResult, error)` | Public | Instance | Compiles the requested source and returns success, diagnostics, and the artifact path. |
| `Execute(ctx: context.Context, request: ExecutionRequest)` | `(ExecutionResult, error)` | Public | Instance | Runs the artifact with the supplied input and limits and returns output, metrics, and limit flags. |
| `Cleanup(ctx: context.Context, submissionID: SubmissionID)` | `error` | Public | Instance | Removes the execution resources for the submission. |

## 4. Parameter design

### `Compile(ctx: context.Context, request: CompileRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `request` | `CompileRequest` | — | in | Language and source to compile. |

### `Execute(ctx: context.Context, request: ExecutionRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `request` | `ExecutionRequest` | — | in | Artifact, input, expected output, and limits for one execution. |

### `Cleanup(ctx: context.Context, submissionID: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `submissionID` | `SubmissionID` | — | in | Identifies the target submission. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-SYS-004` | Docker Engine or container failure. | Judging fails as an infrastructure error; no user-code verdict is inferred. | [SD-UC-SYS-J-01-ProcessSubmission-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md) |
| `ERR-SYS-005` | Output comparison failure. | The judge records an internal error rather than a wrong-answer verdict. | [SD-UC-SYS-J-01-ProcessSubmission](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission.md) |

## 6. Method

### `Compile(ctx: context.Context, request: CompileRequest)`

Compiles the requested source and returns success, diagnostics, and the artifact path. It is implemented by `DockerExecutionEnvironment`. It is called by `SubmissionProcessor`, `Compiler`, `TestCaseExecutor`, `ResourceCleaner`. It uses `ctx`, `request`. It returns `(CompileResult, error)`. Failures are returned through the declared error result rather than as a successful value.

### `Execute(ctx: context.Context, request: ExecutionRequest)`

Runs the artifact with the supplied input and limits and returns output, metrics, and limit flags. It is implemented by `DockerExecutionEnvironment`. It is called by `SubmissionProcessor`, `Compiler`, `TestCaseExecutor`, `ResourceCleaner`. It uses `ctx`, `request`. It returns `(ExecutionResult, error)`. Failures are returned through the declared error result rather than as a successful value.

### `Cleanup(ctx: context.Context, submissionID: SubmissionID)`

Removes the execution resources for the submission. It is implemented by `DockerExecutionEnvironment`. It is called by `SubmissionProcessor`, `Compiler`, `TestCaseExecutor`, `ResourceCleaner`. It uses `ctx`, `submissionID`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
