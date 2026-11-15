# Analysis Class Diagram - UC-AD-P-02 - Update Problem

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-AD-P-02 - Update Problem](../../../SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-02-UpdateProblem.md) |

```plantuml
@startuml ACD-UC-AD-P-02
title UC-AD-P-02 - Update Problem
left to right direction

actor Administrator
class "Administrator Interface" as AdministratorInterface <<Boundary>> {
  problemId
  loadedVersion
  problemFields
  loadProblem()
  submitChanges()
  displayUpdatedProblem()
  reloadLatestVersion()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  getProblem()
  updateProblem()
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  validateAccessToken()
  authorizeAdministrator()
}
class "Problem Catalog" as ProblemCatalog <<Control>> {
  getActiveProblem()
  validateUpdate()
  checkPublicationEligibility()
  compareVersion()
  updateProblem()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  readProblem()
  saveProblemChanges()
}
class "Problem" as Problem <<Entity>> {
  problemId
  problemData
  lifecycleStatus
  publicationStatus
  version
  updatedAt
}

Administrator --> AdministratorInterface
AdministratorInterface --> ApplicationAPI
ApplicationAPI --> AccountAndAuth
ApplicationAPI --> ProblemCatalog
ProblemCatalog --> PersistenceInterface
ProblemCatalog --> Problem
@enduml
```
