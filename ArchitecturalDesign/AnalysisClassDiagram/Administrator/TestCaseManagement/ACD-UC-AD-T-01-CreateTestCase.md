# Analysis Class Diagram - UC-AD-T-01 - Create Test Case

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-AD-T-01 - Create Test Case](../../../SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase.md) |

```plantuml
@startuml ACD-UC-AD-T-01
title UC-AD-T-01 - Create Test Case
left to right direction

actor Administrator
class "Administrator Interface" as AdministratorInterface <<Boundary>> {
  problemId
  testCaseDraft
  createTestCase()
  displayTypeInformation()
  showValidationErrors()
  displayCreatedTestCase()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  createTestCase()
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  validateAccessToken()
  authorizeAdministrator()
}
class "Problem Catalog" as ProblemCatalog <<Control>> {
  verifyProblemExists()
  checkProblemEditable()
}
class "Test Case Management" as TestCaseManagement <<Control>> {
  validateTestCaseData()
  validateUniqueOrder()
  createTestCase()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  readProblemState()
  saveTestCase()
}
class "Protected Test Case Store Interface" as ProtectedTestCaseStoreInterface <<Boundary>> {
  storeTestCaseFiles()
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
  inputReference
  expectedOutputReference
}

Administrator --> AdministratorInterface
AdministratorInterface --> ApplicationAPI
ApplicationAPI --> AccountAndAuth
ApplicationAPI --> ProblemCatalog
ApplicationAPI --> TestCaseManagement
ProblemCatalog --> PersistenceInterface
ProblemCatalog --> Problem
TestCaseManagement --> PersistenceInterface
TestCaseManagement --> ProtectedTestCaseStoreInterface
TestCaseManagement --> TestCase
@enduml
```
