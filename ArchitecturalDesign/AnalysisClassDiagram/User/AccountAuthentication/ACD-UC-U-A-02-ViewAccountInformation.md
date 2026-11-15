# Analysis Class Diagram - UC-U-A-02 - View Account Information

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-U-A-02 - View Account Information](../../../SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-02-ViewAccountInformation.md) |

```plantuml
@startuml ACD-UC-U-A-02
title UC-U-A-02 - View Account Information
left to right direction

actor User
class "User Interface" as UserInterface <<Boundary>> {
  displayedAccountInformation
  requestAccountInformation()
  displayAccountInformation()
  navigateToLogin()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  getOwnAccountInformation()
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  validateAccessToken()
  resolvePrincipal()
  getAccount(userId)
  removeSensitiveFields()
}
class "Account" as Account <<Entity>> {
  userId
  username
  email
  displayName
  bio
  createdAt
  status
}

User --> UserInterface
UserInterface --> ApplicationAPI
ApplicationAPI --> AccountAndAuth
AccountAndAuth --> Account
@enduml
```
