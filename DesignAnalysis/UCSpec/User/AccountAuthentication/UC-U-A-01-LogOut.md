# Use Case Specification

**UC-U-A-01 - Log Out**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-U-A-01
- Use Case Name: Log Out
- Brief Description: Allow User to end the current session. System revokes corresponding Refresh Token and frontend deletes stored validation data.
- Participating Actors: User, Administrator (can also use this feature through inheritance from User).

# 2. Preconditions

- User is logged in to the system.
- User has valid validation data to perform logout request.
- System is running and can process logout request.

# 3. Postconditions

- Refresh Token of the current session is revoked.
- Frontend deletes stored validation data of the current session.
- User cannot use revoked Refresh Token to request for a new Access Token.
- Current Access Token can still be activated until expiration if System doesn't implement Access Token revocation mechanism.

# 4. Main Flow

1. User selects Log Out feature on the UI.
2. UI sends logout request with Refresh Token.
3. System validates the request and find the corresponding User login session.
4. System validates Refresh Token or login session information.
5. System revokes the Refresh Token, such as update the token status to `revoked` or delete the token record.
6. System confirms successful logout.
7. UI deletes Access Token, Refresh Token and related validation information of the current session.
8. UI nagivates User to the home page or the login page.

# 5. Alternative Flow

**A1 – User Logs Out from One Session Only**

1. User is logging in on many devices or browsers.
2. User logs out on one device.
3. System only revokes Refresh Token on the current login session.
4. Other User's login sessions are still maintained.
5. Use Case ends.

**A2 – User Logs Out After Access Token Expiration**

1. User selects Log Out when Access Token is expired.
2. UI sends the logout request with Refresh Token of validity.
3. System determines login sessions with Refresh Token and revokes that token.
4. UI deletes validation data.
5. Use Case ends.

# 6. Exception Flow

**E1 – ERR-AUTH-002: Invalid or Expired Refresh Token**

1. At step 4, System detects that Refresh Token is invalid, expired or revoked.
2. System rejects using that token to determine or revoke login session.
3. System returns validation error.
4. UI deletes validation data and navigates User to the login page.
5. Use Case ends.

**E2 – ERR-SYS-001: Internal System Error**

1. At step 3-4, System encounters an error when determining session or revoking Refresh Token.
2. System stops processing the request.
3. Backend logs the error and request ID.
4. System returns the error notification.
5. UI notifies that the operation can't be done.
6. User can retry later.

**E3 – ERR-NET-001: Network Error**

1. In the process of sending form or receiving response, network connection is interuptted or timeout.
2. UI can't receive confirmation result from System.
3. UI notifies that logout can't be done.
4. User can retry later or logout locally.
5. If logout locally, UI deletes validation data and prompted to login when accessing login-required features.