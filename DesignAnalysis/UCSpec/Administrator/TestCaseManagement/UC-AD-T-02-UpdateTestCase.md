# Use Case Specification

**UC-AD-T-02 - Update Test Case**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-AD-T-02
- Use Case Name: Update Test Case
- Brief Description: Allow Administrator to update the data of an existing Test Case, including Input Data, Expected Output, and Order Index. Updates are only performed when the corresponding Problem is Active and in Draft state.
- Participating Actors: Administrator.

# 2. Preconditions

- Administrator has successfully logged in.
- Administrator has permission to manage Test Cases.
- The Test Case to be updated already exists.
- The Problem owning the Test Case is Active and in `DRAFT` state.

# 3. Postconditions

- Test Case information is successfully updated.
- The Test Case remains part of the original Problem.
- Other Test Cases are not changed.
- The submission history results are not altered.

# 4. Main Flow

1. Administrator accesses the Problem Management page.
2. Administrator selects the Problem to manage.
3. UI sends a request to System for Problem information.
4. System authenticates the Access Token.
5. System checks Administrator privileges.
6. System queries the Problem by Problem ID.
7. System checks if the Problem exists, is Active, or is in Draft status.
8. System returns the Problem information.
9. Administrator selects the Test Case to edit.
10. UI sends a request to System for Test Case details.
11. System authenticates privileges and checks if the Test Case belongs to the corresponding Problem.
12. System returns the Test Case information.
13. UI displays the edit form.
14. Administrator changes Input Data, Expected Output, or Order Index.
15. Administrator sends an update request.
16. System authenticates the Access Token and Administrator privileges.
17. System checks that the Problem and Test Case still exist, and that the Problem is still editable.
18. System validates the updated data.
19. System checks the uniqueness of the Order Index if this field changes.
20. System updates the Test Case in PostgreSQL.
21. System saves the new update time.
22. System returns the Test Case information after the update.
23. UI reports that the update was successful.

# 5. Alternative Flow

**A1 – Administrator Updates Only Selected Fields**

1. At step 14, the Administrator only changes one or a few fields.
2. System preserves fields that were not requested to be updated.
3. System only updates valid fields that were submitted.
4. Continue to step 18 of the Main Flow.

**A2 – Administrator Cancels Update**

1. At step 13 or 14, the Administrator selects Cancel.
2. If there is unsaved data, UI requests confirmation.
3. The administrator confirms the cancellation.
4. UI returns to the list of Test Cases.
5. No changes are saved.
6. The Use Case ends.

**A3 – Administrator Changes Test Case Order**

1. At step 14, the Administrator changes the Order Index.
2. System checks that the new Order Index does not conflict with other Test Cases in the same Problem.
3. System updates the new order.
4. Continue to step 20 of the Main Flow.

**A4 – Test Case Belongs to Another Problem**

1. At step 11, System detects that the Test Case ID does not belong to the specified Problem ID.
2. System does not allow updating.
3. Returns ERR-RES-001 – Resource Not Found.
4. UI reports that the Test Case in the corresponding Problem was not found.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing or Invalid Access Token**

1. Returns ERR-AUTH-003 – Missing or Invalid Access Token.
2. UI attempts to refresh the Access Token if possible.
3. If it cannot be refreshed, prompts the Administrator to log in again.

**E2 – ERR-AUTH-002: Invalid or Expired Refresh Token**

1. Returns ERR-AUTH-002 – Invalid or Expired Refresh Token.
2. UI clears the local login status and prompts for a login attempt.

**E3 – ERR-PERM-002: Insufficient Privileges**

1. The request sender does not have Administrator privileges.
2. Returns ERR-PERM-002 – Insufficient Privileges.
3. UI reports that it does not have permission to update the Test Case.

**E4 – ERR-RES-001: Problem or Test Case Not Found**

1. The Problem ID or Test Case ID does not exist, or the Test Case does not belong to the specified Problem.
2. Returns ERR-RES-001 – Resource Not Found.
3. UI reports that the resource was not found.

**E5 – ERR-RES-002: Problem Is Not Editable**

1. The problem is inactive or published.
2. System refused to update.
3. Returned ERR-RES-002 – Resource State Conflict.
4. The administrator needs to enable or unpublish the problem before continuing.

**E6 – ERR-VAL-001: Invalid Test Case Data**

1. Invalid update data.
2. Returns ERR-VAL-001 – Invalid Input.
3. UI displays the error for the Administrator to edit.

**E7 – ERR-VAL-001: Duplicate Order Index**

1. The new Order Index has already been used by another Test Case in the same Problem.
2. Returns ERR-VAL-001 – Invalid Input.
3. UI prompts the Administrator to select a different order.

**E8 – ERR-RES-002: Concurrent Update Conflict**

1. The Test Case was updated by another Administrator while the form was open.
2. System detects the data being submitted based on an outdated version.
3. Returns ERR-RES-002 – Resource State Conflict.
4. UI notifies that the data has changed and requests a reload.

**E9 – ERR-SYS-001: Internal System Error**

1. System cannot save changes to PostgreSQL.
2. Returns ERR-SYS-001 – Internal System Error.
3. UI reports that the Test Case cannot be updated.

**E10 – ERR-NET-001: Network Error**

1. UI cannot connect to System, or the request times out.
2. Identified as ERR-NET-001 – Network Error.
3. UI reports the error and allows a retry after checking the current data.