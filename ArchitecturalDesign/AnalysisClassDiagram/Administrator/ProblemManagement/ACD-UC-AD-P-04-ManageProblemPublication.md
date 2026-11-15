# Analysis Class Diagram - UC-AD-P-04 - Manage Problem Publication

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-AD-P-04 - Manage Problem Publication](../../../SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-04-ManageProblemPublication.md) |

```plantuml
@startuml ACD-UC-AD-P-04
title UC-AD-P-04 - Manage Problem Publication
left to right direction

actor Administrator
class "Administrator Interface" as AdministratorInterface <<Boundary>> {
  problemId
  publicationAction
  loadedVersion
  requestPublicationChange()
  confirmAction()
  displayPublicationState()
  reloadPublicationState()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  getPublicationState()
  changePublicationState()
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  validateAccessToken()
  authorizeAdministrator()
}
class "Problem Catalog" as ProblemCatalog <<Control>> {
  getProblem()
  checkActiveState()
  validatePublicationReadiness()
  publishProblem()
  unpublishProblem()
}
class "Test Case Management" as TestCaseManagement <<Control>> {
  getRequiredCaseTypes()
  getTestCaseFileReferences()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  readProblem()
  savePublicationState()
}
class "Protected Test Case Store Interface" as ProtectedTestCaseStoreInterface <<Boundary>> {
  verifyTestCaseFilesReadable()
}
class "Problem" as Problem <<Entity>> {
  problemId
  lifecycleStatus
  publicationStatus
  version
  updatedAt
}
class "Test Case" as TestCase <<Entity>> {
  testCaseId
  problemId
  type
  inputReference
  expectedOutputReference
}

Administrator --> AdministratorInterface
AdministratorInterface --> ApplicationAPI
ApplicationAPI --> AccountAndAuth
ApplicationAPI --> ProblemCatalog
ProblemCatalog --> PersistenceInterface
ProblemCatalog --> Problem
ProblemCatalog --> TestCaseManagement
ProblemCatalog --> ProtectedTestCaseStoreInterface
TestCaseManagement --> TestCase
@enduml
```
