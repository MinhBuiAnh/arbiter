# Use Case Specification

**UC-AD-P-04 - Manage Problem Publication**

**Version:** 2.0

# 1. General Information

- Use Case ID: UC-AD-P-04
- Use Case Name: Manage Problem Publication
- Brief Description: Allow Administrator to publish an active, ready Problem so that Guests and Users can view and solve it, or unpublish a published Problem so that it is no longer publicly available while its data and Submission history are retained.
- Primary Actor(s): Administrator
- Supporting Actor(s): None
- Trigger: Administrator selects Publish or Unpublish for a Problem.
- Priority: Medium
- Status: Draft
- Related Use Cases: UC-AD-P-01 – Create Problem, UC-AD-P-02 – Update Problem, UC-AD-P-03 – Delete / Deactivate Problem, UC-AD-T-01 – Create Test Case, UC-AD-T-04 – Manage Test Case Type, UC-COM-01 – Browse Problems, UC-COM-03 – View Problem Details
- Related Requirements: FR-010 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- Administrator is logged in with an account that has the `admin` role.
- The Problem whose publication state is being changed exists.
- Administrator has loaded a current version of the Problem.
- System is available and can persist data.

# 3. Postconditions

## 3.1. Success

For a successful publication:

- The Problem has publication state `PUBLISHED`.
- The Problem keeps status `ACTIVE`.
- The Problem appears in public Problem listings.
- Guests and Users can open the Problem and create Submissions when the other submission conditions are met.
- The Problem's sample Test Cases may be displayed publicly.

For a successful unpublication:

- The Problem has publication state `DRAFT`.
- The Problem keeps status `ACTIVE`.
- The Problem no longer appears in public Problem listings.
- Guests and Users cannot open the Problem or create new Submissions for it.
- Existing Submissions and grading results are unchanged.

## 3.2. Failure

- The Problem's publication state is unchanged.
- The Problem remains visible or hidden exactly as it was before the request.
- The Problem's Test Cases and historical Submissions are unchanged.

# 4. Main Flow

1. Administrator opens the Problem Management page.
2. Administrator selects the Problem to publish.
3. UI requests the Problem details from System.
4. System validates the Access Token and confirms the `admin` role.
5. System retrieves the Problem by Problem ID.
6. System confirms that the Problem exists.
7. System returns the Problem details, current publication state, and version identifier.
8. UI displays the Problem details, its current publication state, and the available action.
9. Administrator selects Publish.
10. UI displays a confirmation message that publishing makes the Problem publicly available.
11. Administrator confirms the publication.
12. UI sends the publication request with the version identifier that was loaded.
13. System validates the Access Token and confirms the `admin` role.
14. System retrieves the Problem and confirms that it still exists and has status `ACTIVE`.
15. System confirms that the submitted version identifier matches the stored version.
16. System checks the publication requirements:
    - The title and statement are non-empty.
    - The time limit and memory limit are positive.
    - At least one `SAMPLE` Test Case exists.
    - At least one `HIDDEN` Test Case exists.
    - Every Test Case has readable input data and expected output.
17. System sets the Problem to publication state `PUBLISHED` in a single transaction.
18. System records the publication timestamp.
19. System returns the new publication state.
20. UI displays a success notification and confirms that the Problem is now public.
21. Use Case ends.

# 5. Alternative Flow

**A1 – Administrator Unpublishes the Problem**

1. At step 8, Administrator selects Unpublish for a Problem with publication state `PUBLISHED`.
2. UI displays a confirmation dialog that states that the Problem will no longer be publicly available.
3. Administrator confirms the unpublication.
4. UI sends the unpublication request with the version identifier that was loaded.
5. System validates the Access Token, the `admin` role, the Problem's existence, and its `PUBLISHED` state.
6. System sets the Problem to publication state `DRAFT` in a single transaction.
7. System returns the new publication state.
8. UI notifies that the Problem is no longer public.
9. Use Case ends.

**A2 – Problem Is Already Published**

1. At step 7, System determines that the Problem has publication state `PUBLISHED`.
2. System returns the current state without changing it.
3. UI notifies that the Problem is already published.
4. No update is performed.
5. Use Case ends.

**A3 – Problem Is Already Unpublished**

1. At step 8, Administrator requests Unpublish for a Problem with publication state `DRAFT`.
2. System determines that the Problem is already unpublished and returns the current state.
3. UI notifies that the Problem is not published.
4. No update is performed.
5. Use Case ends.

**A4 – Administrator Cancels the Publication Change**

1. At step 10, Administrator selects Cancel.
2. UI closes the confirmation dialog.
3. No change is made to the Problem's publication state.
4. Use Case ends.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing, Invalid, or Expired Access Token**

1. At step 4 or step 13, System cannot find, validate, or accept the Access Token.
2. System rejects the request.
3. The Problem's publication state is unchanged.
4. System logs the rejection with the request ID and without the token value.
5. System returns `ERR-AUTH-003`.
6. UI clears the stored authentication information and navigates Administrator to the login page.
7. Use Case ends.

**E2 – ERR-PERM-002: Insufficient Privileges**

1. At step 4 or step 13, System determines that the authenticated account does not have the `admin` role.
2. System rejects the request.
3. The Problem's publication state is unchanged.
4. System logs the rejection with the request ID and the account identifier.
5. System returns `ERR-PERM-002`.
6. UI notifies that Administrator rights are required to change the publication state.
7. Use Case ends.

**E3 – ERR-RES-001: Problem Not Found**

1. At step 5 or step 14, System cannot retrieve a Problem with the requested Problem ID.
2. System rejects the request.
3. No Problem is changed.
4. System logs the failure with the request ID and the Problem ID.
5. System returns `ERR-RES-001`.
6. UI notifies that the Problem no longer exists and returns Administrator to the Problem list.
7. Use Case ends.

**E4 – ERR-CONFLICT-003: Problem Is Inactive**

1. At step 14, System determines that the Problem has status `INACTIVE`.
2. System rejects the publication change.
3. The Problem's publication state is unchanged.
4. System logs the rejection with the request ID and the Problem ID.
5. System returns `ERR-CONFLICT-003`.
6. UI notifies that an inactive Problem cannot be published and points Administrator to UC-AD-P-03 – Delete / Deactivate Problem to reactivate it.
7. Use Case ends.

**E5 – ERR-VAL-008: Problem Does Not Meet Publication Requirements**

1. At step 16, System detects one or more unmet publication requirements, such as an empty statement, a non-positive time or memory limit, a missing `SAMPLE` Test Case, a missing `HIDDEN` Test Case, or unreadable Test Case data.
2. System refuses to publish the Problem.
3. The Problem's publication state remains `DRAFT`, and no Test Case data is changed.
4. System logs the unmet requirements with the request ID and the Problem ID.
5. System returns `ERR-VAL-008` with the list of unmet requirements.
6. UI displays the requirements that must be resolved and links to the relevant Problem or Test Case management functions.
7. Administrator resolves the issues and retries publication; Use Case continues at step 9.

**E6 – ERR-CONFLICT-006: Concurrent Publication State Change**

1. At step 15, System detects that the Problem's publication state or version identifier changed after the details were loaded, for example because another Administrator published or unpublished it.
2. System rejects the request.
3. The Problem's current publication state is preserved; no publication change is applied.
4. System logs the conflict with the request ID, the Problem ID, and both version identifiers.
5. System returns `ERR-CONFLICT-006`.
6. UI notifies that the Problem changed and reloads its latest state before offering the action again.
7. Use Case ends.

**E7 – ERR-SYS-001: Internal System Error**

1. At step 17 or step 18, System encounters an error while changing or persisting the publication state.
2. System stops processing the request.
3. The transaction is rolled back, so the publication state and timestamp are unchanged.
4. System logs the error and the request ID.
5. System returns `ERR-SYS-001` with a general message.
6. UI notifies that the publication state could not be changed and does not display a success message.
7. Administrator may retry later.

**E8 – ERR-NET-001: Network Error**

1. During step 12 or the response to it, the connection is interrupted or times out.
2. UI cannot confirm whether the publication state changed.
3. UI notifies that the result is unknown and does not claim success.
4. Administrator reloads the Problem details and checks the current publication state before retrying.
5. Use Case ends when the outcome is confirmed.

# 7. Assumptions

- A Problem may be published only when it has status `ACTIVE`.
- Publication requires at least one sample and one hidden Test Case, as stated in the v1 lifecycle rules.
- Unpublishing a Problem with queued or running Submissions produces a warning but is not blocked in v1.
- Unpublishing does not remove the Problem from Users' solved statistics; only deactivation does.

# 8. Special Requirements

- Only accounts with the `admin` role may publish or unpublish Problems; the backend enforces the role.
- The publication-state change and timestamp update are atomic.
- The publication check and the state change must be performed consistently so that a Problem cannot be published when its Test Case set is incomplete.
- The publication state change uses optimistic concurrency control to prevent lost updates between Administrators.
- Hidden Test Case data must never be exposed by the public listing or Problem details.

# 9. Open Issues

- The exact warning behavior for unpublishing a Problem with queued or running Submissions will be confirmed in the SRS.
- Whether the publication check should also require a minimum number of Test Cases beyond one sample and one hidden case is undecided.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 2.0 | 2026-11-13 | Rewritten to `SpecStructure.md` v1.1: added metadata, split publication and unpublication postconditions, separated no-op alternatives from error flows, assigned `ERR-VAL-008` to unmet publication requirements, split the shared `ERR-RES-002` conflict code, and named responsible parties in every step. |
