# Sequence Diagram - UC-AD-T-02 - Update Test Case

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-AD-T-02 |
| Use Case | UC-AD-T-02 - Update Test Case |
| Use Case Specification | [UC-AD-T-02-UpdateTestCase.md](../../../../RequirementAnalysis/UCSpec/Administrator/TestCaseManagement/UC-AD-T-02-UpdateTestCase.md) |
| Primary Actor(s) | Administrator |
| Related Requirements | FR-ADMIN-01, FR-TC-04, FR-TC-09, NFR-REL-08 |
| Scope | Main Flow 1-26, A1-A3, E1-E6; E7-E10 in SD-UC-AD-T-02-X |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

Update Test Case content or order with optimistic concurrency while preserving other Test Cases and historical results.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | 1-26 | Entire diagram |
| A1 | A1 | Unchanged fields preserved |
| A2 | A2 | UI-only cancellation; no update request |
| A3 | A3 | New order checked for uniqueness |
| E1 | E1 | `break E1` at token validation |
| E2 | E2 | `break E2` at admin-role validation |
| E3 | E3 | `break E3` at Problem lookup |
| E4 | E4 | `break E4` at Test Case lookup/association check |
| E5 | E5 | `break E5` at Problem editability check |
| E6 | E6 | `break E6` at Test Case data validation |
| E7-E10 | - | [SD-UC-AD-T-02-X](SD-UC-AD-T-02-UpdateTestCase-Exceptions.md) |

## 3. Diagram

```plantuml
@startuml SD-UC-AD-T-02
title UC-AD-T-02 - Update Test Case\nContent and order update with version check
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
participant "Account & Auth" as AUTH #D5E8D4
participant "Problem Catalog" as PROB #D5E8D4
participant "Test Cases" as TC #D5E8D4
database "PostgreSQL" as DB #FFF2CC
participant "Test Case Store" as FS #FFF2CC

Admin -> UI : 1-2 select Problem and Test Case
UI -> API : 3-9 request details
API -> AUTH : 4,10 authenticate and authorize admin
AUTH --> API : principal
API -> PROB : 5-6 verify active draft Problem
PROB -> DB : read Problem state
DB --> PROB : state or none
API -> TC : 9-11 retrieve Test Case and version
TC -> DB : read Test Case by ID and Problem ID
DB --> TC : data/version or none
break E3 - ERR-RES-001 - Problem not found (5 or 18)
  PROB --> API : ERR-RES-001
  API --> UI : not found
  note right of UI : Return Administrator to the Problem list; use case ends.
end
break E4 - ERR-RES-003 - Test Case missing or belongs elsewhere (10 or 18)
  TC --> API : ERR-RES-003
  API --> UI : not found in selected Problem
  note right of UI : Reload the Test Case list; use case ends.
end
API --> UI : 11 current data and version
UI --> Admin : 12 display edit form
Admin -> UI : 13-14 edit and submit
UI -> API : 16 update with loaded version
API -> AUTH : 17 authenticate and authorize admin
AUTH --> API : principal
API -> PROB : 18 recheck Problem state
PROB --> API : active and draft or error
API -> TC : 18-21 validate data, order, and version
TC -> DB : read current Test Case and Problem set
DB --> TC : stored version and order
break E1 - ERR-AUTH-003 - missing, invalid, or expired token (4, 10, or 17)
  API --> UI : reject; clear authentication
  note right of UI : Clear authentication and navigate Administrator to login.
end
break E2 - ERR-PERM-002 - insufficient privileges (4, 10, or 17)
  API --> UI : ERR-PERM-002
  note right of UI : Explain that Administrator rights are required.
end
break E5 - ERR-CONFLICT-001 - Problem is not editable (6 or 18)
  PROB --> API : ERR-CONFLICT-001
  API --> UI : reject mutation
  note right of UI : Explain editability requirement and offer Problem workflow.
end
break E6 - ERR-VAL-001 - invalid Test Case data (19)
  TC --> API : invalid fields and causes
  API --> UI : ERR-VAL-001
  note right of UI : Show field errors; correction continues at 14.
end
opt A1 - only selected fields changed (13)
  note over UI, TC : Preserve all fields not changed by the request.
end
opt A3 - execution order changed (13)
  note over TC, DB : Require unused order within this Problem.
end
group Transaction (atomic metadata and version)
  TC -> FS : replace changed input/output files when applicable
  TC -> DB : 22-23 update fields, order, version, timestamp
  DB --> TC : updated Test Case and version
end
TC --> API : 24 updated data
API --> UI : 24-25 success
UI --> Admin : 25 refresh list and confirm
note over UI, API : E7-E10 are covered by the exception supplement. A2 cancellation is UI-only.
note over TC, DB : Historical Submission results and unrelated Test Cases remain unchanged.
@enduml
```

## 4. Notes

- The loaded version is checked before mutation. Historical grading results are not recalculated or changed.
- Test Case input and expected output are never written to logs or error responses.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
