# Use Case Specification

**UC-U-S-02 - View Submission Result**

**Version:** 2.0

# 1. General Information

- Use Case ID: UC-U-S-02
- Use Case Name: View Submission Result
- Brief Description: Allow User to view the verdict and available grading results for their completed Submission without exposing hidden Test Case data.
- Primary Actor(s): User
- Supporting Actor(s): None
- Trigger: User requests the result of a Submission.
- Priority: High
- Status: Draft
- Related Use Cases: UC-U-S-01 – View Submission Status, UC-U-S-04 – View Submission Details, UC-AD-S-01 – View Any Submission
- Related Requirements: FR-020, FR-022 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- User has a Submission ID obtained from a submission or history view.

# 3. Postconditions

## 3.1. Success

- For a completed Submission, UI displays its stored verdict and available result information.
- Hidden Test Case inputs and expected outputs are not returned.
- No Submission or grading result is changed.

## 3.2. Failure

- UI does not display an inferred or unavailable verdict as a result.
- No Submission or grading result is changed.

# 4. Main Flow

1. User requests the result for a Submission.
2. UI sends the Submission ID to System.
3. System validates the Access Token.
4. System confirms that the account is active.
5. System retrieves the Submission identified by the request.
6. System confirms that the Submission belongs to User.
7. System confirms that the Submission status is `COMPLETED`.
8. System retrieves the stored verdict, available execution metrics, and summary of executed Test Cases.
9. System excludes hidden Test Case input and expected output from the result.
10. System returns the result data.
11. UI displays the verdict and available result information.
12. Use Case ends.

# 5. Alternative Flow

**A1 – Submission Is Still Queued or Being Judged**

1. At step 7, System determines that the status is `QUEUED`, `COMPILING`, or `RUNNING`.
2. System returns the current status without returning a verdict.
3. UI explains that results are not available yet and offers UC-U-S-01 – View Submission Status.
4. Use Case ends.

**A2 – Judging Ends With an Internal Error**

1. At step 7, System determines that the status is `INTERNAL_ERROR`.
2. System returns the terminal status without a verdict.
3. UI explains that judging could not produce a trustworthy result.
4. Use Case ends.

**A3 – Submission Has a Compilation Error**

1. At step 11, UI receives the `COMPILATION_ERROR` verdict.
2. UI displays the verdict and bounded, user-safe compilation information when available.
3. User may return to the editor and submit a corrected solution through UC-U-P-03 – Submit Solution.
4. Use Case ends.

**A4 – Submission Has a Non-Accepted Verdict**

1. At step 11, UI receives `WRONG_ANSWER`, `TIME_LIMIT_EXCEEDED`, `MEMORY_LIMIT_EXCEEDED`, or `RUNTIME_ERROR`.
2. UI displays the verdict and available execution metrics without exposing hidden Test Case data.
3. Use Case ends.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing, Invalid, or Expired Access Token**

1. At step 3, System cannot validate the Access Token.
2. System rejects the request without returning result data.
3. No Submission or result data is changed.
4. System logs the rejection with the request ID and without the token value.
5. System returns `ERR-AUTH-003`.
6. UI clears stored authentication information and navigates User to the login page.
7. Use Case ends.

**E2 – ERR-ACC-001: Account Is Disabled**

1. At step 4, System determines that User's account is disabled.
2. System rejects the request without returning result data.
3. No Submission or result data is changed.
4. System logs the rejection with the request ID and account identifier.
5. System returns `ERR-ACC-001`.
6. UI explains that the account cannot access authenticated features.
7. Use Case ends.

**E3 – ERR-RES-005: Submission Not Found**

1. At step 5, System cannot find the requested Submission.
2. System stops the request; no Submission or result data is changed.
3. System logs the failure with the request ID and Submission ID.
4. System returns `ERR-RES-005`.
5. UI notifies User that the Submission could not be found and offers the Submission history.
6. Use Case ends.

**E4 – ERR-PERM-003: Submission Is Not Owned by User**

1. At step 6, System determines that the Submission belongs to another account.
2. System withholds the result data and stops the request.
3. No Submission or result data is changed.
4. System logs the rejection with the request ID, actor ID, and Submission ID.
5. System returns `ERR-PERM-003`.
6. UI notifies User that the Submission is unavailable.
7. Use Case ends.

**E5 – ERR-LIMIT-001: Result Request Rate Limit Exceeded**

1. At step 2 or step 3, System detects that User has exceeded the allowed result-query rate.
2. System rejects the current request without changing Submission data.
3. System returns `ERR-LIMIT-001` and `retry_after` when known.
4. UI waits for the indicated interval before allowing another request.
5. Use Case ends.

**E6 – ERR-SYS-001: Result Data Unavailable**

1. At step 7 or step 8, System cannot retrieve complete, trustworthy result data for a completed Submission.
2. System stops the request and does not create or infer a verdict.
3. No Submission or result data is changed.
4. System logs the error with the request ID and Submission ID.
5. System returns `ERR-SYS-001` with a general message.
6. UI states that the result could not be loaded and offers a safe retry.
7. Use Case ends.

**E7 – ERR-NET-001: Network Error**

1. During step 2 or the response to it, UI detects that the connection was interrupted or timed out before a definitive response arrived.
2. UI does not treat the failure as a result or verdict.
3. No Submission or result data is changed.
4. UI reports that the result could not be loaded and allows a safe retry.
5. Use Case ends.

# 7. Assumptions

- A verdict is available only when the Submission status is `COMPLETED`.
- Result summaries cover only Test Cases that were executed before judging stopped.
- Administrator uses UC-AD-S-01 – View Any Submission to inspect another User's Submission.

# 8. Special Requirements

- System enforces account status and Submission ownership.
- System never returns hidden Test Case input or expected output through this use case.
- Compilation or execution output returned to User is bounded and excludes secrets and container internals.
- `INTERNAL_ERROR` must never be shown as a verdict.

# 9. Open Issues

- The exact result metrics and compilation-output size limit will be confirmed in the SRS.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 2.0 | 2026-11-13 | Rewritten to `SpecStructure.md` v1.1: added required metadata and lifecycle handling, removed duplicate system-error cases, and clarified ownership and hidden-test-data protections. |
