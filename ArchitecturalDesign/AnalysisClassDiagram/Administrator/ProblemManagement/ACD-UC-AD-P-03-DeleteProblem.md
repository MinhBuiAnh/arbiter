# Analysis Class Diagram - UC-AD-P-03 - Delete / Deactivate Problem

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-AD-P-03 - Delete / Deactivate Problem](../../../SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-03-DeleteProblem.md) |

```plantuml
@startuml ACD-UC-AD-P-03
title UC-AD-P-03 - Delete / Deactivate Problem
left to right direction

actor Administrator
class "Administrator Interface" as AdministratorInterface <<Boundary>> {
  problemId
  requestedAction
  loadedVersion
  requestProblemStateChange()
  confirmAction()
  displayUpdatedState()
  reloadProblemState()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  getProblem()
  changeProblemState()
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  validateAccessToken()
  authorizeAdministrator()
}
class "Problem Catalog" as ProblemCatalog <<Control>> {
  getProblemState()
  compareVersion()
  deactivateProblem()
  reactivateProblem()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  readProblemState()
  saveProblemState()
}
class "Problem" as Problem <<Entity>> {
  problemId
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
