# Use Case Specification

**UC-AD-U-02 - View User Details**

**Version:** 2.0

# 1. General Information

- Use Case ID: UC-AD-U-02
- Use Case Name: View User Details
- Brief Description: Allow Administrator to view the profile, account status, and activity summary of a specific user account in read-only mode for account-management and monitoring purposes.
- Primary Actor(s): Administrator
- Supporting Actor(s): None
- Trigger: Administrator selects a user from the user list or from another administrator view.
- Priority: High
- Status: Draft
- Related Use Cases: UC-AD-U-01 – View User List, UC-AD-U-03 – Manage User Status, UC-AD-S-01 – View Any Submission
- Related Requirements: FR-006 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- Administrator is logged in with an account that has the `admin` role.
- System is available and can read account data.

# 3. Postconditions

## 3.1. Success

- The selected user's account details are displayed in read-only mode.
- The displayed details reflect the latest committed account data.
- No account data, Submission, or result is changed.

## 3.2. Failure

- No account details are displayed.
- No account data, Submission, or result is changed.

# 4. Main Flow

1. Administrator opens the user management function.
2. Administrator selects the user whose details are to be viewed.
3. UI requests the account details from System.
4. System validates the Access Token and confirms the `admin` role.
5. System retrieves the account by User ID.
6. System confirms that the account exists.
7. System returns the account details, including username, email, account status, registration date, and an activity summary.
8. UI displays the account details in read-only mode.
9. Use Case ends.

# 5. Alternative Flow

**A1 – Administrator Opens Details from Search Results**

1. At step 1, Administrator searches or filters the user list through UC-AD-U-01 – View User List.
2. Administrator selects a user from the matching results.
3. Use Case continues at step 3.

**A2 – Account Changes While Details Are Loading**

1. At step 5, System reads the account while another operation changes it.
2. System returns the latest successfully committed data.
3. UI displays that data without mixing fields from different versions.
4. Use Case continues at step 8.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing, Invalid, or Expired Access Token**

1. At step 4, System cannot find, validate, or accept the Access Token.
2. System rejects the request.
3. No account details are returned and no account data is changed.
4. System logs the rejection with the request ID and without the token value.
5. System returns `ERR-AUTH-003`.
6. UI clears the stored authentication information and navigates Administrator to the login page.
7. Use Case ends.

**E2 – ERR-PERM-002: Insufficient Privileges**

1. At step 4, System determines that the authenticated account does not have the `admin` role.
2. System rejects the request.
3. No account details are returned.
4. System logs the rejection with the request ID and the account identifier.
5. System returns `ERR-PERM-002`.
6. UI notifies that Administrator rights are required to view user details.
7. Use Case ends.

**E3 – ERR-RES-004: User Not Found**

1. At step 5 or step 6, System cannot retrieve an account with the requested User ID.
2. System rejects the request.
3. No account details are returned and no account data is changed.
4. System logs the failure with the request ID and the User ID.
5. System returns `ERR-RES-004`.
6. UI notifies that the user no longer exists and returns Administrator to the user list.
7. Use Case ends.

**E4 – ERR-SYS-001: Internal System Error**

1. At step 5 or step 7, System encounters an error while retrieving or assembling the account details.
2. System stops processing the request.
3. No account details are returned and no account data is changed.
4. System logs the error and the request ID.
5. System returns `ERR-SYS-001` with a general message.
6. UI notifies that the user details could not be loaded.
7. Administrator may retry later.

**E5 – ERR-NET-001: Network Error**

1. During step 3 or the response to it, the connection is interrupted or times out.
2. UI cannot confirm whether the details were retrieved.
3. UI notifies that the user details could not be loaded and does not display stale data as current.
4. Administrator can retry when the network is restored.
5. Use Case ends.

# 7. Assumptions

- The account details view is read-only; status changes are performed through UC-AD-U-03 – Manage User Status.
- The activity summary uses the same rules as UC-U-ST-01 – View Own Statistics.
- Password hashes, access tokens, and other secrets are never part of the account details.

# 8. Special Requirements

- Only accounts with the `admin` role may view another user's details; the backend enforces the role.
- The response must not include password hashes, access tokens, or unnecessary personal data.
- The view must not expose Submission source code; that is handled by UC-AD-S-01 – View Any Submission.
- The endpoint must be rate-limited.

# 9. Open Issues

- The exact fields in the activity summary will be confirmed in the SRS.
- Whether Administrator may view a user's email address in full or masked will be confirmed in the SRS.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 2.0 | 2026-11-13 | Rewritten to `SpecStructure.md` v1.1: added metadata, split postconditions, gave every alternative a branch and rejoin point, assigned the distinct `ERR-RES-004` code for a missing user, and named responsible parties in every step. |
