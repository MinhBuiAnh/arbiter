# Analysis Class Diagram - UC-AD-T-04 - Manage Test Case Type

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-AD-T-04 - Manage Test Case Type](../../../SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-04-ManageTestCaseType.md) |

```plantuml
@startuml ACD-UC-AD-T-04
title UC-AD-T-04 - Manage Test Case Type
left to right direction

actor Administrator
class "Administrator Interface" as AdministratorInterface <<Boundary>> {
  problemId
  testCaseId
  loadedVersion
  selectTestCaseType()
  confirmVisibilityChange()
  displayUpdatedType()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  getTestCaseType()
  changeTestCaseType()
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  validateAccessToken()
  authorizeAdministrator()
}
class "Problem Catalog" as ProblemCatalog <<Control>> {
  verifyProblemEditable()
}
class "Test Case Management" as TestCaseManagement <<Control>> {
  getTestCaseType()
  validateType()
  compareVersion()
  changeTestCaseType()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  readProblemState()
  readTestCaseType()
  saveTestCaseType()
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
