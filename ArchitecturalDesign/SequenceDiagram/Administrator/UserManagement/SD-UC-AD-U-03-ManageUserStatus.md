# Sequence Diagram - UC-AD-U-03 - Manage User Status

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-AD-U-03 |
| Use Case | UC-AD-U-03 - Manage User Status |
| Use Case Specification | [UC-AD-U-03-ManageUserStatus.md](../../../../RequirementAnalysis/UCSpec/Administrator/UserManagement/UC-AD-U-03-ManageUserStatus.md) |
| Primary Actor(s) | Administrator |
| Related Requirements | FR-ADMIN-01, FR-ADMIN-03, FR-AUTH-09, NFR-SEC-03, NFR-REL-08 |
| Scope | Main Flow 1-21, A1-A4, E1-E6; E7-E8 in SD-UC-AD-U-03-X |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

Lock or unlock another account using optimistic concurrency; preserve its Submissions, results, and statistics.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | 1-21 | Entire diagram |
| A1 | A1 | `alt A1`; change ACTIVE to LOCKED |
| A2 | A2 | `alt A2`; change LOCKED to ACTIVE |
| A3 | A3 | No-op if already in requested state |
| A4 | A4 | UI-only cancellation; no update request |
| E1 | E1 | `break E1` at token validation |
| E2 | E2 | `break E2` at admin-role validation |
| E3 | E3 | `break E3` at User lookup |
| E4 | E4 | `break E4` at status-version comparison |
| E5 | E5 | `break E5` at requested-action validation |
| E6 | E6 | `break E6` at self-account check |
| E7-E8 | - | [SD-UC-AD-U-03-X](SD-UC-AD-U-03-ManageUserStatus-Exceptions.md) |

## 3. Diagram

```plantuml
@startuml SD-UC-AD-U-03
title UC-AD-U-03 - Manage User Status\nVersioned lock/unlock of another account
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

Admin -> UI : 1-2 select User
UI -> API : 3 request account status and actions
API -> AUTH : 4 authenticate and authorize admin
AUTH --> API : principal
API -> AUTH : 5-7 read User status and version
AUTH -> DB : SELECT account status/version
DB --> AUTH : account data or none
AUTH --> API : current status, version, actions
API --> UI : 7 status, version, actions
UI --> Admin : display status
alt A1 - lock ACTIVE account
  Admin -> UI : 8 select Lock Account
else A2 - unlock LOCKED account
  Admin -> UI : 8 select Unlock Account
end
UI -> API : 9 validate requested status action
API -> AUTH : check action against current status
AUTH --> API : allowed, already in target state, or invalid
break E5 - ERR-VAL-001 - invalid status action (9)
  AUTH --> API : ERR-VAL-001
  API --> UI : invalid action
  note right of UI : Ask Administrator to select LOCK or UNLOCK; continue at 8.
end
alt A3 - account already in target state (9)
  API --> UI : current status; no update
  UI --> Admin : report no change; use case ends
else action changes status
  Admin -> UI : 10-11 confirm action
  UI -> API : 12 change status with loaded version
  API -> AUTH : 13 authenticate and authorize admin
  AUTH --> API : principal
  API -> AUTH : 14-16 recheck account, self-target, and version
  AUTH -> DB : read current account and compare version
  DB --> AUTH : current state/version
break E1 - ERR-AUTH-003 - missing, invalid, or expired token (4 or 13)
  API --> UI : reject; clear authentication
  note right of UI : Clear authentication and navigate Administrator to login.
end
break E2 - ERR-PERM-002 - insufficient privileges (4 or 13)
  API --> UI : ERR-PERM-002
  note right of UI : Explain that Administrator rights are required.
end
break E3 - ERR-RES-004 - User not found (5 or 14)
  AUTH --> API : ERR-RES-004
  API --> UI : not found
  note right of UI : Return Administrator to the User List; use case ends.
end
break E4 - ERR-CONFLICT-010 - concurrent User status change (16)
  AUTH --> API : ERR-CONFLICT-010
  API --> UI : stale status/version
  note right of UI : Reload latest status before retry; use case ends unless reloaded.
end
break E6 - ERR-CONFLICT-011 - Administrator targets own account (15)
  AUTH --> API : ERR-CONFLICT-011
  API --> UI : reject self status change
  note right of UI : Ask Administrator to use another Administrator account.
end
  group Transaction (atomic)
    AUTH -> DB : 17-18 update status, changed_at, acting_admin_id
    DB --> AUTH : updated status
  end
  AUTH --> API : 19 updated status
  API --> UI : 19-20 success
  UI --> Admin : 20 refresh account status and confirm
end
note over UI, API : E7-E8 are covered by the exception supplement. A4 cancellation is UI-only.
note over AUTH, DB : A locked account is denied on its next authenticated request; history and results remain.
@enduml
```

## 4. Notes

- Administrators cannot lock or unlock their own account through this use case.
- Status, timestamp, and acting Administrator are committed together; account activity data is untouched.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
