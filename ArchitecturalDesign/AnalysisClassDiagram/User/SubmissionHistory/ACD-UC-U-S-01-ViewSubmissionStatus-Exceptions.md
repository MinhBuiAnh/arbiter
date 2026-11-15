# Analysis Class Diagram - UC-U-S-01 - View Submission Status - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-U-S-01-X - View Submission Status - Exceptions](../../../SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-01-ViewSubmissionStatus-Exceptions.md) |

```plantuml
@startuml ACD-UC-U-S-01-X
title UC-U-S-01 - View Submission Status - Exceptions
left to right direction

actor User
class "User Interface" as UserInterface <<Boundary>> {
  authenticationState
  displayedStatus
  requestStatus()
  pausePolling()
  showRefreshError()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  checkRequestRateLimit()
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  validateAccessToken()
  checkAccountActive(userId)
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  readAccountStatus(userId)
}
class "Account" as Account <<Entity>> {
  userId
  status
}

User --> UserInterface
UserInterface --> ApplicationAPI
ApplicationAPI --> AccountAndAuth
AccountAndAuth --> PersistenceInterface
AccountAndAuth --> Account
@enduml
```
