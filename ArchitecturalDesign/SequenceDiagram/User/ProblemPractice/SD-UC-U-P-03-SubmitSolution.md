# Sequence Diagram - UC-U-P-03 - Submit Solution

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-U-P-03 |
| Use Case | UC-U-P-03 - Submit Solution |
| Use Case Specification | [UC-U-P-03-SubmitSolution.md](../../../../RequirementAnalysis/UCSpec/User/ProblemPractice/UC-U-P-03-SubmitSolution.md) |
| Primary Actor(s) | User, Administrator (through inheritance) |
| Related Requirements | FR-SUB-04, FR-SUB-05, FR-SUB-06, FR-SUB-07, FR-JUDGE-01, FR-JUDGE-02, FR-JUDGE-15, NFR-PERF-02, NFR-REL-02, NFR-SEC-03, NFR-SEC-10 |
| Scope | Main flow, A1-A2, E5-E6, E8; E1-E4, E7, E9 in SD-UC-U-P-03-X |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

This diagram covers the synchronous acceptance of a submission: authentication and account eligibility, problem eligibility, submission validation, the atomic submission plus outbox-event transaction, the `202 QUEUED` response, and the asynchronous publication phase.

The outbox event is inserted in the same transaction as the submission. Publication happens only after the commit and never rolls back a committed submission. The worker handoff is delegated to UC-SYS-J-01 - Process Submission; no compile or execution step is drawn here.

E5, E6, and E8 are retained in the primary diagram. The authentication, account, problem, throttle, and network branches are in [SD-UC-U-P-03-X](SD-UC-U-P-03-SubmitSolution-Exceptions.md).

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | S1-S16 | Entire diagram; S16 end state is stated in the final note |
| A1 | - | UI-only at S3; the session keeps the current source and language |
| A2 | - | UI-only at S15; navigate to UC-U-S-01 |
| E1 | - | `SD-UC-U-P-03-X` `group E1` at S6 |
| E2 | - | `SD-UC-U-P-03-X` `group E2` at S7 |
| E3 | - | `SD-UC-U-P-03-X` `group E3` at S8 |
| E4 | - | `SD-UC-U-P-03-X` `group E4` at S8 |
| E5 | E5 | `alt E5` at S9 |
| E6 | E6 | `else E6` at S9 |
| E7 | - | `SD-UC-U-P-03-X` `group E7` at S5-S9 |
| E8 | E8 | `break E8` at S10-S13 |
| E9 | - | `SD-UC-U-P-03-X` `group E9`; client-only note at UI |

## 3. Diagram

```plantuml
@startuml SD-UC-U-P-03
title UC-U-P-03 - Submit Solution\nAtomic submission and outbox write with asynchronous publication
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
participant "Submissions" as SUB #D5E8D4
database "PostgreSQL" as DB #FFF2CC
participant "Outbox Dispatcher" as OUTBOX #E1D5E7
queue "Redis Streams" as QUEUE #FFE6CC

User -> UI : S1 complete or update source code in UC-U-P-01
User -> UI : S2 confirm programming language in UC-U-P-02
User -> UI : S3 select Submit Solution
note over User, UI : A1 - User may return to the editor instead of submitting. UI-only; source and language remain in session.
UI -> UI : S4 retrieve current source, language, and problem_id
UI -> API : S5 POST /api/v1/submissions {problem_id, language, <source>}
API -> AUTH : S6-S7 authenticate and check account eligibility
AUTH -> AUTH : S6-S7 verify JWT, password_changed_at, and account status
AUTH -> DB : S7 SELECT account status WHERE id
DB --> AUTH : account status
AUTH --> API : principal {user_id, role}
API -> PROB : S8 getProblemForSubmission(problem_id)
PROB -> DB : S8 SELECT problem WHERE id
DB --> PROB : problem row
PROB -> PROB : S8 check ACTIVE and PUBLISHED
PROB --> API : problem allows submissions
API -> SUB : S9 createSubmission(user_id, problem_id, language, <source>)
SUB -> SUB : S9 validate source presence, 64 KiB limit, problem_id, and language
alt E5 - ERR-VAL-014 - invalid submission data (S9)
  SUB --> API : ERR-VAL-014 {invalid_fields}
  API --> UI : 400 {code: ERR-VAL-014, details: invalid_fields}
  note right of SUB : No submission row is created. Source code is not logged.
  UI --> User : E5 show field-level errors
  note over User, UI : User edits and resubmits; continues at S3, otherwise use case ends.
else E6 - ERR-VAL-013 - unsupported programming language (S9)
  SUB --> API : ERR-VAL-013 {supported_languages}
  API --> UI : 400 {code: ERR-VAL-013, details: supported_languages}
  note right of SUB : No submission row is created.
  UI --> User : E6 notify language is unsupported
  note over User, UI : User may select a supported language in UC-U-P-02; continues at S3, otherwise use case ends.
else submission data valid
  group Transaction (atomic)
    SUB -> DB : S10 INSERT submission (status=QUEUED)
    SUB -> DB : S11 INSERT outbox_event
    note right of DB : Both rows are committed together at S12 or not at all.
  end
  break E8 - ERR-SYS-001 - internal system error (S10-S13)
    SUB -> SUB : E8 roll back transaction
    note right of DB
      No submission row and no outbox_event committed.
      No problem or account data is modified.
      Source code is not logged and is not retained.
    end note
    SUB --> API : ERR-SYS-001 {request_id}
    API --> UI : 500 {code: ERR-SYS-001, request_id}
    UI --> User : E8 notify submission cannot be accepted
    note over User, UI : User may retry later. Use case ends.
  end
  note right of DB : S12 commit succeeded before any publish attempt.
  DB --> SUB : submission_id
  SUB --> API : S13 202 {submission_id, status=QUEUED}
  API --> UI : 202 {submission_id, status=QUEUED}
  UI --> User : S14 notify submission received
  note right of UI : Successful receipt does not mean the solution has been judged or accepted.
  note over User, UI : S15 UI offers navigation to UC-U-S-01. A2 - User may navigate there; UI-only.
  note over User, UI : S16 use case ends; judging continues asynchronously in UC-SYS-J-01.
  ... after commit, independently of the response ...
  group After commit (asynchronous)
    OUTBOX -> DB : SELECT unpublished outbox_events
    DB --> OUTBOX : outbox_event {submission_id}
    alt queue available
      OUTBOX ->> QUEUE : XADD judge:submissions {submission_id}
      QUEUE -->> OUTBOX : message_id
      OUTBOX -> DB : mark outbox_event published
    else queue unavailable
      note right of OUTBOX
        ERR-SYS-002 - publication retried with backoff.
        The submission remains QUEUED and the outbox_event
        remains unpublished. No failure is reported to User.
      end note
    end
  end
end
@enduml
```

## 4. Notes

- The submission row and its outbox event are one atomic unit. A commit failure leaves neither row persisted; a queue failure leaves both rows durable and only delays publication.
- An Administrator inherits the User behavior; only `User` is drawn.
- The `202` response is returned from the committed submission and does not wait for the queue. A successful response means `QUEUED`, not judged or accepted.
- `OUTBOX` reads the committed event from `DB` and publishes to the `judge:submissions` stream. The dispatcher runs inside the API process but is drawn separately because publication is a distinct asynchronous phase.
- If `QUEUE` is unavailable, the dispatcher retries with backoff, the submission stays `QUEUED`, and no failure is shown to the User. `ERR-SYS-002` is internal and does not roll back the submission.
- The `SUB -> DB` transaction is the only write in the synchronous path. Worker compilation, execution, and test-case evaluation belong to UC-SYS-J-01.
- The `After commit (asynchronous)` group is shown after the S16 end state for completeness. It is not a user interaction step and does not delay the response.
- The access token is shown only as a guard call; no token value, password, source content, hidden test data, or queue internals appear.
- Authentication and account failures (E1, E2), problem failures (E3, E4), throttling (E7), and the client-side network branch (E9) are in `SD-UC-U-P-03-X`.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
