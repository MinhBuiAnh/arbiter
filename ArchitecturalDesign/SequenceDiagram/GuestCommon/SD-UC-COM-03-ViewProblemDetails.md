# Sequence Diagram - UC-COM-03 - View Problem Details

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-COM-03 |
| Use Case | UC-COM-03 - View Problem Details |
| Use Case Specification | [UC-COM-03-ViewProblemDetails.md](../../../RequirementAnalysis/UCSpec/GuestCommon/UC-COM-03-ViewProblemDetails.md) |
| Primary Actor(s) | Guest, User (through public behavior inheritance) |
| Related Requirements | FR-PROB-03, FR-PROB-04, FR-PROB-10, NFR-PERF-01, NFR-SEC-05, NFR-SEC-10 |
| Scope | Main flow, A1-A2, E1-E6 |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

This diagram covers retrieval of a published problem's statement, formats, constraints, limits, sample test cases, classification, supported languages, and public statistics.

The visibility check is a domain check in `PROB`. The read never returns hidden test data. A1 (back to the list) and A2 (another problem) are UI navigation and are dispositioned below. The use case is read-only.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | S1-S10 | Entire diagram; S10 end state is stated in the final note |
| A1 | - | UI-only navigation after S9; no server interaction |
| A2 | - | UI-only; re-enters at S3 with a new `problem_id` |
| E1 | E1 | `break E1` at S4 |
| E2 | E2 | `break E2` at S5 |
| E3 | E3 | `break E3` at S6 |
| E4 | E4 | `alt E4` at S4-S8 |
| E5 | - | Client-only note at UI during the request/response |
| E6 | E6 | `break E6` at S3 |

## 3. Diagram

```plantuml
@startuml SD-UC-COM-03
title UC-COM-03 - View Problem Details\nPublished problem details, sample cases, and public statistics
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

Guest -> UI : S1 access problem list or search result
Guest -> UI : S2 select problem
UI -> API : S3 GET /api/v1/problems/{problem_id}
note right of UI
  E5 - ERR-NET-001 - network error:
  no response; UI cannot confirm whether the request
  reached the system. Guest may retry after reconnecting.
  Client-only; use case ends if continuing is impossible.
end note
API -> API : S3 check request rate limit
break E6 - ERR-LIMIT-001 - rate limit exceeded (S3)
  API --> UI : 429 {code: ERR-LIMIT-001, retry_after}
  UI --> Guest : E6 ask Guest to wait before retrying
  note right of API : Throttled before the PROB query; no problem data is read.
  note over Guest, UI : Use case ends.
end
API -> API : S4 validate problem_id format
break E1 - ERR-VAL-007 - invalid problem ID (S4)
  API --> UI : 400 {code: ERR-VAL-007, details: invalid_field}
  note right of API : No problem data is read.
  UI --> Guest : E1 notify problem identifier is invalid
  note over Guest, UI : Guest may return to the problem list. Use case ends.
end
alt E4 - ERR-SYS-001 - internal system error (S4-S8)
  note right of API : Validation or retrieval failure; no partial details are returned.
  API --> UI : 500 {code: ERR-SYS-001, request_id}
  UI --> Guest : E4 notify problem cannot be loaded
  note over Guest, UI : Guest may retry later. Use case ends.
else retrieval succeeds
  API -> PROB : getPublicProblem(problem_id)
  PROB -> DB : S5 SELECT problem WHERE id
  DB --> PROB : problem row or none
  break E2 - ERR-RES-001 - problem not found (S5)
    PROB --> API : ERR-RES-001
    API --> UI : 404 {code: ERR-RES-001}
    UI --> Guest : E2 notify problem does not exist
    note over Guest, UI : Guest may return to the problem list. Use case ends.
  end
  PROB -> PROB : S6 check ACTIVE and PUBLISHED
  break E3 - ERR-PERM-001 - problem not publicly accessible (S6)
    PROB --> API : ERR-PERM-001
    API --> UI : 403 {code: ERR-PERM-001}
    UI --> Guest : E3 notify problem is not available
    note over Guest, UI : Guest may return to the problem list. Use case ends.
  end
  PROB -> DB : S7 SELECT details, sample test cases, public statistics
  DB --> PROB : details (no hidden test data)
  PROB --> API : problem details
  API --> UI : 200 {problem details}
  UI --> Guest : S9 display problem details
  note over Guest, UI : S10 use case ends.
end
@enduml
```

## 4. Notes

- Only sample test cases are read and returned; hidden inputs and expected outputs never leave the protected store.
- Public statistics are read as part of the problem detail response.
- The specification assigns `ERR-PERM-001` to a problem that is not publicly accessible; this is treated as a visibility boundary, not an authentication failure.
- A1 and A2 are navigation only; A2 re-enters the request path at S3.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
