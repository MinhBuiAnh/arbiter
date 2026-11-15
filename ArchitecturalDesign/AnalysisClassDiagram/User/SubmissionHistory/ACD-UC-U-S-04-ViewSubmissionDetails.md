# Analysis Class Diagram - UC-U-S-04 - View Submission Details

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-U-S-04 - View Submission Details](../../../SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-04-ViewSubmissionDetails.md) |

```plantuml
@startuml ACD-UC-U-S-04
title UC-U-S-04 - View Submission Details
left to right direction

actor User
class "User Interface" as UserInterface <<Boundary>> {
  submissionId
  displayedDetails
  requestDetails()
  displayDetails()
  displayStatus()
  openRelatedSubmissionView()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  getSubmissionDetails(submissionId)
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  validateAccessToken()
  checkAccountActive(userId)
}
class "Submission Management" as SubmissionManagement <<Control>> {
  getDetails(submissionId, userId)
  checkOwnership()
  assembleAvailableDetails()
  excludeHiddenTestData()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  readAccountStatus(userId)
  readSubmissionDetails(submissionId)
}
class "Account" as Account <<Entity>> {
  userId
  status
}
class "Submission" as Submission <<Entity>> {
  submissionId
  userId
  problemId
  source
  language
  status
  verdict
  resultSummary
  retainedProblemSummary
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
