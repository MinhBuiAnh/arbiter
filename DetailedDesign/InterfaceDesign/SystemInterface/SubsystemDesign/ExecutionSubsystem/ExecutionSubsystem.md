# Execution Subsystem Design

**Arbiter — Online Judge Platform**

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Execution subsystem design |
| Owning subsystem | Execution Subsystem (Go) |
| External contract | [Execution Subsystem Interface Design](../../SubsystemInterfaceDesign/ExecutionSubsystem/ExecutionEnvironment.md) |
| DCD | [DesignClassDiagram.md](../../../../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Subsystem Design Ruleset](../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-18 |

## 1. Responsibility

The Execution Subsystem compiles supported submission source and runs each test case in a fresh, constrained Docker container. It returns compiler output, captured process output, exit status, runtime and memory measurements, and time/memory-limit flags. It removes all containers and temporary workspace data associated with a submission when requested.

The subsystem is an internal part of the modular monolith, not a separately deployed service. It does not choose a verdict or compare expected and actual output; those responsibilities remain with the Judge Module.

## 2. Realized Interface

The subsystem realizes [ExecutionEnvironment](../../SubsystemInterfaceDesign/ExecutionSubsystem/ExecutionEnvironment.md):

| Interface operation | Internal realization | Collaborations | Sequence diagram |
|---|---|---|---|
| `Compile(ctx, request)` | `DockerExecutionEnvironment.Compile` | Workspace filesystem; Docker Engine API | [SD-EXE-Compile](Diagram/SD-EXE-Compile.md) |
| `Execute(ctx, request)` | `DockerExecutionEnvironment.Execute` | Workspace filesystem; Docker Engine API | [SD-EXE-Execute](Diagram/SD-EXE-Execute.md) |
| `Cleanup(ctx, submissionID)` | `DockerExecutionEnvironment.Cleanup` | Docker Engine API; workspace filesystem | [SD-EXE-Cleanup](Diagram/SD-EXE-Cleanup.md) |

`CompileRequest` and `ExecutionRequest` carry `SubmissionID`, allowing compilation and execution resources to be labeled and placed in a deterministic submission-scoped workspace. `Cleanup` uses the same identifier to find those resources. The ID is hashed before it is used in a filesystem path or container label.

## 3. Internal Elements

| Element | Kind | Responsibility | Specification |
|---|---|---|---|
| `DockerExecutionEnvironment` | Class | Implements the execution port, manages submission-scoped workspaces, and configures isolated compile and execution containers. | [DockerExecutionEnvironment.md](Specification/DockerExecutionEnvironment.md) |

The interface and request/result value specifications are owned by [Subsystem Interface Design](../../SubsystemInterfaceDesign/ExecutionSubsystem/). They are linked rather than duplicated here.

## 4. Dependencies

| Source element | Target interface or package | Reason | Kind | Exception justification |
|---|---|---|---|---|
| `DockerExecutionEnvironment` | Docker Engine Go SDK package | Create, start, wait for, inspect, and remove isolated containers. | Allowed exception | The DCD defines no Docker subsystem interface; the SDK is the stable external contract for this infrastructure dependency. The direct dependency is confined to this adapter. |
| `DockerExecutionEnvironment` | Go standard-library packages (`os`, `path/filepath`, `crypto/sha256`, `encoding/hex`) | Create and remove ephemeral workspace files and derive path-safe submission workspace keys. | Package | — |

No dependency is introduced on another Arbiter subsystem. Output comparison and test-case file retrieval remain outside this subsystem.

## 5. Security and Lifecycle

- Every compilation and test execution uses a fresh container; no container is reused across test cases.
- Containers are labeled with a deterministic hash of `SubmissionID`. Workspace paths are derived from that hash rather than concatenating an untrusted ID into a path.
- Compile containers use the configured language toolchain, a 10-second limit, 512 MiB memory, no network, a read-only root filesystem, a bounded writable workspace, dropped capabilities, no-new-privileges, and a non-root user.
- Execution containers use the Problem's time and memory limits, one CPU, at most 64 PIDs, no network, a read-only root filesystem, a read-only mount for the artifact and input, bounded writable storage, dropped capabilities, no-new-privileges, and a non-root user.
- Captured output is bounded. The environment retains at most one byte beyond the 1 MiB output threshold so the Judge Module can distinguish capped output from output that exactly meets the limit.
- Source code, test-case contents, and compiler output are not logged. Compiler diagnostics returned to the caller remain bounded.
- A normal compiler rejection is returned as `CompileResult{Succeeded: false}`; infrastructure and workspace failures are returned as errors.
- Cleanup is idempotent. It attempts both container removal and workspace removal, and returns failures rather than hiding them. A cleanup failure does not alter a committed verdict.

## 6. Failure Ownership

| Outcome | Subsystem behavior | Caller responsibility |
|---|---|---|
| Invalid/empty submission ID, language/source configuration, or artifact path (`ERR-VAL-002`) | Return an error before creating or removing resources. | Record the configuration failure; do not infer a user-code verdict. |
| Workspace setup or unexpected local failure (`ERR-SYS-001`) | Return the error; remove any resources already created when possible. | Handle as an internal failure. |
| Docker/container failure (`ERR-SYS-004`) | Return the error and attempt to remove the container created for the operation. | Leave retryable work unacknowledged; do not infer a user-code verdict. |
| Submission resource cleanup failure (`ERR-SYS-006`) | Return cleanup error(s), including both container and workspace failures when both occur. | Preserve any committed result and retry cleanup later. |
| Output comparison failure (`ERR-SYS-005`) | Not produced by this subsystem; the environment returns captured output without comparing it. | Judge Module records the internal failure rather than a wrong-answer verdict. |

## 7. Recovery Integration

The execution interface remains scoped to `Cleanup(ctx, submissionID)` and does not enumerate Docker resources. During recovery, `JudgeWorker` collects only IDs whose queue messages it successfully claimed and whose durable Submission state establishes that old resources are safe to remove. It passes those candidates to `ResourceCleaner`, which calls the existing execution interface once per ID. IDs are deduplicated; no other submission's resources are touched.

Acknowledgement is deferred until the terminal outcome is committed and targeted cleanup succeeds. If cleanup or acknowledgement fails, the associated message remains pending; the next recovery pass sees the terminal/missing state, retries cleanup for that ID, and does not judge a terminal submission again.

## 8. Owned Sequence Diagrams

- [Compile](Diagram/SD-EXE-Compile.md)
- [Execute](Diagram/SD-EXE-Execute.md)
- [Cleanup](Diagram/SD-EXE-Cleanup.md)
