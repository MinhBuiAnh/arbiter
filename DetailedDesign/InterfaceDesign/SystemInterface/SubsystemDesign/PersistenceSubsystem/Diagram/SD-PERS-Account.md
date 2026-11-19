# SD-PERS-Account — Account Persistence Operations

| Field | Value |
|---|---|
| Sequence Diagram ID | `SD-PERS-Account` |
| Owning subsystem | Persistence Subsystem |
| Realized interface | `AccountStore` |
| Element specification | [AccountPostgresStore](../Specification/AccountPostgresStore.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-19 |

```plantuml
@startuml SD-PERS-Account
title SD-PERS-Account - AccountStore PostgreSQL realization
hide footbox
autonumber
skinparam shadowing false
skinparam responseMessageBelowArrow true

participant "AccountStore\n<<interface>>" as I
participant "AccountPostgresStore" as A
participant "PostgresDB" as DB

I -> A : AccountStore operation(ctx, params)
alt lookup or projection operation
  A -> DB : bounded SELECT with context
  DB --> A : row, no row, or SQL error
  alt no row
    A --> I : not-found result
  else SQL failure
    A --> I : ERR-SYS-003
  else row
    A -> A : map allowed account fields
    A --> I : domain result
  end
else AccountExists
  A -> DB : query username/email uniqueness
  DB --> A : boolean row or SQL error
  A --> I : bool or ERR-SYS-003
else SaveAccount
  A -> DB : transaction; insert/update account
  alt constraint failure
    A -> DB : rollback
    A --> I : validation/conflict result
  else SQL failure
    A -> DB : rollback
    A --> I : ERR-SYS-003
  else committed
    A -> DB : commit
    DB --> A : committed
    A --> I : nil
  end
else UpdateAccountStatus
  A -> DB : UPDATE WHERE id/version; increment version and actor metadata
  DB --> A : affected row count
  alt zero affected
    A -> DB : rollback
    A --> I : optimistic conflict
  else SQL failure
    A -> DB : rollback
    A --> I : ERR-SYS-003
  else committed
    A -> DB : commit
    A --> I : nil
  end
else QueryAccounts
  A -> DB : filtered paged SELECT
  DB --> A : summaries or SQL error
  alt SQL failure
    A --> I : ERR-SYS-003
  else success
    A --> I : PageResult[AccountSummary]
  end
end
note over A, DB
  Public projections omit credential_hash and plaintext credentials.
end note
@enduml
```
