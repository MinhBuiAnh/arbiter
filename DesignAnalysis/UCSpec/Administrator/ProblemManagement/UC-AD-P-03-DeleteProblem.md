# Use Case Specification

**UC-AD-P-03 - Delete Problem**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-AD-P-03
- Use Case Name: Delete Problem
- Brief Description: Allows Administrator to deactivate a Problem that is no longer in use. The Delete operation is implemented as a Soft Delete/Deactivation mechanism to preserve Submission data and related data relationships. Administrator can also reactivate a deactivated Problem.
- Participating Actors: Administrator.

# 2. Preconditions

- Administrator has successfully logged in.
- Administrator has management rights for Problems.
- The Problem to be operated on exists in the system.

# 3. Postconditions

If successfully deactivated:
- The Problem is marked as inactive (`is_active = false`).
- The Problem is no longer public or accessible for Users to submit new Submissions.
- Historical Submissions are still preserved.
- The Problem is not physically deleted from PostgreSQL.

If successfully reactivated:
- The Problem is marked as active (`is_active = true`).
- The Problem has a default public status of `DRAFT`.
- The Problem is not automatically made public again.

# 4. Main Flow

1. Administrator accesses the Problem Management page.
2. Administrator selects the Problem to deactivate.
3. UI sends a request to retrieve Problem information to System.
4. System verifies the Access Token.
5. System checks Administrator's rights.
6. System queries the Problem by Problem ID.
7. System checks if the Problem exists.
8. System returns the Problem information.
9. UI displays the Problem information and the Deactivate function.
10. Administrator selects Deactivate Problem.
11. UI displays a confirmation dialog.
12. Administrator confirms the action.
13. UI sends a request to deactivate the Problem to System.
14. System verifies the Access Token and Administrator rights.
15. System checks the Problem ID and current status.
16. System updates:
    - `is_active = false`
    - `publication_status = DRAFT`
17. System saves the changes to PostgreSQL.
18. System returns the result of the operation.
19. UI notifies that the Problem has been successfully deactivated.
20. The Problem no longer appears in the list of public Problems.

# 5. Alternative Flow

**A1 – Administrator Cancels Deactivation**

1. At step 11, Administrator selects Cancel.
2. UI closes the confirmation dialog.
3. No data is changed.
4. Use Case ends.

**A2 – Problem Is Already Inactive**

1. At step 7, System determines that the Problem has is_active = false.
2. System returns the current status.
3. UI notifies that the Problem was previously deactivated.
4. No data updates are performed.
5. Use Case ends.

**A3 – Administrator Reactivates Problem**

1. Administrator selects a Problem that is Inactive.
2. UI displays the Activate function.
3. Administrator confirms the reactivation.
4. System verifies the rights and status of the Problem.
5. System updates:
    - is_active = true
    - publication_status = DRAFT
6. System saves the changes.
7. UI notifies that the reactivation was successful.
8. The Problem is still not public.
9. Use Case ends.

**A4 – Problem Has Existing Submissions**

1. At step 7, System determines that the Problem has Submissions referencing it.
2. System still allows Deactivate.
3. Old Submissions and grading results are preserved.
4. Continue to step 9 of the Main Flow.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing or Invalid Access Token**

1. Returns ERR-AUTH-003 – Missing or Invalid Access Token.
2. UI should attempt to refresh the Access Token if possible.
3. If refreshing is not possible, ask Administrator to log in again.

**E2 – ERR-AUTH-002: Invalid or Expired Refresh Token**

1. Returns ERR-AUTH-002 – Invalid or Expired Refresh Token.
2. UI should clear the local login state and request a new login.

**E3 – ERR-PERM-002: Insufficient Privileges**

1. The user does not have Administrator privileges.
2. Returns ERR-PERM-002 – Insufficient Privileges.
3. UI should notify that the user does not have permission to perform the action.

**E4 – ERR-RES-001: Problem Not Found**

1. The Problem ID does not exist.
2. Returns ERR-RES-001 – Resource Not Found.
3. UI should notify that the Problem was not found.

**E5 – ERR-RES-002: Resource State Conflict**

1. The Problem was changed by another Administrator during the operation.
2. System detects that the current state no longer matches the request.
3. Returns ERR-RES-002 – Resource State Conflict.
4. UI should notify that the state of the Problem has changed and request to reload the data.

**E6 – ERR-SYS-001: Internal System Error**

1. System could not update the state of the Problem in PostgreSQL.
2. Returns ERR-SYS-001 – Internal System Error.
3. UI should notify that the action could not be performed.

**E7 – ERR-NET-001: Network Error**

1. UI could not connect to System or the request timed out.
2. Identified as ERR-NET-001 – Network Error.
3. UI should notify of the error.
4. Before resending the request, check the status of the Problem to avoid misunderstanding that the previous operation failed.