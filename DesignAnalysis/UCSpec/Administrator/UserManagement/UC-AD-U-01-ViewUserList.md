# Use Case Specification

**UC-AD-U-01 - View User List**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-AD-U-01
- Use Case Name: View User List
- Brief Description: Allows Administrator to view the list of registered user accounts on the system, search and filter users according to appropriate criteria.
- Participating Actors: Administrator.

# 2. Preconditions

- Administrator has successfully logged in.
- The Access Token is valid.
- The Administrator account is in an authorized state.

# 3. Postconditions

- The list of users is displayed if the query is successful.
- No account data has been changed.

# 4. Main Flow

1. Administrator accesses the user management function.
2. System authenticates the Access Token and checks Administrator privileges.
3. System queries the list of user accounts from PostgreSQL.
4. System applies pagination and search/filter conditions if applicable.
5. System returns the list of users along with summary information.
6. Administrator views the list of users.

# 5. Alternative Flow

**A1 – Search for users**

1. In step 4, the Administrator enters a search keyword, such as Username or Email.
2. The system filters the list by keyword.

**A2 – Filter by status**

1. Administrator selects the account status to view.
2. System only returns matching accounts.

**A3 – Change page**

1. Administrator requests the next page or changes the page size.
2. System queries and returns the corresponding results.

**A4 – No results**

1. If no matching user is found, the system returns an empty list.
2. UI displays a "no results" message.

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

**E4 – ERR-VAL-001: Invalid Search Parameters**

1. Search, filter, or pagination parameter is invalid.
2. Returns ERR-VAL-001 – Invalid Input.
3. UI displays a message at the corresponding data field.
4. Administrator edits and resubmits.

**E5 – ERR-LIMIT-001: Rate Limit Exceeded**

1. User sent too many requests for viewing the user list.
2. Returns ERR-LIMIT-001 – Rate Limit Exceeded.
3. UI limits sending new requests during the restricted time.

**E6 – ERR-SYS-001: Internal System Error**

1. System encounters an error while processing the request.  
2. Returns ERR-SYS-001 – Internal System Error.  
3. UI displays an error message.  

**E7 – ERR-NET-001: Network Error**

1. UI cannot connect to System or the request timed out.  
2. Identified as ERR-NET-001 – Network Error.  
3. UI allows the User to try again.