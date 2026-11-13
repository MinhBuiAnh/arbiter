# Use Case Specification

**UC-AD-T-01 - Create Test Case**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-AD-T-01
- Use Case Name: Create Test Case
- Brief Description: Allow Administrator to create a Test Case for an existing Problem. Administrator provides Input Data, Expected Output, Test Case type, and execution order.
- Participating Actors: Administrator.

# 2. Preconditions

- Administrator has successfully logged in.
- Administrator has permission to manage Test Cases.
- The Problem to be added a Test Case already exists.
- The Problem is Active and in the `DRAFT` state.

# 3. Postconditions

- The new Test Case has been successfully created and saved in PostgreSQL.
- The Test Case has a unique Test Case ID.
- The Test Case is associated with the corresponding Problem.
- The Test Case is of type `SAMPLE` or `HIDDEN`.
- The Test Case has a defined execution order.

# 4. Main Flow

1. Administrator accesses the Problem Management page.
2. Administrator selects the Problem to manage Test Cases.
3. UI sends a request to System for Problem information.
4. System verifies the Access Token.
5. System checks Administrator privileges.
6. System queries the Problem by Problem ID.
7. System checks if the Problem exists, is Active, or not yet Published.
8. System returns the Problem information.
9. Administrator selects the Create Test Case function.
10. UI displays the Test Case creation form.
11. Administrator enters:
    - Input Data.
    - Expected Output.
    - Test Case Type.
    - Order Index.
12. Administrator submits the form.
13. UI checks the basic validity of the data.
14. System verifies the Access Token and Administrator privileges.
15. System checks the Problem and its current status.
16. System checks the validity of the Test Case Data. 17. System checks for duplicate Order Indexes within the same Problem.
18. System creates a new Test Case.
19. System saves the Test Case to PostgreSQL.
20. System returns the information of the newly created Test Case.
21. UI notifies that the Test Case was successfully created.
22. UI updates the list of Test Cases for the Problem.

# 5. Alternative Flow

**A1 – Administrator Creates a Sample Test Case**

- At step 11, Administrator selects SAMPLE.
- UI marks the Test Case as sample data that can be made public when the Problem is Published.
- System saves the Test Case with type = SAMPLE.
- Continue to step 18 of the Main Flow.

**A2 – Administrator Creates a Hidden Test Case**

- At step 11, Administrator selects HIDDEN.
- UI announces that the data will be protected and not publicly displayed.
- System saves the Test Case with type = HIDDEN.
- Continue to step 18 of the Main Flow.

**A3 – Administrator Adds Multiple Test Cases Sequentially**

- After step 22, Administrator selects to continue creating Test Cases.
- UI displays a new form.
- Administrator enters data for the next Test Case.
- Return to step 11 of the Main Flow.

**A4 – Administrator Cancels Creation**

- At step 10 or 11, Administrator selects Cancel.
- If the form already contains data, UI requests confirmation to cancel.
- Administrator confirms.
- UI closes the form.
- No new Test Cases are created.
- The Use Case ends.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing or Invalid Access Token**

1. System failed to authenticate the Access Token.
2. Returns ERR-AUTH-003 – Missing or Invalid Access Token.
3. UI attempts to refresh the Access Token if a valid Refresh Token is available.
4. If refresh is unsuccessful, prompts Administrator to log in again.

**E2 – ERR-AUTH-002: Invalid or Expired Refresh Token**

1. The Refresh Token is invalid, expired, or revoked.
2. Returns ERR-AUTH-002 – Invalid or Expired Refresh Token.
3. UI clears the local login status and prompts for a login attempt.

**E3 – ERR-PERM-002: Insufficient Privileges**

1. The request sender does not have Administrator privileges.
2. Returns ERR-PERM-002 – Insufficient Privileges.
3. UI reports no permission to manage Test Cases.

**E4 – ERR-RES-001: Problem Not Found**

1. Problem ID does not exist.
2. Returns ERR-RES-001 – Resource Not Found.
3. UI reports no problem found.

**E5 – ERR-RES-002: Problem Is Not Editable**

1. Problem is inactive or published.
2. System refuses to create test cases.
3. Returns ERR-RES-002 – Resource State Conflict.
4. UI requests Administrator to activate or unpublish the problem before continuing.

**E6 – ERR-VAL-001: Invalid Test Case Data**

1. Input Data, Expected Output, Type, or Order Index is invalid.
2. Returns ERR-VAL-001 – Invalid Input.
3. UI displays a message at the corresponding data field.
4. Administrator edits and resubmits.

**E7 – ERR-VAL-001: Duplicate Order Index**

1. The Order Index has already been used by another Test Case in the same Problem.
2. Returns ERR-VAL-001 – Invalid Input.
3. UI prompts Administrator to select a different order.

**E8 – ERR-SYS-001: Internal System Error**

1. System cannot save the Test Case to PostgreSQL.
2. Returns ERR-SYS-001 – Internal System Error.
3. UI reports that it cannot create the Test Case.

**E9 – ERR-NET-001: Network Error**

1. UI cannot connect to System or the request times out.
2. Identified as ERR-NET-001 – Network Error.
3. UI reports an error.
4. Before resubmitting the request, you should check the list of Test Cases to avoid creating duplicates.