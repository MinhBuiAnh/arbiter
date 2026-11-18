# JudgeWorker — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `JudgeWorker` |
| Classifier kind | Class |
| Package / subsystem | `Judge Module (Go)` |
| DCD alias | `JDGJudgeWorker` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`JudgeWorker` is a class in the `Judge Module (Go)` package/subsystem of the design class diagram.

Queue-driven worker loop that recovers and processes pending submissions.

- Declared outgoing design relationships: `SubmissionQueue`, `SubmissionStore`, `SubmissionProcessor`, `ResourceCleaner`, `QueueMessage`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `Run(ctx: context.Context)` | `error` | Public | Instance | Repeatedly selects eligible messages, processes each submission, acknowledges only committed work whose required cleanup succeeded, and waits for the next cycle. |
| `ProcessNext(ctx: context.Context)` | `error` | Public | Instance | Selects eligible messages, inspects each submission, resets interrupted work or records an exhausted attempt limit, and invokes `SubmissionProcessor.Process`. |
| `RecoverPendingSubmissions(ctx: context.Context)` | `error` | Public | Instance | Claims stale messages, recovers interrupted submissions, and supplies only safely identified submission IDs to `ResourceCleaner` for targeted cleanup. |
| `AcknowledgeAfterCommit(ctx: context.Context, message: QueueMessage)` | `error` | Public | Instance | Acknowledges `message` through `SubmissionQueue.Acknowledge` only after the terminal result is committed and required targeted cleanup succeeds. |
| `LeaveMessagePending(ctx: context.Context, message: QueueMessage)` | `void` | Public | Instance | Leaves `message` pending through `SubmissionQueue.LeavePending` when the committed outcome is uncertain. |
| `SelectEligibleMessages(ctx: context.Context)` | `([]QueueMessage, error)` | Private | Instance | Internal helper that reads or claims eligible messages through `SubmissionQueue.Read` and `SubmissionQueue.ClaimStale`. |
| `InspectSubmission(ctx: context.Context, submissionID: SubmissionID)` | `(*Submission, error)` | Private | Instance | Internal helper that loads the submission through `SubmissionStore.LoadSubmission` for eligibility checks. |
| `ResetInterruptedSubmission(ctx: context.Context, submission: *Submission)` | `error` | Private | Instance | Internal helper that resets the interrupted submission through `SubmissionStore.ResetToQueued`. |
| `MarkAttemptLimitReached(ctx: context.Context, submission: *Submission)` | `error` | Private | Instance | Internal helper that records the internal-error outcome through `SubmissionStore.MarkInternalError` when the attempt limit is exhausted. |
| `WaitForNextCycle(ctx: context.Context)` | `error` | Private | Instance | Internal helper that waits for the configured polling interval before the next selection cycle; the interval value is configuration, not a class attribute. |
| `ValidateConfiguration()` | `error` | Private | Instance | Internal helper that checks that the declared queue, store, processor, cleaner, and retry settings are present before the loop starts. |

## 4. Parameter design

### `Run(ctx: context.Context)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |

### `ProcessNext(ctx: context.Context)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |

### `RecoverPendingSubmissions(ctx: context.Context)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |

### `AcknowledgeAfterCommit(ctx: context.Context, message: QueueMessage)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `message` | `QueueMessage` | — | in | Queue message whose work was committed. |

### `LeaveMessagePending(ctx: context.Context, message: QueueMessage)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `message` | `QueueMessage` | — | in | Queue message that must remain pending. |

### `SelectEligibleMessages(ctx: context.Context)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |

### `InspectSubmission(ctx: context.Context, submissionID: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `submissionID` | `SubmissionID` | — | in | Submission to load and inspect. |

### `ResetInterruptedSubmission(ctx: context.Context, submission: *Submission)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `submission` | `*Submission` | — | in | Interrupted submission to reset to queued. |

### `MarkAttemptLimitReached(ctx: context.Context, submission: *Submission)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `submission` | `*Submission` | — | in | Submission that exhausted its judging attempts. |

### `WaitForNextCycle(ctx: context.Context)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |

### `ValidateConfiguration()`

This operation has no parameters.

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-SYS-001` | Internal system, persistence, or assembly error. | The request fails with an internal error; transactions roll back where applicable. | [SD-UC-SYS-J-01-ProcessSubmission-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md) |
| `ERR-SYS-002` | Redis or queue read, claim, or acknowledgement failure. | Leave the message pending and retry with backoff; preserve any committed terminal result and let recovery retry cleanup and acknowledgement. | [SD-UC-SYS-J-01-ProcessSubmission-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md), [SD-UC-SYS-J-02-RecoverPendingSubmission](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-02-RecoverPendingSubmission.md) |
| `ERR-SYS-003` | PostgreSQL unavailable. | The request fails with an internal error; no partial write is committed. | [SD-UC-SYS-J-01-ProcessSubmission-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md) |
| `ERR-SYS-007` | Browser storage unavailable or worker terminated before acknowledgement. | The session or worker recovers conservatively; work is not acknowledged without a committed result and required cleanup. | [SD-UC-SYS-J-01-ProcessSubmission-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md) |
| `ERR-SYS-006` | Targeted cleanup fails for one or more recovered submissions. | Keep associated messages pending; recovery retries cleanup without rejudging a terminal submission. | [SD-UC-SYS-J-02-RecoverPendingSubmission](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-02-RecoverPendingSubmission.md), [SD-UC-SYS-J-01-ProcessSubmission](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission.md) |
| `ERR-SYS-009` | Editor or judge configuration error. | The operation reports a configuration failure. | [SD-UC-U-P-02-SelectProgrammingLanguage](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-02-SelectProgrammingLanguage.md) |

## 6. Method

### `Run(ctx: context.Context)`

Repeatedly selects eligible messages, processes each submission, acknowledges only committed work whose required cleanup succeeded, and waits for the next cycle. It uses `ctx`. It returns `error`.

### `ProcessNext(ctx: context.Context)`

Selects eligible messages, inspects each submission, resets interrupted work or records an exhausted attempt limit, and invokes `SubmissionProcessor.Process`. It acknowledges a message only after its terminal outcome is committed and required cleanup has succeeded. It uses `ctx`. It returns `error`.

### `RecoverPendingSubmissions(ctx: context.Context)`

Claims stale messages and inspects each corresponding Submission. It accumulates candidate IDs only when the Submission is missing, terminal, or has a committed attempt-limit error, then passes those IDs to `ResourceCleaner.ScheduleOrphanCleanup`. If that batch cleanup fails, it leaves those messages pending; if cleanup succeeds, it acknowledges them. An acknowledgement failure leaves that message pending for a later recovery cycle. For interrupted non-terminal work, it resets the Submission and invokes `ResourceCleaner.CleanFailedResources` before retrying it. It uses `ctx`. It returns `error`.

### `AcknowledgeAfterCommit(ctx: context.Context, message: QueueMessage)`

Calls `ResourceCleaner.CleanFailedResources` for `message.SubmissionID`, then acknowledges `message` through `SubmissionQueue.Acknowledge`. It is called only after the terminal outcome is committed. If cleanup or acknowledgement fails, the message remains pending; recovery can retry cleanup without rejudging a terminal Submission. It uses `ctx`, `message`. It returns `error`.

### `LeaveMessagePending(ctx: context.Context, message: QueueMessage)`

Leaves `message` pending through `SubmissionQueue.LeavePending` when the committed outcome is uncertain. It uses `ctx`, `message`. No value is returned.

### `SelectEligibleMessages(ctx: context.Context)`

Reads or claims eligible messages through `SubmissionQueue.Read` and `SubmissionQueue.ClaimStale`. It uses `ctx`. It returns `([]QueueMessage, error)`. Failures are returned through the declared error result rather than as a successful value.

### `InspectSubmission(ctx: context.Context, submissionID: SubmissionID)`

Loads the submission through `SubmissionStore.LoadSubmission` for eligibility checks. It uses `ctx`, `submissionID`. It returns `(*Submission, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ResetInterruptedSubmission(ctx: context.Context, submission: *Submission)`

Resets the interrupted submission through `SubmissionStore.ResetToQueued`. It uses `ctx`, `submission`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `MarkAttemptLimitReached(ctx: context.Context, submission: *Submission)`

Records the internal-error outcome through `SubmissionStore.MarkInternalError` when the attempt limit is exhausted. It uses `ctx`, `submission`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `WaitForNextCycle(ctx: context.Context)`

Waits for the configured polling interval before the next selection cycle; the interval value is configuration, not a class attribute. It uses `ctx`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ValidateConfiguration()`

Checks that the declared queue, store, processor, cleaner, and retry settings are present before the loop starts. It has no parameters. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
