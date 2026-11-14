# Sequence Diagram - UC-G-02 - Log In

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-G-02 |
| Use Case | UC-G-02 - Log In |
| Use Case Specification | [UC-G-02-Login.md](../../../RequirementAnalysis/UCSpec/GuestCommon/UC-G-02-Login.md) |
| Primary Actor(s) | Guest |
| Related Requirements | FR-AUTH-02, FR-AUTH-04, FR-AUTH-09, FR-AUTH-10, NFR-SEC-01, NFR-SEC-02, NFR-SEC-10 |
| Scope | Main flow, A1-A2, E1-E6 |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

This diagram covers credential login: input validation, account retrieval, password verification, account-status check, JWT issuance, and client-side token storage.

A1 (redirect to the previously requested page) is a client-side target choice at S12. A2 (choose registration) is UI navigation at S2. Neither adds a server interaction. Login is stateless: no server-side session is created, and no outbox event or queue message is involved.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | S1-S13 | Entire diagram; S13 end state is stated in the final note |
| A1 | - | UI-only; S12 selects the previously requested page or the home page |
| A2 | - | UI-only navigation to UC-G-01 at S2; no server interaction |
| E1 | E1 | `alt E1` at S5 |
| E2 | E2 | `alt E2` at S6-S7 |
| E3 | E3 | `break E3` at S8 |
| E4 | E4 | `break E4` at S6-S9 |
| E5 | - | Client-only note at UI during the request/response |
| E6 | E6 | `break E6` at S4 |

## 3. Diagram

```plantuml
@startuml SD-UC-G-02
title UC-G-02 - Log In\nCredential authentication and JWT issuance
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

actor "Guest" as Guest #F5F5F5
participant "React SPA" as UI #DAE8FC
participant "HTTP API" as API #D5E8D4
participant "Account & Auth" as AUTH #D5E8D4
database "PostgreSQL" as DB #FFF2CC

Guest -> UI : S1 open login page
UI --> Guest : S2 display login form
Guest -> UI : S3 enter username or email and password
Guest -> UI : S4 submit login form
UI -> API : S4 POST /api/v1/auth/login {identifier, <password>}
note right of UI
  E5 - ERR-NET-001 - network error:
  no response; UI cannot confirm whether login succeeded.
  It must not assume the account is logged in; it checks
  the authentication state before retrying. Client-only.
end note
API -> API : S4 check login rate limit
break E6 - ERR-LIMIT-001 - rate limit exceeded (S4)
  API --> UI : 429 {code: ERR-LIMIT-001, retry_after}
  UI --> Guest : E6 ask Guest to wait before retrying
  note right of API : Throttled before the AUTH call; no token is issued.
  note over Guest, UI : Use case ends.
end
API -> API : S5 validate input sufficiency and format
alt E1 - ERR-VAL-003 - invalid login input (S5)
  API --> UI : 400 {code: ERR-VAL-003, details: invalid_fields}
  note right of API : No token is issued.
  UI --> Guest : E1 show fields to provide or correct
  Guest -> UI : E1 edit data and resubmit
  note over Guest, UI : Continues at S5.
else input valid
  API -> AUTH : login(identifier, <password>)
  AUTH -> DB : S6 SELECT account WHERE username OR email
  DB --> AUTH : account row or none
  AUTH -> AUTH : S7 verify password against stored hash
  alt E2 - ERR-AUTH-001 - invalid credentials (S6-S7)
    AUTH --> API : ERR-AUTH-001 (generic)
    API --> UI : 401 {code: ERR-AUTH-001}
    note right of AUTH : Account not found or password mismatch.\nNo token is issued; the response does not reveal whether the account exists.
    UI --> Guest : E2 show generic invalid-credentials message
    Guest -> UI : E2 re-enter and resubmit
    note over Guest, UI : Continues at S5.
  else credentials valid
    AUTH -> AUTH : S8 check account status and eligibility
    break E3 - ERR-ACC-001 - account not allowed to log in (S8)
      AUTH --> API : ERR-ACC-001
      API --> UI : 403 {code: ERR-ACC-001}
      UI --> Guest : E3 notify account cannot log in
      note over Guest, UI : Use case ends.
    end
    AUTH -> AUTH : S9 issue signed HS256 JWT {sub, role, iat, exp}, 24-hour lifetime
    break E4 - ERR-SYS-001 - internal system error (S6-S9)
      note right of AUTH : Retrieval, verification, or token creation failed.\nNo token is issued.
      AUTH --> API : ERR-SYS-001 {request_id}
      API --> UI : 500 {code: ERR-SYS-001, request_id}
      UI --> Guest : E4 notify operation cannot be completed
      note over Guest, UI : Guest may retry later. Use case ends.
    end
    AUTH --> API : 200 {access_token: <jwt>, user}
    API --> UI : 200 {access_token: <jwt>, user}
    UI -> UI : S11 store access token and user information
    UI --> Guest : S12 navigate to home or intended page
    note over Guest, UI : S13 use case ends. No server-side session is created.
  end
end
@enduml
```

## 4. Notes

- The password is verified against the Argon2id hash; neither the password nor the hash appears in the diagram.
- The JWT is shown as `<jwt>`; the signing secret never appears.
- A failed login returns a generic `ERR-AUTH-001`, so the response does not reveal whether an account exists.
- Disabled or otherwise ineligible accounts are rejected at S8 even when the password is valid.
- Logout is client-side only; the issued token remains valid until it expires.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
