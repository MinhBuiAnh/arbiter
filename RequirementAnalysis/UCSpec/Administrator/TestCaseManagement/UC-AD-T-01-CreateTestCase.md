# Use Case Specification

**UC-AD-T-01 - Create Test Case**

**Version:** 2.0

# 1. General Information

- Use Case ID: UC-AD-T-01
- Use Case Name: Create Test Case
- Brief Description: Allow Administrator to add a `SAMPLE` or `HIDDEN` Test Case with input data, expected output, and an execution order to a Problem that is active and still in draft.
- Primary Actor(s): Administrator
- Supporting Actor(s): None
- Trigger: Administrator selects Create Test Case while managing the Test Cases of a Problem.
- Priority: High
- Status: Draft
- Related Use Cases: UC-AD-P-01 – Create Problem, UC-AD-P-02 – Update Problem, UC-AD-P-04 – Manage Problem Publication, UC-AD-T-02 – Update Test Case, UC-AD-T-05 – Reorder Test Cases
- Related Requirements: FR-012 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- Administrator is logged in with an account that has the `admin` role.
- The Problem to receive the Test Case exists and has status `ACTIVE` and publication state `DRAFT`.
- System is available and can persist data.

# 3. Postconditions

## 3.1. Success

- A new Test Case exists with a unique Test Case ID.
- The Test Case is associated with the selected Problem.
- The Test Case has type `SAMPLE` or `HIDDEN`, the submitted input data and expected output, and a unique execution order within the Problem.
- The Test Case is persisted in a single transaction.
- The Problem's Test Case list reflects the new Test Case.
- The Problem's publication state remains `DRAFT`.

## 3.2. Failure

- No Test Case is created.
- The ordering of existing Test Cases is unchanged.
- No existing Test Case's input data, expected output, or type is changed.
- The Problem's publication state is unchanged.

# 4. Main Flow

1. Administrator opens the Problem Management page.
2. Administrator selects the Problem whose Test Cases are to be managed.
3. UI requests the Problem details from System.
4. System validates the Access Token and confirms the `admin` role.
5. System retrieves the Problem by Problem ID.
6. System confirms that the Problem exists and has status `ACTIVE` and publication state `DRAFT`.
7. System returns the Problem details.
8. Administrator selects Create Test Case.
9. UI displays the Test Case creation form.
10. Administrator enters the input data, expected output, Test Case type, and execution order.
11. Administrator submits the form.
12. UI performs basic format checks on the entered data.
13. UI sends the create request to System.
14. System validates the Access Token and confirms the `admin` role.
15. System re-checks that the Problem exists and still has status `ACTIVE` and publication state `DRAFT`.
16. System validates the input data, expected output, and Test Case type.
17. System checks that the requested execution order is not used by another Test Case in the same Problem.
18. System creates the Test Case with a unique execution order.
19. System persists the Test Case in a single transaction.
20. System returns the created Test Case data.
21. UI adds the Test Case to the Problem's Test Case list and displays a success notification.
22. Use Case ends.

# 5. Alternative Flow

**A1 – Administrator Creates a Sample Test Case**

1. At step 10, Administrator selects type `SAMPLE`.
2. UI explains that the Test Case input and expected output may be visible to Guests and Users when the Problem is published.
3. UI records the selected type in the form.
4. Use Case continues at step 11.

**A2 – Administrator Creates a Hidden Test Case**

1. At step 10, Administrator selects type `HIDDEN`.
2. UI explains that the Test Case input and expected output will never be displayed publicly.
3. UI records the selected type in the form.
4. Use Case continues at step 11.

**A3 – Administrator Creates Another Test Case**

1. At step 21, Administrator selects Create Another Test Case.
2. UI displays an empty Test Case creation form.
3. Use Case continues at step 10.

**A4 – Administrator Cancels Test Case Creation**

1. At step 9 or step 10, Administrator selects Cancel.
2. UI requests confirmation when the form contains unsaved data.
3. Administrator confirms the cancellation.
4. UI discards the entered data and returns to the Problem's Test Case list.
5. No Test Case is created.
6. Use Case ends.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing, Invalid, or Expired Access Token**

1. At step 4 or step 14, System cannot find, validate, or accept the Access Token.
2. System rejects the request.
3. No Test Case is created.
4. System logs the rejection with the request ID and without the token value.
5. System returns `ERR-AUTH-003`.
6. UI clears the stored authentication information and navigates Administrator to the login page.
7. Use Case ends.

**E2 – ERR-PERM-002: Insufficient Privileges**

1. At step 4 or step 14, System determines that the authenticated account does not have the `admin` role.
2. System rejects the request.
3. No Test Case is created.
4. System logs the rejection with the request ID and the account identifier.
5. System returns `ERR-PERM-002`.
6. UI notifies that Administrator rights are required to manage Test Cases.
7. Use Case ends.

**E3 – ERR-RES-001: Problem Not Found**

1. At step 5 or step 15, System cannot retrieve a Problem with the requested Problem ID.
2. System rejects the request.
3. No Test Case is created.
4. System logs the failure with the request ID and the Problem ID.
5. System returns `ERR-RES-001`.
6. UI notifies that the Problem no longer exists and returns Administrator to the Problem list.
7. Use Case ends.

**E4 – ERR-CONFLICT-001: Problem Is Not Editable**

1. At step 6 or step 15, System determines that the Problem has status `INACTIVE` or publication state `PUBLISHED`.
2. System refuses to create the Test Case.
3. No Test Case is created.
4. System logs the rejection with the request ID, the Problem ID, and the Problem's current state.
5. System returns `ERR-CONFLICT-001`.
6. UI explains that Test Cases can be changed only while the Problem is `ACTIVE` and `DRAFT`, and points Administrator to the relevant Problem workflow.
7. Use Case ends.

**E5 – ERR-VAL-001: Invalid Test Case Data**

1. At step 16, System detects missing, malformed, or unsupported Test Case data, such as empty input data, an unreadable expected output, or an unsupported Test Case type.
2. System rejects the request.
3. No Test Case is created.
4. System logs the validation failure with the request ID and the invalid field names, not the Test Case content.
5. System returns `ERR-VAL-001` with the invalid fields and their causes.
6. UI displays each error next to the corresponding field.
7. Administrator corrects the data and resubmits; Use Case continues at step 11.

**E6 – ERR-VAL-009: Duplicate Test Case Order**

1. At step 17, System determines that the requested execution order is already used by another Test Case in the same Problem.
2. System rejects the request.
3. No Test Case is created.
4. System logs the validation failure with the request ID, the Problem ID, and the requested order.
5. System returns `ERR-VAL-009`.
6. UI asks Administrator to choose a different execution order.
7. Administrator changes the order and resubmits; Use Case continues at step 11.

**E7 – ERR-SYS-001: Internal System Error**

1. At step 18 or step 19, System encounters an error while creating or persisting the Test Case.
2. System stops processing the request.
3. The transaction is rolled back, so no Test Case and no order value is persisted.
4. System logs the error and the request ID.
5. System returns `ERR-SYS-001` with a general message.
6. UI notifies that the Test Case could not be created and does not display a success message.
7. Administrator may retry later.

**E8 – ERR-NET-001: Network Error**

1. During step 13 or the response to it, the connection is interrupted or times out.
2. UI cannot confirm whether the Test Case was created.
3. UI notifies that the result is unknown and does not claim success.
4. Administrator reloads the Test Case list and checks for the new Test Case before retrying.
5. Use Case ends when the outcome is confirmed.

# 7. Assumptions

- A Test Case consists of one input file and one expected-output file.
- The Problem's Test Case set is small enough that the execution order is managed explicitly rather than automatically.
- Sample Test Case data may be displayed publicly through UC-COM-03 – View Problem Details when the Problem is published.
- Hidden Test Case data is never displayed publicly or through Submission views.

# 8. Special Requirements

- Only accounts with the `admin` role may create Test Cases; the backend enforces the role.
- Test Case creation is allowed only while the Problem is `ACTIVE` and `DRAFT`.
- The execution order must be unique within the Problem.
- Test Case contents must not be written to logs or error responses.
- The create operation and order assignment are atomic.

# 9. Open Issues

- Whether the execution order should be assigned automatically when Administrator does not supply one will be confirmed in the SRS.
- The maximum number of Test Cases per Problem is not yet defined.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 2.0 | 2026-11-13 | Rewritten to `SpecStructure.md` v1.1: added metadata, split postconditions, converted type-selection notes into alternative flows, assigned `ERR-VAL-009` for duplicate order values, split the shared `ERR-RES-002` conflict code, and corrected the malformed main-flow step. |
