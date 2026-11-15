# Analysis Class Diagram - UC-U-P-02 - Select Programming Language

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-U-P-02 - Select Programming Language](../../../SequenceDiagram/User/ProblemPractice/SD-UC-U-P-02-SelectProgrammingLanguage.md) |

```plantuml
@startuml ACD-UC-U-P-02
title UC-U-P-02 - Select Programming Language
left to right direction

actor User
class "User Interface" as UserInterface <<Boundary>> {
  currentLanguage
  supportedLanguages
  editorConfiguration
  sourceDraft
  selectLanguage()
  validateSupportedLanguage()
  applyEditorConfiguration()
  restoreLanguageTemplate()
  openRelatedPracticeFlow()
}

User --> UserInterface
@enduml
```
