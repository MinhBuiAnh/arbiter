# Use Case Specification

**UC-AD-U-02 - View User Details**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-AD-U-02
- Use Case Name: View User Details
- Brief Description: Allow Administrator to view the details of a specific user account for account management and monitoring purposes.
- Participating Actors: Administrator.

# 2. Preconditions

- Administrator has successfully logged in.
- The Access Token is valid.
- The Administrator account is in an authorized state.

# 3. Postconditions

- Account information is displayed if the query is successful.
- No account data has been changed.

# 4. Main Flow

1. Administrator accesses the user list.
2. Administrator selects a user whose information needs to be viewed.
3. System authenticates the Access Token and checks Administrator privileges.
4. System queries account information by User ID.
5. System checks the existence of the account.
6. System returns the user's details.
7. Administrator views account information.

# 5. Alternative Flow

**A1 – Access from search results**

1. Administrator selects the user directly from the search results list or filters.
2. The Use Case continues from step 3 of the Main Flow.

**A2 – Account recently updated**

1. At step 4, if account information changes before the query is complete.
2. System returns the latest data that has been successfully saved.

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

**E5 – ERR-SYS-001: Internal System Error**

1. System encounters an error while processing the request.  
2. Returns ERR-SYS-001 – Internal System Error.  
3. UI displays an error message.  

**E6 – ERR-NET-001: Network Error**

1. UI cannot connect to System or the request timed out.  
2. Identified as ERR-NET-001 – Network Error.  
3. UI allows the User to try again.