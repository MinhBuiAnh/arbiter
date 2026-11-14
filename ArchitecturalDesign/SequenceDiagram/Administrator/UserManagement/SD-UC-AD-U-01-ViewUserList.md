# Sequence Diagram - UC-AD-U-01 - View User List

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-AD-U-01 |
| Use Case | UC-AD-U-01 - View User List |
| Use Case Specification | [UC-AD-U-01-ViewUserList.md](../../../../RequirementAnalysis/UCSpec/Administrator/UserManagement/UC-AD-U-01-ViewUserList.md) |
| Primary Actor(s) | Administrator |
| Related Requirements | FR-ADMIN-01, FR-ADMIN-02, NFR-SEC-03, NFR-SEC-10 |
| Scope | Main Flow 1-9, A1-A4, E1-E6; E7 in SD-UC-AD-U-01-X |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

List, search, filter, and paginate account summaries without exposing secrets or modifying account data.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | 1-9 | Entire diagram |
| A1 | A1 | `opt A1`; search by username or email |
| A2 | A2 | `opt A2`; filter by account status |
| A3 | A3 | `opt A3`; change page or page size |
| A4 | A4 | `opt A4`; empty page and zero count |
| E1 | E1 | `break E1` at token validation |
| E2 | E2 | `break E2` at admin-role validation |
| E3 | E3 | `break E3` at search/filter validation |
| E4 | E4 | `break E4` at pagination validation |
| E5 | E5 | `break E5` at rate-limit check |
| E6 | E6 | `break E6` at account query/assembly |
| E7 | - | [SD-UC-AD-U-01-X](SD-UC-AD-U-01-ViewUserList-Exceptions.md) |

## 3. Diagram

```plantuml
@startuml SD-UC-AD-U-01
title UC-AD-U-01 - View User List\nAuthorized search and pagination
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
database "PostgreSQL" as DB #FFF2CC

Admin -> UI : 1 open User Management
opt A1 - search by username or email
  Admin -> UI : enter search keyword
end
opt A2 - filter by account status
  Admin -> UI : select status
end
UI -> API : 2 request users with filters and pagination
API -> AUTH : 3 authenticate and authorize admin
AUTH --> API : principal or authorization result
API -> AUTH : 4 validate search/filter and pagination
AUTH -> DB : 5-6 query matching accounts and requested page
DB --> AUTH : summary rows and total count
break E1 - ERR-AUTH-003 - missing, invalid, or expired token (3)
  API --> UI : reject; clear authentication
  UI --> Admin : navigate to login
end
break E2 - ERR-PERM-002 - insufficient privileges (3)
  API --> UI : ERR-PERM-002
  UI --> Admin : explain admin rights are required
end
break E3 - ERR-VAL-004 - invalid search or filter (4)
  AUTH --> API : invalid filter names
  API --> UI : ERR-VAL-004
  UI --> Admin : correct criteria; resubmit at 2
end
break E4 - ERR-VAL-005 - invalid pagination (4)
  AUTH --> API : invalid pagination
  API --> UI : ERR-VAL-005
  UI --> Admin : reset or correct pagination; resubmit at 2
end
break E5 - ERR-LIMIT-001 - rate limit exceeded (3 or 5)
  API --> UI : ERR-LIMIT-001 and retry time if available
  UI --> Admin : wait before retrying
end
break E6 - ERR-SYS-001 - user list query failed (5 or 7)
  AUTH --> API : ERR-SYS-001 with request_id
  API --> UI : general load failure
  UI --> Admin : notify list could not be loaded
end
AUTH --> API : 7 summary page
API --> UI : 7 users and total count
UI --> Admin : 8 display matching summaries
opt A3 - change page or page size (8)
  Admin -> UI : select another page
  UI -> API : request updated pagination
  API -> AUTH : validate and query next page
  AUTH -> DB : retrieve requested page
  DB --> AUTH : matching page
  AUTH --> API : updated results
  API --> UI : page response
  UI --> Admin : update list
end
opt A4 - no users match (5)
  UI --> Admin : display empty page and criteria; no results
end
note over UI, API : E7 - ERR-NET-001: show load failure, do not present stale data as current, and allow retry.
note over AUTH, DB : Return only account summary fields; never return password hashes or tokens.
@enduml
```

## 4. Notes

- Search/filter and pagination parameters are validated before querying.
- Main flow is read-only; account status changes use UC-AD-U-03.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
