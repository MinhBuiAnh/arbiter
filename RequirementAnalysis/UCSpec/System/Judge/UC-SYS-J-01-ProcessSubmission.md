# Use Case Specification

**UC-SYS-J-01 - Process Submission**

**Version:** 2.0

# 1. General Information

- Use Case ID: UC-SYS-J-01
- Use Case Name: Process Submission
- Brief Description: Allow Judge Worker to consume a queued Submission, compile it, execute it against the Problem's ordered Test Cases in isolated containers, compare outputs, persist the verdict and metrics, and acknowledge the job only after the result is durable.
- Primary Actor(s): Judge Worker
- Supporting Actor(s): None
- Trigger: The Outbox Dispatcher publishes a judge event for a committed Submission to the `judge:submissions` stream, or UC-SYS-J-02 – Recover Pending Submission hands a reclaimed Submission to the worker.
- Priority: High
- Status: Draft
- Related Use Cases: UC-U-P-03 – Submit Solution, UC-SYS-J-02 – Recover Pending Submission, UC-U-S-01 – View Submission Status, UC-U-S-02 – View Submission Result
- Related Requirements: FR-016 – FR-020 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- Judge Worker is running and registered in the `judge-workers` consumer group.
- The Submission exists and has status `QUEUED`.
- The Submission references a Problem that still exists and has ordered Test Case metadata.
- The Outbox Dispatcher has published the corresponding judge event to `judge:submissions`.
- The worker knows its configured attempt limit, resource limits, and cleanup threshold.

# 3. Postconditions

## 3.1. Success

- The Submission has a terminal status: `COMPLETED` with a verdict, or `INTERNAL_ERROR`.
- Per-Test-Case results are stored for the Test Cases that were executed.
- Aggregate runtime and peak memory are stored where available.
- The message is acknowledged only after the result transaction has committed.
- Execution containers and the temporary workspace are removed.
- No other Submission, Test Case, or Problem is modified.

## 3.2. Failure

- The Submission is never marked `ACCEPTED` unless every executed Test Case passed.
- If the result cannot be committed, no partial terminal result is stored and the message is not acknowledged.
- An unacknowledged message remains pending for UC-SYS-J-02 – Recover Pending Submission.
- Containers and workspaces are removed, or their cleanup is left for the next recovery cycle.
- The API does not expose a verdict that the available evidence does not support.

# 4. Main Flow

1. Judge Worker reads a new message from `judge:submissions` through the `judge-workers` consumer group.
2. Judge Worker loads the Submission, the Problem configuration, and the ordered Test Case metadata.
3. Judge Worker confirms that the Submission is not already in a terminal status.
4. Judge Worker validates the stored language and source configuration, including the 64 KiB source limit.
5. Judge Worker increments the Submission's `judge_attempts` counter.
6. Judge Worker sets the Submission status to `COMPILING`.
7. Judge Worker commits the attempt increment and status change.
8. Judge Worker creates an isolated temporary workspace and writes the source file into it.
9. Judge Worker starts a fresh compile container with network access disabled, CPU, memory, and PID limits, a read-only root filesystem, and a size-limited writable workspace.
10. Judge Worker compiles the source within the fixed 10-second compilation timeout and 512 MiB memory limit.
11. Judge Worker confirms that compilation succeeded.
12. Judge Worker sets the Submission status to `RUNNING`.
13. Judge Worker commits the status change.
14. Judge Worker selects the first Test Case in ascending `ordinal` order.
15. Judge Worker starts a fresh execution container containing the compiled artifact or Python source and the Test Case input mounted read-only.
16. Judge Worker applies the Problem's time and memory limits, 1 vCPU, 64 PIDs, no network, a read-only root filesystem, a size-limited executable workspace, `--cap-drop ALL`, `--security-opt no-new-privileges`, and a non-root user.
17. Judge Worker executes the program and captures standard output, standard error, the exit code, wall-clock runtime, and peak memory.
18. Judge Worker confirms that the runtime is within the Problem's time limit.
19. Judge Worker confirms that the peak memory is within the Problem's memory limit.
20. Judge Worker confirms that the process exited normally and was not terminated by an unexpected signal.
21. Judge Worker confirms that standard output does not exceed the 1 MiB output cap.
22. Judge Worker compares standard output with the expected output using token-based comparison.
23. Judge Worker records a passing per-Test-Case result and removes the execution container.
24. Judge Worker determines whether any Test Case has not been executed.
25. If a Test Case remains, Judge Worker selects the next Test Case and Use Case continues at step 15.
26. Judge Worker records the `ACCEPTED` verdict because every Test Case passed.
27. Judge Worker persists, in a single transaction, the terminal status, the verdict when one exists, any available aggregate runtime and peak memory, and the per-Test-Case results for the executed Test Cases.
28. Judge Worker acknowledges the message only after the transaction commits.
29. Judge Worker removes the remaining containers and the temporary workspace.
30. Use Case ends.

**Internal Processing Note:** The API exposes the Submission state to the User through UC-U-S-01 – View Submission Status, which polls the API. The Judge Worker does not communicate with the User directly and has no UI steps. A compilation timeout produces `COMPILATION_ERROR`; a runtime timeout produces `TIME_LIMIT_EXCEEDED`.

# 5. Alternative Flow

**A1 – Submission Is Already Terminal**

1. At step 3, Judge Worker determines that the Submission already has a terminal status, for example because of duplicate delivery or a previous recovery.
2. Judge Worker acknowledges the message without judging the Submission again.
3. Judge Worker removes any stale container or workspace associated with the Submission.
4. Use Case ends.

**A2 – Compilation Fails**

1. At step 11, the compiler exits with a non-zero code or exceeds the compilation timeout.
2. Judge Worker records the `COMPILATION_ERROR` verdict and stores the truncated compiler output.
3. Judge Worker removes the compile container.
4. Judge Worker skips all execution steps.
5. Use Case continues at step 27.

**A3 – Time Limit Exceeded**

1. At step 18, Judge Worker determines that the wall-clock runtime exceeds the Problem's time limit.
2. Judge Worker records `TIME_LIMIT_EXCEEDED` for that Test Case.
3. Judge Worker does not execute the remaining Test Cases.
4. Use Case continues at step 27.

**A4 – Memory Limit Exceeded**

1. At step 19, Judge Worker determines that the process exceeded the Problem's memory limit or was OOM-killed.
2. Judge Worker records `MEMORY_LIMIT_EXCEEDED` for that Test Case.
3. Judge Worker does not execute the remaining Test Cases.
4. Use Case continues at step 27.

**A5 – Runtime Error**

1. At step 20, Judge Worker determines that the program exited with a non-zero code or was terminated by a signal other than the timeout or OOM controls.
2. Judge Worker records `RUNTIME_ERROR` for that Test Case.
3. Judge Worker does not execute the remaining Test Cases.
4. Use Case continues at step 27.

**A6 – Output Cap Exceeded**

1. At step 21, Judge Worker determines that standard output exceeds the 1 MiB cap.
2. Judge Worker records `WRONG_ANSWER` for that Test Case.
3. Judge Worker does not execute the remaining Test Cases.
4. Use Case continues at step 27.

**A7 – Output Mismatch**

1. At step 22, Judge Worker determines that the token sequence of standard output differs from the expected-output token sequence.
2. Judge Worker records `WRONG_ANSWER` for that Test Case.
3. Judge Worker does not execute the remaining Test Cases.
4. Use Case continues at step 27.

# 6. Exception Flow

**E1 – ERR-SYS-002: Redis Unavailable**

1. At step 1, Judge Worker cannot read from the `judge:submissions` stream, or the connection is lost.
2. Judge Worker does not mark any Submission as failed.
3. No Submission status is changed and no message is acknowledged.
4. Judge Worker logs the failure with the message ID and consumer-group name.
5. Monitoring alerts when the failure persists or the pending backlog grows.
6. Judge Worker retries with exponential backoff.
7. The Submission remains `QUEUED` until the message is delivered or recovered by UC-SYS-J-02 – Recover Pending Submission.
8. Use Case ends for the current read attempt.

**E2 – ERR-SYS-003: PostgreSQL Unavailable**

1. At step 2, step 7, step 13, or step 27, Judge Worker cannot read from or write to the database.
2. Judge Worker stops the affected operation.
3. Any open transaction is rolled back, so no partial status, attempt, or result is committed.
4. Judge Worker does not acknowledge the message.
5. Judge Worker logs the failure with the message ID and Submission ID.
6. Monitoring alerts when the failure persists.
7. Judge Worker retries according to the configured policy; if the message becomes pending, UC-SYS-J-02 – Recover Pending Submission handles it.
8. Use Case ends for the current attempt.

**E3 – ERR-SYS-004: Docker Engine or Container Failure**

1. At step 9, step 15, or step 17, Judge Worker cannot reach Docker, cannot create a container, cannot start the language image, or loses the container.
2. Judge Worker removes any container it created for the attempt.
3. Judge Worker does not record a verdict caused by the infrastructure failure.
4. Judge Worker does not acknowledge the message.
5. Judge Worker logs the failure with the message ID and Submission ID.
6. Monitoring alerts when the failure persists.
7. Recovery retries the job through UC-SYS-J-02 – Recover Pending Submission; after the configured attempt limit, recovery records `INTERNAL_ERROR`.
8. Use Case ends for the current attempt.

**E4 – ERR-RES-002: Test Case Data Missing or Unreadable**

1. At step 2 or step 22, Judge Worker cannot read a Test Case input or expected-output file.
2. Judge Worker stops judging the Submission.
3. Judge Worker records `INTERNAL_ERROR` with a message that the Test Case data is unavailable.
4. The Submission is never marked `ACCEPTED`.
5. Judge Worker logs the failure with the message ID, Submission ID, and Test Case ID, without logging the Test Case content.
6. Use Case continues at step 27.

**E5 – ERR-VAL-002: Invalid Language or Source Configuration**

1. At step 4, Judge Worker detects an unsupported language or a stored source that does not match the Submission's configuration.
2. Judge Worker does not execute the source.
3. Judge Worker records `INTERNAL_ERROR` with a configuration message.
4. Judge Worker logs the failure with the message ID and Submission ID, without logging the source code.
5. Use Case continues at step 27.

**E6 – ERR-CONFLICT-012: Problem Has No Executable Test Cases**

1. At step 2, Judge Worker determines that the Problem has no Test Cases.
2. Judge Worker does not execute anything.
3. Judge Worker records `INTERNAL_ERROR` with a message that the Problem has no executable Test Cases.
4. Judge Worker logs the failure with the message ID, Submission ID, and Problem ID.
5. Use Case continues at step 27.

**E7 – ERR-SYS-005: Output Comparison Failure**

1. At step 22, the comparator cannot read the actual or expected output, or cannot perform token comparison.
2. Judge Worker stops judging the Submission.
3. Judge Worker records `INTERNAL_ERROR`, never `ACCEPTED`.
4. Judge Worker logs the failure with the message ID, Submission ID, and Test Case ID.
5. Use Case continues at step 27.

**E8 – ERR-SYS-006: Orphan Cleanup Failure**

1. At step 29, Judge Worker cannot remove a container or the temporary workspace.
2. The terminal result is already committed and the message is already acknowledged.
3. Judge Worker logs the failure with the Submission ID and the affected resource.
4. Judge Worker does not change the verdict or create a second judgement.
5. UC-SYS-J-02 – Recover Pending Submission retries the cleanup on its next cycle.
6. Use Case ends.

**E9 – ERR-SYS-007: Judge Worker Terminated Before Acknowledgement**

1. After step 1 and before step 28, the Judge Worker process crashes or is terminated.
2. No terminal result is recorded unless step 27 had already committed.
3. If step 27 committed but step 28 did not complete, the terminal result remains valid and the message stays pending.
4. If step 27 did not commit, the Submission may remain in `COMPILING` or `RUNNING`.
5. Monitoring alerts that the worker stopped processing an in-flight message.
6. UC-SYS-J-02 – Recover Pending Submission reclaims the message after the idle threshold and completes or retries it.
7. Use Case ends without a terminal result from this worker.

**E10 – ERR-SYS-001: Unexpected Internal Error**

1. At any step, Judge Worker encounters an unexpected error that is not covered by E1–E9.
2. Judge Worker stops the affected operation.
3. If the terminal result can be persisted, Judge Worker records `INTERNAL_ERROR` and acknowledges the message only after the commit.
4. Otherwise, Judge Worker leaves the message pending for UC-SYS-J-02 – Recover Pending Submission and does not record a false terminal result.
5. Judge Worker logs the error, the Submission ID, and the message ID.
6. Monitoring alerts on the failure.
7. Use Case ends.

# 7. Assumptions

- Submission creation and outbox-event persistence happen in one database transaction, so a published event always refers to a committed Submission.
- The Problem's Test Case files are readable by the worker through the configured read-only mount.
- Only `C++17` and `Python 3` are supported in v1.
- Python 3 is syntax-checked with `py_compile` during compilation, so syntax errors produce `COMPILATION_ERROR`.
- Peak memory is recorded from container cgroup data where available; otherwise it is stored as unknown.
- Output comparison normalizes CRLF to LF, splits on whitespace, and compares token sequences exactly and case-sensitively.
- Judging stops at the first failing Test Case; results are stored only for executed Test Cases.
- A Submission is judged at most twice; recovery enforces the attempt limit.
- Duplicate delivery of a terminal Submission is harmless because terminal Submissions are not judged again.

# 8. Special Requirements

- Source code is compiled and executed only inside isolated containers, never on the host or inside the API process.
- Execution containers use `--network none`, `--cpus 1`, `--pids-limit 64`, `--read-only`, `--cap-drop ALL`, `--security-opt no-new-privileges`, a non-root user, and a size-limited tmpfs workspace.
- Hidden Test Case input and expected output, full source code, and secrets must never be written to logs or error messages.
- The terminal result transaction is atomic and is committed before the queue message is acknowledged.
- A missing or unreadable Test Case file produces `INTERNAL_ERROR`, never `ACCEPTED`.
- Output larger than 1 MiB is treated as `WRONG_ANSWER`.
- The worker must be idempotent: a terminal Submission must not be judged again.
- At most two attempts are allowed per Submission; recovery records `INTERNAL_ERROR` after the limit is reached.

# 9. Open Issues

- The exact retention period for compilation output and per-Test-Case artifacts will be confirmed in the SRS.
- Whether very large Test Case sets should persist incremental per-Test-Case results before the terminal transaction will be confirmed in the SRS.
- The final cgroup memory metric and its behavior on kernels without `memory.peak` will be confirmed in the SRS.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 2.0 | 2026-11-13 | Rewritten to `SpecStructure.md` v1.1: added metadata, split postconditions, flattened the nested per-Test-Case loop into one action per step, converted verdict outcomes into alternatives, moved the no-Test-Cases case to `ERR-CONFLICT-012`, added distinct codes for worker termination and cleanup failure, and replaced UI-oriented steps with monitoring and recovery steps. |
