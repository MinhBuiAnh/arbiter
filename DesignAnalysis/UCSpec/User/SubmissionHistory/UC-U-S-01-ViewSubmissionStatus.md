# Use Case Specification

**UC-U-S-01 - View Submission Status**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-U-P-01
- Use Case Name: View Submission Status
- Brief Description: Allow User to view the current processing status of a submission that has been submitted to System. UI uses HTTP polling to periodically fetch the latest status from System while the judging system is processing the submission.
- Participating Actors: User, Administrator (can also use this feature through inheritance from User).

# 2. Preconditions

- User has successfully logged in.
- User has a submission that has been created in the system.
- User has access rights to the corresponding submission.
- System provides the functionality to query the submission status.

# 3. Postconditions

- The latest status of the submission is displayed to the user.
- No submission data is altered.
- If the submission is not complete, the user can continue to monitor the status.
- If the submission has finished processing, the user can proceed to view the results.

# 4. Main Flow

1. User accesses the submission page or the submission details page.
2. UI displays the submission identification information.
3. UI sends a request to get the submission status to the backend.
4. System validates the user’s access token.
5. System checks the provided submission ID.
6. System queries the submission in PostgreSQL.
7. System checks the user’s access rights to the submission.
8. System retrieves the current status of the submission.
9. System returns the submission ID, status, and timestamp information if available.
10. UI displays the submission status to the user.
11. If the status is not a terminal state (`COMPLETED` or `INTERNAL_ERROR`), UI continues HTTP polling at the configured interval.
12. Upon receiving a terminal status, UI stops polling.
13. If the status is `COMPLETED`, UI allows the user to view the results through UC-U-S-02.

# 5. Alternative Flow

**A1 – Submission Status Changes During Polling**

1. At step 11, UI sends a request to get the new status.
2. System returns a newer Status compared to the previous query.
3. UI updates the displayed status.
4. Go back to step 11 of the Main Flow if the Submission has not yet completed.

**A2 – Submission Has Completed**

1. At step 11, System returns the Status `COMPLETED`.
2. UI stops HTTP Polling.
3. UI displays a message that the grading process has been completed.
4. User can switch to UC-U-S-02 to view the Verdict and result information.

**A3 – Submission Encounters Internal Error**

1. At step 11, System returns the Status `INTERNAL_ERROR`.
2. UI stops HTTP Polling.
3. UI notifies that System cannot complete the grading process.
4. Do not display `INTERNAL_ERROR` as a Verdict.
5. Use Case ends.

**A4 – Submission Is Still Queued**

1. System returns the status `QUEUED`.
2. UI continues to display the status as pending.
3. User can leave the page or continue to monitor.
4. Do not consider this an error if System is waiting for the Dispatcher or Judge Worker to process.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing or Invalid Access Token**

1. System could not authenticate the Access Token.
2. Returns ERR-AUTH-003 – Missing or Invalid Access Token.
3. If there is a valid Refresh Token, UI refreshes the Access Token and sends the request again.
4. If it cannot refresh, it requires the user to log in again.

**E2 – ERR-AUTH-002: Invalid or Expired Refresh Token**

1. The Refresh Token is invalid, expired, or has been revoked.
2. Returns ERR-AUTH-002 – Invalid or Expired Refresh Token.
3. UI clears the local login state and redirects the user to the login screen.

**E3 – ERR-RES-001: Submission Not Found or Not Accessible**

1. The submission does not exist or is not accessible to User.
2. Returns ERR-RES-001 – Resource Not Found.
3. UI notifies that the submission was not found.

**E4 – ERR-LIMIT-001: Rate Limit Exceeded**

1. User is sending status query requests too frequently.
2. Returns ERR-LIMIT-001 – Rate Limit Exceeded.
3. UI adjusts the polling frequency and only continues when it can send a valid request.

**E5 – ERR-SYS-001: Internal System Error**
1. System cannot query the status due to processing errors or PostgreSQL access issues.
2. Returns ERR-SYS-001 – Internal System Error.
3. UI displays an error message and allows the user to try again later.

**E6 – ERR-NET-001: Network Error**
1. UI cannot connect to System or the request timed out.  
2. Identified as ERR-NET-001 – Network Error.  
3. UI may retry according to the retry policy, but should not misunderstand the connection error as a new status of the submission.