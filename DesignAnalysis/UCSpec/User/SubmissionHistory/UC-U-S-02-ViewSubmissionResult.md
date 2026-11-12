# Use Case Specification

**UC-U-S-02 - View Submission Result**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-U-P-02
- Use Case Name: View Submission Result
- Brief Description: Allow User to view the grading results of a completed Submission. The results include the Verdict, execution metrics, and summary information about the test cases.
- Participating Actors: User, Administrator (can also use this feature through inheritance from User).

# 2. Preconditions

- User has successfully logged in.
- The Submission exists in the system.
- The Submission is accessible to User.
- The Submission has a status of `COMPLETED`.

# 3. Postconditions

- The grading results are displayed to User.
- User can view the Verdict and the publicly accessible result information.
- No Submission data or grading results are modified.

# 4. Main Flow

1. User accesses the results page of a Submission.
2. UI sends a request to retrieve the Submission results to System.
3. System validates the Access Token.
4. System checks the Submission ID.
5. System queries the Submission in PostgreSQL.
6. System checks User's access rights.
7. System checks the Status of the Submission.
8. System confirms the Status is `COMPLETED`.
9. System retrieves the Verdict and the saved result information.
10. System returns the result data to UI.
11. UI displays the Verdict.
12. UI displays the additional publicly accessible information, such as:
    - Execution Time.
    - Memory Usage.
    - The number of test cases passed.
    - The total number of test cases used for grading.
    - Compilation error messages or execution errors handled appropriately, if any.
13. User views the results.

# 5. Alternative Flow

**A1 – Submission Has Not Completed**

1. At step 7, System determines the Submission is in one of the following states:
    - `QUEUED`
    - `COMPILING`
    - `JUDGING`
2. System returns the current status information, without returning the Verdict.
3. UI notifies that the Submission does not have results yet.
4. User can switch to UC-U-S-01 to continue tracking.

**A2 – Submission Has Internal Error**

1. At step 7, System determines the Submission has a Status of `INTERNAL_ERROR`.
2. System returns the status information and an appropriate system error message.
3. UI notifies that the grading process cannot be completed.
4. No hypothetical Verdict is displayed or regarded as an error due to User's source code.
5. The Use Case ends.

**A3 – User Views a Compilation Error Result**

1. At step 11, the Verdict is `COMPILATION_ERROR`.
2. UI displays the corresponding Verdict.
3. If there is publicly accessible compilation information, UI displays the compilation error message that has been limited and handled appropriately.
4. User can return to the Editor to modify the source code and submit a new Submission.

**A4 – User Views a Non-Accepted Result**

1. At step 11, the Verdict is one of the following values:
    - `WRONG_ANSWER`
    - `TIME_LIMIT_EXCEEDED`
    - `MEMORY_LIMIT_EXCEEDED`
    - `RUNTIME_ERROR`
2. UI displays the corresponding Verdict.
3. User can view the publicly accessible execution metrics and return to the editor to continue editing.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing or Invalid Access Token**

1. Return ERR-AUTH-003 – Missing or Invalid Access Token.
2. UI should try to refresh the Access Token if possible.
3. If refreshing is not possible, prompt User to log in again.

**E2 – ERR-AUTH-002: Invalid or Expired Refresh Token**

1. Return ERR-AUTH-002 – Invalid or Expired Refresh Token.
2. UI should clear the local login state and request User to log in again.

**E3 – ERR-RES-001: Submission Not Found or Not Accessible**

1. The submission does not exist or is not accessible to User.
2. Return ERR-RES-001 – Resource Not Found.
3. UI should notify that the submission was not found.

**E4 – ERR-SYS-001: Result Data Unavailable**

1. The submission has a status of `COMPLETED`, but the result data cannot be retrieved or is incomplete due to a system error.
2. Identify as ERR-SYS-001 – Internal System Error.
3. UI should notify that it cannot load the results and allow for a retry later.
4. Do not create or infer a Verdict.

**E5 – ERR-SYS-001: Internal System Error**

1. System encountered an error when querying the result data.
2. Return ERR-SYS-001 – Internal System Error.
3. UI should notify of the error.

**E6 – ERR-NET-001: Network Error**

1. System connection failed or timed out.
2. Identify as ERR-NET-001 – Network Error.
3. UI should display a message and allow for a retry.

**E7 – ERR-LIMIT-001: Rate Limit Exceeded**

1. User has sent too many requests for results within the allowed time frame.
2. Return ERR-LIMIT-001 – Rate Limit Exceeded.
3. UI should restrict resending requests during the limited time.