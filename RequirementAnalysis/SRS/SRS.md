# Software Requirements Specification (SRS)
## Online Judge Platform

**Version:** 2.0
**Project Type:** Capstone Project
**System Architecture:** Modular Monolith with Asynchronous Judge Workers
**Technology Stack:** React, TypeScript, Go, PostgreSQL, Redis Streams, Docker

---

# 1. Introduction

## 1.1 Purpose

This document specifies the software requirements for the Online Judge Platform, a web-based application that allows users to practice programming problems and automatically evaluate submitted source code.

The SRS defines the system's functional requirements, non-functional requirements, project scope, actors, and use cases. It serves as the foundation for subsequent system analysis, database design, API design, implementation, and testing.

The intended audiences include:
- Project developers.
- Project supervisors and evaluators.
- System analysts and designers.
- Testers responsible for verifying system behavior.

## 1.2 Project Overview

The Online Judge Platform is a web-based programming practice and automated code evaluation system inspired by platforms such as LeetCode.

The platform provides an environment in which users can browse programming problems, write solutions using an integrated code editor, submit source code, and receive automatically generated evaluation results.

The system consists of two major parts:

- **Core Platform:** Handles user accounts, programming problems, submissions, submission history, and administrative operations.
- **Judge System:** Processes submissions asynchronously, compiles or syntax-checks source code, executes programs against ordered test cases in isolated Docker environments, evaluates their outputs, and stores the results.

The platform will initially evaluate submissions in the following programming languages:
- C++17 (g++)
- Python 3

The main technologies are:
- **Frontend:** React with TypeScript.
- **Code Editor:** Monaco Editor.
- **Backend:** Go, following a Modular Monolith architecture.
- **Database:** PostgreSQL.
- **Message Queue and Job Delivery:** Redis Streams with a transactional outbox.
- **Code Execution Environment:** Docker containers.
- **Result Updates:** HTTP polling.

Go is used as a backend implementation language only; Go submission support is deferred from v1.

## 1.3 Definitions and Abbreviations

| Term | Definition |
|---|---|
| Online Judge (OJ) | A system that automatically evaluates submitted programming solutions. |
| Submission | Source code submitted by a user for evaluation. |
| Judge Worker | A background process responsible for compiling or syntax-checking and executing submissions. |
| Test Case | A predefined input and expected output used to evaluate a program. |
| Sample Test Case | A test case publicly displayed to users. |
| Hidden Test Case | A test case whose input and expected output are not exposed to users. |
| Verdict | The final evaluation outcome of a submission. `INTERNAL_ERROR` is a processing status, not a verdict. |
| Sandbox | An isolated execution environment for running untrusted source code. |
| MVP | Minimum Viable Product. |
| API | Application Programming Interface. |
| SRS | Software Requirements Specification. |
| Outbox Dispatcher | Internal process that publishes committed judge events from the transactional outbox to Redis Streams. |
| Attempted Problem | A non-archived problem for which a user has at least one submission. |
| Solved Problem | A non-archived problem for which a user has at least one accepted submission. |

## 1.4 References

- Project Proposal – Online Judge Platform.
- [Project Scope](../../ProjectProposal/ProjectScope.md), v1.0.
- [Use Case Catalog](../UCSpec/UseCaseCatalog.md), v1.1.
- [Use Case Specification Structure](../UCSpec/SpecStructure.md), v1.1.
- Documentation of React, Go, PostgreSQL, Redis Streams, Docker, and Monaco Editor.

---

# 2. Project Overview

## 2.1 Product Perspective

The Online Judge Platform is a standalone web application consisting of a frontend, backend API, persistent database, asynchronous job queue, and separate Judge Worker process.

The frontend communicates with the backend through versioned REST APIs. The backend manages business logic and persistent data in PostgreSQL. When a user submits source code, the backend atomically creates the submission record and an outbox event; an internal dispatcher publishes the event to Redis Streams.

A separate Judge Worker consumes queued jobs, retrieves the required data from PostgreSQL, and executes the submitted program in an isolated Docker environment.

After evaluation, the worker persists the results in PostgreSQL before acknowledging the queue message. The frontend periodically requests the submission status through HTTP polling until the submission reaches a terminal state.

PostgreSQL is the system's primary source of truth. Redis Streams is used for asynchronous job delivery. Caching is not a required v1 function.

## 2.2 Product Functions

The system provides the following major functions:

1. **Authentication and Account Management**
   - User registration, login, client-side logout, profile view/update, and password change.
   - Stateless token authentication and account-status enforcement.
   - Administrator user search, details, and status management.

2. **Problem Management**
   - Browse, search, filter, and view published problems, sample cases, and public problem statistics.
   - Create and update problems, manage tags, archive problems, and publish or unpublish them.

3. **Code Editor**
   - Write and edit source code using Monaco Editor.
   - Select a supported programming language.
   - Submit source code for automated evaluation.

4. **Submission Management**
   - Create and track submissions, view verdicts and results, browse filtered submission history, and inspect submission details.
   - View personal progress statistics and a public leaderboard.

5. **Judge System**
   - Receive and recover submission jobs.
   - Compile C++17 or syntax-check Python 3 source code.
   - Execute programs against test cases.
   - Evaluate program outputs and determine verdicts.
   - Persist evaluation results.

6. **Administration**
   - Manage problem and test-case lifecycles, including test-case classification and ordering.
   - View users, manage account status, and inspect any submission.

## 2.3 User Classes and Characteristics

### Guest

A visitor who has not authenticated.

Guests can browse, search, and view published problems and sample test cases, view the public leaderboard, register, and log in. Authentication is required to submit source code or access private account and submission data.

### User

An authenticated user who uses the platform for programming practice.

Users can manage their own account information and password, browse and solve problems, view their own submission status, history, source code and results, and view their own progress statistics.

### Administrator

A privileged user responsible for maintaining the platform's content and users.

Administrators inherit User capabilities. They can manage problem and test-case lifecycles, view and manage user accounts, and inspect any submission for support purposes.

### Judge Worker

An automated system component responsible for processing programming submissions.

It consumes and recovers submission jobs, compiles or syntax-checks source code, executes test cases, evaluates outputs, and records evaluation results. It is not a human user.

## 2.4 Operating Environment

The system is designed to operate in a web-based environment.

- Frontend: Modern web browsers supporting the React application and Monaco Editor.
- Backend: Go application running as an HTTP API server.
- Database: PostgreSQL.
- Queue: Redis with Redis Streams support.
- Judge Execution: Docker-compatible container environment.
- Deployment: Docker Compose for the development and demonstration environment.

## 2.5 Design and Implementation Constraints

1. The frontend must be implemented using React and TypeScript.
2. Monaco Editor must be used as the integrated source-code editor.
3. The backend must be implemented in Go using a Modular Monolith architecture.
4. PostgreSQL must be used as the primary persistent data store.
5. Redis Streams must be used to deliver asynchronous submission jobs to Judge Workers.
6. The Judge Worker must run separately from the HTTP API server.
7. User-submitted source code must never be executed directly inside the backend API process or on the host outside an isolated execution environment.
8. Docker containers must be configured with appropriate resource restrictions and security controls.
9. Submission results must be retrieved by the frontend using HTTP Polling.
10. Submission evaluation in v1 must support C++17 and Python 3 only. Go submission support is deferred.
11. Test-case files must be stored on a protected filesystem volume; PostgreSQL stores test-case metadata and relative paths.

## 2.6 Assumptions and Dependencies

- Users have access to a modern web browser and an internet connection.
- The deployment environment supports Go, PostgreSQL, Redis, and Docker.
- The required compilers and interpreters are available to the Judge Worker execution environment.
- Administrators are responsible for creating valid problem descriptions and test cases.
- The initial platform operates with C++17 and Python 3 and predefined execution limits.
- A committed submission and its outbox event are persisted atomically; the dispatcher may publish the event asynchronously.
- Basic progress statistics and a read-only global leaderboard are part of v1; advanced analytics are not.

---

# 3. Project Scope

## 3.1 In-Scope Features

The initial release focuses on the Core Platform and includes the following modules.

| Module | Scope |
|---|---|
| Authentication and Account | Registration, login, client-side logout, profile view/update, password change, and administrator user management. |
| Problem Management | Public browse, search, filter, details, sample cases, problem statistics, and administrator problem/tag lifecycle management. |
| Test Case Management | Create, update, delete, reorder, and classify sample and hidden cases. |
| Code Editor | Source-code editing with Monaco Editor and C++17/Python 3 selection. |
| Submission Management | Submission creation, status polling, result/detail viewing, and paginated, filterable history. |
| Judge System | Asynchronous judging, job recovery, compilation/syntax checking, isolated execution, evaluation, and durable result persistence. |
| Progress and Leaderboard | Basic personal progress statistics, a public leaderboard, and public problem aggregates. |
| Administration | User and submission inspection, problem management, tags, and test-case management. |

## 3.2 Out-of-Scope Features

The following features are excluded from the initial Core MVP and may be considered for future development:

- Programming contests.
- Discussion forums and comments.
- Advanced user analytics such as streaks, activity feeds, and time-series reports.
- Go, JavaScript, and other submission languages.
- "Run against samples" without creating a submission.
- Rejudge UI, special judges, floating-point tolerance, and interactive problems.
- AI-powered code review.
- Plagiarism detection.

These features are not required for the initial release.

## 3.3 Project Goals

The project aims to:

1. Provide a centralized platform for programming practice.
2. Allow users to submit solutions in C++17 and Python 3.
3. Automatically evaluate submitted programs against predefined test cases.
4. Provide clear and reliable submission results.
5. Provide administrators with tools to manage problems, test cases, and users.
6. Establish a modular and maintainable architecture that can support future expansion.

## 3.4 Core MVP Acceptance Workflow

The initial release is considered functionally complete when the following workflow can be performed:

1. An administrator creates an active draft problem.
2. The administrator adds, classifies, and orders sample and hidden test cases.
3. The administrator publishes the problem after it meets publication requirements.
4. A user registers or logs into the platform.
5. The user finds and opens the published problem.
6. The user writes a solution using Monaco Editor and selects C++17 or Python 3.
7. The user submits the source code.
8. The backend validates and persists the submission and outbox event atomically.
9. The dispatcher publishes the job and a Judge Worker processes it.
10. The worker compiles or syntax-checks the source and executes it against ordered test cases in isolated Docker environments.
11. The worker persists a trustworthy result before acknowledging the job.
12. The frontend polls until a terminal status and displays the result without exposing hidden test data.
13. The user can view submission history, details, and personal progress; guests can view the public leaderboard.

---

# 4. Functional Requirements

Functional requirements describe the operations and services that the system must provide.

## 4.1 Authentication and Account Management

| ID | Requirement | Priority |
|---|---|---|
| FR-AUTH-01 | The system shall allow guests to register with a unique username, email address, and password. | High |
| FR-AUTH-02 | The system shall allow registered users to log in using a username or email address and password. | High |
| FR-AUTH-03 | The system shall allow authenticated users to log out by clearing client-side authentication data; logout shall not revoke a stateless token. | High |
| FR-AUTH-04 | The system shall authenticate every protected request and reject missing, invalid, expired, or password-invalidated tokens. | High |
| FR-AUTH-05 | The system shall allow users to view their own account information. | High |
| FR-AUTH-06 | The system shall allow users to update their display name, bio, and email; usernames shall be immutable in v1. | Medium |
| FR-AUTH-07 | The system shall enforce role-based access control for administrative functions on the backend. | High |
| FR-AUTH-08 | The system shall allow users to change their password after verifying the current password and shall invalidate previously issued tokens after success. | Medium |
| FR-AUTH-09 | The system shall reject login and authenticated requests for disabled accounts. | High |
| FR-AUTH-10 | The system shall use a generic invalid-credential response that does not reveal whether an account exists during login. | High |
| FR-AUTH-11 | Registration may report that a username or email is already in use as an accepted v1 usability trade-off. | High |
| FR-AUTH-12 | Registration and password changes shall require passwords of 8 to 128 characters containing at least one letter and one digit. | High |

## 4.2 Problem Management

| ID | Requirement | Priority |
|---|---|---|
| FR-PROB-01 | The system shall display a paginated list of active, published problems to guests and users. | High |
| FR-PROB-02 | The system shall allow users to search problems by title and filter by difficulty and tags. | High |
| FR-PROB-03 | The system shall allow users to view a published problem's statement, formats, constraints, limits, classification, and supported languages. | High |
| FR-PROB-04 | The system shall expose sample test cases for published problems, but not hidden test-case data. | High |
| FR-PROB-05 | The system shall allow administrators to create a problem in `ACTIVE` and `DRAFT` state. | High |
| FR-PROB-06 | The system shall allow administrators to update problem metadata without changing historical submissions or the publication state; a published problem must remain eligible for publication or the update shall be rejected. | High |
| FR-PROB-07 | The system shall allow administrators to deactivate and reactivate a problem without physically deleting it or its submission history; reactivation shall leave it unpublished. | High |
| FR-PROB-08 | The system shall allow administrators to publish and unpublish active problems. Publication shall require a non-empty title and statement, positive time and memory limits, at least one sample and one hidden test case, and readable test-case data. | Medium |
| FR-PROB-09 | The system shall allow administrators to create and assign tags while managing problems. | Medium |
| FR-PROB-10 | The system shall report submission count, accepted submission count, and acceptance rate for published problems. | High |

## 4.3 Test Case Management

| ID | Requirement | Priority |
|---|---|---|
| FR-TC-01 | The system shall allow administrators to create test cases for a programming problem. | High |
| FR-TC-02 | The system shall allow administrators to specify the input and expected output of each test case. | High |
| FR-TC-03 | The system shall distinguish between sample and hidden test cases. | High |
| FR-TC-04 | The system shall allow administrators to update existing test cases. | High |
| FR-TC-05 | The system shall allow administrators to delete test cases. | High |
| FR-TC-06 | The system shall preserve the association between each test case and its programming problem. | High |
| FR-TC-07 | The system shall prevent users from accessing hidden test-case input and expected output through public and submission endpoints. | High |
| FR-TC-08 | The system shall allow administrators to reorder test cases atomically and maintain unique, contiguous order values starting at one within each problem. | Medium |
| FR-TC-09 | The system shall permit test-case mutations only while the problem is `ACTIVE` and `DRAFT`. | High |

## 4.4 Code Editor and Submission Management

| ID | Requirement | Priority |
|---|---|---|
| FR-SUB-01 | The system shall provide an integrated source-code editor using Monaco Editor. | High |
| FR-SUB-02 | The system shall allow users to select a supported programming language for a solution. | High |
| FR-SUB-03 | The system shall evaluate C++17 and Python 3 submissions only in v1. | High |
| FR-SUB-04 | The system shall allow authenticated users to submit source code for an active, published problem. | High |
| FR-SUB-05 | The system shall validate language, non-empty source, a maximum source size of 64 KiB, and the per-user throttle of one submission per five seconds before accepting a submission. | High |
| FR-SUB-06 | The system shall assign a unique identifier to each submission and return it with an HTTP 202 response without waiting for judging to finish. | High |
| FR-SUB-07 | The system shall record the submission owner, problem, programming language, source code, and creation time. | High |
| FR-SUB-08 | The system shall allow users to poll the status of their own submissions until a terminal status is reached. | High |
| FR-SUB-09 | The system shall allow users to view their own paginated submission history, filterable by problem and verdict. | High |
| FR-SUB-10 | The system shall allow users to view their own source code, status, verdict, and available evaluation details, including per-test pass/fail and metrics, subject to information-disclosure restrictions. | Medium |
| FR-SUB-11 | The system shall display status instead of a verdict for non-terminal submissions and shall not present `INTERNAL_ERROR` as a verdict. | High |

## 4.5 Judge System

| ID | Requirement | Priority |
|---|---|---|
| FR-JUDGE-01 | The system shall create a judging job when a valid submission is accepted by the backend. | High |
| FR-JUDGE-02 | The system shall publish judging jobs to Redis Streams. | High |
| FR-JUDGE-03 | The Judge Worker shall consume submission jobs from the configured Redis consumer group. | High |
| FR-JUDGE-04 | The Judge Worker shall retrieve submission and problem data from PostgreSQL. | High |
| FR-JUDGE-05 | The Judge Worker shall compile C++17 once per submission in a fresh container and syntax-check Python 3 with `py_compile` before execution. Compilation shall have a 10-second and 512 MiB limit. | High |
| FR-JUDGE-06 | The Judge Worker shall execute submitted programs in isolated Docker environments. | High |
| FR-JUDGE-07 | The Judge Worker shall execute each test case in a fresh isolated container. | High |
| FR-JUDGE-08 | The Judge Worker shall enforce per-test wall-clock and memory limits during execution; defaults shall be 1000 ms and 256 MB. | High |
| FR-JUDGE-09 | The Judge Worker shall capture standard output and error, exit status, wall-clock runtime, and peak memory where available. | High |
| FR-JUDGE-10 | The Judge Worker shall normalize CRLF line endings and compare case-sensitive output token sequences, ignoring whitespace differences. | High |
| FR-JUDGE-11 | The Judge Worker shall determine the final submission verdict based on compilation and test-case evaluation results. | High |
| FR-JUDGE-12 | The Judge Worker shall persist the verdict, aggregate metrics, and per-test results for executed test cases in PostgreSQL. | High |
| FR-JUDGE-13 | The system shall recover or safely reprocess jobs that remain pending after a worker failure. | High |
| FR-JUDGE-14 | The system shall prevent duplicate job processing from producing inconsistent submission results. | High |
| FR-JUDGE-15 | The system shall persist a submission and its outbox event atomically and publish committed events asynchronously. | High |
| FR-JUDGE-16 | The Judge Worker shall acknowledge a job only after its result is durably committed and shall stop after the configured maximum of two attempts, recording an internal error when judging cannot complete. | High |
| FR-JUDGE-17 | The Judge Worker shall treat output exceeding 1 MiB as `WRONG_ANSWER`. | High |
| FR-JUDGE-18 | The Judge Worker shall record `INTERNAL_ERROR`, not a successful verdict, when required test-case data is missing or unreadable. | High |

### 4.5.1 Submission Statuses

The system shall maintain the following submission processing statuses:

| Status | Description |
|---|---|
| QUEUED | The submission has been accepted and is waiting for processing. |
| COMPILING | The submission is undergoing compilation. |
| RUNNING | The submission is being executed and evaluated against test cases. |
| COMPLETED | The evaluation process has finished. |
| INTERNAL_ERROR | An internal system or infrastructure error has prevented normal evaluation. |

### 4.5.2 Submission Verdicts

The system shall support the following verdicts:

| Verdict | Description |
|---|---|
| ACCEPTED (AC) | The program passes all required test cases. |
| WRONG_ANSWER (WA) | The program produces an incorrect output for at least one test case. |
| TIME_LIMIT_EXCEEDED (TLE) | The program exceeds the configured execution time limit. |
| MEMORY_LIMIT_EXCEEDED (MLE) | The program exceeds the configured memory limit. |
| RUNTIME_ERROR (RE) | The program encounters an error during execution. |
| COMPILATION_ERROR (CE) | The source code cannot be compiled successfully. |

The lifecycle is `QUEUED` → `COMPILING` → `RUNNING` → `COMPLETED` or `INTERNAL_ERROR`. `INTERNAL_ERROR` is a terminal processing status, not a user-code verdict, and shall not be presented as one.

## 4.6 Administration and User Management

| ID | Requirement | Priority |
|---|---|---|
| FR-ADMIN-01 | The system shall restrict administrative functions to authorized administrators. | High |
| FR-ADMIN-02 | The system shall allow administrators to list, search, filter, and paginate user accounts. | High |
| FR-ADMIN-03 | The system shall allow administrators to lock or unlock (disable or enable) user accounts, but not their own account; a disabled account shall be rejected on every authenticated request. | Medium |
| FR-ADMIN-04 | The system shall allow administrators to manage programming problems, tags, and publication state. | High |
| FR-ADMIN-05 | The system shall allow administrators to manage, classify, and reorder test cases. | High |
| FR-ADMIN-06 | The system shall allow administrators to list, filter, paginate, and inspect any submission in read-only mode, including source code and available results, without exposing hidden test-case input or expected output; returned compilation output shall be bounded. | Medium |
| FR-ADMIN-07 | The system shall allow administrators to view permitted details for a selected user account. | High |

## 4.7 User Progress and Leaderboard

| ID | Requirement | Priority |
|---|---|---|
| FR-PROG-01 | The system shall show each user attempted and solved problem counts, difficulty and tag breakdowns, acceptance rate, and the ten most recent submissions. | Medium |
| FR-PROG-02 | The system shall provide a public, paginated leaderboard of active users, ranked by distinct solved non-archived problems descending, total submissions ascending, then username ascending. | Medium |

Attempted and solved counts shall use distinct non-archived problems. Acceptance rate is accepted submissions divided by total submissions, or zero when there are no submissions. Unpublishing a problem does not remove it from progress counts; deactivation does.

---

# 5. Non-Functional Requirements

Non-functional requirements define the quality attributes and operational constraints of the system.

## 5.1 Performance

| ID | Requirement |
|---|---|
| NFR-PERF-01 | Under normal operating conditions, common read-only API requests should respond within 2 seconds for at least 95% of requests, excluding external infrastructure delays. |
| NFR-PERF-02 | Submission creation shall return an acceptance response and submission ID without waiting for the judging process to finish. |
| NFR-PERF-03 | The system shall process judging jobs asynchronously so that long-running submissions do not block API requests. |
| NFR-PERF-04 | The frontend shall poll submission status without continuously reloading the page and shall stop polling at a terminal status. |
| NFR-PERF-05 | The system shall enforce configured per-problem resource limits and the fixed compilation limits during execution. |
| NFR-PERF-06 | The frontend shall use a one-second initial status-poll interval with backoff as specified by the use-case behavior and configured rate limits. |

## 5.2 Security

| ID | Requirement |
|---|---|
| NFR-SEC-01 | Passwords shall be hashed with Argon2id and shall never be stored or logged in plaintext. |
| NFR-SEC-02 | Protected requests shall use signed HS256 JWTs containing `sub`, `role`, `iat`, and `exp`, with a 24-hour lifetime; the system shall not issue refresh tokens in v1. |
| NFR-SEC-03 | The system shall enforce authentication, account status, role, and resource-ownership checks on the backend. |
| NFR-SEC-04 | Users shall only access their own private submission information; administrators may inspect any submission. |
| NFR-SEC-05 | Hidden test-case inputs and expected outputs shall not be exposed through public or submission-result APIs, including to administrators viewing submissions. |
| NFR-SEC-06 | User-submitted source code shall be treated as untrusted input and shall never execute in the API process or directly on the host. |
| NFR-SEC-07 | Each compilation or test-case execution shall run in a fresh container with configured time, memory, CPU, and process limits. |
| NFR-SEC-08 | Execution containers shall use a read-only root filesystem, a non-root user, dropped capabilities, no-new-privileges, bounded temporary storage, and no network access. |
| NFR-SEC-09 | Containers shall not run in privileged mode or receive unrestricted host access; host mounts shall be limited to required read-only inputs or artifacts. |
| NFR-SEC-10 | The system shall validate incoming data and prevent secrets, tokens, hidden test data, and unnecessary personal data from appearing in responses or logs. |
| NFR-SEC-11 | Tokens issued before a successful password change shall be rejected using the account's password-change timestamp. |
| NFR-SEC-12 | Sensitive configuration values and credentials shall not be exposed to the frontend or stored in source control. |

## 5.3 Reliability and Availability

| ID | Requirement |
|---|---|
| NFR-REL-01 | PostgreSQL shall serve as the primary source of truth for persistent application and submission data. |
| NFR-REL-02 | Submission creation and outbox-event persistence shall occur in one database transaction so committed submissions are not silently lost before dispatch. |
| NFR-REL-03 | The system shall recover pending Redis Stream messages after worker failures. |
| NFR-REL-04 | Job processing shall be idempotent; repeated delivery shall not rejudge terminal submissions or create conflicting results. |
| NFR-REL-05 | A queue message shall be acknowledged only after the corresponding result has been durably persisted. |
| NFR-REL-06 | The system shall distinguish infrastructure errors from errors caused by submitted programs; uncertain infrastructure outcomes shall never produce a user-code verdict. |
| NFR-REL-07 | The worker shall make no more than two judging attempts for a submission and shall persist `INTERNAL_ERROR` when judging cannot complete within that limit. |
| NFR-REL-08 | Administrative updates shall detect stale concurrent changes and apply state or ordering changes atomically, without partially overwriting newer data. |

## 5.4 Maintainability

| ID | Requirement |
|---|---|
| NFR-MAINT-01 | The backend shall follow a modular structure that separates business domains and responsibilities. |
| NFR-MAINT-02 | The Judge Worker shall be independently executable from the HTTP API server. |
| NFR-MAINT-03 | The system shall use consistent coding conventions and naming standards. |
| NFR-MAINT-04 | The system shall provide structured logging and operational monitoring while excluding passwords, tokens, full source code, hidden test data, and unnecessary personal data. |
| NFR-MAINT-05 | Database schema changes shall be managed through versioned migrations. |
| NFR-MAINT-06 | Important business logic, especially submission processing and verdict evaluation, shall be testable independently. |

## 5.5 Usability

| ID | Requirement |
|---|---|
| NFR-USE-01 | The user interface shall provide clear navigation between problems, the code editor, submissions, and account functions. |
| NFR-USE-02 | The code editor shall provide standard programming-editor capabilities such as syntax highlighting, line numbers, indentation, and code navigation. |
| NFR-USE-03 | Submission statuses and verdicts shall be presented clearly and consistently; `INTERNAL_ERROR` shall be presented as a system failure, never as a verdict. |
| NFR-USE-04 | The system shall display actionable, understandable feedback when an operation fails and shall not claim success when a network outcome is unknown. |
| NFR-USE-05 | The application shall provide a usable layout on common desktop and laptop screen sizes. |
| NFR-USE-06 | API errors shall use a consistent JSON envelope with a stable error code, message, and request ID, with details or retry time when applicable, as defined in the Use Case Catalog. |

## 5.6 Portability and Deployment

| ID | Requirement |
|---|---|
| NFR-PORT-01 | The application components shall be containerizable using Docker. |
| NFR-PORT-02 | The development and demonstration environment shall be deployable using Docker Compose. |
| NFR-PORT-03 | Application configuration shall be externalized so that environment-specific values do not need to be hardcoded. |
| NFR-PORT-04 | The system shall support running the API server and Judge Worker as separate processes. |

## 5.7 Scalability

| ID | Requirement |
|---|---|
| NFR-SCALE-01 | The queue and consumer-group design shall permit multiple Judge Worker instances to consume jobs, although v1 deploys a single worker. |
| NFR-SCALE-02 | The API server and Judge Workers shall be deployable as separate processes and scalable independently in a future release. |
| NFR-SCALE-03 | The system shall not rely on in-memory API server state for persistent submission processing. |
| NFR-SCALE-04 | Database access and job processing shall be designed to accommodate future increases in users and submissions; multi-worker load testing is out of scope for v1. |

---

# 6. Use Case Modeling

## 6.1 Actors

The system has four primary actors. The Outbox Dispatcher is an internal process, not a separate actor or use case.

| Actor | Type | Description |
|---|---|---|
| Guest | Human | A visitor who has not logged in. |
| User | Human | An authenticated user who practices programming and submits solutions. |
| Administrator | Human | A privileged user who manages platform content and accounts. |
| Judge Worker | System | An automated component that processes, recovers, and evaluates submissions. |

## 6.2 Actor Generalization

Guest and User are separate actors; both participate in the common public browsing, search, problem-detail, and leaderboard use cases. Administrator inherits User capabilities and additionally participates in administrator-only use cases. Judge Worker is a separate system actor and is not part of the human-user hierarchy.

## 6.3 Use Case Groups

### Group A – Guest and Common

| ID | Use Case | Description |
|---|---|---|
| UC-COM-01 | Browse Problems | Browse the paginated list of active, published problems. |
| UC-COM-02 | Search Problems | Search and filter public problems using supported criteria. |
| UC-COM-03 | View Problem Details | View a published problem, sample test cases, and public statistics. |
| UC-COM-04 | View Leaderboard | View the public, paginated global leaderboard. |
| UC-G-01 | Register Account | Create a new user account. |
| UC-G-02 | Log In | Authenticate using an existing account. |

### Group B – User

#### B.1 Authentication and Account

| ID | Use Case | Description |
|---|---|---|
| UC-U-A-01 | Log Out | End the current authenticated session. |
| UC-U-A-02 | View Account Information | View personal account information. |
| UC-U-A-03 | Update Account Information | Update permitted account information. |
| UC-U-A-04 | Change Password | Change the account password and invalidate previously issued tokens. |

#### B.2 Problem Practice

| ID | Use Case | Description |
|---|---|---|
| UC-U-P-01 | Write Solution | Write and edit source code using Monaco Editor. |
| UC-U-P-02 | Select Programming Language | Select C++17 or Python 3. |
| UC-U-P-03 | Submit Solution | Submit source code for asynchronous evaluation. |

#### B.3 Submission and History

| ID | Use Case | Description |
|---|---|---|
| UC-U-S-01 | View Submission Status | View the current processing status of a submission. |
| UC-U-S-02 | View Submission Result | View the final verdict and available evaluation details. |
| UC-U-S-03 | View Submission History | View previous submissions made by the authenticated user. |
| UC-U-S-04 | View Submission Details | View the source code, language, problem, and result of an individual submission, subject to access restrictions. |

#### B.4 Progress

| ID | Use Case | Description |
|---|---|---|
| UC-U-ST-01 | View Own Statistics | View attempted and solved problems, breakdowns, acceptance rate, and recent submissions. |

### Group C – Administrator

#### C.1 Problem Management

| ID | Use Case | Description |
|---|---|---|
| UC-AD-P-01 | Create Problem | Create a new programming problem. |
| UC-AD-P-02 | Update Problem | Modify an existing programming problem. |
| UC-AD-P-03 | Delete / Deactivate Problem | Deactivate or reactivate a problem without physically deleting it. |
| UC-AD-P-04 | Manage Problem Publication | Change the publication or visibility status of a problem. |

#### C.2 Test Case Management

| ID | Use Case | Description |
|---|---|---|
| UC-AD-T-01 | Create Test Case | Add a test case to a programming problem. |
| UC-AD-T-02 | Update Test Case | Modify an existing test case. |
| UC-AD-T-03 | Delete Test Case | Remove a test case. |
| UC-AD-T-04 | Manage Test Case Type | Define whether a test case is a sample or hidden test case. |
| UC-AD-T-05 | Reorder Test Cases | Change test-case execution order while preserving a unique, contiguous order. |

#### C.3 User Management

| ID | Use Case | Description |
|---|---|---|
| UC-AD-U-01 | View User List | View registered user accounts. |
| UC-AD-U-02 | View User Details | View permitted information about a selected user. |
| UC-AD-U-03 | Manage User Status | Change a user's account status where authorized. |

#### C.4 Submission Management

| ID | Use Case | Description |
|---|---|---|
| UC-AD-S-01 | View Any Submission | List, filter, and inspect any submission in read-only mode without exposing hidden test-case data. |

### Group D – Judge Worker

| ID | Use Case | Description |
|---|---|---|
| UC-SYS-J-01 | Process Submission | Consume a committed job, judge the submission, persist the result, and acknowledge it safely. |
| UC-SYS-J-02 | Recover Pending Submission | Recover abandoned jobs and safely resume or terminate judging. |

## 6.4 Use Case Modeling Notes

1. Common public use cases explicitly list Guest and User; Administrator participates through inherited User behavior.
2. Administrative endpoints require backend authorization, including when an Administrator invokes inherited User features.
3. The Outbox Dispatcher publishes committed judge events internally and is not a standalone actor or use case.
4. The Judge Worker handles background processing initiated by UC-U-P-03 – Submit Solution; it has no user interface.
5. C++17 is compiled once per submission; Python 3 is syntax-checked before execution. Each test case runs in a fresh isolated container.
6. Judging is sequential and stops at the first failing test case; results are stored only for executed cases.
7. Redis Streams provides asynchronous job delivery. PostgreSQL remains the authoritative source for submission and result data.
8. The frontend polls submission status until `COMPLETED` or `INTERNAL_ERROR`; the latter is a system status, not a verdict.

---

# 7. Requirement Traceability and Future Specifications

The requirements in this document are derived from the v1 Project Scope and trace to the use cases in the Use Case Catalog. The following artifacts will use these requirements:

| Next Artifact | Related SRS Sections |
|---|---|
| Use Case Diagram and Detailed Specifications | Section 6 |
| Entity Relationship Diagram (ERD) | Sections 4.1–4.7 |
| Database Schema | Sections 4 and 5 |
| System Component Architecture | Sections 2 and 5 |
| REST API Specification | Sections 4 and 6 |
| Judge System Technical Specification | FR-JUDGE-01 to FR-JUDGE-18 and NFR-SEC / NFR-REL |
| Test Plan and Test Cases | All Functional and Non-Functional Requirements |

### 7.1 Use Case-to-Requirement Traceability

| Use Case | SRS Requirements |
|---|---|
| UC-COM-01 – Browse Problems | FR-PROB-01 |
| UC-COM-02 – Search Problems | FR-PROB-02 |
| UC-COM-03 – View Problem Details | FR-PROB-03, FR-PROB-04, FR-PROB-10 |
| UC-COM-04 – View Leaderboard | FR-PROG-02 |
| UC-G-01 – Register Account | FR-AUTH-01, FR-AUTH-11, FR-AUTH-12 |
| UC-G-02 – Log In | FR-AUTH-02, FR-AUTH-04, FR-AUTH-09, FR-AUTH-10 |
| UC-U-A-01 – Log Out | FR-AUTH-03 |
| UC-U-A-02 – View Account Information | FR-AUTH-04, FR-AUTH-05 |
| UC-U-A-03 – Update Account Information | FR-AUTH-04, FR-AUTH-06 |
| UC-U-A-04 – Change Password | FR-AUTH-04, FR-AUTH-08, FR-AUTH-09, FR-AUTH-12 |
| UC-U-P-01 – Write Solution | FR-SUB-01 |
| UC-U-P-02 – Select Programming Language | FR-SUB-02, FR-SUB-03 |
| UC-U-P-03 – Submit Solution | FR-SUB-04 to FR-SUB-07, FR-JUDGE-01, FR-JUDGE-02, FR-JUDGE-15 |
| UC-U-S-01 – View Submission Status | FR-SUB-08, FR-SUB-11 |
| UC-U-S-02 – View Submission Result | FR-SUB-10, FR-JUDGE-11, FR-JUDGE-12 |
| UC-U-S-03 – View Submission History | FR-SUB-09, FR-SUB-11 |
| UC-U-S-04 – View Submission Details | FR-SUB-07, FR-SUB-10 |
| UC-U-ST-01 – View Own Statistics | FR-PROG-01 |
| UC-AD-P-01 – Create Problem | FR-ADMIN-01, FR-PROB-05, FR-PROB-09 |
| UC-AD-P-02 – Update Problem | FR-ADMIN-01, FR-PROB-06, FR-PROB-09 |
| UC-AD-P-03 – Delete / Deactivate Problem | FR-ADMIN-01, FR-PROB-07 |
| UC-AD-P-04 – Manage Problem Publication | FR-ADMIN-01, FR-PROB-08 |
| UC-AD-T-01 – Create Test Case | FR-ADMIN-01, FR-TC-01, FR-TC-02, FR-TC-09 |
| UC-AD-T-02 – Update Test Case | FR-ADMIN-01, FR-TC-04, FR-TC-09 |
| UC-AD-T-03 – Delete Test Case | FR-ADMIN-01, FR-TC-05, FR-TC-09 |
| UC-AD-T-04 – Manage Test Case Type | FR-ADMIN-01, FR-TC-03, FR-TC-07, FR-TC-09 |
| UC-AD-T-05 – Reorder Test Cases | FR-ADMIN-01, FR-TC-08, FR-TC-09 |
| UC-AD-U-01 – View User List | FR-ADMIN-01, FR-ADMIN-02 |
| UC-AD-U-02 – View User Details | FR-ADMIN-01, FR-ADMIN-07 |
| UC-AD-U-03 – Manage User Status | FR-ADMIN-01, FR-ADMIN-03, FR-AUTH-09 |
| UC-AD-S-01 – View Any Submission | FR-ADMIN-01, FR-ADMIN-06, FR-SUB-10 |
| UC-SYS-J-01 – Process Submission | FR-JUDGE-03 to FR-JUDGE-12, FR-JUDGE-15 to FR-JUDGE-18 |
| UC-SYS-J-02 – Recover Pending Submission | FR-JUDGE-13, FR-JUDGE-14, FR-JUDGE-16, FR-JUDGE-18 |

# 8. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial structure. |
| 2.0 | 2026-11-13 | Updated the SRS to align with the current use-case specifications and v1 business rules; revised scope, requirements, use-case inventory, and traceability while preserving the main section structure. |