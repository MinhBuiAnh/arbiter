# Use Case Specification

**UC-AD-T-02 - Update Test Case**

**Version:** 2.0

# 1. General Information

- Use Case ID: UC-AD-T-02
- Use Case Name: Update Test Case
- Brief Description: Allow Administrator to update the input data, expected output, or execution order of an existing Test Case while its Problem is active and still in draft, without changing other Test Cases or historical Submission results.
- Primary Actor(s): Administrator
- Supporting Actor(s): None
- Trigger: Administrator selects an existing Test Case and opens its edit form.
- Priority: High
- Status: Draft
- Related Use Cases: UC-AD-T-01 – Create Test Case, UC-AD-T-03 – Delete Test Case, UC-AD-T-05 – Reorder Test Cases
- Related Requirements: FR-012 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- Administrator is logged in with an account that has the `admin` role.
- The Problem owning the Test Case exists and has status `ACTIVE` and publication state `DRAFT`.
- The Test Case to be updated exists and belongs to that Problem.
- Administrator has loaded a current version of the Test Case.
- System is available and can persist data.

# 3. Postconditions

## 3.1. Success

- The changed Test Case fields are persisted.
- The Test Case keeps its association with the original Problem.
- The Test Case's version identifier and update timestamp are advanced.
- Other Test Cases in the Problem are unchanged unless the order update requires it.
- Historical Submission results are unchanged.
- Administrator receives confirmation of the successful update.

## 3.2. Failure

- No Test Case field is changed.
- The previously stored input data, expected output, execution order, and type remain intact.
- Other Test Cases and historical Submission results are unchanged.
- The submitted update is not partially applied.

# 4. Main Flow

1. Administrator opens the Problem Management page.
2. Administrator selects the Problem whose Test Cases are to be managed.
3. UI requests the Problem details from System.
4. System validates the Access Token and confirms the `admin` role.
5. System retrieves the Problem by Problem ID.
6. System confirms that the Problem exists and has status `ACTIVE` and publication state `DRAFT`.
7. System returns the Problem details.
8. Administrator selects the Test Case to edit.
9. UI requests the Test Case details from System.
10. System validates the Access Token, confirms the `admin` role, and confirms that the Test Case belongs to the selected Problem.
11. System returns the Test Case details and its version identifier.
12. UI displays the edit form with the current values.
13. Administrator changes the input data, expected output, or execution order.
14. Administrator submits the update.
15. UI performs basic format checks on the changed values.
16. UI sends the update request with the version identifier that was loaded.
17. System validates the Access Token and confirms the `admin` role.
18. System re-checks that the Problem is still `ACTIVE` and `DRAFT` and that the Test Case still exists and belongs to it.
19. System validates the updated Test Case data.
20. System checks the uniqueness of the execution order when that field changes.
21. System confirms that the submitted version identifier matches the stored version.
22. System updates the Test Case and advances its version identifier in a single transaction.
23. System records the update timestamp.
24. System returns the updated Test Case data.
25. UI updates the Test Case list and displays a success notification.
26. Use Case ends.

# 5. Alternative Flow

**A1 – Administrator Updates Only Selected Fields**

1. At step 13, Administrator changes only one or a few fields.
2. UI sends only the changed values, or sends all values while retaining the unchanged ones.
3. System preserves every field that the request does not change.
4. Use Case continues at step 19.

**A2 – Administrator Cancels the Update**

1. At step 12 or step 13, Administrator selects Cancel.
2. UI requests confirmation when the form contains unsaved changes.
3. Administrator confirms the cancellation.
4. UI discards the changes and returns to the Test Case list.
5. No data is changed.
6. Use Case ends.

**A3 – Administrator Changes the Execution Order**

1. At step 13, Administrator changes the execution order to an unused value.
2. UI treats the new order as part of the Test Case update.
3. System checks that the new value is unique within the Problem at step 20.
4. Use Case continues at step 21.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing, Invalid, or Expired Access Token**

1. At step 4, step 10, or step 17, System cannot find, validate, or accept the Access Token.
2. System rejects the request.
3. No Test Case field is changed.
4. System logs the rejection with the request ID and without the token value.
5. System returns `ERR-AUTH-003`.
6. UI clears the stored authentication information and navigates Administrator to the login page.
7. Use Case ends.

**E2 – ERR-PERM-002: Insufficient Privileges**

1. At step 4, step 10, or step 17, System determines that the authenticated account does not have the `admin` role.
2. System rejects the request.
3. No Test Case field is changed.
4. System logs the rejection with the request ID and the account identifier.
5. System returns `ERR-PERM-002`.
6. UI notifies that Administrator rights are required to update a Test Case.
7. Use Case ends.

**E3 – ERR-RES-001: Problem Not Found**

1. At step 5 or step 18, System cannot retrieve a Problem with the requested Problem ID.
2. System rejects the request.
3. No Test Case is changed.
4. System logs the failure with the request ID and the Problem ID.
5. System returns `ERR-RES-001`.
6. UI notifies that the Problem no longer exists and returns Administrator to the Problem list.
7. Use Case ends.

**E4 – ERR-RES-003: Test Case Not Found**

1. At step 10 or step 18, System cannot retrieve the Test Case, or determines that it does not belong to the selected Problem.
2. System rejects the request.
3. No Test Case is changed.
4. System logs the failure with the request ID, the Problem ID, and the Test Case ID.
5. System returns `ERR-RES-003`.
6. UI notifies that the Test Case no longer exists in this Problem and reloads the Test Case list.
7. Use Case ends.

**E5 – ERR-CONFLICT-001: Problem Is Not Editable**

1. At step 6 or step 18, System determines that the Problem has status `INACTIVE` or publication state `PUBLISHED`.
2. System refuses to update the Test Case.
3. No Test Case is changed.
4. System logs the rejection with the request ID, the Problem ID, and the Problem's current state.
5. System returns `ERR-CONFLICT-001`.
6. UI explains that Test Cases can be changed only while the Problem is `ACTIVE` and `DRAFT`, and offers the relevant Problem workflow.
7. Use Case ends.

**E6 – ERR-VAL-001: Invalid Test Case Data**

1. At step 19, System detects missing, malformed, or unsupported Test Case data.
2. System rejects the request.
3. No Test Case is changed.
4. System logs the validation failure with the request ID and the invalid field names, not the Test Case content.
5. System returns `ERR-VAL-001` with the invalid fields and their causes.
6. UI displays each error next to the corresponding field.
7. Administrator corrects the data and resubmits; Use Case continues at step 14.

**E7 – ERR-VAL-009: Duplicate Test Case Order**

1. At step 20, System determines that the new execution order is already used by another Test Case in the same Problem.
2. System rejects the request.
3. No Test Case is changed.
4. System logs the validation failure with the request ID, the Problem ID, and the requested order.
5. System returns `ERR-VAL-009`.
6. UI asks Administrator to choose a different execution order.
7. Administrator changes the order and resubmits; Use Case continues at step 14.

**E8 – ERR-CONFLICT-007: Concurrent Test Case Update**

1. At step 21, System detects that the stored Test Case version identifier differs from the submitted version identifier because another Administrator updated the Test Case.
2. System rejects the request.
3. No Test Case field is changed.
4. System logs the conflict with the request ID, the Problem ID, the Test Case ID, and both version identifiers.
5. System returns `ERR-CONFLICT-007`.
6. UI notifies that the Test Case changed while the form was open and offers to reload the latest data.
7. If Administrator reloads, Use Case continues at step 12 with the latest data; otherwise Use Case ends.

**E9 – ERR-SYS-001: Internal System Error**

1. At step 22 or step 23, System encounters an error while updating or persisting the Test Case.
2. System stops processing the request.
3. The transaction is rolled back, so no field and no version identifier are changed.
4. System logs the error and the request ID.
5. System returns `ERR-SYS-001` with a general message.
6. UI notifies that the Test Case could not be updated and does not display a success message.
7. Administrator may retry later.

**E10 – ERR-NET-001: Network Error**

1. During step 16 or the response to it, the connection is interrupted or times out.
2. UI cannot confirm whether the update was applied.
3. UI notifies that the result is unknown and does not claim success.
4. Administrator reloads the Test Case details and compares them with the intended changes before retrying.
5. Use Case ends when the outcome is confirmed.

# 7. Assumptions

- A Test Case consists of one input file and one expected-output file.
- Execution order values are unique within a Problem.
- Test Case input and expected output are not displayed to Guests or Users for `HIDDEN` Test Cases.
- Historical Submission results are immutable with respect to Test Case edits.

# 8. Special Requirements

- Only accounts with the `admin` role may update Test Cases; the backend enforces the role.
- Test Case updates are allowed only while the Problem is `ACTIVE` and `DRAFT`.
- The update uses optimistic concurrency control so that one Administrator cannot silently overwrite another Administrator's changes.
- The field update and version advance are atomic.
- Test Case contents must not be written to logs or error responses.
- A Test Case update must not alter any other Test Case's contents or historical grading results.

# 9. Open Issues

- Whether changing the execution order should shift the other Test Cases automatically or require a free order value will be confirmed in the SRS. This specification requires a free value; bulk reordering is handled by UC-AD-T-05 – Reorder Test Cases.
- The exact concurrency token for Test Cases will be confirmed in the SRS.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 2.0 | 2026-11-13 | Rewritten to `SpecStructure.md` v1.1: added metadata, split postconditions, moved the cross-Problem Test Case case from an alternative to an exception flow, added optimistic-concurrency handling, assigned `ERR-VAL-009` and `ERR-CONFLICT-007`, and split the shared `ERR-RES-002` conflict code. |
