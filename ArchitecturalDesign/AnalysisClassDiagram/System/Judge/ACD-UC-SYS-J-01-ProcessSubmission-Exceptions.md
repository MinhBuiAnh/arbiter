# Analysis Class Diagram - UC-SYS-J-01 - Process Submission - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-SYS-J-01-X - Process Submission - Exceptions](../../../SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md) |

```plantuml
@startuml ACD-UC-SYS-J-01-X
title UC-SYS-J-01 - Process Submission - Exceptions
left to right direction

class "Judge Worker" as JudgeWorker <<Control>> {
  messageId
  submissionId
  handleInfrastructureFailure()
  leaveMessagePending()
  persistInternalError()
  acknowledgeAfterCommit()
  handleUnexpectedError()
  cleanFailedResources()
}
class "Message Queue Interface" as MessageQueueInterface <<Boundary>> {
  readSubmission()
  acknowledgeMessage(messageId)
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  loadSubmission(submissionId)
  persistInternalError(submissionId, reason)
  rollBackUncommittedChanges()
}
class "Protected Test Case Store Interface" as ProtectedTestCaseStoreInterface <<Boundary>> {
  readTestCaseData(testCaseId)
}
class "Execution Environment Interface" as ExecutionEnvironmentInterface <<Boundary>> {
  createExecutionResource()
  removeExecutionResource()
}
class "Submission" as Submission <<Entity>> {
  submissionId
  status
  verdict
  judgeAttempts
}
class "Problem" as Problem <<Entity>> {
  problemId
}
class "Test Case" as TestCase <<Entity>> {
  testCaseId
  ordinal
}
class "Test Case Result" as TestCaseResult <<Entity>> {
  testCaseId
  outcome
}

JudgeWorker --> MessageQueueInterface
JudgeWorker --> PersistenceInterface
JudgeWorker --> ProtectedTestCaseStoreInterface
JudgeWorker --> ExecutionEnvironmentInterface
JudgeWorker --> Submission
JudgeWorker --> Problem
JudgeWorker --> TestCase
JudgeWorker --> TestCaseResult
@enduml
```
