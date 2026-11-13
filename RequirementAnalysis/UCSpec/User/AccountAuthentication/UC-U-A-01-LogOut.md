# Use Case Specification

**UC-U-A-01 - Log Out**

**Version:** 1.1

# 1. General Information

- Use Case ID: UC-U-A-01
- Use Case Name: Log Out
- Brief Description: Allow User to end the current client session by discarding the access token stored in the browser. Arbiter uses stateless JWT authentication, so logout performs no backend request and terminates no server-side session.
- Primary Actor(s): User, Administrator (through inheritance from User)
- Supporting Actor(s): None
- Trigger: User selects the Log Out function.
- Priority: High
- Status: Draft
- Related Use Cases: UC-G-02 – Log In
- Related Requirements: FR-002 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- User is authenticated in the current browser.

# 3. Postconditions

## 3.1. Success

- The access token and cached account information are removed from browser storage.
- The UI treats User as a Guest.
- Any later request that requires authentication prompts User to log in again.
- The discarded token remains technically valid until its expiry if it was copied elsewhere. Stateless JWTs cannot be revoked by logout.
- Changing the password invalidates all previously issued tokens through the `password_changed_at` check, and disabling the account is enforced on every request.

## 3.2. Failure

- The UI resets the in-memory authentication state even if browser storage cannot be cleared.
- User is notified to close the browser or clear site data manually.
- The token may remain in browser storage and remain valid until its expiry.

# 4. Main Flow

1. User selects the Log Out function.
2. UI displays a confirmation prompt.
3. User confirms the logout.
4. UI removes the access token and cached account information from browser storage.
5. UI resets the in-memory authentication state.
6. UI navigates User to the home page.
7. UI displays the Guest navigation state.
8. Use Case ends.

# 5. Alternative Flow

**A1 – User Cancels Logout**

1. At step 2, User dismisses the confirmation prompt.
2. UI keeps the current authentication state.
3. Use Case ends without any change.

**A2 – Token Is Already Expired**

1. At step 1, User selects Log Out while the stored access token has already expired.
2. UI clears the stored authentication information without contacting the backend.
3. UI navigates User to the home page.
4. Use Case ends successfully. Logout is idempotent.

**A3 – User Is Logged In on Multiple Browsers**

1. User is logged in on more than one browser or device.
2. User logs out in one browser.
3. Only that browser's stored token is removed.
4. Other browsers remain logged in until their tokens expire or the password is changed.
5. Use Case ends.

# 6. Exception Flow

**E1 – ERR-SYS-007: Browser Storage Unavailable**

1. At step 4, UI cannot clear the browser storage.
2. UI still resets the in-memory authentication state.
3. UI notifies User to close the browser or clear site data manually.
4. UI navigates User to the login page.
5. Use Case ends.

**E2 – ERR-NET-001: Network Error**

1. At step 6, the home page cannot be loaded because the network is unavailable.
2. Logout is still effective because the token has already been removed.
3. UI displays the network error notification.
4. User can retry loading the home page when the network is restored.
5. Use Case ends.

# 7. Assumptions

- Authentication is stateless JWT with no refresh token.
- Logout is intentionally a client-side operation in v1.
- Logout does not require the backend to be reachable.
- Server-side token revocation, refresh tokens, and "log out from all devices" are deferred.
- Multiple browsers or devices hold independent token copies.

# 8. Special Requirements

- Logout must not send the access token to the backend.
- The UI must clear both the access token and cached account information.
- The access token must never be written to logs.
- The UI must not treat logout as failed merely because the home page cannot be loaded afterward.

# 9. Open Issues

- None for v1.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 1.1 | 2026-11-13 | Aligned with `SpecStructure.md` v1.1: added metadata, split postconditions, moved implementation assumptions out of preconditions, and assigned a distinct browser-storage error code. |
