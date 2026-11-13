# Use Case Specification

**UC-AD-U-01 - View User List**

**Version:** 2.0

# 1. General Information

- Use Case ID: UC-AD-U-01
- Use Case Name: View User List
- Brief Description: Allow Administrator to view, search, filter, and page through the list of registered user accounts for account-management and monitoring purposes.
- Primary Actor(s): Administrator
- Supporting Actor(s): None
- Trigger: Administrator opens the user management function.
- Priority: High
- Status: Draft
- Related Use Cases: UC-AD-U-02 – View User Details, UC-AD-U-03 – Manage User Status
- Related Requirements: FR-006 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- Administrator is logged in with an account that has the `admin` role.
- System is available and can read account data.

# 3. Postconditions

## 3.1. Success

- The requested page of user accounts is displayed with the matching search and filter criteria.
- Each row shows only the summary information needed for account management.
- No account data is changed.

## 3.2. Failure

- No user list is displayed.
- No account data is changed.
- The previous list and filter state, if any, remain unchanged in the UI.

# 4. Main Flow

1. Administrator opens the user management function.
2. UI requests the user list with optional search, filter, and pagination parameters.
3. System validates the Access Token and confirms the `admin` role.
4. System validates the search, filter, and pagination parameters.
5. System queries the user accounts that match the criteria.
6. System applies the requested pagination.
7. System returns the page of users with summary information, such as User ID, username, email, account status, and registration date.
8. UI displays the user list.
9. Use Case ends.

# 5. Alternative Flow

**A1 – Administrator Searches for Users**

1. At step 2, Administrator enters a search keyword, such as a username or email address.
2. UI sends the search parameter with the list request.
3. System filters the accounts by the keyword.
4. Use Case continues at step 4.

**A2 – Administrator Filters by Account Status**

1. At step 2, Administrator selects an account status.
2. UI sends the status filter with the list request.
3. System returns only accounts with the selected status.
4. Use Case continues at step 4.

**A3 – Administrator Changes the Page or Page Size**

1. At step 8, Administrator selects another page or changes the page size.
2. UI sends the new pagination parameters.
3. System queries the corresponding page.
4. Use Case continues at step 4.

**A4 – No Users Match the Criteria**

1. At step 5, System finds no account that matches the search and filter criteria.
2. System returns an empty page with a total count of zero.
3. UI displays a no-results message and keeps the active criteria visible.
4. No account data is changed.
5. Use Case ends.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing, Invalid, or Expired Access Token**

1. At step 3, System cannot find, validate, or accept the Access Token.
2. System rejects the request.
3. No account data is read or changed, and no user list is returned.
4. System logs the rejection with the request ID and without the token value.
5. System returns `ERR-AUTH-003`.
6. UI clears the stored authentication information and navigates Administrator to the login page.
7. Use Case ends.

**E2 – ERR-PERM-002: Insufficient Privileges**

1. At step 3, System determines that the authenticated account does not have the `admin` role.
2. System rejects the request.
3. No user list is returned.
4. System logs the rejection with the request ID and the account identifier.
5. System returns `ERR-PERM-002`.
6. UI notifies that Administrator rights are required to view the user list.
7. Use Case ends.

**E3 – ERR-VAL-004: Invalid Search or Filter Parameters**

1. At step 4, System detects an unsupported or malformed search or filter value, such as an unknown account status.
2. System rejects the request.
3. No user list is returned and no account data is changed.
4. System logs the validation failure with the request ID and the invalid parameter names.
5. System returns `ERR-VAL-004` with the invalid parameters.
6. UI displays the invalid criteria and asks Administrator to correct them.
7. Administrator corrects the criteria and resubmits; Use Case continues at step 2.

**E4 – ERR-VAL-005: Invalid Pagination Parameters**

1. At step 4, System detects an invalid pagination value, such as a negative page number or a page size above the maximum.
2. System rejects the request.
3. No user list is returned and no account data is changed.
4. System logs the validation failure with the request ID and the invalid parameters.
5. System returns `ERR-VAL-005`.
6. UI resets the pagination to its default value or asks Administrator to correct it.
7. Administrator corrects the pagination and resubmits; Use Case continues at step 2.

**E5 – ERR-LIMIT-001: Rate Limit Exceeded**

1. At step 3 or step 5, System detects that Administrator sent too many user-list requests within the configured period.
2. System rejects the current request.
3. No user list is returned and no account data is changed.
4. System returns `ERR-LIMIT-001` with the retry time if available.
5. UI asks Administrator to wait before trying again.
6. Use Case ends.

**E6 – ERR-SYS-001: Internal System Error**

1. At step 5 or step 7, System encounters an error while querying or assembling the user list.
2. System stops processing the request.
3. No user list is returned and no account data is changed.
4. System logs the error and the request ID.
5. System returns `ERR-SYS-001` with a general message.
6. UI notifies that the user list could not be loaded.
7. Administrator may retry later.

**E7 – ERR-NET-001: Network Error**

1. During step 2 or the response to it, the connection is interrupted or times out.
2. UI cannot confirm whether the request reached System.
3. UI notifies that the user list could not be loaded and does not display stale data as current.
4. Administrator can retry when the network is restored.
5. Use Case ends.

# 7. Assumptions

- The user list is read-only in this use case; status changes are performed through UC-AD-U-03 – Manage User Status.
- Summary information excludes password hashes, tokens, and other secrets.
- The default page size and maximum page size are defined in the SRS.

# 8. Special Requirements

- Only accounts with the `admin` role may view the user list; the backend enforces the role.
- The response must not include password hashes, access tokens, or unnecessary personal data.
- Search and filter parameters must be validated to prevent injection and excessive queries.
- The endpoint must be rate-limited.

# 9. Open Issues

- The exact searchable fields, supported filters, default page size, and maximum page size will be confirmed in the SRS.
- Whether the list should expose email addresses by default or behind a detail view will be confirmed in the SRS.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 2.0 | 2026-11-13 | Rewritten to `SpecStructure.md` v1.1: added metadata, split success and failure postconditions, gave every alternative a branch and rejoin point, split search and pagination validation into `ERR-VAL-004` and `ERR-VAL-005`, and named responsible parties in every step. |
