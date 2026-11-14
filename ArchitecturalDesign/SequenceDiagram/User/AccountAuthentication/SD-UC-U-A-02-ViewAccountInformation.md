# Sequence Diagram - UC-U-A-02 - View Account Information

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-U-A-02 |
| Use Case | UC-U-A-02 - View Account Information |
| Use Case Specification | [UC-U-A-02-ViewAccountInformation.md](../../../../RequirementAnalysis/UCSpec/User/AccountAuthentication/UC-U-A-02-ViewAccountInformation.md) |
| Primary Actor(s) | User, Administrator (through inheritance) |
| Related Requirements | FR-AUTH-04, FR-AUTH-05, NFR-SEC-03, NFR-SEC-10 |
| Scope | Main flow, A1, E1-E4 |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

This diagram covers viewing the authenticated user's own account information: token validation, principal resolution, the account query, removal of sensitive internal fields, and the response.

The operation is read-only and scoped to the authenticated account. A1 (reload) reuses the same request path. Passwords, password hashes, tokens, and internal security fields never appear in the response.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | S1-S9 | Entire diagram; S9 end state is stated in the final note |
| A1 | - | Reuses S2-S8 with the same request; no new interaction |
| E1 | E1 | `alt E1` at S3 |
| E2 | E2 | `break E2` at S4-S5 |
| E3 | E3 | `break E3` at S3-S7 |
| E4 | - | Client-only note at UI during the request/response |

## 3. Diagram

```plantuml
@startuml SD-UC-U-A-02
title UC-U-A-02 - View Account Information\nAuthenticated account profile read
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

User -> UI : S1 open account information page
UI -> API : S2 GET /api/v1/account {Authorization: <jwt>}
note right of UI
  E4 - ERR-NET-001 - network error:
  no response; UI cannot confirm whether the request
  reached the system. User may retry when the network
  is restored. Client-only; use case ends if needed.
end note
API -> AUTH : S3 validate access token and load principal
AUTH -> AUTH : S3 verify JWT signature, expiry, and password_changed_at
alt E1 - ERR-AUTH-003 - missing, invalid, or expired access token (S3)
  AUTH --> API : ERR-AUTH-003
  API --> UI : 401 {code: ERR-AUTH-003}
  note right of API : No account information is returned.
  UI -> UI : E1 clear stored authentication information
  UI -> UI : E1 navigate to login page
  note over User, UI : Use case ends.
else token valid
  AUTH --> API : principal {user_id, role}
  API -> AUTH : S4 getAccount(user_id)
  AUTH -> DB : S5 SELECT account WHERE id
  DB --> AUTH : account row or none
  break E2 - ERR-ACC-001 - account not available (S4-S5)
    AUTH --> API : ERR-ACC-001
    API --> UI : 403 {code: ERR-ACC-001}
    note right of AUTH : No account information is returned.\nFurther requests with this token are rejected if the account is disabled.
    UI --> User : E2 show account-unavailable message
    note over User, UI : User is asked to contact an Administrator. Use case ends.
  end
  AUTH -> AUTH : S6 discard password hash and internal security fields
  break E3 - ERR-SYS-001 - internal system error (S3-S7)
    note right of AUTH : Token validation, principal resolution, or account query failed.\nNo partial account information is returned.
    API --> UI : 500 {code: ERR-SYS-001, request_id}
    UI --> User : E3 notify operation cannot be completed
    note over User, UI : User may retry later. Use case ends.
  end
  AUTH --> API : account {user_id, username, email, display_name, bio, created_at}
  API --> UI : 200 {account}
  UI --> User : S8 display account information
  note over User, UI : S9 use case ends.
end
@enduml
```

## 4. Notes

- The response contains only the account owner's profile fields; it never includes the password hash, access token, or internal security fields.
- The backend determines the account from the token; the client does not supply an account identifier.
- The operation is read-only.
- A1 reloads the same data through the same path.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
