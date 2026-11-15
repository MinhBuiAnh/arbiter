# Analysis Class Diagram - UC-G-02 - Log In

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-G-02 - Log In](../../SequenceDiagram/GuestCommon/SD-UC-G-02-Login.md) |

```plantuml
@startuml ACD-UC-G-02
title UC-G-02 - Log In
left to right direction

actor Guest
class "User Interface" as UserInterface <<Boundary>> {
  identifier
  displayLoginForm()
  submitLogin()
  showLoginError()
  storeAuthenticationResult()
  navigateAfterLogin()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  login()
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  login()
  verifyCredential()
  checkAccountStatus()
  issueAccessToken()
}
class "Account" as Account <<Entity>> {
  accountId
  username
  email
  credentialVerifier
  role
  status
}

Guest --> UserInterface
UserInterface --> ApplicationAPI
ApplicationAPI --> AccountAndAuth
AccountAndAuth --> Account
@enduml
```
