# Analysis Class Diagram - UC-AD-S-01 - View Any Submission - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-AD-S-01-X - View Any Submission - Exceptions](../../../SequenceDiagram/Administrator/SubmissionManagement/SD-UC-AD-S-01-ViewAnySubmission-Exceptions.md) |

```plantuml
@startuml ACD-UC-AD-S-01-X
title UC-AD-S-01 - View Any Submission - Exceptions
left to right direction

actor Administrator
class "Administrator Interface" as AdministratorInterface <<Boundary>> {
  currentPage
  selectedSubmissionId
  markDataUnavailable()
  retrySubmissionRequest()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  getSubmissionList()
  getSubmissionDetails(submissionId)
}
class "Submission Management" as SubmissionManagement <<Control>> {
  querySubmissionList()
  assembleSubmissionDetails()
  handleQueryFailure()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  querySubmissionSummaries()
  readSubmissionDetails()
}
class "Submission" as Submission <<Entity>> {
  submissionId
  status
}

Administrator --> AdministratorInterface
AdministratorInterface --> ApplicationAPI
ApplicationAPI --> SubmissionManagement
SubmissionManagement --> PersistenceInterface
SubmissionManagement --> Submission
@enduml
```
