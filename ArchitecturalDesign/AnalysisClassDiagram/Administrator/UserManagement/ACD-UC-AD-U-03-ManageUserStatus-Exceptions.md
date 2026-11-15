# Analysis Class Diagram - UC-AD-U-03 - Manage User Status - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-AD-U-03-X - Manage User Status - Exceptions](../../../SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-03-ManageUserStatus-Exceptions.md) |

```plantuml
@startuml ACD-UC-AD-U-03-X
title UC-AD-U-03 - Manage User Status - Exceptions
left to right direction

actor Administrator
class "Administrator Interface" as AdministratorInterface <<Boundary>> {
  userId
  loadedVersion
  statusChangeOutcome
  changeAccountStatus()
  reloadAccountDetails()
  verifyStoredStatus()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  changeAccountStatus()
  getAccountDetails()
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  updateAccountStatus()
  handlePersistenceFailure()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  saveAccountStatus()
  readAccountDetails()
}
class "Account" as Account <<Entity>> {
  userId
  status
  version
}

Administrator --> AdministratorInterface
AdministratorInterface --> ApplicationAPI
ApplicationAPI --> AccountAndAuth
AccountAndAuth --> PersistenceInterface
AccountAndAuth --> Account
@enduml
```
