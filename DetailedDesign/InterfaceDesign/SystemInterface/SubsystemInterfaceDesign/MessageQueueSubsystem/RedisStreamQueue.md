# RedisStreamQueue — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `RedisStreamQueue` |
| Classifier kind | Class |
| Package / subsystem | `Message Queue Subsystem (Go)` |
| DCD alias | `MQRedisStreamQueue` |
| Design class diagram | [DesignClassDiagram.md](../../../../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../../../ClassDiagram/Ruleset.md) |
| Status | Draft |
| Version | 0.2 |
| Date | 2026-11-19 |

## 1. Class identification

`RedisStreamQueue` is a class in the `Message Queue Subsystem (Go)` package/subsystem of the design class diagram.

Redis Streams adapter that realizes `SubmissionQueue`.

- Declared outgoing design relationships: `SubmissionQueue`.
- Realizes: `SubmissionQueue`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|---|---|---|---|---|---|
| `client` | `RedisStreamClient` | Private | Instance | — | Redis Streams client used to implement the queue contract. |
| `streamKey` | `string` | Private | Instance | — | Redis stream key; normal configuration is `judge:submissions`. |
| `consumerGroup` | `string` | Private | Instance | — | Consumer group; normal configuration is `judge-workers`. |

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|---|---|---|---|---|
| `Enqueue(ctx: context.Context, message: QueueMessage)` | `error` | Public | Instance | Adds a submission message to the Redis stream. |
| `Read(ctx: context.Context, consumer: string, count: int)` | `([]QueueMessage, error)` | Public | Instance | Reads up to `count` new stream messages for `consumer`. |
| `Acknowledge(ctx: context.Context, message: QueueMessage)` | `error` | Public | Instance | XACKs the delivered stream entry. |
| `LeavePending(ctx: context.Context, message: QueueMessage)` | `error` | Public | Instance | Leaves the entry in the pending-entry list for a later stale claim. |
| `ClaimStale(ctx: context.Context, consumer: string, olderThan: time.Duration)` | `([]QueueMessage, error)` | Public | Instance | Claims idle pending entries for the consumer. |

## 4. Parameter design

### `Enqueue(ctx: context.Context, message: QueueMessage)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-------------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation and deadlines. |
| `message` | `QueueMessage` | — | in | Submission event to encode in the stream. |

### `Read(ctx: context.Context, consumer: string, count: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-------------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation and deadlines. |
| `consumer` | `string` | — | in | Consumer name for the Redis group. |
| `count` | `int` | — | in | Maximum number of stream entries to read. |

### `Acknowledge(ctx: context.Context, message: QueueMessage)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-------------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation and deadlines. |
| `message` | `QueueMessage` | — | in | Delivered stream entry to acknowledge. |

### `LeavePending(ctx: context.Context, message: QueueMessage)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-------------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation and deadlines. |
| `message` | `QueueMessage` | — | in | Delivered stream entry that must remain pending. |

### `ClaimStale(ctx: context.Context, consumer: string, olderThan: time.Duration)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-------------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation and deadlines. |
| `consumer` | `string` | — | in | Consumer name receiving reclaimed entries. |
| `olderThan` | `time.Duration` | — | in | Minimum idle duration for stale reclaim. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-SYS-002` | Redis is unavailable or any stream/group operation fails. | Return the queue error; no XACK is issued and callers leave or retry the message according to the queue lifecycle. | [SubmissionQueue subsystem design](../../SubsystemDesign/MessageQueueSubsystem/MessageQueueSubsystem.md) |
| Invalid argument | Context is canceled, counts are non-positive, durations are negative, or message IDs are invalid. | Return an error before issuing a Redis mutation. | [RedisStreamQueue subsystem specification](../../SubsystemDesign/MessageQueueSubsystem/Specification/RedisStreamQueue.md) |

## 6. Method

Each operation implements the corresponding `SubmissionQueue` contract using the configured Redis stream and consumer group. Redis entry decoding, pending-entry behavior, and acknowledgement ordering are documented in the [internal element specification](../../SubsystemDesign/MessageQueueSubsystem/Specification/RedisStreamQueue.md).

## 7. Other diagrams

- [Enqueue](../../SubsystemDesign/MessageQueueSubsystem/Diagram/SD-MQ-Enqueue.md)
- [Read](../../SubsystemDesign/MessageQueueSubsystem/Diagram/SD-MQ-Read.md)
- [Acknowledge](../../SubsystemDesign/MessageQueueSubsystem/Diagram/SD-MQ-Acknowledge.md)
- [LeavePending](../../SubsystemDesign/MessageQueueSubsystem/Diagram/SD-MQ-LeavePending.md)
- [ClaimStale](../../SubsystemDesign/MessageQueueSubsystem/Diagram/SD-MQ-ClaimStale.md)
