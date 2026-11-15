# Analysis Class Diagram - UC-AD-T-04 - Manage Test Case Type - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-AD-T-04-X - Manage Test Case Type - Exceptions](../../../SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-04-ManageTestCaseType-Exceptions.md) |

```plantuml
@startuml ACD-UC-AD-T-04-X
title UC-AD-T-04 - Manage Test Case Type - Exceptions
left to right direction

actor Administrator
class "Administrator Interface" as AdministratorInterface <<Boundary>> {
  testCaseId
  loadedVersion
  intendedType
  changeType()
  reloadTestCase()
  verifyStoredType()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  changeTestCaseType()
  getTestCase()
}
class "Test Case Management" as TestCaseManagement <<Control>> {
  compareVersion()
  changeTestCaseType()
  handlePersistenceFailure()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  readTestCase()
  saveTestCaseType()
}
class "Test Case" as TestCase <<Entity>> {
  testCaseId
  type
  version
}

Administrator --> AdministratorInterface
AdministratorInterface --> ApplicationAPI
ApplicationAPI --> TestCaseManagement
TestCaseManagement --> PersistenceInterface
TestCaseManagement --> TestCase
@enduml
```
