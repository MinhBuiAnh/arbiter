# Use Case Specification

**UC-AD-P-02 - Update Problem**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-AD-P-02
- Use Case Name: Update Problem
- Brief Description: Allow Administrator to update the information of an existing Problem, including the title, description, Input/Output formats, Constraints, and execution resource limits. The update must not change the historical Submission data.
- Participating Actors: Administrator.

# 2. Preconditions

- Administrator has successfully logged in.
- Administrator has permission to manage Problems.
- The Problem to be edited exists.
- The Problem is not disabled.

# 3. Postconditions

- The Problem information is successfully updated in PostgreSQL.
- Existing Submissions retain their historical data.
- The public status of the Problem does not automatically change just because of the updated content.
- Administrator receives confirmation of a successful update.

# 4. Main Flow

1. Administrator accesses the Problem Management page.
2. Administrator selects the Problem to be edited.
3. UI sends a request to retrieve the Problem information to System.
4. System verifies the Access Token.
5. System checks the Administrator's permissions.
6. System queries the Problem by Problem ID.
7. System checks that the Problem exists and is Active.
8. System returns the current Problem information.
9. UI displays the edit form with the existing data.
10. Administrator edits the necessary fields.
11. Administrator submits the update request.
12. UI performs basic validity checks on the data.
13. System verifies the Access Token and Administrator's permissions.
14. System checks the Problem ID and the current status of the Problem.
15. System validates the update data.
16. System updates the corresponding fields in PostgreSQL.
17. System logs the new update timestamp.
18. System returns the Problem information after the update.
19. UI notifies of a successful update.

# 5. Alternative Flow

**A1 – Administrator Updates Only Selected Fields**

1. At step 10, Administrator changes only some fields.
2. UI sends only the updated fields or sends all data while retaining unchanged fields.
3. System preserves the values that were not requested for editing.
4. Proceed to step 15 of the Main Flow.

**A2 – Administrator Cancels Update**

1. At step 10, Administrator selects Cancel.
2. UI requests confirmation if there is unsaved data.
3. Administrator confirms the cancellation.
4. UI returns to the Problem detail page.
5. No changes are saved.
6. The Use Case ends.

**A3 – Problem Is Published**

1. At step 7, the Problem has `publication_status = PUBLISHED`.
2. System still allows Administrator to edit if the Problem is Active.
3. After a successful update, the Problem retains its Published status.
4. However, the updated data must meet the valid rules applicable to publicly published Problems.
5. Proceed to step 9 of the Main Flow.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing or Invalid Access Token**

1. Return ERR-AUTH-003 – Missing or Invalid Access Token.
2. UI should attempt to refresh the Access Token if possible.
3. If refreshing is not possible, request the Administrator to log in again.

**E2 – ERR-AUTH-002: Invalid or Expired Refresh Token**

1. Return ERR-AUTH-002 – Invalid or Expired Refresh Token.
2. UI clears the local login state and requests a new login.

**E3 – ERR-PERM-002: Insufficient Privileges**

1. The user does not have Administrator rights.
2. Return ERR-PERM-002 – Insufficient Privileges.
3. UI notifies that there is no permission to edit the Problem.

**E4 – ERR-RES-001: Problem Not Found**

1. The Problem ID does not exist in the system.
2. Return ERR-RES-001 – Resource Not Found.
3. UI notifies that the Problem cannot be found.

**E5 – ERR-RES-002: Problem Is Inactive**

1. The Problem has been disabled.
2. System refuses to update through this Use Case.
3. Return ERR-RES-002 – Resource State Conflict.
4. Administrator needs to reactivate the Problem before editing.

**E6 – ERR-VAL-001: Invalid Update Data**

1. The update data is invalid or violates business constraints.
2. Return ERR-VAL-001 – Invalid Input.
3. UI displays an error for Administrator to correct.

**E7 – ERR-RES-002: Concurrent Update Conflict**

1. The Problem has been changed by another Administrator while the edit form is open.
2. System detects the update data based on an old version.
3. Return ERR-RES-002 – Resource State Conflict.
4. UI notifies that the data has been changed.
5. Administrator should reload the latest data before proceeding.

**E8 – ERR-SYS-001: Internal System Error**

1. System cannot update the Problem in PostgreSQL.
2. Return ERR-SYS-001 – Internal System Error.
3. UI notifies that it cannot update the Problem.

**E9 – ERR-NET-001: Network Error**

1. System connection failed or timed out.
2. Identified as ERR-NET-001 – Network Error.
3. UI notifies the error and allows retrying after checking the current data.