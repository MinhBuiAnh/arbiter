# Sequence Diagram - UC-U-P-03 - Submit Solution - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-U-P-03-X |
| Use Case | UC-U-P-03 - Submit Solution |
| Use Case Specification | [UC-U-P-03-SubmitSolution.md](../../../../RequirementAnalysis/UCSpec/User/ProblemPractice/UC-U-P-03-SubmitSolution.md) |
| Primary Actor(s) | User, Administrator (through inheritance) |
| Related Requirements | FR-SUB-04, FR-SUB-05, FR-JUDGE-01, FR-JUDGE-15, NFR-REL-02, NFR-SEC-03, NFR-SEC-10 |
| Scope | E1-E4, E7, E9 |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

This supplement covers the submission exceptions that are dispositioned out of the [primary diagram](SD-UC-U-P-03-SubmitSolution.md): authentication, account availability, problem lookup and visibility, throttling, and the client-only network branch.

The primary diagram retains the main flow, A1-A2, E5, E6, and E8.

Each group below is an independent terminal branch. `group` is used instead of nested `break` fragments so the supplement reads as an exception catalogue; every branch states its data outcome and end state.

## 2. Scenario Coverage

Flows not listed in this table are covered by the primary diagram.

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| E1 | E1 | `group E1` at S6 |
| E2 | E2 | `group E2` at S7 |
| E3 | E3 | `group E3` at S8 |
| E4 | E4 | `group E4` at S8 |
| E7 | E7 | `group E7` at S5-S9 |
| E9 | E9 | `group E9`; client-only note at UI |

## 3. Diagram

```plantuml
@startuml SD-UC-U-P-03-X
title UC-U-P-03 - Submit Solution - Exceptions\nAuthentication, account, problem, throttle, and network branches
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
participant "Problem Catalog" as PROB #D5E8D4
database "PostgreSQL" as DB #FFF2CC

ref over User, UI, API, AUTH, PROB, DB : UC-U-P-03 - Submit Solution

group E7 - ERR-LIMIT-001 - rate limit exceeded (S5-S9)
  API -> API : E7 detect submission throttle exceeded
  API --> UI : 429 {code: ERR-LIMIT-001, retry_after}
  UI --> User : E7 ask User to wait before submitting again
  note right of API : Throttled before the SUB call; no submission row and no outbox_event are created.
  note over User, UI : User may retry after the indicated time; continues at S3, otherwise use case ends.
end
group E1 - ERR-AUTH-003 - missing, invalid, or expired access token (S6)
  API -> AUTH : E1 validate access token
  AUTH -> AUTH : E1 verify JWT signature, expiry, and password_changed_at
  AUTH --> API : ERR-AUTH-003
  API --> UI : 401 {code: ERR-AUTH-003}
  note right of AUTH : No submission row is created. The token value is not logged.
  UI -> UI : E1 clear authentication information and navigate to login
  note over User, UI : Use case ends.
end
group E2 - ERR-ACC-001 - account not available (S7)
  API -> AUTH : E2 check account allowed to submit
  AUTH -> DB : E2 SELECT account status WHERE id
  DB --> AUTH : account row or none
  AUTH --> API : ERR-ACC-001
  API --> UI : 403 {code: ERR-ACC-001}
  note right of AUTH : No submission row is created.
  UI --> User : E2 notify account cannot submit; ask User to contact an Administrator
  note over User, UI : Use case ends.
end
group E3 - ERR-RES-001 - problem not found (S8)
  API -> PROB : E3 getProblemForSubmission(problem_id)
  PROB -> DB : E3 SELECT problem WHERE id
  DB --> PROB : no row
  PROB --> API : ERR-RES-001
  API --> UI : 404 {code: ERR-RES-001}
  note right of PROB : No submission row is created.
  UI --> User : E3 notify problem does not exist or is no longer available
  note over User, UI : User may return to the problem list. Use case ends.
end
group E4 - ERR-PERM-001 - problem not publicly accessible (S8)
  API -> PROB : E4 getProblemForSubmission(problem_id)
  PROB -> DB : E4 SELECT problem WHERE id
  DB --> PROB : problem row
  PROB -> PROB : E4 check ACTIVE and PUBLISHED
  PROB --> API : ERR-PERM-001
  API --> UI : 403 {code: ERR-PERM-001}
  note right of PROB : No submission row is created.
  UI --> User : E4 notify problem does not allow submissions
  note over User, UI : Use case ends.
end
group E9 - ERR-NET-001 - network error (request/response)
  note over User, UI
    E9 - ERR-NET-001 - network error:
    no response; UI cannot confirm whether the submission was created.
    User checks the submission history before retrying to avoid a
    duplicate submission. Client-only; use case ends if the outcome
    cannot be confirmed.
  end note
  UI --> User : E9 notify submission result is unknown
  note over User, UI : If history confirms no submission was created, User may repeat the action at S3.
end
@enduml
```

## 4. Notes

- E7 is enforced at `API` before the `SUB` call. The throttle is one submission per User per five seconds; the response includes `retry_after`.
- An Administrator inherits the User behavior; only `User` is drawn.
- E1, E2, E3, and E4 all leave no submission row and no outbox event. `AUTH` owns the token and account checks; `PROB` owns problem existence and visibility.
- E9 is client-side. The UI cannot determine whether the request reached the server, so the User checks submission history before retrying to avoid a duplicate.
- Hidden test data, source content, token values, and queue internals do not appear in this supplement.
- E5, E6, and E8 remain in the primary diagram.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial exception supplement. |
