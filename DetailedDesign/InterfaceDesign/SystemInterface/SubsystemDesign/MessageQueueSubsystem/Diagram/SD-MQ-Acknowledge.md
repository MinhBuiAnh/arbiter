# SD-MQ-Acknowledge — Acknowledge Durable Outcome

| Field | Value |
|---|---|
| Sequence Diagram ID | `SD-MQ-Acknowledge` |
| Owning subsystem | Message Queue Subsystem |
| Interface operation | `SubmissionQueue.Acknowledge(ctx, message)` |
| Element specification | [RedisStreamQueue](../Specification/RedisStreamQueue.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-19 |

```plantuml
@startuml SD-MQ-Acknowledge
title SD-MQ-Acknowledge - Remove acknowledged entry from PEL
hide footbox
autonumber
skinparam shadowing false
skinparam responseMessageBelowArrow true

participant "SubmissionQueue\n<<interface>>" as I
participant "RedisStreamQueue" as MQ
participant "RedisStreamClient" as Redis

I -> MQ : Acknowledge(ctx, message)
MQ -> MQ : validate context and Redis stream entry ID
alt invalid argument or canceled context
  MQ --> I : error; PEL unchanged
else valid
  MQ -> Redis : XACK judge:submissions judge-workers message.ID
  alt Redis unavailable or XACK fails
    Redis --> MQ : command error
    MQ --> I : ERR-SYS-002
  else XACK count is zero
    Redis --> MQ : acknowledged count 0
    MQ --> I : ERR-SYS-002
  else XACK count is positive
    Redis --> MQ : acknowledged count
    MQ --> I : nil
  end
end
note over I, MQ
  Caller ordering: XACK is invoked only after its transaction and cleanup outcome are durable.
end note
@enduml
```
