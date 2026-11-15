# Analysis Class Diagram - UC-AD-S-01 - View Any Submission

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-AD-S-01 - View Any Submission](../../../SequenceDiagram/Administrator/SubmissionManagement/SD-UC-AD-S-01-ViewAnySubmission.md) |

```plantuml
@startuml ACD-UC-AD-S-01
title UC-AD-S-01 - View Any Submission
left to right direction

actor Administrator
class "Administrator Interface" as AdministratorInterface <<Boundary>> {
  userFilter
  problemFilter
  statusFilter
  currentPage
  pageSize
  requestSubmissionList()
  displaySubmissionList()
  requestSubmissionDetails()
  displayReadOnlyDetails()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  getSubmissionList()
  getSubmissionDetails(submissionId)
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  validateAccessToken()
  authorizeAdministrator()
}
class "Submission Management" as SubmissionManagement <<Control>> {
  validateFilters()
  validatePagination()
  searchSubmissions()
  getSubmissionDetails(submissionId)
  excludeHiddenTestData()
  boundCompilationInformation()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  querySubmissionSummaries()
  readSubmissionDetails()
}
class "Account" as Account <<Entity>> {
  userId
}
class "Submission" as Submission <<Entity>> {
  submissionId
  ownerId
  problemId
  source
  status
  verdict
  resultMetrics
  compilationInformation
}
class "Problem" as Problem <<Entity>> {
  problemId
  title
}
class "Test Case Result" as TestCaseResult <<Entity>> {
  testCaseId
  outcome
  resultMetrics
}

Administrator --> AdministratorInterface
AdministratorInterface --> ApplicationAPI
ApplicationAPI --> AccountAndAuth
ApplicationAPI --> SubmissionManagement
AccountAndAuth --> Account
SubmissionManagement --> PersistenceInterface
SubmissionManagement --> Account
SubmissionManagement --> Submission
SubmissionManagement --> Problem
SubmissionManagement --> TestCaseResult
@enduml
```
