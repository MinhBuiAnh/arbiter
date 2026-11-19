# SD-PERS-Outbox — Outbox Persistence Operations

| Field | Value |
|---|---|
| Sequence Diagram ID | `SD-PERS-Outbox` |
| Owning subsystem | Persistence Subsystem |
| Realized interface | `OutboxStore` |
| Element specification | [OutboxPostgresStore](../Specification/OutboxPostgresStore.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-19 |

```plantuml
@startuml SD-PERS-Outbox
title SD-PERS-Outbox - OutboxStore PostgreSQL realization
hide footbox
autonumber
skinparam shadowing false
skinparam responseMessageBelowArrow true

participant "OutboxStore\n<<interface>>" as I
participant "OutboxPostgresStore" as O
participant "PostgresDB" as DB

I -> O : OutboxStore operation(ctx, params)
alt FindUnpublishedEvents
  O -> DB : SELECT oldest published_at IS NULL LIMIT
  DB --> O : outbox rows or SQL error
  alt SQL failure
    O --> I : ERR-SYS-003
  else success
    O -> O : map OutboxEvent values
    O --> I : []OutboxEvent
  end
else MarkEventPublished
  O -> DB : UPDATE WHERE id and published_at IS NULL
  DB --> O : affected row count
  alt zero affected
    O --> I : conflict/not-found
  else SQL failure
    O --> I : ERR-SYS-003
  else success
    O --> I : nil
  end
end
@enduml
```
