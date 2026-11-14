# Sequence Diagram - UC-AD-P-04 - Manage Problem Publication

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-AD-P-04 |
| Use Case | UC-AD-P-04 - Manage Problem Publication |
| Use Case Specification | [UC-AD-P-04-ManageProblemPublication.md](../../../../RequirementAnalysis/UCSpec/Administrator/ProblemManagement/UC-AD-P-04-ManageProblemPublication.md) |
| Primary Actor(s) | Administrator |
| Related Requirements | FR-ADMIN-01, FR-PROB-08, NFR-SEC-03, NFR-REL-08 |
| Scope | Main Flow 1-21, A1-A4, E1-E6; E7-E8 in SD-UC-AD-P-04-X |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

Publish a ready active Problem or unpublish a published Problem. Publication checks are consistent with the metadata, Test Case set, and protected files.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | 1-21 | Entire diagram |
| A1 | A1 | `alt A1`; unpublish active published Problem |
| A2 | A2 | `alt A2`; no-op when already published |
| A3 | A3 | `alt A3`; no-op when already unpublished |
| A4 | A4 | UI-only cancellation; no request is sent |
| E1 | E1 | `break E1` at access-token validation |
| E2 | E2 | `break E2` at admin-role validation |
| E3 | E3 | `break E3` at Problem lookup |
| E4 | E4 | `break E4` at active-state recheck |
| E5 | E5 | `break E5` at publication-readiness validation |
| E6 | E6 | `break E6` at publication-version comparison |
| E7-E8 | - | [SD-UC-AD-P-04-X](SD-UC-AD-P-04-ManageProblemPublication-Exceptions.md) |

## 3. Diagram

```plantuml
@startuml SD-UC-AD-P-04
title UC-AD-P-04 - Manage Problem Publication\nPublish readiness and atomic state transition
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

Admin -> UI : 1-2 select Problem
UI -> API : 3 GET Problem and publication state
API -> AUTH : 4 authenticate and authorize admin
AUTH --> API : principal or authorization result
break E1 - ERR-AUTH-003 - missing, invalid, or expired token (4 or 13)
  API --> UI : reject; clear authentication
  note right of UI : Navigate Administrator to login.
end
break E2 - ERR-PERM-002 - insufficient privileges (4 or 13)
  API --> UI : ERR-PERM-002
  note right of UI : Explain that Administrator rights are required.
end
API -> PROB : 5-6 retrieve Problem
PROB -> DB : read Problem by ID
DB --> PROB : Problem and version, or none
break E3 - ERR-RES-001 - Problem not found (5 or 14)
  PROB --> API : ERR-RES-001
  API --> UI : not found
  note right of UI : Return Administrator to the Problem list.
end
PROB --> API : 7 Problem, state, version
API --> UI : 7 details and available action
note right of UI : 8 display state and available action.
Admin -> UI : select action and confirm (9-11)
UI -> API : 12 send action with loaded version
API -> AUTH : 13 authenticate and authorize admin
AUTH --> API : authorized principal
API -> PROB : 14-16 recheck state/version and determine outcome
PROB -> DB : read current Problem state and version
DB --> PROB : current state/version
break E4 - ERR-CONFLICT-003 - Problem is inactive (14)
  PROB --> API : ERR-CONFLICT-003
  API --> UI : reject publication change
  note right of UI : Offer the reactivation workflow.
end
break E6 - ERR-CONFLICT-006 - concurrent publication state change (15)
  PROB --> API : ERR-CONFLICT-006
  API --> UI : stale version/state
  note right of UI : Reload latest publication state before retrying.
end
alt A2 - Publish requested for already published Problem
  API --> UI : current state; no update
  note right of UI : Report that the Problem is already published.
else A3 - Unpublish requested for DRAFT Problem
  API --> UI : current state; no update
  note right of UI : Report that the Problem is not published.
else A1 - Unpublish published Problem
  group Transaction (atomic)
    PROB -> DB : set publication state DRAFT and timestamp
    DB --> PROB : committed state
  end
  PROB --> API : DRAFT
  API --> UI : unpublish success
else Main - Publish draft Problem
  PROB -> TC : verify at least one SAMPLE and one HIDDEN
  TC --> PROB : types and relative file paths
  PROB -> FS : verify input and expected-output files are readable
  FS --> PROB : readable status
  break E5 - ERR-VAL-008 - publication requirements unmet (16; publish only)
    PROB --> API : unmet requirements
    API --> UI : ERR-VAL-008 and requirement list
    note right of UI : Link to Problem/Test Case management; resolve and continue at 9.
  end
  group Transaction (atomic)
    PROB -> DB : set publication state PUBLISHED and timestamp
    DB --> PROB : committed state
  end
  PROB --> API : 19 PUBLISHED
  API --> UI : 19-20 success
end
note over UI, API : E7-E8 are covered by the exception supplement. A4 cancellation is UI-only.
note over PROB, FS : Hidden Test Case input and expected output are checked for readability, never returned.
@enduml
```

## 4. Notes

- The readiness check and publication transition must be consistent; no partial state change occurs if a check fails.
- Unpublishing does not delete Submissions or grading results.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
