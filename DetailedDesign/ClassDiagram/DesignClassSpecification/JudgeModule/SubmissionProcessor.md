# SubmissionProcessor — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `SubmissionProcessor` |
| Classifier kind | Class |
| Package / subsystem | `Judge Module (Go)` |
| DCD alias | `JDGSubmissionProcessor` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`SubmissionProcessor` is a class in the `Judge Module (Go)` package/subsystem of the design class diagram.

Judge orchestrator that loads context, compiles, executes cases, evaluates the verdict, and persists it.

- Declared outgoing design relationships: `Compiler`, `TestCaseExecutor`, `VerdictEvaluator`, `ResourceCleaner`, `SubmissionStore`, `ExecutionEnvironment`, `JudgeContext`, `JudgeResult`.
- Declared incoming design relationships: `JudgeWorker`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `Process(ctx: context.Context, submissionID: SubmissionID)` | `error` | Public | Instance | Loads the judge context, validates the submission, compiles it, executes its cases, determines the verdict, and persists the terminal result. |
| `ValidateSubmission(ctx: context.Context, submission: *Submission)` | `error` | Public | Instance | Checks that the submission can be judged, the problem is available, the language is allowed, and executable test cases exist. |
| `PersistResult(ctx: context.Context, result: *JudgeResult)` | `error` | Public | Instance | Delegates the terminal result write to `SubmissionStore.PersistTerminalResult`. |
| `HandleInfrastructureFailure(ctx: context.Context, submission: *Submission, err: error)` | `void` | Private | Instance | Internal helper that records an internal-error result for the affected submission and schedules cleanup without inferring a user-code verdict. |
| `HandleUnexpectedError(ctx: context.Context, submission: *Submission, err: error)` | `void` | Private | Instance | Internal helper that records an internal-error result for the affected submission and preserves the failure for diagnosis. |
| `PersistInternalError(ctx: context.Context, submissionID: SubmissionID, reason: string)` | `error` | Private | Instance | Internal helper that delegates the internal-error write to `SubmissionStore.PersistInternalError`. |
| `LoadContext(ctx: context.Context, submissionID: SubmissionID)` | `(*JudgeContext, error)` | Private | Instance | Internal helper that loads the submission, problem context, and ordered test-case metadata through `SubmissionStore.LoadSubmissionContext`. |

## 4. Parameter design

### `Process(ctx: context.Context, submissionID: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `submissionID` | `SubmissionID` | — | in | Submission to judge. |

### `ValidateSubmission(ctx: context.Context, submission: *Submission)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `submission` | `*Submission` | — | in | Submission checked before judging. |

### `PersistResult(ctx: context.Context, result: *JudgeResult)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `result` | `*JudgeResult` | — | in | Terminal judge result to persist. |

### `HandleInfrastructureFailure(ctx: context.Context, submission: *Submission, err: error)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `submission` | `*Submission` | — | in | Submission affected by the infrastructure failure. |
| `err` | `error` | — | in | Failure returned by the execution environment or a collaborator. |

### `HandleUnexpectedError(ctx: context.Context, submission: *Submission, err: error)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `submission` | `*Submission` | — | in | Submission affected by the unexpected error. |
| `err` | `error` | — | in | Unexpected failure to classify. |

### `PersistInternalError(ctx: context.Context, submissionID: SubmissionID, reason: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `submissionID` | `SubmissionID` | — | in | Identifies the target submission. |
| `reason` | `string` | — | in | Failure reason recorded on the submission. |

### `LoadContext(ctx: context.Context, submissionID: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `submissionID` | `SubmissionID` | — | in | Identifies the target submission. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-VAL-002` | Invalid language or source configuration. | The submission is rejected before judging; no verdict is produced. | [SD-UC-SYS-J-01-ProcessSubmission](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission.md) |
| `ERR-CONFLICT-012` | Problem has no executable test cases. | The operation is rejected; no judge work is scheduled. | [SD-UC-SYS-J-01-ProcessSubmission](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission.md) |
| `ERR-RES-002` | Test-case data is missing or unreadable. | The operation is rejected; judging records an internal error rather than a user-code verdict. | [SD-UC-SYS-J-01-ProcessSubmission-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md) |
| `ERR-SYS-001` | Internal system, persistence, or assembly error. | The request fails with an internal error; transactions roll back where applicable. | [SD-UC-SYS-J-01-ProcessSubmission-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md) |
| `ERR-SYS-003` | PostgreSQL unavailable. | The request fails with an internal error; no partial write is committed. | [SD-UC-SYS-J-01-ProcessSubmission-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md) |
| `ERR-SYS-004` | Docker Engine or container failure. | Judging fails as an infrastructure error; no user-code verdict is inferred. | [SD-UC-SYS-J-01-ProcessSubmission-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md) |
| `ERR-SYS-005` | Output comparison failure. | The judge records an internal error rather than a wrong-answer verdict. | [SD-UC-SYS-J-01-ProcessSubmission](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission.md) |

## 6. Method

### `Process(ctx: context.Context, submissionID: SubmissionID)`

Loads the judge context, validates the submission, compiles it, executes its cases, determines the verdict, and persists the terminal result. It uses `ctx`, `submissionID`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ValidateSubmission(ctx: context.Context, submission: *Submission)`

Checks that the submission can be judged, the problem is available, the language is allowed, and executable test cases exist. It uses `ctx`, `submission`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `PersistResult(ctx: context.Context, result: *JudgeResult)`

Delegates the terminal result write to `SubmissionStore.PersistTerminalResult`. It uses `ctx`, `result`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `HandleInfrastructureFailure(ctx: context.Context, submission: *Submission, err: error)`

Records an internal-error result for the affected submission and schedules cleanup without inferring a user-code verdict. It uses `ctx`, `submission`, `err`. No value is returned.

### `HandleUnexpectedError(ctx: context.Context, submission: *Submission, err: error)`

Records an internal-error result for the affected submission and preserves the failure for diagnosis. It uses `ctx`, `submission`, `err`. No value is returned.

### `PersistInternalError(ctx: context.Context, submissionID: SubmissionID, reason: string)`

Delegates the internal-error write to `SubmissionStore.PersistInternalError`. It uses `ctx`, `submissionID`, `reason`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `LoadContext(ctx: context.Context, submissionID: SubmissionID)`

Loads the submission, problem context, and ordered test-case metadata through `SubmissionStore.LoadSubmissionContext`. It uses `ctx`, `submissionID`. It returns `(*JudgeContext, error)`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
