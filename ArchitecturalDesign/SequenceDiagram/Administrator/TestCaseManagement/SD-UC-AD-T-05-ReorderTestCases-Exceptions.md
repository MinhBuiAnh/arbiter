# Sequence Diagram - UC-AD-T-05 - Reorder Test Cases - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-AD-T-05-X |
| Use Case | UC-AD-T-05 - Reorder Test Cases |
| Use Case Specification | [UC-AD-T-05-ReorderTestCases.md](../../../../RequirementAnalysis/UCSpec/Administrator/TestCaseManagement/UC-AD-T-05-ReorderTestCases.md) |
| Primary Actor(s) | Administrator |
| Related Requirements | FR-ADMIN-01, FR-TC-08, FR-TC-09, NFR-REL-08 |
| Scope | E7-E9; primary flow in [SD-UC-AD-T-05](SD-UC-AD-T-05-ReorderTestCases.md) |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

Supplement for concurrent Test Case set changes, atomic reorder failure, and unknown network outcome.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Primary | - | [SD-UC-AD-T-05](SD-UC-AD-T-05-ReorderTestCases.md) |
| E7 | E7 | `group E7` at current-set/version check |
| E8 | E8 | `group E8` at reorder transaction |
| E9 | E9 | Client-only network outcome note at request/response |

## 3. Diagram

```plantuml
@startuml SD-UC-AD-T-05-X
title UC-AD-T-05 - Reorder Test Cases - Exceptions\nConcurrent set change and atomic reorder
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

ref over Admin, DB : UC-AD-T-05 - Reorder Test Cases
group E7 - ERR-CONFLICT-002 - concurrent Test Case set/order change (10)
  TC -> DB : compare submitted set/version with current set
  DB --> TC : set or ordinal changed since load
  TC --> API : ERR-CONFLICT-002
  API --> UI : concurrent change
  UI --> Admin : reload latest order and repeat
  note right of DB : No ordinal is changed.
end
group E8 - ERR-SYS-001 - ordinal update failure (12)
  TC -> DB : update complete contiguous order
  DB -x TC : persistence error
  TC --> API : ERR-SYS-001 with request_id
  API --> UI : reorder failure
  UI --> Admin : notify order was not saved
  note right of DB : Transaction rolled back; no partial order persists.
  note over Admin, UI : Use case ends; Administrator may retry later.
end
group E9 - ERR-NET-001 - request or response interrupted (7)
  UI -> API : send complete ordered ID list
  API --> UI : response not received
  UI -> UI : mark outcome unknown; do not claim success
  UI -> API : reload Test Case list
  note over Admin, UI : Check stored order before retry; end when outcome is confirmed.
end
@enduml
```

## 4. Notes

- A stale set is not partially applied; the client reloads before retrying.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial exception supplement. |
