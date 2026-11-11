# Use Case Specification

**UC-COM-03 - View Problem Details**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-COM-03
- Use Case Name: View Problem Details
- Brief Description: Allow Guest to see the detailed information of a public problem, including problem statement, input/output specification, constraints and examples.
- Participating Actors: Guest, User (can also use this feature through public behavior inheritance)

# 2. Preconditions

- The problem exists in the system.
- The problem is public.
- Guest can access the system.
- No login required (for Guest).

# 3. Postconditions

- The detailed information of the problem is displayed.
- No changes to any problem's data.

# 4. Main Flow

1. Guest accesses the problem list or search result.
2. Guest selects a problem.
3. System receives the request for problem details and Problem ID.
4. System validates the existance of the problem.
5. System validates the publicity of the problem.
6. System queries the detailed information, including:
   - Problem Title.
   - Problem Statement.
   - Input Specification.
   - Output Specification.
   - Constraints.
   - Sample Test Cases.
   - Difficulty and tags.
7. System returns the problem details.
8. UI displays the problem details to Guest.

# 5. Alternative Flow

**A1 – Navigate Back to Problem List**

1. After step 8, Guest goes back to the problem list.
2. System navigates back to the problem list page.
3. Use Case ends.

**A2 – Navigate to Another Problem**

1. After step 8, Guest selects another problem from the problem list or search result.
2. System receives a new Problem ID.
3. Use Case restarts from step 3 with the new Problem ID.

# 6. Exception Flow

**E1 – ERR-RES-001: Problem Not Found**

1. At step 4, System can't find the problem corresponding with the Problem ID.
2. System stops the query.
3. System returns the resource not found error.
4. UI notifies that the problem does not exist or not available.
5. Guest can go back to the problem list.

**E2 – ERR-PERM-001: Problem Not Publicly Accessible**

1. At step 5, System detects that the problem is not public.
2. System rejects accessing the problem details.
3. System return a response that doesn't reveal the problem's details.
4. UI notifies that the problem does not exist or not available for Guest.

**E3 – ERR-SYS-001: Internal System Error**

1. At step 4–7, System encounters an error when querying the details.
2. System stops processing the query.
3. Backend log the error and request ID.
4. System returns the error notification.
5. UI notifies that can't load the problem.
4. Guest can retry later.

**E4 – ERR-NET-001: Network Error**

1. In the process of sending request or receiving response, network connection is interuptted or timeout.
2. UI notifies that can't load the problem.
3. Guest can try to reconnect when the network is restored.
4. Use Case ends if continuing is impossible.