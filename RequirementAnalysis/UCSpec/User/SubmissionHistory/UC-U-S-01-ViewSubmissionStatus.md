# Use Case Specification

**UC-U-S-01 - View Submission Status**

**Version:** 2.0

# 1. General Information

- Use Case ID: UC-U-S-01
- Use Case Name: View Submission Status
- Brief Description: Allow User to monitor the current state of their Submission and proceed to its result when judging finishes.
- Primary Actor(s): User
- Supporting Actor(s): None
- Trigger: User opens a Submission's status view or requests an update while monitoring it.
- Priority: High
- Status: Draft
- Related Use Cases: UC-U-P-03 – Submit Solution, UC-U-S-02 – View Submission Result, UC-U-S-04 – View Submission Details
- Related Requirements: FR-021 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- User has a Submission ID obtained from a submission or history view.

# 3. Postconditions

## 3.1. Success

- UI displays the latest status and available status timestamps for the User's Submission.
- UI stops polling when the Submission reaches `COMPLETED` or `INTERNAL_ERROR`.
- No Submission or result data is changed.

## 3.2. Failure

- UI does not present an error response as a Submission status.
- No Submission or result data is changed.

# 4. Main Flow

1. User opens the status view for a Submission.
2. UI requests the Submission status from System.
3. System validates the Access Token.
4. System confirms that the account is active.
5. System retrieves the Submission identified by the request.
6. System confirms that the Submission belongs to User.
7. System returns the status and available timestamps.
8. UI displays the status and timestamps.
9. If the status is not terminal, UI waits for the configured polling interval.
10. Use Case continues at step 2 while the Submission remains non-terminal and User continues monitoring.
11. When the status is terminal, UI stops polling.
12. Use Case ends.

# 5. Alternative Flow

**A1 – Submission Remains Queued or Is Being Judged**

1. At step 7, System returns `QUEUED`, `COMPILING`, or `RUNNING`.
2. UI displays the current state as pending or in progress, not as a verdict.
3. UI continues polling at step 9, or User leaves the status view and the Use Case ends.

**A2 – Submission Completes**

1. At step 7, System returns `COMPLETED`.
2. UI displays that judging is complete and offers UC-U-S-02 – View Submission Result.
3. UI stops polling; Use Case ends.

**A3 – Judging Ends With an Internal Error**

1. At step 7, System returns `INTERNAL_ERROR`.
2. UI displays that judging could not produce a trustworthy result and does not present `INTERNAL_ERROR` as a verdict.
3. UI stops polling; Use Case ends.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing, Invalid, or Expired Access Token**

1. At step 3, System cannot validate the Access Token.
2. System rejects the request without returning Submission data.
3. No Submission data is changed.
4. System logs the rejection with the request ID and without the token value.
5. System returns `ERR-AUTH-003`.
6. UI clears stored authentication information and navigates User to the login page.
7. Use Case ends.

**E2 – ERR-ACC-001: Account Is Disabled**

1. At step 4, System determines that User's account is disabled.
2. System rejects the request without returning Submission data.
3. No Submission data is changed.
4. System logs the rejection with the request ID and account identifier.
5. System returns `ERR-ACC-001`.
6. UI explains that the account cannot access authenticated features.
7. Use Case ends.

**E3 – ERR-RES-005: Submission Not Found**

1. At step 5, System cannot find the requested Submission.
2. System stops the request; no Submission data is changed.
3. System logs the failure with the request ID and Submission ID.
4. System returns `ERR-RES-005`.
5. UI notifies User that the Submission could not be found and offers the Submission history.
6. Use Case ends.

**E4 – ERR-PERM-003: Submission Is Not Owned by User**

1. At step 6, System determines that the Submission belongs to another account.
2. System withholds the Submission data and stops the request.
3. No Submission data is changed.
4. System logs the rejection with the request ID, actor ID, and Submission ID.
5. System returns `ERR-PERM-003`.
6. UI notifies User that the Submission is unavailable.
7. Use Case ends.

**E5 – ERR-LIMIT-001: Status Polling Rate Limit Exceeded**

1. At step 2 or step 3, System detects that User has exceeded the allowed status-query rate.
2. System rejects the current request without changing Submission data.
3. System returns `ERR-LIMIT-001` and `retry_after` when known.
4. UI pauses polling for the indicated interval and does not display an error as a status.
5. Use Case ends for the current polling request.

**E6 – ERR-SYS-001: Status Unavailable**

1. At step 5 or step 7, System encounters an internal error while retrieving the status.
2. System stops the request; no Submission data is changed.
3. System logs the error with the request ID and Submission ID.
4. System returns `ERR-SYS-001` with a general message.
5. UI states that the status could not be loaded and offers a safe retry.
6. Use Case ends for the current polling request.

**E7 – ERR-NET-001: Network Error**

1. During step 2 or the response to it, UI detects that the connection was interrupted or timed out before a definitive response arrived.
2. UI does not treat the failure as a new Submission status.
3. No Submission data is changed.
4. UI reports that the status could not be refreshed and retries only according to its polling policy.
5. Use Case ends for the current polling request.

# 7. Assumptions

- Submission states and terminal states follow UseCaseCatalog.md §8.1.
- Administrator inherits User use cases; to inspect another User's Submission, Administrator uses UC-AD-S-01 – View Any Submission.

# 8. Special Requirements

- System must enforce account status and Submission ownership on every status request.
- `INTERNAL_ERROR` is a terminal status, not a verdict.
- Polling must honor `retry_after` and must not exceed the configured request rate.
- Responses and logs must not contain access tokens or hidden Test Case data.

# 9. Open Issues

- The polling interval and maximum polling rate will be confirmed in the SRS.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 2.0 | 2026-11-13 | Rewritten to `SpecStructure.md` v1.1: added required metadata and lifecycle fields, clarified ownership and terminal-state handling, and assigned distinct resource and permission errors. |
