# Analysis Class Diagram - UC-AD-U-01 - View User List

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-AD-U-01 - View User List](../../../SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-01-ViewUserList.md) |

```plantuml
@startuml ACD-UC-AD-U-01
title UC-AD-U-01 - View User List
left to right direction

actor Administrator
class "Administrator Interface" as AdministratorInterface <<Boundary>> {
  searchKeyword
  statusFilter
  currentPage
  pageSize
  requestUserList()
  displayUserSummaries()
  displayEmptyPage()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  getUserList()
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  validateAccessToken()
  authorizeAdministrator()
  validateSearchAndFilters()
  validatePagination()
  getUserSummaries()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  queryMatchingAccounts()
}
class "Account" as Account <<Entity>> {
  userId
  username
  email
  displayName
  status
}

Administrator --> AdministratorInterface
AdministratorInterface --> ApplicationAPI
ApplicationAPI --> AccountAndAuth
AccountAndAuth --> PersistenceInterface
AccountAndAuth --> Account
@enduml
```
