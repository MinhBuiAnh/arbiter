# Analysis Class Diagram - UC-U-S-01 - View Submission Status

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-U-S-01 - View Submission Status](../../../SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-01-ViewSubmissionStatus.md) |

```plantuml
@startuml ACD-UC-U-S-01
title UC-U-S-01 - View Submission Status
left to right direction

actor User
class "User Interface" as UserInterface <<Boundary>> {
  submissionId
  displayedStatus
  pollingInterval
  requestStatus()
  displayStatus()
  startPolling()
  stopPolling()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  getSubmissionStatus(submissionId)
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  validateAccessToken()
  checkAccountActive(userId)
}
class "Submission Management" as SubmissionManagement <<Control>> {
  getStatus(submissionId, userId)
  checkOwnership()
  assembleStatusAndTimestamps()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  readAccountStatus(userId)
  readSubmissionStatus(submissionId)
}
class "Account" as Account <<Entity>> {
  userId
  status
}
class "Submission" as Submission <<Entity>> {
  submissionId
  userId
  status
  createdAt
  updatedAt
  startedAt
  completedAt
}

User --> UserInterface
UserInterface --> ApplicationAPI
ApplicationAPI --> AccountAndAuth
ApplicationAPI --> SubmissionManagement
AccountAndAuth --> PersistenceInterface
AccountAndAuth --> Account
SubmissionManagement --> PersistenceInterface
SubmissionManagement --> Submission
@enduml
```
