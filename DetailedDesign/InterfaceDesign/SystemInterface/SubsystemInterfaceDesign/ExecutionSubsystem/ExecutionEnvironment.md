# ExecutionEnvironment — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ExecutionEnvironment` |
| Classifier kind | Interface |
| Package / subsystem | `Execution Subsystem (Go)` |
| DCD alias | `EXEExecutionEnvironment` |
| Design class diagram | [DesignClassDiagram.md](../../../../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../../../ClassDiagram/Ruleset.md) |
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
| `Compile(ctx: context.Context, request: CompileRequest)` | `(CompileResult, error)` | Public | Instance | Compiles the requested source in resources scoped to the request's submission and returns success, diagnostics, and the artifact path. |
| `Execute(ctx: context.Context, request: ExecutionRequest)` | `(ExecutionResult, error)` | Public | Instance | Runs the artifact with the supplied input and limits in resources scoped to the request's submission and returns output, metrics, and limit flags. |
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
| `ERR-VAL-002` | Invalid or empty submission ID, language/source configuration, or artifact path reaches the execution boundary. | Return an error before creating or removing resources; the caller records the configuration failure and does not infer a verdict. | [SD-UC-SYS-J-01-ProcessSubmission](../../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission.md); [compile](../../SubsystemDesign/ExecutionSubsystem/Diagram/SD-EXE-Compile.md), [execute](../../SubsystemDesign/ExecutionSubsystem/Diagram/SD-EXE-Execute.md), and [cleanup](../../SubsystemDesign/ExecutionSubsystem/Diagram/SD-EXE-Cleanup.md) |
| `ERR-SYS-001` | Temporary workspace cannot be prepared or an unexpected local execution error occurs. | Return an error; the caller handles it as an internal failure and does not infer a user-code verdict. | [SD-UC-SYS-J-01-ProcessSubmission-Exceptions](../../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md) |
| `ERR-SYS-004` | Docker Engine or container failure. | Return an error; the caller leaves retryable work unacknowledged and does not infer a user-code verdict. | [SD-UC-SYS-J-01-ProcessSubmission-Exceptions](../../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md) |
| `ERR-SYS-006` | Submission-scoped container or workspace cleanup fails. | Return the cleanup error; the caller preserves any committed result and retries cleanup later. | [SD-UC-SYS-J-01-ProcessSubmission](../../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission.md) |

Output comparison is performed by the Judge Module after `Execute` returns captured output. `ERR-SYS-005` belongs to that comparison flow and is not emitted by `ExecutionEnvironment`.

## 6. Method

### `Compile(ctx: context.Context, request: CompileRequest)`

Compiles the requested source in resources scoped to `request.SubmissionID` and returns success, diagnostics, and the artifact path. It is implemented by `DockerExecutionEnvironment`. It is called by `Compiler`. It uses `ctx`, `request`. It returns `(CompileResult, error)`. Failures are returned through the declared error result rather than as a successful value.

### `Execute(ctx: context.Context, request: ExecutionRequest)`

Runs the artifact with the supplied input and limits in resources scoped to `request.SubmissionID`, then returns output, metrics, and limit flags. It is implemented by `DockerExecutionEnvironment`. It is called by `TestCaseExecutor`. It uses `ctx`, `request`. It returns `(ExecutionResult, error)`. Failures are returned through the declared error result rather than as a successful value.

### `Cleanup(ctx: context.Context, submissionID: SubmissionID)`

Removes the execution resources scoped to `submissionID`. It is implemented by `DockerExecutionEnvironment`. It is called by `ResourceCleaner`. It uses `ctx`, `submissionID`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
