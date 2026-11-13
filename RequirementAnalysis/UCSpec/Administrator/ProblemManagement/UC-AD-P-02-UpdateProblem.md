# Use Case Specification

**UC-AD-P-02 - Update Problem**

**Version:** 2.0

# 1. General Information

- Use Case ID: UC-AD-P-02
- Use Case Name: Update Problem
- Brief Description: Allow Administrator to update the metadata of an existing Problem, including its title, statement, input/output format, constraints, and execution limits, without changing historical Submission data or the Problem's publication state.
- Primary Actor(s): Administrator
- Supporting Actor(s): None
- Trigger: Administrator selects an existing Problem and opens its edit form.
- Priority: High
- Status: Draft
- Related Use Cases: UC-AD-P-01 – Create Problem, UC-AD-P-03 – Delete / Deactivate Problem, UC-AD-P-04 – Manage Problem Publication, UC-AD-T-01 – Create Test Case
- Related Requirements: FR-010, FR-011 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- Administrator is logged in with an account that has the `admin` role.
- The Problem to be updated exists and has status `ACTIVE`.
- Administrator has loaded a current version of the Problem.
- System is available and can persist data.

# 3. Postconditions

## 3.1. Success

- The changed Problem fields are persisted.
- The Problem keeps status `ACTIVE`.
- The Problem keeps its publication state: `DRAFT` remains `DRAFT`, and `PUBLISHED` remains `PUBLISHED`.
- The Problem's version identifier and update timestamp are advanced.
- Existing Submissions retain their historical source code, verdicts, and results.
- Administrator receives confirmation of the successful update.

## 3.2. Failure

- No Problem field is changed.
- The previously stored Problem data, version identifier, and publication state remain intact.
- Existing Submissions and Test Cases are unchanged.
- The submitted update is not partially applied.

# 4. Main Flow

1. Administrator opens the Problem Management page.
2. Administrator selects the Problem to edit.
3. UI requests the Problem details from System.
4. System validates the Access Token and confirms the `admin` role.
5. System retrieves the Problem by Problem ID.
6. System confirms that the Problem exists and has status `ACTIVE`.
7. System returns the current Problem data and its version identifier.
8. UI displays the edit form with the current values.
9. Administrator changes one or more fields.
10. Administrator submits the update.
11. UI performs basic format checks on the changed values.
12. UI sends the update request with the version identifier that was loaded.
13. System validates the Access Token and confirms the `admin` role.
14. System retrieves the Problem and confirms that it still exists and has status `ACTIVE`.
15. System validates the updated fields against the business rules.
16. System confirms that the submitted version identifier matches the stored version.
17. System updates the changed fields and advances the version identifier in a single transaction.
18. System records the update timestamp.
19. System returns the updated Problem data and the new version identifier.
20. UI displays the updated Problem and a success notification.
21. Use Case ends.

# 5. Alternative Flow

**A1 – Administrator Updates Only Selected Fields**

1. At step 9, Administrator changes only some fields.
2. UI sends only the changed values, or sends all values while retaining the unchanged ones.
3. System preserves every field that the request does not change.
4. Use Case continues at step 15.

**A2 – Administrator Cancels the Update**

1. At step 8 or step 9, Administrator selects Cancel.
2. UI requests confirmation when the form contains unsaved changes.
3. Administrator confirms the cancellation.
4. UI discards the changes and returns to the Problem detail view.
5. No data is changed.
6. Use Case ends.

**A3 – Problem Is Published**

1. At step 6, System determines that the Problem has publication state `PUBLISHED`.
2. System allows the metadata update because the Problem has status `ACTIVE`.
3. After a successful update, the Problem retains publication state `PUBLISHED`.
4. System applies the publication requirements to the updated metadata.
5. Use Case continues at step 7.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing, Invalid, or Expired Access Token**

1. At step 4 or step 13, System cannot find, validate, or accept the Access Token.
2. System rejects the request.
3. No Problem field is changed.
4. System logs the rejection with the request ID and without the token value.
5. System returns `ERR-AUTH-003`.
6. UI clears the stored authentication information and navigates Administrator to the login page.
7. Use Case ends.

**E2 – ERR-PERM-002: Insufficient Privileges**

1. At step 4 or step 13, System determines that the authenticated account does not have the `admin` role.
2. System rejects the request.
3. No Problem field is changed.
4. System logs the rejection with the request ID and the account identifier.
5. System returns `ERR-PERM-002`.
6. UI notifies that Administrator rights are required to update the Problem.
7. Use Case ends.

**E3 – ERR-RES-001: Problem Not Found**

1. At step 5 or step 14, System cannot retrieve a Problem with the requested Problem ID.
2. System rejects the request.
3. No Problem field is changed.
4. System logs the failure with the request ID and the Problem ID.
5. System returns `ERR-RES-001`.
6. UI notifies that the Problem no longer exists and returns Administrator to the Problem list.
7. Use Case ends.

**E4 – ERR-CONFLICT-003: Problem Is Inactive**

1. At step 6 or step 14, System determines that the Problem has status `INACTIVE`.
2. System rejects the update request.
3. No Problem field is changed.
4. System logs the rejection with the request ID and the Problem ID.
5. System returns `ERR-CONFLICT-003`.
6. UI notifies that an inactive Problem cannot be edited and points Administrator to UC-AD-P-03 – Delete / Deactivate Problem to reactivate it.
7. Use Case ends.

**E5 – ERR-VAL-001: Invalid Update Data**

1. At step 15, System detects missing, malformed, or out-of-range update data, or data that violates the publication requirements of a published Problem.
2. System rejects the request.
3. No Problem field is changed.
4. System logs the validation failure with the request ID and the invalid field names, not the full Problem content.
5. System returns `ERR-VAL-001` with the invalid fields and their causes.
6. UI displays each error next to the corresponding field.
7. Administrator corrects the data and resubmits; Use Case continues at step 10.

**E6 – ERR-CONFLICT-004: Concurrent Problem Update**

1. At step 16, System detects that the stored version identifier differs from the submitted version identifier because another Administrator updated the Problem.
2. System rejects the request.
3. No Problem field is changed.
4. System logs the conflict with the request ID, the Problem ID, and both version identifiers.
5. System returns `ERR-CONFLICT-004`.
6. UI notifies that the Problem changed while the form was open and offers to reload the latest data.
7. If Administrator reloads, Use Case continues at step 8 with the latest data; otherwise Use Case ends.

**E7 – ERR-SYS-001: Internal System Error**

1. At step 17 or step 18, System encounters an error while updating or persisting the Problem.
2. System stops processing the request.
3. The transaction is rolled back, so no field and no version identifier are changed.
4. System logs the error and the request ID.
5. System returns `ERR-SYS-001` with a general message.
6. UI notifies that the Problem could not be updated and does not display a success message.
7. Administrator may retry later.

**E8 – ERR-NET-001: Network Error**

1. During step 12 or the response to it, the connection is interrupted or times out.
2. UI cannot confirm whether the update was applied.
3. UI notifies that the result is unknown and does not claim success.
4. Administrator reloads the Problem details and compares them with the intended changes before retrying.
5. Use Case ends when the outcome is confirmed.

# 7. Assumptions

- The Problem has a version identifier or an equivalent concurrency token that changes on every successful update.
- Problem titles need not be unique in v1.
- Editing the metadata of a published Problem is allowed; editing its Test Cases is not, per the v1 lifecycle rules.
- Historical Submission data is immutable with respect to Problem metadata changes.

# 8. Special Requirements

- Only accounts with the `admin` role may update Problems; the backend enforces the role.
- The update uses optimistic concurrency control so that one Administrator cannot silently overwrite another Administrator's changes.
- The field update and version advance are atomic.
- A published Problem must still satisfy the publication requirements after the update; otherwise the update is rejected.
- No Submission, Test Case, or grading result is modified by this use case.

# 9. Open Issues

- The SRS must confirm whether a published Problem must remain publication-eligible after a metadata update or whether the update should automatically unpublish it. This specification requires eligibility and rejects the update otherwise.
- The exact concurrency token, such as a version number or update timestamp, will be confirmed in the SRS.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 2.0 | 2026-11-13 | Rewritten to `SpecStructure.md` v1.1: added metadata, split postconditions, moved the inactive-Problem case to a distinct conflict code, added optimistic-concurrency handling, split the shared `ERR-RES-002` conflict code, and named responsible parties in every flow step. |
