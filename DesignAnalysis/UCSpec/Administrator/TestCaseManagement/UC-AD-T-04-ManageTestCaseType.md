# Use Case Specification

**UC-AD-T-04 - Manage Test Case Type**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-AD-T-04
- Use Case Name: Manage Test Case Type
- Brief Description: Allow Administrator to change the type of a Test Case between `SAMPLE` and `HIDDEN`, to manage Test Cases that are publicly accessible and those that are only for internal use by the Judge System.
- Participating Actors: Administrator.

# 2. Preconditions

- Administrator has successfully logged in.
- Administrator has permission to manage Test Cases.
- The Test Case whose type needs to be changed already exists.
- The problem owning the Test Case is Active and in the `DRAFT` state.

# 3. Postconditions

- The Test Case type has been successfully updated in PostgreSQL.
- Input Data and Expected Output are preserved.
- The execution order of the Test Case remains unchanged.
- Changing the type does not alter the historical Submission results.

# 4. Main Flow

1. Administrator accesses the Problem Management page.
2. Administrator selects the Problem to manage Test Cases.
3. UI sends a request to System for Problem information.
4. System authenticates the Access Token.
5. System checks Administrator privileges.
6. System queries the Problem by Problem ID.
7. System checks if the Problem exists, is Active, and is in Draft status.
8. System returns the Problem information.
9. Administrator selects the Test Case to change its type.
10. UI sends a request to System for Test Case information.
11. System checks if the Test Case exists and belongs to the corresponding Problem.
12. System returns the Test Case information.
13. UI displays the current type and available types.
14. Administrator selects the new type (SAMPLE or HIDDEN).
15. UI displays confirmation of the type change.
16. Administrator confirms.
17. UI sends a Test Case type update request to System.
18. System authenticates the Access Token and Administrator privileges.
19. System checks that the Problem and Test Case still exist and that the Problem is still editable.
20. System verifies that the new type is valid.
21. System updates the Test Case Type in PostgreSQL.
22. System saves the update time.
23. System returns the Test Case information after the change.
24. UI updates the list of Test Cases.
25. UI notifies that the type change was successful.

# 5. Alternative Flow

**A1 – Change Sample to Hidden**

1. At step 14, Administrator selects to change from `SAMPLE` to `HIDDEN`.
2. UI announces that the Test Case will no longer be publicly accessible to Guests/Users.
3. Administrator confirms.
4. System updates the type to `HIDDEN`.
5. Input Data and Expected Output remain unchanged.
6. Continue to step 22 of the Main Flow.

**A2 – Change Hidden to Sample**

1. At step 14, Administrator selects to change from `HIDDEN` to `SAMPLE`.
2. UI warns that the Test Case's Input and Expected Output data may be publicly accessible when the Problem is Published.
3. Administrator confirms.
4. System updates the type to `SAMPLE`.
5. Input Data and Expected Output remain unchanged.
6. Continue to step 22 of the Main Flow.

**A3 – Administrator Selects the Current Type**

1. At step 14, Administrator selects the current type again.
2. UI announces that the Test Case type remains unchanged.
3. No update request is sent.
4. Use Case ends.

**A4 – Administrator Cancels Type Change**

1. At step 15, Administrator selects Cancel.
2. UI closes the confirmation dialog.
3. No data is changed.
4. Use Case ends.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing or Invalid Access Token**

1. Returns ERR-AUTH-003 – Missing or Invalid Access Token.
2. UI attempts to refresh the Access Token if possible.
3. If it cannot be refreshed, prompts Administrator to log in again.

**E2 – ERR-AUTH-002: Invalid or Expired Refresh Token**

1. Returns ERR-AUTH-002 – Invalid or Expired Refresh Token.
2. UI clears the local login status and prompts for a login attempt.

**E3 – ERR-PERM-002: Insufficient Privileges**

1. The request sender does not have Administrator privileges.
2. Returns ERR-PERM-002 – Insufficient Privileges.
3. UI reports that it does not have the right to manage the Test Case Type.

**E4 – ERR-RES-001: Problem or Test Case Not Found**

1. The Problem ID or Test Case ID does not exist, or the Test Case does not belong to the corresponding Problem.
2. Returns ERR-RES-001 – Resource Not Found.
3. UI reports that the resource was not found.

**E5 – ERR-RES-002: Problem Is Not Editable**

1. The problem is inactive or published.
2. System refused to change the test case type.
3. Returns ERR-RES-002 – Resource State Conflict.
4. Administrator needs to enable or unpublish the problem before continuing.

**E6 – ERR-VAL-001: Invalid Test Case Type**

1. The submitted test case type is not in the supported list.
2. System refuses to update.
3. Returns ERR-VAL-001 – Invalid Input.
4. UI prompts Administrator to select a valid type.

**E7 – ERR-RES-002: Concurrent State Change**

1. The test case or problem has been changed by another Administrator during the operation.
2. System detects that the state is no longer appropriate.
3. Returns ERR-RES-002 – Resource State Conflict.
4. UI requests a data reload.

**E8 – ERR-SYS-001: Internal System Error**

1. System cannot save changes to PostgreSQL.
2. Returns ERR-SYS-001 – Internal System Error.
3. UI reports that it cannot change the test case type.

**E9 – ERR-NET-001: Network Error**

1. UI cannot connect to System or the request times out.
2. Identified as ERR-NET-001 – Network Error.
3. UI reports errors and allows retrying after checking the current state.