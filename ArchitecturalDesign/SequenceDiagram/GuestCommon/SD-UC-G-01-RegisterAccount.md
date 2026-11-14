# Sequence Diagram - UC-G-01 - Register Account

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-G-01 |
| Use Case | UC-G-01 - Register Account |
| Use Case Specification | [UC-G-01-RegisterAccount.md](../../../RequirementAnalysis/UCSpec/GuestCommon/UC-G-01-RegisterAccount.md) |
| Primary Actor(s) | Guest |
| Related Requirements | FR-AUTH-01, FR-AUTH-11, FR-AUTH-12, NFR-SEC-01 |
| Scope | Main flow, A1, E1-E5 |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

This diagram covers guest self-registration: form entry, server-side validation, identifier uniqueness, Argon2id password hashing, account persistence, and the success response.

The `API` lifeline enforces transport concerns and rate limiting. The `AUTH` module owns the registration policy, uniqueness check, hashing, and the account insert. Registration is synchronous: it creates no outbox event and does not use the judge queue.

A1 is a pure UI navigation at S2 and is dispositioned below. E4 is a client-only network condition and is shown as a UI note. E5 is a terminal early exit at the API boundary. v1 requires no email verification, so none is drawn.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | S1-S12 | Entire diagram; S12 end state is stated in the final note |
| A1 | - | UI-only at S2; Guest selects the login link; no server interaction |
| E1 | E1 | `alt E1` at S5 |
| E2 | E2 | `alt E2` at S6 |
| E3 | E3 | `alt E3` at S7-S8 |
| E4 | - | Client-only note at UI during the request/response |
| E5 | E5 | `break E5` at S4 |

## 3. Diagram

```plantuml
@startuml SD-UC-G-01
title UC-G-01 - Register Account\nGuest self-registration with validation, uniqueness check, and Argon2id hashing
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

Guest -> UI : S1 open registration page
UI --> Guest : S2 display registration form
Guest -> UI : S3 enter username, email, password, confirm password
Guest -> UI : S4 submit registration form
UI -> API : S4 POST /api/v1/auth/register {username, email, <password>, <confirm_password>}
note right of UI
  E4 - ERR-NET-001 - network error:
  if the request or response is lost, UI cannot
  confirm the outcome. It checks registration state
  or uses an idempotency key before retrying.
  Client-only; use case ends if the outcome is unknown.
end note
API -> API : S4 check registration rate limit
break E5 - ERR-LIMIT-001 - rate limit exceeded (S4)
  API --> UI : 429 {code: ERR-LIMIT-001, retry_after}
  UI --> Guest : E5 ask Guest to wait before retrying
  note right of API : Throttled before the AUTH call; no account is created.
  note over Guest, UI : Use case ends.
end
API -> AUTH : S5 registerAccount(username, email, <password>, <confirm_password>)
AUTH -> AUTH : S5 validate required fields, email format, username convention, password policy, confirmation match
alt E1 - ERR-VAL-001 - invalid registration data (S5)
  AUTH --> API : ERR-VAL-001 {invalid_fields}
  API --> UI : 400 {code: ERR-VAL-001, details: invalid_fields}
  note right of AUTH : No account row created; password is never logged.
  UI --> Guest : E1 show field-level errors
  Guest -> UI : E1 edit data and resubmit
  note over Guest, UI : Continues at S5.
else input valid
  AUTH -> DB : S6 SELECT account WHERE username OR email
  DB --> AUTH : matching account identifiers
  alt E2 - ERR-ACC-002 - account identifier already exists (S6)
    AUTH --> API : ERR-ACC-002 {conflicting_identifier}
    API --> UI : 409 {code: ERR-ACC-002, details: conflicting_identifier}
    note right of AUTH : No duplicate account row created; password is never logged.
    UI --> Guest : E2 ask Guest to choose a different username or email
    Guest -> UI : E2 edit data and resubmit
    note over Guest, UI : Continues at S5.
  else identifiers available
    AUTH -> AUTH : S7 hash password with Argon2id
    AUTH -> DB : S8 INSERT account (tx)
    alt E3 - ERR-SYS-001 - internal system error (S7 or S8)
      AUTH -> AUTH : E3 roll back transaction if open
      note right of AUTH : Hashing or persistence failed.\nNo account row or partial record is committed.
      AUTH --> API : ERR-SYS-001 {request_id}
      API --> UI : 500 {code: ERR-SYS-001, request_id}
      UI --> Guest : E3 notify operation cannot be completed
      note over Guest, UI : Guest may retry later. Use case ends.
    else account persisted
      DB --> AUTH : account_id
      AUTH --> API : 201 {account_id, status=ACTIVE}
      API --> UI : 201 {account_id, status=ACTIVE}
      UI --> Guest : S10 show registration success
      Guest -> UI : S11 select Go to Log In
      UI -> UI : S11 navigate to login page (UC-G-02)
      note over Guest, UI : S12 use case ends.
    end
  end
end
@enduml
```

## 4. Notes

- The password is hashed with Argon2id inside `AUTH`; the plaintext password and the hash never appear in the diagram, logs, or error responses.
- Registration is a synchronous write. No outbox event and no queue message are created, so `OUTBOX` and `QUEUE` are correctly absent.
- Rate limiting is enforced at `API`; there is no separate rate-limit lifeline in the v1 module decomposition.
- Disclosing that a username or email is already in use is the accepted v1 trade-off recorded in FR-AUTH-11.
- A1 and E4 are intentionally not drawn as message sequences; their dispositions are recorded in the coverage table.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
