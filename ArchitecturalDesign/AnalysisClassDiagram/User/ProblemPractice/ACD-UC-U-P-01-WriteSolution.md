# Analysis Class Diagram - UC-U-P-01 - Write Solution

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-U-P-01 - Write Solution](../../../SequenceDiagram/User/ProblemPractice/SD-UC-U-P-01-WriteSolution.md) |

```plantuml
@startuml ACD-UC-U-P-01
title UC-U-P-01 - Write Solution
left to right direction

actor User
class "User Interface" as UserInterface <<Boundary>> {
  problemId
  currentSource
  selectedLanguage
  editorInitialized
  initializeEditor()
  editSource()
  clearSource()
  restoreTemplate()
  openLanguageSelection()
  navigateToSubmission()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  getEditorContext(problemId)
}
class "Problem Catalog" as ProblemCatalog <<Control>> {
  getProblemContext(problemId)
  checkPublicAvailability()
}
class "Problem" as Problem <<Entity>> {
  problemId
  supportedLanguages
  timeLimit
  memoryLimit
  lifecycleStatus
  publicationStatus
}

User --> UserInterface
UserInterface --> ApplicationAPI
ApplicationAPI --> ProblemCatalog
ProblemCatalog --> Problem
@enduml
```
