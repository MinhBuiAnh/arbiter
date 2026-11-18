# SubmissionQueue — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `SubmissionQueue` |
| Classifier kind | Interface |
| Package / subsystem | `Message Queue Subsystem (Go)` |
| DCD alias | `MQSubmissionQueue` |
| Design class diagram | [DesignClassDiagram.md](../../../../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../../../ClassDiagram/Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`SubmissionQueue` is an interface in the `Message Queue Subsystem (Go)` package/subsystem of the design class diagram.

Message-queue port for submission enqueue, read, acknowledgement, and stale-message claims.

- Declared incoming design relationships: `JudgeWorker`, `OutboxDispatcher`, `RedisStreamQueue`.
- Realized by: `RedisStreamQueue`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `Enqueue(ctx: context.Context, message: QueueMessage)` | `error` | Public | Instance | Adds the message to the queue. |
| `Read(ctx: context.Context, consumer: string, count: int)` | `([]QueueMessage, error)` | Public | Instance | Reads up to `count` messages for the consumer. |
| `Acknowledge(ctx: context.Context, message: QueueMessage)` | `error` | Public | Instance | Marks the message as processed so it is not delivered again. |
| `LeavePending(ctx: context.Context, message: QueueMessage)` | `error` | Public | Instance | Leaves the message available for a later delivery. |
| `ClaimStale(ctx: context.Context, consumer: string, olderThan: time.Duration)` | `([]QueueMessage, error)` | Public | Instance | Claims messages older than `olderThan` for the consumer. |

## 4. Parameter design

### `Enqueue(ctx: context.Context, message: QueueMessage)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `message` | `QueueMessage` | — | in | Carries the queue message to act on. |

### `Read(ctx: context.Context, consumer: string, count: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `consumer` | `string` | — | in | Consumer name used for claiming messages. |
| `count` | `int` | — | in | Maximum number of messages to read. |

### `Acknowledge(ctx: context.Context, message: QueueMessage)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `message` | `QueueMessage` | — | in | Carries the queue message to act on. |

### `LeavePending(ctx: context.Context, message: QueueMessage)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `message` | `QueueMessage` | — | in | Carries the queue message to act on. |

### `ClaimStale(ctx: context.Context, consumer: string, olderThan: time.Duration)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `consumer` | `string` | — | in | Consumer name used for the stale claim. |
| `olderThan` | `time.Duration` | — | in | Minimum message age for a stale claim. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-SYS-002` | Redis or queue unavailable, or message claim failure. | Publication is retried with backoff; the committed submission remains queued. | [SD-UC-SYS-J-01-ProcessSubmission-Exceptions](../../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md) |

## 6. Method

### `Enqueue(ctx: context.Context, message: QueueMessage)`

Adds the message to the queue. It is implemented by `RedisStreamQueue`. It is called by `JudgeWorker`, `OutboxDispatcher`. It uses `ctx`, `message`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `Read(ctx: context.Context, consumer: string, count: int)`

Reads up to `count` messages for the consumer. It is implemented by `RedisStreamQueue`. It is called by `JudgeWorker`, `OutboxDispatcher`. It uses `ctx`, `consumer`, `count`. It returns `([]QueueMessage, error)`. Failures are returned through the declared error result rather than as a successful value.

### `Acknowledge(ctx: context.Context, message: QueueMessage)`

Marks the message as processed so it is not delivered again. It is implemented by `RedisStreamQueue`. It is called by `JudgeWorker`, `OutboxDispatcher`. It uses `ctx`, `message`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `LeavePending(ctx: context.Context, message: QueueMessage)`

Leaves the message available for a later delivery. It is implemented by `RedisStreamQueue`. It is called by `JudgeWorker`, `OutboxDispatcher`. It uses `ctx`, `message`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ClaimStale(ctx: context.Context, consumer: string, olderThan: time.Duration)`

Claims messages older than `olderThan` for the consumer. It is implemented by `RedisStreamQueue`. It is called by `JudgeWorker`, `OutboxDispatcher`. It uses `ctx`, `consumer`, `olderThan`. It returns `([]QueueMessage, error)`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
