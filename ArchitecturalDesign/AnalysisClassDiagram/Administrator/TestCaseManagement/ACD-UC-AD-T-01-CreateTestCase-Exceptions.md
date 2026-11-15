# Analysis Class Diagram - UC-AD-T-01 - Create Test Case - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-AD-T-01-X - Create Test Case - Exceptions](../../../SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase-Exceptions.md) |

```plantuml
@startuml ACD-UC-AD-T-01-X
title UC-AD-T-01 - Create Test Case - Exceptions
left to right direction

actor Administrator
class "Administrator Interface" as AdministratorInterface <<Boundary>> {
  problemId
  testCaseDraft
  createTestCase()
  reloadTestCaseList()
  verifyCreateOutcome()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  createTestCase()
  getTestCaseList()
}
class "Test Case Management" as TestCaseManagement <<Control>> {
  createTestCase()
  handlePersistenceFailure()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  saveTestCase()
}
class "Test Case" as TestCase <<Entity>> {
  testCaseId
  problemId
  type
  ordinal
}

Administrator --> AdministratorInterface
AdministratorInterface --> ApplicationAPI
ApplicationAPI --> TestCaseManagement
TestCaseManagement --> PersistenceInterface
TestCaseManagement --> TestCase
@enduml
```
