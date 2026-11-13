# Use Case Specification

**UC-U-P-03 - Submit Solution**

**Version:** 1.1

# 1. General Information

- Use Case ID: UC-U-P-03
- Use Case Name: Submit Solution
- Brief Description: Allow User to submit source code and a selected programming language for a problem so that System creates a Submission and starts the automatic judging process.
- Primary Actor(s): User, Administrator (through inheritance from User)
- Supporting Actor(s): Judge System (asynchronous internal processing)
- Trigger: User selects the Submit Solution function on the solution writing interface.
- Priority: High
- Status: Draft
- Related Use Cases: UC-U-P-01 – Write Solution, UC-U-P-02 – Select Programming Language, UC-U-S-01 – View Submission Status, UC-SYS-J-01 – Process Submission
- Related Requirements: FR-013, FR-015 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- User is authenticated.
- User can access the solution writing interface for the problem.
- User has selected a programming language for the solution.

# 3. Postconditions

## 3.1. Success

- A new Submission is durably stored with an initial status of `QUEUED`.
- A corresponding queue event is durably stored in the same transaction as the Submission.
- The Submission is eligible for asynchronous processing by the Judge System.
- User receives the Submission ID and the `QUEUED` status.
- Successful receipt of the Submission does not mean that the solution has been judged or accepted.

## 3.2. Failure

- If the request is rejected before creation, no Submission record is created.
- If the transaction fails, neither the Submission nor its queue event is persisted.
- No problem or account data is modified.
- The source code is not retained by System after the request ends.

# 4. Main Flow

1. User completes or updates the solution source code in UC-U-P-01 – Write Solution.
2. User confirms the programming language through UC-U-P-02 – Select Programming Language.
3. User selects the Submit Solution function.
4. UI retrieves the current source code, the selected programming language, and the problem identifier.
5. UI sends a Submission request to System with the access token.
6. System validates the access token and identifies User.
7. System checks that User's account is allowed to submit solutions.
8. System checks that the problem exists and currently allows solution submissions.
9. System validates the Submission data, including source code presence and size, problem identifier, and programming language support.
10. System creates a Submission with an initial status of `QUEUED`.
11. System records a corresponding queue event in the same transaction as the Submission.
12. System commits the transaction.
13. System returns the Submission ID and the `QUEUED` status.
14. UI notifies User that the Submission was received.
15. UI offers navigation to the Submission detail or status tracking area.
16. Use Case ends. Judging continues asynchronously.

**Internal Processing Note:** After step 12 commits, the outbox dispatcher publishes the committed event to the judging queue (`judge:submissions`). The `judge-workers` consumer group distributes the job to a Judge Worker, which compiles the source code and executes the test cases in a sandbox. If the queue is temporarily unavailable, the dispatcher retries publication according to the retry policy in UC-SYS-J-01 – Process Submission (`ERR-SYS-002`). The Submission remains `QUEUED`, and no failure is reported to User while the Submission and its queue event are durably stored. This processing is internal and is not a user interaction step.

# 5. Alternative Flow

**A1 – User Reviews Solution Before Submission**

1. At step 3, User chooses to return to the editor instead of submitting.
2. System retains the current source code and selected language in the session.
3. User can view or edit the source code in UC-U-P-01 – Write Solution.
4. When ready, User selects the Submit Solution function again.
5. Use Case continues at step 3 of the Main Flow.

**A2 – User Views Submission Status**

1. After step 14, User chooses to view the Submission status.
2. System navigates to UC-U-S-01 – View Submission Status.
3. User tracks the processing status of the Submission there.
4. Use Case ends.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing, Invalid, or Expired Access Token**

1. At step 6, System cannot find, validate, or accept the access token.
2. System rejects the Submission request.
3. No Submission record is created.
4. System logs the rejection with the request ID without logging the token.
5. System returns `ERR-AUTH-003`.
6. UI clears the stored authentication information and navigates User to the login page.
7. Use Case ends.

**E2 – ERR-ACC-001: Account Not Available**

1. At step 7, System detects that User's account does not exist, is disabled, or is otherwise not allowed to submit solutions.
2. System rejects the Submission request.
3. No Submission record is created.
4. System logs the rejection with the request ID.
5. System returns `ERR-ACC-001`.
6. UI notifies User that the account cannot submit solutions and asks them to contact an Administrator.
7. Use Case ends.

**E3 – ERR-RES-001: Problem Not Found**

1. At step 8, System does not find a problem corresponding to the problem identifier.
2. System rejects the Submission request.
3. No Submission record is created.
4. System logs the rejection with the request ID.
5. System returns `ERR-RES-001`.
6. UI notifies User that the problem does not exist or is no longer available.
7. User can return to the problem list. Use Case ends.

**E4 – ERR-PERM-001: Problem Not Publicly Accessible**

1. At step 8, System detects that the problem is not publicly accessible or no longer allows solution submissions.
2. System rejects the Submission request.
3. No Submission record is created.
4. System logs the rejection with the request ID.
5. System returns `ERR-PERM-001`.
6. UI notifies User that the problem currently does not allow solution submissions.
7. Use Case ends.

**E5 – ERR-VAL-014: Invalid Submission Data**

1. At step 9, System detects that the Submission data is invalid, such as:
   - The source code is empty.
   - The source code exceeds the allowed size limit.
   - The problem identifier is missing or malformed.
   - The programming language is missing.
   - Another field has an invalid format.
2. System rejects the Submission request.
3. No Submission record is created.
4. System logs the validation failure with the request ID without logging source code.
5. System returns `ERR-VAL-014` with the invalid fields and their causes.
6. UI displays the errors next to the affected fields.
7. User edits the data and resubmits the solution; Use Case continues at step 3. Otherwise, Use Case ends.

**E6 – ERR-VAL-013: Unsupported Programming Language**

1. At step 9, System detects that the selected programming language is not supported.
2. System rejects the Submission request.
3. No Submission record is created.
4. System logs the rejection with the request ID.
5. System returns `ERR-VAL-013` with the list of supported languages.
6. UI notifies User that the language is unsupported.
7. User selects a supported language through UC-U-P-02 – Select Programming Language; Use Case continues at step 3. Otherwise, Use Case ends.

**E7 – ERR-LIMIT-001: Rate Limit Exceeded**

1. At step 9, System detects that User has exceeded the Submission throttle. In v1, the limit is one Submission per User per 5 seconds.
2. System rejects the current request.
3. No Submission record is created.
4. System returns `ERR-LIMIT-001` with the time at which User may retry.
5. UI notifies User to wait before submitting again.
6. User may retry after the indicated time; Use Case continues at step 3. Otherwise, Use Case ends.

**E8 – ERR-SYS-001: Internal System Error**

1. At steps 10–13, System encounters an unexpected error while creating the Submission, recording the queue event, committing the transaction, or preparing the response.
2. System stops processing the request.
3. System rolls back the transaction so that no Submission is persisted without its queue event and no queue event is persisted without its Submission.
4. System logs the error with the request ID without logging source code.
5. System returns `ERR-SYS-001` with a general error message.
6. UI notifies User that the Submission cannot be accepted at this time.
7. User may retry later; Use Case ends.

**E9 – ERR-NET-001: Network Error**

1. During the request or response, the network connection is interrupted or times out.
2. UI cannot confirm whether the Submission was created.
3. UI notifies User that the result of the submission is unknown.
4. User checks the Submission history before retrying to avoid creating a duplicate Submission.
5. If the Submission history confirms that no Submission was created, User may repeat the action; Use Case continues at step 3.
6. Otherwise, Use Case ends.

# 7. Assumptions

- The supported languages in v1 are C++17 and Python 3.
- The source size limit in v1 is 64 KiB.
- The Submission throttle in v1 is one Submission per User per 5 seconds.
- Judging is performed asynchronously after the Submission is accepted.
- A Submission that is accepted for processing may still fail compilation or produce a non-accepted result.
- An Administrator inherits the User behavior for this use case.

# 8. Special Requirements

- Submission creation and queue-event recording must be atomic.
- The access token and source code must never be written to logs or error responses.
- The response must return the Submission ID and initial status without exposing queue internals.
- The endpoint must be rate-limited per User.
- The Submission must be idempotent with respect to retries after an unknown outcome: the UI must verify the Submission history before resubmitting.
- Hidden test data must never be exposed through the Submission response.

# 9. Open Issues

- None for v1.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 1.1 | 2026-11-13 | Aligned with `SpecStructure.md` v1.1: added metadata, split postconditions, moved authentication and account checks out of preconditions, replaced implementation-specific terms in user-facing steps, moved queue-unavailable handling into an Internal Processing Note, and assigned distinct invalid-data and unsupported-language error codes. |
