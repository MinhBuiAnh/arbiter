# Sequence Diagram - UC-AD-T-01 - Create Test Case - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-AD-T-01-X |
| Use Case | UC-AD-T-01 - Create Test Case |
| Use Case Specification | [UC-AD-T-01-CreateTestCase.md](../../../../RequirementAnalysis/UCSpec/Administrator/TestCaseManagement/UC-AD-T-01-CreateTestCase.md) |
| Primary Actor(s) | Administrator |
| Related Requirements | FR-ADMIN-01, FR-TC-01, FR-TC-02, FR-TC-09 |
| Scope | E7-E8; primary flow in [SD-UC-AD-T-01](SD-UC-AD-T-01-CreateTestCase.md) |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

Supplement for atomic persistence failure and unknown network outcome during Test Case creation.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Primary | - | [SD-UC-AD-T-01](SD-UC-AD-T-01-CreateTestCase.md) |
| E7 | E7 | `group E7` at create transaction |
| E8 | E8 | Client-only network outcome note at request/response |

## 3. Diagram

```plantuml
@startuml SD-UC-AD-T-01-X
title UC-AD-T-01 - Create Test Case - Exceptions\nRollback and uncertain create outcome
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

ref over Admin, DB : UC-AD-T-01 - Create Test Case
group E7 - ERR-SYS-001 - create or persistence failure (18-19)
  TC -> DB : persist Test Case metadata and unique order
  DB -x TC : persistence error
  TC --> API : ERR-SYS-001 with request_id
  API --> UI : general create failure
  UI --> Admin : notify no Test Case was created
  note right of DB : Transaction rolled back; no Test Case or order is persisted.
  note over Admin, UI : Use case ends; Administrator may retry later.
end
group E8 - ERR-NET-001 - request or response interrupted (13)
  UI -> API : send create request
  API --> UI : response not received
  UI -> UI : mark outcome unknown; do not claim success
  UI -> API : reload Test Case list before retry
  note over Admin, UI : Check for the new Test Case; end when outcome is confirmed.
end
@enduml
```

## 4. Notes

- A timeout is not treated as proof that creation failed. The Test Case list is reloaded before any retry.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial exception supplement. |
