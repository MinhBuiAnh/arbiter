# SD-MQ-Read — Read New Submission Messages

| Field | Value |
|---|---|
| Sequence Diagram ID | `SD-MQ-Read` |
| Owning subsystem | Message Queue Subsystem |
| Interface operation | `SubmissionQueue.Read(ctx, consumer, count)` |
| Element specification | [RedisStreamQueue](../Specification/RedisStreamQueue.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-19 |

```plantuml
@startuml SD-MQ-Read
title SD-MQ-Read - Read new entries from the consumer group
hide footbox
autonumber
skinparam shadowing false
skinparam responseMessageBelowArrow true

participant "SubmissionQueue\n<<interface>>" as I
participant "RedisStreamQueue" as MQ
participant "RedisStreamClient" as Redis

I -> MQ : Read(ctx, consumer, count)
MQ -> MQ : validate context, count, consumer,\nstream key, and consumer group
alt invalid argument or canceled context
  MQ --> I : error; no messages
else valid
  MQ -> Redis : XREADGROUP GROUP judge-workers consumer\nCOUNT count STREAMS judge:submissions >
  alt Redis unavailable or command fails
    Redis --> MQ : command error
    MQ --> I : ERR-SYS-002
  else no new entries
    Redis --> MQ : empty result
    MQ --> I : empty slice
  else entries returned
    Redis --> MQ : stream entry IDs and fields
    loop each entry
      MQ -> MQ : parse ID and required fields
      alt malformed entry
        MQ --> I : error; no partial message list
      else valid entry
        MQ -> MQ : append QueueMessage
      end
    end
    MQ --> I : []QueueMessage
  end
end
@enduml
```
