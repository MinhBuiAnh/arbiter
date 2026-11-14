# Sequence Diagram - UC-AD-P-02 - Update Problem - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-AD-P-02-X |
| Use Case | UC-AD-P-02 - Update Problem |
| Use Case Specification | [UC-AD-P-02-UpdateProblem.md](../../../../RequirementAnalysis/UCSpec/Administrator/ProblemManagement/UC-AD-P-02-UpdateProblem.md) |
| Primary Actor(s) | Administrator |
| Related Requirements | FR-ADMIN-01, FR-PROB-06, NFR-REL-08 |
| Scope | E7-E8; primary flow in [SD-UC-AD-P-02](SD-UC-AD-P-02-UpdateProblem.md) |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

Supplement for persistence failure and unknown network outcome during a Problem metadata update.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Primary | - | [SD-UC-AD-P-02](SD-UC-AD-P-02-UpdateProblem.md) |
| E7 | E7 | `group E7` at update transaction |
| E8 | E8 | Client-only network outcome note at request/response |

## 3. Diagram

```plantuml
@startuml SD-UC-AD-P-02-X
title UC-AD-P-02 - Update Problem - Exceptions\nRollback and unknown update outcome
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

ref over Admin, DB : UC-AD-P-02 - Update Problem
group E7 - ERR-SYS-001 - update persistence failure (17 or 18)
  PROB -> DB : update Problem fields, version, timestamp
  DB -x PROB : persistence error
  PROB --> API : ERR-SYS-001 with request_id
  API --> UI : general update failure
  UI --> Admin : notify update failed; no success claim
  note right of DB : Transaction rolled back; no field or version is changed.
  note over Admin, UI : Use case ends; Administrator may retry later.
end
group E8 - ERR-NET-001 - request or response interrupted (12)
  UI -> API : send update with loaded version
  API --> UI : response not received
  UI -> UI : mark outcome unknown; do not claim success
  UI -> API : reload Problem details before retry
  note over Admin, UI : Compare current fields with intended changes; end when outcome is confirmed.
end
@enduml
```

## 4. Notes

- No partial update is persisted. The client must confirm the stored state before retrying after a timeout.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial exception supplement. |
