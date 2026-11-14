# Sequence Diagram - UC-AD-T-03 - Delete Test Case - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-AD-T-03-X |
| Use Case | UC-AD-T-03 - Delete Test Case |
| Use Case Specification | [UC-AD-T-03-DeleteTestCase.md](../../../../RequirementAnalysis/UCSpec/Administrator/TestCaseManagement/UC-AD-T-03-DeleteTestCase.md) |
| Primary Actor(s) | Administrator |
| Related Requirements | FR-ADMIN-01, FR-TC-05, NFR-REL-08 |
| Scope | E7-E8; primary flow in [SD-UC-AD-T-03](SD-UC-AD-T-03-DeleteTestCase.md) |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

Supplement for deletion/renumbering transaction failure and unknown network outcome.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Primary | - | [SD-UC-AD-T-03](SD-UC-AD-T-03-DeleteTestCase.md) |
| E7 | E7 | `group E7` at delete transaction |
| E8 | E8 | Client-only network outcome note at request/response |

## 3. Diagram

```plantuml
@startuml SD-UC-AD-T-03-X
title UC-AD-T-03 - Delete Test Case - Exceptions\nRollback and unknown delete outcome
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

ref over Admin, DB : UC-AD-T-03 - Delete Test Case
group E7 - ERR-SYS-001 - delete or renumber failure (20-21)
  TC -> DB : delete Test Case and compact remaining order
  DB -x TC : persistence error
  TC --> API : ERR-SYS-001 with request_id
  API --> UI : general delete failure
  UI --> Admin : notify deletion failed
  note right of DB : Transaction rolled back; Test Case and prior ordinals remain intact.
  note over Admin, UI : Use case ends; Administrator may retry later.
end
group E8 - ERR-NET-001 - request or response interrupted (16)
  UI -> API : send delete with loaded version
  API --> UI : response not received
  UI -> UI : mark outcome unknown; do not claim success
  UI -> API : reload Test Case list before retry
  note over Admin, UI : Check whether the Test Case remains; end when outcome is confirmed.
end
@enduml
```

## 4. Notes

- A failed transaction changes neither the Test Case set nor the order values.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial exception supplement. |
