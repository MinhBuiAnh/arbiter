# SD-MQ-LeavePending — Keep Submission Message Pending

| Field | Value |
|---|---|
| Sequence Diagram ID | `SD-MQ-LeavePending` |
| Owning subsystem | Message Queue Subsystem |
| Interface operation | `SubmissionQueue.LeavePending(ctx, message)` |
| Element specification | [RedisStreamQueue](../Specification/RedisStreamQueue.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-19 |

```plantuml
@startuml SD-MQ-LeavePending
title SD-MQ-LeavePending - Preserve PEL membership without mutation
hide footbox
autonumber
skinparam shadowing false
skinparam responseMessageBelowArrow true

participant "SubmissionQueue\n<<interface>>" as I
participant "RedisStreamQueue" as MQ

I -> MQ : LeavePending(ctx, message)
MQ -> MQ : validate context and Redis stream entry ID
alt invalid argument or canceled context
  MQ --> I : error
else valid
  MQ -> MQ : preserve PEL membership; issue no Redis mutation
  MQ --> I : nil
end
note over MQ
  LeavePending does not issue XACK or XDEL. The entry becomes eligible
  for a later XAUTOCLAIM or XPENDING/XCLAIM recovery pass.
end note
@enduml
```
