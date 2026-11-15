# Analysis Class Diagram - UC-AD-P-01 - Create Problem

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-AD-P-01 - Create Problem](../../../SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-01-CreateProblem.md) |

```plantuml
@startuml ACD-UC-AD-P-01
title UC-AD-P-01 - Create Problem
left to right direction

actor Administrator
class "Administrator Interface" as AdministratorInterface <<Boundary>> {
  problemDraft
  createProblem()
  displayValidationErrors()
  displayCreatedProblem()
  clearCreateForm()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  createProblem()
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  validateAccessToken()
  authorizeAdministrator()
}
class "Problem Catalog" as ProblemCatalog <<Control>> {
  validateProblemFields()
  validateBusinessRules()
  createProblem()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  saveProblem()
}
class "Problem" as Problem <<Entity>> {
  problemId
  problemData
  tags
  lifecycleStatus
  publicationStatus
}

Administrator --> AdministratorInterface
AdministratorInterface --> ApplicationAPI
ApplicationAPI --> AccountAndAuth
ApplicationAPI --> ProblemCatalog
ProblemCatalog --> PersistenceInterface
ProblemCatalog --> Problem
@enduml
```
