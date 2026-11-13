# Use Case Specification

**UC-COM-02 - Search Problems**

**Version:** 1.1

# 1. General Information

- Use Case ID: UC-COM-02
- Use Case Name: Search Problems
- Brief Description: Allow Guest to search for public problems by keywords and supported filter criteria.
- Primary Actor(s): Guest, User (through public behavior inheritance)
- Supporting Actor(s): None
- Trigger: Guest submits a search request from the problem list page.
- Priority: High
- Status: Draft
- Related Use Cases: UC-COM-01 – Browse Problems, UC-COM-03 – View Problem Details
- Related Requirements: FR-008 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- System is available and can serve read requests.
- Guest can access the search feature.
- No login is required.

# 3. Postconditions

## 3.1. Success

- A page of public problems matching the keywords and filters is displayed.
- No platform data is modified.

## 3.2. Failure

- No partial or misleading search result is displayed as if it were complete.
- No platform data is modified.
- Guest receives an error notification or an empty state with a clear explanation.

# 4. Main Flow

1. Guest accesses the problem search feature.
2. Guest provides the search keywords.
3. Guest can select additional supported filters, such as:
   - Difficulty.
   - Categories.
   - Tags.
4. Guest submits the search request.
5. System validates the keywords, filters, pagination, and sorting parameters.
6. System queries problems that are `ACTIVE` and `PUBLISHED` and match the keywords and filters.
7. System returns the requested page with pagination metadata.
8. UI displays the search result to Guest.
9. Guest can select a problem to move to UC-COM-03 – View Problem Details.
10. Use Case ends.

# 5. Alternative Flow

**A1 – No Search Results**

1. At step 6, System finds no problem relevant to the keywords and filters.
2. System returns an empty page.
3. UI displays an empty state explaining that no relevant problem was found.
4. Guest can change the keywords or filters and search again.
5. Use Case continues at step 2.

**A2 – Search Without Filters**

1. At step 3, Guest does not select any filters.
2. System uses only the keywords for searching.
3. Use Case continues at step 4 of the Main Flow.

**A3 – Search With Filters Only**

1. At step 2, Guest does not enter any keywords and selects one or more filters.
2. System performs the search based on the selected filters.
3. Use Case continues at step 4 of the Main Flow.

**A4 – Open Problem Details**

1. At step 9, Guest selects a problem from the search result.
2. UI navigates to UC-COM-03 – View Problem Details with the selected Problem ID.
3. Use Case ends.

# 6. Exception Flow

**E1 – ERR-VAL-004: Invalid Search Parameters**

1. At step 5, System detects that the search parameters are invalid, such as an unsupported filter or a malformed keyword.
2. System rejects the search request.
3. No problem data is read.
4. System logs the error with the request ID.
5. System returns `ERR-VAL-004` with the invalid fields.
6. UI displays the errors and asks Guest to change the data.
7. Guest edits the search parameters and resubmits the search request.
8. Use Case continues at step 5.

**E2 – ERR-VAL-006: Invalid Sorting Parameter**

1. At step 5, System detects that the requested sorting criterion is unsupported or malformed.
2. System rejects the search request.
3. No problem data is read.
4. System logs the error with the request ID.
5. System returns `ERR-VAL-006` with the invalid field.
6. UI falls back to the default sorting criterion and reissues the search request.
7. Use Case continues at step 5.

**E3 – ERR-VAL-005: Invalid Pagination Parameters**

1. At step 5, System detects that the page or page size is invalid, such as a non-numeric value, zero, a negative number, or a value above the configured maximum.
2. System rejects the search request.
3. No problem data is read.
4. System logs the error with the request ID.
5. System returns `ERR-VAL-005` with the invalid fields.
6. UI resets to the first page using the default page size and reissues the search request.
7. Use Case continues at step 5.

**E4 – ERR-SYS-001: Internal System Error**

1. At steps 5–7, System encounters an unexpected error while validating or processing the search.
2. System stops processing the request.
3. System does not return a partial result as complete.
4. System logs the error with the request ID.
5. System returns `ERR-SYS-001` with a general error message.
6. UI notifies that the search cannot be performed.
7. Guest can retry later.
8. Use Case ends.

**E5 – ERR-NET-001: Network Error**

1. During the request or response, the network connection is interrupted or times out.
2. UI cannot confirm whether the request reached System.
3. UI notifies that it cannot connect to the system.
4. Guest can retry when the network is restored.
5. Use Case ends if continuing is impossible.

**E6 – ERR-LIMIT-001: Rate Limit Exceeded**

1. System detects that Guest sent too many requests within a short period.
2. System rejects the current request.
3. System returns `ERR-LIMIT-001` with the retry time if available.
4. UI asks Guest to wait before trying again.
5. Use Case ends.

# 7. Assumptions

- Only problems that are `ACTIVE` and `PUBLISHED` appear in search results.
- An empty search result is a valid outcome.
- The page size has a configured maximum.
- Supported filters and sorting criteria are defined by the system and may evolve.

# 8. Special Requirements

- Search input must be treated as data, never as executable query syntax.
- Ordering must be deterministic so that pagination does not duplicate or skip problems.
- The response must not expose private problem data or administrator-only fields.
- The search endpoint must remain responsive for the configured maximum page size.

# 9. Open Issues

- None for v1.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 1.1 | 2026-11-13 | Aligned with `SpecStructure.md` v1.1: added metadata, split postconditions, clarified branch points, and assigned distinct validation error codes. |
