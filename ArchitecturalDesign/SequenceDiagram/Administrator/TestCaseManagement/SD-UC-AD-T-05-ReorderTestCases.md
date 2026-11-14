# Sequence Diagram - UC-AD-T-05 - Reorder Test Cases

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-AD-T-05 |
| Use Case | UC-AD-T-05 - Reorder Test Cases |
| Use Case Specification | [UC-AD-T-05-ReorderTestCases.md](../../../../RequirementAnalysis/UCSpec/Administrator/TestCaseManagement/UC-AD-T-05-ReorderTestCases.md) |
| Primary Actor(s) | Administrator |
| Related Requirements | FR-ADMIN-01, FR-TC-08, FR-TC-09, NFR-REL-08 |
| Scope | Main Flow 1-15, A1-A3, E1-E6; E7-E9 in SD-UC-AD-T-05-X |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

Persist a complete Test Case order atomically, ensuring the exact set is present and ordinals are unique, contiguous, and start at one.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | 1-15 | Entire diagram |
| A1 | A1 | UI-only cancellation; no request |
| A2 | A2 | `alt A2`; return current order without update |
| A3 | A3 | One-item move represented in the complete submitted order |
| E1 | E1 | `break E1` at token validation |
| E2 | E2 | `break E2` at admin-role validation |
| E3 | E3 | `break E3` at Problem lookup |
| E4 | E4 | `break E4` at submitted Test Case lookup |
| E5 | E5 | `break E5` at Problem editability check |
| E6 | E6 | `break E6` at complete-order validation |
| E7-E9 | - | [SD-UC-AD-T-05-X](SD-UC-AD-T-05-ReorderTestCases-Exceptions.md) |

## 3. Diagram

```plantuml
@startuml SD-UC-AD-T-05
title UC-AD-T-05 - Reorder Test Cases\nAtomic complete-order update
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

Admin -> UI : 1 open Test Case management
UI -> API : request ordered Test Case list
API -> AUTH : 2 authenticate and authorize admin
AUTH --> API : principal
API -> PROB : 3 verify Problem is ACTIVE and DRAFT
PROB -> DB : read Problem state
DB --> PROB : state or none
API -> TC : 4 get ordered Test Cases and set version
TC -> DB : read IDs, ordinals, types, previews
DB --> TC : ordered list and version
PROB --> API : Problem state
TC --> API : ordered Test Case list
API --> UI : list and current order
UI --> Admin : 5 display current order
Admin -> UI : 6 reorder list
UI -> API : 7 send complete ordered IDs
API -> AUTH : 8 authenticate and authorize admin
AUTH --> API : principal
API -> PROB : 9 recheck Problem is ACTIVE and DRAFT
PROB --> API : state valid or error
API -> TC : 10-11 verify exact ID set and at least two cases
TC -> DB : read current Test Case set and ordinals
DB --> TC : current set/version
break E1 - ERR-AUTH-003 - missing, invalid, or expired token (2 or 8)
  API --> UI : reject; clear authentication
  note right of UI : Clear authentication and navigate Administrator to login.
end
break E2 - ERR-PERM-002 - insufficient privileges (2 or 8)
  API --> UI : ERR-PERM-002
  note right of UI : Explain that Administrator rights are required.
end
break E3 - ERR-RES-001 - Problem not found (3 or 9)
  PROB --> API : ERR-RES-001
  API --> UI : not found
  note right of UI : Return Administrator to the Problem list; use case ends.
end
break E4 - ERR-RES-003 - Test Case missing or unknown (10)
  TC --> API : ERR-RES-003
  API --> UI : missing Test Case
  note right of UI : Reload the current Test Case list.
end
break E5 - ERR-CONFLICT-001 - Problem is not editable (3 or 9)
  PROB --> API : ERR-CONFLICT-001
  API --> UI : reject reorder
  note right of UI : Explain that the Problem must be ACTIVE and DRAFT.
end
break E6 - ERR-VAL-001 - invalid Test Case order (10)
  TC --> API : ERR-VAL-001
  API --> UI : invalid or duplicate ID set
  note right of UI : Reload current order and ask Administrator to retry.
end
alt A2 - order is unchanged
  API --> UI : return current order; no update needed
  note right of UI : Confirm that the order was unchanged.
else A3 - one Test Case moved
  note over UI, TC : Complete resulting identifier list is submitted, not a pairwise swap.
else Main - order changed
  note over UI, TC : Apply the submitted complete list.
end
group Transaction (atomic)
  TC -> DB : 12 set unique contiguous ordinals starting at 1
  DB --> TC : committed order
end
TC --> API : 13 new order
API --> UI : 13-14 updated order
UI --> Admin : 14 confirm success
note over UI, API : E7-E9 are covered by the exception supplement. A1 cancellation is UI-only.
note over TC, DB : Test Case content, type, and historical results are unchanged.
@enduml
```

## 4. Notes

- The submitted identifiers must exactly match the current Problem Test Case set.
- Reordering is allowed only for an active draft Problem with at least two Test Cases.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
