# Software Requirements Specification (SRS)

**Arbiter - Online Judge Platform**

**Version:** 1.1 – Draft
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

Arbiter is a web-based programming practice and automated code evaluation system inspired by platforms such as LeetCode.

The platform provides an environment in which users can browse programming problems, write solutions using an integrated code editor, submit source code, and receive automatically generated evaluation results.

The system consists of two major parts:

- **Core Platform:** Handles user accounts, programming problems, submissions, submission history, and administrative operations.
- **Judge System:** Processes submissions asynchronously, compiles source code when necessary, executes programs against test cases in isolated Docker environments, evaluates their outputs, and stores the results.

The platform will initially support the following programming languages:

- C++17 (g++)
- Python 3
- Go

The main technologies are:

- **Frontend:** React with TypeScript.
- **Code Editor:** Monaco Editor.
- **Backend:** Go, following a Modular Monolith architecture.
- **Database:** PostgreSQL.
- **Message Queue:** Redis Streams.
- **Code Execution Environment:** Docker containers.
- **Result Updates:** HTTP Polling.

## 1.3 Definitions and Abbreviations

| Term              | Definition                                                                |
|-------------------|---------------------------------------------------------------------------|
| Online Judge (OJ) | A system that automatically evaluates submitted programming solutions.    |
| Submission        | Source code submitted by a user for evaluation.                           |
| Judge Worker      | A background process responsible for compiling and executing submissions. |
| Test Case         | A predefined input and expected output used to evaluate a program.        |
| Sample Test Case  | A test case publicly displayed to users.                                  |
| Hidden Test Case  | A test case whose input and expected output are not exposed to users.     |
| Verdict           | The final evaluation outcome of a submission.                             |
| Sandbox           | An isolated execution environment for running untrusted source code.      |
| MVP               | Minimum Viable Product.                                                   |
| API               | Application Programming Interface.                                        |
| SRS               | Software Requirements Specification.                                      |

## 1.4 References

- [Project Proposal](../../ProjectProposal/ProjectProposal.md) – Online Judge Platform.
- Requirements and architecture decisions agreed upon during project analysis.
- Documentation of React, Go, PostgreSQL, Redis Streams, Docker, and Monaco Editor.

---

# 2. Project Overview

## 2.1 Product Perspective

Arbiter is a standalone web application consisting of a frontend, backend API, persistent database, asynchronous job queue, and separate Judge Worker process.

The frontend communicates with the backend through HTTP APIs. The backend manages business logic and persistent data in PostgreSQL. When a user submits source code, the backend creates a submission record and dispatches a judging event through Redis Streams.

A separate Judge Worker consumes queued jobs, retrieves the required data from PostgreSQL, and executes the submitted program in an isolated Docker environment.

After evaluation, the worker persists the results in PostgreSQL. The frontend periodically requests the submission status through HTTP Polling until the evaluation is completed.

PostgreSQL is the system's primary source of truth. Redis is used for asynchronous job delivery and may additionally support caching where appropriate.

## 2.2 Product Functions

The system provides the following major functions:

1. **Authentication and Account Management**

- User registration and login.
- User authentication and account information management.
- Basic user management by administrators.

2. **Problem Management**

- Browse and search programming problems.
- View problem descriptions and sample test cases.
- Create, update, and manage programming problems.

3. **Code Editor**

- Write and edit source code using Monaco Editor.
- Select a supported programming language.
- Submit source code for automated evaluation.

4. **Submission Management**

- Create and track submissions.
- View submission status and verdict.
- View submission history and evaluation details.

5. **Judge System**

- Receive and process submission jobs.
- Compile source code where necessary.
- Execute programs against test cases.
- Evaluate program outputs and determine verdicts.
- Persist evaluation results.

6. **Administration**

- Manage programming problems.
- Manage sample and hidden test cases.
- Manage user accounts.

## 2.3 User Classes and Characteristics

### Guest

A visitor who has not authenticated.

Guest users can access publicly available programming problems and view their descriptions and sample test cases. They must authenticate before submitting source code.

### User

An authenticated user who uses the platform for programming practice.

Users can manage their own account information, browse problems, write and submit solutions, and view their submission history and results.

### Administrator

A privileged user responsible for maintaining the platform's content and users.

Administrators can manage programming problems, test cases, and user accounts.

### Judge System

An automated system component responsible for processing programming submissions.

It consumes submission jobs, compiles and executes source code, evaluates test cases, and records evaluation results. It is not a human user.

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
10. The initial release must support C++17, Python 3, and Go.

## 2.6 Assumptions and Dependencies

- Users have access to a modern web browser and an internet connection.
- The deployment environment supports Go, PostgreSQL, Redis, and Docker.
- The required compilers and interpreters are available to the Judge Worker execution environment.
- Administrators are responsible for creating valid problem descriptions and test cases.
- The initial platform operates with a predefined set of programming languages and execution limits.

---

# 3. Project Scope

## 3.1 In-Scope Features

The initial release focuses on the Core Platform and includes the following modules.

| Module                     | Scope                                                                                    |
|----------------------------|------------------------------------------------------------------------------------------|
| Authentication and Account | Registration, login, logout, account information, basic user management.                 |
| Problem Management         | Problem listing, searching, viewing details, and administrative problem management.      |
| Test Case Management       | Creating, updating, deleting, and organizing sample and hidden test cases.               |
| Code Editor                | Source-code editing with Monaco Editor and programming-language selection.               |
| Submission Management      | Submission creation, status tracking, result viewing, and submission history.            |
| Judge System               | Asynchronous job processing, compilation, execution, evaluation, and result persistence. |
| Basic Administration       | Managing users, programming problems, and test cases.                                    |

## 3.2 Out-of-Scope Features

The following features are excluded from the initial Core MVP and may be considered for future development:

- Programming contests.
- Discussion forums and comments.
- Global leaderboard.
- Advanced user analytics and statistics.
- AI-powered code review.
- Plagiarism detection.

These features are not required for the initial release.

## 3.3 Project Goals

The project aims to:

1. Provide a centralized platform for programming practice.
2. Allow users to submit solutions in multiple programming languages.
3. Automatically evaluate submitted programs against predefined test cases.
4. Provide clear and reliable submission results.
5. Provide administrators with tools to manage problems, test cases, and users.
6. Establish a modular and maintainable architecture that can support future expansion.

## 3.4 Core MVP Acceptance Workflow

The initial release is considered functionally complete when the following workflow can be performed:

1. An administrator creates a programming problem.
2. The administrator adds sample and hidden test cases.
3. A user registers or logs into the platform.
4. The user opens a programming problem.
5. The user writes a solution using Monaco Editor.
6. The user selects C++17, Python 3, or Go.
7. The user submits the source code.
8. The backend creates a submission and dispatches a job through Redis Streams.
9. A Judge Worker receives and processes the job.
10. The worker compiles the source code when required and executes the program against the problem's test cases in isolated Docker environments.
11. The worker determines the final verdict and persists the result.
12. The frontend retrieves the submission status through HTTP Polling and displays the result.
13. The user can view the submission in their submission history.

---

# 4. Functional Requirements

Functional requirements describe the operations and services that the system must provide.

## 4.1 Authentication and Account Management

| ID         | Requirement                                                                                       | Priority |
|------------|---------------------------------------------------------------------------------------------------|----------|
| FR-AUTH-01 | The system shall allow guests to register an account using the required registration information. | High     |
| FR-AUTH-02 | The system shall allow registered users to log in using their credentials.                        | High     |
| FR-AUTH-03 | The system shall allow authenticated users to log out.                                            | High     |
| FR-AUTH-04 | The system shall authenticate users before granting access to protected functions.                | High     |
| FR-AUTH-05 | The system shall allow users to view their own account information.                               | High     |
| FR-AUTH-06 | The system shall allow users to update permitted account information.                             | Medium   |
| FR-AUTH-07 | The system shall enforce role-based access control for administrative functions.                  | High     |

## 4.2 Problem Management

| ID         | Requirement                                                                                       | Priority |
|------------|---------------------------------------------------------------------------------------------------|----------|
| FR-PROB-01 | The system shall display a list of publicly available programming problems.                       | High     |
| FR-PROB-02 | The system shall allow users to search for programming problems by supported criteria.            | Medium   |
| FR-PROB-03 | The system shall allow users to view a problem's description and relevant information.            | High     |
| FR-PROB-04 | The system shall display sample test cases associated with a problem.                             | High     |
| FR-PROB-05 | The system shall allow administrators to create programming problems.                             | High     |
| FR-PROB-06 | The system shall allow administrators to update programming problems.                             | High     |
| FR-PROB-07 | The system shall allow administrators to delete or deactivate programming problems.               | High     |
| FR-PROB-08 | The system shall allow administrators to manage the visibility or publication status of problems. | Medium   |

## 4.3 Test Case Management

| ID       | Requirement                                                                                       | Priority |
|----------|---------------------------------------------------------------------------------------------------|----------|
| FR-TC-01 | The system shall allow administrators to create test cases for a programming problem.             | High     |
| FR-TC-02 | The system shall allow administrators to specify the input and expected output of each test case. | High     |
| FR-TC-03 | The system shall distinguish between sample and hidden test cases.                                | High     |
| FR-TC-04 | The system shall allow administrators to update existing test cases.                              | High     |
| FR-TC-05 | The system shall allow administrators to delete test cases.                                       | High     |
| FR-TC-06 | The system shall preserve the association between each test case and its programming problem.     | High     |
| FR-TC-07 | The system shall prevent ordinary users from accessing hidden test-case data.                     | High     |

## 4.4 Code Editor and Submission Management

| ID | Requirement | Priority |
|-----------|---|---|
| FR-SUB-01 | The system shall provide an integrated source-code editor using Monaco Editor. | High |
| FR-SUB-02 | The system shall allow users to select a supported programming language. | High |
| FR-SUB-03 | The system shall support C++17, Python 3, and Go for submission evaluation. | High |
| FR-SUB-04 | The system shall allow authenticated users to submit source code for a selected programming problem. | High |
| FR-SUB-05 | The system shall validate submission data before creating a submission record. | High |
| FR-SUB-06 | The system shall assign a unique identifier to each submission. | High |
| FR-SUB-07 | The system shall record the submission owner, problem, programming language, source code, and creation time. | High |
| FR-SUB-08 | The system shall allow users to view the status of their submissions. | High |
| FR-SUB-09 | The system shall allow users to view their submission history. | High |
| FR-SUB-10 | The system shall allow users to view the evaluation details of their submissions, subject to information-disclosure restrictions. | Medium |

## 4.5 Judge System

| ID | Requirement | Priority |
|---|---|---|
| FR-JUDGE-01 | The system shall create a judging job when a valid submission is accepted by the backend. | High |
| FR-JUDGE-02 | The system shall publish judging jobs to Redis Streams. | High |
| FR-JUDGE-03 | The Judge Worker shall consume submission jobs from the configured Redis consumer group. | High |
| FR-JUDGE-04 | The Judge Worker shall retrieve submission and problem data from PostgreSQL. | High |
| FR-JUDGE-05 | The Judge Worker shall compile source code when required by the selected programming language. | High |
| FR-JUDGE-06 | The Judge Worker shall execute submitted programs in isolated Docker environments. | High |
| FR-JUDGE-07 | The Judge Worker shall execute each test case in a separate execution process and isolated sandbox. | High |
| FR-JUDGE-08 | The Judge Worker shall enforce configured time and memory limits during execution. | High |
| FR-JUDGE-09 | The Judge Worker shall capture program output and relevant execution information. | High |
| FR-JUDGE-10 | The Judge Worker shall compare actual program output with the expected test-case output according to the configured comparison rules. | High |
| FR-JUDGE-11 | The Judge Worker shall determine the final submission verdict based on compilation and test-case evaluation results. | High |
| FR-JUDGE-12 | The Judge Worker shall persist the evaluation result in PostgreSQL. | High |
| FR-JUDGE-13 | The system shall recover or safely reprocess jobs that remain pending after a worker failure. | High |
| FR-JUDGE-14 | The system shall prevent duplicate job processing from producing inconsistent submission results. | High |

### 4.5.1 Submission Statuses

The system shall maintain the following submission processing statuses:

| Status         | Description                                                                 |
|----------------|-----------------------------------------------------------------------------|
| QUEUED         | The submission has been accepted and is waiting for processing.             |
| COMPILING      | The submission is undergoing compilation.                                   |
| JUDGING        | The submission is being executed and evaluated against test cases.          |
| COMPLETED      | The evaluation process has finished.                                        |
| INTERNAL_ERROR | An internal system or infrastructure error has prevented normal evaluation. |

### 4.5.2 Submission Verdicts

The system shall support the following verdicts:

| Verdict                     | Description                                                          |
|-----------------------------|----------------------------------------------------------------------|
| ACCEPTED (AC)               | The program passes all required test cases.                          |
| WRONG_ANSWER (WA)           | The program produces an incorrect output for at least one test case. |
| TIME_LIMIT_EXCEEDED (TLE)   | The program exceeds the configured execution time limit.             |
| MEMORY_LIMIT_EXCEEDED (MLE) | The program exceeds the configured memory limit.                     |
| RUNTIME_ERROR (RE)          | The program encounters an error during execution.                    |
| COMPILATION_ERROR (CE)      | The source code cannot be compiled successfully.                     |

`INTERNAL_ERROR` is represented as a processing status rather than a user-code verdict. This distinction prevents infrastructure failures from being incorrectly reported as programming mistakes.

## 4.6 Administration and User Management

| ID          | Requirement                                                                      | Priority |
|-------------|----------------------------------------------------------------------------------|----------|
| FR-ADMIN-01 | The system shall restrict administrative functions to authorized administrators. | High     |
| FR-ADMIN-02 | The system shall allow administrators to view user accounts.                     | High     |
| FR-ADMIN-03 | The system shall allow administrators to manage user account status.             | Medium   |
| FR-ADMIN-04 | The system shall allow administrators to manage programming problems.            | High     |
| FR-ADMIN-05 | The system shall allow administrators to manage test cases.                      | High     |

---

# 5. Non-Functional Requirements

Non-functional requirements define the quality attributes and operational constraints of the system.

## 5.1 Performance

| ID | Requirement |
|---|---|
| NFR-PERF-01 | Under normal operating conditions, common read-only API requests should respond within 2 seconds for at least 95% of requests, excluding external infrastructure delays. |
| NFR-PERF-02 | Submission creation shall return an acknowledgement without waiting for the entire judging process to finish. |
| NFR-PERF-03 | The system shall process judging jobs asynchronously so that long-running submissions do not block API requests. |
| NFR-PERF-04 | The frontend shall periodically retrieve submission status without continuously reloading the entire page. |
| NFR-PERF-05 | The system shall support configurable resource limits for program execution. |

## 5.2 Security

| ID | Requirement |
|---|---|
| NFR-SEC-01 | Passwords shall be stored using a secure password-hashing algorithm rather than plaintext. |
| NFR-SEC-02 | The system shall enforce authentication and authorization for protected resources. |
| NFR-SEC-03 | Users shall only be able to access their own private submission information unless explicitly authorized otherwise. |
| NFR-SEC-04 | Hidden test-case inputs and expected outputs shall not be exposed through public APIs. |
| NFR-SEC-05 | User-submitted source code shall be treated as untrusted input. |
| NFR-SEC-06 | Submitted programs shall execute in isolated environments with restricted CPU, memory, process count, filesystem access, and execution time. |
| NFR-SEC-07 | Execution containers shall not run in privileged mode and shall not receive unrestricted host access. |
| NFR-SEC-08 | Execution environments shall have network access disabled by default. |
| NFR-SEC-09 | The system shall validate and sanitize incoming data to reduce common application security risks. |
| NFR-SEC-10 | Sensitive configuration values and credentials shall not be exposed to the frontend or stored in source control. |

## 5.3 Reliability and Availability

| ID | Requirement |
|---|---|
| NFR-REL-01 | PostgreSQL shall serve as the primary source of truth for persistent application and submission data. |
| NFR-REL-02 | The system shall use a reliable mechanism to ensure that committed submissions are not silently lost before being queued for judging. |
| NFR-REL-03 | The system shall support recovery of unacknowledged Redis Stream messages after worker failures. |
| NFR-REL-04 | Job processing shall be idempotent so that repeated delivery does not create inconsistent results. |
| NFR-REL-05 | A submission result shall be acknowledged as successfully processed only after the result has been durably persisted. |
| NFR-REL-06 | The system shall distinguish infrastructure errors from errors caused by submitted programs. |

## 5.4 Maintainability

| ID | Requirement |
|---|---|
| NFR-MAINT-01 | The backend shall follow a modular structure that separates business domains and responsibilities. |
| NFR-MAINT-02 | The Judge Worker shall be independently executable from the HTTP API server. |
| NFR-MAINT-03 | The system shall use consistent coding conventions and naming standards. |
| NFR-MAINT-04 | The system shall provide sufficient logging to support debugging and operational monitoring. |
| NFR-MAINT-05 | Database schema changes shall be managed through versioned migrations. |
| NFR-MAINT-06 | Important business logic, especially submission processing and verdict evaluation, shall be testable independently. |

## 5.5 Usability

| ID | Requirement |
|---|---|
| NFR-USE-01 | The user interface shall provide clear navigation between problems, the code editor, submissions, and account functions. |
| NFR-USE-02 | The code editor shall provide standard programming-editor capabilities such as syntax highlighting, line numbers, indentation, and code navigation. |
| NFR-USE-03 | Submission statuses and verdicts shall be presented clearly and consistently. |
| NFR-USE-04 | The system shall display understandable feedback when an operation fails. |
| NFR-USE-05 | The application shall provide a usable layout on common desktop and laptop screen sizes. |

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
| NFR-SCALE-01 | The architecture shall allow multiple Judge Worker instances to consume jobs from the same Redis consumer group. |
| NFR-SCALE-02 | The API server and Judge Workers shall be capable of scaling independently. |
| NFR-SCALE-03 | The system shall avoid relying on in-memory API server state for persistent submission processing. |
| NFR-SCALE-04 | Database access and job processing shall be designed to accommodate future increases in users and submissions. |

---

# 6. Use Case Modeling

## 6.1 Actors

The system contains three primary actors. Judge System is an internal component of the system, so it isn't listed in the actor list.

| Actor ID | Actor         | Type              | Description                                                            |
|----------|---------------|-------------------|------------------------------------------------------------------------|
| ACT-01   | Guest         | Primary Actor     | A visitor who has not logged in.                                       |
| ACT-02   | User          | Primary Actor     | An authenticated user who practices programming and submits solutions. |
| ACT-03   | Administrator | Specialized Actor | A privileged user who manages platform content and accounts.           |

## 6.2 Actor Generalization

The User and Administrator actors may be modeled as a specialized form of Authenticated User, an abstract type of User in the use case diagram to represent common login-required browsing behavior.

Administrator may be modeled as a specialized form of User if administrative accounts share the ordinary account and authentication capabilities.

The Guest actor does not inherit Authenticated User and can access common public browsing behaviors.

Judge System is a separate internal system component and is not part of the human-user hierarchy.

## 6.3 Use Case Groups

### Group A – Guest

| ID        | Use Case             | Description                                               |
|-----------|----------------------|-----------------------------------------------------------|
| UC-COM-01 | Browse Problems      | View the list of publicly available programming problems. |
| UC-COM-02 | Search Problems      | Search for problems using supported criteria.             |
| UC-COM-03 | View Problem Details | View a problem's description and sample test cases.       |
| UC-G-01   | Register Account     | Create a new user account.                                |
| UC-G-02   | Log In               | Authenticate using an existing account.                   |

Three use cases UC-COM-01 to UC-COM-03 are common features used by both Guest and User.

### Group B – User

#### B.1 Authentication and Account

| ID        | Use Case                   | Description                            |
|-----------|----------------------------|----------------------------------------|
| UC-U-A-01 | Log Out                    | End the current authenticated session. |
| UC-U-A-02 | View Account Information   | View personal account information.     |
| UC-U-A-03 | Update Account Information | Update permitted account information.  |

#### B.2 Problem and Practice

| ID        | Use Case                    | Description                                              |
|-----------|-----------------------------|----------------------------------------------------------|
| UC-U-P-01 | Write Solution              | Write and edit source code using Monaco Editor.          |
| UC-U-P-02 | Select Programming Language | Select C++17, Python 3, or Go.                           |
| UC-U-P-03 | Submit Solution             | Submit source code for automated evaluation.             |

#### B.3 Submission and History

| ID        | Use Case                | Description |
|-----------|-------------------------|-------------|
| UC-U-S-01 | View Submission Status  | View the current processing status of a submission. |
| UC-U-S-02 | View Submission Result  | View the final verdict and available evaluation details. |
| UC-U-S-03 | View Submission History | View previous submissions made by the authenticated user. |
| UC-U-S-04 | View Submission Details | View the source code, language, problem, and result of an individual submission, subject to access restrictions. |

### Group C – Administrator

#### C.1 Problem Management

| ID         | Use Case                     | Description                                               |
|------------|------------------------------|-----------------------------------------------------------|
| UC-AD-P-01 | Create Problem               | Create a new programming problem.                         |
| UC-AD-P-02 | Update Problem               | Modify an existing programming problem.                   |
| UC-AD-P-03 | Delete Problem               | Make a problem unavailable.                               |
| UC-AD-P-04 | Manage Problem Publication   | Change the publication or visibility status of a problem. |

#### C.2 Test Case Management

| ID         | Use Case              | Description                                                 |
|------------|-----------------------|-------------------------------------------------------------|
| UC-AD-T-01 | Create Test Case      | Add a test case to a programming problem.                   |
| UC-AD-T-02 | Update Test Case      | Modify an existing test case.                               |
| UC-AD-T-03 | Delete Test Case      | Remove a test case.                                         |
| UC-AD-T-04 | Manage Test Case Type | Define whether a test case is a sample or hidden test case. |

#### C.3 User Management

| ID         | Use Case           | Description                                       |
|------------|--------------------|---------------------------------------------------|
| UC-AD-U-01 | View User List     | View registered user accounts.                    |
| UC-AD-U-02 | View User Details  | View permitted information about a selected user. |
| UC-AD-U-03 | Manage User Status | Change a user's account status where authorized.  |

## 6.4 Internal System Processes - Judge System

Since Judge System is an internal system component, we won't list its features as use cases. However, these are still listed here as they are an integral part of Arbiter.

| ID        | Use Case                  | Description                                                                          |
|-----------|---------------------------|--------------------------------------------------------------------------------------|
| PROC-J-01 | Receive Submission Job    | Receive a submission job from Redis Streams.                                         |
| PROC-J-02 | Retrieve Submission Data  | Retrieve the submission, problem, and test-case data required for evaluation.        |
| PROC-J-03 | Compile Source Code       | Compile source code when required by the selected language.                          |
| PROC-J-04 | Execute Test Case         | Execute the submitted program against an individual test case in an isolated sandbox.|
| PROC-J-05 | Evaluate Test Case        | Compare the actual output with the expected output and evaluate execution limits.    |
| PROC-J-06 | Determine Final Verdict   | Determine the final result based on compilation and test-case evaluation.            |
| PROC-J-07 | Persist Submission Result | Save submission status, verdict, and evaluation details in PostgreSQL.               |
| PROC-J-08 | Recover Pending Job       | Recover and safely reprocess a job abandoned by a failed worker.                     |

## 6.5 Use Case Modeling Notes

1. Guest and User share public problem-browsing capabilities. These common use cases should not be duplicated unnecessarily in detailed specifications.
2. The User actor inherits the capabilities of Guest after successful authentication.
3. Administrator may inherit common User capabilities, while administrative use cases require additional authorization.
4. The Judge System handles background processing initiated by a user's submission. It does not represent a human-operated interface.
5. Compilation is performed once per submission where applicable. The compiled artifact is reused for the submission's individual test-case executions.
6. Each test case is executed in a separate isolated sandbox. Execution is initially sequential, and evaluation may stop after the first failing test case.
7. Redis Streams provides asynchronous job delivery. PostgreSQL remains the authoritative source for submission and result data.
8. The frontend uses HTTP Polling to retrieve submission status and results.

---

# 7. Requirement Traceability and Future Specifications

The requirements in this document will be used as the basis for the following design artifacts:

| Next Artifact                                | Related SRS Sections                             |
|----------------------------------------------|--------------------------------------------------|
| Use Case Diagram and Detailed Specifications | Section 6                                        |
| Entity Relationship Diagram (ERD)            | Sections 4.1–4.6                                 |
| Database Schema                              | Sections 4 and 5                                 |
| System Component Architecture                | Sections 2 and 5                                 |
| REST API Specification                       | Sections 4 and 6                                 |
| Judge System Technical Specification         | FR-JUDGE-01 to FR-JUDGE-14 and NFR-SEC / NFR-REL |
| Test Plan and Test Cases                     | All Functional and Non-Functional Requirements   |

**End**