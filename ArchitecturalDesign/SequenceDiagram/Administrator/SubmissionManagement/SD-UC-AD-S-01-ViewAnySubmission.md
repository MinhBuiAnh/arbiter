# Sequence Diagram - UC-AD-S-01 - View Any Submission

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-AD-S-01 |
| Use Case | UC-AD-S-01 - View Any Submission |
| Use Case Specification | [UC-AD-S-01-ViewAnySubmission.md](../../../../RequirementAnalysis/UCSpec/Administrator/SubmissionManagement/UC-AD-S-01-ViewAnySubmission.md) |
| Primary Actor(s) | Administrator |
| Related Requirements | FR-ADMIN-01, FR-ADMIN-06, FR-SUB-10, NFR-SEC-04, NFR-SEC-05, NFR-SEC-10 |
| Scope | Main Flow 1-16, A1-A5, E1-E6; E7-E8 in SD-UC-AD-S-01-X |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

Search and inspect any Submission in read-only mode. Hidden Test Case inputs/outputs are excluded, and compilation output is bounded.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | 1-16 | Entire diagram |
| A1 | A1 | Optional User filter in the list request |
| A2 | A2 | Optional Problem filter in the list request |
| A3 | A3 | Optional verdict/status filter in the list request |
| A4 | A4 | `opt A4`; request another page and replace list |
| A5 | A5 | `opt A5`; empty page and zero count |
| E1 | E1 | `break E1` at token validation |
| E2 | E2 | `break E2` at admin-role validation |
| E3 | E3 | `break E3` at selected Submission lookup |
| E4 | E4 | `break E4` at filter validation |
| E5 | E5 | `break E5` at pagination validation |
| E6 | E6 | `break E6` at rate-limit check |
| E7-E8 | - | [SD-UC-AD-S-01-X](SD-UC-AD-S-01-ViewAnySubmission-Exceptions.md) |

## 3. Diagram

```plantuml
@startuml SD-UC-AD-S-01
title UC-AD-S-01 - View Any Submission\nAdmin-only read with hidden-data exclusion
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
participant "Submissions" as SUB #D5E8D4
database "PostgreSQL" as DB #FFF2CC

Admin -> UI : 1 open Submission Management; optionally set A1-A3 filters
UI -> API : 2 request Submission page with filters
API -> AUTH : 3 authenticate and authorize admin
AUTH --> API : principal
break E1 - ERR-AUTH-003 - missing, invalid, or expired token (3 or 10)
  API --> UI : reject; clear authentication
  note right of UI : Clear authentication and navigate Administrator to login.
end
break E2 - ERR-PERM-002 - insufficient privileges (3 or 10)
  API --> UI : ERR-PERM-002
  note right of UI : Explain that Administrator rights are required.
end
API -> SUB : 4 validate filters and 5 validate pagination
break E4 - ERR-VAL-004 - invalid filters (4)
  SUB --> API : invalid filter names
  API --> UI : ERR-VAL-004
  note right of UI : Correct filters and resubmit at 2.
end
break E5 - ERR-VAL-005 - invalid pagination (5)
  SUB --> API : invalid pagination
  API --> UI : ERR-VAL-005
  note right of UI : Reset/correct pagination and resubmit at 2.
end
break E6 - ERR-LIMIT-001 - rate limit exceeded (3 or 10)
  API --> UI : ERR-LIMIT-001 and retry time if available
  note right of UI : Ask Administrator to wait before retrying.
end
API -> SUB : 6 query matching Submissions across all users
SUB -> DB : apply filters and pagination
DB --> SUB : summary rows and total count
SUB --> API : 7 summary rows
API --> UI : 7 page and total count
UI --> Admin : 8 display Submission list
opt A4 - navigate to another page (8)
  Admin -> UI : select page/page size
  UI -> API : request updated page
  API -> SUB : validate pagination and retrieve page
  SUB --> API : page result
  API --> UI : page response
  UI --> Admin : update list
end
opt A5 - no matches (6)
  UI --> Admin : display empty page and active filters
end
Admin -> UI : 9 select Submission
UI -> API : request selected Submission details
API -> AUTH : 10 authenticate and authorize admin
AUTH --> API : principal
break E1 - ERR-AUTH-003 - missing, invalid, or expired token (10)
  API --> UI : reject; clear authentication
  note right of UI : Clear authentication and navigate Administrator to login.
end
break E2 - ERR-PERM-002 - insufficient privileges (10)
  API --> UI : ERR-PERM-002
  note right of UI : Explain that Administrator rights are required.
end
API -> SUB : 11-12 retrieve details; exclude hidden test data
SUB -> DB : read source, owner, Problem, status, metrics and per-test results
DB --> SUB : stored Submission and available results
break E3 - ERR-RES-005 - Submission not found (11)
  SUB --> API : ERR-RES-005
  API --> UI : not found
  note right of UI : Notify that the Submission no longer exists and reload the list.
end
SUB --> API : 13 details; compilation output bounded
API --> UI : 13 response without hidden input/output
UI --> Admin : 14 display read-only details
opt 15 navigate to related user or Problem
  Admin -> UI : choose related record
  ref over Admin, UI : UC-AD-U-02 or UC-AD-P-02
end
note over API, SUB : E7 system query error and E8 network error are in the supplement.
note over SUB, DB : Do not return hidden Test Case contents, stack traces, or unbounded compilation output.
@enduml
```

## 4. Notes

- Non-terminal Submissions show status rather than a verdict; `INTERNAL_ERROR` is a status, not a verdict.
- The use case performs no modification or rejudging.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
