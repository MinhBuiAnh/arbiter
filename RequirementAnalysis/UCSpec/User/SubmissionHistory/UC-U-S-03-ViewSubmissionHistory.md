# Use Case Specification

**UC-U-S-03 - View Submission History**

**Version:** 2.0

# 1. General Information

- Use Case ID: UC-U-S-03
- Use Case Name: View Submission History
- Brief Description: Allow User to browse their own Submissions, ordered from newest to oldest, and open a Submission's details.
- Primary Actor(s): User
- Supporting Actor(s): None
- Trigger: User opens the Submission history page or requests another page of history.
- Priority: High
- Status: Draft
- Related Use Cases: UC-U-S-01 – View Submission Status, UC-U-S-02 – View Submission Result, UC-U-S-04 – View Submission Details, UC-U-ST-01 – View Own Statistics
- Related Requirements: FR-021 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- User has an account and opens the Submission history function.

# 3. Postconditions

## 3.1. Success

- UI displays the requested page of User's Submissions, ordered by submission time from newest to oldest.
- Each row displays only summary information and shows a verdict only for a `COMPLETED` Submission.
- No Submission data is changed.

## 3.2. Failure

- UI does not present an error response as an empty history page.
- No Submission data is changed.

# 4. Main Flow

1. User opens the Submission history page.
2. UI requests a page of history with the selected pagination parameters.
3. System validates the Access Token.
4. System confirms that the account is active.
5. System validates the pagination parameters.
6. System derives User's account ID from the authenticated identity.
7. System retrieves that User's Submissions in newest-first order.
8. System applies pagination and returns summary rows and page information.
9. UI displays each row with available summary fields, such as Submission ID, Problem, language, submission time, status, and a verdict only when status is `COMPLETED`.
10. User may select a row to open UC-U-S-04 – View Submission Details.
11. Use Case ends.

# 5. Alternative Flow

**A1 – User Has No Submission History**

1. At step 7, System finds no Submission for User.
2. System returns an empty page with a total count of zero.
3. UI displays a no-submissions message.
4. Use Case ends.

**A2 – User Navigates Between Pages**

1. At step 9, User selects another page or page size.
2. UI requests that page using the selected pagination parameters.
3. Use Case continues at step 3 so System validates the request and account again.

**A3 – A Submission Is Still Queued or Being Judged**

1. At step 9, UI receives a row whose status is `QUEUED`, `COMPILING`, or `RUNNING`.
2. UI displays the status without a verdict.
3. User may open the row through UC-U-S-04 – View Submission Details; otherwise Use Case ends.

**A4 – A Submission Has an Internal Error**

1. At step 9, UI receives a row whose status is `INTERNAL_ERROR`.
2. UI displays the system-error status and does not present it as a verdict.
3. Use Case ends.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing, Invalid, or Expired Access Token**

1. At step 3, System cannot validate the Access Token.
2. System rejects the request without returning history data.
3. No Submission data is changed.
4. System logs the rejection with the request ID and without the token value.
5. System returns `ERR-AUTH-003`.
6. UI clears stored authentication information and navigates User to the login page.
7. Use Case ends.

**E2 – ERR-ACC-001: Account Is Disabled**

1. At step 4, System determines that User's account is disabled.
2. System rejects the request without returning history data.
3. No Submission data is changed.
4. System logs the rejection with the request ID and account identifier.
5. System returns `ERR-ACC-001`.
6. UI explains that the account cannot access authenticated features.
7. Use Case ends.

**E3 – ERR-VAL-005: Invalid Pagination Parameters**

1. At step 5, System detects malformed, negative, or out-of-range pagination parameters.
2. System rejects the request without returning history data.
3. No Submission data is changed.
4. System logs the validation failure with the request ID and invalid parameter names.
5. System returns `ERR-VAL-005` with the invalid parameter details.
6. UI displays the pagination error and asks User to correct or reset the parameters.
7. User corrects the parameters and resubmits; Use Case continues at step 2.

**E4 – ERR-LIMIT-001: History Request Rate Limit Exceeded**

1. At step 2 or step 3, System detects that User has exceeded the allowed history-query rate.
2. System rejects the current request without changing Submission data.
3. System returns `ERR-LIMIT-001` and `retry_after` when known.
4. UI waits for the indicated interval before allowing another request.
5. Use Case ends for the current request.

**E5 – ERR-SYS-001: History Unavailable**

1. At step 7 or step 8, System encounters an internal error while retrieving or assembling the history page.
2. System stops the request; no Submission data is changed.
3. System logs the error with the request ID and authenticated account ID.
4. System returns `ERR-SYS-001` with a general message.
5. UI states that the history could not be loaded and offers a safe retry.
6. Use Case ends.

**E6 – ERR-NET-001: Network Error**

1. During step 2 or the response to it, UI detects that the connection was interrupted or timed out before a definitive response arrived.
2. UI does not display the failure as an empty history page.
3. No Submission data is changed.
4. UI states that the history could not be loaded and allows a safe retry.
5. Use Case ends.

# 7. Assumptions

- User ID is derived from the validated authenticated identity; User cannot request another account's history.
- Default and maximum page sizes are defined in the SRS.

# 8. Special Requirements

- System returns only Submissions belonging to the authenticated User.
- History rows do not include source code, password data, access tokens, or hidden Test Case data.
- The list does not show `INTERNAL_ERROR` as a verdict.

# 9. Open Issues

- The default and maximum page sizes will be confirmed in the SRS.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 2.0 | 2026-11-13 | Rewritten to `SpecStructure.md` v1.1: corrected the specification name, added required metadata, separated empty history from failures, and clarified account scoping and pagination errors. |
