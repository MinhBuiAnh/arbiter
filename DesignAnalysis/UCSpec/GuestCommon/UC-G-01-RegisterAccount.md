# Use Case Specification

**UC-G-01 - Register Account**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-G-01
- Use Case Name: Register Account
- Brief Description: Allow Guest to create a new account to use login-required features of Arbiter.
- Participating Actors: Guest

# 2. Preconditions

- Guest is not logged in to the system.
- System is running and can process register request.
- Guest can access the account registration page.

# 3. Postconditions

- A new account is created successfully and recorded in PostgreSQL.
- The account has the initial state according to System's registration policy.
- Guest can login with the created account if the account is eligible to use.

# 4. Main Flow

1. Guest accesses the account registration page.
2. System displays the registration form.
3. Guest enters necessary information, such as:
   - Username.
   - Email.
   - Password.
   - Confirm Password.
4. Guest sends the registration form.
5. System checks input's sufficiency and validity.
6. System checks whether username and email are already used or not.
7. System encrypts the password by secure password hashing algorithm.
8. System creates a new account in PostgreSQL.
9. System confirms successful registration.
10. UI displays that Guest has successfully created a new account.
11. Guest can navigate to the login page to peform UC-G-02 – Log In.

# 5. Alternative Flow

**A1 – Guest Returns to Login Page**

1. In the register page, Guest goes to the login page.
2. System navigates to the login page.
3. Use Case ends without creating a new account.

# 6. Exception Flow

**E1 – ERR-VAL-001: Invalid Registration Data**

1. At step 5, System detects that registration data is invalid, such as:
   - Missing required fields.
   - Email in the wrong format.
   - Username does not satisfy naming convention.
   - Password does not satisfy password policy.
   - Confirmed Password and Password do not match.
2. System rejects the registration request.
3. System returns the invalid fields.
4. UI displays the corresponding errors next to the input fields.
5. Guest edits the data and resends the form.

**E2 – ERR-ACC-002: Account Identifier Already Exists**

1. At step 6, System detects that username or email is already used.
2. System rejects creating a new account.
3. System return a response that doesn't create a duplicate account record.
4. UI notifies that Guest chooses a different username or email.
5. Guest edits the data and resends the form.

**E3 – ERR-SYS-001: Internal System Error**

1. At step 7-8, System encounters an error when processing the password or recording the account.
2. System stops processing the request.
3. If the transaction is open, System performs a rollback to avoid creating the account in an inconsistent state.
4. Backend logs the error and request ID, **DO NOT** log the plain password.
5. System returns the error notification.
6. UI notifies that the operation can't be completed.
7. Guest can retry later.

**E4 – ERR-NET-001: Network Error**

1. In the process of sending form or receiving response, network connection is interuptted or timeout.
2. UI notifies that can't receive the result.
3. Guest can try to reconnect when the network is restored.
4. Before sending, UI can check the registration state to avoid creating duplicated opeartions.

**E5 – ERR-LIMIT-001: Rate Limit Exceeded**

1. System detects that Guest sent too many requests in a certain duration of time.
2. System rejects the current request.
3. System returns the limit notification and the time for retry if supported.
4. UI notifies that Guest needs to wait before sending the next request.