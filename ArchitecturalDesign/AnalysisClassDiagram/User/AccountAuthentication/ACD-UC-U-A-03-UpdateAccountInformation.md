# Analysis Class Diagram - UC-U-A-03 - Update Account Information

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-U-A-03 - Update Account Information](../../../SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-03-UpdateAccountInformation.md) |

```plantuml
@startuml ACD-UC-U-A-03
title UC-U-A-03 - Update Account Information
left to right direction

actor User
class "User Interface" as UserInterface <<Boundary>> {
  displayName
  bio
  email
  username
  displayUpdateForm()
  submitAccountChanges()
  showFieldErrors()
  updateDisplayedInformation()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  updateAccountInformation()
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  validateAccessToken()
  updateAccount(userId, submittedFields)
  validateAccountInformation()
  checkEmailAvailability()
  saveAccountChanges()
}
class "Account" as Account <<Entity>> {
  userId
  username
  email
  displayName
  bio
}

User --> UserInterface
UserInterface --> ApplicationAPI
ApplicationAPI --> AccountAndAuth
AccountAndAuth --> Account
@enduml
```
