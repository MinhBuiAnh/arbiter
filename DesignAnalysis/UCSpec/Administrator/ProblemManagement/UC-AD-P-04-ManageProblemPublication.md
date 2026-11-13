# Use Case Specification

**UC-AD-P-04 - Manage Problem Publication**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-AD-P-04
- Use Case Name: Manage Problem Publication
- Brief Description: Allows Administrator to manage the public status of a Problem by publishing or unpublishing it. A published Problem will appear in the list of public Problems and can be accessed by Guests/Users. An unpublished Problem will no longer be displayed publicly but will still be stored in the system for Administrator to manage.
- Participating Actors: Administrator.

# 2. Preconditions

- Administrator has logged in successfully.
- Administrator has the right to manage Problems.
- The Problem whose status needs to be changed already exists.
- The Problem is Active.

# 3. Postconditions

If publish is successful:
- `publication_status = PUBLISHED`.
- The Problem remains in the Active status.
- The Problem appears in the list of public Problems.
- Guests/Users can access the Problem and submit a Submission if other business conditions are met.

If unpublish is successful:
- `publication_status = DRAFT`.
- The Problem remains in the Active status.
- The Problem no longer appears in the list of public Problems.
- Historical Submissions are not affected.

# 4. Main Flow

1. Administrator accesses the Problem Management page.
2. Administrator selects the Problem to be published.
3. UI sends a request for Problem information to System.
4. System authenticates the Access Token.
5. System checks Administrator's permissions.
6. System queries the Problem by Problem ID.
7. System checks if the Problem exists and is Active.
8. System returns the Problem information.
9. UI displays the Problem information and current public status.
10. Administrator selects Publish.
11. UI displays a confirmation message for publishing the Problem.
12. Administrator confirms the action.
13. UI sends a Publish request to System.
14. System authenticates the Access Token and Administrator's permissions.
15. System checks the Problem ID and current status.
16. System checks if the Problem meets the criteria for publication.
17. System updates publication_status = PUBLISHED.
18. System saves the changes to PostgreSQL.
19. System returns the new public status.
20. UI notifies that the Publish was successful.
21. The Problem appears in the list of public Problems.

# 5. Alternative Flow

**A1 – Administrator Unpublishes Problem**

1. At step 9, Administrator selects a Problem that is Published.
2. Administrator selects Unpublish.
3. UI displays a confirmation dialog.
4. Administrator confirms the action.
5. System authenticates the permissions and checks the Problem's status.
6. System updates publication_status = DRAFT.
7. System saves the changes.
8. UI notifies that the Unpublish was successful.
9. The Problem no longer appears in the list of public Problems.
10. Use Case ends.

**A2 – Problem Is Already Published**

1. At step 7, System determines that the Problem already has publication_status = PUBLISHED.
2. System returns the current status.
3. UI notifies that the Problem has already been published.
4. No unnecessary updates are performed.
5. Use Case ends.

**A3 – Problem Is Already Unpublished**

1. At step 9, Administrator selects a Problem that is Draft and requests Unpublish.
2. System determines that the Problem is already in the DRAFT status.
3. UI notifies that the Problem has not been published.
4. No updates are performed.
5. Use Case ends.

**A4 – Administrator Cancels Publication**

1. At step 11, Administrator selects Cancel.
2. UI closes the confirmation dialog.
3. No change is made to the Problem's status.
4. Use Case ends.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing or Invalid Access Token**

1. Returns ERR-AUTH-003 – Missing or Invalid Access Token.  
2. UI should attempt to refresh the Access Token if possible.
3. If unable to refresh, request Administrator to log in again.

**E2 – ERR-AUTH-002: Invalid or Expired Refresh Token**

1. Returns ERR-AUTH-002 – Invalid or Expired Refresh Token.
2. UI should clear the local login status and request re-login.

**E3 – ERR-PERM-002: Insufficient Privileges**

1. User does not have Administrator privileges.
2. Returns ERR-PERM-002 – Insufficient Privileges.
3. UI should notify that there are no permissions to manage the public status.

**E4 – ERR-RES-001: Problem Not Found**

1. Problem ID does not exist.
2. Returns ERR-RES-001 – Resource Not Found.
3. UI should notify that the Problem was not found.

**E5 – ERR-RES-002: Problem Is Inactive**

1. Backend determines that the Problem is `is_active = false`.
2. Publishing the Problem is not allowed.
3. Returns ERR-RES-002 – Resource State Conflict.
4. Administrator needs to reactivate the Problem before publishing.

**E6 – ERR-VAL-001: Problem Does Not Meet Publication Requirements**

1. The Problem does not meet the publication conditions, such as missing required content or not meeting the Test Cases conditions.
2. Backend refuses to publish.
3. Returns ERR-VAL-001 – Invalid Input.
4. Backend returns information about the unmet conditions.
5. UI displays the issues that need to be resolved.
6. Administrator updates the Problem or Test Cases and then tries to publish again.

**E7 – ERR-RES-002: Concurrent State Change**

1. The status of the Problem was changed by another Administrator while the Publish/Unpublish request is being processed.
2. Backend detects that the status no longer matches the requested operation.
3. Returns ERR-RES-002 – Resource State Conflict.
4. UI should notify that the status has changed and request a reload.

**E8 – ERR-SYS-001: Internal System Error**

1. Backend is unable to save the new public status to PostgreSQL.
2. Returns ERR-SYS-001 – Internal System Error.
3. UI should notify that it cannot change the public status.

**E9 – ERR-NET-001: Network Error**

1. UI cannot connect to System or the request has timed out.
2. Identified as ERR-NET-001 – Network Error.
3. UI should notify the error and allow retry after checking the status of the Problem.