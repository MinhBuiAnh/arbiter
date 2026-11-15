# Analysis Class Diagram - UC-AD-T-03 - Delete Test Case - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-AD-T-03-X - Delete Test Case - Exceptions](../../../SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-03-DeleteTestCase-Exceptions.md) |

```plantuml
@startuml ACD-UC-AD-T-03-X
title UC-AD-T-03 - Delete Test Case - Exceptions
left to right direction

actor Administrator
class "Administrator Interface" as AdministratorInterface <<Boundary>> {
  testCaseId
  loadedVersion
  requestDeletion()
  reloadTestCaseList()
  verifyDeleteOutcome()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  deleteTestCase()
  getTestCaseList()
}
class "Test Case Management" as TestCaseManagement <<Control>> {
  deleteTestCase()
  compactOrdinals()
  handlePersistenceFailure()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  deleteAndCompactTestCases()
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
