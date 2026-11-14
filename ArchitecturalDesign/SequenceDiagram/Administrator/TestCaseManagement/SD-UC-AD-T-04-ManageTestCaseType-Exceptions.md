# Sequence Diagram - UC-AD-T-04 - Manage Test Case Type - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-AD-T-04-X |
| Use Case | UC-AD-T-04 - Manage Test Case Type |
| Use Case Specification | [UC-AD-T-04-ManageTestCaseType.md](../../../../RequirementAnalysis/UCSpec/Administrator/TestCaseManagement/UC-AD-T-04-ManageTestCaseType.md) |
| Primary Actor(s) | Administrator |
| Related Requirements | FR-ADMIN-01, FR-TC-03, FR-TC-09, NFR-REL-08 |
| Scope | E7-E9; primary flow in [SD-UC-AD-T-04](SD-UC-AD-T-04-ManageTestCaseType.md) |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

Supplement for concurrent type update, persistence failure, and unknown network outcome.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Primary | - | [SD-UC-AD-T-04](SD-UC-AD-T-04-ManageTestCaseType.md) |
| E7 | E7 | `group E7` at optimistic concurrency check |
| E8 | E8 | `group E8` at type update transaction |
| E9 | E9 | Client-only network outcome note at request/response |

## 3. Diagram

```plantuml
@startuml SD-UC-AD-T-04-X
title UC-AD-T-04 - Manage Test Case Type - Exceptions\nStale version and uncertain type change
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

ref over Admin, DB : UC-AD-T-04 - Manage Test Case Type
group E7 - ERR-CONFLICT-007 - concurrent Test Case update (20)
  TC -> DB : compare loaded and stored versions
  DB --> TC : version differs
  TC --> API : ERR-CONFLICT-007
  API --> UI : stale Test Case data
  UI --> Admin : reload latest data before retrying
  note right of DB : Type and all other fields remain unchanged.
end
group E8 - ERR-SYS-001 - type update persistence failure (21-22)
  TC -> DB : update type, version, timestamp
  DB -x TC : persistence error
  TC --> API : ERR-SYS-001 with request_id
  API --> UI : general failure
  UI --> Admin : notify type was not changed
  note right of DB : Transaction rolled back; type and version remain unchanged.
  note over Admin, UI : Use case ends; Administrator may retry later.
end
group E9 - ERR-NET-001 - request or response interrupted (16)
  UI -> API : send type change with loaded version
  API --> UI : response not received
  UI -> UI : mark outcome unknown; do not claim success
  UI -> API : reload Test Case details
  note over Admin, UI : Check current type before retry; end when outcome is confirmed.
end
@enduml
```

## 4. Notes

- No exception branch modifies input data, expected output, order, or historical results.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial exception supplement. |
