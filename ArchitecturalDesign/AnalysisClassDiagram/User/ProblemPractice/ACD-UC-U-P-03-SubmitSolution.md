# Analysis Class Diagram - UC-U-P-03 - Submit Solution

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-U-P-03 - Submit Solution](../../../SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution.md) |

```plantuml
@startuml ACD-UC-U-P-03
title UC-U-P-03 - Submit Solution
left to right direction

actor User
class "User Interface" as UserInterface <<Boundary>> {
  problemId
  selectedLanguage
  currentSource
  submitSolution()
  displaySubmissionReceipt()
  navigateToSubmissionStatus()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  acceptSubmission()
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  authenticateUser()
  checkAccountEligibility()
}
class "Problem Catalog" as ProblemCatalog <<Control>> {
  getProblemForSubmission(problemId)
  checkPublicAvailability()
}
class "Submission Management" as SubmissionManagement <<Control>> {
  createSubmission()
  validateSubmission()
  storeSubmissionAndEvent()
}
class "Outbox Dispatcher" as OutboxDispatcher <<Control>> {
  findUnpublishedEvents()
  publishSubmissionEvent()
  markEventPublished()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  readAccount()
  readProblem()
  storeSubmissionAndEvent()
  findUnpublishedEvents()
  markEventPublished()
}
class "Message Queue Interface" as MessageQueueInterface <<Boundary>> {
  publishSubmission()
}
class "Account" as Account <<Entity>> {
  userId
  status
}
class "Problem" as Problem <<Entity>> {
  problemId
  lifecycleStatus
  publicationStatus
  supportedLanguages
  timeLimit
  memoryLimit
}
class "Submission" as Submission <<Entity>> {
  submissionId
  userId
  problemId
  language
  source
  status
}
class "Outbox Event" as OutboxEvent <<Entity>> {
  eventId
  submissionId
  publicationStatus
}

User --> UserInterface
UserInterface --> ApplicationAPI
ApplicationAPI --> AccountAndAuth
ApplicationAPI --> ProblemCatalog
ApplicationAPI --> SubmissionManagement
AccountAndAuth --> PersistenceInterface
AccountAndAuth --> Account
ProblemCatalog --> PersistenceInterface
ProblemCatalog --> Problem
SubmissionManagement --> PersistenceInterface
SubmissionManagement --> Submission
SubmissionManagement --> OutboxEvent
OutboxDispatcher --> PersistenceInterface
OutboxDispatcher --> MessageQueueInterface
OutboxDispatcher --> OutboxEvent
@enduml
```
