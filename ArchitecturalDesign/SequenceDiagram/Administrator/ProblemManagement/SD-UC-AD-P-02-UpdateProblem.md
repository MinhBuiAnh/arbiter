# Sequence Diagram - UC-AD-P-02 - Update Problem

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-AD-P-02 |
| Use Case | UC-AD-P-02 - Update Problem |
| Use Case Specification | [UC-AD-P-02-UpdateProblem.md](../../../../RequirementAnalysis/UCSpec/Administrator/ProblemManagement/UC-AD-P-02-UpdateProblem.md) |
| Primary Actor(s) | Administrator |
| Related Requirements | FR-ADMIN-01, FR-PROB-06, FR-PROB-09, NFR-SEC-03, NFR-REL-08 |
| Scope | Main Flow 1-21, A1-A3, E1-E6; E7-E8 in SD-UC-AD-P-02-X |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

Read and update active Problem metadata with optimistic concurrency. Published Problems retain their publication state and must remain publication-eligible.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | 1-21 | Entire diagram |
| A1 | A1 | `opt A1`; preserve unchanged fields |
| A2 | A2 | UI-only cancellation; no update request |
| A3 | A3 | `opt A3`; published state retained and eligibility rechecked |
| E1 | E1 | `break E1` at token validation |
| E2 | E2 | `break E2` at admin-role validation |
| E3 | E3 | `break E3` at Problem lookup |
| E4 | E4 | `break E4` at active-state check |
| E5 | E5 | `break E5` at update and publication-eligibility validation |
| E6 | E6 | `break E6` at optimistic version comparison |
| E7-E8 | - | [SD-UC-AD-P-02-X](SD-UC-AD-P-02-UpdateProblem-Exceptions.md) |

## 3. Diagram

```plantuml
@startuml SD-UC-AD-P-02
title UC-AD-P-02 - Update Problem\nVersion-checked metadata update
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
database "PostgreSQL" as DB #FFF2CC

Admin -> UI : 1-2 select Problem
UI -> API : 3 GET Problem details
API -> AUTH : 4 authenticate and authorize admin
AUTH --> API : principal or ERR-AUTH-003 / ERR-PERM-002
API -> PROB : 5-6 get active Problem
PROB -> DB : 5 read Problem by ID
DB --> PROB : Problem and state, or none
break E3 - ERR-RES-001 - Problem not found (5 or 14)
  PROB --> API : ERR-RES-001
  API --> UI : not found
  UI --> Admin : return to Problem list
end
break E4 - ERR-CONFLICT-003 - Problem is inactive (6 or 14)
  PROB --> API : ERR-CONFLICT-003
  API --> UI : reject update
  UI --> Admin : offer reactivation workflow
end
PROB --> API : 7 current fields, publication state, version
API --> UI : 7 Problem data
UI --> Admin : 8 display edit form
Admin -> UI : 9-10 change fields and submit
UI -> API : 12 update fields with loaded version
API -> AUTH : 13 authenticate and authorize admin
AUTH --> API : principal or authorization error
API -> PROB : 14-16 recheck state; validate fields and version
PROB -> DB : 14 read current Problem/version
DB --> PROB : current data and version
break E1 - ERR-AUTH-003 - missing, invalid, or expired token (4 or 13)
  API --> UI : reject and clear authentication
  UI --> Admin : navigate to login
end
break E2 - ERR-PERM-002 - insufficient privileges (4 or 13)
  API --> UI : ERR-PERM-002
  UI --> Admin : explain admin rights are required
end
break E5 - ERR-VAL-001 - invalid update or published Problem not eligible (15)
  PROB --> API : invalid fields and causes
  API --> UI : ERR-VAL-001
  UI --> Admin : show field errors; continue at 10 after correction
  note right of PROB : No fields or version are changed; do not log full Problem content.
end
break E6 - ERR-CONFLICT-004 - concurrent Problem update (16)
  PROB --> API : ERR-CONFLICT-004
  API --> UI : stale version
  UI --> Admin : offer reload of latest fields
  note right of PROB : No fields are changed. Reload continues at 8.
end
opt A1 - only selected fields changed (9)
  note over UI, PROB : Unchanged fields are preserved.
end
opt A3 - Problem is published (6)
  note over PROB, DB : Keep PUBLISHED; reject metadata that would violate publication requirements.
end
group Transaction (atomic)
  PROB -> DB : 17-18 update fields, version, timestamp
  DB --> PROB : updated Problem and version
end
PROB --> API : 19 updated Problem
API --> UI : 19-20 success
UI --> Admin : 20 display updated Problem
note over UI, API : E7-E8 are covered by the exception supplement.
@enduml
```

## 4. Notes

- The update does not modify Test Cases, Submissions, or historical results.
- Main flow ends at step 21; cancellation and stale-version reload retain the specification's outcomes.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
