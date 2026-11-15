# Analysis Class Diagram - UC-U-A-04 - Change Password

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-U-A-04 - Change Password](../../../SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-04-ChangePassword.md) |

```plantuml
@startuml ACD-UC-U-A-04
title UC-U-A-04 - Change Password
left to right direction

actor User
class "User Interface" as UserInterface <<Boundary>> {
  passwordChangeFormState
  displayPasswordChangeForm()
  submitPasswordChange()
  showFieldErrors()
  clearAuthenticationInformation()
  navigateToLogin()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  changePassword()
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  validateAccessToken()
  changePassword(userId)
  verifyCurrentCredential()
  validateNewCredential()
  createCredentialVerifier()
  updateCredentialChangeTime()
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
