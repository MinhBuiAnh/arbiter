# Sequence Diagram - UC-U-A-04 - Change Password

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-U-A-04 |
| Use Case | UC-U-A-04 - Change Password |
| Use Case Specification | [UC-U-A-04-ChangePassword.md](../../../../RequirementAnalysis/UCSpec/User/AccountAuthentication/UC-U-A-04-ChangePassword.md) |
| Primary Actor(s) | User |
| Related Requirements | FR-AUTH-04, FR-AUTH-08, FR-AUTH-09, FR-AUTH-12, NFR-SEC-01, NFR-SEC-02, NFR-SEC-10, NFR-SEC-11 |
| Scope | Main flow, A1, E2-E4, E6; E1, E5, E7, E8 in `SD-UC-U-A-04-X` |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

This diagram covers changing the authenticated user's password: current-password verification, new-password policy checks, Argon2id hashing, the atomic hash and `password_changed_at` update, and client-side token clearing.

A1 (cancel) is UI-only. The password hash and password-change timestamp are updated in one transaction, and every previously issued token becomes invalid on its next use.

E1 (invalid token), E5 (account not available), E7 (network error), and E8 (rate limit) are covered in the [exception supplement](SD-UC-U-A-04-ChangePassword-Exceptions.md) so that this primary diagram stays within the exception-flow threshold.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | S1-S13 | Entire diagram; S13 end state is stated in the final note |
| A1 | - | UI-only cancel at S3; entered values are discarded |
| E1 | E1 | Covered in [SD-UC-U-A-04-X](SD-UC-U-A-04-ChangePassword-Exceptions.md) |
| E2 | E2 | `alt E2` at S5 |
| E3 | E3 | `alt E3` at S6 |
| E4 | E4 | `alt E4` at S6 |
| E5 | E5 | Covered in [SD-UC-U-A-04-X](SD-UC-U-A-04-ChangePassword-Exceptions.md) |
| E6 | E6 | `break E6` at S5-S8 |
| E7 | - | Covered in [SD-UC-U-A-04-X](SD-UC-U-A-04-ChangePassword-Exceptions.md) as a client-only note |
| E8 | E8 | Covered in [SD-UC-U-A-04-X](SD-UC-U-A-04-ChangePassword-Exceptions.md) |

## 3. Diagram

```plantuml
@startuml SD-UC-U-A-04
title UC-U-A-04 - Change Password\nArgon2id password replacement and token invalidation
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

User -> UI : S1 open Change Password
UI --> User : S2 display current, new, and confirm password fields
User -> UI : S3 enter values and submit
UI -> API : S3 POST /api/v1/account/password {current_password, new_password, confirm_password}
note right of UI : E1, E5, E7, and E8 are covered in SD-UC-U-A-04-X.
API -> AUTH : S4 validate access token and identify account
AUTH -> AUTH : S4 verify JWT signature, expiry, and password_changed_at
AUTH --> API : principal {user_id, role}
API -> AUTH : S5-S8 changePassword(user_id, current_password, new_password, confirm_password)
AUTH -> DB : S5 SELECT password_hash WHERE account_id
DB --> AUTH : credential record
AUTH -> AUTH : S5 verify current password against stored hash
alt E2 - ERR-AUTH-004 - incorrect current password (S5)
  AUTH --> API : ERR-AUTH-004
  API --> UI : 400 {code: ERR-AUTH-004}
  note right of AUTH : No password data is changed.
  UI --> User : E2 show error at Current Password field
  note over User, UI : User may retry within the configured attempt limit; continues at S3 if attempts remain, otherwise ends.
else current password correct
  AUTH -> AUTH : S6 validate new password policy, difference, and confirmation
  alt E3 - ERR-VAL-011 - invalid new password (S6)
    AUTH --> API : ERR-VAL-011 {invalid_fields}
    API --> UI : 400 {code: ERR-VAL-011, details: invalid_fields}
    note right of AUTH : No password data is changed.
    UI --> User : E3 show corresponding field errors
    note over User, UI : User edits and resubmits; continues at S4.
  else E4 - ERR-VAL-010 - new password matches current password (S6)
    AUTH --> API : ERR-VAL-010
    API --> UI : 400 {code: ERR-VAL-010}
    note right of AUTH : No password data is changed.
    UI --> User : E4 ask User to choose a different password
    note over User, UI : User edits and resubmits; continues at S4.
  else new password valid
    AUTH -> AUTH : S7 hash new password with Argon2id
    AUTH -> DB : S8 UPDATE password_hash and password_changed_at (tx)
    break E6 - ERR-SYS-001 - internal system error (S5-S8)
      note right of AUTH : Transaction rolled back; neither the hash nor password_changed_at is partially updated.
      AUTH --> API : ERR-SYS-001 {request_id}
      API --> UI : 500 {code: ERR-SYS-001, request_id}
      UI --> User : E6 notify password could not be changed
      note over User, UI : User may retry later. Use case ends.
    end
    DB --> AUTH : updated
    AUTH --> API : 200 {password_changed: true}
    API --> UI : 200 {password_changed: true}
    UI -> UI : S10-S11 clear access token and cached account, navigate to login
    note over User, UI : S12 User logs in with the new password through UC-G-02. S13 use case ends.
  end
end
@enduml
```

## 4. Notes

- The current password is verified against the stored Argon2id hash; no password value or hash appears in the diagram.
- The new hash and `password_changed_at` update in one transaction; a failure leaves both unchanged.
- A successful change invalidates every previously issued token on its next use.
- The UI clears the stored token and cached account information after success.
- E1, E5, E7, and E8 are covered in `SD-UC-U-A-04-X`; rate limiting is enforced at `API` with no separate limiter lifeline.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. E1, E5, E7, and E8 are covered by `SD-UC-U-A-04-X`. |
