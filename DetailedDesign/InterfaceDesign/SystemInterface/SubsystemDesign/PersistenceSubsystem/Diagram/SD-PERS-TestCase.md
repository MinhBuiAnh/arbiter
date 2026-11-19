# SD-PERS-TestCase — Test-Case Persistence Operations

| Field | Value |
|---|---|
| Sequence Diagram ID | `SD-PERS-TestCase` |
| Owning subsystem | Persistence Subsystem |
| Realized interface | `TestCaseRepository` |
| Element specification | [TestCasePostgresRepository](../Specification/TestCasePostgresRepository.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-19 |

```plantuml
@startuml SD-PERS-TestCase
title SD-PERS-TestCase - TestCaseRepository PostgreSQL realization
hide footbox
autonumber
skinparam shadowing false
skinparam responseMessageBelowArrow true

participant "TestCaseRepository\n<<interface>>" as I
participant "TestCasePostgresRepository" as T
participant "PostgresDB" as DB

I -> T : TestCaseRepository operation(ctx, params)
alt read operation
  T -> DB : SELECT test_cases/set/version metadata
  DB --> T : rows, no row, or SQL error
  alt no row
    T --> I : not-found result
  else SQL failure
    T --> I : ERR-SYS-003
  else rows
    T -> T : map metadata/set/references
    T --> I : domain result
  end
else SaveTestCase or UpdateTestCase
  T -> DB : transaction; lock set; check ordinal/version
  T -> DB : insert/update test_cases metadata
  alt constraint or stale-set failure
    T -> DB : rollback
    T --> I : conflict or validation
  else SQL failure
    T -> DB : rollback
    T --> I : ERR-SYS-003
  else committed
    T -> DB : increment set version and commit
    T --> I : nil
  end
else DeleteAndCompactTestCases
  T -> DB : transaction; delete case; shift later ordinals
  alt stale/missing case
    T -> DB : rollback
    T --> I : conflict/not-found
  else SQL failure
    T -> DB : rollback
    T --> I : ERR-SYS-003
  else committed
    T -> DB : increment set version and commit
    T --> I : nil
  end
else SaveTestCaseOrder
  T -> DB : transaction; verify set version and membership
  T -> DB : update ordinals atomically
  alt duplicate, stale, or membership failure
    T -> DB : rollback
    T --> I : conflict or validation
  else SQL failure
    T -> DB : rollback
    T --> I : ERR-SYS-003
  else committed
    T -> DB : increment set version and commit
    T --> I : nil
  end
else SaveTestCaseType or ReadTestCaseType or ReadTestCaseSetVersion
  T -> DB : bounded metadata SELECT or version-checked UPDATE
  DB --> T : metadata/version or SQL error
  alt SQL failure
    T --> I : ERR-SYS-003
  else stale update
    T --> I : conflict
  else success
    T --> I : type/version/nil
  end
end
@enduml
```
