# Analysis Class Diagram - UC-U-S-04 - View Submission Details - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-U-S-04-X - View Submission Details - Exceptions](../../../SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-04-ViewSubmissionDetails-Exceptions.md) |

```plantuml
@startuml ACD-UC-U-S-04-X
title UC-U-S-04 - View Submission Details - Exceptions
left to right direction

actor User
class "User Interface" as UserInterface <<Boundary>> {
  displayedDetails
  requestDetails()
  showRetryNotice()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  getSubmissionDetails(submissionId)
  checkRequestRateLimit()
}

User --> UserInterface
UserInterface --> ApplicationAPI
@enduml
```
