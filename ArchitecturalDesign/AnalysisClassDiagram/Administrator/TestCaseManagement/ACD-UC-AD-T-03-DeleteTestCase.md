# Analysis Class Diagram - UC-AD-T-03 - Delete Test Case

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-AD-T-03 - Delete Test Case](../../../SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-03-DeleteTestCase.md) |

```plantuml
@startuml ACD-UC-AD-T-03
title UC-AD-T-03 - Delete Test Case
left to right direction

actor Administrator
class "Administrator Interface" as AdministratorInterface <<Boundary>> {
  problemId
  testCaseId
  loadedVersion
  requestDeletion()
  confirmDeletion()
  displayUpdatedTestCaseList()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  deleteTestCase()
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  validateAccessToken()
  authorizeAdministrator()
}
class "Problem Catalog" as ProblemCatalog <<Control>> {
  verifyProblemEditable()
}
class "Test Case Management" as TestCaseManagement <<Control>> {
  verifyTestCaseAssociation()
  compareSetVersion()
  deleteTestCase()
  compactOrdinals()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  readProblemState()
  readTestCaseSet()
  deleteAndCompactTestCases()
}
class "Problem" as Problem <<Entity>> {
  problemId
  lifecycleStatus
  publicationStatus
}
class "Test Case" as TestCase <<Entity>> {
  testCaseId
  problemId
  type
  ordinal
  version
}

Administrator --> AdministratorInterface
AdministratorInterface --> ApplicationAPI
ApplicationAPI --> AccountAndAuth
ApplicationAPI --> ProblemCatalog
ApplicationAPI --> TestCaseManagement
ProblemCatalog --> PersistenceInterface
ProblemCatalog --> Problem
TestCaseManagement --> PersistenceInterface
TestCaseManagement --> TestCase
@enduml
```
