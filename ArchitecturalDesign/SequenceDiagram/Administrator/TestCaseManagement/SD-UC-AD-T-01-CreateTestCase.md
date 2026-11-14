# Sequence Diagram - UC-AD-T-01 - Create Test Case

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-AD-T-01 |
| Use Case | UC-AD-T-01 - Create Test Case |
| Use Case Specification | [UC-AD-T-01-CreateTestCase.md](../../../../RequirementAnalysis/UCSpec/Administrator/TestCaseManagement/UC-AD-T-01-CreateTestCase.md) |
| Primary Actor(s) | Administrator |
| Related Requirements | FR-ADMIN-01, FR-TC-01, FR-TC-02, FR-TC-09, NFR-SEC-03, NFR-REL-01 |
| Scope | Main Flow 1-22, A1-A4, E1-E6; E7-E8 in SD-UC-AD-T-01-X |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

Add a SAMPLE or HIDDEN Test Case with input/output data and a unique order to an active draft Problem.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | 1-22 | Entire diagram |
| A1 | A1 | `alt A1`; explain SAMPLE visibility |
| A2 | A2 | `alt A2`; explain HIDDEN privacy |
| A3 | A3 | UI-only; display another empty form |
| A4 | A4 | UI-only cancellation; no create request |
| E1 | E1 | `break E1` at token validation |
| E2 | E2 | `break E2` at admin-role validation |
| E3 | E3 | `break E3` at Problem lookup |
| E4 | E4 | `break E4` at Problem editability check |
| E5 | E5 | `break E5` at Test Case data validation |
| E6 | E6 | `break E6` at unique-order check |
| E7-E8 | - | [SD-UC-AD-T-01-X](SD-UC-AD-T-01-CreateTestCase-Exceptions.md) |

## 3. Diagram

```plantuml
@startuml SD-UC-AD-T-01
title UC-AD-T-01 - Create Test Case\nUnique order on active draft Problem
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

Admin -> UI : 1-2 choose Problem
UI -> API : 3 request Problem details
API -> AUTH : 4 authenticate and authorize admin
AUTH --> API : principal
API -> PROB : 5-6 verify Problem exists, ACTIVE and DRAFT
PROB -> DB : read Problem state
DB --> PROB : Problem state or none
break E3 - ERR-RES-001 - Problem not found (5 or 15)
  PROB --> API : ERR-RES-001
  API --> UI : not found
  note right of UI : Return Administrator to the Problem list; use case ends.
end
break E4 - ERR-CONFLICT-001 - Problem is not editable (6 or 15)
  PROB --> API : ERR-CONFLICT-001
  API --> UI : reject mutation
  note right of UI : Explain that the Problem must be ACTIVE and DRAFT; use case ends.
end
PROB --> API : 7 Problem details
API --> UI : 7 details
Admin -> UI : 8-10 open form; enter data and type
alt A1 - type SAMPLE
  UI -> UI : explain sample visibility after publication
else A2 - type HIDDEN
  UI -> UI : explain hidden data remains private
end
Admin -> UI : 11 submit
UI -> UI : 12 basic format checks
UI -> API : 13 create Test Case
API -> AUTH : 14 authenticate and authorize admin
AUTH --> API : principal or authorization error
API -> PROB : 15 recheck active draft Problem
PROB --> API : state valid or error
API -> TC : 16-17 validate content/type and order
TC --> API : validation result
break E1 - ERR-AUTH-003 - missing, invalid, or expired token (4 or 14)
  API --> UI : reject; clear authentication
  note right of UI : Clear authentication and navigate Administrator to login.
end
break E2 - ERR-PERM-002 - insufficient privileges (4 or 14)
  API --> UI : ERR-PERM-002
  note right of UI : Explain that Administrator rights are required.
end
break E5 - ERR-VAL-001 - invalid Test Case data (16)
  API --> UI : invalid fields and causes
  note right of UI : Show field errors; correction continues at 11.
end
break E6 - ERR-VAL-009 - duplicate Test Case order (17)
  API --> UI : ERR-VAL-009
  note right of UI : Ask for another order; correction continues at 11.
end
TC -> FS : stage input and expected-output files
group Transaction (atomic metadata and order)
  TC -> DB : 18-19 insert Test Case and unique order
  DB --> TC : committed Test Case ID and metadata
end
TC --> API : 20 created Test Case
API --> UI : 20-21 success
UI --> Admin : 21 add row and show notification
opt A3 - Create Another Test Case (21)
  UI -> UI : display empty create form
end
note over UI, API : E7-E8 are covered by the exception supplement. A4 cancellation is UI-only.
note over TC, FS : Hidden content is not logged or returned through public or Submission views.
@enduml
```

## 4. Notes

- Metadata and execution-order persistence are atomic. Problem publication state remains DRAFT.
- File contents are written to the protected Test Case Store; metadata contains references, not public content.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
