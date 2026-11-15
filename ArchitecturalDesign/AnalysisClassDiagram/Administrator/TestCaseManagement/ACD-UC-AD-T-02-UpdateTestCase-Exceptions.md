# Analysis Class Diagram - UC-AD-T-02 - Update Test Case - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-AD-T-02-X - Update Test Case - Exceptions](../../../SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-02-UpdateTestCase-Exceptions.md) |

```plantuml
@startuml ACD-UC-AD-T-02-X
title UC-AD-T-02 - Update Test Case - Exceptions
left to right direction

actor Administrator
class "Administrator Interface" as AdministratorInterface <<Boundary>> {
  testCaseId
  intendedChanges
  loadedVersion
  submitChanges()
  reloadLatestTestCase()
  verifyStoredState()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  updateTestCase()
  getTestCase()
}
class "Test Case Management" as TestCaseManagement <<Control>> {
  compareOrder()
  compareVersion()
  updateTestCase()
  handlePersistenceFailure()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  readTestCase()
  saveTestCaseChanges()
}
class "Test Case" as TestCase <<Entity>> {
  testCaseId
  ordinal
  version
}

Administrator --> AdministratorInterface
AdministratorInterface --> ApplicationAPI
ApplicationAPI --> TestCaseManagement
TestCaseManagement --> PersistenceInterface
TestCaseManagement --> TestCase
@enduml
```
