# RedisStreamQueue — Subsystem Element Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Subsystem element specification |
| Element | `RedisStreamQueue` |
| Owning subsystem | Message Queue Subsystem (Go) |
| Classifier kind | Class |
| Realized interface | [SubmissionQueue](../../../SubsystemInterfaceDesign/MessageQueueSubsystem/SubmissionQueue.md) |
| Interface-facing class specification | [RedisStreamQueue](../../../SubsystemInterfaceDesign/MessageQueueSubsystem/RedisStreamQueue.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-19 |

## 1. Identification

`RedisStreamQueue` is the concrete adapter that realizes `SubmissionQueue` using Redis Streams. It encodes queue metadata, consumes entries through `judge-workers`, acknowledges durable work, leaves interrupted work pending, and reclaims idle entries.

## 2. Attribute Design

| Name | Data type | Visibility | Scope | Default value | Description |
|---|---|---|---|---|---|
| `client` | `RedisStreamClient` | Private | Instance | — | Internal Redis Stream client interface used for commands. |
| `streamKey` | `string` | Private | Instance | `"judge:submissions"` | Stream containing judge events. |
| `consumerGroup` | `string` | Private | Instance | `"judge-workers"` | Consumer group used by Judge Workers. |

## 3. Operation Design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|---|---|---|---|---|
| `Enqueue(ctx: context.Context, message: QueueMessage)` | `error` | Public | Instance | XADDs one submission queue entry. |
| `Read(ctx: context.Context, consumer: string, count: int)` | `([]QueueMessage, error)` | Public | Instance | XREADGROUPs up to `count` new entries. |
| `Acknowledge(ctx: context.Context, message: QueueMessage)` | `error` | Public | Instance | XACKs one delivered entry. |
| `LeavePending(ctx: context.Context, message: QueueMessage)` | `error` | Public | Instance | Validates the entry and leaves it pending without an acknowledgement mutation. |
| `ClaimStale(ctx: context.Context, consumer: string, olderThan: time.Duration)` | `([]QueueMessage, error)` | Public | Instance | XAUTOCLAIMs idle entries for the requested consumer. |

## 4. Parameter Design

### `Enqueue(ctx: context.Context, message: QueueMessage)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-------------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation and deadline. |
| `message` | `QueueMessage` | — | in | Queue metadata to encode. |

### `Read(ctx: context.Context, consumer: string, count: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-------------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation and deadline. |
| `consumer` | `string` | — | in | Redis consumer name. |
| `count` | `int` | — | in | Maximum number of entries to read. |

### `Acknowledge(ctx: context.Context, message: QueueMessage)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-------------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation and deadline. |
| `message` | `QueueMessage` | — | in | Entry to remove from the pending list after a durable outcome. |

### `LeavePending(ctx: context.Context, message: QueueMessage)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-------------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation and deadline. |
| `message` | `QueueMessage` | — | in | Entry that must remain pending. |

### `ClaimStale(ctx: context.Context, consumer: string, olderThan: time.Duration)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-------------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation and deadline. |
| `consumer` | `string` | — | in | Consumer receiving idle entries. |
| `olderThan` | `time.Duration` | — | in | Minimum pending idle duration. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-SYS-002` | Redis connection or stream/group command fails. | Return an error; never translate queue failure into queue success or Submission success. | [SD-MQ-Enqueue](../Diagram/SD-MQ-Enqueue.md), [SD-MQ-Acknowledge](../Diagram/SD-MQ-Acknowledge.md) |
| Invalid argument | Canceled context, invalid count/duration, blank consumer/group/key, or invalid entry ID. | Return an error before Redis mutation. | [SD-MQ-Read](../Diagram/SD-MQ-Read.md), [SD-MQ-ClaimStale](../Diagram/SD-MQ-ClaimStale.md) |
| Malformed entry | A returned stream entry lacks required fields or has invalid ID, UUID, attempt, or timestamp. | Return no partial message list and an error. | [SD-MQ-Read](../Diagram/SD-MQ-Read.md) |
| Zero XACK entries | The entry is not in the current consumer group's pending list. | Return `ERR-SYS-002`; leave the caller to retry without assuming acknowledgement. | [SD-MQ-Acknowledge](../Diagram/SD-MQ-Acknowledge.md) |

## 6. Method

### `Enqueue(ctx: context.Context, message: QueueMessage)`

Validates the context and message identifiers, attempt, enqueue timestamp, stream key, and group. It encodes `EventID`, `SubmissionID`, decimal `Attempt`, and RFC3339 UTC `EnqueuedAt` as Redis field values, then issues `XADD` to `streamKey`. Redis assigns `QueueMessage.ID`; no caller ID is overwritten. A Redis or encoding failure returns `ERR-SYS-002` or an invalid-argument error. The method neither marks the outbox event published nor acknowledges a delivery.

### `Read(ctx: context.Context, consumer: string, count: int)`

Checks cancellation, positive count, consumer, stream key, and consumer group. It issues `XREADGROUP GROUP consumerGroup consumer COUNT count STREAMS streamKey >`. For every entry, it parses the Redis entry ID and required fields. Invalid or incomplete entries produce an error and no partial slice. Valid entries become `QueueMessage` values; no entry means an empty slice and success.

### `Acknowledge(ctx: context.Context, message: QueueMessage)`

Checks cancellation and the Redis stream entry ID. It issues `XACK streamKey consumerGroup message.ID`. If Redis returns zero acknowledged entries, it returns `ERR-SYS-002`; a positive count means the entry was removed from the PEL. The caller invokes this operation only after its durable outcome and required cleanup.

### `LeavePending(ctx: context.Context, message: QueueMessage)`

Checks cancellation and validates `message.ID`. It performs no Redis mutation and issues no XACK or XDEL. Success means the entry remains in the PEL and will become eligible for a later stale claim. Redis entry loss or connection state is not inferred by this method.

### `ClaimStale(ctx: context.Context, consumer: string, olderThan: time.Duration)`

Checks cancellation, consumer, positive/representable duration, stream key, and consumer group. It invokes `XAUTOCLAIM streamKey consumerGroup consumer olderThanMilliseconds start` and decodes returned entries. Entries claimed by another consumer are omitted by Redis. Malformed entries produce an error and no partial list. An empty result is success.

## 7. Other Diagrams

- [Enqueue](../Diagram/SD-MQ-Enqueue.md)
- [Read](../Diagram/SD-MQ-Read.md)
- [Acknowledge](../Diagram/SD-MQ-Acknowledge.md)
- [LeavePending](../Diagram/SD-MQ-LeavePending.md)
- [ClaimStale](../Diagram/SD-MQ-ClaimStale.md)
