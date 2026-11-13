# Use Case Specification

**UC-AD-T-03 - Delete Test Case**

**Version:** 2.0

# 1. General Information

- Use Case ID: UC-AD-T-03
- Use Case Name: Delete Test Case
- Brief Description: Allow Administrator to remove a Test Case from a Problem that is active and still in draft, while preserving the Problem, its remaining Test Cases, and historical Submission data.
- Primary Actor(s): Administrator
- Supporting Actor(s): None
- Trigger: Administrator selects Delete for an existing Test Case.
- Priority: High
- Status: Draft
- Related Use Cases: UC-AD-T-01 – Create Test Case, UC-AD-T-02 – Update Test Case, UC-AD-T-05 – Reorder Test Cases, UC-AD-P-04 – Manage Problem Publication
- Related Requirements: FR-012 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- Administrator is logged in with an account that has the `admin` role.
- The Problem owning the Test Case exists and has status `ACTIVE` and publication state `DRAFT`.
- The Test Case to be deleted exists and belongs to that Problem.
- Administrator has loaded a current version of the Test Case.
- System is available and can persist data.

# 3. Postconditions

## 3.1. Success

- The Test Case is removed from the Problem's current Test Case set.
- The remaining Test Cases keep their input data, expected output, and type.
- The remaining Test Cases are renumbered so that their execution order stays unique and contiguous within the Problem.
- The Problem still exists with status `ACTIVE` and publication state `DRAFT`.
- Historical Submissions and grading results are preserved.
- Administrator receives confirmation of the successful deletion.

## 3.2. Failure

- No Test Case is deleted.
- The Problem's Test Case set and execution order are unchanged.
- Historical Submissions and grading results are unchanged.

# 4. Main Flow

1. Administrator opens the Problem Management page.
2. Administrator selects the Problem whose Test Cases are to be managed.
3. UI requests the Problem details from System.
4. System validates the Access Token and confirms the `admin` role.
5. System retrieves the Problem by Problem ID.
6. System confirms that the Problem exists and has status `ACTIVE` and publication state `DRAFT`.
7. System returns the Problem details.
8. Administrator selects the Test Case to delete.
9. UI requests the Test Case details from System.
10. System confirms that the Test Case exists and belongs to the selected Problem.
11. System returns the Test Case details and its version identifier.
12. UI displays the Test Case details.
13. Administrator selects Delete.
14. UI displays a deletion confirmation dialog.
15. Administrator confirms the deletion.
16. UI sends the deletion request with the version identifier that was loaded.
17. System validates the Access Token and confirms the `admin` role.
18. System re-checks that the Problem is still `ACTIVE` and `DRAFT` and that the Test Case still exists and belongs to it.
19. System confirms that the submitted version identifier matches the stored version.
20. System deletes the Test Case and renumbers the remaining Test Cases in a single transaction.
21. System records the deletion timestamp on the Problem.
22. System returns the operation result and the updated Test Case list.
23. UI removes the Test Case from the list and displays a success notification.
24. Use Case ends.

# 5. Alternative Flow

**A1 – Administrator Cancels the Deletion**

1. At step 14, Administrator selects Cancel.
2. UI closes the confirmation dialog.
3. No Test Case is deleted.
4. Use Case ends.

**A2 – Administrator Deletes the Last Test Case**

1. At step 18, System determines that the Test Case is the only remaining Test Case of the Problem.
2. System allows the deletion because the Problem is still in `DRAFT`.
3. System removes the Test Case and leaves the Problem with an empty Test Case set.
4. UI informs Administrator that the Problem cannot be published until the publication requirements are met again.
5. Use Case continues at step 19.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing, Invalid, or Expired Access Token**

1. At step 4 or step 17, System cannot find, validate, or accept the Access Token.
2. System rejects the request.
3. No Test Case is deleted.
4. System logs the rejection with the request ID and without the token value.
5. System returns `ERR-AUTH-003`.
6. UI clears the stored authentication information and navigates Administrator to the login page.
7. Use Case ends.

**E2 – ERR-PERM-002: Insufficient Privileges**

1. At step 4 or step 17, System determines that the authenticated account does not have the `admin` role.
2. System rejects the request.
3. No Test Case is deleted.
4. System logs the rejection with the request ID and the account identifier.
5. System returns `ERR-PERM-002`.
6. UI notifies that Administrator rights are required to delete a Test Case.
7. Use Case ends.

**E3 – ERR-RES-001: Problem Not Found**

1. At step 5 or step 18, System cannot retrieve a Problem with the requested Problem ID.
2. System rejects the request.
3. No Test Case is deleted.
4. System logs the failure with the request ID and the Problem ID.
5. System returns `ERR-RES-001`.
6. UI notifies that the Problem no longer exists and returns Administrator to the Problem list.
7. Use Case ends.

**E4 – ERR-RES-003: Test Case Not Found**

1. At step 10 or step 18, System cannot retrieve the Test Case, or determines that it does not belong to the selected Problem, for example because another Administrator already deleted it.
2. System rejects the request.
3. No Test Case is deleted.
4. System logs the failure with the request ID, the Problem ID, and the Test Case ID.
5. System returns `ERR-RES-003`.
6. UI notifies that the Test Case no longer exists in this Problem and reloads the Test Case list.
7. Use Case ends.

**E5 – ERR-CONFLICT-001: Problem Is Not Editable**

1. At step 6 or step 18, System determines that the Problem has status `INACTIVE` or publication state `PUBLISHED`.
2. System refuses to delete the Test Case.
3. No Test Case is deleted.
4. System logs the rejection with the request ID, the Problem ID, and the Problem's current state.
5. System returns `ERR-CONFLICT-001`.
6. UI explains that Test Cases can be changed only while the Problem is `ACTIVE` and `DRAFT`, and offers the relevant Problem workflow.
7. Use Case ends.

**E6 – ERR-CONFLICT-008: Concurrent Test Case Set Change**

1. At step 19, System detects that the Test Case or the Problem's Test Case set changed after the details were loaded, for example because another Administrator added, updated, deleted, or reordered a Test Case.
2. System rejects the request.
3. No Test Case is deleted and no order value is changed.
4. System logs the conflict with the request ID, the Problem ID, the Test Case ID, and both version identifiers.
5. System returns `ERR-CONFLICT-008`.
6. UI notifies that the Test Case set changed and reloads the latest list before offering the deletion again.
7. Use Case ends.

**E7 – ERR-SYS-001: Internal System Error**

1. At step 20 or step 21, System encounters an error while deleting the Test Case or renumbering the remaining Test Cases.
2. System stops processing the request.
3. The transaction is rolled back, so the Test Case still exists and the previous order is intact.
4. System logs the error and the request ID.
5. System returns `ERR-SYS-001` with a general message.
6. UI notifies that the Test Case could not be deleted and does not display a success message.
7. Administrator may retry later.

**E8 – ERR-NET-001: Network Error**

1. During step 16 or the response to it, the connection is interrupted or times out.
2. UI cannot confirm whether the deletion was applied.
3. UI notifies that the result is unknown and does not claim success.
4. Administrator reloads the Test Case list and checks whether the Test Case still exists before retrying.
5. Use Case ends when the outcome is confirmed.

# 7. Assumptions

- Deleting a Test Case is always allowed while the Problem is `ACTIVE` and `DRAFT`; publication requirements are enforced at publication time, not at deletion time.
- A deleted Test Case's execution order is reused when the remaining Test Cases are renumbered.
- Historical Submissions store enough information to remain readable after a Test Case is deleted.
- A Test Case consists of one input file and one expected-output file.

# 8. Special Requirements

- Only accounts with the `admin` role may delete Test Cases; the backend enforces the role.
- Test Case deletion is allowed only while the Problem is `ACTIVE` and `DRAFT`.
- The deletion and the renumbering of the remaining Test Cases are atomic.
- The deletion uses optimistic concurrency control to prevent lost updates between Administrators.
- No Submission, grading result, or remaining Test Case content is modified by the deletion.

# 9. Open Issues

- Whether a deleted Test Case's data should be retained for a retention period or removed immediately will be confirmed in the SRS.
- The maximum number of Test Cases per Problem is not yet defined.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 2.0 | 2026-11-13 | Rewritten to `SpecStructure.md` v1.1: added metadata, split postconditions, converted the already-deleted case into an exception flow, added contiguous-order renumbering, assigned `ERR-CONFLICT-008`, and split the shared `ERR-RES-002` conflict code. |
