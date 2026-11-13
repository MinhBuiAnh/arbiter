# Use Case Specification

**UC-G-02 - Log In**

**Version:** 1.1

# 1. General Information

- Use Case ID: UC-G-02
- Use Case Name: Log In
- Brief Description: Allow Guest to authenticate with account credentials and obtain an access token for authenticated features.
- Primary Actor(s): Guest
- Supporting Actor(s): None
- Trigger: Guest opens the login page or is redirected to it while accessing a protected page.
- Priority: High
- Status: Draft
- Related Use Cases: UC-G-01 – Register Account
- Related Requirements: FR-002 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- Guest is not authenticated.
- System is available and can process authentication requests.

# 3. Postconditions

## 3.1. Success

- System issues a signed JWT containing the user identifier and role, valid for 24 hours.
- System returns the current user information.
- UI stores the access token and user information.
- Guest becomes an authenticated User.
- No server-side login session is created.

## 3.2. Failure

- No access token is issued.
- No server-side login session is created.
- Guest remains unauthenticated.
- The password is never logged or returned.

# 4. Main Flow

1. Guest accesses the account login page.
2. UI displays the login form.
3. Guest enters the username or email and password.
4. Guest submits the login form.
5. System validates the input's sufficiency and format.
6. System retrieves the account by username or email.
7. System verifies the password against the stored password hash.
8. System checks the account's status and eligibility.
9. System issues a signed JWT containing the user identifier and role, valid for 24 hours.
10. System returns the access token and current user information.
11. UI stores the access token and user information.
12. UI navigates User to the home page or the page that User intended to access.
13. Use Case ends.

# 5. Alternative Flow

**A1 – Redirect to Previously Requested Page**

1. Before login, Guest accesses a login-required page.
2. UI redirects Guest to the login page.
3. After successful login, at step 12, UI navigates User to the requested page if that page can still be accessed.
4. UI navigates User to the home page otherwise.
5. Use Case ends.

**A2 – Guest Chooses to Register**

1. At step 2, Guest selects the account registration link.
2. UI navigates to UC-G-01 – Register Account.
3. Use Case ends.

# 6. Exception Flow

**E1 – ERR-VAL-003: Invalid Login Input**

1. At step 5, System detects that the login data is invalid, such as a missing username/email, a missing password, or a malformed email.
2. System rejects the login request.
3. No access token is issued.
4. System records the validation failure without logging the password.
5. System returns `ERR-VAL-003` with the invalid fields.
6. UI displays the fields that need to be provided or corrected.
7. Guest edits the data and resubmits the form.
8. Use Case continues at step 5.

**E2 – ERR-AUTH-001: Invalid Credentials**

1. At steps 6–7, System cannot find the account or the password does not match the stored hash.
2. System rejects the authentication request.
3. No access token is issued.
4. System records the authentication failure with the request ID without logging the password.
5. System returns `ERR-AUTH-001` with a generic message.
6. UI displays that the login information is not correct without revealing whether the account exists.
7. Guest can re-enter the information and resubmit the form.
8. Use Case continues at step 5.

**E3 – ERR-ACC-001: Account Not Allowed to Log In**

1. At step 8, System detects that the account is deactivated, locked, or otherwise ineligible.
2. System rejects the login request.
3. No access token is issued.
4. System logs the rejection with the request ID.
5. System returns `ERR-ACC-001` with an account-status message.
6. UI notifies that the account cannot log in.
7. Use Case ends.

**E4 – ERR-SYS-001: Internal System Error**

1. At steps 6–9, System encounters an unexpected error while retrieving the account, verifying the password, or creating the token.
2. System stops processing the request.
3. System does not create a token in an invalid state.
4. System logs the error and request ID without logging the password or token.
5. System returns `ERR-SYS-001` with a general error message.
6. UI notifies that the operation cannot be completed.
7. Guest can retry later.
8. Use Case ends.

**E5 – ERR-NET-001: Network Error**

1. During the request or response, the network connection is interrupted or times out.
2. UI cannot confirm whether the login succeeded.
3. UI notifies that it cannot receive the authentication result.
4. Guest can reconnect when the network is restored.
5. If no result is received, UI must not assume that the account is logged in; it checks the authentication state before retrying.
6. Use Case ends if the outcome remains unknown.

**E6 – ERR-LIMIT-001: Rate Limit Exceeded**

1. System detects that Guest sent too many login requests within a short period.
2. System rejects the current request.
3. System returns `ERR-LIMIT-001` with the retry time if available.
4. UI asks Guest to wait before trying again.
5. Use Case ends.

# 7. Assumptions

- Passwords are hashed with Argon2id.
- The access token is a signed JWT (HS256) with `sub`, `role`, `iat`, and `exp`; its lifetime is 24 hours.
- No refresh token exists in v1.
- Disabled accounts are rejected regardless of token validity.
- Self-service password recovery is not available in v1.
- The login identifier may be a username or an email address.

# 8. Special Requirements

- The token signing secret must never be exposed to the client or written to logs.
- Passwords and access tokens must never be written to logs or error responses.
- Invalid-credential responses must be generic enough not to reveal whether an account exists.
- Login requests must be rate-limited.
- Logout is client-side only; the token remains valid until it expires.
- The UI must store the token in a client-side store that is cleared on logout.

# 9. Open Issues

- None for v1.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 1.1 | 2026-11-13 | Aligned with `SpecStructure.md` v1.1: added metadata, split postconditions, removed the invalid-account precondition, replaced implementation-specific terms, and assigned a distinct validation error code. |
