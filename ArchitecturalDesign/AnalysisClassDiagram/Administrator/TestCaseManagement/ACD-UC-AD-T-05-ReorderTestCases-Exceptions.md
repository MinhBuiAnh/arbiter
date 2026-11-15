# Analysis Class Diagram - UC-AD-T-05 - Reorder Test Cases - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-AD-T-05-X - Reorder Test Cases - Exceptions](../../../SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-05-ReorderTestCases-Exceptions.md) |

```plantuml
@startuml ACD-UC-AD-T-05-X
title UC-AD-T-05 - Reorder Test Cases - Exceptions
left to right direction

actor Administrator
class "Administrator Interface" as AdministratorInterface <<Boundary>> {
  submittedOrder
  loadedVersion
  submitCompleteOrder()
  reloadCurrentOrder()
  verifyStoredOrder()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  reorderTestCases()
  getTestCaseOrder()
}
class "Test Case Management" as TestCaseManagement <<Control>> {
  compareCurrentSetAndVersion()
  reorderTestCases()
  handlePersistenceFailure()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  readTestCaseSet()
  saveTestCaseOrder()
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
