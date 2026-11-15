# Analysis Class Diagram - UC-U-P-03 - Submit Solution - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-U-P-03-X - Submit Solution - Exceptions](../../../SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution-Exceptions.md) |

```plantuml
@startuml ACD-UC-U-P-03-X
title UC-U-P-03 - Submit Solution - Exceptions
left to right direction

actor User
class "User Interface" as UserInterface <<Boundary>> {
  problemId
  currentSource
  selectedLanguage
  clearAuthenticationInformation()
  showSubmissionOutcomeUnknown()
  navigateToSubmissionHistory()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  checkRequestRateLimit()
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
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  readAccount()
  readProblem()
}
class "Account" as Account <<Entity>> {
  userId
  status
}
class "Problem" as Problem <<Entity>> {
  problemId
  lifecycleStatus
  publicationStatus
}

User --> UserInterface
UserInterface --> ApplicationAPI
ApplicationAPI --> AccountAndAuth
ApplicationAPI --> ProblemCatalog
AccountAndAuth --> PersistenceInterface
AccountAndAuth --> Account
ProblemCatalog --> PersistenceInterface
ProblemCatalog --> Problem
@enduml
```
