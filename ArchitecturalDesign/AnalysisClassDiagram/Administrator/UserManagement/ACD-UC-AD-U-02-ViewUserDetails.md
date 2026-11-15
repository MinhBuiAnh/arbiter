# Analysis Class Diagram - UC-AD-U-02 - View User Details

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-AD-U-02 - View User Details](../../../SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-02-ViewUserDetails.md) |

```plantuml
@startuml ACD-UC-AD-U-02
title UC-AD-U-02 - View User Details
left to right direction

actor Administrator
class "Administrator Interface" as AdministratorInterface <<Boundary>> {
  selectedUserId
  displayedProfile
  displayedActivity
  requestUserDetails()
  displayReadOnlyDetails()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  getUserDetails(userId)
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  validateAccessToken()
  authorizeAdministrator()
  getAccountProfile(userId)
}
class "Progress and Leaderboard" as ProgressAndLeaderboard <<Control>> {
  getUserActivitySummary(userId)
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  readCommittedAccountProfile(userId)
  readUserActivitySummary(userId)
}
class "Account" as Account <<Entity>> {
  userId
  username
  email
  displayName
  status
}
class "User Statistics" as UserStatistics <<Entity>> {
  attemptedCount
  solvedCount
  recentActivity
}

Administrator --> AdministratorInterface
AdministratorInterface --> ApplicationAPI
ApplicationAPI --> AccountAndAuth
ApplicationAPI --> ProgressAndLeaderboard
AccountAndAuth --> PersistenceInterface
AccountAndAuth --> Account
ProgressAndLeaderboard --> PersistenceInterface
ProgressAndLeaderboard --> UserStatistics
@enduml
```
