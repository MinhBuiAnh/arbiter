# OutboxDispatcher — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `OutboxDispatcher` |
| Classifier kind | Class |
| Package / subsystem | `Outbox Module (Go)` |
| DCD alias | `OUTOutboxDispatcher` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`OutboxDispatcher` is a class in the `Outbox Module (Go)` package/subsystem of the design class diagram.

Application component that publishes committed outbox events to the submission queue.

- Declared outgoing design relationships: `OutboxStore`, `SubmissionQueue`, `OutboxEvent`, `QueueMessage`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `Run(ctx: context.Context)` | `error` | Public | Instance | Repeatedly dispatches pending events and waits between cycles. |
| `DispatchOnce(ctx: context.Context)` | `error` | Public | Instance | Finds unpublished events, publishes each submission event to the queue, and marks each event published after the enqueue succeeds. |
| `FindUnpublishedEvents(ctx: context.Context)` | `([]OutboxEvent, error)` | Private | Instance | Internal helper that reads pending events through `OutboxStore.FindUnpublishedEvents`; the batch size is configuration, not a class attribute. |
| `PublishSubmissionEvent(ctx: context.Context, event: *OutboxEvent)` | `error` | Private | Instance | Internal helper that builds a `QueueMessage` for the event and enqueues it through `SubmissionQueue.Enqueue`. |
| `MarkEventPublished(ctx: context.Context, eventID: EventID)` | `error` | Private | Instance | Internal helper that marks the event published through `OutboxStore.MarkEventPublished`. |

## 4. Parameter design

### `Run(ctx: context.Context)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |

### `DispatchOnce(ctx: context.Context)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |

### `FindUnpublishedEvents(ctx: context.Context)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |

### `PublishSubmissionEvent(ctx: context.Context, event: *OutboxEvent)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `event` | `*OutboxEvent` | — | in | Unpublished outbox event to publish. |

### `MarkEventPublished(ctx: context.Context, eventID: EventID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `eventID` | `EventID` | — | in | Event to mark as published. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-SYS-002` | Redis or queue unavailable, or message claim failure. | Publication is retried with backoff; the committed submission remains queued. | [SD-UC-U-P-03-SubmitSolution](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution.md) |

## 6. Method

### `Run(ctx: context.Context)`

Repeatedly dispatches pending events and waits between cycles. It uses `ctx`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `DispatchOnce(ctx: context.Context)`

Finds unpublished events, publishes each submission event to the queue, and marks each event published after the enqueue succeeds. It uses `ctx`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `FindUnpublishedEvents(ctx: context.Context)`

Reads pending events through `OutboxStore.FindUnpublishedEvents`; the batch size is configuration, not a class attribute. It uses `ctx`. It returns `([]OutboxEvent, error)`. Failures are returned through the declared error result rather than as a successful value.

### `PublishSubmissionEvent(ctx: context.Context, event: *OutboxEvent)`

Builds a `QueueMessage` for the event and enqueues it through `SubmissionQueue.Enqueue`. It uses `ctx`, `event`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `MarkEventPublished(ctx: context.Context, eventID: EventID)`

Marks the event published through `OutboxStore.MarkEventPublished`. It uses `ctx`, `eventID`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
