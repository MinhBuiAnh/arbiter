# Sequence Diagram - UC-U-S-04 - View Submission Details - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-U-S-04-X |
| Use Case | UC-U-S-04 - View Submission Details |
| Use Case Specification | [UC-U-S-04-ViewSubmissionDetails.md](../../../../RequirementAnalysis/UCSpec/User/SubmissionHistory/UC-U-S-04-ViewSubmissionDetails.md) |
| Primary Actor(s) | User, Administrator (through inheritance) |
| Related Requirements | FR-AUTH-04, FR-AUTH-09, FR-SUB-07, FR-SUB-10, FR-SUB-11, NFR-SEC-04 |
| Scope | E5, E7 |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

This supplement covers the details-request throttle and client-side network failure; all other flows remain in the [primary diagram](SD-UC-U-S-04-ViewSubmissionDetails.md).

## 2. Scenario Coverage

Flows not listed here are covered by the primary diagram.

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| E5 | E5 | `group E5` before authentication |
| E7 | E7 | Client-only network note |

## 3. Diagram

```plantuml
@startuml SD-UC-U-S-04-X
title UC-U-S-04 - View Submission Details - Exceptions\nRate limit and network branches
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

ref over User, UI, API : UC-U-S-04 - View Submission Details

group E5 - ERR-LIMIT-001 - details request rate limit exceeded (S2 or S3)
  UI -> API : E5 GET /api/v1/submissions/{submission_id}
  API -> API : E5 detect details-query rate limit exceeded
  API --> UI : 429 {code: ERR-LIMIT-001, retry_after}
  UI -> UI : E5 wait for retry_after before another request
  UI --> User : E5 explain when another request can be made
  note right of API : No submission data is changed.
  note over User, UI : Current request ends.
end

group E7 - ERR-NET-001 - network error (request/response)
  UI -> API : E7 GET /api/v1/submissions/{submission_id}
  API -x UI : E7 no definitive response received
  UI --> User : E7 explain details could not be loaded; allow safe retry
  note right of UI : Do not present stale data as current. No submission data is changed.
  note over User, UI : Current request ends.
end
@enduml
```

## 4. Notes

- E5 is rejected before submission data is read, and the UI honors `retry_after`.
- E7 is client-side; a retry does not imply the original request succeeded.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial exception supplement. |
