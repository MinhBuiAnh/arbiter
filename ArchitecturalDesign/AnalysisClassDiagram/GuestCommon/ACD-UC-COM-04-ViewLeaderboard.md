# Analysis Class Diagram - UC-COM-04 - View Leaderboard

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-COM-04 - View Leaderboard](../../SequenceDiagram/GuestCommon/SD-UC-COM-04-ViewLeaderboard.md) |

```plantuml
@startuml ACD-UC-COM-04
title UC-COM-04 - View Leaderboard
left to right direction

actor Guest
class "User Interface" as UserInterface <<Boundary>> {
  currentPage
  pageSize
  viewAnotherPage()
  refreshLeaderboard()
  displayLeaderboard()
  displayEmptyState()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  getLeaderboard(page, pageSize)
}
class "Progress and Leaderboard" as ProgressAndLeaderboard <<Control>> {
  getLeaderboard(page, pageSize)
  rankEntries()
}
class "Account" as Account <<Entity>> {
  username
  displayName
  status
}
class "Submission" as Submission <<Entity>>
class "Leaderboard Entry" as LeaderboardEntry <<Entity>> {
  username
  displayName
  solvedCount
  submissionCount
  acceptanceRate
}

Guest --> UserInterface
UserInterface --> ApplicationAPI
ApplicationAPI --> ProgressAndLeaderboard
ProgressAndLeaderboard --> Account
ProgressAndLeaderboard --> Submission
ProgressAndLeaderboard --> LeaderboardEntry
@enduml
```
