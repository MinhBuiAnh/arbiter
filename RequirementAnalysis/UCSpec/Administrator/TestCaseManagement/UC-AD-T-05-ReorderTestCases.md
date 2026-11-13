# Use Case Specification

**UC-AD-T-05 - Reorder Test Cases**

**Version:** 1.1

# 1. General Information

- Use Case ID: UC-AD-T-05
- Use Case Name: Reorder Test Cases
- Brief Description: Allow Administrator to change the execution order of the Test Cases belonging to a Problem. Reordering changes only the `ordinal` values and does not modify input data, expected output, or the sample/hidden type.
- Primary Actor(s): Administrator
- Supporting Actor(s): None
- Trigger: Administrator drags a Test Case or selects a move-up/move-down control and confirms the new order.
- Priority: Medium
- Status: Draft
- Related Use Cases: UC-AD-T-01 – Create Test Case, UC-AD-T-02 – Update Test Case, UC-AD-T-03 – Delete Test Case, UC-AD-P-04 – Manage Problem Publication
- Related Requirements: FR-012 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- Administrator has successfully logged in.
- Access Token is valid and belongs to an account with the `admin` role.
- The Problem exists, is `ACTIVE`, and is in the `DRAFT` publication state.
- The Problem has at least two Test Cases.

# 3. Postconditions

## 3.1. Success

- The Test Cases have new, unique, and contiguous `ordinal` values starting at 1.
- Each Test Case keeps its Input Data, Expected Output, and type (`SAMPLE` or `HIDDEN`).
- Historical Submission results are unchanged.
- The new order is persisted atomically.

## 3.2. Failure

- No `ordinal` value is changed.
- The previously stored order remains intact.
- Each Test Case keeps its Input Data, Expected Output, and type.

# 4. Main Flow

1. Administrator opens the Test Case management page of a Problem.
2. System validates the Access Token and Administrator privileges.
3. System checks that the Problem exists, is `ACTIVE`, and is `DRAFT`.
4. System returns the ordered list of Test Cases with identifiers, current ordinals, types, and short previews.
5. UI displays the list in its current execution order.
6. Administrator changes the order using drag-and-drop or move-up/move-down controls.
7. UI sends the complete ordered list of Test Case identifiers to System.
8. System validates the Access Token and Administrator privileges.
9. System re-checks that the Problem exists, is `ACTIVE`, and is `DRAFT`.
10. System verifies that the submitted identifier set exactly matches the current Test Case set: no identifier is missing, duplicated, unknown, or from another Problem.
11. System verifies that at least two Test Cases are present.
12. System updates the `ordinal` values in a single transaction.
13. System returns the new order.
14. UI displays the updated order and confirms success.
15. Use Case ends.

# 5. Alternative Flow

**A1 – Administrator Cancels Reordering**

1. At step 6, Administrator leaves the page or selects Cancel.
2. UI discards the local order change.
3. No request is sent and no `ordinal` value changes.
4. Use Case ends.

**A2 – Submitted Order Is Unchanged**

1. At step 10, System determines that the submitted order is identical to the stored order.
2. System performs no update.
3. System returns the current order.
4. UI confirms that no change was necessary.
5. Use Case ends.

**A3 – Administrator Moves a Single Test Case**

1. At step 6, Administrator moves one Test Case one position up or down.
2. UI sends the resulting complete order.
3. Use Case continues at step 8 of the Main Flow.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing, Invalid, or Expired Access Token**

1. At step 2 or step 8, System cannot find, validate, or accept the Access Token.
2. System rejects the request.
3. No `ordinal` value is changed.
4. System logs the error with the request ID and without the token value.
5. System returns `ERR-AUTH-003`.
6. UI clears the stored authentication information and navigates Administrator to the login page.
7. Use Case ends.

**E2 – ERR-PERM-002: Insufficient Privileges**

1. At step 2 or step 8, System determines that the account does not have the `admin` role.
2. System rejects the request.
3. No `ordinal` value is changed.
4. System logs the error with the request ID.
5. System returns `ERR-PERM-002`.
6. UI notifies that Administrator rights are required.
7. Use Case ends.

**E3 – ERR-RES-001: Problem Not Found**

1. At step 3 or step 9, System cannot find the Problem.
2. System rejects the request.
3. No `ordinal` value is changed.
4. System returns `ERR-RES-001`.
5. UI notifies that the Problem no longer exists and navigates back to the Problem list.
6. Use Case ends.

**E4 – ERR-RES-003: Test Case Not Found**

1. At step 10, System cannot find one of the submitted Test Cases.
2. System rejects the request.
3. No `ordinal` value is changed.
4. System returns `ERR-RES-003`.
5. UI reloads the Test Case list and asks Administrator to try again.
6. Use Case ends.

**E5 – ERR-CONFLICT-001: Problem Is Not Editable**

1. At step 3 or step 9, System detects that the Problem is `INACTIVE` or `PUBLISHED`.
2. System rejects the request.
3. No `ordinal` value is changed.
4. System returns `ERR-CONFLICT-001`.
5. UI explains that Test Cases can be reordered only while the Problem is `ACTIVE` and `DRAFT`, and offers to unpublish the Problem first.
6. Use Case ends.

**E6 – ERR-VAL-001: Invalid Test Case Order**

1. At step 10, System detects that the submitted identifier list is incomplete, contains duplicates, or contains identifiers belonging to another Problem.
2. System rejects the request without changing any `ordinal`.
3. System returns `ERR-VAL-001`.
4. UI reloads the current order and asks Administrator to try again.
5. Use Case ends.

**E7 – ERR-CONFLICT-002: Concurrent Change Conflict**

1. At step 10, System detects that the Test Case set or its ordinals changed after the list was loaded, for example because another Administrator added, deleted, or reordered a Test Case.
2. System rejects the request without changing any `ordinal`.
3. System returns `ERR-CONFLICT-002`.
4. UI reloads the latest order and asks Administrator to repeat the reordering.
5. Use Case ends.

**E8 – ERR-SYS-001: Internal System Error**

1. At step 12, System encounters an error while updating the ordinals.
2. System stops processing the request.
3. The transaction is rolled back, so no partial order is persisted.
4. System logs the error and request ID.
5. System returns `ERR-SYS-001` with a general message.
6. UI notifies that the order could not be saved.
7. Administrator can retry later.

**E9 – ERR-NET-001: Network Error**

1. During step 7 or the response to it, the network connection is interrupted or times out.
2. UI notifies that it cannot confirm whether the new order was saved and does not claim success.
3. Administrator reloads the Test Case list to check the stored order before retrying.
4. Use Case ends when the outcome is confirmed.

# 7. Assumptions

- The Problem's Test Case set does not change while the Administrator is reordering it. If it does, E7 applies.
- The UI submits the complete order, not a pair of swapped positions.
- Test Case previews are truncated for display and are not used for judging.

# 8. Special Requirements

- The ordinal update must be atomic and must preserve uniqueness per Problem.
- Reordering must not alter Test Case contents, types, or historical Submission results.
- The endpoint must verify that every submitted Test Case belongs to the specified Problem.

# 9. Open Issues

- Whether the UI uses drag-and-drop, move buttons, or both is a frontend decision and does not affect this specification.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 1.1 | 2026-11-13 | Aligned the network exception with `SpecStructure.md` v1.1 by stating the detection point, the no-success guarantee, and the end state. |
