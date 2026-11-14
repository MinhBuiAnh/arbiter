# Sequence Diagram - UC-U-P-01 - Write Solution

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-U-P-01 |
| Use Case | UC-U-P-01 - Write Solution |
| Use Case Specification | [UC-U-P-01-WriteSolution.md](../../../../RequirementAnalysis/UCSpec/User/ProblemPractice/UC-U-P-01-WriteSolution.md) |
| Primary Actor(s) | User, Administrator (through inheritance) |
| Related Requirements | FR-SUB-01, NFR-SEC-06, NFR-SEC-10 |
| Scope | Main flow, A1-A3, E1-E4 |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

This diagram covers opening the source-code editor for a published problem, loading the public problem context, initializing the editor, editing, clearing, and restoring a template. It ends with the UI-only handoffs to UC-U-P-02 - Select Programming Language and UC-U-P-03 - Submit Solution.

The editor and all editing actions are client-side. The only server interaction is the read that confirms the problem exists and is publicly accessible. No submission, outbox event, or queue message is created. The editor context is a public problem read; authentication is enforced when the source is submitted in UC-U-P-03, so no `AUTH` guard appears here.

A1-A3 are client-side variants and are drawn where they change the editing sequence. E1 (editor initialization) and E2 (network) are client-only and are shown at `UI`. E3 and E4 are terminal early exits at the problem lookup.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | S1-S10 | Entire diagram; S10 end state is stated in the final note |
| A1 | A1 | `opt A1` at S4 |
| A2 | A2 | `alt A2` at S7 |
| A3 | A3 | `else A3` at S7 |
| E1 | E1 | `alt E1` at S3 |
| E2 | - | Client-only note at UI during page and editor-resource loading |
| E3 | E3 | `break E3` at S2 |
| E4 | E4 | `break E4` at S2 |

## 3. Diagram

```plantuml
@startuml SD-UC-U-P-01
title UC-U-P-01 - Write Solution\nClient-side source editor over a published problem
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
participant "HTTP API" as API #D5E8D4
participant "Problem Catalog" as PROB #D5E8D4
database "PostgreSQL" as DB #FFF2CC

User -> UI : S1 open source code editor for a problem
UI -> API : S2 GET /api/v1/problems/{problem_id}/editor
note right of UI
  E2 - ERR-NET-001 - network error:
  the page or editor resources fail to load; UI cannot
  confirm the problem context. User may refresh when the
  connection is restored. Client-only; use case ends if
  continuing is impossible.
end note
API -> PROB : S2 getProblemContext(problem_id)
PROB -> DB : S2 SELECT problem WHERE id
DB --> PROB : problem row or none
break E3 - ERR-RES-001 - problem not found (S2)
  PROB --> API : ERR-RES-001
  API --> UI : 404 {code: ERR-RES-001}
  note right of PROB : The writing environment is not initialized.
  UI --> User : E3 notify problem does not exist or is no longer available
  note over User, UI : User may return to the problem list. Use case ends.
end
PROB -> PROB : S2 check ACTIVE and PUBLISHED
break E4 - ERR-PERM-001 - problem not publicly accessible (S2)
  PROB --> API : ERR-PERM-001
  API --> UI : 403 {code: ERR-PERM-001}
  note right of PROB : The problem content and writing environment are not provided.
  UI --> User : E4 notify problem is not available
  note over User, UI : Use case ends.
end
PROB --> API : problem context {supported_languages, limits}
API --> UI : 200 {supported_languages, limits}
UI -> UI : S3 initialize source code editor
alt E1 - ERR-SYS-008 - editor initialization error (S3)
  UI -> UI : E1 log initialization failure with request_id
  UI --> User : E1 notify source code editor cannot be loaded
  note over User, UI : No submission is created. User may refresh or retry later. Use case ends.
else editor initialized
  UI -> UI : S4 load initial source code or language template
  opt A1 - Edit Existing Source Code (S4)
    UI --> User : A1 display existing source code from the current session
    note right of UI : No server interaction. Continues at S7.
  end
  note right of UI : If no existing source, display the language template or an empty editor.
  loop until User completes writing or leaves the editor
    User -> UI : S5 input or modify source code
    UI -> UI : S6 update editor content
    alt A2 - Clear Source Code (S7)
      User -> UI : A2 select clear all source code
      UI --> User : A2 request confirmation
      User -> UI : A2 confirm
      UI -> UI : A2 clear editor content
      note right of UI : No submission is created. Continues at S5.
    else A3 - Restore Default Template (S7)
      User -> UI : A3 select restore sample source code
      UI -> UI : A3 load template for the selected language
      UI --> User : A3 display template and request confirmation
      User -> UI : A3 confirm replacement
      UI -> UI : A3 replace editor content
      note right of UI : No submission is created. Continues at S5.
    else continue editing
      User -> UI : S7 continue editing until the solution is complete
      note right of UI : The editor never executes or evaluates source code.
    end
  end
  User -> UI : S8 open programming language selection
  UI -> UI : S8 navigate to UC-U-P-02
  User -> UI : S9 select Submit Solution
  UI -> UI : S9 navigate to UC-U-P-03 with current source and language
  note over User, UI : S10 use case ends. No submission is created by writing or editing.
end
@enduml
```

## 4. Notes

- Writing and editing never create a submission; the source remains in the browser session until UC-U-P-03 submits it.
- An Administrator inherits the User behavior; only `User` is drawn.
- The editor is a client-side component and never executes or evaluates the source. Source code is never written to logs.
- The problem context is a public read. Only `ACTIVE` and `PUBLISHED` problems are opened, and hidden test data is not returned.
- The `/editor` endpoint is an architectural placeholder until the REST API specification is approved.
- A1-A3 are session-local actions. The server interaction is limited to the initial problem lookup.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
