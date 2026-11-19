# SD-PERS-Progress — Progress Persistence Operations

| Field | Value |
|---|---|
| Sequence Diagram ID | `SD-PERS-Progress` |
| Owning subsystem | Persistence Subsystem |
| Realized interface | `ProgressStore` |
| Element specification | [ProgressPostgresStore](../Specification/ProgressPostgresStore.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-19 |

```plantuml
@startuml SD-PERS-Progress
title SD-PERS-Progress - ProgressStore PostgreSQL realization
hide footbox
autonumber
skinparam shadowing false
skinparam responseMessageBelowArrow true

participant "ProgressStore\n<<interface>>" as I
participant "ProgressPostgresStore" as P
participant "PostgresDB" as DB

I -> P : ProgressStore operation(ctx, params)
alt ReadUserActivitySummary
  P -> DB : aggregate submissions/results and recent submissions
  DB --> P : aggregate rows or SQL error
else ReadLeaderboard
  P -> DB : bounded leaderboard aggregate and rank query
  DB --> P : leaderboard rows or SQL error
else ReadSubmissionAndProblemAggregates
  P -> DB : submission/problem counts and solved counts
  DB --> P : aggregate rows or SQL error
end
alt SQL/query failure
  P --> I : ERR-SYS-003
else invalid pagination
  P --> I : validation error
else success
  P -> P : map aggregate projections
  P --> I : UserStatistics or PageResult
end
@enduml
```
