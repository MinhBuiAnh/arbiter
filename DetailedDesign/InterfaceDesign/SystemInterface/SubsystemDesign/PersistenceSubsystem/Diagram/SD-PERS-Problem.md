# SD-PERS-Problem — Problem Persistence Operations

| Field | Value |
|---|---|
| Sequence Diagram ID | `SD-PERS-Problem` |
| Owning subsystem | Persistence Subsystem |
| Realized interface | `ProblemStore` |
| Element specification | [ProblemPostgresStore](../Specification/ProblemPostgresStore.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-19 |

```plantuml
@startuml SD-PERS-Problem
title SD-PERS-Problem - ProblemStore PostgreSQL realization
hide footbox
autonumber
skinparam shadowing false
skinparam responseMessageBelowArrow true

participant "ProblemStore\n<<interface>>" as I
participant "ProblemPostgresStore" as P
participant "PostgresDB" as DB

I -> P : ProblemStore operation(ctx, params)
alt read operation
  P -> DB : SELECT problem/projection and normalized collections
  DB --> P : committed rows, no row, or SQL error
  alt no row
    P --> I : not-found result
  else SQL failure
    P --> I : ERR-SYS-003
  else rows
    P -> P : map Problem or projection
    P --> I : domain result or page
  end
else SaveProblem
  P -> DB : transaction: problem, test_case_sets, tags, languages
  alt constraint failure
    P -> DB : rollback
    P --> I : validation/conflict
  else SQL failure
    P -> DB : rollback
    P --> I : ERR-SYS-003
  else committed
    P -> DB : commit
    P --> I : nil
  end
else UpdateProblem
  P -> DB : transaction; UPDATE WHERE version; replace tags/languages
  DB --> P : affected rows or SQL error
  alt stale or missing
    P -> DB : rollback
    P --> I : optimistic conflict
  else SQL failure
    P -> DB : rollback
    P --> I : ERR-SYS-003
  else committed
    P -> DB : commit
    P --> I : nil
  end
else SaveProblemState or SavePublicationState
  P -> DB : UPDATE WHERE id/version; increment version
  DB --> P : affected row count
  alt zero affected
    P --> I : optimistic conflict
  else SQL failure
    P --> I : ERR-SYS-003
  else success
    P -> DB : commit
    P --> I : nil
  end
end
@enduml
```
