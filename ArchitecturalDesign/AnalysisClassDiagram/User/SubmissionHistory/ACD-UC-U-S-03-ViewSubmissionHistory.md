# Analysis Class Diagram - UC-U-S-03 - View Submission History

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-U-S-03 - View Submission History](../../../SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-03-ViewSubmissionHistory.md) |

```plantuml
@startuml ACD-UC-U-S-03
title UC-U-S-03 - View Submission History
left to right direction

actor User
class "User Interface" as UserInterface <<Boundary>> {
  currentPage
  pageSize
  submissionSummaries
  requestHistory()
  displayHistory()
  displayEmptyState()
  selectSubmission()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  getSubmissionHistory(page, pageSize)
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  validateAccessToken()
  checkAccountActive(userId)
}
class "Submission Management" as SubmissionManagement <<Control>> {
  validatePagination()
  getOwnHistory(userId, page, pageSize)
  includeVerdictOnlyWhenCompleted()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  readAccountStatus(userId)
  readOwnSubmissionSummaries(userId, page, pageSize)
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
  language
  createdAt
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
