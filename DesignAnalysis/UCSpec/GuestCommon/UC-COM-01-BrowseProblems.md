# Use Case Specification

**UC-COM-01 - Browse Problems**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-COM-01
- Use Case Name: Browse Problems
- Brief Description: Allow Guest to access the list of public problems. User can inspect the list, see preview and move between different search result pages.
- Participating Actors: Guest, User (can also use this feature through public behavior inheritance)

# 2. Preconditions

- System is available, running and can serve read data requests.
- Guest can access to the system.
- No login required (for Guest).

# 3. Postconditions

- List of public problems is displayed to Guest.
- No changes to any problem's data.

# 4. Main Flow

1. Guest accesses the problem list page.
2. System receives request to get problem list.
3. System queries all problems with public state.
4. System gets necessary information for display, such as:
   - Problem Title.
   - Difficulty.
   - Categories or tags.
   - Other preview information if any.
5. System returns the problem list.
6. UI displays the problem list to Guest.
7. Guest can select a problem to move to Use Case UC-COM-03 – View Problem Details.

# 5. Alternative Flow

**A1 – No Problems Available**

1. At step 3, System can't find any public problems.
2. System returns an empty list.
3. UI displays a notificaation that there is no public problem.
4. Use Case ends.

**A2 – Navigate Between Pages**

1. At step 6, Guest select the previous or next page.
2. System receives the pagination request.
3. System queries the problem list corresponding to the selected page.
4. UI updates the list.
5. Use Case continues from step 6 of the Main Flow.

**A3 – Change Sorting Order**

1. Guest selects a supported sorting criteria, such as problem name or difficulty.
2. System checks the sorting criteria.
3. System queries the list from the selected criteria.
4. UI displays the new result.

# 6. Exception Flow

**E1 – ERR-SYS-001: Internal System Error**

1. At step 2–5, System encounters an intenal error when processiing request.
2. System stops processing the current request.
3. Backend logs the error and request ID.
4. System returns the error notification.
5. UI notifies that the problem list can't be loaded.
6. Guest can try to refresh the page.

**E2 – ERR-NET-001: Network Error**

1. In the process of sending request or receiving response, network connection is interuptted or timeout.
2. UI notifies that can't connect to the system.
3. Guest can try to reconnect when the network is restored.
4. Use Case ends if continuing is impossible.

**E3 – ERR-LIMIT-001: Rate Limit Exceeded**

1. System detects that Guest sent too many requests in a certain duration of time.
2. System rejects the current request.
3. System returns the limit notification and the time for retry if supported.
4. UI notifies that Guest needs to wait before sending the next request.