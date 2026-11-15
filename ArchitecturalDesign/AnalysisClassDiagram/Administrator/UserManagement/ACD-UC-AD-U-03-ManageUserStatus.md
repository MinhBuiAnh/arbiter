# Analysis Class Diagram - UC-AD-U-03 - Manage User Status

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-AD-U-03 - Manage User Status](../../../SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-03-ManageUserStatus.md) |

```plantuml
@startuml ACD-UC-AD-U-03
title UC-AD-U-03 - Manage User Status
left to right direction

actor Administrator
class "Administrator Interface" as AdministratorInterface <<Boundary>> {
  userId
  requestedStatus
  loadedVersion
  requestStatusChange()
  confirmStatusChange()
  displayUpdatedStatus()
  reloadAccountStatus()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  getAccountStatus()
  changeAccountStatus()
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  validateAccessToken()
  authorizeAdministrator()
  validateStatusAction()
  preventSelfStatusChange()
  compareStatusVersion()
  changeAccountStatus()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  readAccountStatus()
  saveAccountStatus()
}
class "Account" as Account <<Entity>> {
  userId
  status
  version
  statusChangedAt
  actingAdministratorId
}

Administrator --> AdministratorInterface
AdministratorInterface --> ApplicationAPI
ApplicationAPI --> AccountAndAuth
AccountAndAuth --> PersistenceInterface
AccountAndAuth --> Account
@enduml
```
