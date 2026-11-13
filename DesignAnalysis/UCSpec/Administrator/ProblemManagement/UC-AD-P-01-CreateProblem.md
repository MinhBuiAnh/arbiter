# Use Case Specification

**UC-AD-P-01 - Create Problem**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-AD-P-01
- Use Case Name: Create Problem
- Brief Description: Allow Administrator to create a new Problem in the system by providing necessary information such as title, description, problem statement, Input/Output format, Constraints, and resource execution limits. The problem, once created, is saved in PostgreSQL with a default status of Active and Draft.
- Participating Actors: Administrator.

# 2. Preconditions

- Administrator has successfully logged in.
- Administrator has the authority to manage problems.
- System is operational and can write data to PostgreSQL.

# 3. Postconditions

- A new Problem is created and successfully saved in PostgreSQL.
- The Problem has a unique Problem ID.
- The Problem has the default status:
    - `is_active = true`
    - `publication_status = DRAFT`
- The Problem does not appear in the public Problem list for Guests/Users.
- Administrator can continue to edit the Problem or manage Test Cases.

# 4. Main Flow

1. Administrator accesses the Problem Management page.
2. Administrator selects the Create Problem function.
3. UI displays the create Problem form.
4. Administrator enters the necessary information, including:
    - Problem Title.
    - Problem Description/Statement.
    - Input Format.
    - Output Format.
    - Constraints.
    - Time Limit.
    - Memory Limit.
    - Any other classification information if applicable.
5. Administrator submits the create Problem form.
6. UI performs basic validity checks on the data.
7. UI sends a request to create the Problem to System.
8. System validates the Access Token.
9. System checks Administrator's permissions.
10. System validates the provided data fields and limits.
11. System checks the business constraints of the Problem.
12. System creates a new Problem with the status:
    - `is_active = true`
    - `publication_status = DRAFT`
13. System saves the Problem to PostgreSQL.
14. System returns the Problem ID and information about the newly created Problem.
15. UI notifies that the Problem has been created successfully.
16. Administrator can continue updating the Problem or move on to manage Test Cases.

# 5. Alternative Flow

**A1 – Administrator Saves a Draft**

1. At step 5, Administrator selects Save Draft.
2. UI sends a request to create the Problem with the Draft status.
3. System performs the same validation and data saving steps as in the Main Flow.
4. The Problem is created with `publication_status = DRAFT`.
5. Returns to step 14 of the Main Flow.

**A2 – Administrator Cancels Problem Creation**

1. At step 3 or step 4, Administrator selects Cancel.
2. UI requests confirmation if the form has unsaved data.
3. Administrator confirms the cancellation.
4. UI closes the form and returns to the Problem Management page.
5. No new Problem is created.
6. The Use Case ends.

**A3 – Administrator Continues to Test Case Management**

1. At step 16, Administrator selects to manage Test Cases for the newly created Problem.
2. UI transitions to the Test Case Management function group.
3. Administrator can continue to perform UC-AD-T-01 Create Test Case.
4. The current Use Case ends.

# 6. Exception Flow

**E1 – ERR-AUTH-003: Missing or Invalid Access Token**

1. System could not authenticate the Access Token.
2. Returns ERR-AUTH-003 – Missing or Invalid Access Token.
3. UI attempts to refresh the Access Token if there is a valid Refresh Token.
4. If it cannot refresh, it requests Administrator to log in again.

**E2 – ERR-AUTH-002: Invalid or Expired Refresh Token**

1. The Refresh Token is invalid, expired, or has been revoked.
2. Returns ERR-AUTH-002 – Invalid or Expired Refresh Token.
3. UI clears the local login status and requests re-login.

**E3 – ERR-PERM-002: Insufficient Privileges**

1. The user has logged in but does not have Administrator privileges.
2. Returns ERR-PERM-002 – Insufficient Privileges.
3. UI notifies that the user does not have permission to perform the action.

**E4 – ERR-VAL-001: Invalid Problem Data**

1. One or more data fields are invalid, missing required information, or exceed the allowed limits.
2. Returns ERR-VAL-001 – Invalid Input.
3. UI displays the corresponding error at the data fields.
4. Administrator edits the information and resubmits.

**E5 – ERR-SYS-001: Internal System Error**

1. System could not save the Problem to PostgreSQL or an internal processing error occurred.
2. Returns ERR-SYS-001 – Internal System Error.
3. UI notifies that it could not create the Problem.
4. Success notification should not be given if the transaction has not been committed.

**E6 – ERR-NET-001: Network Error**

1. UI could not connect to System or the request timed out.  
2. Identified as ERR-NET-001 – Network Error.  
3. UI notifies of a connection error.  
4. Before resending the request, it is advisable to check the list of Problems to avoid duplicates, as the previous submission may have been processed but the response was lost.