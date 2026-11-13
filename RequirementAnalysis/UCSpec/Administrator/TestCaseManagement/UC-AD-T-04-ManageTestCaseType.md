# Use Case Specification

**UC-AD-T-04 - Manage Test Case Type**

**Version:** 2.0

# 1. General Information

- Use Case ID: UC-AD-T-04
- Use Case Name: Manage Test Case Type
- Brief Description: Allow Administrator to change a Test Case between type `SAMPLE` and type `HIDDEN` while its Problem is active and still in draft, so that the intended Test Cases are publicly visible and the others remain private to the judge.
- Primary Actor(s): Administrator
- Supporting Actor(s): None
- Trigger: Administrator selects a new type for an existing Test Case.
- Priority: Medium
- Status: Draft
- Related Use Cases: UC-AD-T-01 – Create Test Case, UC-AD-T-02 – Update Test Case, UC-AD-P-04 – Manage Problem Publication, UC-COM-03 – View Problem Details
- Related Requirements: FR-012 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- Administrator is logged in with an account that has the `admin` role.
- The Problem owning the Test Case exists and has status `ACTIVE` and publication state `DRAFT`.
- The Test Case whose type is to be changed exists and belongs to that Problem.
- Administrator has loaded a current version of the Test Case.
- System is available and can persist data.

# 3. Postconditions

## 3.1. Success

- The Test Case has type `SAMPLE` or `HIDDEN` as selected.
- The Test Case's input data, expected output, and execution order are unchanged.
- The Test Case's version identifier and update timestamp are advanced.
- Historical Submission results are unchanged.
- The Problem's Test Case list reflects the new type.
- Administrator receives confirmation of the successful type change.

## 3.2. Failure

- The Test Case type is unchanged.
- The Test Case's input data, expected output, and execution order are unchanged.
- Historical Submission results are unchanged.
- The submitted change is not partially applied.

# 4. Main Flow

1. Administrator opens the Problem Management page.
2. Administrator selects the Problem whose Test Cases are to be managed.
3. UI requests the Problem details from System.
4. System validates the Access Token and confirms the `admin` role.
5. System retrieves the Problem by Problem ID.
6. System confirms that the Problem exists and has status `ACTIVE` and publication state `DRAFT`.
7. System returns the Problem details.
8. Administrator selects the Test Case whose type is to be changed.
9. UI requests the Test Case details from System.
10. System confirms that the Test Case exists and belongs to the selected Problem.
11. System returns the Test Case details, its current type, and its version identifier.
12. UI displays the current type and the available types.
13. Administrator selects the new type.
14. UI explains the visibility consequences of the selected type.
15. Administrator confirms the type change.
16. UI sends the type-change request with the version identifier that was loaded.
17. System validates the Access Token and confirms the `admin` role.
18. System re-checks that the Problem is still `ACTIVE` and `DRAFT` and that the Test Case still exists and belongs to it.
19. System validates that the requested type is supported.
20. System confirms that the submitted version identifier matches the stored version.
21. System updates the Test Case type and advances the version identifier in a single transaction.
22. System records the update timestamp.
23. System returns the updated Test Case data.
24. UI updates the Test Case list and displays a success notification.
25. Use Case ends.

# 5. Alternative Flow

**A1 – Administrator Changes Sample to Hidden**

1. At step 13, Administrator selects `HIDDEN` for a Test Case that currently has type `SAMPLE`.
2. UI warns that the Test Case input and expected output will no longer be publicly accessible to Guests and Users.
3. Administrator confirms the change.
4. System updates the type to `HIDDEN`.
5. The input data and expected output remain unchanged.
6. Use Case continues at step 16.

**A2 – Administrator Changes Hidden to Sample**

1. At step 13, Administrator selects `SAMPLE` for a Test Case that currently has type `HIDDEN`.
2. UI warns that the Test Case input and expected output may become publicly accessible when the Problem is published.
3. Administrator confirms the change.
4. System updates the type to `SAMPLE`.
5. The input data and expected output remain unchanged.
6. Use Case continues at step 16.

**A3 – Administrator Selects the Current Type**

1. At step 13, Administrator selects the type that the Test Case already has.
2. UI reports that the Test Case type is unchanged.
3. No request is sent.
4. Use Case ends.

**A4 – Administrator Cancels the Type Change**

1. At step 14, Administrator selects Cancel.
2. UI closes the confirmation and keeps the current type.
3. No data is changed.
4. Use Case ends.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing, Invalid, or Expired Access Token**

1. At step 4, step 10, or step 17, System cannot find, validate, or accept the Access Token.
2. System rejects the request.
3. The Test Case type is unchanged.
4. System logs the rejection with the request ID and without the token value.
5. System returns `ERR-AUTH-003`.
6. UI clears the stored authentication information and navigates Administrator to the login page.
7. Use Case ends.

**E2 – ERR-PERM-002: Insufficient Privileges**

1. At step 4, step 10, or step 17, System determines that the authenticated account does not have the `admin` role.
2. System rejects the request.
3. The Test Case type is unchanged.
4. System logs the rejection with the request ID and the account identifier.
5. System returns `ERR-PERM-002`.
6. UI notifies that Administrator rights are required to manage Test Case types.
7. Use Case ends.

**E3 – ERR-RES-001: Problem Not Found**

1. At step 5 or step 18, System cannot retrieve a Problem with the requested Problem ID.
2. System rejects the request.
3. The Test Case type is unchanged.
4. System logs the failure with the request ID and the Problem ID.
5. System returns `ERR-RES-001`.
6. UI notifies that the Problem no longer exists and returns Administrator to the Problem list.
7. Use Case ends.

**E4 – ERR-RES-003: Test Case Not Found**

1. At step 10 or step 18, System cannot retrieve the Test Case, or determines that it does not belong to the selected Problem.
2. System rejects the request.
3. The Test Case type is unchanged.
4. System logs the failure with the request ID, the Problem ID, and the Test Case ID.
5. System returns `ERR-RES-003`.
6. UI notifies that the Test Case no longer exists in this Problem and reloads the Test Case list.
7. Use Case ends.

**E5 – ERR-CONFLICT-001: Problem Is Not Editable**

1. At step 6 or step 18, System determines that the Problem has status `INACTIVE` or publication state `PUBLISHED`.
2. System refuses to change the Test Case type.
3. The Test Case type is unchanged.
4. System logs the rejection with the request ID, the Problem ID, and the Problem's current state.
5. System returns `ERR-CONFLICT-001`.
6. UI explains that Test Case types can be changed only while the Problem is `ACTIVE` and `DRAFT`, and offers the relevant Problem workflow.
7. Use Case ends.

**E6 – ERR-VAL-001: Invalid Test Case Type**

1. At step 19, System determines that the requested type is not one of the supported types, `SAMPLE` or `HIDDEN`.
2. System rejects the request.
3. The Test Case type is unchanged.
4. System logs the validation failure with the request ID and the requested value.
5. System returns `ERR-VAL-001`.
6. UI asks Administrator to select a valid type.
7. Administrator selects a valid type and resubmits; Use Case continues at step 13.

**E7 – ERR-CONFLICT-007: Concurrent Test Case Update**

1. At step 20, System detects that the Test Case changed after the details were loaded, for example because another Administrator changed the type or deleted the Test Case.
2. System rejects the request.
3. The Test Case type is unchanged.
4. System logs the conflict with the request ID, the Problem ID, the Test Case ID, and both version identifiers.
5. System returns `ERR-CONFLICT-007`.
6. UI notifies that the Test Case changed and reloads the latest data before offering the type change again.
7. Use Case ends.

**E8 – ERR-SYS-001: Internal System Error**

1. At step 21 or step 22, System encounters an error while updating or persisting the Test Case type.
2. System stops processing the request.
3. The transaction is rolled back, so the type and version identifier are unchanged.
4. System logs the error and the request ID.
5. System returns `ERR-SYS-001` with a general message.
6. UI notifies that the Test Case type could not be changed and does not display a success message.
7. Administrator may retry later.

**E9 – ERR-NET-001: Network Error**

1. During step 16 or the response to it, the connection is interrupted or times out.
2. UI cannot confirm whether the type change was applied.
3. UI notifies that the result is unknown and does not claim success.
4. Administrator reloads the Test Case details and checks the current type before retrying.
5. Use Case ends when the outcome is confirmed.

# 7. Assumptions

- Only the types `SAMPLE` and `HIDDEN` exist in v1.
- Changing a type does not change the Test Case's input data, expected output, or execution order.
- `SAMPLE` Test Case data may be displayed publicly through UC-COM-03 – View Problem Details when the Problem is published.
- `HIDDEN` Test Case data is never displayed publicly or through Submission views.

# 8. Special Requirements

- Only accounts with the `admin` role may change Test Case types; the backend enforces the role.
- Type changes are allowed only while the Problem is `ACTIVE` and `DRAFT`.
- The type update and version advance are atomic.
- The update uses optimistic concurrency control to prevent lost updates between Administrators.
- Changing a type must not expose hidden Test Case data or alter historical Submission results.

# 9. Open Issues

- Whether changing a `HIDDEN` Test Case to `SAMPLE` should require an additional confirmation that quotes the data to be exposed will be confirmed in the SRS.
- The exact warning text for visibility changes is a UI decision and does not affect this specification.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 2.0 | 2026-11-13 | Rewritten to `SpecStructure.md` v1.1: added metadata, split postconditions, converted the type-selection cases into explicit alternatives, added optimistic-concurrency handling, and replaced the shared `ERR-RES-002` conflict code with `ERR-CONFLICT-001` and `ERR-CONFLICT-007`. |
