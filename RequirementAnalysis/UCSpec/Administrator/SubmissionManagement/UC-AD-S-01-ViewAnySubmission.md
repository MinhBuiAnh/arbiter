# Use Case Specification

**UC-AD-S-01 - View Any Submission**

**Version:** 2.0

# 1. General Information

- Use Case ID: UC-AD-S-01
- Use Case Name: View Any Submission
- Brief Description: Allow Administrator to list Submissions across all users and inspect a selected Submission's source code, verdict, execution metrics, compilation output, and per-test results in read-only mode for support and debugging.
- Primary Actor(s): Administrator
- Supporting Actor(s): None
- Trigger: Administrator opens the Submission Management page or selects a Submission from the list.
- Priority: Medium
- Status: Draft
- Related Use Cases: UC-AD-U-02 – View User Details, UC-AD-P-02 – Update Problem, UC-U-P-03 – Submit Solution, UC-U-S-04 – View Submission Details
- Related Requirements: FR-022 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- Administrator is logged in with an account that has the `admin` role.
- System is available and can read Submission data.

# 3. Postconditions

## 3.1. Success

- The requested Submission list or Submission details are displayed in read-only mode.
- The details include the source code, programming language, owner, Problem, status, verdict, timestamps, runtime, peak memory, compilation output, and per-test results.
- Hidden Test Case input and expected output are not included.
- No Submission, result, source code, or Test Case is changed.

## 3.2. Failure

- No Submission list or details are displayed.
- No Submission, result, source code, or Test Case is changed.

# 4. Main Flow

1. Administrator opens the Submission Management page.
2. UI requests a Submission list with optional filters and pagination parameters.
3. System validates the Access Token and confirms the `admin` role.
4. System validates the filter parameters.
5. System validates the pagination parameters.
6. System queries Submissions across all users that match the criteria.
7. System returns summary rows containing the Submission ID, user, Problem, language, status, verdict, runtime, memory, and creation time.
8. UI displays the Submission list.
9. Administrator selects a Submission.
10. System validates the Access Token and confirms the `admin` role.
11. System retrieves the Submission details, including the source code, owner, Problem, status, verdict, timestamps, runtime, peak memory, compilation output, and per-test results.
12. System excludes hidden Test Case input and expected output from the response.
13. System returns the Submission details.
14. UI displays the Submission details in read-only mode.
15. Administrator may navigate to the related user through UC-AD-U-02 – View User Details or to the related Problem through UC-AD-P-02 – Update Problem.
16. Use Case ends.

# 5. Alternative Flow

**A1 – Administrator Filters by User**

1. At step 2, Administrator selects a user filter.
2. UI sends the user filter with the list request.
3. System returns only Submissions belonging to that user.
4. Use Case continues at step 4.

**A2 – Administrator Filters by Problem**

1. At step 2, Administrator selects a Problem filter.
2. UI sends the Problem filter with the list request.
3. System returns only Submissions for that Problem.
4. Use Case continues at step 4.

**A3 – Administrator Filters by Verdict or Status**

1. At step 2, Administrator selects a verdict or status filter, such as `ACCEPTED`, `WRONG_ANSWER`, `QUEUED`, or `INTERNAL_ERROR`.
2. UI sends the filter with the list request.
3. System returns only Submissions matching the selected value.
4. Use Case continues at step 4.

**A4 – Administrator Navigates Between Pages**

1. At step 8, Administrator selects another page or changes the page size.
2. UI sends the new pagination parameters.
3. System returns the corresponding page.
4. UI updates the list.
5. Use Case continues at step 4.

**A5 – No Submissions Match the Criteria**

1. At step 6, System finds no Submission matching the filters.
2. System returns an empty page with a total count of zero.
3. UI displays a message that no Submission matches the criteria.
4. No Submission data is changed.
5. Use Case ends.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing, Invalid, or Expired Access Token**

1. At step 3 or step 10, System cannot find, validate, or accept the Access Token.
2. System rejects the request.
3. No Submission data is returned or changed.
4. System logs the rejection with the request ID and without the token value.
5. System returns `ERR-AUTH-003`.
6. UI clears the stored authentication information and navigates Administrator to the login page.
7. Use Case ends.

**E2 – ERR-PERM-002: Insufficient Privileges**

1. At step 3 or step 10, System determines that the authenticated account does not have the `admin` role.
2. System rejects the request.
3. No Submission data is returned or changed.
4. System logs the rejection with the request ID and the account identifier.
5. System returns `ERR-PERM-002`.
6. UI notifies that Administrator rights are required to inspect Submissions.
7. Use Case ends.

**E3 – ERR-RES-005: Submission Not Found**

1. At step 11, System cannot retrieve a Submission with the selected Submission ID.
2. System rejects the request.
3. No Submission data is returned or changed.
4. System logs the failure with the request ID and the Submission ID.
5. System returns `ERR-RES-005`.
6. UI notifies that the Submission no longer exists and reloads the Submission list.
7. Use Case ends.

**E4 – ERR-VAL-004: Invalid Filter Parameters**

1. At step 4, System detects an invalid filter value, such as an unsupported verdict, an unknown status, or an invalid date range.
2. System rejects the request.
3. No Submission data is returned or changed.
4. System logs the validation failure with the request ID and the invalid filter names.
5. System returns `ERR-VAL-004` with the invalid filters.
6. UI resets the affected filter to its default value or asks Administrator to correct it.
7. Administrator corrects the filter and resubmits; Use Case continues at step 2.

**E5 – ERR-VAL-005: Invalid Pagination Parameters**

1. At step 5, System detects an invalid pagination value, such as a negative page number or a page size above the maximum.
2. System rejects the request.
3. No Submission data is returned or changed.
4. System logs the validation failure with the request ID and the invalid parameters.
5. System returns `ERR-VAL-005`.
6. UI resets the pagination to its default value or asks Administrator to correct it.
7. Administrator corrects the pagination and resubmits; Use Case continues at step 2.

**E6 – ERR-LIMIT-001: Rate Limit Exceeded**

1. At step 3 or step 10, System detects that Administrator sent too many Submission requests within the configured period.
2. System rejects the current request.
3. No Submission data is returned or changed.
4. System returns `ERR-LIMIT-001` with the retry time if available.
5. UI asks Administrator to wait before trying again.
6. Use Case ends.

**E7 – ERR-SYS-001: Internal System Error**

1. At step 6, step 7, or step 11, System encounters an error while querying or assembling the Submission data.
2. System stops processing the request.
3. No Submission data is returned or changed.
4. System logs the error and the request ID.
5. System returns `ERR-SYS-001` with a general message.
6. UI notifies that the Submission information could not be loaded and does not display a success message.
7. Administrator may retry later.

**E8 – ERR-NET-001: Network Error**

1. During step 2, step 9, or a response, the connection is interrupted or times out.
2. UI cannot confirm whether the request reached System.
3. UI notifies that the Submission information could not be loaded and does not display stale data as current.
4. Administrator can retry when the network is restored.
5. Use Case ends.

# 7. Assumptions

- Submission data is read-only; rejudging and Submission modification are out of scope for v1.
- The source code of a Submission is visible to its owner and to Administrators only.
- Hidden Test Case input and expected output are never returned by this use case, even to Administrators; they are available only through Test Case management.
- The per-test results cover only the Test Cases that were executed before judging stopped.

# 8. Special Requirements

- Only accounts with the `admin` role may view any user's Submission; the backend enforces the role.
- The response must never include hidden Test Case input, expected output, stack traces, database statements, container internals, or secrets.
- Compilation output must be truncated to a bounded size before it is returned or displayed.
- The view must not change Submission status, verdict, source code, or results.
- The endpoint must be rate-limited.

# 9. Open Issues

- The maximum displayed size of compilation output and source code will be confirmed in the SRS.
- Administrator access is not recorded in an audit log in v1; audit logging is deferred per the catalog.
- User-facing Submission specifications use `ERR-RES-005` for a missing Submission and `ERR-PERM-003` when the Submission belongs to another account.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 2.0 | 2026-11-13 | Rewritten to `SpecStructure.md` v1.1: added metadata, split postconditions, converted the trailing note into assumptions and special requirements, split filter and pagination validation into `ERR-VAL-004` and `ERR-VAL-005`, assigned the distinct `ERR-RES-005` code for a missing Submission, and gave every exception a detection and end state. |
