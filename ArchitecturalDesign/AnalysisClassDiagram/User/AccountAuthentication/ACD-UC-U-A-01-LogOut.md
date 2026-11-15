# Analysis Class Diagram - UC-U-A-01 - Log Out

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-U-A-01 - Log Out](../../../SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-01-LogOut.md) |

```plantuml
@startuml ACD-UC-U-A-01
title UC-U-A-01 - Log Out
left to right direction

actor User
class "User Interface" as UserInterface <<Boundary>> {
  authenticationState
  cachedAccountInformation
  confirmLogout()
  clearAuthenticationInformation()
  resetAuthenticationState()
  navigateToHome()
  showGuestNavigation()
  showNetworkError()
}

User --> UserInterface
@enduml
```
