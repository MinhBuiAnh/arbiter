# Analysis Class Diagram - UC-U-S-02 - View Submission Result

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-U-S-02 - View Submission Result](../../../SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-02-ViewSubmissionResult.md) |

```plantuml
@startuml ACD-UC-U-S-02
title UC-U-S-02 - View Submission Result
left to right direction

actor User
class "User Interface" as UserInterface <<Boundary>> {
  submissionId
  displayedStatus
  displayedResult
  requestResult()
  displayResult()
  displayStatusOnly()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  getSubmissionResult(submissionId)
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  validateAccessToken()
  checkAccountActive(userId)
}
class "Submission Management" as SubmissionManagement <<Control>> {
  getSubmissionResult(submissionId, userId)
  checkOwnership()
  inspectSubmissionStatus()
  assembleStoredResult()
  excludeHiddenTestData()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  readAccountStatus(userId)
  readSubmissionResult(submissionId)
}
class "Account" as Account <<Entity>> {
  userId
  status
}
class "Submission" as Submission <<Entity>> {
  submissionId
  userId
  status
  verdict
  resultMetrics
  executedCaseSummary
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
