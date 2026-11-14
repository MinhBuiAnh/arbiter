# Sequence Diagram - UC-AD-U-02 - View User Details

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-AD-U-02 |
| Use case | UC-AD-U-02 - View User Details |
| Use Case Specification | [UC-AD-U-02-ViewUserDetails.md](../../../../RequirementAnalysis/UCSpec/Administrator/UserManagement/UC-AD-U-02-ViewUserDetails.md) |
| Primary Actor(s) | Administrator |
| Related Requirements | FR-ADMIN-01, FR-ADMIN-07, FR-PROG-01, NFR-SEC-03, NFR-SEC-10 |
| Scope | Main Flow 1-9, A1-A2, E1-E5 |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

Read permitted profile and activity details for one account; source code and secrets are excluded.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | 1-9 | Entire diagram |
| A1 | A1 | User selected from UC-AD-U-01 search results |
| A2 | A2 | Read a consistent latest committed account snapshot |
| E1 | E1 | `break E1` at token validation |
| E2 | E2 | `break E2` at admin-role validation |
| E3 | E3 | `break E3` at User lookup |
| E4 | E4 | `break E4` at account/activity assembly |
| E5 | E5 | Client-only network outcome; do not show stale data as current |

## 3. Diagram

```plantuml
@startuml SD-UC-AD-U-02
title UC-AD-U-02 - View User Details\nRead-only profile and activity summary
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
participant "Progress & Leaderboard" as STATS #D5E8D4
database "PostgreSQL" as DB #FFF2CC

Admin -> UI : 1-2 open User Management and select User ID
UI -> API : 3 GET account details
API -> AUTH : 4 authenticate and authorize admin
AUTH --> API : principal
API -> AUTH : 5-6 retrieve account by User ID
AUTH -> DB : read committed account profile/status
DB --> AUTH : account snapshot or none
break E1 - ERR-AUTH-003 - missing, invalid, or expired token (4)
  API --> UI : reject; clear authentication
  UI --> Admin : navigate to login
end
break E2 - ERR-PERM-002 - insufficient privileges (4)
  API --> UI : ERR-PERM-002
  UI --> Admin : explain admin rights are required
end
break E3 - ERR-RES-004 - User not found (5 or 6)
  AUTH --> API : ERR-RES-004
  API --> UI : not found
  UI --> Admin : return to User List
end
AUTH --> API : permitted profile fields
API -> STATS : 7 request activity summary for User ID
STATS -> DB : read-only reporting query for progress summary
DB --> STATS : committed activity aggregates
STATS --> API : attempted/solved and recent activity summary
break E4 - ERR-SYS-001 - account details unavailable (5 or 7)
  AUTH --> API : ERR-SYS-001 with request_id
  API --> UI : general load failure
  UI --> Admin : notify details could not be loaded
end
API --> UI : 7 account and activity details
UI --> Admin : 8 display read-only details
opt A1 - selected from search results
  note over Admin, UI : Entry path is UC-AD-U-01; request remains the same.
end
opt A2 - account changes during read
  note over AUTH, DB : Return one latest committed snapshot; do not mix versions.
end
note over AUTH, STATS : Exclude password hashes, tokens, unnecessary personal data, and Submission source code.
note over UI, API : E5 - ERR-NET-001: do not show stale data as current; allow retry.
@enduml
```

## 4. Notes

- Account details are read-only. Submission source code is available only through UC-AD-S-01.
- Activity summary follows the reporting measures in FR-PROG-01.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
