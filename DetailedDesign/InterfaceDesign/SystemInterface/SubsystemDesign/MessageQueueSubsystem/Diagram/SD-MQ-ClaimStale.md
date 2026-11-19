# SD-MQ-ClaimStale — Reclaim Idle Pending Messages

| Field | Value |
|---|---|
| Sequence Diagram ID | `SD-MQ-ClaimStale` |
| Owning subsystem | Message Queue Subsystem |
| Interface operation | `SubmissionQueue.ClaimStale(ctx, consumer, olderThan)` |
| Element specification | [RedisStreamQueue](../Specification/RedisStreamQueue.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-19 |

```plantuml
@startuml SD-MQ-ClaimStale
title SD-MQ-ClaimStale - XAUTOCLAIM idle pending entries
hide footbox
autonumber
skinparam shadowing false
skinparam responseMessageBelowArrow true

participant "SubmissionQueue\n<<interface>>" as I
participant "RedisStreamQueue" as MQ
participant "RedisStreamClient" as Redis

I -> MQ : ClaimStale(ctx, consumer, olderThan)
MQ -> MQ : validate context, consumer,\nstream key, group, and duration
alt invalid argument or canceled context
  MQ --> I : error; no messages
else valid
  MQ -> Redis : XAUTOCLAIM judge:submissions judge-workers\nconsumer olderThan start
  alt Redis unavailable or command fails
    Redis --> MQ : command error
    MQ --> I : ERR-SYS-002
  else no stale entries
    Redis --> MQ : empty result
    MQ --> I : empty slice
  else stale entries returned
    Redis --> MQ : entries claimed for consumer
    loop each entry
      MQ -> MQ : parse entry ID and required fields
      alt malformed entry
        MQ --> I : error; no partial message list
      else valid entry
        MQ -> MQ : append QueueMessage
      end
    end
    MQ --> I : []QueueMessage
  end
end
note over MQ, Redis
  Redis atomically transfers qualifying PEL entries to consumer.
  Entries claimed by another consumer are omitted.
end note
@enduml
```
