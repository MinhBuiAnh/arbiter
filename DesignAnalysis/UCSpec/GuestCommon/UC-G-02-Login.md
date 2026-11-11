# Use Case Specification

**UC-G-02 - Log In**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-G-02
- Use Case Name: Log In
- Brief Description: Allow Guest to validate identity with account information to access features for authenticated user.
- Participating Actors: Guest

# 2. Preconditions

- Guest is not logged in to the system.
- Guest has a valid account.
- System is running and can process verification request.

# 3. Postconditions

- If log in successfully, System creates a login session or provide necessary validation information.
- If log in failed, System does not create a valid login session.
- Guest becomes authenticated user.

# 4. Main Flow

1. Guest accesses the account login page.
2. System displays the login form.
3. Guest enters necessary information, including username or email and password.
4. Guest sends the login form.
5. System checks input's sufficiency and validity.
6. System find the corresponding account in PostgreSQL.
7. System checks the password by comparing with the stored password hash.
8. System checks the account's state and related validation conditions.
9. System provides access token and refresh token.
10. System returns the successful login result.
11. UI stores validation information.
12. System navigates User to another page, such as the home page or the page that User wants to access.

# 5. Alternative Flow

**A1 – Redirect to Previously Requested Page**

1. Before login, Guest accesses a login-required page.
2. System navigates Guest to the login page.
3. After successful login at step 10, System navigates User to the page if that page can still be accessed.
4. Use Case ends.

**A2 – Guest Chooses to Register**

1. At step 2, Guest clicks the account registration link.
2. System navigates to UC-G-01 – Register Account.
3. Use Case ends.

# 6. Exception Flow

**E1 – ERR-VAL-001: Invalid Login Input**

1. At step 5, System detects that login data is invalid, such as username/email or password is missing.
2. System rejects the login request.
3. UI notifies about fields that needs to be provided or edited.
4. Guest edits the data and resend the form.

**E2 – ERR-AUTH-001: Invalid Credentials**

1. At step 6–7, System can't find the account or mismatch password.
2. System rejects the validation request.
3. System does not create a valid token.
4. UI displays a notification that login information is not correct.
5. Guest can re-enter the information or go to the recover password operation if available.

**E3 – ERR-ACC-001: Account Not Allowed to Log In**

1. At step 8, System detects that the account is deactivated, locked or ineligible to use.
2. System rejects the login request.
3. System does not create a valid token.
4. UI displays a notification that the account can't log in.

**E4 – ERR-SYS-001: Internal System Error**

1. At step 6-9, System encounters an error when querying the account, validating the password or creating token.
2. System stops processing the request.
3. System does not create a token in an invalid state.
4. Backend logs the error and request ID.
5. System returns the error notification.
6. UI notifies that the operation can't be completed.
7. Guest can retry later.

**E5 – ERR-NET-001: Network Error**

1. In the process of sending form or receiving response, network connection is interuptted or timeout.
2. UI notifies that can't receive the validation result.
3. Guest can try to reconnect when the network is restored.
4. If UI does not receive the validation result, UI cannot assume that the account logged in successfully.

**E6 – ERR-LIMIT-001: Rate Limit Exceeded**

1. System detects that Guest sent too many requests in a certain duration of time.
2. System rejects the current request.
3. System returns the limit notification and the time for retry if supported.
4. UI notifies that Guest needs to wait before sending the next request.