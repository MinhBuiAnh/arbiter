# Sequence Diagram - UC-COM-01 - Browse Problems

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-COM-01 |
| Use Case | UC-COM-01 - Browse Problems |
| Use Case Specification | [UC-COM-01-BrowseProblems.md](../../../RequirementAnalysis/UCSpec/GuestCommon/UC-COM-01-BrowseProblems.md) |
| Primary Actor(s) | Guest, User (through public behavior inheritance) |
| Related Requirements | FR-PROB-01, NFR-PERF-01, NFR-SEC-10 |
| Scope | Main flow, A1-A4, E1-E5 |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

This diagram covers the public problem list: pagination and sorting parameters, the published-problem query, preview projection, and the empty-result outcome.

A2 and A3 reissue the same request with new pagination or sorting parameters and are dispositioned below. A4 is the same UI handoff as S8. The use case is read-only, so no write transaction, outbox event, or queue message appears.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | S1-S9 | Entire diagram; S9 end state is stated in the final note |
| A1 | A1 | `alt A1` at S4 |
| A2 | - | Reuses S2-S7 with new pagination parameters; no new interaction |
| A3 | - | Reuses S2-S7 with new sorting parameters; no new interaction |
| A4 | - | Represented by S8; UI-only navigation to UC-COM-03 |
| E1 | E1 | `alt E1` branch at S3 |
| E2 | E2 | `alt E2` branch at S3 |
| E3 | E3 | `break E3` at S3-S6 |
| E4 | - | Client-only note at UI during the request/response |
| E5 | E5 | `break E5` at S2 |

## 3. Diagram

```plantuml
@startuml SD-UC-COM-01
title UC-COM-01 - Browse Problems\nPublic problem list with pagination and sorting
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
participant "Problem Catalog" as PROB #D5E8D4
database "PostgreSQL" as DB #FFF2CC

Guest -> UI : S1 open problem list page
UI -> API : S2 GET /api/v1/problems {page, page_size, sort}
note right of UI
  E4 - ERR-NET-001 - network error:
  no response; UI cannot confirm whether the request
  reached the system. Guest may retry after reconnecting.
  Client-only; use case ends if continuing is impossible.
end note
API -> API : S2 check request rate limit
break E5 - ERR-LIMIT-001 - rate limit exceeded (S2)
  API --> UI : 429 {code: ERR-LIMIT-001, retry_after}
  UI --> Guest : E5 ask Guest to wait before retrying
  note right of API : Throttled before the PROB query; no problem data is read.
  note over Guest, UI : Use case ends.
end
API -> API : S3 validate pagination and sorting parameters
alt E1 - ERR-VAL-005 - invalid pagination parameters (S3)
  API --> UI : 400 {code: ERR-VAL-005, details: invalid_fields}
  note right of API : No problem data is read.
  UI -> UI : E1 reset to first page and default page size
  note over Guest, UI : Reissues the request; continues at S3.
else E2 - ERR-VAL-006 - invalid sorting parameter (S3)
  API --> UI : 400 {code: ERR-VAL-006, details: invalid_field}
  note right of API : No problem data is read.
  UI -> UI : E2 fall back to default sorting
  note over Guest, UI : Reissues the request; continues at S3.
else parameters valid
  break E3 - ERR-SYS-001 - internal system error (S3-S6)
    note right of API : Validation or query failure; no partial list is returned.
    API --> UI : 500 {code: ERR-SYS-001, request_id}
    UI --> Guest : E3 notify problem list cannot be loaded
    note over Guest, UI : Guest may retry later. Use case ends.
  end
  API -> PROB : listPublishedProblems(page, page_size, sort)
  PROB -> DB : S4 SELECT problems WHERE ACTIVE AND PUBLISHED (page, sort)
  DB --> PROB : problem rows
  alt A1 - No Problems Available (S4)
    PROB --> API : 200 {items: [], pagination}
    API --> UI : 200 {items: [], pagination}
    UI --> Guest : A1 display empty state
    note over Guest, UI : Use case ends.
  else problems found
    PROB -> PROB : S5 build previews {title, difficulty, tags}
    PROB --> API : page {items, pagination}
    API --> UI : 200 {items, pagination}
    UI --> Guest : S7 display problem list
    Guest -> UI : S8 select problem
    UI -> UI : S8 navigate to UC-COM-03 with problem_id
    note over Guest, UI : S9 use case ends.
  end
end
@enduml
```

## 4. Notes

- The query returns only `ACTIVE` and `PUBLISHED` problems and only public preview fields.
- Ordering is deterministic so pagination does not duplicate or skip rows.
- The diagram is read-only; no outbox event or queue message is created.
- Rate limiting is enforced at `API`; no separate limiter lifeline exists in v1.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
