# Use Case Specification

**UC-U-A-02 - View Account Information**

**Version:** 1.1

# 1. General Information

- Use Case ID: UC-U-A-02
- Use Case Name: View Account Information
- Brief Description: Allow User to view their registered personal account information, including identifiable information and supported profile fields.
- Primary Actor(s): User, Administrator (through inheritance from User)
- Supporting Actor(s): None
- Trigger: User opens the personal account information page.
- Priority: High
- Status: Draft
- Related Use Cases: UC-U-A-03 – Update Account Information
- Related Requirements: FR-003 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- User is authenticated.
- User can access the account information page.

# 3. Postconditions

## 3.1. Success

- Personal account information is displayed to User.
- Account data is unchanged.

## 3.2. Failure

- No partial or incorrect account information is displayed as if it were complete.
- Account data is unchanged.
- User receives an error notification or is redirected to the login page.

# 4. Main Flow

1. User accesses the personal account information page.
2. UI sends an account information request with the access token.
3. System validates the access token.
4. System determines User from the token.
5. System queries the account information from the database.
6. System discards any sensitive or internal information that must not be returned.
7. System returns the account information, such as:
   - User ID.
   - Username.
   - Email.
   - Display name, if any.
   - Bio, if any.
   - Account creation date.
   - Other supported profile information.
8. UI displays the account information to User.
9. Use Case ends.

# 5. Alternative Flow

**A1 – Reload Account Information**

1. At step 8, User requests an account information reload.
2. UI resends the account information request.
3. System validates the token again, determines User, and queries the latest data.
4. UI updates the displayed data.
5. Use Case continues at step 8.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing, Invalid, or Expired Access Token**

1. At step 3, System cannot find, validate, or accept the access token.
2. System rejects the request.
3. No account information is returned.
4. System logs the rejection with the request ID without logging the token.
5. System returns `ERR-AUTH-003`.
6. UI clears the stored authentication information.
7. UI navigates User to the login page.
8. Use Case ends.

**E2 – ERR-ACC-001: Account Not Available**

1. At steps 4–5, System cannot determine the authenticated account or detects that the account is no longer allowed to use the system.
2. System rejects the query.
3. No account information is returned.
4. If the account is disabled, System rejects further requests made with its access token.
5. System logs the rejection with the request ID.
6. System returns `ERR-ACC-001`.
7. UI displays an appropriate message and asks User to contact an Administrator.
8. Use Case ends.

**E3 – ERR-SYS-001: Internal System Error**

1. At steps 3–7, System encounters an unexpected error while determining User or querying the account information.
2. System stops processing the request.
3. System does not return partial account information as complete.
4. System logs the error with the request ID.
5. System returns `ERR-SYS-001` with a general error message.
6. UI notifies that the operation cannot be completed.
7. User can retry later.
8. Use Case ends.

**E4 – ERR-NET-001: Network Error**

1. During the request or response, the network connection is interrupted or times out.
2. UI cannot confirm whether the request reached System.
3. UI notifies that the account information cannot be loaded.
4. User can retry later when the network is restored.
5. Use Case ends if continuing is impossible.

# 7. Assumptions

- A User can view only their own account information.
- An Administrator inherits the User behavior and can view account information through administrative use cases.
- Email and profile fields are visible to the account owner.
- Passwords, password hashes, and internal security fields are never returned.

# 8. Special Requirements

- The response must never include the password hash, access token, or internal security fields.
- The endpoint must authorize access to the authenticated User's own account.
- The operation is read-only and must not modify account data.
- The access token must never be written to logs.

# 9. Open Issues

- None for v1.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 1.1 | 2026-11-13 | Aligned with `SpecStructure.md` v1.1: added metadata, split postconditions, moved token and account checks out of preconditions, and completed exception-flow outcomes. |
