# Sequence Diagram - UC-AD-P-04 - Manage Problem Publication - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-AD-P-04-X |
| Use Case | UC-AD-P-04 - Manage Problem Publication |
| Use Case Specification | [UC-AD-P-04-ManageProblemPublication.md](../../../../RequirementAnalysis/UCSpec/Administrator/ProblemManagement/UC-AD-P-04-ManageProblemPublication.md) |
| Primary Actor(s) | Administrator |
| Related Requirements | FR-ADMIN-01, FR-PROB-08, NFR-REL-08 |
| Scope | E7-E8; primary flow in [SD-UC-AD-P-04](SD-UC-AD-P-04-ManageProblemPublication.md) |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

Supplement for publication persistence failure and unknown network outcome.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Primary | - | [SD-UC-AD-P-04](SD-UC-AD-P-04-ManageProblemPublication.md) |
| E7 | E7 | `group E7` at publication transaction |
| E8 | E8 | Client-only network outcome note at request/response |

## 3. Diagram

```plantuml
@startuml SD-UC-AD-P-04-X
title UC-AD-P-04 - Manage Problem Publication - Exceptions\nRollback and unknown publication outcome
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
participant "Problem Catalog" as PROB #D5E8D4
database "PostgreSQL" as DB #FFF2CC

ref over Admin, DB : UC-AD-P-04 - Manage Problem Publication
group E7 - ERR-SYS-001 - publication persistence failure (17 or 18)
  PROB -> DB : update publication state and timestamp
  DB -x PROB : persistence error
  PROB --> API : ERR-SYS-001 with request_id
  API --> UI : general failure
  UI --> Admin : notify state was not changed
  note right of DB : Transaction rolled back; state and timestamp remain unchanged.
  note over Admin, UI : Use case ends; Administrator may retry later.
end
group E8 - ERR-NET-001 - request or response interrupted (12)
  UI -> API : send publication change with version
  API --> UI : response not received
  UI -> UI : mark outcome unknown; do not claim success
  UI -> API : reload Problem publication state
  note over Admin, UI : Verify stored state before retrying; end when outcome is confirmed.
end
@enduml
```

## 4. Notes

- Failed publication changes do not alter the Problem or its Test Cases.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial exception supplement. |
