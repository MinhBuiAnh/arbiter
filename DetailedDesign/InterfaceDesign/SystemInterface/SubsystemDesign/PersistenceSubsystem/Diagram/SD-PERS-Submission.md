# SD-PERS-Submission — Submission Persistence Operations

| Field | Value |
|---|---|
| Sequence Diagram ID | `SD-PERS-Submission` |
| Owning subsystem | Persistence Subsystem |
| Realized interface | `SubmissionStore` |
| Element specification | [SubmissionPostgresStore](../Specification/SubmissionPostgresStore.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-19 |

```plantuml
@startuml SD-PERS-Submission
title SD-PERS-Submission - SubmissionStore PostgreSQL realization
hide footbox
autonumber
skinparam shadowing false
skinparam responseMessageBelowArrow true

participant "SubmissionStore\n<<interface>>" as I
participant "SubmissionPostgresStore" as S
participant "PostgresDB" as DB

I -> S : SubmissionStore operation(ctx, params)
alt read operation
  S -> DB : bounded SELECT/context/query
  DB --> S : row/page, no row, or SQL error
  alt no row
    S --> I : not-found result
  else SQL failure
    S --> I : ERR-SYS-003
  else row/page
    S -> S : map public or judge context
    S --> I : domain result
  end
else StoreSubmissionAndEvent
  S -> DB : transaction
  S -> DB : INSERT submission
  S -> DB : INSERT matching outbox event
  alt constraint or SQL failure
    S -> DB : rollback
    S --> I : validation or ERR-SYS-003
  else committed
    S -> DB : commit
    S --> I : nil
  end
else IncrementAttemptAndSetCompiling or SetRunning or UpdateStatus or ResetToQueued
  S -> DB : conditional UPDATE with status/attempt constraints
  DB --> S : affected row count
  alt zero affected
    S --> I : stale/terminal conflict
  else SQL failure
    S --> I : ERR-SYS-003
  else committed
    S -> DB : commit
    S --> I : nil
  end
else PersistTerminalResult
  S -> DB : transaction
  S -> DB : UPDATE submission verdict/status/metrics/output
  S -> DB : upsert executed submission_test_case_results
  alt constraint or stale terminal update
    S -> DB : rollback
    S --> I : conflict or ERR-SYS-003
  else SQL failure
    S -> DB : rollback
    S --> I : ERR-SYS-003
  else committed
    S -> DB : commit
    S --> I : nil
  end
else PersistInternalError or MarkInternalError
  S -> DB : transaction
  S -> DB : UPDATE status INTERNAL_ERROR and reason
  alt stale terminal update
    S -> DB : rollback
    S --> I : conflict
  else SQL failure
    S -> DB : rollback
    S --> I : ERR-SYS-003
  else committed
    S -> DB : commit
    S --> I : nil
  end
else RollBackUncommittedChanges
  S -> DB : rollback current transaction
  DB --> S : rollback result
  S --> I : nil or ERR-SYS-003
end
note over S, DB
  Terminal writes and Submit+Event writes are atomic.
  Hidden test-case input/output is never read or stored here.
end note
@enduml
```
