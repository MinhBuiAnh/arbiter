# Sequence Diagram - UC-SYS-J-01 - Process Submission - Exceptions

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-SYS-J-01-X |
| Use Case | UC-SYS-J-01 - Process Submission |
| Use Case Specification | [UC-SYS-J-01-ProcessSubmission.md](../../../../RequirementAnalysis/UCSpec/System/Judge/UC-SYS-J-01-ProcessSubmission.md) |
| Primary Actor(s) | Judge Worker |
| Related Requirements | FR-JUDGE-03, FR-JUDGE-04, FR-JUDGE-12, FR-JUDGE-13, FR-JUDGE-16, FR-JUDGE-18, NFR-SEC-06 to NFR-SEC-09, NFR-REL-05 to NFR-REL-07 |
| Scope | E1-E4, E9-E10 |
| Version | 1.1 |
| Status | Draft |
| Last updated | 2026-11-18 |

## 1. Scope

This supplement covers infrastructure failures that leave a job pending, missing Test Case data that produces a durable `INTERNAL_ERROR`, worker termination before acknowledgement, and unexpected errors. Verdict outcomes and durable result handling remain in the [primary diagram](SD-UC-SYS-J-01-ProcessSubmission.md).

## 2. Scenario Coverage

Flows not listed here are covered by the primary diagram.

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| E1 | E1 | `group E1` at S1 or a post-cleanup acknowledgement |
| E2 | E2 | `group E2` at S2, S7, S13, or S27 |
| E3 | E3 | `group E3` at S9, S15, or S17 |
| E4 | E4 | `group E4` at S2 or S22 |
| E9 | E9 | `group E9` before S29 acknowledgement |
| E10 | E10 | `group E10` at any step |

## 3. Diagram

```plantuml
@startuml SD-UC-SYS-J-01-X
title UC-SYS-J-01 - Process Submission - Exceptions\nUnavailable infrastructure and unacknowledged work
hide footbox
autonumber "<b>[00]"
skinparam shadowing false
skinparam responseMessageBelowArrow true
skinparam maxMessageSize 140
skinparam defaultFontName "Helvetica"
skinparam defaultFontSize 12
skinparam ParticipantPadding 12
skinparam BoxPadding 8
skinparam NoteBackgroundColor #FFF9C4
skinparam NoteBorderColor #D6B656
skinparam sequence {
  ArrowColor #333333
  ActorBorderColor #333333
  LifeLineBorderColor #999999
  LifeLineBackgroundColor #FFFFFF
}

database "PostgreSQL" as DB #FFF2CC
participant "Test Case Store" as FS #FFF2CC
queue "Redis Streams" as QUEUE #FFE6CC
participant "Judge Worker" as WK #E1D5E7
participant "Docker Engine" as DOCKER #E1D5E7
participant "ResourceCleaner" as CLEANER #E1D5E7
participant "ExecutionEnvironment\n(interface)" as EXECUTION #FFF2CC

ref over DB, FS, QUEUE, WK, DOCKER : UC-SYS-J-01 - Process Submission

group E1 - ERR-SYS-002 - Redis unavailable (S1)
  WK -> QUEUE : E1 XREADGROUP judge-workers judge:submissions
  QUEUE -x WK : E1 stream read or connection fails
  WK -> WK : E1 leave submission unchanged and retry with exponential backoff
  note right of WK : No message is acknowledged. Log message_id and consumer group; alert if failure persists or backlog grows. Submission remains QUEUED.
  note over QUEUE, WK : Use case ends for this read attempt.
end

group E1 - ERR-SYS-002 - XACK fails after cleanup
  WK -> QUEUE : E1 XACK terminal message
  QUEUE -x WK : E1 acknowledgement fails
  WK -> WK : leave message pending; preserve the committed result
  note right of WK : UC-SYS-J-02 reclaims the message, retries targeted cleanup, and does not judge a terminal Submission again.
end

group E2 - ERR-SYS-003 - PostgreSQL unavailable (S2, S7, S13, or S27)
  WK -> DB : E2 load submission or commit attempt, status, or result
  DB -x WK : E2 database read or write fails
  WK -> WK : E2 roll back open transaction and leave message unacknowledged
  note right of WK : No partial state or result is committed. Log message_id and submission_id; retry by policy and recover if pending.
  note over DB, WK : Use case ends for this attempt.
end

group E3 - ERR-SYS-004 - Docker Engine or container failure (S9, S15, or S17)
  WK -> DOCKER : E3 create, start, or wait for compile/execution container
  DOCKER -x WK : E3 engine or container operation fails
  WK -> DOCKER : E3 remove any container created for this attempt
  DOCKER --> WK : cleanup attempted
  WK -> WK : E3 leave message unacknowledged; do not record a program verdict
  note right of WK : Log message_id and submission_id; alert if failure persists. UC-SYS-J-02 retries and records INTERNAL_ERROR after the attempt limit.
  ref over WK, DB, QUEUE, DOCKER : UC-SYS-J-02 - Recover Pending Submission
end

group E4 - ERR-RES-002 - Test Case data missing or unreadable (S2 or S22)
  WK -> FS : E4 read required Test Case input or expected output
  FS --> WK : E4 file missing or unreadable
  WK -> WK : E4 stop judging and stage INTERNAL_ERROR; never ACCEPTED
  group Transaction (atomic)
    WK -> DB : E4 persist INTERNAL_ERROR and Test Case data unavailable reason (tx)
    DB --> WK : terminal result committed
  end
  WK -> CLEANER : E4 CleanFailedResources(ctx, submissionID)
  CLEANER -> EXECUTION : Cleanup(ctx, submissionID)
  EXECUTION --> CLEANER : cleanup outcome
  alt cleanup fails (ERR-SYS-006)
    CLEANER --> WK : error
    WK -> WK : leave message pending
    note right of WK : UC-SYS-J-02 retries cleanup without judging the terminal Submission again.
  else cleanup succeeds
    CLEANER --> WK : success
    WK -> QUEUE : E4 XACK after commit and cleanup
  end
  note right of WK : Log message_id, submission_id, and Test Case ID; never log file contents.
end

group E9 - ERR-SYS-007 - Judge Worker terminated before acknowledgement (before S29)
  note over DB, QUEUE, WK
    If S27 committed but cleanup or acknowledgement did not complete, the terminal result remains valid and the message stays pending.
    If S27 did not commit, the Submission may remain COMPILING or RUNNING.
    No acknowledgement is sent by the terminated worker.
    Monitoring alerts that the worker stopped processing an in-flight message.
  end note
  ref over DB, QUEUE, WK, CLEANER : UC-SYS-J-02 - Recover Pending Submission
  note right of WK : Current worker attempt ends; recovery handles the pending message.
end

group E10 - ERR-SYS-001 - unexpected internal error (any step)
  WK -> WK : E10 stop affected operation; log submission_id and message_id
  note right of WK : Monitoring alerts on the failure.
  alt safe INTERNAL_ERROR result can be committed
    group Transaction (atomic)
      WK -> DB : E10 persist INTERNAL_ERROR (tx)
      DB --> WK : terminal result committed
    end
    WK -> CLEANER : E10 CleanFailedResources(ctx, submissionID)
    CLEANER -> EXECUTION : Cleanup(ctx, submissionID)
    EXECUTION --> CLEANER : cleanup outcome
    alt cleanup fails (ERR-SYS-006)
      CLEANER --> WK : error
      WK -> WK : leave message pending
      note right of WK : UC-SYS-J-02 retries cleanup without judging the terminal Submission again.
    else cleanup succeeds
      CLEANER --> WK : success
      WK -> QUEUE : E10 XACK after commit and cleanup
      QUEUE --> WK : acknowledged
    end
    note right of WK : Use case ends.
  else no safe terminal result can be committed
    WK -> WK : E10 leave message pending; do not record an unsupported result
    note right of WK : Monitoring alerts. UC-SYS-J-02 handles the pending message; current attempt ends.
  end
end
@enduml
```

## 4. Notes

- Each group is an independent failure branch. Failed reads, writes, or container operations never create a user-code verdict.
- E4 records the missing-data condition as `INTERNAL_ERROR`; acknowledgement follows successful cleanup, and a cleanup failure leaves the message pending.
- E9 distinguishes a committed result from a failed result transaction. Recovery checks the durable Submission state before acting.
- No source code, hidden Test Case contents, tokens, secrets, or container internals are logged.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial exception supplement. |
| 1.1 | 2026-11-18 | Keep messages pending when targeted cleanup or acknowledgement fails. |
