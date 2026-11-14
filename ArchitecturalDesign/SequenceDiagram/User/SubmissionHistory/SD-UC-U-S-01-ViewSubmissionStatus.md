# Sequence Diagram - UC-U-S-01 - View Submission Status

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-U-S-01 |
| Use Case | UC-U-S-01 - View Submission Status |
| Use Case Specification | [UC-U-S-01-ViewSubmissionStatus.md](../../../../RequirementAnalysis/UCSpec/User/SubmissionHistory/UC-U-S-01-ViewSubmissionStatus.md) |
| Primary Actor(s) | User, Administrator (through inheritance) |
| Related Requirements | FR-SUB-08, FR-SUB-11, NFR-PERF-04, NFR-PERF-06, NFR-SEC-04, NFR-USE-03 |
| Scope | Main flow, A1-A3, E3-E4, E6; E1-E2, E5, E7 in SD-UC-U-S-01-X |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

This diagram covers synchronous HTTP polling of one of the authenticated User's submissions: token and account validation, ownership check, status and timestamp retrieval, and the non-terminal, completed, and internal-error outcomes.

Polling starts with a one-second interval and backoff. It stops at `COMPLETED` or `INTERNAL_ERROR`. `INTERNAL_ERROR` is a terminal processing status and is never displayed as a verdict.

E3 (not found), E4 (not owned), and E6 (status unavailable) are retained in the primary diagram. The authentication, account, throttle, and network branches are in [SD-UC-U-S-01-X](SD-UC-U-S-01-ViewSubmissionStatus-Exceptions.md).

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | S1-S12 | Entire diagram; the loop and terminal states realize S9-S12 |
| A1 | A1 | `alt A1` at S7 |
| A2 | A2 | `alt A2` at S7 |
| A3 | A3 | `alt A3` at S7 |
| E1 | - | `SD-UC-U-S-01-X` `group E1` at S3 |
| E2 | - | `SD-UC-U-S-01-X` `group E2` at S4 |
| E3 | E3 | `break E3` at S5 |
| E4 | E4 | `break E4` at S6 |
| E5 | - | `SD-UC-U-S-01-X` `group E5` at S2-S3 |
| E6 | E6 | `break E6` at S5-S7 |
| E7 | - | `SD-UC-U-S-01-X` `group E7`; client-only note at UI |

## 3. Diagram

```plantuml
@startuml SD-UC-U-S-01
title UC-U-S-01 - View Submission Status\nSynchronous polling with ownership and terminal-state handling
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
participant "Submissions" as SUB #D5E8D4
database "PostgreSQL" as DB #FFF2CC

User -> UI : S1 open status view for a submission
loop while status is non-terminal and User is monitoring
  UI -> API : S2 GET /api/v1/submissions/{submission_id}/status
  API -> AUTH : S3-S4 authenticate and check account active
  AUTH -> AUTH : S3 verify JWT signature, expiry, and password_changed_at
  AUTH -> DB : S4 SELECT account status WHERE id
  DB --> AUTH : account status
  AUTH --> API : principal {user_id, role}
  API -> SUB : S5-S7 getStatus(submission_id, principal)
  SUB -> DB : S5 SELECT submission status, timestamps WHERE id
  DB --> SUB : submission row or none
  break E3 - ERR-RES-005 - submission not found (S5)
    SUB --> API : ERR-RES-005
    API --> UI : 404 {code: ERR-RES-005}
    note right of SUB : No submission data is returned or changed.
    UI --> User : E3 notify submission not found; offer submission history
    note over User, UI : Use case ends.
  end
  SUB -> SUB : S6 check submission owner = principal.user_id
  break E4 - ERR-PERM-003 - submission is not owned by user (S6)
    SUB --> API : ERR-PERM-003
    API --> UI : 403 {code: ERR-PERM-003}
    note right of SUB : Submission data is withheld; no data is changed.
    UI --> User : E4 notify submission is unavailable
    note over User, UI : Use case ends.
  end
  SUB -> SUB : S7 assemble status and timestamps
  break E6 - ERR-SYS-001 - status unavailable (S5 or S7)
    note right of SUB : No status is inferred; no submission data is changed.
    SUB --> API : ERR-SYS-001 {request_id}
    API --> UI : 500 {code: ERR-SYS-001, request_id}
    UI --> User : E6 notify status could not be loaded; offer safe retry
    note over User, UI : Current polling request ends.
  end
  SUB --> API : S7 status, timestamps
  API --> UI : 200 {status, timestamps}
  UI --> User : S8 display status and timestamps
  alt A1 - Submission Remains Queued or Is Being Judged (S7)
    UI -> UI : A1 display pending or in progress; do not present a verdict
    UI -> UI : S9 wait for polling interval with backoff
    note right of UI : 1 s initial interval. S10 continues at S2 while non-terminal and User is monitoring.
  else A2 - Submission Completes (S7)
    UI -> UI : A2 display judging complete; offer UC-U-S-02
    note right of UI : S11 stop polling. Use case ends.
  else A3 - Judging Ends With an Internal Error (S7)
    UI -> UI : A3 display system failure; do not present INTERNAL_ERROR as a verdict
    note right of UI : S11 stop polling. Use case ends.
  end
end
note over User, UI : S12 use case ends when the status is terminal or User leaves the status view.
@enduml
```

## 4. Notes

- The loop is client-initiated synchronous HTTP polling. No WebSocket, SSE, or server push is used.
- Every poll revalidates the token and account and rechecks ownership; a cached status is not treated as authoritative.
- `INTERNAL_ERROR` is a terminal status, not a verdict. It is displayed as a system failure.
- The response contains only the status and available timestamps. Hidden test data and source code are not part of this use case.
- An Administrator inherits the User behavior for their own submissions; inspecting another user's submission uses UC-AD-S-01.
- E1, E2, E5, and E7 are in `SD-UC-U-S-01-X`.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
