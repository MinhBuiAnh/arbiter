# Use Case Specification

**UC-U-A-04 - Change Password**

**Version:** 1.1

# 1. General Information

- Use Case ID: UC-U-A-04
- Use Case Name: Change Password
- Brief Description: Allow User to change the password of their own account by providing the current password and a new password. A successful change invalidates every previously issued access token.
- Primary Actor(s): User
- Supporting Actor(s): None
- Trigger: User selects the Change Password function in account settings.
- Priority: Medium
- Status: Draft
- Related Use Cases: UC-G-02 – Log In, UC-U-A-02 – View Account Information
- Related Requirements: FR-004 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- User is authenticated.
- User knows the current password.

# 3. Postconditions

## 3.1. Success

- The password hash stored in the database is replaced with an Argon2id hash of the new password.
- The account's `password_changed_at` timestamp is updated in the same transaction.
- Every access token issued before the change is rejected on its next use.
- The browser's stored authentication information is cleared and User must log in again.
- The old password no longer authenticates the account.
- No plaintext password is stored or logged.

## 3.2. Failure

- The previous password hash and `password_changed_at` value remain unchanged.
- No partial password update is persisted.
- The submitted password values are not retained by System.

# 4. Main Flow

1. User opens the Change Password function from the account settings.
2. UI displays the Current Password, New Password, and Confirm New Password fields.
3. User enters the three values and submits the form.
4. System validates the access token and identifies the account.
5. System verifies the Current Password against the stored password hash.
6. System validates the New Password:
   - It satisfies the password policy.
   - It differs from the Current Password.
   - It matches the Confirm New Password value.
7. System hashes the New Password with Argon2id.
8. System updates the password hash and `password_changed_at` within a single transaction.
9. System returns the successful result.
10. UI clears the stored access token and cached account information.
11. UI navigates User to the login page.
12. User logs in with the new password through UC-G-02 – Log In.
13. Use Case ends.

# 5. Alternative Flow

**A1 – User Cancels the Change**

1. At step 3, User leaves the form without submitting.
2. UI discards the entered values.
3. No change is made to the account.
4. Use Case ends.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing, Invalid, or Expired Access Token**

1. At step 4, System cannot find, validate, or accept the access token.
2. System rejects the request.
3. No password data is changed.
4. System logs the error with the request ID and without any token or password value.
5. System returns `ERR-AUTH-003`.
6. UI clears the stored authentication information and navigates User to the login page.
7. Use Case ends.

**E2 – ERR-AUTH-004: Incorrect Current Password**

1. At step 5, System determines that the Current Password does not match the stored hash.
2. System rejects the request.
3. No password data is changed.
4. System logs the failed attempt without logging either password.
5. System returns `ERR-AUTH-004`.
6. UI displays an error next to the Current Password field.
7. User may retry within the configured attempt limit; Use Case continues at step 3. Otherwise, Use Case ends.

**E3 – ERR-VAL-011: Invalid New Password**

1. At step 6, System detects that the New Password is invalid, such as:
   - It does not satisfy the password policy.
   - It does not match the Confirm New Password value.
   - It is missing.
2. System rejects the request.
3. No password data is changed.
4. System logs the validation failure without logging the password.
5. System returns `ERR-VAL-011` with the invalid fields and their causes.
6. UI displays the corresponding errors.
7. User edits the values and resubmits the form.
8. Use Case continues at step 4.

**E4 – ERR-VAL-010: New Password Matches Current Password**

1. At step 6, System detects that the New Password is identical to the Current Password.
2. System rejects the request.
3. No password data is changed.
4. System returns `ERR-VAL-010`.
5. UI asks User to choose a different password.
6. User edits the value and resubmits the form.
7. Use Case continues at step 4.

**E5 – ERR-ACC-001: Account Not Available**

1. At steps 4–5, System detects that the account does not exist or is no longer `ACTIVE`.
2. System rejects the request.
3. No password data is changed.
4. System logs the error with the request ID.
5. System returns `ERR-ACC-001`.
6. UI notifies User that the operation cannot be completed and asks them to contact an Administrator.
7. Use Case ends.

**E6 – ERR-SYS-001: Internal System Error**

1. At steps 5–8, System encounters an unexpected error while verifying the password or updating the account.
2. System stops processing the request.
3. If a transaction is open, System rolls it back so that neither the hash nor `password_changed_at` is partially updated.
4. System logs the error and request ID without logging any password value.
5. System returns `ERR-SYS-001` with a general message.
6. UI notifies that the password could not be changed.
7. User can retry later.
8. Use Case ends.

**E7 – ERR-NET-001: Network Error**

1. During the request or response, the network connection is interrupted or times out.
2. UI notifies that it cannot confirm whether the password was changed.
3. User can attempt to log in with the new password. If that succeeds, the change succeeded.
4. If the new password does not work, User can retry the change with the old password or contact an Administrator.
5. Use Case ends if the outcome remains unknown.

**E8 – ERR-LIMIT-001: Rate Limit Exceeded**

1. System detects that User sent too many Change Password requests within the configured period.
2. System rejects the current request.
3. System returns `ERR-LIMIT-001` with the retry time if available.
4. UI asks User to wait before trying again.
5. Use Case ends.

# 7. Assumptions

- The password policy requires at least 8 characters and at most 128 characters, including at least one letter and one digit. The SRS will finalize the exact policy.
- Self-service password recovery and Administrator-initiated resets are out of scope for v1.
- Users are expected to keep their email address current, but email verification is not required in v1.

# 8. Special Requirements

- Passwords are hashed with Argon2id and never stored or logged in plaintext.
- The password hash and `password_changed_at` update is atomic.
- All previously issued tokens must stop working immediately after a successful change.
- The endpoint must be rate-limited to reduce credential-stuffing risk.

# 9. Open Issues

- Final password policy values will be confirmed in the SRS.
- The number of allowed failed current-password attempts before throttling will be confirmed in the SRS.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 1.1 | 2026-11-13 | Aligned with `SpecStructure.md` v1.1: added explicit end states, moved token and password-policy checks out of preconditions, replaced the implementation-specific storage term, and assigned distinct validation codes. |
