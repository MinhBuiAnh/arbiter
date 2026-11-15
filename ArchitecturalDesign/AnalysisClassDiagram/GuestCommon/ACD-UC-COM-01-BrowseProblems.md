# Analysis Class Diagram - UC-COM-01 - Browse Problems

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-COM-01 - Browse Problems](../../SequenceDiagram/GuestCommon/SD-UC-COM-01-BrowseProblems.md) |

```plantuml
@startuml ACD-UC-COM-01
title UC-COM-01 - Browse Problems
left to right direction

actor Guest
class "User Interface" as UserInterface <<Boundary>> {
  currentPage
  pageSize
  sort
  displayProblemList()
  displayEmptyState()
  selectProblem()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  listProblems()
}
class "Problem Catalog" as ProblemCatalog <<Control>> {
  listPublishedProblems(page, pageSize, sort)
  buildPreviews()
}
class "Problem" as Problem <<Entity>> {
  problemId
  title
  difficulty
  tags
  lifecycleStatus
  publicationStatus
}

Guest --> UserInterface
UserInterface --> ApplicationAPI
ApplicationAPI --> ProblemCatalog
ProblemCatalog --> Problem
@enduml
```
