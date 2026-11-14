# Sequence Diagram - UC-COM-04 - View Leaderboard

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-COM-04 |
| Use Case | UC-COM-04 - View Leaderboard |
| Use Case Specification | [UC-COM-04-ViewLeaderboard.md](../../../RequirementAnalysis/UCSpec/GuestCommon/UC-COM-04-ViewLeaderboard.md) |
| Primary Actor(s) | Guest, User (through public behavior inheritance) |
| Related Requirements | FR-PROG-02, NFR-PERF-01, NFR-SEC-10 |
| Scope | Main flow, A1-A3, E1-E4 |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

This diagram covers the public leaderboard: pagination validation, the read-only aggregate query over active users and their submissions, deterministic ranking, and the empty-leaderboard outcome.

A2 (another page) and A3 (refresh) reuse the same request path and are dispositioned below. The use case is read-only. `STATS` performs a read-only reporting query across module tables, as allowed by the ruleset.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | S1-S10 | Entire diagram; S10 end state is stated in the final note |
| A1 | A1 | `alt A1` at S7 |
| A2 | - | Reuses S2-S9 with new pagination parameters; no new interaction |
| A3 | - | Reuses S2-S9 and recalculates from current data; no new interaction |
| E1 | E1 | `alt E1` at S3 |
| E2 | E2 | `break E2` at S4-S7 |
| E3 | - | Client-only note at UI during the request/response |
| E4 | E4 | `break E4` at S2 |

## 3. Diagram

```plantuml
@startuml SD-UC-COM-04
title UC-COM-04 - View Leaderboard\nPublic ranking of active users by solved problems
hide footbox
autonumber "<b>[00]"
skinparam shadowing false
skinparam responseMessageBelowArrow true
skinparam maxMessageSize 140
skinparam defaultFontName "Helvetica"
skinparam defaultFontSize 12
skinparam ParticipantPadding 12
skinparam BoxPadding 8
skinparam NoteBackgroundColor #FFF9C4
skinparam NoteBorderColor #D6B656
skinparam sequence {
  ArrowColor #333333
  ActorBorderColor #333333
  LifeLineBorderColor #999999
  LifeLineBackgroundColor #FFFFFF
}

actor "Guest" as Guest #F5F5F5
participant "React SPA" as UI #DAE8FC
participant "HTTP API" as API #D5E8D4
participant "Progress & Leaderboard" as STATS #D5E8D4
database "PostgreSQL" as DB #FFF2CC

Guest -> UI : S1 open leaderboard page
UI -> API : S2 GET /api/v1/leaderboard {page, page_size}
note right of UI
  E3 - ERR-NET-001 - network error:
  no response; UI cannot confirm whether the request
  reached the system. Guest may retry after reconnecting.
  Client-only; use case ends if continuing is impossible.
end note
API -> API : S2 check request rate limit
break E4 - ERR-LIMIT-001 - rate limit exceeded (S2)
  API --> UI : 429 {code: ERR-LIMIT-001, retry_after}
  UI --> Guest : E4 ask Guest to wait before retrying
  note right of API : Throttled before the STATS query; no ranking data is read.
  note over Guest, UI : Use case ends.
end
API -> API : S3 validate pagination parameters
alt E1 - ERR-VAL-005 - invalid pagination parameters (S3)
  API --> UI : 400 {code: ERR-VAL-005, details: invalid_fields}
  note right of API : No ranking data is read.
  UI -> UI : E1 reset to first page and default page size
  note over Guest, UI : Reissues the request; continues at S3.
else pagination valid
  break E2 - ERR-SYS-001 - internal system error (S4-S7)
    note right of STATS : Ranking computation failure; no partial ranking is returned.
    API --> UI : 500 {code: ERR-SYS-001, request_id}
    UI --> Guest : E2 notify leaderboard cannot be loaded
    note over Guest, UI : Guest may retry later. Use case ends.
  end
  API -> STATS : getLeaderboard(page, page_size)
  STATS -> DB : S4-S6 read-only reporting query: active users, solved and submission counts
  DB --> STATS : aggregate rows
  alt A1 - Leaderboard Is Empty (S7)
    STATS --> API : 200 {entries: [], pagination}
    API --> UI : 200 {entries: [], pagination}
    UI --> Guest : A1 display ranking data not available
    note over Guest, UI : Use case ends.
  else ranked entries
    STATS -> STATS : S7 rank by solved desc, submissions asc, username asc
    STATS --> API : page {entries, pagination}
    API --> UI : 200 {entries, pagination}
    UI --> Guest : S9 display leaderboard
    note over Guest, UI : S10 use case ends.
  end
end
@enduml
```

## 4. Notes

- The aggregate query is read-only and spans module tables; it does not load every user into application memory.
- Ranking is deterministic: solved count descending, total submissions ascending, then username ascending.
- The response exposes username, display name, solved count, submission count, and acceptance rate only; no email or private account data.
- A2 and A3 are page-navigation and refresh variants of the same request path.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
