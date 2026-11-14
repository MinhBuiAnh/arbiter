# Sequence Diagram - UC-AD-T-02 - Update Test Case - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-AD-T-02-X |
| Use Case | UC-AD-T-02 - Update Test Case |
| Use Case Specification | [UC-AD-T-02-UpdateTestCase.md](../../../../RequirementAnalysis/UCSpec/Administrator/TestCaseManagement/UC-AD-T-02-UpdateTestCase.md) |
| Primary Actor(s) | Administrator |
| Related Requirements | FR-ADMIN-01, FR-TC-04, NFR-REL-08 |
| Scope | E7-E10; primary flow in [SD-UC-AD-T-02](SD-UC-AD-T-02-UpdateTestCase.md) |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

Supplement for duplicate order, stale-version conflict, persistence failure, and unknown network outcome.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Primary | - | [SD-UC-AD-T-02](SD-UC-AD-T-02-UpdateTestCase.md) |
| E7 | E7 | `group E7` at order uniqueness check |
| E8 | E8 | `group E8` at optimistic concurrency check |
| E9 | E9 | `group E9` at update transaction |
| E10 | E10 | Client-only network outcome note at request/response |

## 3. Diagram

```plantuml
@startuml SD-UC-AD-T-02-X
title UC-AD-T-02 - Update Test Case - Exceptions\nOrder conflict, stale version, and uncertain outcome
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

actor "Administrator" as Admin #F5F5F5
participant "React SPA" as UI #DAE8FC
participant "HTTP API" as API #D5E8D4
participant "Test Cases" as TC #D5E8D4
database "PostgreSQL" as DB #FFF2CC

ref over Admin, DB : UC-AD-T-02 - Update Test Case
group E7 - ERR-VAL-009 - duplicate Test Case order (20)
  TC -> DB : check requested order in Problem
  DB --> TC : order is already used
  TC --> API : ERR-VAL-009
  API --> UI : duplicate order
  UI --> Admin : choose another order; continue at 14
  note right of TC : No Test Case field is changed.
end
group E8 - ERR-CONFLICT-007 - concurrent Test Case update (21)
  TC -> DB : compare submitted and stored version identifiers
  DB --> TC : versions differ
  TC --> API : ERR-CONFLICT-007
  API --> UI : stale Test Case version
  UI --> Admin : offer reload of latest data
  note right of DB : No field is changed. Reload continues at 12 or the use case ends.
end
group E9 - ERR-SYS-001 - update persistence failure (22-23)
  TC -> DB : update fields and advance version
  DB -x TC : persistence error
  TC --> API : ERR-SYS-001 with request_id
  API --> UI : general update failure
  UI --> Admin : notify update failed
  note right of DB : Transaction rolled back; all fields and version remain unchanged.
  note over Admin, UI : Use case ends; Administrator may retry later.
end
group E10 - ERR-NET-001 - request or response interrupted (16)
  UI -> API : send update with loaded version
  API --> UI : response not received
  UI -> UI : mark outcome unknown; do not claim success
  UI -> API : reload Test Case details
  note over Admin, UI : Compare against intended changes before retry; end when confirmed.
end
@enduml
```

## 4. Notes

- Error responses and logs identify invalid fields only; they never contain Test Case contents.
- Every error branch leaves historical results unchanged.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial exception supplement. |
