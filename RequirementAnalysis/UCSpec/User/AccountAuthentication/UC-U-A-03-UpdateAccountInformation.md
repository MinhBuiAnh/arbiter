# Use Case Specification

**UC-U-A-03 - Update Account Information**

**Version:** 1.1

# 1. General Information

- Use Case ID: UC-U-A-03
- Use Case Name: Update Account Information
- Brief Description: Allow User to edit and update supported personal profile information, including Display Name, Bio, and Email. The Username is immutable.
- Primary Actor(s): User, Administrator (through inheritance from User)
- Supporting Actor(s): None
- Trigger: User selects the update account information function.
- Priority: Medium
- Status: Draft
- Related Use Cases: UC-U-A-02 – View Account Information
- Related Requirements: FR-003 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- User is authenticated.
- User can access the update account information page.

# 3. Postconditions

## 3.1. Success

- The new account information is recorded in the database.
- Unedited information remains unchanged.
- The update is applied atomically.

## 3.2. Failure

- No partial or inconsistent account data is recorded.
- Existing account information remains unchanged.
- The submitted values are not retained by System after the request ends.

# 4. Main Flow

1. UI displays the current account information.
2. User selects the update information feature.
3. UI displays the update form with the following editable fields:
   - Display Name.
   - Bio.
   - Email.
   - Username is displayed as read-only and cannot be changed.
4. User updates one or more editable fields.
5. User submits the form.
6. System validates the access token and determines the account.
7. System validates the new data's format, length, and required fields.
8. System validates business rules for each field, including email uniqueness.
9. System updates the account information in the database within a transaction.
10. System returns the successful update result and the new account information.
11. UI updates the displayed information.
12. UI notifies User that the account information was updated successfully.
13. Use Case ends.

# 5. Alternative Flow

**A1 – User Cancels the Update**

1. At steps 4–5, User cancels the update.
2. UI discards any unsaved changes.
3. UI returns to displaying the account information.
4. Use Case ends without changing the data.

**A2 – Update Only Selected Fields**

1. At step 5, User updates only one or some of the editable fields.
2. User submits the form.
3. Use Case continues at step 6 of the Main Flow. System updates only the submitted fields and leaves the other fields unchanged.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing, Invalid, or Expired Access Token**

1. At step 6, System cannot find, validate, or accept the access token.
2. System rejects the update request.
3. No account data is changed.
4. UI preserves the unsaved form data in the browser session.
5. UI clears the stored authentication information and navigates User to the login page.
6. After User logs in again, UI restores the unsaved form data.
7. User resubmits the form, and Use Case continues at step 6.
8. Use Case ends if User does not re-authenticate.

**E2 – ERR-VAL-012: Invalid Account Information**

1. At step 7, System detects one or more invalid fields, such as an invalid format, an invalid length, or a missing required value.
2. System rejects the update request.
3. No account data is changed.
4. System logs the validation failure without logging sensitive values.
5. System returns `ERR-VAL-012` with the invalid fields and their causes.
6. UI displays errors at the fields that need to be edited.
7. User edits the data and resubmits the form.
8. Use Case continues at step 6.

**E3 – ERR-ACC-002: Account Identifier Already Exists**

1. At step 8, System detects that the new email is already used by a different account.
2. System rejects the update of the duplicated field.
3. No account data is changed.
4. System returns `ERR-ACC-002` with the conflicting field.
5. UI asks User to choose a different value.
6. User edits the data and resubmits the form.
7. Use Case continues at step 6.

**E4 – ERR-ACC-001: Account Not Available**

1. At steps 6–8, System detects that the account does not exist or is not allowed to update information.
2. System rejects the request.
3. No account data is changed.
4. System logs the rejection with the request ID.
5. System returns `ERR-ACC-001`.
6. UI notifies User that the account information cannot be updated and asks them to contact an Administrator.
7. Use Case ends.

**E5 – ERR-SYS-001: Internal System Error**

1. At steps 8–10, System encounters an unexpected error while validating or updating the account information.
2. System stops processing the request.
3. If a transaction is open, System rolls it back so that no partial update is persisted.
4. System logs the error with the request ID.
5. System returns `ERR-SYS-001` with a general error message.
6. UI notifies that the operation cannot be completed.
7. User can retry later.
8. Use Case ends.

**E6 – ERR-NET-001: Network Error**

1. During the request or response, the network connection is interrupted or times out.
2. UI cannot confirm whether the update succeeded.
3. UI notifies that it has not received the confirmation result.
4. User can reload the account information to check the current state.
5. If the data has not been updated, User can perform the operation again.
6. Use Case ends if the outcome remains unknown.

# 7. Assumptions

- Username is immutable in v1.
- Email is unique across accounts.
- Display Name and Bio are optional.
- Email verification is not required in v1.
- A User can update only their own account; an Administrator inherits the User behavior.

# 8. Special Requirements

- Only the account owner, or an Administrator through inheritance, may update the account.
- Email uniqueness must be enforced by the database and the application.
- The account update must be atomic; no partial update may be persisted.
- The response must never expose sensitive or internal fields.
- The access token must never be written to logs.

# 9. Open Issues

- None for v1.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 1.1 | 2026-11-13 | Aligned with `SpecStructure.md` v1.1: added metadata, split postconditions, moved token and account checks out of preconditions, merged the expired-token alternative into the exception flow, and assigned a distinct validation error code. |
