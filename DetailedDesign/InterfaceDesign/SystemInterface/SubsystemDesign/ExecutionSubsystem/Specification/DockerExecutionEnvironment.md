# DockerExecutionEnvironment — Subsystem Element Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Subsystem element specification |
| Element | `DockerExecutionEnvironment` |
| Owning subsystem | Execution Subsystem (Go) |
| Classifier kind | Class |
| Realized interface | [ExecutionEnvironment](../../../SubsystemInterfaceDesign/ExecutionSubsystem/ExecutionEnvironment.md) |
| DCD class specification | [DockerExecutionEnvironment](../../../SubsystemInterfaceDesign/ExecutionSubsystem/DockerExecutionEnvironment.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-18 |

## 1. Identification

`DockerExecutionEnvironment` is the internal adapter that realizes the subsystem's `ExecutionEnvironment` interface. It prepares submission-scoped workspaces, invokes the Docker Engine Go SDK to compile or execute in isolated containers, translates container measurements into the public result types, and removes resources for a submission.

It does not compare expected and actual output; the Judge Module owns output comparison.

## 2. Attribute Design

| Name | Data type | Visibility | Scope | Default value | Description |
|---|---|---|---|---|---|
| `client` | `*client.Client` | Private | Instance | — | Docker Engine SDK client used to manage isolated containers. |
| `workspaceRoot` | `string` | Private | Instance | — | Root directory for temporary, submission-scoped workspaces. |

## 3. Operation Design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|---|---|---|---|---|
| `Compile(ctx: context.Context, request: CompileRequest)` | `(CompileResult, error)` | Public | Instance | Compiles source in a fresh constrained container and returns bounded diagnostics and the workspace artifact path. |
| `Execute(ctx: context.Context, request: ExecutionRequest)` | `(ExecutionResult, error)` | Public | Instance | Runs one test case in a fresh constrained container and returns bounded output and resource measurements. |
| `Cleanup(ctx: context.Context, submissionID: SubmissionID)` | `error` | Public | Instance | Removes containers and the temporary workspace associated with the submission. |

These exported method signatures implement the interface. `DockerExecutionEnvironment` itself remains an internal implementation and is not exposed to subsystem clients.

## 4. Parameter Design

### `Compile(ctx: context.Context, request: CompileRequest)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Cancellation and deadline for workspace and Docker operations. |
| `request` | `CompileRequest` | — | in | Submission identifier, language, and source to compile. |

### `Execute(ctx: context.Context, request: ExecutionRequest)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Cancellation and deadline for workspace and Docker operations. |
| `request` | `ExecutionRequest` | — | in | Submission identifier, artifact, input, expected output, and execution limits. |

### `Cleanup(ctx: context.Context, submissionID: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Cancellation and deadline for cleanup operations. |
| `submissionID` | `SubmissionID` | — | in | Identifies the containers and workspace to remove. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-VAL-002` | Empty submission ID, unsupported language, oversized source, or invalid submission-scoped request data reaches the adapter. | Return an error before creating or removing resources. | [SD-UC-SYS-J-01-ProcessSubmission](../../../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission.md) |
| `ERR-SYS-001` | Workspace creation, source/input staging, or another unexpected local operation fails. | Return the error and attempt cleanup of resources created by the operation. | [SD-UC-SYS-J-01-ProcessSubmission-Exceptions](../../../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md) |
| `ERR-SYS-004` | Docker Engine or container create/start/wait operation fails. | Remove any container created for the operation and return the infrastructure error; never convert it into a user-code verdict. | [SD-UC-SYS-J-01-ProcessSubmission-Exceptions](../../../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md) |
| `ERR-SYS-006` | Submission-scoped container or workspace cleanup fails. | Attempt both cleanup paths and return the collected failure; the caller can retry cleanup. | [SD-UC-SYS-J-01-ProcessSubmission](../../../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission.md) |

`ERR-SYS-005` is not emitted here. The method returns captured output; output comparison belongs to the Judge Module.

## 6. Method

### `Compile(ctx: context.Context, request: CompileRequest)`

Validates the supported language and source-size limit before creating resources. It derives a path-safe workspace key from `request.SubmissionID`, creates that submission's workspace beneath `workspaceRoot`, and writes the source without logging it. It then starts a fresh container with the matching C++17 compiler or Python 3 `py_compile` command and the compile limits documented in the [subsystem overview](../ExecutionSubsystem.md). The container is removed after completion.

A nonzero compiler exit is a normal compile result: return `Succeeded: false`, bounded compiler output, and no usable artifact path. On success, return `Succeeded: true` and an artifact path under the submission workspace. Workspace or Docker failures return an error, not a compile rejection. The artifact remains until `Cleanup` so later test-case executions can mount it read-only. If removing the finished compile container fails, return a cleanup error rather than a successful compilation result.

### `Execute(ctx: context.Context, request: ExecutionRequest)`

Derives the workspace key from `request.SubmissionID` and verifies that `request.ArtifactPath` resolves beneath that submission's workspace. It stages `request.Input` as a temporary file in the same workspace, then starts a fresh container with the artifact and input mounted read-only. The container receives the requested time and memory limits plus the fixed isolation limits documented in the subsystem overview.

The adapter captures stdout and stderr with bounded buffers, retaining at most one byte beyond the stdout verdict threshold. It maps exit status, elapsed time, peak memory, timeout, and memory-limit termination to `ExecutionResult`. A timeout, memory-limit breach, or nonzero program exit is returned as execution data, not as an infrastructure error. `ExpectedOutput` is not compared by this class; the Judge Module uses it to determine the case outcome. The staged input is removed after the run. Infrastructure or local I/O failures return an error. If container or input cleanup fails, the method returns an error rather than a successful result.

### `Cleanup(ctx: context.Context, submissionID: SubmissionID)`

Derives the same path-safe workspace key used by `Compile` and `Execute`. It asks Docker to remove every container carrying the corresponding submission label and removes the workspace. These independent cleanup operations may run concurrently. Missing containers or an already-removed workspace are treated as successful idempotent cleanup. It attempts both removals even if one fails and returns all cleanup failures to the caller; it does not change submission state or verdict.

## 7. Other Diagrams

- [Compile sequence](../Diagram/SD-EXE-Compile.md)
- [Execute sequence](../Diagram/SD-EXE-Execute.md)
- [Cleanup sequence](../Diagram/SD-EXE-Cleanup.md)
