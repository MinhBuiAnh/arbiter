# Analysis Class Diagram - UC-AD-P-02 - Update Problem - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-AD-P-02-X - Update Problem - Exceptions](../../../SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-02-UpdateProblem-Exceptions.md) |

```plantuml
@startuml ACD-UC-AD-P-02-X
title UC-AD-P-02 - Update Problem - Exceptions
left to right direction

actor Administrator
class "Administrator Interface" as AdministratorInterface <<Boundary>> {
  problemId
  intendedChanges
  updateOutcome
  submitChanges()
  reloadProblem()
  verifyStoredState()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  updateProblem()
  getProblem()
}
class "Problem Catalog" as ProblemCatalog <<Control>> {
  updateProblem()
  handlePersistenceFailure()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  saveProblemChanges()
  readProblem()
}
class "Problem" as Problem <<Entity>> {
  problemId
  problemData
  version
}

Administrator --> AdministratorInterface
AdministratorInterface --> ApplicationAPI
ApplicationAPI --> ProblemCatalog
ProblemCatalog --> PersistenceInterface
ProblemCatalog --> Problem
@enduml
```
