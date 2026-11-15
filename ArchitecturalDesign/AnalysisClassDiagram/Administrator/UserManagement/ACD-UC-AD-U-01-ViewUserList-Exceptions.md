# Analysis Class Diagram - UC-AD-U-01 - View User List - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-AD-U-01-X - View User List - Exceptions](../../../SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-01-ViewUserList-Exceptions.md) |

```plantuml
@startuml ACD-UC-AD-U-01-X
title UC-AD-U-01 - View User List - Exceptions
left to right direction

actor Administrator
class "Administrator Interface" as AdministratorInterface <<Boundary>> {
  currentFilters
  currentPage
  markPageUnavailable()
  retryUserListRequest()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  getUserList()
}

Administrator --> AdministratorInterface
AdministratorInterface --> ApplicationAPI
@enduml
```
