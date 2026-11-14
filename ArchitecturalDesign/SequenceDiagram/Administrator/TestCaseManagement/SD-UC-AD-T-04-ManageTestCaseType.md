# Sequence Diagram - UC-AD-T-04 - Manage Test Case Type

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-AD-T-04 |
| Use Case | UC-AD-T-04 - Manage Test Case Type |
| Use Case Specification | [UC-AD-T-04-ManageTestCaseType.md](../../../../RequirementAnalysis/UCSpec/Administrator/TestCaseManagement/UC-AD-T-04-ManageTestCaseType.md) |
| Primary Actor(s) | Administrator |
| Related Requirements | FR-ADMIN-01, FR-TC-03, FR-TC-07, FR-TC-09, NFR-REL-08 |
| Scope | Main Flow 1-25, A1-A4, E1-E6; E7-E9 in SD-UC-AD-T-04-X |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

Change a Test Case between SAMPLE and HIDDEN with an explicit visibility confirmation and a stale-version check.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | 1-25 | Entire diagram |
| A1 | A1 | `alt A1`; warn before SAMPLE becomes HIDDEN |
| A2 | A2 | `alt A2`; warn before HIDDEN becomes SAMPLE |
| A3 | A3 | UI-only no-op when current type is selected |
| A4 | A4 | UI-only cancellation; no update request |
| E1 | E1 | `break E1` at token validation |
| E2 | E2 | `break E2` at admin-role validation |
| E3 | E3 | `break E3` at Problem lookup |
| E4 | E4 | `break E4` at Test Case lookup/association check |
| E5 | E5 | `break E5` at Problem editability check |
| E6 | E6 | `break E6` at type validation |
| E7-E9 | - | [SD-UC-AD-T-04-X](SD-UC-AD-T-04-ManageTestCaseType-Exceptions.md) |

## 3. Diagram

```plantuml
@startuml SD-UC-AD-T-04
title UC-AD-T-04 - Manage Test Case Type\nChange visibility classification safely
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

Admin -> UI : 1-2 choose Problem and Test Case
UI -> API : 3 request Problem details
API -> AUTH : 4 authenticate and authorize admin
AUTH --> API : principal
API -> PROB : 5-6 verify Problem is ACTIVE and DRAFT
PROB --> API : Problem state
API -> TC : 9-11 retrieve Test Case, type, and version
TC -> DB : read Test Case by ID and Problem
DB --> TC : type and version, or none
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
API --> UI : 11 type and version
UI --> Admin : 12 display current and available types
Admin -> UI : 13 select new type
alt A1 - SAMPLE to HIDDEN
  UI --> Admin : 14 warn data will no longer be public
else A2 - HIDDEN to SAMPLE
  UI --> Admin : 14 warn data may become public
end
Admin -> UI : 15 confirm
UI -> API : 16 change type with version
API -> AUTH : 17 authenticate and authorize admin
AUTH --> API : principal
API -> PROB : 18 recheck Problem state
PROB --> API : ACTIVE and DRAFT or error
API -> TC : 19-20 validate type and stored version
TC -> DB : read current version and type
DB --> TC : current data
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
break E6 - ERR-VAL-001 - invalid Test Case type (19)
  TC --> API : ERR-VAL-001
  API --> UI : invalid type
  note right of UI : Ask for SAMPLE or HIDDEN; correction continues at 13.
end
group Transaction (atomic)
  TC -> DB : 21-22 update type, version, and timestamp
  DB --> TC : updated Test Case
end
TC --> API : 23 updated data
API --> UI : 23-24 success
UI --> Admin : 24 update list and confirm
note over UI, API : E7-E9 are covered by the exception supplement. A3 no-op and A4 cancellation are UI-only.
note over TC, DB : Input, expected output, order, and historical results are unchanged.
@enduml
```

## 4. Notes

- SAMPLE data may be public after publication; HIDDEN data is never exposed publicly or through Submission views.
- A selected current type causes no request and ends the use case.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
