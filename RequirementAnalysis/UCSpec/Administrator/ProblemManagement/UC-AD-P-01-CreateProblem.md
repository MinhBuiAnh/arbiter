# Use Case Specification

**UC-AD-P-01 - Create Problem**

**Version:** 2.0

# 1. General Information

- Use Case ID: UC-AD-P-01
- Use Case Name: Create Problem
- Brief Description: Allow Administrator to create a Problem with a title, statement, input/output format, constraints, execution limits, and classification so that it can be prepared with Test Cases and later published.
- Primary Actor(s): Administrator
- Supporting Actor(s): None
- Trigger: Administrator selects Create Problem on the Problem Management page.
- Priority: High
- Status: Draft
- Related Use Cases: UC-AD-P-02 – Update Problem, UC-AD-P-04 – Manage Problem Publication, UC-AD-T-01 – Create Test Case
- Related Requirements: FR-010, FR-011 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- Administrator is logged in with an account that has the `admin` role.
- System is available and can persist data.

# 3. Postconditions

## 3.1. Success

- A new Problem exists with a unique Problem ID.
- The Problem has status `ACTIVE` and publication state `DRAFT`.
- The Problem does not appear in public Problem listings.
- The Problem's title, statement, input/output format, constraints, time limit, memory limit, and classification are stored as submitted.
- Administrator can continue editing the Problem or add Test Cases.

## 3.2. Failure

- No Problem is created.
- No partial Problem record is persisted.
- The publication state of any other Problem is unchanged.
- The submitted Problem content is not retained by System beyond the failed request.

# 4. Main Flow

1. Administrator opens the Problem Management page.
2. Administrator selects Create Problem.
3. UI displays the create Problem form.
4. Administrator enters the Problem title, statement, input format, output format, constraints, time limit, memory limit, and classification information.
5. Administrator submits the form.
6. UI performs basic format checks on the entered values.
7. UI sends the create request to System.
8. System validates the Access Token and confirms the `admin` role.
9. System validates the submitted fields and execution limits.
10. System checks the Problem against the business rules, including a non-empty title and statement, a positive time limit, and a positive memory limit.
11. System creates the Problem with status `ACTIVE` and publication state `DRAFT`.
12. System persists the Problem in a single transaction.
13. System returns the Problem ID and the stored Problem data.
14. UI displays a success notification with a link to the new Problem.
15. Use Case ends.

# 5. Alternative Flow

**A1 – Administrator Cancels Problem Creation**

1. At step 3 or step 4, Administrator selects Cancel.
2. UI requests confirmation when the form contains unsaved data.
3. Administrator confirms the cancellation.
4. UI discards the entered data and returns to the Problem Management page.
5. No Problem is created.
6. Use Case ends.

**A2 – Administrator Continues to Test Case Management**

1. At step 14, Administrator selects Manage Test Cases for the new Problem.
2. UI opens the Test Case management view for the Problem.
3. Administrator continues with UC-AD-T-01 – Create Test Case.
4. Use Case ends.

**A3 – Administrator Creates Another Problem**

1. At step 14, Administrator selects Create Another Problem.
2. UI displays an empty create Problem form.
3. Use Case continues at step 4.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing, Invalid, or Expired Access Token**

1. At step 8, System cannot find, validate, or accept the Access Token.
2. System rejects the request.
3. No Problem is created.
4. System logs the rejection with the request ID and without the token value.
5. System returns `ERR-AUTH-003`.
6. UI clears the stored authentication information and navigates Administrator to the login page.
7. Use Case ends.

**E2 – ERR-PERM-002: Insufficient Privileges**

1. At step 8, System determines that the authenticated account does not have the `admin` role.
2. System rejects the request.
3. No Problem is created.
4. System logs the rejection with the request ID and the account identifier.
5. System returns `ERR-PERM-002`.
6. UI notifies that Administrator rights are required to create a Problem.
7. Use Case ends.

**E3 – ERR-VAL-001: Invalid Problem Data**

1. At step 9 or step 10, System detects missing, malformed, or out-of-range data, such as an empty title or statement, a non-positive time limit, or a non-positive memory limit.
2. System rejects the request.
3. No Problem is created.
4. System logs the validation failure with the request ID and the invalid field names, not the full Problem content.
5. System returns `ERR-VAL-001` with the invalid fields and their causes.
6. UI displays each error next to the corresponding field.
7. Administrator corrects the data and resubmits; Use Case continues at step 5.

**E4 – ERR-SYS-001: Internal System Error**

1. At step 11 or step 12, System encounters an error while creating or persisting the Problem.
2. System stops processing the request.
3. The transaction is rolled back, so no Problem record or partial data is persisted.
4. System logs the error and the request ID.
5. System returns `ERR-SYS-001` with a general message.
6. UI notifies that the Problem could not be created and does not display a success message.
7. Administrator may retry later.

**E5 – ERR-NET-001: Network Error**

1. During step 7 or the response to it, the connection is interrupted or times out.
2. UI cannot confirm whether the Problem was created.
3. UI notifies that the result is unknown and does not claim success.
4. Administrator reloads the Problem list and checks for a newly created Problem before retrying.
5. Use Case ends when the outcome is confirmed.

# 7. Assumptions

- Problem titles need not be unique in v1.
- Classification values, such as difficulty and tags, are defined by the SRS and are optional at creation.
- Test Cases are managed separately through UC-AD-T-01 – Create Test Case and its related use cases.

# 8. Special Requirements

- Only accounts with the `admin` role may create Problems; the backend enforces the role, not only the UI.
- The create operation is atomic; a failure must not leave a partial Problem record.
- The client must not treat a failed network request as a confirmed failure; it must verify the Problem list before retrying.
- Problem content is stored as entered; no Test Case data is exposed by this use case.

# 9. Open Issues

- The exact required fields and supported classification values will be confirmed in the SRS.
- Whether Problem creation should accept a client-supplied idempotency key is undecided.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 2.0 | 2026-11-13 | Rewritten to `SpecStructure.md` v1.1: added metadata, split success and failure postconditions, separated valid alternatives from error flows, assigned distinct error codes, and replaced implementation-specific storage terms with logical ones. |
