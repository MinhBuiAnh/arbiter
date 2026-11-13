# Use Case Specification

**UC-U-S-04 - View Submission Details**

**Version:** 2.0

# 1. General Information

- Use Case ID: UC-U-S-04
- Use Case Name: View Submission Details
- Brief Description: Allow User to view the source code and available status or result information for their own Submission.
- Primary Actor(s): User
- Supporting Actor(s): None
- Trigger: User selects a Submission from their history or opens its details from another User-facing view.
- Priority: Medium
- Status: Draft
- Related Use Cases: UC-U-S-01 – View Submission Status, UC-U-S-02 – View Submission Result, UC-U-S-03 – View Submission History, UC-AD-S-01 – View Any Submission
- Related Requirements: FR-022 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- User has a Submission ID obtained from their own submission or history view.

# 3. Postconditions

## 3.1. Success

- UI displays the requested Submission's details in read-only mode.
- UI displays only fields available for the current Submission state.
- No Submission, source code, or result data is changed.

## 3.2. Failure

- UI does not display details for a Submission that User cannot access.
- No Submission, source code, or result data is changed.

# 4. Main Flow

1. User opens a Submission's details.
2. UI requests the details using the Submission ID.
3. System validates the Access Token.
4. System confirms that the account is active.
5. System retrieves the Submission identified by the request.
6. System confirms that the Submission belongs to User.
7. System assembles the Submission ID, Problem summary, programming language, submitted source code, submission time, status, and available result summary.
8. System excludes hidden Test Case inputs and expected outputs.
9. System returns the details.
10. UI displays the details in read-only mode.
11. User may open UC-U-S-01 – View Submission Status for a non-terminal Submission or UC-U-S-02 – View Submission Result for a completed Submission.
12. Use Case ends.

# 5. Alternative Flow

**A1 – Submission Is Queued or Being Judged**

1. At step 7, System determines that the status is `QUEUED`, `COMPILING`, or `RUNNING`.
2. System returns the currently available details without presenting a verdict or incomplete metrics as final results.
3. UI displays the source code and current status and offers UC-U-S-01 – View Submission Status.
4. Use Case ends.

**A2 – Submission Has Completed**

1. At step 7, System determines that the status is `COMPLETED`.
2. System includes the stored verdict and available result summary.
3. UI displays the result and offers UC-U-S-02 – View Submission Result.
4. Use Case ends.

**A3 – Judging Ends With an Internal Error**

1. At step 7, System determines that the status is `INTERNAL_ERROR`.
2. System returns the Submission details and terminal status without a verdict.
3. UI explains that judging could not produce a trustworthy result; User may still review their source code.
4. Use Case ends.

**A4 – Problem Is No Longer Public**

1. At step 7, System determines that the related Problem is unpublished or inactive.
2. System returns the Problem information retained with the Submission, subject to User's access rights.
3. UI displays the Submission details; loss of public Problem visibility does not remove User's access to their own Submission.
4. Use Case ends.

**A5 – User Returns to Submission History**

1. At step 10, User chooses to return to the history page.
2. UI opens UC-U-S-03 – View Submission History.
3. Use Case ends.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing, Invalid, or Expired Access Token**

1. At step 3, System cannot validate the Access Token.
2. System rejects the request without returning Submission details.
3. No Submission data is changed.
4. System logs the rejection with the request ID and without the token value.
5. System returns `ERR-AUTH-003`.
6. UI clears stored authentication information and navigates User to the login page.
7. Use Case ends.

**E2 – ERR-ACC-001: Account Is Disabled**

1. At step 4, System determines that User's account is disabled.
2. System rejects the request without returning Submission details.
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
2. System withholds the details and stops the request.
3. No Submission data is changed.
4. System logs the rejection with the request ID, actor ID, and Submission ID.
5. System returns `ERR-PERM-003`.
6. UI notifies User that the Submission is unavailable.
7. Use Case ends.

**E5 – ERR-LIMIT-001: Details Request Rate Limit Exceeded**

1. At step 2 or step 3, System detects that User has exceeded the allowed details-query rate.
2. System rejects the current request without changing Submission data.
3. System returns `ERR-LIMIT-001` and `retry_after` when known.
4. UI waits for the indicated interval before allowing another request.
5. Use Case ends.

**E6 – ERR-SYS-001: Submission Details Unavailable**

1. At step 5 or step 7, System cannot retrieve complete, trustworthy Submission details.
2. System stops the request; no Submission data is changed.
3. System logs the error with the request ID and Submission ID.
4. System returns `ERR-SYS-001` with a general message.
5. UI states that the details could not be loaded and offers a safe retry.
6. Use Case ends.

**E7 – ERR-NET-001: Network Error**

1. During step 2 or the response to it, UI detects that the connection was interrupted or timed out before a definitive response arrived.
2. UI does not present stale data as current.
3. No Submission data is changed.
4. UI states that the details could not be loaded and allows a safe retry.
5. Use Case ends.

# 7. Assumptions

- Administrator inherits User use cases for the Administrator's own Submissions; viewing another User's Submission is handled by UC-AD-S-01 – View Any Submission.
- A User may continue to access their own Submission details when its Problem is unpublished or inactive.
- Result summaries include only executed Test Cases.

# 8. Special Requirements

- System enforces account status and Submission ownership.
- Source code is returned only to its owner through this use case; Administrator inspection of another User's source code uses UC-AD-S-01 – View Any Submission.
- Hidden Test Case inputs and expected outputs are never returned.
- `INTERNAL_ERROR` must not be presented as a verdict.

# 9. Open Issues

- The exact Problem summary and execution-metric fields will be confirmed in the SRS.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 2.0 | 2026-11-13 | Rewritten to `SpecStructure.md` v1.1: corrected the specification name, added required metadata, clarified ownership and status-dependent detail, and prohibited hidden-test-data exposure. |
