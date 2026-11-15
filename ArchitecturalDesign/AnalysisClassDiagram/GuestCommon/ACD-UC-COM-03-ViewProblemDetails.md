# Analysis Class Diagram - UC-COM-03 - View Problem Details

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-COM-03 - View Problem Details](../../SequenceDiagram/GuestCommon/SD-UC-COM-03-ViewProblemDetails.md) |

```plantuml
@startuml ACD-UC-COM-03
title UC-COM-03 - View Problem Details
left to right direction

actor Guest
class "User Interface" as UserInterface <<Boundary>> {
  displayProblemDetails()
  returnToProblemList()
  selectAnotherProblem()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  getProblemDetails(problemId)
}
class "Problem Catalog" as ProblemCatalog <<Control>> {
  getPublicProblem(problemId)
  checkPublicVisibility()
}
class "Problem" as Problem <<Entity>> {
  problemId
  statement
  inputFormat
  outputFormat
  constraints
  timeLimit
  memoryLimit
  category
  supportedLanguages
  lifecycleStatus
  publicationStatus
}
class "Test Case" as TestCase <<Entity>> {
  input
  expectedOutput
}
class "Public Statistics" as PublicStatistics <<Entity>> {
  publicMetrics
}

Guest --> UserInterface
UserInterface --> ApplicationAPI
ApplicationAPI --> ProblemCatalog
ProblemCatalog --> Problem
ProblemCatalog --> TestCase
ProblemCatalog --> PublicStatistics
@enduml
```
