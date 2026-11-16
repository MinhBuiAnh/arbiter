# SubmissionCommandService — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `SubmissionCommandService` |
| Classifier kind | Class |
| Package / subsystem | `Submission Module (Go)` |
| DCD alias | `SUBSubmissionCommandService` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`SubmissionCommandService` is a class in the `Submission Module (Go)` package/subsystem of the design class diagram.

Application service for validating and accepting a submission with an outbox event.

- Declared outgoing design relationships: `SubmissionStore`, `ProblemQueryService`, `Submission`, `OutboxEvent`, `ProblemSubmissionContext`.
- Declared incoming design relationships: `SubmissionHandler`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `CreateSubmission(ctx: context.Context, principal: Principal, req: CreateSubmissionRequest)` | `(SubmissionStatusResponse, error)` | Public | Instance | Obtains the problem submission context, validates the request, builds the submission and outbox event, and stores both atomically through `SubmissionStore`. |
| `ValidateSubmission(ctx: context.Context, req: CreateSubmissionRequest, problem: *ProblemSubmissionContext)` | `error` | Private | Instance | Internal helper that checks problem availability, language allowance, source presence, and source size before the submission is built. |
| `BuildSubmission(ctx: context.Context, principal: Principal, req: CreateSubmissionRequest)` | `(*Submission, *OutboxEvent, error)` | Private | Instance | Internal helper that creates the `Submission` in `QUEUED` state from the principal, request, and current time, and creates the matching `OutboxEvent` for the same submission. |
| `StoreSubmissionAndEvent(ctx: context.Context, submission: *Submission, event: *OutboxEvent)` | `error` | Private | Instance | Internal helper that delegates the atomic submission-plus-event write to `SubmissionStore.StoreSubmissionAndEvent`. |
| `HandlePersistenceFailure(err: error)` | `error` | Private | Instance | Internal helper that maps store failures to the declared validation, conflict, not-found, or internal outcomes and does not report a partially committed submission as accepted. |

## 4. Parameter design

### `CreateSubmission(ctx: context.Context, principal: Principal, req: CreateSubmissionRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `req` | `CreateSubmissionRequest` | — | in | Problem identifier, language, and source text. |

### `ValidateSubmission(ctx: context.Context, req: CreateSubmissionRequest, problem: *ProblemSubmissionContext)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `req` | `CreateSubmissionRequest` | — | in | Submitted language and source data. |
| `problem` | `*ProblemSubmissionContext` | — | in | Problem limits, languages, and availability context. |

### `BuildSubmission(ctx: context.Context, principal: Principal, req: CreateSubmissionRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `req` | `CreateSubmissionRequest` | — | in | Supplies the request or command payload. |

### `StoreSubmissionAndEvent(ctx: context.Context, submission: *Submission, event: *OutboxEvent)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `submission` | `*Submission` | — | in | Supplies the submission used by the operation. |
| `event` | `*OutboxEvent` | — | in | Carries the outbox event to publish. |

### `HandlePersistenceFailure(err: error)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `err` | `error` | — | in | Supplies the collaborator failure to classify or persist. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-VAL-013` | Unsupported programming language. | The submission is rejected before judging. | [SD-UC-U-P-03-SubmitSolution](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution.md) |
| `ERR-VAL-014` | Invalid submission data. | The submission is rejected; no submission or outbox row is created. | [SD-UC-U-P-03-SubmitSolution](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution.md) |
| `ERR-PERM-001` | Problem is not publicly accessible. | The read or submission is rejected as not permitted. | [SD-UC-U-P-03-SubmitSolution-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution-Exceptions.md) |
| `ERR-RES-001` | Problem not found. | The operation is rejected without changing state. | [SD-UC-U-P-03-SubmitSolution-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution-Exceptions.md) |
| `ERR-LIMIT-001` | Rate limit exceeded. | The request is rejected with retry information; no state is changed. | [SD-UC-U-P-03-SubmitSolution-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution-Exceptions.md) |
| `ERR-SYS-001` | Internal system, persistence, or assembly error. | The request fails with an internal error; transactions roll back where applicable. | [SD-UC-U-P-03-SubmitSolution](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution.md) |
| `ERR-SYS-002` | Redis or queue unavailable, or message claim failure. | Publication is retried with backoff; the committed submission remains queued. | [SD-UC-U-P-03-SubmitSolution](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution.md) |

## 6. Method

### `CreateSubmission(ctx: context.Context, principal: Principal, req: CreateSubmissionRequest)`

Obtains the problem submission context, validates the request, builds the submission and outbox event, and stores both atomically through `SubmissionStore`. It uses `ctx`, `principal`, `req`. It returns `(SubmissionStatusResponse, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ValidateSubmission(ctx: context.Context, req: CreateSubmissionRequest, problem: *ProblemSubmissionContext)`

Checks problem availability, language allowance, source presence, and source size before the submission is built. It uses `ctx`, `req`, `problem`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `BuildSubmission(ctx: context.Context, principal: Principal, req: CreateSubmissionRequest)`

Creates the `Submission` in `QUEUED` state from the principal, request, and current time, and creates the matching `OutboxEvent` for the same submission. It uses `ctx`, `principal`, `req`. It returns `(*Submission, *OutboxEvent, error)`. Failures are returned through the declared error result rather than as a successful value.

### `StoreSubmissionAndEvent(ctx: context.Context, submission: *Submission, event: *OutboxEvent)`

Delegates the atomic submission-plus-event write to `SubmissionStore.StoreSubmissionAndEvent`. It uses `ctx`, `submission`, `event`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `HandlePersistenceFailure(err: error)`

Maps store failures to the declared validation, conflict, not-found, or internal outcomes and does not report a partially committed submission as accepted. It uses `err`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
