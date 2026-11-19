# SD-MQ-Enqueue — Publish Submission Event

| Field | Value |
|---|---|
| Sequence Diagram ID | `SD-MQ-Enqueue` |
| Owning subsystem | Message Queue Subsystem |
| Interface operation | `SubmissionQueue.Enqueue(ctx, message)` |
| Element specification | [RedisStreamQueue](../Specification/RedisStreamQueue.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-19 |

```plantuml
@startuml SD-MQ-Enqueue
title SD-MQ-Enqueue - Add submission event to Redis Stream
hide footbox
autonumber
skinparam shadowing false
skinparam responseMessageBelowArrow true

participant "SubmissionQueue\n<<interface>>" as I
participant "RedisStreamQueue" as MQ
participant "RedisStreamClient" as Redis

I -> MQ : Enqueue(ctx, message)
MQ -> MQ : validate context and identifiers
alt invalid argument or canceled context
  MQ --> I : error; stream unchanged
else valid
  MQ -> MQ : encode event_id, submission_id,\ndecimal attempt, RFC3339 timestamp
  MQ -> Redis : XADD judge:submissions fields
  alt Redis unavailable or XADD fails
    Redis --> MQ : command error
    MQ --> I : ERR-SYS-002
  else XADD succeeds
    Redis --> MQ : assigned Redis stream entry ID
    MQ --> I : nil
  end
end
note over MQ, Redis
  Redis assigns the entry ID. Enqueue does not mark the outbox event published;
  the caller does that only after a successful return.
end note
@enduml
```
