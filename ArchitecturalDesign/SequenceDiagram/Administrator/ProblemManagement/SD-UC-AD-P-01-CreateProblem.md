# Sequence Diagram - UC-AD-P-01 - Create Problem

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-AD-P-01 |
| Use Case | UC-AD-P-01 - Create Problem |
| Use Case Specification | [UC-AD-P-01-CreateProblem.md](../../../../RequirementAnalysis/UCSpec/Administrator/ProblemManagement/UC-AD-P-01-CreateProblem.md) |
| Primary Actor(s) | Administrator |
| Related Requirements | FR-ADMIN-01, FR-PROB-05, FR-PROB-09, NFR-SEC-03, NFR-REL-01 |
| Scope | Main Flow 1-15, A1-A3, E1-E5 |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

Create a new active, draft Problem atomically. Test Cases are managed separately.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | 1-15 | Entire diagram |
| A1 | A1 | UI-only cancellation; no request is sent |
| A2 | A2 | `opt A2` after successful creation; continue through UC-AD-T-01 |
| A3 | A3 | `opt A3` after successful creation; clear form |
| E1 | E1 | `break E1` at access-token validation |
| E2 | E2 | `break E2` at admin-role check |
| E3 | E3 | `break E3` at field/business-rule validation |
| E4 | E4 | `break E4` at atomic persistence |
| E5 | E5 | Client-only network outcome note; verify Problem list before retry |

## 3. Diagram

```plantuml
@startuml SD-UC-AD-P-01
title UC-AD-P-01 - Create Problem\nAtomic creation in ACTIVE and DRAFT state
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

Admin -> UI : 1-4 enter Problem fields and classification
UI -> UI : 6 basic format checks
UI -> API : 7 POST create Problem
API -> AUTH : 8 validate token and account
AUTH --> API : authenticated principal or error
break E1 - ERR-AUTH-003 - missing, invalid, or expired token (8)
  API --> UI : reject request
  UI -> UI : clear authentication and navigate to login
  note right of API : No Problem is created. Log request_id only; never log the token.
end
API -> AUTH : 8 authorize admin role
AUTH --> API : authorized or denied
break E2 - ERR-PERM-002 - insufficient privileges (8)
  API --> UI : ERR-PERM-002
  UI --> Admin : explain admin rights are required
  note right of API : No Problem is created. Log request_id and account identifier.
end
API -> PROB : 9-10 validate fields, limits, and business rules
break E3 - ERR-VAL-001 - invalid Problem data (9-10)
  PROB --> API : invalid fields and causes
  API --> UI : ERR-VAL-001
  UI --> Admin : show errors beside fields
  note right of PROB : No Problem is created; do not log full Problem content. Continues at 5 after correction.
end
group Transaction (atomic)
  PROB -> DB : 11-12 INSERT Problem (ACTIVE, DRAFT) and tags
  DB --> PROB : Problem ID and stored record
end
break E4 - ERR-SYS-001 - Problem creation or persistence failed (11-12)
  PROB --> API : ERR-SYS-001
  API --> UI : general failure with request_id
  UI --> Admin : notify creation failed
  note right of DB : Transaction rolled back; no partial Problem is persisted.
end
PROB --> API : 13 Problem ID and stored data
API --> UI : 13-14 success response
UI --> Admin : 14 show link to new Problem
opt A2 - continue to Test Case management (14)
  Admin -> UI : open Manage Test Cases
  ref over Admin, UI : UC-AD-T-01 - Create Test Case
end
opt A3 - create another Problem (14)
  Admin -> UI : select Create Another
  UI -> UI : display empty create form
end
note over Admin, UI : A1 cancellation is UI-only; no request is sent. Main flow ends at 15.
note over UI, API : E5 - ERR-NET-001: if the request/response times out, show unknown outcome and reload the Problem list before retrying.
@enduml
```

## 4. Notes

- The Problem is not public until a separate publication operation succeeds.
- Problem fields and tag assignment are handled by `PROB`; Test Case content is outside this use case.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
