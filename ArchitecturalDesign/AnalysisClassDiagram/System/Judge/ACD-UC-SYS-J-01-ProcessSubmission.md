# Analysis Class Diagram - UC-SYS-J-01 - Process Submission

| Field | Value |
|-------|-------|
| Sequence Diagram | [SD-UC-SYS-J-01 - Process Submission](../../../SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission.md) |

```plantuml
@startuml ACD-UC-SYS-J-01
title UC-SYS-J-01 - Process Submission
left to right direction

class "Judge Worker" as JudgeWorker <<Control>> {
  messageId
  submissionId
  processSubmission()
  validateConfiguration()
  compileSubmission()
  executeTestCases()
  determineVerdict()
  persistResult()
  acknowledgeMessage()
  cleanTemporaryResources()
}
class "Message Queue Interface" as MessageQueueInterface <<Boundary>> {
  readSubmission()
  acknowledgeMessage(messageId)
}
class "Persistence Interface" as PersistenceInterface <<Boundary>> {
  loadSubmissionContext(submissionId)
  updateStatus(submissionId, status)
  persistTerminalResult(submissionId)
}
class "Protected Test Case Store Interface" as ProtectedTestCaseStoreInterface <<Boundary>> {
  readTestCase(testCaseId)
}
class "Execution Environment Interface" as ExecutionEnvironmentInterface <<Boundary>> {
  compile(source, language)
  executeTestCase(testCase, limits)
  removeExecutionResource()
}
class "Submission" as Submission <<Entity>> {
  submissionId
  source
  language
  status
  verdict
  judgeAttempts
  runtime
  peakMemory
}
class "Problem" as Problem <<Entity>> {
  problemId
  allowedLanguages
  timeLimit
  memoryLimit
}
class "Test Case" as TestCase <<Entity>> {
  testCaseId
  ordinal
  input
  expectedOutput
}
class "Test Case Result" as TestCaseResult <<Entity>> {
  testCaseId
  outcome
  runtime
  peakMemory
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
