# Use Case Specification

**UC-COM-04 - View Leaderboard**

**Version:** 1.1

# 1. General Information

- Use Case ID: UC-COM-04
- Use Case Name: View Leaderboard
- Brief Description: Allow Guest to view the public global ranking of Users by the number of distinct non-archived Problems they have solved.
- Primary Actor(s): Guest, User (through public behavior inheritance)
- Supporting Actor(s): None
- Trigger: Guest opens the Leaderboard page.
- Priority: Medium
- Status: Draft
- Related Use Cases: UC-U-ST-01 – View Own Statistics
- Related Requirements: FR-025 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- System is available and can serve read requests.
- No login is required.

# 3. Postconditions

## 3.1. Success

- The requested page of the leaderboard is displayed.
- No platform data is modified.

## 3.2. Failure

- No partial or misleading ranking is displayed as if it were complete.
- No platform data is modified.
- The Guest receives an error notification or an empty state with a clear explanation.

# 4. Main Flow

1. Guest accesses the Leaderboard page.
2. UI requests a leaderboard page with pagination parameters.
3. System validates the pagination parameters.
4. System selects Users whose account status is `ACTIVE`.
5. System counts, for each User, the number of distinct non-archived Problems for which the User has at least one Submission with the `ACCEPTED` verdict.
6. System counts each User's total number of Submissions and computes the acceptance rate.
7. System ranks Users by:
    - Solved problem count, descending.
    - Total Submission count, ascending.
    - Username, ascending.
8. System returns the requested page with rank, Username, Display Name, solved count, Submission count, and acceptance rate.
9. UI displays the leaderboard.
10. Use Case ends.

# 5. Alternative Flow

**A1 – Leaderboard Is Empty**

1. At step 7, System finds no active User with a solved Problem.
2. System returns an empty page.
3. UI displays a message that ranking data is not available yet.
4. Use Case ends.

**A2 – Navigate Between Pages**

1. At step 9, Guest selects another page.
2. UI sends the new pagination parameters.
3. System returns the corresponding page.
4. UI updates the leaderboard.
5. Use Case continues at step 9 of the Main Flow.

**A3 – Refresh Leaderboard**

1. At step 9, Guest reloads the page.
2. UI requests the same page again.
3. System recalculates the ranking from current data.
4. UI updates the leaderboard.
5. Use Case ends.

# 6. Exception Flow

**E1 – ERR-VAL-005: Invalid Pagination Parameters**

1. At step 3, System detects that the page or page size is invalid, such as a non-numeric value, zero, a negative number, or a value above the configured maximum.
2. System rejects the request.
3. No ranking data is read.
4. System logs the error with the request ID.
5. System returns `ERR-VAL-005` with the invalid fields.
6. UI resets to the first page using the default page size and reissues the request.
7. Use Case continues at step 3.

**E2 – ERR-SYS-001: Internal System Error**

1. At steps 4–7, System encounters an error while calculating the ranking.
2. System stops processing the request.
3. System does not return a partial ranking as complete.
4. System logs the error and request ID.
5. System returns `ERR-SYS-001` with a general error message.
6. UI notifies that the leaderboard cannot be loaded.
7. Guest can retry later.
8. Use Case ends.

**E3 – ERR-NET-001: Network Error**

1. During the request or response, the network connection is interrupted or times out.
2. UI cannot confirm whether the request reached System.
3. UI notifies that it cannot connect to the system.
4. Guest can retry when the network is restored.
5. Use Case ends if continuing is impossible.

**E4 – ERR-LIMIT-001: Rate Limit Exceeded**

1. System detects that Guest sent too many requests within a short period.
2. System rejects the current request.
3. System returns `ERR-LIMIT-001` with the retry time if available.
4. UI asks Guest to wait before trying again.
5. Use Case ends.

# 7. Assumptions

- Only accounts with `ACTIVE` status appear in the ranking.
- Only non-archived Problems count toward solved totals; unpublished but non-archived Problems still count.
- The leaderboard is public and read-only.
- An empty leaderboard is a valid result.
- The page size has a configured maximum.

# 8. Special Requirements

- Ranking must be deterministic for equal solved counts and equal Submission counts.
- The response must not expose email addresses or other private account data.
- The endpoint must be efficient enough to serve the configured page size without loading every User into memory.

# 9. Open Issues

- None for v1.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 1.1 | 2026-11-13 | Aligned with `SpecStructure.md` v1.1: corrected primary actors, moved the empty-leaderboard condition to assumptions, assigned the shared pagination error code, and added explicit end states. |
