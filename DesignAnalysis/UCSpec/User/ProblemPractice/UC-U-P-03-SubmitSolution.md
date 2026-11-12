# Use Case Specification

**UC-U-P-03 - Submit Solution**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-U-P-03
- Use Case Name: Submit Solution
- Brief Description: Allow User to submit the source code of the solution along with the chosen programming language to System to create a Submission and enter the automatic grading process.
- Participating Actors: User, Administrator (can also use this feature through inheritance from User).

# 2. Preconditions

- User has logged into the system.
- Access Token is valid or can be refreshed using Refresh Token.
- The problem exists and is public, allowing for a solution to be submitted.
- The source code for the solution has been provided.
- User has selected a supported programming language.
- System can accept the Submission.

# 3. Postconditions

- If the request is successfully received:  
    - A new Submission is created and saved to PostgreSQL.  
    - The Submission has an initial status of QUEUED.  
    - The Submission is queued for processing by the Judge Worker.  
    - User receives a Submission ID to track the results.  
- If the request is denied before the Submission is created, System does not create a valid Submission record.  
- Successful receipt of the Submission does not mean that the solution has been judged or accepted.

# 4. Main Flow

1. User completes writing the source code in UC-U-P-01 – Write Solution.  
2. User selects the programming language through UC-U-P-02 – Select Programming Language.  
3. User selects the Submit Solution function.  
4. UI retrieves the current source code, the selected programming language, and the problem identifier.  
5. UI sends a Submission request to System, along with the Access Token.  
6. System verifies the Access Token and identifies the user making the request.  
7. System checks the validity of the request, including:  
    - Whether the problem exists and allows solution submissions.  
    - Whether the source code has been provided and meets size limits.  
    - Whether the programming language is supported.  
    - Whether User has sufficient rights to submit.  
8. System creates a Submission record with an initial status of QUEUED.  
9. System logs the event to queue the Submission in the same transaction as creating the Submission using the Transactional Outbox mechanism.  
10. System successfully commits the transaction.  
11. System confirms that it has received the Submission and returns the Submission ID along with the status QUEUED.  
12. UI notifies that the Submission has been received.  
13. UI can navigate the user to the Submission detail page or status tracking area.  
14. The use case ends. The judging of the source code continues asynchronously within the system.

**Internal Processing Note:** After step 10, the Outbox Dispatcher will publish the event to the Redis Stream judge:submissions. The consumer group judge-workers distributes the workload to the Judge Worker. The worker compiles and runs test cases in the Docker Sandbox. These steps are part of the internal process of the Judge System, not direct interaction steps of the user in this use case.

# 5. Alternative Flow

**A1 – Refresh Access Token**

1. At step 6, System detects that Access Token has expired.
2. UI uses Refresh Token to request a new Access Token.
3. System checks the Refresh Token.
4. If valid, System issues a new Access Token.
5. UI resends the Submission request using the new Access Token.
6. The use case continues from step 6 of the Main Flow.

**A2 – User Reviews Solution Before Submission**

1. At step 3, User does not want to submit the solution immediately.  
2. User returns to the editor to view or edit the source code.  
3. System retains the current source code content in the session.  
4. When ready, User can submit the Solution.  
5. The use case continues from step 3 of the Main Flow.  

**A3 – User Views Submission Status**

1. After step 12, User chooses to view the Submission status.  
2. System navigates to the UC-U-S-01 – View Submission Status function.  
3. User tracks the processing status of the Submission.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing or Invalid Access Token**

1. At step 6, System detects that Access Token does not exist, is invalid, or cannot be authenticated.
2. System rejects the Submission request.
3. UI checks the ability to refresh the Access Token using the Refresh Token.
4. If Refresh Token is valid, UI receives a new Access Token and can resubmit the request.
5. If unable to refresh the token, UI prompts the User to log in again.
6. The Use Case ends if authentication cannot be performed.

**E2 – ERR-AUTH-002: Invalid or Expired Refresh Token**

1. In A1, System detects that Refresh Token is invalid, expired, or has been revoked.
2. System refuses to issue a new Access Token.
3. UI clears invalid authentication information.
4. UI navigates the User to the login page.
5. The Use Case ends.

**E3 – ERR-RES-001: Problem Not Found**

1. At step 7, System does not find a problem corresponding to the Problem ID.
2. System rejects the Submission request.
3. System returns a resource not found error.
4. UI notifies that the problem does not exist or is no longer available.
5. The Use Case ends.

**E4 – ERR-PERM-001: Problem Not Publicly Accessible**

1. At step 7, System detects that the problem is not in a state that allows solution submissions.
2. System rejects the Submission request.
3. System does not create a Submission record.
4. UI notifies that the problem currently does not allow solution submissions.
5. The Use Case ends.

**E5 – ERR-VAL-001: Invalid Submission Data**
1. At step 7, System detects that the Submission data is invalid, such as:
   - Empty source code.
   - Source code exceeding the allowed size limit.
   - Missing Problem ID.
   - Programming language not provided.
   - Data with an invalid format.
2. System rejects the request.
3. System returns information about the invalid data fields.
4. UI displays the corresponding notification.
5. User edits the data and resubmits.

**E6 – ERR-SYS-001: Internal System Error**

1. At steps 8–10, System encounters an error while creating the Submission or logging the Outbox event.
2. System stops processing the request.
3. The transaction is rolled back to ensure that there is no Submission created without the corresponding Outbox event.
4. System logs the error and request ID.
5. System returns a general error message.
6. UI informs that it cannot accept the Submission at this time.
7. User may try again later.

**E7 – ERR-NET-001: Network Error**

1. During the process of sending a request or receiving a response, the connection is interrupted or times out.
2. UI does not receive confirmation of the Submission.
3. UI notifies that it cannot confirm the result of the solution submission.
4. User may check the Submission history before resubmitting to avoid creating duplicate Submissions.
5. If there is no corresponding Submission, User may repeat the action.

**E8 – ERR-LIMIT-001: Rate Limit Exceeded**
1. At step 7, System detects that the User has sent too many Submission requests within the designated time frame.
2. System rejects the current request.
3. System returns information about the limit and the time when User may try again if supported.
4. UI notifies the User to wait before submitting the next solution.

**E9 – ERR-SYS-002: Submission Queue Unavailable**

1. After the Submission is created, the Outbox Dispatcher cannot publish the event to the Redis Stream due to Redis being unavailable or encountering a connection error.
2. The Submission and Outbox event remain persistently stored in PostgreSQL.
3. The Dispatcher continues to attempt to publish again according to the retry policy.
4. The Submission retains a QUEUED status while waiting to be placed in the queue.
5. System can still return a successful Submission receipt result if the transaction has committed.
6. System logs the error status for monitoring and recovery purposes.

**Note:** This is an internal infrastructure error. User should not be informed that the Submission has failed if the record has been successfully created and the Outbox event is safely stored. The retry process must ensure no duplicate Submissions are created.

**E10 – ERR-ACC-001: Account Not Allowed**

1. At steps 6–7, System detects that User's account is no longer permitted to submit, for example, if the account has been locked.
2. System rejects the request.
3. System does not create a new Submission.
4. UI notifies that the account is currently not allowed to use this function.
5. The Use Case ends.