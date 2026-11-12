# Use Case Specification

**UC-A-02 - View Account Information**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-A-02
- Use Case Name: View Account Information
- Brief Description: Allow User to view registered personal account information in the system, including identifiable information and other displayed profile information.
- Participating Actors: User, Administrator (can also use this feature through User inheritance).

# 2. Preconditions

- User is logged in to the system.
- Access Token is in validity or can be refreshed by Refresh Token.
- User's account exists in the system.

# 3. Postconditions

- Personal account information is displayed to User.
- Account data is unchanged.

# 4. Main Flow

1. User accesses the personal account information page.
2. UI sends account information request with Refresh Token.
3. System validates Access Token.
4. System determines User from token.
5. System queries the account information in the database.
6. System discards any sensitive or internal information that can't be returned.
7. System returns account information, such as:
    - User ID.
    - Username.
    - Email.
    - Display Name (if any).
    - Avatar (if any).
    - Account creation date.
    - Other supported profile information.
8. UI displays account information to User.

# 5. Alternative Flow

**A1 – Refresh Access Token**

1. At step 3, System detects that Access Token is expired.
2. UI uses Refresh Token to request a new Access Token.
3. System validates Refresh Token.
4. If valid, System sends a new Access Token.
5. UI resends the account information request using the new Access Token.
6. Use Case continues from step 3 of the Main Flow.

**A2 – Reload Account Information**

1. At step 8, User requests a account information reload.
2. UI resends the account information request.
3. System queries the latest data.
4. UI updates the displayed data.
5. Use Case ends.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing or Invalid Access Token**

1. At step 3, System detects that Access Token does not exist, is invalid or can't be validated.
2. System rejects the account information request.
3. System returns validation error.
4. UI checks the Access Token refresh by Refresh Token capability.
5. If token can't be refreshed, UI prompts User to re-login.
6. Use Case ends.

**E2 – ERR-AUTH-002: Invalid or Expired Refresh Token**

1. In A1, System detects that Refresh Token is invalid, expired or revoked.
2. System rejects issuing a new Access Token.
3. UI deletes the now no longer validation data.
4. UI navigates User to the login page.
5. Use Case ends.

**E3 – ERR-ACC-001: Account Not Available**

1. At step 4–5, System can't determine the logging account or detects that the account is no longer allowed to use.
2. System rejects querying account information.
3. If the account is locked or deactivated, System revokes related login session.
4. UI displays appropriate message and asks User to contact Administrator.
5. Use Case ends.

**E4 – ERR-SYS-001: Internal System Error**

1. At step 4-7, System encounters an error when determining User or querying the information.
2. System stops processing the request.
3. Backend logs the error and request ID.
4. System returns the error notification.
5. UI notifies that the operation can't be done.
6. User can retry later.

**E5 – ERR-NET-001: Network Error**

1. In the process of sending form or receiving response, network connection is interuptted or timeout.
2. UI notifies that can't load account information.
3. User can retry later when the network is restored.