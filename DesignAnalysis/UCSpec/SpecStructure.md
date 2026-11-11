# Use Case Specification Structure

**Arbiter - Online Judge Platform**

**Version:** 1.0

This document serves as the guide how to write an use case specification, including its structure, error specification and error handling.

# 1. Use Case Specification Structure

Every Use Case has the following fields:

| Field                | About
|----------------------|---------------------------------------------------|
| Use Case ID          | Unique identifier                                 |
| Use Case Name        | As the name suggests                              |
| Brief Description    | Use Case's objective and result                   |
| Participating Actors | Main actor(s), and side actor(s) if any           |
| Preconditions        | Conditions that must be satisfied before starting |
| Postconditions       | System state after Use Case ends                  |
| Main Flow            | The main business flow with numbered steps        |
| Alternative Flow     | Business flow with alternate outcome              |
| Exception Flow       | Error scenario and handling flow                  |

Differentiate between Alternative Flow and Exception Flow:

- Alternative Flow: User performs a choice or go with a different business branch but still valid. E.g.: cannot find problems relevant with the keyword.
- Exception Flow: an error which makes the flow can't go normally. E.g.: database is not available, invalid input or rate limited requests.

# 2. Exception Flow

## 2.1. Error Code

Suggest using error codes in this form:

ERR-[CATEGORY]-[NUMBER]

Trong đó:

- ERR: Error.
- CATEGORY: Error category.
- NUMBER: Error order number in the category.

Error codes are divided into these following categories:

| Category  | Category Name        | Example
|-----------|----------------------|-----------------------------------------|
| ERR-VAL   | Validation Error     | Invalid input                           |
| ERR-AUTH  | Authentication Error | Unverified or invalid login inforamtion |
| ERR-ACC   | Account Error        | Account not found or not active         |
| ERR-RES   | Resource Error       | Resource not found                      |
| ERR-PERM  | Permission Error     | Unauthorized access                     |
| ERR-LIMIT | Rate Limit Error     | Request limit exceeded                  |
| ERR-SYS   | System Error         | System or related service error         |
| ERR-NET   | Network Error        | Connection interuptted or timeout       |

## 2.2. General Error Handling

All Exception Flows will follow a standardized order of steps:

1. Detect Error in request resolving process.
2. Stop processing if the operation can't continue safely.
3. Ensure data are not saved in an inconsistent state. With write operations, use transaction and rollback when neccessary.
4. Log error information at Backend, with request/correlation ID for tracing purpose. **DO NOT** log passwords or secret information.
5. Return error code and appropiate message for Frontend. **DO NOT** reveal stack trace or internal information.
6. Display notification and instruct user for the next step, if any.
7. Allow retry when neccessary; if not, end the Use Case.

Each Use Case will appoint specific error, what results to error and next steps.