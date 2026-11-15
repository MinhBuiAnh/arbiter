# Analysis Class Diagram - UC-U-A-04 - Change Password - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-U-A-04-X - Change Password - Exceptions](../../../SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-04-ChangePassword-Exceptions.md) |

```plantuml
@startuml ACD-UC-U-A-04-X
title UC-U-A-04 - Change Password - Exceptions
left to right direction

actor User
class "User Interface" as UserInterface <<Boundary>> {
  authenticationState
  showRateLimitNotice()
  clearAuthenticationInformation()
  showNetworkOutcomeUnknown()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  checkRequestRateLimit()
  changePassword()
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  validateAccessToken()
  checkAccountAvailability()
}
class "Account" as Account <<Entity>> {
  accountId
  credentialVerifier
  credentialChangedAt
  status
}

User --> UserInterface
UserInterface --> ApplicationAPI
ApplicationAPI --> AccountAndAuth
AccountAndAuth --> Account
@enduml
```
