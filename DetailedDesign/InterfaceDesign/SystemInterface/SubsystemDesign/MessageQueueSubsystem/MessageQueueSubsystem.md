# Message Queue Subsystem Design

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Subsystem design |
| Owning subsystem | Message Queue Subsystem (Go) |
| External contract | [SubmissionQueue](../../SubsystemInterfaceDesign/MessageQueueSubsystem/SubmissionQueue.md) |
| DCD | [DesignClassDiagram.md](../../../../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Subsystem Design Ruleset](../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-19 |

## 1. Responsibility

The Message Queue Subsystem realizes `SubmissionQueue` with Redis Streams. It publishes judge events, reads new work through a consumer group, acknowledges only durable outcomes, leaves interrupted work pending, and claims idle pending entries for recovery.

The subsystem is an internal part of the modular monolith, not a separately deployed service. Redis is a delivery mechanism; PostgreSQL remains the Submission source of truth.

## 2. Realized Interface

| Interface operation | Internal realization | Collaborations | Sequence diagram |
|---|---|---|---|
| `Enqueue(ctx, message)` | `RedisStreamQueue.Enqueue` | Redis Stream `XADD` | [SD-MQ-Enqueue](Diagram/SD-MQ-Enqueue.md) |
| `Read(ctx, consumer, count)` | `RedisStreamQueue.Read` | Redis Consumer Group `XREADGROUP` | [SD-MQ-Read](Diagram/SD-MQ-Read.md) |
| `Acknowledge(ctx, message)` | `RedisStreamQueue.Acknowledge` | Redis Consumer Group `XACK` | [SD-MQ-Acknowledge](Diagram/SD-MQ-Acknowledge.md) |
| `LeavePending(ctx, message)` | `RedisStreamQueue.LeavePending` | Context validation; no acknowledgement mutation | [SD-MQ-LeavePending](Diagram/SD-MQ-LeavePending.md) |
| `ClaimStale(ctx, consumer, olderThan)` | `RedisStreamQueue.ClaimStale` | Redis Consumer Group `XAUTOCLAIM` | [SD-MQ-ClaimStale](Diagram/SD-MQ-ClaimStale.md) |

The normal stream key is `judge:submissions` and the normal consumer group is `judge-workers`. Configuration must create the stream/group before worker consumption. The adapter treats a missing group as an infrastructure error and does not silently create queue semantics outside its configured setup.

## 3. Internal Elements

| Element | Kind | Responsibility | Specification |
|---|---|---|---|
| `RedisStreamQueue` | Class | Encodes queue values, performs Redis Stream operations, and preserves the pending-entry lifecycle. | [RedisStreamQueue.md](Specification/RedisStreamQueue.md) |

The interface-facing specifications remain in [Subsystem Interface Design](../../SubsystemInterfaceDesign/MessageQueueSubsystem/) and are linked rather than duplicated here.

## 4. Dependencies

| Source element | Target interface or package | Reason | Kind | Exception justification |
|---|---|---|---|---|
| `RedisStreamQueue` | `RedisStreamClient` internal interface | Encapsulates Redis Stream commands for testability and adapter substitutability. | Interface | Package-private internal interface; it is not exposed by `SubmissionQueue`. |
| `RedisStreamQueue` | Redis Go client package | Provides the Redis connection and stream/group command implementation. | Allowed exception | No Arbiter Redis subsystem interface exists; the dependency is confined to this adapter. |
| `RedisStreamQueue` | Go standard-library packages (`context`, `encoding/json`, `fmt`, `strconv`, `time`) | Validates arguments, encodes/decodes fields and IDs, and handles durations and timestamps. | Package | — |

No dependency cycle is introduced. The QueueMessage value remains owned by the Message Queue Subsystem, while JudgeWorker and OutboxDispatcher depend only on `SubmissionQueue`.

## 5. Redis Data and Lifecycle

- `Enqueue` serializes queue fields with a Redis stream entry:
  - `id` is assigned by Redis, not by the caller
  - `event_id`
  - `submission_id`
  - `attempt`
  - `enqueued_at`
- QueueMessage fields are encoded as strings. `Attempt` is a decimal integer and `EnqueuedAt` is RFC3339 UTC text.
- `Read` uses `XREADGROUP` for `>` (new entries) in the configured consumer group. It sets `count` only if positive and returns no entry for no new work.
- Redis stream entry ID becomes `QueueMessage.ID`; entry data is decoded without logging source code or hidden test data. Submission queue fields contain identifiers and metadata only.
- `Acknowledge` issues `XACK` only for the supplied entry ID and consumer group. A successful Redis call with zero acknowledged entries is still an error: the caller must not assume delivery was acknowledged.
- `LeavePending` does not issue `XACK`. It validates the entry and context, then returns success because the entry remains in the pending-entry list. It must not delete or alter the entry.
- `ClaimStale` uses `XAUTOCLAIM` with `olderThan` as the minimum idle duration, in a consumer group, assigning entries to the requested consumer. Claim races omit entries already claimed by another consumer.
- The adapter uses Redis read/command results only to identify delivery; PostgreSQL is authoritative for Submission state and retry eligibility.
- XACK is not a source-of-truth commit. Callers acknowledge only after the terminal state/result transaction and required cleanup have succeeded.

## 6. Failure Ownership

| Outcome | Subsystem behavior | Caller responsibility |
|---|---|---|
| Redis unavailable or command timeout (`ERR-SYS-002`) | Return the Redis error; Enqueue leaves no published outcome assumption, Read/Claim leave work unclaimed or pending, and Acknowledge never reports success. | Retry with backoff; preserve outbox events and pending Submission jobs. |
| Invalid stream entry or argument | Return an error and no partial message list. | Leave malformed work pending or alert as an infrastructure/recovery failure; do not infer Submission state. |
| No new or stale messages | Return an empty slice and no error. | Run normal wait/backoff behavior. |
| XACK zero entries | Return `ERR-SYS-002`; the caller leaves the message pending. | Retry acknowledgement; preserve committed state. |
| Context cancellation | Stop the Redis operation and return `ctx.Err()` where supported. | Leave work pending or retry according to caller lifecycle. |

## 7. Owned Sequence Diagrams

- [Enqueue](Diagram/SD-MQ-Enqueue.md)
- [Read](Diagram/SD-MQ-Read.md)
- [Acknowledge](Diagram/SD-MQ-Acknowledge.md)
- [LeavePending](Diagram/SD-MQ-LeavePending.md)
- [ClaimStale](Diagram/SD-MQ-ClaimStale.md)
