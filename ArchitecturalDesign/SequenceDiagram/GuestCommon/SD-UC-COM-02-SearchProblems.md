# Sequence Diagram - UC-COM-02 - Search Problems

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-COM-02 |
| Use Case | UC-COM-02 - Search Problems |
| Use Case Specification | [UC-COM-02-SearchProblems.md](../../../RequirementAnalysis/UCSpec/GuestCommon/UC-COM-02-SearchProblems.md) |
| Primary Actor(s) | Guest, User (through public behavior inheritance) |
| Related Requirements | FR-PROB-02, NFR-PERF-01, NFR-SEC-10 |
| Scope | Main flow, A1-A4, E1-E6 |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

This diagram covers keyword and filter search over published problems, validation of search parameters, the paginated result, and the empty-result outcome.

A2 (no filters) and A3 (filters only) change only the UI input before the same request path and are dispositioned below. A4 is the same UI handoff as S9. The use case is read-only.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | S1-S10 | Entire diagram; S10 end state is stated in the final note |
| A1 | A1 | `alt A1` at S6 |
| A2 | - | No filters selected; S3 is omitted; same request path |
| A3 | - | Keywords omitted; filter-only search; same request path |
| A4 | - | Represented by S9; UI-only navigation to UC-COM-03 |
| E1 | E1 | `alt E1` branch at S5 |
| E2 | E2 | `alt E2` branch at S5 |
| E3 | E3 | `alt E3` branch at S5 |
| E4 | E4 | `break E4` at S5-S7 |
| E5 | - | Client-only note at UI during the request/response |
| E6 | E6 | `break E6` at S4 |

## 3. Diagram

```plantuml
@startuml SD-UC-COM-02
title UC-COM-02 - Search Problems\nKeyword and filter search over published problems
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

Guest -> UI : S1 open problem search
Guest -> UI : S2 enter search keywords
Guest -> UI : S3 select optional difficulty, category, or tag filters
Guest -> UI : S4 submit search request
UI -> API : S4 GET /api/v1/problems/search {keywords, filters, page, page_size, sort}
note right of UI
  E5 - ERR-NET-001 - network error:
  no response; UI cannot confirm whether the request
  reached the system. Guest may retry after reconnecting.
  Client-only; use case ends if continuing is impossible.
end note
API -> API : S4 check request rate limit
break E6 - ERR-LIMIT-001 - rate limit exceeded (S4)
  API --> UI : 429 {code: ERR-LIMIT-001, retry_after}
  UI --> Guest : E6 ask Guest to wait before retrying
  note right of API : Throttled before the PROB query; no problem data is read.
  note over Guest, UI : Use case ends.
end
API -> API : S5 validate keywords, filters, pagination, and sorting
alt E1 - ERR-VAL-004 - invalid search parameters (S5)
  API --> UI : 400 {code: ERR-VAL-004, details: invalid_fields}
  note right of API : No problem data is read.
  UI --> Guest : E1 show invalid fields
  Guest -> UI : E1 edit search parameters and resubmit
  note over Guest, UI : Continues at S5.
else E2 - ERR-VAL-006 - invalid sorting parameter (S5)
  API --> UI : 400 {code: ERR-VAL-006, details: invalid_field}
  note right of API : No problem data is read.
  UI -> UI : E2 fall back to default sorting
  note over Guest, UI : Reissues the search; continues at S5.
else E3 - ERR-VAL-005 - invalid pagination parameters (S5)
  API --> UI : 400 {code: ERR-VAL-005, details: invalid_fields}
  note right of API : No problem data is read.
  UI -> UI : E3 reset to first page and default page size
  note over Guest, UI : Reissues the search; continues at S5.
else parameters valid
  break E4 - ERR-SYS-001 - internal system error (S5-S7)
    note right of API : Validation or search failure; no partial result is returned.
    API --> UI : 500 {code: ERR-SYS-001, request_id}
    UI --> Guest : E4 notify search cannot be performed
    note over Guest, UI : Guest may retry later. Use case ends.
  end
  API -> PROB : searchPublishedProblems(keywords, filters, page, page_size, sort)
  PROB -> DB : S6 SELECT problems WHERE ACTIVE AND PUBLISHED AND matches
  DB --> PROB : problem rows
  alt A1 - No Search Results (S6)
    PROB --> API : 200 {items: [], pagination}
    API --> UI : 200 {items: [], pagination}
    UI --> Guest : A1 display empty state
    note over Guest, UI : Guest may change keywords or filters; continues at S2.
  else results found
    PROB -> PROB : S7 build result page with pagination
    PROB --> API : page {items, pagination}
    API --> UI : 200 {items, pagination}
    UI --> Guest : S8 display search results
    Guest -> UI : S9 select problem
    UI -> UI : S9 navigate to UC-COM-03 with problem_id
    note over Guest, UI : S10 use case ends.
  end
end
@enduml
```

## 4. Notes

- Search input is treated as data, never as executable query syntax.
- The query returns only `ACTIVE` and `PUBLISHED` problems and only public fields.
- A2 and A3 are input variations, not additional server interactions.
- Rate limiting is enforced at `API`; no separate limiter lifeline exists in v1.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
