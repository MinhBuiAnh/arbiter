# Use Case Specification

**UC-A-03 - Update Account Information**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-A-03
- Use Case Name: Update Account Information
- Brief Description: Allow User to edit and update supported personal profile information, such as Display Name and Avatar.
- Participating Actors: User, Administrator (can also use this feature through User inheritance).

# 2. Preconditions

- User is logged in to the system.
- Access Token is in validity or can be refreshed by Refresh Token.
- User's account exists and is allowed to update the information.
- User can edit their own account.

# 3. Postconditions

- If updated successfully, new account information is recorded in the database.
- Unedited information is unchanged.
- if updated unsuccessfully, System doesn't record part of inconsistent data.

# 4. Main Flow

1. At step 3, System detects that Access Token is expired.
2. UI displays the current information.
3. User selects the update information feature.
4. UI displays the update form.
5. User updates one or more editable fields, such as:
    - Display Name.
    - Avatar.
    - Other supprted profile fields.
6. User sends the form.
7. System validates Access Token and determines the account.
8. System checks the new data's validity.
9. System validates business logics related to each field.
10. System updates account information in the database by transaction if necessary.
11. System returns successful update result and new account information.
12. UI updates displayed information.
13. UI notifies that User has successfully updated their account information.

# 5. Alternative Flow

**A1 – User Cancels the Update**

1. At step 4-5, User cancels the update.
2. System discards any unsaved changes.
3. UI goes back to display account information.
4. Use Case ends without changing the data.

**A2 – Update Only Selected Fields**

1. At step 5, User only updates one or some fields.
2. User sends the form.
3. System only updates those selected fields.
4. Others remains their initial values.
5. Use Case continues from step 11 of the Main Flow.

**A3 – Refresh Access Token**

1. At step 7, System detects that Access Token is expired.
2. UI uses Refresh Token to request a new Access Token.
3. System validates Refresh Token and issues new Access Token if valid.
4. UI resends the update request.
5. Use Case continues from step 7 of the Main Flow.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing or Invalid Access Token**

1. At step 7, System detects that Access Token doesn't exist, is invalid or can't be validated.
2. System rejects the update request.
3. UI checks the Access Token refresh by Refresh Token capability.
4. If token can't be refreshed, UI prompts User to re-login.
5. Use Case ends.

**E2 – ERR-AUTH-002: Invalid or Expired Refresh Token**

1. In A3, System detects that Refresh Token is invalid, expired or revoked.
2. System rejects issuing a new Access Token.
3. UI deletes the now no longer validation data.
4. UI navigates User to the login page.
5. Use Case ends.

**E3 – ERR-VAL-001: Invalid Account Information**

1. At step 8, System detects one or more invalid fields.
2. System rejects updating the data.
3. System returns a list of invalid fields and their causes.
4. UI displays errors at fields that need to be edited.
5. User updates the data and resends the form.

**E4 – ERR-ACC-002: Account Identifier Already Exists**
1. At step 9, System detects that new username is already user by a different account.
2. System rejects updating the duplicated field.
3. System returns the error.
4. UI asks User to choose a different value.
5. User updates the data and resends the form.

**E5 – ERR-ACC-001: Account Not Available**

1. At step 7-9, System detects that the account doesn't exist or is not allowed to update.
2. System rejects the request.
3. System returns the error.
4. UI notifies that User can't update account information.
5. Use Case ends.

**E6 – ERR-SYS-001: Internal System Error**

1. At step 9-11, System encounters an error when determining User or querying the information.
2. System stops processing the request.
3. If a transaction is open, System performs a rollback.
4. Backend logs the error and request ID.
5. System returns the error notification.
6. UI notifies that the operation can't be done.
7. User can retry later.

**E7 – ERR-NET-001: Network Error**

1. In the process of sending form or receiving response, network connection is interuptted or timeout.
2. UI notifies that it hasn't received the confirm result.
3. User can reload account information to check data's current state.
4. If the data hasn't been updated, User can perform the operation once again.