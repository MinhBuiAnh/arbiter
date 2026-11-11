# Use Case Specification

**UC-COM-02 - Search Problems**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-COM-02
- Use Case Name: Search Problems
- Brief Description: Allow Guest to search for a public problem by keywords or supported filter criterias.
- Participating Actors: Guest, User (can also use this feature through public behavior inheritance)

# 2. Preconditions

- System is available and running.
- Guest can use the search feature.
- No login required (for Guest).

# 3. Postconditions

- List of public problems is displayed according to keywords and/or provided filters.
- No changes to any problem's data.

# 4. Main Flow

1. Guest accesses the problem search feature.
2. Guest provides the search keywords.
3. Guest can select additional supported filters, such as:
   - Difficulty.
   - Categories.
   - Tags
4. Guest sends the request
5. System receives and validates the search data.
6. System queries all problems relevant to the keywords and filters.
7. System returns the search result.
8. UI displays the search result to Guest.
9. Guest can select a problem to move to Use Case UC-COM-03 – View Problem Details.

# 5. Alternative Flow

**A1 – No Search Results**

1. At step 6, System can't find any relevant problems.
2. System returns an empty list.
3. UI displays a notificaation that there is no revelant problem.
4. Guest can change the keywords and filters, then perform search again.

**A2 – Search Without Filters**

1. At step 3, Guest doesn't select any filters.
2. System only uses the keywords for searching.
3. Use Case continues from step 4 of the Main Flow.

**A3 – Search With Filters Only**

1. Guest does not enter any keywords and only select one or more filters.
2. System performs search based on selected filters.
3. Use Case continues from step 4 of the Main Flow.

# 6. Exception Flow

**E1 – ERR-VAL-001: Invalid Search Parameters**

1. At step 5, System detects that search data is invalid, such as unsupported filters or invalid pagination value.
2. System rejects the search request.
3. System returns the invalid fields.
4. UI displays the notification and asks Guest to change the data.

**E2 – ERR-SYS-001: Internal System Error**

1. At step 5–7, System encounters an error when processing or querying the search.
2. System stops processing the current request.
3. Backend log the error and request ID.
4. System returns the error notification.
5. UI notifies that can't perform the search operation.
4. Guest can retry later.

**E3 – ERR-NET-001: Network Error**

1. In the process of sending request or receiving response, network connection is interuptted or timeout.
2. UI notifies that can't connect to the system.
3. Guest can try to reconnect when the network is restored.
4. Use Case ends if continuing is impossible.

**E4 – ERR-LIMIT-001: Rate Limit Exceeded**

1. System detects that Guest sent too many requests in a certain duration of time.
2. System rejects the current request.
3. System returns the limit notification and the time for retry if supported.
4. UI notifies that Guest needs to wait before sending the next request.