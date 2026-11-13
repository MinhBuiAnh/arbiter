# Use Case Specification

**UC-AD-P-03 - Delete / Deactivate Problem**

**Version:** 2.0

# 1. General Information

- Use Case ID: UC-AD-P-03
- Use Case Name: Delete / Deactivate Problem
- Brief Description: Allow Administrator to deactivate a Problem that is no longer in use, or reactivate a previously deactivated Problem. Deactivation is a soft delete that preserves the Problem, its Test Cases, and its historical Submission data.
- Primary Actor(s): Administrator
- Supporting Actor(s): None
- Trigger: Administrator selects Deactivate on an active Problem, or Activate on an inactive Problem.
- Priority: High
- Status: Draft
- Related Use Cases: UC-AD-P-01 – Create Problem, UC-AD-P-02 – Update Problem, UC-AD-P-04 – Manage Problem Publication, UC-AD-T-01 – Create Test Case
- Related Requirements: FR-010 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- Administrator is logged in with an account that has the `admin` role.
- The Problem to be deactivated or reactivated exists.
- System is available and can persist data.

# 3. Postconditions

## 3.1. Success

For a successful deactivation:

- The Problem has status `INACTIVE`.
- The Problem has publication state `DRAFT`.
- The Problem no longer appears in public Problem listings.
- Users cannot create new Submissions for the Problem.
- Existing Submissions, Test Cases, and grading results are preserved.
- The Problem is not physically deleted from the database.

For a successful reactivation:

- The Problem has status `ACTIVE`.
- The Problem has publication state `DRAFT`.
- The Problem remains absent from public Problem listings until it is published through UC-AD-P-04 – Manage Problem Publication.
- Existing Submissions, Test Cases, and grading results are preserved.

## 3.2. Failure

- The Problem's status and publication state are unchanged.
- The Problem remains visible or hidden exactly as it was before the request.
- Existing Submissions, Test Cases, and grading results are unchanged.

# 4. Main Flow

1. Administrator opens the Problem Management page.
2. Administrator selects an `ACTIVE` Problem.
3. UI requests the Problem details from System.
4. System validates the Access Token and confirms the `admin` role.
5. System retrieves the Problem by Problem ID.
6. System confirms that the Problem exists and has status `ACTIVE`.
7. System returns the Problem details, current status, and version identifier.
8. UI displays the Problem details and the Deactivate action.
9. Administrator selects Deactivate.
10. UI displays a confirmation dialog that states that Submissions will be preserved.
11. Administrator confirms the deactivation.
12. UI sends the deactivation request with the version identifier that was loaded.
13. System validates the Access Token and confirms the `admin` role.
14. System retrieves the Problem and confirms that it still exists and has status `ACTIVE`.
15. System confirms that the submitted version identifier matches the stored version.
16. System sets the Problem to status `INACTIVE` and publication state `DRAFT` in a single transaction.
17. System records the status change timestamp.
18. System returns the updated Problem state.
19. UI displays a success notification and removes the Problem from the active Problem list.
20. Use Case ends.

# 5. Alternative Flow

**A1 – Administrator Cancels Deactivation**

1. At step 10, Administrator selects Cancel.
2. UI closes the confirmation dialog.
3. No data is changed.
4. Use Case ends.

**A2 – Problem Is Already Inactive**

1. At step 6, System determines that the Problem has status `INACTIVE`.
2. System returns the current status without changing it.
3. UI notifies that the Problem is already deactivated and offers the Activate action instead.
4. No data is changed.
5. Use Case ends.

**A3 – Administrator Reactivates the Problem**

1. At step 2, Administrator selects a Problem with status `INACTIVE` instead of an active one.
2. UI requests the Problem details from System.
3. System validates the Access Token, the `admin` role, the Problem's existence, and its `INACTIVE` status.
4. System returns the Problem details, its version identifier, and the Activate action.
5. UI displays the Problem details and the Activate action.
6. Administrator selects Activate.
7. UI displays a confirmation dialog.
8. Administrator confirms the reactivation.
9. UI sends the reactivation request with the version identifier that was loaded.
10. System re-checks the Problem's existence and `INACTIVE` status and confirms the version identifier.
11. System sets the Problem to status `ACTIVE` and publication state `DRAFT` in a single transaction.
12. System returns the updated Problem state.
13. UI notifies that the Problem was reactivated and that it is still not public.
14. Use Case ends.

**A4 – Problem Has Existing Submissions**

1. At step 14, System determines that the Problem has Submissions referencing it.
2. System still allows the deactivation.
3. System preserves all Submissions and grading results.
4. Use Case continues at step 15.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing, Invalid, or Expired Access Token**

1. At step 4 or step 13, System cannot find, validate, or accept the Access Token.
2. System rejects the request.
3. The Problem's status and publication state are unchanged.
4. System logs the rejection with the request ID and without the token value.
5. System returns `ERR-AUTH-003`.
6. UI clears the stored authentication information and navigates Administrator to the login page.
7. Use Case ends.

**E2 – ERR-PERM-002: Insufficient Privileges**

1. At step 4 or step 13, System determines that the authenticated account does not have the `admin` role.
2. System rejects the request.
3. The Problem's status and publication state are unchanged.
4. System logs the rejection with the request ID and the account identifier.
5. System returns `ERR-PERM-002`.
6. UI notifies that Administrator rights are required to change a Problem's status.
7. Use Case ends.

**E3 – ERR-RES-001: Problem Not Found**

1. At step 5 or step 14, System cannot retrieve a Problem with the requested Problem ID.
2. System rejects the request.
3. No Problem is changed.
4. System logs the failure with the request ID and the Problem ID.
5. System returns `ERR-RES-001`.
6. UI notifies that the Problem no longer exists and returns Administrator to the Problem list.
7. Use Case ends.

**E4 – ERR-CONFLICT-005: Concurrent Problem State Change**

1. At step 14 or step 15, System detects that the Problem's status or version identifier changed after the details were loaded, for example because another Administrator deactivated or reactivated it.
2. System rejects the request.
3. The Problem's current status and publication state are preserved; no deactivation or reactivation is applied.
4. System logs the conflict with the request ID, the Problem ID, and both version identifiers.
5. System returns `ERR-CONFLICT-005`.
6. UI notifies that the Problem changed and reloads the latest status before offering the action again.
7. Use Case ends.

**E5 – ERR-SYS-001: Internal System Error**

1. At step 16 or step 17, System encounters an error while changing or persisting the Problem state.
2. System stops processing the request.
3. The transaction is rolled back, so the status, publication state, and timestamp are unchanged.
4. System logs the error and the request ID.
5. System returns `ERR-SYS-001` with a general message.
6. UI notifies that the Problem status could not be changed and does not display a success message.
7. Administrator may retry later.

**E6 – ERR-NET-001: Network Error**

1. During step 12 or the response to it, the connection is interrupted or times out.
2. UI cannot confirm whether the deactivation or reactivation was applied.
3. UI notifies that the result is unknown and does not claim success.
4. Administrator reloads the Problem details and checks its current status before retrying.
5. Use Case ends when the outcome is confirmed.

# 7. Assumptions

- Deactivation is reversible; reactivation never makes a Problem public automatically.
- Historical Submissions remain readable after deactivation, subject to access rules.
- The system warns Administrators when a Problem has queued or running Submissions, but does not block deactivation in v1.
- A deactivated Problem keeps its Test Cases and can be reactivated with those Test Cases intact.

# 8. Special Requirements

- Only accounts with the `admin` role may deactivate or reactivate Problems; the backend enforces the role.
- The status change and publication-state reset are atomic.
- Deactivation is a soft delete; no physical delete of the Problem or its related data is permitted.
- The status change uses optimistic concurrency control to prevent lost updates between Administrators.
- Deactivation must prevent new Submissions but must not alter the results of existing Submissions.

# 9. Open Issues

- Whether deactivation should be blocked, warned, or allowed when Submissions are queued or running is settled for v1 as a warning; the final warning behavior will be confirmed in the SRS.
- The catalog names this use case `Delete / Deactivate Problem`, while the specification file is named `UC-AD-P-03-DeleteProblem.md`; the file name is retained to keep existing links stable.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 2.0 | 2026-11-13 | Rewritten to `SpecStructure.md` v1.1: added metadata, split deactivation and reactivation postconditions, moved state-conflict handling to a distinct `ERR-CONFLICT` code, replaced the inline cancelled flow with proper alternatives, and named responsible parties in every step. |
