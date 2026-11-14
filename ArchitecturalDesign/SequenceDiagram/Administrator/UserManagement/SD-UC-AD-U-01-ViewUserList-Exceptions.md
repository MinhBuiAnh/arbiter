# Sequence Diagram - UC-AD-U-01 - View User List - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-AD-U-01-X |
| Use Case | UC-AD-U-01 - View User List |
| Use Case Specification | [UC-AD-U-01-ViewUserList.md](../../../../RequirementAnalysis/UCSpec/Administrator/UserManagement/UC-AD-U-01-ViewUserList.md) |
| Primary Actor(s) | Administrator |
| Related Requirements | FR-ADMIN-01, FR-ADMIN-02, NFR-SEC-10 |
| Scope | E7; primary flow in [SD-UC-AD-U-01](SD-UC-AD-U-01-ViewUserList.md) |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2026-11-14 |

## 1. Scope

Supplement for a client-side network interruption while loading a user page.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Primary | - | [SD-UC-AD-U-01](SD-UC-AD-U-01-ViewUserList.md) |
| E7 | E7 | Client-only network outcome group at request/response |

## 3. Diagram

```plantuml
@startuml SD-UC-AD-U-01-X
title UC-AD-U-01 - View User List - Exceptions\nNetwork interruption without stale success
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

actor "Administrator" as Admin #F5F5F5
participant "React SPA" as UI #DAE8FC
participant "HTTP API" as API #D5E8D4

ref over Admin, API : UC-AD-U-01 - View User List
group E7 - ERR-NET-001 - list request/response interrupted (2)
  UI -> API : request filtered user page
  API --> UI : response not received or timed out
  UI -> UI : mark page unavailable; do not show stale data as current
  UI --> Admin : notify list could not be loaded; allow retry
  note over Admin, UI : Use case ends for this request.
end
@enduml
```

## 4. Notes

- No account data is modified by this flow.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial exception supplement. |
