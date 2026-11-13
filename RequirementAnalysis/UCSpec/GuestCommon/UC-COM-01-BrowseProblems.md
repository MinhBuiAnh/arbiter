# Use Case Specification

**UC-COM-01 - Browse Problems**

**Version:** 1.1

# 1. General Information

- Use Case ID: UC-COM-01
- Use Case Name: Browse Problems
- Brief Description: Allow Guest to browse the list of public problems, inspect preview information, and move between result pages.
- Primary Actor(s): Guest, User (through public behavior inheritance)
- Supporting Actor(s): None
- Trigger: Guest opens the problem list page.
- Priority: High
- Status: Draft
- Related Use Cases: UC-COM-02 – Search Problems, UC-COM-03 – View Problem Details
- Related Requirements: FR-007 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- System is available and can serve read requests.
- Guest can access the system.
- No login is required.

# 3. Postconditions

## 3.1. Success

- The requested page of public problems is displayed to Guest.
- No platform data is modified.

## 3.2. Failure

- No partial or misleading problem list is displayed as if it were complete.
- No platform data is modified.
- Guest receives an error notification or an empty state with a clear explanation.

# 4. Main Flow

1. Guest accesses the problem list page.
2. UI requests the first page of the public problem list with pagination and sorting parameters.
3. System validates the pagination and sorting parameters.
4. System selects problems that are `ACTIVE` and `PUBLISHED`.
5. System retrieves the preview information for each problem, including:
   - Problem title.
   - Difficulty.
   - Categories or tags.
   - Other preview information, if any.
6. System returns the requested page with pagination metadata.
7. UI displays the problem list to Guest.
8. Guest can select a problem to move to UC-COM-03 – View Problem Details.
9. Use Case ends.

# 5. Alternative Flow

**A1 – No Problems Available**

1. At step 4, System finds no public problems.
2. System returns an empty page.
3. UI displays an empty state explaining that no public problem is available.
4. Use Case ends.

**A2 – Navigate Between Pages**

1. At step 7, Guest selects the previous or next page.
2. UI sends the new pagination parameters.
3. System validates the parameters and returns the corresponding page.
4. UI updates the problem list.
5. Use Case continues at step 7 of the Main Flow.

**A3 – Change Sorting Order**

1. At step 7, Guest selects a supported sorting criterion, such as problem title or difficulty.
2. UI sends the new sorting parameters.
3. System validates the parameters and returns the reordered page.
4. UI updates the problem list.
5. Use Case continues at step 7 of the Main Flow.

**A4 – Open Problem Details**

1. At step 8, Guest selects a problem.
2. UI navigates to UC-COM-03 – View Problem Details with the selected Problem ID.
3. Use Case ends.

# 6. Exception Flow

**E1 – ERR-VAL-005: Invalid Pagination Parameters**

1. At step 3, System detects that the page or page size is invalid, such as a non-numeric value, zero, a negative number, or a value above the configured maximum.
2. System rejects the request.
3. No problem data is read.
4. System logs the error with the request ID.
5. System returns `ERR-VAL-005` with the invalid fields.
6. UI resets to the first page using the default page size and reissues the request.
7. Use Case continues at step 3.

**E2 – ERR-VAL-006: Invalid Sorting Parameter**

1. At step 3, System detects that the requested sorting criterion is unsupported or malformed.
2. System rejects the request.
3. No problem data is read.
4. System logs the error with the request ID.
5. System returns `ERR-VAL-006` with the invalid field.
6. UI falls back to the default sorting criterion and reissues the request.
7. Use Case continues at step 3.

**E3 – ERR-SYS-001: Internal System Error**

1. At steps 3–6, System encounters an unexpected error while validating the request or querying the problem list.
2. System stops processing the request.
3. System does not return a partial list as complete.
4. System logs the error with the request ID.
5. System returns `ERR-SYS-001` with a general error message.
6. UI notifies that the problem list cannot be loaded.
7. Guest can retry later.
8. Use Case ends.

**E4 – ERR-NET-001: Network Error**

1. During the request or response, the network connection is interrupted or times out.
2. UI cannot confirm whether the request reached System.
3. UI notifies that it cannot connect to the system.
4. Guest can retry when the network is restored.
5. Use Case ends if continuing is impossible.

**E5 – ERR-LIMIT-001: Rate Limit Exceeded**

1. System detects that Guest sent too many requests within a short period.
2. System rejects the current request.
3. System returns `ERR-LIMIT-001` with the retry time if available.
4. UI asks Guest to wait before trying again.
5. Use Case ends.

# 7. Assumptions

- Only problems that are `ACTIVE` and `PUBLISHED` appear in the list.
- An empty problem list is a valid result.
- The page size has a configured maximum.
- At least problem title and difficulty sorting are supported.

# 8. Special Requirements

- Ordering must be deterministic so that pagination does not duplicate or skip problems.
- The response must not expose private problem data or administrator-only fields.
- The endpoint must serve the configured page size without loading every problem into memory.

# 9. Open Issues

- None for v1.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 1.1 | 2026-11-13 | Aligned with `SpecStructure.md` v1.1: added metadata, split postconditions, clarified flow branches, and assigned distinct validation error codes. |
