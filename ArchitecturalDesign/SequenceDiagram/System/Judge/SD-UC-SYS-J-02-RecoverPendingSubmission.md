# Sequence Diagram - UC-SYS-J-02 - Recover Pending Submission

| Field | Value |
|-------|-------|
| Sequence Diagram ID | SD-UC-SYS-J-02 |
| Use Case | UC-SYS-J-02 - Recover Pending Submission |
| Use Case Specification | [UC-SYS-J-02-RecoverPendingSubmission.md](../../../../RequirementAnalysis/UCSpec/System/Judge/UC-SYS-J-02-RecoverPendingSubmission.md) |
| Primary Actor(s) | Judge Worker |
| Related Requirements | FR-JUDGE-13, FR-JUDGE-14, FR-JUDGE-16, FR-JUDGE-18, NFR-REL-01, NFR-REL-03 to NFR-REL-07 |
| Scope | Main flow S1-S11, A1-A5, E1-E4 |
| Version | 1.1 |
| Status | Draft |
| Last updated | 2026-11-18 |

## 1. Scope

This diagram covers querying and claiming idle pending messages, checking each Submission's durable state and attempt count, resetting eligible interrupted work, delegating another attempt to UC-SYS-J-01, and cleaning orphaned resources.

The queue remains the delivery mechanism, not the source of truth. No message is acknowledged before the associated safe outcome is durable.

## 2. Scenario Coverage

| Flow | Coverage | Diagram element / disposition |
|------|----------|-------------------------------|
| Main | S1-S11 | Entire diagram; S3-S8 repeat for each claimed message |
| A1 | A1 | `opt A1` when S1 returns no eligible messages |
| A2 | A2 | Queue response note at S2; unclaimed candidates are skipped |
| A3 | A3 | `alt A3` when S3 finds no Submission |
| A4 | A4 | `alt A4` when S4 finds a terminal Submission |
| A5 | A5 | `alt A5` when S5 finds attempts exhausted |
| E1 | E1 | `break E1` at S1/S2; `alt E1` for failed candidate acknowledgement at S9 |
| E2 | E2 | `alt E2` on a persistent-store operation at S3-S7 |
| E3 | E3 | `alt E3` during targeted cleanup at S9 or before retrying interrupted work |
| E4 | E4 | `break E4` for an unexpected error at any step |

## 3. Diagram

```plantuml
@startuml SD-UC-SYS-J-02
title UC-SYS-J-02 - Recover Pending Submission\nClaim, inspect, retry, and clean up
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
queue "Redis Streams" as QUEUE #FFE6CC
participant "Judge Worker" as WK #E1D5E7
participant "ResourceCleaner" as CLEANER #E1D5E7
participant "ExecutionEnvironment\n(interface)" as EXECUTION #FFF2CC

WK -> QUEUE : S1 XPENDING judge:submissions judge-workers
break E1 - ERR-SYS-002 - queue unavailable or claim failure (S1 or S2)
  QUEUE -x WK : E1 query or claim fails
  WK -> WK : E1 stop cycle, leave messages and Submission states unchanged
  note right of WK : No message is acknowledged. Log correlation and message/group identifiers; alert on persistent failure or growing backlog; retry with backoff.
end
break E4 - ERR-SYS-001 - unexpected recovery error (any step)
  WK -> WK : E4 stop affected operation and preserve any committed terminal result
  alt safe outcome is already durable
    WK -> QUEUE : E4 acknowledge only after the durable outcome
    note right of WK : Do not overwrite or replace the committed result.
  else no safe outcome is durable
    note right of WK : Do not acknowledge or commit a partial recovery result; leave the message pending for a later cycle.
  end
  note right of WK : Log correlation ID and message_id when available; monitoring records the failure. Affected operation ends.
end
QUEUE --> WK : pending message IDs and idle times, or none
WK -> WK : S1 select messages idle beyond the configured threshold
opt A1 - no pending messages exceed the idle threshold (S1)
  WK -> WK : A1 identify an empty recovery batch
  note over QUEUE, WK : No Submission is changed and there are no candidate IDs to clean. The cycle ends after waiting.
end
loop for each eligible pending message
  WK -> QUEUE : S2 XCLAIM judge:submissions judge-workers {message_id, idle threshold}
  break E1 - ERR-SYS-002 - queue claim failure (S2)
    QUEUE -x WK : E1 XCLAIM fails
    WK -> WK : E1 stop cycle, leave message pending, retry with backoff
    note right of WK : Log message/group identifiers; do not change Submission state.
  end
  QUEUE --> WK : claimed message {message_id, submission_id};\ncandidates claimed elsewhere are omitted
  note right of QUEUE : A2 - A competing consumer claimed the candidate. Continue with the next candidate; no second worker lifeline.
  alt E2 - ERR-SYS-003 - persistent store unavailable (S3-S7)
    WK -> DB : E2 load or update Submission recovery state
    DB -x WK : E2 database operation fails
    WK -> WK : E2 roll back and leave affected message unacknowledged
    note right of WK : No partial result is committed. Log correlation ID, message_id, and submission_id; monitor persistent failure and retry later. Current message ends.
  else A3 - associated Submission no longer exists (S3)
    WK -> DB : A3 load Submission WHERE id
    DB --> WK : no Submission row
    WK -> WK : add submission_id to cleanup candidates;\ndefer acknowledgement until cleanup succeeds
    note right of WK : Discard only the obsolete message; no Submission data exists to change.
    note over WK, QUEUE : Do not judge; cleanup then acknowledge at S9.
  else A4 - Submission is already terminal (S4)
    WK -> DB : A4 load Submission status
    DB --> WK : status is COMPLETED or INTERNAL_ERROR
    WK -> WK : add submission_id to cleanup candidates;\ndefer acknowledgement until cleanup succeeds
    note right of WK : Preserve the stored terminal result.
    note over WK, QUEUE : Do not judge again; cleanup then acknowledge at S9.
  else A5 - maximum of two attempts is reached (S5)
    WK -> DB : A5 load Submission status and judge_attempts
    group Transaction (atomic)
      WK -> DB : A5 set status INTERNAL_ERROR and persist attempt-limit reason (tx)
      DB --> WK : terminal state committed
    end
    WK -> WK : add submission_id to cleanup candidates;\ndefer acknowledgement until cleanup succeeds
    note right of WK : Do not submit another attempt; cleanup then acknowledge at S9.
  else attempts remain
    WK -> DB : S3 load Submission status and judge_attempts
    DB --> WK : non-terminal Submission row
    WK -> WK : S4-S5 confirm non-terminal status and compare attempts with maximum two
    group Transaction (atomic)
      WK -> DB : S6-S7 conditionally reset COMPILING/RUNNING to QUEUED (tx)
      DB --> WK : reset committed or no reset required
    end
    WK -> CLEANER : clean stale resources for this submission
    CLEANER -> EXECUTION : CleanFailedResources(ctx, submissionID)
    EXECUTION --> CLEANER : cleanup result
    alt stale-resource cleanup fails (ERR-SYS-006)
      CLEANER --> WK : error; leave message pending
      note right of WK : Do not start a new attempt until stale resources are removed.
    else stale resources removed
      CLEANER --> WK : success
      ref over WK, DB, QUEUE : S8 UC-SYS-J-01 - Process Submission
    end
  end
end
opt S9 - targeted candidates are present
  WK -> CLEANER : ScheduleOrphanCleanup(ctx, candidateSubmissionIDs)
  CLEANER -> CLEANER : RemoveOrphanedExecutionResources(ctx, candidates)
  loop each distinct candidate SubmissionID
    CLEANER -> EXECUTION : Cleanup(ctx, submissionID)
    EXECUTION --> CLEANER : success or cleanup error
  end
  alt E3 - ERR-SYS-006 - one or more targeted cleanups fail
    CLEANER --> WK : collected cleanup errors
    WK -> WK : leave every candidate message pending
    note right of WK : Do not acknowledge any candidate message. Successful removals are idempotent; recovery retries the same IDs without rejudging terminal Submissions.
  else all candidate cleanups succeed
    CLEANER --> WK : cleanup batch succeeded
    loop each candidate message
      WK -> QUEUE : XACK only after cleanup succeeds
      alt E1 - ERR-SYS-002 - acknowledgement fails
        QUEUE -x WK : message remains pending
        WK -> WK : preserve durable state; retry in a later recovery cycle
      else acknowledged
        QUEUE --> WK : acknowledged
      end
    end
  end
end
WK -> WK : S10 wait for next recovery cycle
note over WK, QUEUE, DB : S11 use case ends for the current cycle.
@enduml
```

## 4. Notes

- `XPENDING` selects work idle beyond the configured threshold; `XCLAIM` reclaims an eligible message in the `judge-workers` consumer group.
- An A2 race is represented as a queue outcome, not a second worker lifeline.
- Requeued `COMPILING` or `RUNNING` submissions keep their current attempt count. UC-SYS-J-01 increments it only when the next attempt starts.
- A5 persists `INTERNAL_ERROR` before acknowledgement. A terminal result is never overwritten or judged again.
- Cleanup failure does not alter status or verdict; the resource remains eligible for a later recovery cycle.

- Only IDs from successfully claimed messages whose durable state makes cleanup safe enter the candidate list. Queue claim races and database failures do not add candidates.
- A3, A4, and A5 messages are acknowledged only after the targeted cleanup batch succeeds. On failure, all candidate messages stay pending; repeating already-successful cleanup is safe.
- If an acknowledgement fails after cleanup, that message remains pending and is retried; durable state is preserved and terminal submissions are not judged again.
- Before retrying interrupted work, the worker cleans that Submission's stale resources. UC-SYS-J-01 then performs its own targeted cleanup before acknowledging the message.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-14 | Initial diagram. |
| 1.1 | 2026-11-18 | Clean only caller-supplied recovery-batch IDs; defer acknowledgement until cleanup succeeds. |
