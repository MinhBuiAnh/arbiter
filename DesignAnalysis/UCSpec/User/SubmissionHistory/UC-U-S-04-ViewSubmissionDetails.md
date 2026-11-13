# Use Case Specification

**UC-U-S-03 - View Submission Details**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-U-P-03
- Use Case Name: View Submission Details
- Brief Description: Allow User to view detailed information of a specific Submission, including the submitted source code, corresponding Problem, programming language, submission time, processing status, and grading results if completed.
- Participating Actors: User, Administrator (can also use this feature through inheritance from User).

# 2. Preconditions

- User has successfully logged in.
- The Submission to be viewed exists in the system.
- The Submission is accessible to User.

# 3. Postconditions

- Detailed Submission information is displayed.
- User can review the submitted source code.
- User can track the status or view grading results if the corresponding data is available.
- No Submission data is changed.

# 4. Main Flow

1. User accesses the Submission History page or opens a specific Submission.
2. User selects the Submission they want to view.
3. UI sends a request to retrieve Submission details to System.
4. System verifies the Access Token.
5. System checks the Submission ID.
6. System queries the Submission in PostgreSQL.
7. System checks the User's access rights to the Submission.
8. System retrieves the Submission details, including:
    - Submission ID.
    - User ID or User information relevant to the display rights.
    - Problem ID and Problem Name.
    - Source Code.
    - Programming Language.
    - Submission Time.
    - Submission Status.
    - Verdict if the Submission is completed.
    - Execution Time if available.
    - Memory Usage if available.
    - Summary information about test cases if available.
9. System returns the data to UI.
10. UI displays the Submission details.
11. If the Status is not yet completed, User can switch to UC-U-S-01 to track it.
12. If the Status is `COMPLETED`, User can switch to UC-U-S-02 to view the results.

# 5. Alternative Flow

**A1 – Submission Is Still Being Processed**

1. At step 8, the Submission has a Status of `QUEUED`, `COMPILING`, or `JUDGING`.
2. System returns the currently available details.
3. UI displays the Source Code, Programming Language, and Status.
4. Verdict, Execution Time, and Memory Usage information are not displayed as complete results if they are not available.
5. User can continue to track using UC-U-S-01.

**A2 – Submission Has Completed**

1. At step 8, the Submission has a Status of COMPLETED.
2. System returns the Verdict and the saved result information.
3. UI displays the complete details along with the grading results.
4. User can view more through UC-U-S-02.

**A3 – Submission Has Internal Error**

1. At step 8, the Submission has a Status of `INTERNAL_ERROR`.
2. System returns the Submission information and system error status.
3. UI displays a message that the grading process cannot be completed.
4. Verdict is not displayed.
5. User can still review the submitted Source Code.

**A4 – Problem Is No Longer Publicly Accessible**

1. At step 8, the Problem related to the Submission is no longer public or has been disabled.
2. System still allows the User to view their own Submission.
3. UI displays information about the Problem that can still be accessed.
4. The unavailability of the Problem to the public does not revoke the owner's right to review their Submission.

**A5 – User Navigates to Submission History**

1. User chooses to return to the Submission list.
2. UI redirects to UC-U-S-03.
3. Use Case ends.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing or Invalid Access Token**

1. System cannot validate the Access Token.
2. Returns ERR-AUTH-003 – Missing or Invalid Access Token.
3. UI tries to refresh the Access Token if possible.
4. If unable to refresh, prompts the User to log in again.

**E2 – ERR-AUTH-002: Invalid or Expired Refresh Token**

1. The Refresh Token is invalid, expired, or revoked.
2. Returns ERR-AUTH-002 – Invalid or Expired Refresh Token.
3. UI clears local login status and requests to log in again.

**E3 – ERR-RES-001: Submission Not Found or Not Accessible**

1. The Submission does not exist or is not accessible to the User.
2. Returns ERR-RES-001 – Resource Not Found.
3. UI notifies that the Submission could not be found.

**E4 – ERR-SYS-001: Submission Data Unavailable**

1. System cannot retrieve complete Submission data due to data errors or queries.
2. Returns ERR-SYS-001 – Internal System Error.
3. UI notifies that it cannot load the details.

**E5 – ERR-SYS-001: Internal System Error**

1. System encounters an error while processing the request.
2. Returns ERR-SYS-001 – Internal System Error.
3. UI displays an error message.

**E6 – ERR-NET-001: Network Error**

1. UI cannot connect to System or the request timed out.
2. Identified as ERR-NET-001 – Network Error.
3. UI allows the User to try again.

**E7 – ERR-LIMIT-001: Rate Limit Exceeded**

1. User sent too many requests for detailed Submission queries.
2. Returns ERR-LIMIT-001 – Rate Limit Exceeded.
3. UI limits sending new requests during the restricted time.