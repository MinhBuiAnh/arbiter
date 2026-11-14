# Sequence Diagram - UC-U-P-02 - Select Programming Language

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-U-P-02 |
| Use Case | UC-U-P-02 - Select Programming Language |
| Use Case Specification | [UC-U-P-02-SelectProgrammingLanguage.md](../../../../RequirementAnalysis/UCSpec/User/ProblemPractice/UC-U-P-02-SelectProgrammingLanguage.md) |
| Primary Actor(s) | User, Administrator (through inheritance) |
| Related Requirements | FR-SUB-02, FR-SUB-03 |
| Scope | Main flow, A1-A3, E1-E3 |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

This diagram covers client-side selection of a supported programming language (C++17 or Python 3), validation against the supported list, session state update, editor reconfiguration, and the template restore action.

No backend request is made. The language list and editor resources are client-side assets, so the diagram declares only `User` and `UI`. Selecting a language never creates a submission and never modifies problem or account data.

A1 (change language) reuses the same S3-S7 path. A2 (re-select the active language) ends without a state change and is dispositioned below. E1 and E2 are client-side validation and configuration failures; E3 is a client-only network note.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | S1-S9 | Entire diagram; S9 end state is stated in the final note |
| A1 | - | Same path as S3-S7; only the selected value changes; no new interaction |
| A2 | - | UI-only; the active language is unchanged and the use case ends without change |
| A3 | A3 | `opt A3` at S7 |
| E1 | E1 | `alt E1` at S4 |
| E2 | E2 | `alt E2` at S6 |
| E3 | - | Client-only note at UI during language-list and editor-resource loading |

## 3. Diagram

```plantuml
@startuml SD-UC-U-P-02
title UC-U-P-02 - Select Programming Language\nClient-side language selection and editor configuration
hide footbox
autonumber "<b>[00]"
skinparam shadowing false
skinparam responseMessageBelowArrow true
skinparam maxMessageSize 140
skinparam defaultFontName "Helvetica"
skinparam defaultFontSize 12
skinparam ParticipantPadding 12
skinparam BoxPadding 8
skinparam NoteBackgroundColor #FFF9C4
skinparam NoteBorderColor #D6B656
skinparam sequence {
  ArrowColor #333333
  ActorBorderColor #333333
  LifeLineBorderColor #999999
  LifeLineBackgroundColor #FFFFFF
}

actor "User" as User #F5F5F5
participant "React SPA" as UI #DAE8FC

User -> UI : S1 open programming language selection area
note right of UI
  E3 - ERR-NET-001 - network error:
  if the language list or editor resources fail to load, UI
  cannot confirm the configuration is complete. User may
  retry when the connection is restored. Client-only.
end note
UI --> User : S2 display supported languages {C++17, Python 3}
User -> UI : S3 select programming language
UI -> UI : S4 check selected language is supported
alt E1 - ERR-VAL-013 - unsupported programming language (S4)
  UI -> UI : E1 log rejected selection with request_id (no source code)
  UI --> User : E1 notify language is unsupported (ERR-VAL-013); show supported languages
  note right of UI : Previously active language and editor configuration are retained.
  User -> UI : E1 select a supported language
  note over User, UI : Continues at S3. Otherwise use case ends.
else supported
  UI -> UI : S5 update current language for the session
  UI -> UI : S6 apply editor configuration (highlighting, formatting)
  alt E2 - ERR-SYS-009 - editor configuration error (S6)
    UI -> UI : E2 stop configuration update; retain nearest valid configuration
    UI -> UI : E2 log error with request_id (no source code)
    UI --> User : E2 notify editor configuration could not be changed (ERR-SYS-009)
    note over User, UI : User may retry language selection; continues at S3, otherwise use case ends.
  else configuration applied
    UI --> User : S7 display current language
    opt A3 - Restore Language-specific Template (S7)
      User -> UI : A3 request template source code
      UI --> User : A3 display template and request confirmation
      User -> UI : A3 confirm replacing editor content
      UI -> UI : A3 replace editor content with template
      note right of UI : No submission is created. Continues at S8.
    end
    User -> UI : S8 continue writing or open submission
    UI -> UI : S8 navigate to UC-U-P-01 or UC-U-P-03
    note over User, UI : S9 use case ends. No submission is created by selecting a language.
  end
end
@enduml
```

## 4. Notes

- The supported list is fixed for the session: C++17 and Python 3 only.
- An Administrator inherits the User behavior; only `User` is drawn.
- The language is session state; it is not persisted until UC-U-P-03 submits a solution.
- A1 and A2 are client-side state variations. A2 in particular ends with the previous language and editor configuration unchanged.
- The editor never executes or evaluates the selected language's source, and no source code is written to logs.
- No backend request is made in this use case.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
