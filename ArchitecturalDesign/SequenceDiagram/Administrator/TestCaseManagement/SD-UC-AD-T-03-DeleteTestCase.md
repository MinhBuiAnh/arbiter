# Sequence Diagram - UC-AD-T-03 - Delete Test Case

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-AD-T-03 |
| Use Case | UC-AD-T-03 - Delete Test Case |
| Use Case Specification | [UC-AD-T-03-DeleteTestCase.md](../../../../RequirementAnalysis/UCSpec/Administrator/TestCaseManagement/UC-AD-T-03-DeleteTestCase.md) |
| Primary Actor(s) | Administrator |
| Related Requirements | FR-ADMIN-01, FR-TC-05, FR-TC-09, NFR-REL-08 |
| Scope | Main Flow 1-24, A1-A2, E1-E6; E7-E8 in SD-UC-AD-T-03-X |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

Delete a Test Case and compact remaining order values atomically, without changing historical Submissions or results.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | 1-24 | Entire diagram |
| A1 | A1 | UI-only cancellation; no delete request |
| A2 | A2 | `opt A2`; allow deleting last Test Case and warn publish prerequisites must be restored |
| E1 | E1 | `break E1` at token validation |
| E2 | E2 | `break E2` at admin-role validation |
| E3 | E3 | `break E3` at Problem lookup |
| E4 | E4 | `break E4` at Test Case lookup/association check |
| E5 | E5 | `break E5` at Problem editability check |
| E6 | E6 | `break E6` at Test Case set-version check |
| E7-E8 | - | [SD-UC-AD-T-03-X](SD-UC-AD-T-03-DeleteTestCase-Exceptions.md) |

## 3. Diagram

```plantuml
@startuml SD-UC-AD-T-03
title UC-AD-T-03 - Delete Test Case\nAtomic deletion and contiguous order repair
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
PROB -> DB : read Problem state
DB --> PROB : Problem state or none
API -> TC : 9-11 retrieve Test Case and version
TC -> DB : read Test Case by ID and Problem ID
DB --> TC : current Test Case, version, or none
PROB --> API : Problem details
API --> UI : 7, 11 details and version
UI --> Admin : 12 display Test Case
Admin -> UI : 13-15 select Delete and confirm
UI -> API : 16 delete with loaded version
API -> AUTH : 17 authenticate and authorize admin
AUTH --> API : principal
API -> PROB : 18 recheck Problem state
PROB -> DB : read Problem status and publication state
DB --> PROB : current state
API -> TC : 18-19 verify Test Case association and version
TC -> DB : read Test Case and set version
DB --> TC : current rows and version
break E1 - ERR-AUTH-003 - missing, invalid, or expired token (4 or 17)
  API --> UI : reject; clear authentication
  note right of UI : Clear authentication and navigate Administrator to login.
end
break E2 - ERR-PERM-002 - insufficient privileges (4 or 17)
  API --> UI : ERR-PERM-002
  note right of UI : Explain that Administrator rights are required.
end
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
break E5 - ERR-CONFLICT-001 - Problem is not editable (6 or 18)
  PROB --> API : ERR-CONFLICT-001
  API --> UI : reject mutation
  note right of UI : Explain editability requirement and offer Problem workflow.
end
opt A2 - deleting the last Test Case (18)
  note over TC, DB : Deletion is allowed in DRAFT; publication prerequisites must be restored later.
end
break E6 - ERR-CONFLICT-008 - concurrent Test Case set change (19)
  TC --> API : ERR-CONFLICT-008
  API --> UI : stale Test Case set
  note right of UI : Reload latest list before offering deletion again.
end
group Transaction (atomic)
  TC -> DB : 20-21 delete Test Case and compact ordinals; record Problem timestamp
  DB --> TC : committed updated Test Case list
end
TC --> API : 22 operation result and list
API --> UI : 22-23 success
UI --> Admin : 23 remove row and confirm
note over UI, API : E7-E8 are covered by the exception supplement. A1 cancellation is UI-only.
note over TC, DB : Historical Submissions and grading results are preserved.
@enduml
```

## 4. Notes

- Deletion is permitted while the Problem is active and draft, even if it leaves an empty Test Case set.
- The delete and contiguous renumbering are one atomic database transaction.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
