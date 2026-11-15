# Analysis Class Diagram - UC-U-S-02 - View Submission Result - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-U-S-02-X - View Submission Result - Exceptions](../../../SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-02-ViewSubmissionResult-Exceptions.md) |

```plantuml
@startuml ACD-UC-U-S-02-X
title UC-U-S-02 - View Submission Result - Exceptions
left to right direction

actor User
class "User Interface" as UserInterface <<Boundary>> {
  displayedResult
  requestResult()
  showRetryNotice()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  getSubmissionResult(submissionId)
  checkRequestRateLimit()
}

User --> UserInterface
UserInterface --> ApplicationAPI
@enduml
```
