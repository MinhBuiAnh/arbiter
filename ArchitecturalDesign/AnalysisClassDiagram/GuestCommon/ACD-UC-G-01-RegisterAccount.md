# Analysis Class Diagram - UC-G-01 - Register Account

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-G-01 - Register Account](../../SequenceDiagram/GuestCommon/SD-UC-G-01-RegisterAccount.md) |

```plantuml
@startuml ACD-UC-G-01
title UC-G-01 - Register Account
left to right direction

actor Guest
class "User Interface" as UserInterface <<Boundary>> {
  username
  email
  displayRegistrationForm()
  submitRegistration()
  showValidationErrors()
  showSuccess()
  navigateToLogin()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  registerAccount()
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  registerAccount()
  validateRegistrationData()
  checkIdentifierAvailability()
  createCredentialVerifier()
  createAccount()
}
class "Account" as Account <<Entity>> {
  accountId
  username
  email
  credentialVerifier
  status
}

Guest --> UserInterface
UserInterface --> ApplicationAPI
ApplicationAPI --> AccountAndAuth
AccountAndAuth --> Account
@enduml
```
