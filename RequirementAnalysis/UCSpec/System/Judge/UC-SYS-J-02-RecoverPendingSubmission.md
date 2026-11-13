# Use Case Specification

**UC-SYS-J-02 - Recover Pending Submission**

**Version:** 2.0

# 1. General Information

- Use Case ID: UC-SYS-J-02
- Use Case Name: Recover Pending Submission
- Brief Description: Allow Judge Worker to reclaim abandoned Submission jobs, safely resume eligible work or record a terminal internal error after the attempt limit, and acknowledge each message only after its outcome is durable.
- Primary Actor(s): Judge Worker
- Supporting Actor(s): None
- Trigger: Judge Worker starts or reaches a scheduled recovery cycle and finds messages idle beyond the configured threshold.
- Priority: High
- Status: Draft
- Related Use Cases: UC-SYS-J-01 – Process Submission, UC-U-S-01 – View Submission Status
- Related Requirements: FR-020 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- Judge Worker is running and registered in the `judge-workers` consumer group.
- The recovery threshold and maximum attempt count are configured.

# 3. Postconditions

## 3.1. Success

- Each reclaimed message is either acknowledged after its Submission is confirmed missing or terminal, handed to UC-SYS-J-01 – Process Submission for another allowed attempt, or left pending for a later recovery cycle.
- A Submission with exhausted attempts is durably marked `INTERNAL_ERROR` before its message is acknowledged.
- No committed terminal result is overwritten or judged again.
- Orphaned execution resources are removed, or remain eligible for later cleanup.

## 3.2. Failure

- No message is acknowledged before the corresponding safe outcome is durable.
- No Submission receives conflicting terminal results.
- A failed database operation does not leave a partial recovery result.

# 4. Main Flow

1. Judge Worker queries the queue for pending messages idle longer than the configured threshold.
2. Judge Worker claims eligible messages for recovery.
3. Judge Worker loads the Submission associated with each claimed message.
4. Judge Worker confirms that the Submission is not already terminal.
5. Judge Worker compares the Submission's attempt count with the configured maximum of two attempts.
6. If the attempt limit is not exhausted, Judge Worker resets an interrupted `COMPILING` or `RUNNING` Submission to `QUEUED` without incrementing its attempt count.
7. Judge Worker commits the reset state, if a reset was required.
8. Judge Worker passes the Submission to UC-SYS-J-01 – Process Submission, which increments the attempt count when a new attempt starts.
9. After processing the claimed messages, Judge Worker removes orphaned containers and workspaces associated with affected Submissions.
10. Judge Worker waits for the next recovery cycle.
11. Use Case ends for the current cycle.

# 5. Alternative Flow

**A1 – No Pending Messages Exceed the Idle Threshold**

1. At step 1, Judge Worker finds no eligible pending message.
2. Judge Worker performs scheduled orphan cleanup.
3. Judge Worker waits for the next recovery cycle; Use Case ends for the current cycle.

**A2 – Another Worker Claims a Message First**

1. At step 2, the queue does not return a message because another worker claimed it.
2. Judge Worker continues with the next message, if any.
3. Use Case ends for that message.

**A3 – Associated Submission No Longer Exists**

1. At step 3, Judge Worker cannot find the associated Submission.
2. Judge Worker acknowledges and discards the obsolete message.
3. Use Case ends for that message.

**A4 – Submission Is Already Terminal**

1. At step 4, Judge Worker determines that the Submission is already `COMPLETED` or `INTERNAL_ERROR`.
2. Judge Worker acknowledges the duplicate message without judging the Submission again.
3. Judge Worker schedules any orphaned resources for cleanup.
4. Use Case ends for that message.

**A5 – Attempt Limit Is Reached**

1. At step 5, Judge Worker determines that the Submission has already used the maximum of two attempts.
2. Judge Worker records `INTERNAL_ERROR` with a reason that judging did not complete within the allowed attempts.
3. Judge Worker commits the terminal status and reason.
4. Judge Worker acknowledges the message only after the commit succeeds.
5. Judge Worker does not submit the Submission for another attempt; Use Case ends for that message.

# 6. Exception Flow

**E1 – ERR-SYS-002: Queue Unavailable or Claim Failure**

1. At step 1 or step 2, Judge Worker cannot query or claim pending messages.
2. Judge Worker stops the current recovery cycle and does not mark a Submission as failed.
3. No message is acknowledged and no Submission state is changed.
4. Judge Worker logs the failure with the request/correlation ID when available and the message or consumer-group identifier; no secrets are logged.
5. Monitoring alerts if the failure persists or the pending backlog grows.
6. Judge Worker retries with backoff in the next recovery cycle.
7. Use Case ends for the current cycle.

**E2 – ERR-SYS-003: Persistent Store Unavailable**

1. At step 3, step 4, step 6, or step 7, Judge Worker cannot read or update a Submission.
2. Judge Worker stops processing the affected message and rolls back any open transaction.
3. No partial result is committed and the affected message is not acknowledged.
4. Judge Worker logs the failure with the request/correlation ID when available, message ID, and Submission ID.
5. Monitoring alerts if the failure persists.
6. Judge Worker retries during a later recovery cycle; the message remains pending.
7. Use Case ends for the affected message in the current cycle.

**E3 – ERR-SYS-006: Orphan Cleanup Failure**

1. At step 9, Judge Worker cannot remove an orphaned container or workspace.
2. Judge Worker stops cleanup for the affected resource without changing the Submission result.
3. Any already committed result remains unchanged; message acknowledgement follows the normal durable-result rule.
4. Judge Worker logs the failure with the request/correlation ID when available and Submission ID, without logging secrets.
5. Monitoring records the cleanup failure and the resource remains eligible for cleanup on a later cycle.
6. Use Case ends for the affected cleanup operation.

**E4 – ERR-SYS-001: Unexpected Recovery Error**

1. At any step, Judge Worker encounters an unexpected internal error.
2. Judge Worker stops the affected operation and does not overwrite a committed terminal result.
3. If no safe outcome was committed, the affected message remains pending and is not acknowledged.
4. Judge Worker logs the error with the request/correlation ID when available and message ID.
5. Monitoring records the failure; Judge Worker retries during a later recovery cycle.
6. Use Case ends for the affected message in the current cycle.

# 7. Assumptions

- The default idle threshold is five minutes and the maximum judging-attempt count is two, as specified by the catalog; configuration may change the threshold.
- The worker increments the attempt counter when UC-SYS-J-01 – Process Submission starts an attempt.
- Terminal states are `COMPLETED` and `INTERNAL_ERROR`; `INTERNAL_ERROR` is not a verdict.
- Duplicate delivery is idempotent, and acknowledgement occurs only after the corresponding outcome is durable.

# 8. Special Requirements

- Recovery must not turn `INTERNAL_ERROR` into `ACCEPTED` or produce multiple terminal results for one Submission.
- Reclaimed `COMPILING` or `RUNNING` Submissions return to `QUEUED` only when their next attempt can proceed.
- Acknowledgement and terminal-state persistence must follow the durability rules in UC-SYS-J-01 – Process Submission.
- Cleanup failure must not change a Submission's status or verdict.

# 9. Open Issues

- The exact recovery scheduling interval, idle threshold, and orphan-resource retention threshold will be confirmed in the SRS.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 2.0 | 2026-11-13 | Rewritten to `SpecStructure.md` v1.1: added required metadata, separated alternatives from exceptions, clarified durable acknowledgement and retry behavior, and aligned attempt-limit handling with the catalog. |
