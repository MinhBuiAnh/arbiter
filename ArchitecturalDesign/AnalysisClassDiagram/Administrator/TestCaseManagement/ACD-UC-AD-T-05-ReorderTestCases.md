# Analysis Class Diagram - UC-AD-T-05 - Reorder Test Cases

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-AD-T-05 - Reorder Test Cases](../../../SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-05-ReorderTestCases.md) |

```plantuml
@startuml ACD-UC-AD-T-05
title UC-AD-T-05 - Reorder Test Cases
left to right direction

actor Administrator
class "Administrator Interface" as AdministratorInterface <<Boundary>> {
  problemId
  currentOrder
  submittedOrder
  displayTestCaseOrder()
  submitCompleteOrder()
  displayUpdatedOrder()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  getTestCaseOrder()
  reorderTestCases()
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  validateAccessToken()
  authorizeAdministrator()
}
class "Problem Catalog" as ProblemCatalog <<Control>> {
  verifyProblemEditable()
}
class "Test Case Management" as TestCaseManagement <<Control>> {
  getOrderedTestCases()
  validateExactTestCaseSet()
  validateCompleteOrder()
  reorderTestCases()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  readProblemState()
  readTestCaseSet()
  saveTestCaseOrder()
}
class "Problem" as Problem <<Entity>> {
  problemId
  lifecycleStatus
  publicationStatus
}
class "Test Case" as TestCase <<Entity>> {
  testCaseId
  problemId
  ordinal
  type
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
