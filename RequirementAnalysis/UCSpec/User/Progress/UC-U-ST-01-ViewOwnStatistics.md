# Use Case Specification

**UC-U-ST-01 - View Own Statistics**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-U-ST-01
- Use Case Name: View Own Statistics
- Brief Description: Allow User to view their programming progress, including attempted and solved Problems, breakdowns by difficulty and tag, acceptance rate, and recent Submissions.
- Primary Actor(s): User
- Supporting Actor(s): None
- Trigger: User opens the profile or progress page.
- Priority: Medium
- Status: Draft
- Related Use Cases: UC-U-S-03 – View Submission History, UC-COM-04 – View Leaderboard
- Related Requirements: FR-023, FR-024 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- User is logged in to the system.
- Access Token is valid.
- User's account exists and has the `ACTIVE` status.

# 3. Postconditions

## 3.1. Success

- User's statistics and recent activity are displayed.
- No Submission, Problem, or account data is modified.

## 3.2. Failure

- No statistics are presented as complete when the calculation failed.
- No Submission, Problem, or account data is modified.

# 4. Main Flow

1. User opens the profile or progress page.
2. UI requests the statistics for the current User with the Access Token.
3. System validates the Access Token and identifies the account.
4. System calculates the overall statistics:
    - Attempted Problems: distinct non-archived Problems for which User has at least one Submission.
    - Solved Problems: distinct non-archived Problems for which User has at least one Submission with the `ACCEPTED` verdict.
    - Acceptance rate: accepted Submissions divided by total Submissions, or 0 when there are no Submissions.
5. System calculates the solved and attempted counts grouped by difficulty.
6. System calculates the solved and attempted counts grouped by tag.
7. System retrieves the 10 most recent Submissions of User, with Problem title, verdict or status, language, and creation time.
8. System returns the statistics and recent activity.
9. UI displays the counts, breakdowns, acceptance rate, and recent Submissions.
10. Use Case ends.

# 5. Alternative Flow

**A1 – User Has No Submissions**

1. At step 4, System finds no Submissions for User.
2. System returns zero counts and an acceptance rate of 0.
3. System returns empty difficulty, tag, and recent-activity lists.
4. UI displays an empty-state message that invites User to solve a Problem.
5. Use Case ends.

**A2 – Refresh Statistics**

1. At step 9, User reloads or refreshes the page.
2. UI requests the statistics again.
3. System recalculates the values from current data.
4. UI updates the displayed statistics.
5. Use Case ends.

**A3 – Open a Recent Submission**

1. At step 9, User selects a Submission from the recent activity list.
2. System navigates to UC-U-S-02 – View Submission Result or UC-U-S-04 – View Submission Details, depending on the Submission state.
3. Use Case ends.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing, Invalid, or Expired Access Token**

1. At step 3, System cannot find, validate, or accept the Access Token.
2. System rejects the request.
3. No statistics are read or returned.
4. System logs the error with the request ID and without the token value.
5. System returns `ERR-AUTH-003`.
6. UI clears the stored authentication information and navigates User to the login page.
7. Use Case ends.

**E2 – ERR-ACC-001: Account Not Available**

1. At step 3, System detects that the account does not exist or is no longer `ACTIVE`.
2. System rejects the request.
3. No statistics are read or returned.
4. System logs the error with the request ID.
5. System returns `ERR-ACC-001`.
6. UI notifies User that the statistics are unavailable.
7. Use Case ends.

**E3 – ERR-SYS-001: Internal System Error**

1. At steps 4–7, System encounters an error while calculating the statistics.
2. System stops processing the request.
3. System does not return a partial result as complete.
4. System logs the error and request ID.
5. System returns `ERR-SYS-001` with a general message.
6. UI notifies that the statistics cannot be loaded.
7. User can retry later.

**E4 – ERR-NET-001: Network Error**

1. During the request or response, the network connection is interrupted or times out.
2. UI notifies that it cannot connect to the system.
3. User can retry when the network is restored.

**E5 – ERR-LIMIT-001: Rate Limit Exceeded**

1. System detects that User sent too many statistics requests within a short period.
2. System rejects the current request.
3. System returns `ERR-LIMIT-001` with the retry time if available.
4. UI asks User to wait before trying again.

# 7. Assumptions

- Archived Problems are excluded from all counts.
- Unpublished Problems that are not archived still count, so a User's progress does not drop when an Administrator unpublishes a Problem.
- "Recent activity" is limited to the 10 most recent Submissions and is not paginated in v1.
- Difficulty values are `EASY`, `MEDIUM`, and `HARD`.

# 8. Special Requirements

- Counts must use distinct Problems, not distinct Submissions.
- The acceptance rate must be computed from Submissions, not from Problems.
- The statistics query must not expose hidden Test Case data or other Users' private data.
- The endpoint must remain responsive for Users with large Submission histories through appropriate indexes or aggregate queries.

# 9. Open Issues

- None for v1.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
