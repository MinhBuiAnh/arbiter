# Analysis Class Diagram - UC-SYS-J-02 - Recover Pending Submission

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-SYS-J-02 - Recover Pending Submission](../../../SequenceDiagram/System/Judge/SD-UC-SYS-J-02-RecoverPendingSubmission.md) |

```plantuml
@startuml ACD-UC-SYS-J-02
title UC-SYS-J-02 - Recover Pending Submission
left to right direction

class "Judge Worker" as JudgeWorker <<Control>> {
  selectEligibleMessages()
  recoverPendingSubmissions()
  inspectSubmission()
  resetInterruptedSubmission()
  markAttemptLimitReached()
  delegateToProcessSubmission()
  scheduleOrphanCleanup()
  cleanTemporaryWorkspaces()
  waitForNextCycle()
}
class "Message Queue Interface" as MessageQueueInterface <<Boundary>> {
  listPendingMessages()
  claimMessage(messageId)
  acknowledgeMessage(messageId)
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  loadSubmissionStatus(submissionId)
  resetToQueued(submissionId)
  markInternalError(submissionId, reason)
}
class "Execution Environment Interface" as ExecutionEnvironmentInterface <<Boundary>> {
  removeOrphanedExecutionResources()
}
class "Submission" as Submission <<Entity>> {
  submissionId
  status
  judgeAttempts
}

JudgeWorker --> MessageQueueInterface
JudgeWorker --> PersistenceInterface
JudgeWorker --> ExecutionEnvironmentInterface
JudgeWorker --> Submission
@enduml
```
