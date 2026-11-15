# Analysis Class Diagram - UC-AD-P-04 - Manage Problem Publication - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-AD-P-04-X - Manage Problem Publication - Exceptions](../../../SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-04-ManageProblemPublication-Exceptions.md) |

```plantuml
@startuml ACD-UC-AD-P-04-X
title UC-AD-P-04 - Manage Problem Publication - Exceptions
left to right direction

actor Administrator
class "Administrator Interface" as AdministratorInterface <<Boundary>> {
  problemId
  publicationAction
  updateOutcome
  changePublicationState()
  reloadPublicationState()
  verifyStoredState()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  changePublicationState()
  getPublicationState()
}
class "Problem Catalog" as ProblemCatalog <<Control>> {
  savePublicationState()
  handlePersistenceFailure()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  savePublicationState()
  readProblemState()
}
class "Problem" as Problem <<Entity>> {
  problemId
  publicationStatus
  version
}

Administrator --> AdministratorInterface
AdministratorInterface --> ApplicationAPI
ApplicationAPI --> ProblemCatalog
ProblemCatalog --> PersistenceInterface
ProblemCatalog --> Problem
@enduml
```
