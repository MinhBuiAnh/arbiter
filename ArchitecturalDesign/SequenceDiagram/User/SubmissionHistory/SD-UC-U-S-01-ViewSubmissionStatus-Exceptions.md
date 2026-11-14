# Sequence Diagram - UC-U-S-01 - View Submission Status - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-U-S-01-X |
| Use Case | UC-U-S-01 - View Submission Status |
| Use Case Specification | [UC-U-S-01-ViewSubmissionStatus.md](../../../../RequirementAnalysis/UCSpec/User/SubmissionHistory/UC-U-S-01-ViewSubmissionStatus.md) |
| Primary Actor(s) | User, Administrator (through inheritance) |
| Related Requirements | FR-SUB-08, FR-SUB-11, NFR-PERF-04, NFR-PERF-06, NFR-SEC-04, NFR-USE-03 |
| Scope | E1-E2, E5, E7 |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

This supplement covers the access-guard, throttle, and network exceptions dispositioned out of the [primary diagram](SD-UC-U-S-01-ViewSubmissionStatus.md). The primary retains the main flow, A1-A3, E3, E4, and E6.

Each group is an independent terminal branch for the current polling request.

## 2. Scenario Coverage

Flows not listed in this table are covered by the primary diagram.

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| E1 | E1 | `group E1` at S3 |
| E2 | E2 | `group E2` at S4 |
| E5 | E5 | `group E5` at S2-S3 |
| E7 | E7 | `group E7`; client-only note at UI |

## 3. Diagram

```plantuml
@startuml SD-UC-U-S-01-X
title UC-U-S-01 - View Submission Status - Exceptions\nAuthentication, account, throttle, and network branches
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

ref over User, UI, API, AUTH, DB : UC-U-S-01 - View Submission Status

group E5 - ERR-LIMIT-001 - status polling rate limit exceeded (S2-S3)
  API -> API : E5 detect status-query rate limit exceeded
  API --> UI : 429 {code: ERR-LIMIT-001, retry_after}
  UI -> UI : E5 pause polling for retry_after; do not display as a status
  note right of API : Throttled before the AUTH call; no submission data is read or changed.
  note over User, UI : Current polling request ends. UI may resume after the indicated interval.
end
group E1 - ERR-AUTH-003 - missing, invalid, or expired access token (S3)
  API -> AUTH : E1 validate access token
  AUTH -> AUTH : E1 verify JWT signature, expiry, and password_changed_at
  AUTH --> API : ERR-AUTH-003
  API --> UI : 401 {code: ERR-AUTH-003}
  note right of AUTH : No submission data is returned or changed. The token value is not logged.
  UI -> UI : E1 clear authentication information and navigate to login
  note over User, UI : Use case ends.
end
group E2 - ERR-ACC-001 - account is disabled (S4)
  API -> AUTH : E2 check account status
  AUTH -> DB : E2 SELECT account status WHERE id
  DB --> AUTH : account status
  AUTH --> API : ERR-ACC-001
  API --> UI : 403 {code: ERR-ACC-001}
  note right of AUTH : No submission data is returned or changed.
  UI --> User : E2 explain the account cannot access authenticated features
  note over User, UI : Use case ends.
end
group E7 - ERR-NET-001 - network error (request/response)
  note over User, UI
    E7 - ERR-NET-001 - network error:
    no definitive response; UI does not treat the failure as a
    submission status and retries only according to its polling policy.
    Client-only; no submission data is changed.
  end note
  UI --> User : E7 notify status could not be refreshed
  note over User, UI : Current polling request ends.
end
@enduml
```

## 4. Notes

- E5 pauses polling for the server-provided `retry_after` and never renders the throttle as a submission status.
- E1 and E2 return no submission data and change no submission data.
- E7 is client-only. A failed poll is not a new status and does not change the last confirmed status.
- The supplement contains no token value, source code, hidden test data, or personal data beyond identifiers.
- E3, E4, and E6 remain in the primary diagram.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial exception supplement. |
