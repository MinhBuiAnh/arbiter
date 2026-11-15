# Analysis Class Diagram - UC-AD-T-02 - Update Test Case

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-AD-T-02 - Update Test Case](../../../SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-02-UpdateTestCase.md) |

```plantuml
@startuml ACD-UC-AD-T-02
title UC-AD-T-02 - Update Test Case
left to right direction

actor Administrator
class "Administrator Interface" as AdministratorInterface <<Boundary>> {
  problemId
  testCaseId
  loadedVersion
  testCaseFields
  loadTestCase()
  submitChanges()
  refreshTestCaseList()
  reloadLatestVersion()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  getTestCase()
  updateTestCase()
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  validateAccessToken()
  authorizeAdministrator()
}
class "Problem Catalog" as ProblemCatalog <<Control>> {
  verifyProblemEditable()
}
class "Test Case Management" as TestCaseManagement <<Control>> {
  getTestCase()
  validateTestCaseData()
  validateOrder()
  compareVersion()
  updateTestCase()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  readProblemState()
  readTestCase()
  saveTestCaseChanges()
}
class "Protected Test Case Store Interface" as ProtectedTestCaseStoreInterface <<Boundary>> {
  readTestCaseFiles()
  replaceChangedFiles()
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
  version
  updatedAt
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
