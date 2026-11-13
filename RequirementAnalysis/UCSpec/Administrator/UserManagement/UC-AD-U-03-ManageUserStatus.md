# Use Case Specification

**UC-AD-U-03 - Manage User Status**

**Version:** 2.0

# 1. General Information

- Use Case ID: UC-AD-U-03
- Use Case Name: Manage User Status
- Brief Description: Allow Administrator to lock or unlock a user account so that an account in the wrong state can be prevented from acting or restored to normal use, without deleting the account or its Submission history.
- Primary Actor(s): Administrator
- Supporting Actor(s): None
- Trigger: Administrator selects Lock Account or Unlock Account for an existing user.
- Priority: Medium
- Status: Draft
- Related Use Cases: UC-AD-U-01 – View User List, UC-AD-U-02 – View User Details
- Related Requirements: FR-006 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- Administrator is logged in with an account that has the `admin` role.
- System is available and can persist account changes.

# 3. Postconditions

## 3.1. Success

- The target account has status `LOCKED` or `ACTIVE`, as selected.
- The account's status-change timestamp is recorded.
- The acting Administrator's identifier is recorded with the change.
- The target account's Submissions, results, and statistics are preserved.
- A locked account is rejected on its next authenticated request, regardless of the validity of an already-issued Access Token.
- Administrator receives confirmation of the successful change.

## 3.2. Failure

- The target account's status is unchanged.
- The status-change timestamp and acting Administrator record are unchanged.
- The target account's Submissions, results, and statistics are unchanged.

# 4. Main Flow

1. Administrator opens the user management function.
2. Administrator selects the user whose status is to be changed.
3. UI requests the account details from System.
4. System validates the Access Token and confirms the `admin` role.
5. System retrieves the account by User ID.
6. System confirms that the account exists.
7. System returns the account's current status, version identifier, and available status actions.
8. Administrator selects Lock Account or Unlock Account.
9. System checks that the selected action is valid for the current status.
10. System requests confirmation from Administrator.
11. Administrator confirms the action.
12. UI sends the status-change request with the version identifier that was loaded.
13. System validates the Access Token and confirms the `admin` role.
14. System re-checks that the account exists and returns its current status.
15. System confirms that the target account is not the acting Administrator's own account.
16. System confirms that the submitted version identifier matches the stored version.
17. System updates the account status in a single transaction.
18. System records the status-change timestamp and the acting Administrator's identifier.
19. System returns the updated account status.
20. UI updates the account view and displays a success notification.
21. Use Case ends.

# 5. Alternative Flow

**A1 – Administrator Locks the Account**

1. At step 8, Administrator selects Lock Account for an account with status `ACTIVE`.
2. System determines that the account can be locked.
3. System applies the change from `ACTIVE` to `LOCKED` after confirmation, at step 17.
4. Use Case continues at step 9.

**A2 – Administrator Unlocks the Account**

1. At step 8, Administrator selects Unlock Account for an account with status `LOCKED`.
2. System determines that the account can be unlocked.
3. System applies the change from `LOCKED` to `ACTIVE` after confirmation, at step 17.
4. Use Case continues at step 9.

**A3 – Account Is Already in the Target State**

1. At step 9, System determines that the account is already `LOCKED` for a lock request, or already `ACTIVE` for an unlock request.
2. System returns the current status without changing it.
3. UI reports that the account is already in the requested state.
4. No update is performed.
5. Use Case ends.

**A4 – Administrator Cancels the Status Change**

1. At step 10, Administrator selects Cancel.
2. UI closes the confirmation dialog.
3. The account status is unchanged.
4. Use Case ends.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing, Invalid, or Expired Access Token**

1. At step 4 or step 13, System cannot find, validate, or accept the Access Token.
2. System rejects the request.
3. The account status is unchanged.
4. System logs the rejection with the request ID and without the token value.
5. System returns `ERR-AUTH-003`.
6. UI clears the stored authentication information and navigates Administrator to the login page.
7. Use Case ends.

**E2 – ERR-PERM-002: Insufficient Privileges**

1. At step 4 or step 13, System determines that the authenticated account does not have the `admin` role.
2. System rejects the request.
3. The account status is unchanged.
4. System logs the rejection with the request ID and the account identifier.
5. System returns `ERR-PERM-002`.
6. UI notifies that Administrator rights are required to change a user's status.
7. Use Case ends.

**E3 – ERR-RES-004: User Not Found**

1. At step 5 or step 14, System cannot retrieve an account with the requested User ID.
2. System rejects the request.
3. The account status is unchanged.
4. System logs the failure with the request ID and the User ID.
5. System returns `ERR-RES-004`.
6. UI notifies that the user no longer exists and returns Administrator to the user list.
7. Use Case ends.

**E4 – ERR-CONFLICT-010: Concurrent User Status Change**

1. At step 16, System detects that the account's status or version identifier changed after the details were loaded, for example because another Administrator locked or unlocked the account.
2. System rejects the request.
3. The account's current status is preserved; no status change is applied.
4. System logs the conflict with the request ID, the User ID, and both version identifiers.
5. System returns `ERR-CONFLICT-010`.
6. UI notifies that the account changed and reloads the latest status before offering the action again.
7. Use Case ends.

**E5 – ERR-VAL-001: Invalid Status Value**

1. At step 9, System determines that the requested status action is not one of the supported actions, `LOCK` or `UNLOCK`.
2. System rejects the request.
3. The account status is unchanged.
4. System logs the validation failure with the request ID and the requested value.
5. System returns `ERR-VAL-001`.
6. UI asks Administrator to select a valid status action.
7. Administrator selects a valid action and resubmits; Use Case continues at step 8.

**E6 – ERR-CONFLICT-011: Administrator Cannot Change Own Account Status**

1. At step 15, System determines that the target account is the acting Administrator's own account.
2. System rejects the request.
3. The account status is unchanged.
4. System logs the rejection with the request ID and the User ID.
5. System returns `ERR-CONFLICT-011`.
6. UI notifies that Administrator cannot lock or unlock their own account and asks them to use another Administrator account.
7. Use Case ends.

**E7 – ERR-SYS-001: Internal System Error**

1. At step 17 or step 18, System encounters an error while updating or persisting the account status.
2. System stops processing the request.
3. The transaction is rolled back, so the status, timestamp, and acting-Administrator record are unchanged.
4. System logs the error and the request ID.
5. System returns `ERR-SYS-001` with a general message.
6. UI notifies that the account status could not be changed and does not display a success message.
7. Administrator may retry later.

**E8 – ERR-NET-001: Network Error**

1. During step 12 or the response to it, the connection is interrupted or times out.
2. UI cannot confirm whether the status change was applied.
3. UI notifies that the result is unknown and does not claim success.
4. Administrator reloads the account details and checks the current status before retrying.
5. Use Case ends when the outcome is confirmed.

# 7. Assumptions

- Account statuses are `ACTIVE` and `LOCKED` in v1.
- Locking an account does not delete the account, its Submissions, its results, or its statistics.
- An already-issued Access Token for a locked account is rejected on its next authenticated request.
- A full audit log is deferred to a post-v1 release; only the last status change is recorded on the account.

# 8. Special Requirements

- Only accounts with the `admin` role may change another user's status; the backend enforces the role.
- The status update, timestamp, and acting-Administrator record are atomic.
- The status change uses optimistic concurrency control to prevent lost updates between Administrators.
- An Administrator must not be able to lock or unlock their own account through this use case.
- The operation must not alter the target account's Submissions, results, or statistics.

# 9. Open Issues

- Whether a locked account should also have its active sessions terminated immediately or only be rejected on the next request will be confirmed in the SRS.
- Whether Administrator should be able to change a user's role is out of scope for v1.
- Full audit logging is deferred per the catalog; the retention period for the last status change is undecided.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 2.0 | 2026-11-13 | Rewritten to `SpecStructure.md` v1.1: added metadata, split postconditions, gave every alternative a branch and rejoin point, added optimistic concurrency and self-lock protection, replaced the vague account-status error with `ERR-CONFLICT-011`, and assigned the distinct `ERR-RES-004` code for a missing user. |
