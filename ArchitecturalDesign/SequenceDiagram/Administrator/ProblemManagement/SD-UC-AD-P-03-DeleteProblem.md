# Sequence Diagram - UC-AD-P-03 - Delete / Deactivate Problem

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-AD-P-03 |
| Use Case | UC-AD-P-03 - Delete / Deactivate Problem |
| Use Case Specification | [UC-AD-P-03-DeleteProblem.md](../../../../RequirementAnalysis/UCSpec/Administrator/ProblemManagement/UC-AD-P-03-DeleteProblem.md) |
| Primary Actor(s) | Administrator |
| Related Requirements | FR-ADMIN-01, FR-PROB-07, NFR-SEC-03, NFR-REL-08 |
| Scope | Main Flow 1-20, A1-A4, E1-E6 |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

Soft-deactivate or reactivate a Problem with optimistic concurrency. Existing Test Cases and Submission history are retained.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | 1-20 | Entire diagram |
| A1 | A1 | UI-only cancellation; no state-change request |
| A2 | A2 | `opt A2`; return current inactive state and offer Activate |
| A3 | A3 | `alt A3`; reactivate and leave publication DRAFT |
| A4 | A4 | `opt A4`; Submissions/results preserved |
| E1 | E1 | `break E1` at token validation |
| E2 | E2 | `break E2` at admin-role validation |
| E3 | E3 | `break E3` at Problem lookup |
| E4 | E4 | `break E4` at state/version comparison |
| E5 | E5 | `break E5` at atomic state persistence |
| E6 | E6 | Client-only unknown network outcome; reload and verify status |

## 3. Diagram

```plantuml
@startuml SD-UC-AD-P-03
title UC-AD-P-03 - Delete / Deactivate Problem\nSoft state change preserving history
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

Admin -> UI : 1-2 select Problem and requested action
UI -> API : 3 request Problem details
API -> AUTH : 4 authenticate and authorize admin
AUTH --> API : principal or authorization error
API -> PROB : 5-6 retrieve Problem and state
PROB -> DB : read Problem by ID and version
DB --> PROB : current state, version, or none
break E3 - ERR-RES-001 - Problem not found (5 or 14)
  PROB --> API : ERR-RES-001
  API --> UI : not found
  UI --> Admin : return to Problem list
end
PROB --> API : 7 Problem, state, version
API --> UI : 7 details and available action
UI --> Admin : 8 display details
opt A2 - Problem already inactive (6)
  UI --> Admin : offer Activate; no change
end
alt A3 - Administrator reactivates an inactive Problem
  Admin -> UI : select Activate and confirm (A3)
  UI -> API : send activation with loaded version
else Main - Administrator deactivates an active Problem
  Admin -> UI : 9-11 select Deactivate and confirm
  UI -> API : 12 send deactivation with loaded version
end
API -> AUTH : 13 authenticate and authorize admin
AUTH --> API : authorized principal
API -> PROB : 14-15 recheck status and version
PROB -> DB : read current Problem/version
DB --> PROB : current state
break E1 - ERR-AUTH-003 - missing, invalid, or expired token (4 or 13)
  API --> UI : reject; clear authentication
  UI --> Admin : navigate to login
end
break E2 - ERR-PERM-002 - insufficient privileges (4 or 13)
  API --> UI : ERR-PERM-002
  UI --> Admin : explain admin rights are required
end
break E4 - ERR-CONFLICT-005 - concurrent Problem state change (14 or 15)
  PROB --> API : ERR-CONFLICT-005
  API --> UI : current state changed
  UI --> Admin : reload latest status before retry
end
opt A4 - Problem has existing Submissions (14)
  PROB -> DB : preserve Submission and result records
  DB --> PROB : records retained
end
group Transaction (atomic)
  PROB -> DB : 16-17 set requested status, state DRAFT, timestamp
  DB --> PROB : committed state
end
break E5 - ERR-SYS-001 - state persistence failed (16-17)
  PROB --> API : ERR-SYS-001
  API --> UI : general failure
  UI --> Admin : notify no change was applied
end
PROB --> API : 18 updated state
API --> UI : 18 success
UI --> Admin : 19 show result and update list
note over UI, API : E6 - ERR-NET-001: unknown outcome; reload Problem details and verify status before retry.
note over Admin, UI : A1 cancellation is UI-only. End at 20.
@enduml
```

## 4. Notes

- Reactivation always sets publication state to `DRAFT`; it does not make the Problem public.
- No Problem, Test Case, Submission, or grading data is physically deleted.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
