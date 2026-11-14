# Sequence Diagram - UC-AD-S-01 - View Any Submission - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-AD-S-01-X |
| Use Case | UC-AD-S-01 - View Any Submission |
| Use Case Specification | [UC-AD-S-01-ViewAnySubmission.md](../../../../RequirementAnalysis/UCSpec/Administrator/SubmissionManagement/UC-AD-S-01-ViewAnySubmission.md) |
| Primary Actor(s) | Administrator |
| Related Requirements | FR-ADMIN-01, FR-ADMIN-06, FR-SUB-10, NFR-SEC-05 |
| Scope | E7-E8; primary flow in [SD-UC-AD-S-01](SD-UC-AD-S-01-ViewAnySubmission.md) |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

Supplement for Submission-query failure and client network interruption.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Primary | - | [SD-UC-AD-S-01](SD-UC-AD-S-01-ViewAnySubmission.md) |
| E7 | E7 | `group E7` at list/details query |
| E8 | E8 | Client-only network outcome group at list/details request |

## 3. Diagram

```plantuml
@startuml SD-UC-AD-S-01-X
title UC-AD-S-01 - View Any Submission - Exceptions\nUnavailable data and unknown network outcome
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
participant "Submissions" as SUB #D5E8D4
database "PostgreSQL" as DB #FFF2CC

ref over Admin, DB : UC-AD-S-01 - View Any Submission
group E7 - ERR-SYS-001 - Submission query or assembly failure (6, 7, or 11)
  SUB -> DB : query list or assemble selected Submission
  DB -x SUB : query/storage error
  SUB --> API : ERR-SYS-001 with request_id
  API --> UI : general load failure
  UI --> Admin : notify information could not be loaded
  note right of SUB : Return no partial data; do not expose internal details.
end
group E8 - ERR-NET-001 - request or response interrupted (2, 9, or response)
  UI -> API : request list page or selected details
  API --> UI : response not received or timed out
  UI -> UI : do not display stale data as current
  UI --> Admin : notify load failure and allow retry
  note over Admin, UI : Use case ends for this request.
end
@enduml
```

## 4. Notes

- Neither branch changes Submission data. Hidden test inputs/expected outputs remain excluded.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial exception supplement. |
