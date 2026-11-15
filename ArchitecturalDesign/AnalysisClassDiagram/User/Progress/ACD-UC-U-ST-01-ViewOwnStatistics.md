# Analysis Class Diagram - UC-U-ST-01 - View Own Statistics

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-U-ST-01 - View Own Statistics](../../../SequenceDiagram/User/Progress/SD-UC-U-ST-01-ViewOwnStatistics.md) |

```plantuml
@startuml ACD-UC-U-ST-01
title UC-U-ST-01 - View Own Statistics
left to right direction

actor User
class "User Interface" as UserInterface <<Boundary>> {
  displayedStatistics
  recentSubmissions
  requestOwnStatistics()
  displayStatistics()
  displayEmptyState()
  openRecentSubmission()
  refreshStatistics()
}
class "Application API" as ApplicationAPI <<Boundary>> {
  getOwnStatistics()
}
class "Account and Auth" as AccountAndAuth <<Control>> {
  validateAccessToken()
  checkAccountActive(userId)
}
class "Progress and Leaderboard" as ProgressAndLeaderboard <<Control>> {
  getOwnStatistics(userId)
  calculateAttemptedAndSolvedCounts()
  calculateAcceptanceRate()
  calculateDifficultyBreakdown()
  calculateTagBreakdown()
  assembleRecentSubmissions()
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  readAccountStatus(userId)
  readSubmissionAndProblemAggregates(userId)
}
class "Account" as Account <<Entity>> {
  userId
  status
}
class "Submission" as Submission <<Entity>> {
  submissionId
  userId
  problemId
  status
  verdict
  language
  createdAt
}
class "Problem" as Problem <<Entity>> {
  problemId
  title
  difficulty
  tags
  archiveStatus
}
class "User Statistics" as UserStatistics <<Entity>> {
  attemptedCount
  solvedCount
  acceptanceRate
  difficultyBreakdown
  tagBreakdown
  recentSubmissions
}

User --> UserInterface
UserInterface --> ApplicationAPI
ApplicationAPI --> AccountAndAuth
ApplicationAPI --> ProgressAndLeaderboard
AccountAndAuth --> PersistenceInterface
AccountAndAuth --> Account
ProgressAndLeaderboard --> PersistenceInterface
ProgressAndLeaderboard --> Submission
ProgressAndLeaderboard --> Problem
ProgressAndLeaderboard --> UserStatistics
@enduml
```
