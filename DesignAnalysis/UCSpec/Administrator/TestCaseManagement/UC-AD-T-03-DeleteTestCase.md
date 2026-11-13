# Use Case Specification

**UC-AD-T-03 - Delete Test Case**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-AD-T-03
- Use Case Name: Delete Test Case
- Brief Description: Allow Administrator to delete a Test Case from the set of Test Cases currently used by the Problem. The Delete operation is only performed when the Problem is Active and in Draft state.
- Participating Actors: Administrator.

# 2. Preconditions

- Administrator has successfully logged in.
- Administrator has permissions to manage Test Cases.
- The Test Case to be deleted already exists.
- The Problem owning the Test Case is Active and in `DRAFT` state.

# 3. Postconditions

- The Test Case is deleted from the Problem's current set of Test Cases.
- Other Test Cases are not changed.
- The Problem remains.
- The old submission history and grading results are preserved.

# 4. Main Flow

1. Administrator accesses the Problem Management page.
2. Administrator selects the Problem to manage.
3. UI sends a request for Problem information to System.
4. System authenticates the Access Token.
5. System checks Administrator privileges.
6. System queries the Problem by Problem ID.
7. System checks if the Problem exists, is Active, and is in Draft status.
8. System returns the Problem information.
9. Administrator selects the Test Case to delete.
10. UI displays the Test Case information.
11. Administrator selects Delete.
12. UI displays a delete confirmation dialog.
13. Administrator confirms.
14. UI sends a Test Case deletion request to System.
15. System authenticates the Access Token and Administrator privileges.
16. System checks that the Problem and Test Case still exist and that the Problem is still editable.
17. System checks the business constraints related to deleting the test case.
18. System deletes the test case from PostgreSQL.
19. System updates the relevant information if necessary.
20. System returns the operation result.
21. UI reports that the test case was successfully deleted.
22. UI updates the list of test cases.

# 5. Alternative Flow

**A1 – Administrator Cancels Deletion**

1. At step 12, Administrator selects Cancel.
2. UI closes the confirmation dialog.
3. No test cases are deleted.
4. The use case ends.

**A2 – Administrator Deletes the Last Test Case**

1. At step 17, System determines that the test case to be deleted is the last test case of the problem.
2. System checks the minimum number of test cases policy.
3. If the problem is still in Draft mode, deletion may be allowed so Administrator can rebuild the test case set.
4. The problem is not published if it does not meet the minimum number of test cases requirement.
5. Continues to step 18 of the Main Flow if the operation is valid.

**A3 – Test Case Is Already Deleted**

1. At step 16, System does not find the test case.
2. Returns ERR-RES-001 – Resource Not Found.
3. UI updates the list of test cases.
4. The use case ends.

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
3. UI reports that it does not have permission to delete the Test Case.

**E4 – ERR-RES-001: Problem or Test Case Not Found**

1. The Problem ID or Test Case ID does not exist, or the Test Case does not belong to the corresponding Problem.
2. Returns ERR-RES-001 – Resource Not Found.
3. UI reports that the resource was not found.

**E5 – ERR-RES-002: Problem Is Not Editable**

1. The problem is inactive or published.
2. System refused to delete.
3. Returned ERR-RES-002 – Resource State Conflict.
4. Administrator needs to enable or unpublish the problem before continuing.

**E6 – ERR-RES-002: Test Case Cannot Be Deleted**

1. Deleting the test case violates a business constraint or renders the current set of test cases unsuitable.
2. System refuses the operation.
3. Returns ERR-RES-002 – Resource State Conflict.
4. UI displays the reason why deletion is not possible.

**E7 – ERR-RES-002: Concurrent State Change**

1. The test case or problem has been changed by another Administrator during the operation.
2. System detects that the state is no longer appropriate.
3. Returns ERR-RES-002 – Resource State Conflict.
4. UI requests a data reload.

**E8 – ERR-SYS-001: Internal System Error**

1. System cannot delete the test case or update related data in PostgreSQL.
2. Returns ERR-SYS-001 – Internal System Error.
3. UI reports that the test case cannot be deleted.

**E9 – ERR-NET-001: Network Error**

1. UI cannot connect to System or a timeout occurs.
2. The error code is ERR-NET-001 – Network Error.
3. UI displays an error message.
4. Before trying again, reload the list to determine if the previous operation was performed.