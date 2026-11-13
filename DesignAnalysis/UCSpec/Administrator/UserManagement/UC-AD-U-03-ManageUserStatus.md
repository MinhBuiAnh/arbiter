# Use Case Specification

**UC-AD-U-03 - Manage User Status**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-AD-U-03
- Use Case Name: Manage User Status
- Brief Description: Allow Administrator to change the active status of a user account, including locking and unlocking the account.
- Participating Actors: Administrator.

# 2. Preconditions

- Administrator has successfully logged in.
- The Access Token is valid.
- The Administrator account is in an active state.
- The target user account exists.

# 3. Postconditions

- Account status is successfully updated if the operation is valid.
- System records the time of the change and Administrator performs the operation.
- User submissions and history data are preserved.

# 4. Main Flow

1. Administrator accesses the user management function.
2. Administrator selects the account whose status needs to be changed.
3. System authenticates the Access Token and checks Administrator privileges.
4. System queries the target account.
5. System displays the current status of the account.
6. Administrator selects an action:
    - Lock Account.
    - Unlock Account.
7. System checks the current status and validity of the action.
8. System requests confirmation from the Administrator.
9. Administrator confirms the action.
10. System updates the account status in PostgreSQL.
11. System records the audit information of the action.
12. System notifies Administrator of the result.

# 5. Alternative Flow

**A1 – Lock Account**

1. In step 6, Administrator selects Lock Account.
2. After confirmation, the system changes the account status from `ACTIVE` to `LOCKED`.

**A2 – Unlock Account**

1. In step 6, Administrator selects Unlock Account.
2. After confirmation, the system changes the account status from `LOCKED` to `ACTIVE`.

**A3 – Account is in the target state**

1. If the account was `LOCKED` when Administrator requested to lock it, or `ACTIVE` when requested to unlock it.
2. System displays the current status and does not perform unnecessary updates.

**A4 – Cancel Operation**

1. In step 8, Administrator cancels the confirmation.
2. System does not change the account status.

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
3. UI reports that it does not have the right to view the user list.

**E4 – ERR-RES-001: User Not Found**

1. The User ID does not exist in the system.
2. Return ERR-RES-001 – Resource Not Found.
3. UI notifies that the user cannot be found.

**E5 – ERR-RES-002: Concurrent State Change**

1. The account status has been changed by another Administrator during the operation.
2. System detects that the state is no longer appropriate.
3. Returns ERR-RES-002 – Resource State Conflict.
4. UI requests a data reload.

**E6 – ERR-VAL-001: Invalid Status Value**

1. Requested status is invalid.
2. System rejects the request.
3. Returns ERR-VAL-001 – Invalid Input.
4. UI displays a message at the corresponding data field.
5. Administrator edits and resubmits.

**E7 – ERR-ACC-001: Account Not Available**

1. Account is not authorized to perform the operation due to current status or system policy.
2. System rejects the request.
3. Returns ERR-ACC-001 – Account Not Available.
4. UI notifies that the account is not available for this operation.

**E8 – ERR-SYS-001: Internal System Error**

1. System encounters an error while processing the request.  
2. Returns ERR-SYS-001 – Internal System Error.  
3. UI displays an error message.  

**E9 – ERR-NET-001: Network Error**

1. UI cannot connect to System or the request timed out.  
2. Identified as ERR-NET-001 – Network Error.  
3. UI allows the User to try again.