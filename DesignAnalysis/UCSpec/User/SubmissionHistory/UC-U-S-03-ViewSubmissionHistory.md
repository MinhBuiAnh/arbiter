# Use Case Specification

**UC-U-S-03 - View Submission Result**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-U-P-03
- Use Case Name: View Submission History
- Brief Description: Allow User to view a list of submissions they have previously submitted, including the processing status and grading results if completed.
- Participating Actors: User, Administrator (can also use this feature through inheritance from User).

# 2. Preconditions

- User has successfully logged in.
- System provides the function to query submission history.

# 3. Postconditions

- The list of submissions belonging to User is displayed.
- User can select a submission to view details.
- No submission data is changed.

# 4. Main Flow

1. User accesses the submission history page.
2. UI sends a request to retrieve submission history to System.
3. System validates the access token.
4. System determines the user ID from the authentication information.
5. System queries the submissions belonging to the corresponding user ID in PostgreSQL.
6. System sorts the list by the most recent submission time first.
7. System applies pagination if the list has multiple results.
8. System returns the submission list and pagination information.
9. UI displays the submission list.
10. Each submission may display the following basic information:
    - Submission ID.
    - Problem Name or Problem ID.
    - Programming Language.
    - Submission Time.
    - Submission Status.
    - Verdict if the status is `COMPLETED`.
11. User selects a submission from the list.
12. UI switches to UC-U-S-04 to view the submission details.

# 5. Alternative Flow

**A1 – User Has No Submission History**

1. At step 5, System finds no submissions belonging to User.
2. System returns an empty list.
3. UI displays a message that User has no submissions.
4. Use Case ends.

**A2 – User Navigates Between Pages**

1. At step 7, UI sends a request to retrieve the next or previous page.
2. System queries the list according to the pagination information.
3. System returns the corresponding data.
4. UI updates the display list.
5. Returns to step 9 of the Main Flow.

**A3 – User Selects a Submission**

1. At step 11, User selects a submission.
2. UI uses the submission ID to open the detail page.
3. Switches to UC-U-S-04.

**A4 – Submission Is Still Being Processed**

1. At step 10, a submission has a status of `QUEUED`, `COMPILING`, or `JUDGING`.
2. UI displays the current status instead of the verdict.
3. User can open the submission to continue monitoring using UC-U-S-01.

**A5 – Submission Has Internal Error**

1. At step 10, a submission has a status of INTERNAL_ERROR.
2. UI displays the system error status.
3. Does not display `INTERNAL_ERROR` as the verdict.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing or Invalid Access Token**

1. Returns ERR-AUTH-003 – Missing or Invalid Access Token.
2. UI attempts to refresh the Access Token if a valid Refresh Token is available.
3. If unable to refresh, prompt the user to log in again.

**E2 – ERR-AUTH-002: Invalid or Expired Refresh Token**

1. Returns ERR-AUTH-002 – Invalid or Expired Refresh Token.
2. UI clears the local login state and requests a login again.

**E3 – ERR-VAL-001: Invalid Pagination Parameters**

1. Pagination information is invalid, such as the page or page size being in the wrong format or exceeding allowable limits.
2. Returns ERR-VAL-001 – Invalid Input.
3. UI notifies that the query parameters are invalid and requests to reload the list with appropriate parameters.

**E4 – ERR-SYS-001: Internal System Error**

1. System is unable to query the Submission history in PostgreSQL.
2. Returns ERR-SYS-001 – Internal System Error.
3. UI notifies that it cannot load the Submission history.

**E5 – ERR-NET-001: Network Error**

1. Failed connection to System or timeout.
2. Identified as ERR-NET-001 – Network Error.
3. UI allows the user to try again.

**E6 – ERR-LIMIT-001: Rate Limit Exceeded**

1. User has sent too many requests to query history.
2. Returns ERR-LIMIT-001 – Rate Limit Exceeded.
3. UI restricts sending new requests during the limited time.