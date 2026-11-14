# Sequence Diagram - UC-U-A-01 - Log Out

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-U-A-01 |
| Use Case | UC-U-A-01 - Log Out |
| Use Case Specification | [UC-U-A-01-LogOut.md](../../../../RequirementAnalysis/UCSpec/User/AccountAuthentication/UC-U-A-01-LogOut.md) |
| Primary Actor(s) | User, Administrator (through inheritance) |
| Related Requirements | FR-AUTH-03, NFR-SEC-02, NFR-SEC-10 |
| Scope | Main flow, A1-A3, E1-E2 |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

This diagram covers client-side logout. Arbiter uses stateless JWTs, so logout performs no backend request and terminates no server-side session.

A2 (token already expired) and A3 (multiple browsers) reuse the same client-side clearing path and are dispositioned below. E2 (network error while loading the home page) is client-only and is shown as a note. The discarded token remains technically valid until expiry.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | S1-S8 | Entire diagram; S8 end state is stated in the final note |
| A1 | A1 | `alt A1` at S2 |
| A2 | - | Token already expired; same client-side clearing path; no new interaction |
| A3 | - | Multiple browsers; only the current browser's token is removed; no new interaction |
| E1 | E1 | Nested `alt E1` at S4 |
| E2 | - | Client-only note at UI; logout remains effective |

## 3. Diagram

```plantuml
@startuml SD-UC-U-A-01
title UC-U-A-01 - Log Out\nClient-side session termination
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

User -> UI : S1 select Log Out
UI --> User : S2 show confirmation
alt A1 - User Cancels Logout (S2)
  User -> UI : A1 dismiss confirmation
  note right of UI : Keep authentication state. Use case ends.
else User confirms
  User -> UI : S3 confirm logout
  alt E1 - ERR-SYS-007 - browser storage unavailable (S4)
    UI -> UI : S4 attempt to clear token and cached account
    note right of UI : Reset in-memory authentication state anyway.
    UI --> User : E1 notify: close browser or clear site data manually
    UI -> UI : E1 navigate to login page
    note over User, UI : Use case ends. The token may remain in storage until expiry.
  else storage available
    UI -> UI : S4 remove token and cached account
    UI -> UI : S5 reset in-memory authentication state
    UI -> UI : S6 navigate to home
    note right of UI
      E2 - ERR-NET-001 - network error:
      if the home page cannot load, logout is still
      effective. UI displays the network error and
      User may retry loading the page later.
    end note
    UI -> UI : S7 show Guest navigation
    note over User, UI : S8 use case ends. No backend request is made.
  end
end
@enduml
```

## 4. Notes

- Logout is idempotent and does not contact the backend.
- The UI clears both the access token and cached account information.
- The discarded token remains technically valid until expiry; password change and account disabling are the revocation mechanisms.
- No password, token, or account data appears in the diagram.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
