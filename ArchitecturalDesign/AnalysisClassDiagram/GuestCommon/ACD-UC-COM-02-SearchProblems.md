# Analysis Class Diagram - UC-COM-02 - Search Problems

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-COM-02 - Search Problems](../../SequenceDiagram/GuestCommon/SD-UC-COM-02-SearchProblems.md) |

```plantuml
@startuml ACD-UC-COM-02
title UC-COM-02 - Search Problems
left to right direction

actor Guest
class "User Interface" as UserInterface <<Boundary>> {
  keywords
  difficulty
  category
  tags
  currentPage
  pageSize
  sort
  submitSearch()
  displayResults()
  displayEmptyState()
  selectProblem()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  searchProblems()
}
class "Problem Catalog" as ProblemCatalog <<Control>> {
  searchPublishedProblems(keywords, filters, page, pageSize, sort)
  buildResultPage()
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
