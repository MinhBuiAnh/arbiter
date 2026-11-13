# Use Case Specification

**UC-COM-03 - View Problem Details**

**Version:** 1.1

# 1. General Information

- Use Case ID: UC-COM-03
- Use Case Name: View Problem Details
- Brief Description: Allow Guest to view a public problem's statement, input/output specification, constraints, sample test cases, and public statistics.
- Primary Actor(s): Guest, User (through public behavior inheritance)
- Supporting Actor(s): None
- Trigger: Guest selects a problem from a problem list or search result.
- Priority: High
- Status: Draft
- Related Use Cases: UC-COM-01 – Browse Problems, UC-COM-02 – Search Problems
- Related Requirements: FR-009 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- System is available and can serve read requests.
- Guest can access the system.
- No login is required.

# 3. Postconditions

## 3.1. Success

- The detailed information of the requested public problem is displayed.
- Only sample test cases and public statistics are shown.
- No platform data is modified.

## 3.2. Failure

- No problem details are displayed as if the request succeeded.
- Hidden test cases and private data are not exposed.
- No platform data is modified.

# 4. Main Flow

1. Guest accesses the problem list or a search result.
2. Guest selects a problem.
3. UI requests the problem details with the selected Problem ID.
4. System validates the format of the Problem ID.
5. System retrieves the problem.
6. System checks that the problem is `ACTIVE` and `PUBLISHED`.
7. System retrieves the detailed information, including:
   - Problem title.
   - Problem statement.
   - Input specification.
   - Output specification.
   - Constraints.
   - Sample test cases.
   - Difficulty and tags.
   - Time limit and memory limit.
   - Supported programming languages (C++17 and Python 3).
   - Public problem statistics: total submissions, accepted submissions, and acceptance rate.
8. System returns the problem details.
9. UI displays the problem details to Guest.
10. Use Case ends.

# 5. Alternative Flow

**A1 – Navigate Back to Problem List**

1. After step 9, Guest goes back to the problem list.
2. UI navigates back to the problem list page.
3. Use Case ends.

**A2 – Navigate to Another Problem**

1. After step 9, Guest selects another problem from the problem list or search result.
2. Use Case continues at step 3 with the new Problem ID.

# 6. Exception Flow

**E1 – ERR-VAL-007: Invalid Problem ID**

1. At step 4, System detects that the Problem ID is missing or malformed.
2. System rejects the request.
3. No problem data is read.
4. System logs the error with the request ID.
5. System returns `ERR-VAL-007` with the invalid field.
6. UI notifies that the problem identifier is invalid.
7. Guest can return to the problem list.
8. Use Case ends.

**E2 – ERR-RES-001: Problem Not Found**

1. At step 5, System cannot find a problem corresponding to the Problem ID.
2. System rejects the request.
3. No problem details are returned.
4. System logs the error with the request ID.
5. System returns `ERR-RES-001` with a not-found message.
6. UI notifies that the problem does not exist or is no longer available.
7. Guest can return to the problem list.
8. Use Case ends.

**E3 – ERR-PERM-001: Problem Not Publicly Accessible**

1. At step 6, System detects that the problem is not `ACTIVE` and `PUBLISHED`.
2. System rejects the request.
3. No problem details are returned.
4. System logs the error with the request ID.
5. System returns `ERR-PERM-001` with a generic not-available message.
6. UI notifies that the problem does not exist or is not available.
7. Guest can return to the problem list.
8. Use Case ends.

**E4 – ERR-SYS-001: Internal System Error**

1. At steps 4–8, System encounters an unexpected error while validating or retrieving the problem details.
2. System stops processing the request.
3. System does not return partial details as complete.
4. System logs the error with the request ID.
5. System returns `ERR-SYS-001` with a general error message.
6. UI notifies that the problem cannot be loaded.
7. Guest can retry later.
8. Use Case ends.

**E5 – ERR-NET-001: Network Error**

1. During the request or response, the network connection is interrupted or times out.
2. UI cannot confirm whether the request reached System.
3. UI notifies that the problem cannot be loaded.
4. Guest can retry when the network is restored.
5. Use Case ends if continuing is impossible.

**E6 – ERR-LIMIT-001: Rate Limit Exceeded**

1. System detects that Guest sent too many requests within a short period.
2. System rejects the current request.
3. System returns `ERR-LIMIT-001` with the retry time if available.
4. UI asks Guest to wait before trying again.
5. Use Case ends.

# 7. Assumptions

- Only problems that are `ACTIVE` and `PUBLISHED` are publicly accessible.
- Hidden test cases are never returned by this use case.
- A published problem has at least one sample test case.
- Public statistics may be zero.

# 8. Special Requirements

- Hidden inputs, expected outputs, and administrator-only fields must never be exposed.
- The response must not expose private account data.
- The displayed details must be consistent with the problem's current public state.
- The endpoint must remain responsive for the configured maximum problem size.

# 9. Open Issues

- None for v1.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 1.1 | 2026-11-13 | Aligned with `SpecStructure.md` v1.1: added metadata, split postconditions, moved existence and visibility checks into the main flow, and assigned a distinct validation error code. |
