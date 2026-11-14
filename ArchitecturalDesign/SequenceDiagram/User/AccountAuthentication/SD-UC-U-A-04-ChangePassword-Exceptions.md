# Sequence Diagram - UC-U-A-04 - Change Password - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-U-A-04-X |
| Use Case | UC-U-A-04 - Change Password |
| Use Case Specification | [UC-U-A-04-ChangePassword.md](../../../../RequirementAnalysis/UCSpec/User/AccountAuthentication/UC-U-A-04-ChangePassword.md) |
| Primary Actor(s) | User |
| Related Requirements | FR-AUTH-04, FR-AUTH-08, FR-AUTH-09, FR-AUTH-12, NFR-SEC-01, NFR-SEC-02, NFR-SEC-10, NFR-SEC-11 |
| Scope | E1, E5, E7, E8 |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

This supplement covers the authentication, account-availability, network, and rate-limit exceptions that are dispositioned out of the [primary diagram](SD-UC-U-A-04-ChangePassword.md). The primary diagram retains the main flow, A1, E2-E4, and E6.

The supplement starts its own numbering at 1 and begins with a `ref` to the use case it continues.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| E1 | E1 | `group E1` |
| E5 | E5 | `group E5` |
| E7 | E7 | `group E7`; client-only note at UI |
| E8 | E8 | `group E8` |

## 3. Diagram

```plantuml
@startuml SD-UC-U-A-04-X
title UC-U-A-04 - Change Password - Exceptions\nAuthentication, account, network, and rate-limit branches
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

actor "User" as User #F5F5F5
participant "React SPA" as UI #DAE8FC
participant "HTTP API" as API #D5E8D4
participant "Account & Auth" as AUTH #D5E8D4
database "PostgreSQL" as DB #FFF2CC

ref over User, UI, API, AUTH, DB : UC-U-A-04 - Change Password

group E8 - ERR-LIMIT-001 - rate limit exceeded (S3)
  API -> API : E8 detect rate limit exceeded
  API --> UI : 429 {code: ERR-LIMIT-001, retry_after}
  UI --> User : E8 ask User to wait before retrying
  note right of API : Throttled before the AUTH call; no password data is changed.
  note over User, UI : Use case ends.
end
group E1 - ERR-AUTH-003 - missing, invalid, or expired access token (S4)
  API -> AUTH : E1 validate access token
  AUTH -> AUTH : E1 verify JWT signature, expiry, and password_changed_at
  AUTH --> API : ERR-AUTH-003
  API --> UI : 401 {code: ERR-AUTH-003}
  note right of AUTH : No password data is changed.
  UI -> UI : E1 clear authentication information and navigate to login
  note over User, UI : Use case ends.
end
group E5 - ERR-ACC-001 - account not available (S4-S5)
  API -> AUTH : E5 determine account
  AUTH -> DB : E5 SELECT account WHERE id
  DB --> AUTH : account row or none
  AUTH --> API : ERR-ACC-001
  API --> UI : 403 {code: ERR-ACC-001}
  note right of AUTH : No password data is changed.
  UI --> User : E5 notify operation cannot be completed
  note over User, UI : User is asked to contact an Administrator. Use case ends.
end
group E7 - ERR-NET-001 - network error (request/response)
  note over User, UI
    E7 - ERR-NET-001 - network error:
    no response; UI cannot confirm whether the password
    was changed. User can attempt to log in with the new
    password to determine the outcome. Client-only.
  end note
  note over User, UI : Use case ends if the outcome remains unknown.
end
@enduml
```

## 4. Notes

- This supplement exists because the primary diagram would otherwise carry more than six exception flows.
- E2 (incorrect current password), E3 (invalid new password), E4 (new password equals current password), and E6 (internal error) remain in the primary diagram.
- The supplement contains no password value, password hash, or token value.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial exception supplement. |
