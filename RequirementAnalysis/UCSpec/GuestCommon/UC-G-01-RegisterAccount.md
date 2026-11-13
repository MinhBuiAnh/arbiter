# Use Case Specification

**UC-G-01 - Register Account**

**Version:** 1.1

# 1. General Information

- Use Case ID: UC-G-01
- Use Case Name: Register Account
- Brief Description: Allow Guest to create a new account so that the Guest can use authenticated features of Arbiter.
- Primary Actor(s): Guest
- Supporting Actor(s): None
- Trigger: Guest opens the account registration page.
- Priority: High
- Status: Draft
- Related Use Cases: UC-G-02 – Log In
- Related Requirements: FR-001 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- Guest is not authenticated.
- System is available and can process registration requests.
- Guest can access the registration page.

# 3. Postconditions

## 3.1. Success

- A new account is created and persisted in the database.
- The password is stored only as an Argon2id hash.
- The account has the default active state defined by the registration policy.
- Guest can authenticate with the new account if the account remains eligible.

## 3.2. Failure

- No account record is created.
- No partial account record or plaintext password is stored.
- Existing accounts and other platform data are unchanged.

# 4. Main Flow

1. Guest accesses the account registration page.
2. UI displays the registration form.
3. Guest enters the required information:
   - Username.
   - Email.
   - Password.
   - Confirm password.
4. Guest submits the registration form.
5. System validates the input's sufficiency and format.
6. System checks whether the username and email are already in use.
7. System hashes the password with Argon2id.
8. System creates the new account in the database.
9. System confirms successful registration.
10. UI displays that Guest has successfully created an account.
11. Guest can navigate to UC-G-02 – Log In.
12. Use Case ends.

# 5. Alternative Flow

**A1 – Guest Returns to Login Page**

1. At step 2, Guest selects the login link instead of registering.
2. UI navigates to the login page.
3. Use Case ends without creating an account.

# 6. Exception Flow

**E1 – ERR-VAL-001: Invalid Registration Data**

1. At step 5, System detects that the registration data is invalid, such as:
   - Missing required fields.
   - Email in the wrong format.
   - Username does not satisfy the naming convention.
   - Password does not satisfy the password policy.
   - Confirmed password and password do not match.
2. System rejects the registration request.
3. No account record is created.
4. System records the validation failure without logging the password.
5. System returns `ERR-VAL-001` with the invalid fields.
6. UI displays the corresponding errors next to the input fields.
7. Guest edits the data and resubmits the form.
8. Use Case continues at step 5.

**E2 – ERR-ACC-002: Account Identifier Already Exists**

1. At step 6, System detects that the username or email is already used.
2. System rejects the registration request.
3. No duplicate account record is created.
4. System records the conflict without logging the password.
5. System returns `ERR-ACC-002` with the conflicting identifier.
6. UI asks Guest to choose a different username or email.
7. Guest edits the data and resubmits the form.
8. Use Case continues at step 5.

**E3 – ERR-SYS-001: Internal System Error**

1. At steps 7–8, System encounters an unexpected error while hashing the password or recording the account.
2. System stops processing the request.
3. If a transaction is open, System rolls it back so that no partial account is created.
4. System logs the error and request ID. The plaintext password is never logged.
5. System returns `ERR-SYS-001` with a general error message.
6. UI notifies that the operation cannot be completed.
7. Guest can retry later.
8. Use Case ends.

**E4 – ERR-NET-001: Network Error**

1. During the request or response, the network connection is interrupted or times out.
2. UI cannot confirm whether the registration succeeded.
3. UI notifies that it cannot receive the result.
4. Guest can reconnect when the network is restored.
5. Before retrying, UI checks the registration state or uses an idempotency key to avoid creating a duplicate account.
6. Use Case ends if the outcome remains unknown.

**E5 – ERR-LIMIT-001: Rate Limit Exceeded**

1. System detects that Guest sent too many registration requests within a short period.
2. System rejects the current request.
3. System returns `ERR-LIMIT-001` with the retry time if available.
4. UI asks Guest to wait before sending the next request.
5. Use Case ends.

# 7. Assumptions

- Registration is open; no invitation is required in v1.
- Username and email are unique account identifiers.
- No email verification is required in v1.
- The account is created in the default active state.
- The username and password policies are defined by the system.

# 8. Special Requirements

- Passwords must be hashed with Argon2id.
- Plaintext passwords must never be written to logs, error responses, or monitoring systems.
- Registration retries should be idempotent or preceded by a state check to avoid duplicate accounts.
- Registration discloses whether a username or email is already in use; this is an accepted v1 usability trade-off.
- Registration requests must be rate-limited.

# 9. Open Issues

- None for v1.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 1.1 | 2026-11-13 | Aligned with `SpecStructure.md` v1.1: added metadata, split postconditions, replaced implementation-specific terms, clarified branch and retry behavior, and completed exception handling. |
