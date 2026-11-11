# PROJECT PROPOSAL

**Arbiter - An Online Judge Platform**

Version: 1.0
Project Type: Web Application
Project Scope: Full-stack Web Application with Automated Code Execution System

---

# 1. Project Overview

## 1.1. Project Title

**Arbiter – An Online Programming Practice and Automated Code Evaluation System**

## 1.2. Introduction

Arbiter is a web-based application designed to provide an environment where users can practice programming, solve algorithmic problems, submit source code, and receive automated evaluation results.

The platform allows users to browse programming problems, write solutions using a supported programming language, submit their source code, and receive evaluation results based on predefined test cases.

In addition to the core programming practice functionality, the platform provides features such as problem categorization, submission history, user statistics, leaderboards, programming contests, and discussion boards.

A central component of the system is the Judge System, which is responsible for compiling and executing submitted source code in an isolated environment, evaluating its correctness, and measuring resource consumption.

The project aims to demonstrate practical knowledge of full-stack web development, backend engineering, database design, asynchronous task processing, containerization, and secure code execution.

## 1.3. Problem Statement

Traditional programming practice often requires learners to manually compile and execute their programs, prepare test cases, and compare their outputs with expected results.

This process can become inconvenient when learners need to evaluate solutions against a large number of test cases or practice programming problems systematically.

An online automated judging platform addresses these limitations by providing:

- A centralized collection of programming problems.
- An integrated coding and submission environment.
- Automated source code compilation and execution.
- Consistent evaluation against predefined test cases.
- Performance measurement and submission history.
- A competitive environment through programming contests and leaderboards.

The proposed system aims to provide these capabilities through a unified web application.

## 1.4. Project Objectives

The main objectives are:

1. Develop a full-stack online programming practice platform.
2. Implement a programming problem management system.
3. Build an automated code evaluation system supporting multiple programming languages.
4. Execute untrusted source code in isolated Docker containers.
5. Implement asynchronous submission processing using Redis.
6. Design a relational database to manage users, problems, test cases, submissions, and contests.
7. Provide user statistics, submission history, and leaderboards.
8. Develop an administrator interface for managing platform content.
9. Ensure that the system is maintainable, extensible, and reasonably secure.

## 1.5. Target Users

| User Role       | Description                                                                                    |
|-----------------|------------------------------------------------------------------------------------------------|
| Guest           | Visitors who can browse public problems and view public platform information.                  |
| Registered User | Users who can submit solutions, track progress, participate in contests, and discuss problems. |
| Administrator   | Users responsible for managing problems, test cases, users, and platform configuration.        |
| Judge Worker    | An internal system component responsible for compiling and evaluating submissions.             |

Judge Worker is a system component rather than a human user role.

---

# 2. Project Scope

## 2.1. In-Scope Features

The project will include the following functional modules:

### A. Authentication and Account Management

- User registration.
- User login and logout.
- Password hashing and verification.
- User profile management.
- Password changing.
- Role-based access control.
- Account status management.
- Authentication token management.

### B. Problem Management

- Browse programming problems.
- View problem descriptions.
- Search problems by title.
- Filter problems by difficulty.
- Filter problems by topic and tags.
- View problem constraints and examples.
- View supported programming languages.
- View public sample test cases.
- View problem statistics.

Each problem will contain:

- Problem title.
- Problem description.
- Input format.
- Output format.
- Constraints.
- Sample input and output.
- Difficulty.
- Topics and tags.
- Time limit.
- Memory limit.
- Test cases.
- Problem visibility and status.

### C. Code Editor and Submission

- Integrated code editor.
- Syntax highlighting.
- Language selection.
- Source code editing.
- Code submission.
- Code compilation and execution.
- Submission status tracking.
- Submission history.
- Submission detail viewing.

The initial implementation will support:

- C++17.
- Python 3.
- Go.

### D. Judge System

The Judge System will:

1. Receive a submission.
2. Validate its programming language and problem configuration.
3. Retrieve the corresponding test cases.
4. Create an isolated execution environment.
5. Compile the source code when necessary.
6. Execute the program against the test cases.
7. Capture standard output and standard error.
8. Measure execution time and memory usage.
9. Compare program output with expected output.
10. Determine the final verdict.
11. Save evaluation results.
12. Notify the frontend that evaluation has completed.

The system will support the following verdicts:

| Verdict                     | Description                                           |
|-----------------------------|-------------------------------------------------------|
| Accepted (AC)               | All test cases passed.                                |
| Wrong Answer (WA)           | Program output does not match expected output.        |
| Time Limit Exceeded (TLE)   | Program exceeded its execution time limit.            |
| Memory Limit Exceeded (MLE) | Program exceeded its memory limit.                    |
| Runtime Error (RE)          | Program terminated unexpectedly during execution.     |
| Compilation Error (CE)      | Source code failed to compile.                        |
| Internal Error (IE)         | An internal judging or infrastructure error occurred. |

### E. Submission Management

- View personal submissions.
- Filter submissions by problem.
- Filter submissions by verdict.
- View submission timestamps.
- View execution time.
- View memory consumption.
- View source code of previous submissions.
- View individual test-case results where permitted.

### F. User Progress and Statistics

- Total number of attempted problems.
- Total number of solved problems.
- Problems solved by difficulty.
- Problems solved by topic.
- Acceptance rate.
- Submission statistics.
- Recent activity.
- Solving streak.

### G. Leaderboard

- Global leaderboard.
- User ranking.
- Total solved problems.
- Contest ranking.
- Ranking based on contest scores.

### H. Programming Contests

- Create and manage contests.
- Configure contest start and end times.
- Add problems to contests.
- Register participants.
- Submit solutions during contests.
- Calculate contest scores.
- Display contest standings.
- Apply contest-specific ranking rules.

### I. Discussion System

- Create discussions for programming problems.
- View discussion threads.
- Post comments.
- Reply to comments.
- Edit and delete personal posts.
- Like or react to discussions.
- Report inappropriate content.

### J. Administrator Management

- Manage user accounts.
- Create, update, and delete problems.
- Manage problem categories and tags.
- Manage test cases.
- Configure time and memory limits.
- Manage contests.
- Moderate discussions.
- View submission statistics.
- Monitor Judge Worker status.

## 2.2. Out-of-Scope Features

To maintain a realistic development scope, the following features will not be included in the initial version:

- AI-powered code review.
- AI-generated problem solutions.
- Collaborative real-time code editing.
- Social login integrations.
- Paid subscriptions and premium problem access.
- Mobile applications.
- Advanced plagiarism detection.
- Distributed multi-region judging infrastructure.
- Support for arbitrary user-defined execution environments.

These features may be considered for future development.

---

# 3. Functional Requirements

The following requirements define the expected behavior of the system.

## 3.1. Authentication and Account Management

| ID     | Requirement                                                           | Priority |
|--------|-----------------------------------------------------------------------|----------|
| FR-001 | The system shall allow users to register accounts.                    | High     |
| FR-002 | The system shall allow users to authenticate using their credentials. | High     |
| FR-003 | The system shall allow authenticated users to update their profiles.  | Medium   |
| FR-004 | The system shall allow users to change their passwords.               | Medium   |
| FR-005 | The system shall enforce role-based access control.                   | High     |
| FR-006 | The administrator shall be able to manage user accounts.              | High     |

## 3.2. Problem Management

| ID     | Requirement                                                         | Priority |
|--------|---------------------------------------------------------------------|----------|
| FR-007 | Users shall be able to browse available problems.                   | High     |
| FR-008 | Users shall be able to search and filter problems.                  | High     |
| FR-009 | Users shall be able to view problem details.                        | High     |
| FR-010 | Administrators shall be able to create and update problems.         | High     |
| FR-011 | Administrators shall be able to manage problem tags and categories. | Medium   |
| FR-012 | Administrators shall be able to manage test cases.                  | High     |

## 3.3. Code Submission and Evaluation

| ID     | Requirement                                                            | Priority |
|--------|------------------------------------------------------------------------|----------|
| FR-013 | Authenticated users shall be able to submit source code.               | High     |
| FR-014 | The system shall validate the submitted programming language.          | High     |
| FR-015 | The system shall process submissions asynchronously.                   | High     |
| FR-016 | The Judge System shall compile source code when required.              | High     |
| FR-017 | The Judge System shall execute source code in an isolated environment. | High     |
| FR-018 | The Judge System shall evaluate output against predefined test cases.  | High     |
| FR-019 | The Judge System shall enforce time and memory limits.                 | High     |
| FR-020 | The system shall record submission verdicts and resource usage.        | High     |
| FR-021 | Users shall be able to view their submission history.                  | High     |
| FR-022 | Users shall be able to view evaluation details.                        | Medium   |

## 3.4. User Statistics and Leaderboard

| ID     | Requirement                                                             | Priority |
|--------|-------------------------------------------------------------------------|----------|
| FR-023 | The system shall calculate user solving statistics.                     | Medium   |
| FR-024 | Users shall be able to view their progress.                             | Medium   |
| FR-025 | Users shall be able to view the global leaderboard.                     | Medium   |
| FR-026 | The system shall update ranking information after relevant submissions. | Medium   |

## 3.5. Contest Management

| ID     | Requirement                                                     | Priority |
|--------|-----------------------------------------------------------------|----------|
| FR-027 | Administrators shall be able to create contests.                | Medium   |
| FR-028 | Users shall be able to register for available contests.         | Medium   |
| FR-029 | The system shall enforce contest start and end times.           | High     |
| FR-030 | Users shall be able to submit solutions during active contests. | High     |
| FR-031 | The system shall calculate contest scores.                      | High     |
| FR-032 | The system shall display contest standings.                     | Medium   |

## 3.6. Discussion Management

| ID     | Requirement                                             | Priority |
|--------|---------------------------------------------------------|----------|
| FR-033 | Users shall be able to create discussions.              | Medium   |
| FR-034 | Users shall be able to comment on discussions.          | Medium   |
| FR-035 | Users shall be able to edit and delete their own posts. | Medium   |
| FR-036 | Administrators shall be able to moderate discussions.   | Medium   |

---

# 4. Non-Functional Requirements

## 4.1. Performance

- Normal API requests should generally complete within 500 ms under the defined test workload, excluding operations that require external processing.
- Submission requests should return an acknowledgment without waiting for code execution to finish.
- The Judge System should process multiple submissions concurrently within configured resource limits.
- Database queries should be optimized through appropriate indexing and query design.

## 4.2. Security

- Passwords must be stored using secure password hashing.
- Protected API endpoints must require authentication.
- Authorization must be enforced on the backend.
- Source code must never be executed directly by the Go application process.
- User submissions must execute inside isolated containers.
- Containers must not run with privileged access.
- Network access should be disabled for submitted programs.
- CPU, memory, process count, and execution time must be restricted.
- Container filesystem access must be restricted.
- Secrets and database credentials must not be exposed to users.
- Administrative operations must be protected by role-based authorization.

## 4.3. Reliability

- Submission records must remain persistent.
- Failed jobs should be handled according to an explicit retry policy.
- The system should recover queued jobs after worker restarts.
- The system should prevent a single failed submission from affecting other submissions.
- Judge results should not be marked as Accepted if the evaluation process did not complete successfully.

## 4.4. Maintainability

- The backend should follow a modular architecture.
- Frontend components should be reusable.
- Business logic should be separated from HTTP handlers.
- Database operations should be separated from business logic.
- API responses should follow a consistent format.
- The project should include automated tests.

## 4.5. Scalability

- The architecture should allow multiple Judge Workers.
- Redis should support asynchronous job distribution.
- The backend should support concurrent requests.
- The system should allow horizontal scaling of stateless API instances.

## 4.6. Usability

- The interface should be responsive.
- The code editor should provide syntax highlighting.
- Submission results should be easy to understand.
- Problems should be searchable and filterable.
- Error messages should provide useful information without exposing internal infrastructure details.

---

# 5. Technology Stack

## 5.1. Frontend

**React**

Responsibilities:

- Build the user interface.
- Manage frontend application state.
- Communicate with backend APIs.
- Display problem descriptions.
- Provide an integrated code editor.
- Display submission results.
- Provide dashboards and administrative interfaces.

Suggested supporting libraries:

| Technology     | Purpose                              |
|----------------|--------------------------------------|
| React          | Frontend framework                   |
| TypeScript     | Static typing                        |
| Vite           | Development and build tooling        |
| React Router   | Client-side routing                  |
| TanStack Query | Server-state management              |
| Monaco Editor  | Code editing and syntax highlighting |
| Tailwind CSS   | Styling                              |
| Axios          | HTTP communication                   |

## 5.2. Backend

**Go**

Responsibilities:

- Implement REST APIs.
- Handle authentication and authorization.
- Implement business logic.
- Manage database operations.
- Process submission requests.
- Dispatch judging jobs.
- Manage contest scoring.
- Provide administrative APIs.

Suggested libraries:

| Technology              | Purpose                      |
|-------------------------|------------------------------|
| Go                      | Backend programming language |
| Gin or Chi              | HTTP routing                 |
| pgx or GORM             | PostgreSQL access            |
| golang-jwt/jwt          | JWT authentication           |
| go-playground/validator | Request validation           |
| golang-migrate          | Database migrations          |
| slog                    | Structured logging           |

## 5.3. Database

**PostgreSQL**

Responsibilities:

- Store user accounts.
- Store programming problems.
- Store test case metadata.
- Store source code submissions.
- Store judging results.
- Store contests and registrations.
- Store discussions and comments.
- Store user statistics.

PostgreSQL will serve as the primary source of persistent application data.

## 5.4. Cache and Message Queue

**Redis**

Responsibilities:

- Queue submission jobs.
- Cache frequently accessed data.
- Store temporary authentication-related data where appropriate.
- Support rate limiting.
- Support background processing coordination.

Redis will be used to decouple submission creation from code execution.

## 5.5. Containerization

**Docker**

Responsibilities:

- Provide isolated execution environments.
- Support multiple programming language runtimes.
- Ensure consistent compilation and execution environments.
- Restrict resources available to submitted programs.
- Each supported language will have a predefined execution image.

---

# 6. System Architecture

## 6.1. High-Level Architecture

The application will follow a modular client-server architecture with asynchronous job processing.

```
flowchart TB
    U[User]
    FE[React Frontend]
    API[Go Backend API]
    DB[(PostgreSQL)]
    R[(Redis Queue)]
    W[Judge Worker]
    D[Docker Execution Sandbox]

    U --> FE
    FE <-->|REST API| API
    API <--> DB
    API --> R
    R --> W
    W <--> DB
    W --> D
    D --> W
    API --> FE
```

## 6.2. Main Components

### A. React Frontend

The frontend is responsible for user interaction and presentation.

Main pages:

- Home Page.
- Login and Registration.
- Problem List.
- Problem Details.
- Code Submission.
- Submission History.
- Submission Details.
- User Profile.
- User Statistics.
- Leaderboard.
- Contest List.
- Contest Details.
- Discussion Board.
- Admin Dashboard.

### B. Go Backend API

The API server handles application-level requests and business logic.

Suggested internal modules:

- Authentication Module.
- User Module.
- Problem Module.
- Submission Module.
- Judge Integration Module.
- Contest Module.
- Discussion Module.
- Statistics Module.
- Administration Module.

### C. Judge Worker

The Judge Worker is a separate Go process responsible for processing submission jobs.

Its responsibilities include:

1. Consume jobs from Redis.
2. Retrieve submission information.
3. Retrieve the associated problem configuration and test cases.
4. Prepare the execution environment.
5. Compile source code.
6. Execute the program.
7. Collect execution metrics.
8. Determine the verdict.
9. Persist evaluation results.

The Judge Worker should operate independently from the HTTP API server so that judging workloads do not block normal application requests.

### D. Docker Execution Environment

Each submission is executed in a disposable container.

The execution environment must enforce:

- CPU limits.
- Memory limits.
- Execution timeout.
- Process count limits.
- Restricted filesystem access.
- Disabled network access.
- Non-root execution.
- Container cleanup after completion.

For a production-grade system, Docker alone should not be treated as a complete security boundary. Additional isolation measures, such as seccomp, AppArmor, or a stronger sandbox runtime, should be considered.

---

# 7. Core Business Workflows

## 7.1. User Code Submission Workflow

```
sequenceDiagram
    actor User
    participant FE as React
    participant API as Go API
    participant DB as PostgreSQL
    participant Redis
    participant Worker as Judge Worker
    participant Docker

    User->>FE: Submit source code
    FE->>API: POST /submissions
    API->>API: Validate request
    API->>DB: Create submission (Queued)
    API->>Redis: Enqueue job
    API-->>FE: Return submission ID

    Redis->>Worker: Deliver job
    Worker->>DB: Retrieve submission and test cases
    Worker->>Docker: Create isolated container
    Worker->>Docker: Compile and execute
    Docker-->>Worker: Execution results
    Worker->>DB: Save verdict and metrics
    Worker->>Docker: Remove container

    FE->>API: Poll submission status
    API->>DB: Retrieve submission result
    API-->>FE: Return updated status
    FE-->>User: Display verdict
```

The frontend may initially use polling to retrieve submission status. WebSocket or Server-Sent Events can be considered as an enhancement.

## 7.2. Submission State Machine

A submission should follow a defined lifecycle.

```
stateDiagram-v2
    [*] --> Queued
    Queued --> Running
    Queued --> InternalError
    Running --> Accepted
    Running --> WrongAnswer
    Running --> TimeLimitExceeded
    Running --> MemoryLimitExceeded
    Running --> RuntimeError
    Running --> CompilationError
    Running --> InternalError
```

The state machine ensures that submission transitions remain consistent.

A submission should not transition arbitrarily between final verdicts.

## 7.3. Contest Workflow

1. Administrator creates a contest.
2. Administrator adds problems.
3. Administrator configures start and end times.
4. Users register for the contest.
5. Contest becomes active at the scheduled start time.
6. Participants submit solutions.
7. The Judge System evaluates submissions.
8. Contest scores are calculated.
9. The leaderboard is updated.
10. Contest ends and final standings are published.

---

# 8. Database Design – Preliminary Entities

The initial database design will include the following entities.

| Entity              | Responsibility                              |
|---------------------|---------------------------------------------|
| User                | User account information                    |
| Role                | User role definitions                       |
| UserRole            | User-role relationships                     |
| Problem             | Programming problem information             |
| Tag                 | Problem tags                                |
| ProblemTag          | Problem-tag relationships                   |
| TestCase            | Test case metadata                          |
| Submission          | Submitted source code and status            |
| SubmissionResult    | Overall judging result                      |
| TestCaseResult      | Individual test case evaluation             |
| Contest             | Contest information                         |
| ContestProblem      | Problems assigned to contests               |
| ContestRegistration | Contest participants                        |
| ContestSubmission   | Contest-specific submission relationships   |
| Discussion          | Problem discussions                         |
| Comment             | Discussion comments                         |
| Reaction            | User reactions                              |
| ActivityLog         | Important user and administrator activities |

Additional implementation entities may be introduced when necessary.

## 8.1. Important Relationships

- One User can have many Submissions.
- One User can register for many Contests.
- One Problem can have many TestCases.
- One Problem can have many Submissions.
- One Problem can have many Tags.
- One Submission belongs to one User and one Problem.
- One Submission can have one overall SubmissionResult.
- One Submission can have multiple TestCaseResults.
- One Contest can contain many Problems.
- One Contest can have many Registrations.
- One Discussion can have many Comments.

## 8.2. Test Case Storage

Test case contents should be treated as sensitive judging data.

The database should store test case metadata, while actual input and expected output files can be stored in protected filesystem or object storage.

The Judge Worker should retrieve test case contents through a controlled mechanism.

Hidden test cases must never be exposed through public problem APIs.

---

# 9. API Design – Preliminary Endpoints

The backend will expose RESTful APIs.

## 9.1. Authentication

| Method | Endpoint              | Description      |
|--------|-----------------------|------------------|
| POST   | /api/v1/auth/register | Register account |
| POST   | /api/v1/auth/login    | Login            |
| POST   | /api/v1/auth/logout   | Logout           |
| GET    | /api/v1/auth/me       | Get current user |
| PATCH  | /api/v1/users/me      | Update profile   |

## 9.2. Problems

| Method | Endpoint                | Description         |
|--------|-------------------------|---------------------|
| GET    | /api/v1/problems        | List problems       |
| GET    | /api/v1/problems/       | Get problem details |
| GET    | /api/v1/tags            | List problem tags   |
| POST   | /api/v1/admin/problems  | Create problem      |
| PATCH  | /api/v1/admin/problems/ | Update problem      |
| DELETE | /api/v1/admin/problems/ | Delete problem      |

## 9.3. Submissions

| Method | Endpoint                      | Description                       |
|--------|-------------------------------|-----------------------------------|
| POST   | /api/v1/submissions           | Create submission                 |
| GET    | /api/v1/submissions           | List current user's submissions   |
| GET    | /api/v1/submissions/          | Get submission details            |
| GET    | /api/v1/problems//submissions | Get permitted problem submissions |

## 9.4. Contests

| Method | Endpoint                    | Description           |
|--------|-----------------------------|-----------------------|
| GET    | /api/v1/contests            | List contests         |
| GET    | /api/v1/contests/           | Get contest details   |
| POST   | /api/v1/contests//register  | Register for contest  |
| GET    | /api/v1/contests//standings | Get contest standings |

## 9.5. Discussions

| Method | Endpoint                      | Description       |
|--------|-------------------------------|-------------------|
| GET    | /api/v1/problems//discussions | List discussions  |
| POST   | /api/v1/problems//discussions | Create discussion |
| POST   | /api/v1/discussions//comments | Create comment    |
| PATCH  | /api/v1/discussions/          | Update discussion |
| DELETE | /api/v1/discussions/          | Delete discussion |

The endpoint list is preliminary and will be refined during detailed system design.

---

# 10. Judge System – Technical Design

This section describes the most technically important component of the project.

## 10.1. Supported Languages

Initial supported languages:

| Language | Compiler / Runtime | Execution Mode       |
|----------|--------------------|----------------------|
| C++17    | g++                | Compile then execute |
| Python 3 | Python interpreter | Direct execution     |
| Go       | Go compiler        | Compile then execute |

Each language will have a predefined execution configuration.

## 10.2. Evaluation Process

For each submission:

1. Validate source code size and language.
2. Create a temporary workspace.
3. Write source code into the workspace.
4. Start the appropriate execution container.
5. Compile the source code if necessary.
6. Stop immediately if compilation fails.
7. Execute the program against test cases.
8. Measure CPU time and memory usage.
9. Compare output with expected output.
10. Record the result.
11. Destroy temporary execution resources.

## 10.3. Output Comparison

The initial implementation will use token-based comparison.

For example:

Expected output:

```
10
20
30
```

Actual output:

```
10
20
30
```

The result is Accepted.

The comparator may ignore insignificant differences in whitespace between tokens while preserving the actual token values and order.

More advanced comparison modes can be added later.

## 10.4. Resource Limits

Each problem will define:

- Time Limit.
- Memory Limit.
- Maximum Source Code Size.

The Judge Worker will enforce these limits through the execution environment.

The implementation must also account for compilation time separately from program execution time.

## 10.5. Security Considerations

Executing arbitrary user-submitted code is a major security risk.

The implementation must not:

- Execute user code directly on the host.
- Run containers with privileged access.
- Mount sensitive host directories into containers.
- Expose Docker daemon access to the submitted program.
- Allow submitted programs to access application secrets.
- Allow unrestricted network communication.

Containers should use restricted permissions, resource quotas, controlled temporary storage, and appropriate isolation settings.

A dedicated Judge Worker environment is strongly recommended.

---

# 11. Development Plan

The project will be developed incrementally through the following phases.

| Phase    | Description                            | Estimated Time |
|----------|----------------------------------------|----------------|
| Phase 1  | Requirement Analysis and System Design |    10–12 hours |
| Phase 2  | Database Design and Backend Foundation |    12–16 hours |
| Phase 3  | Authentication and User Management     |     8–10 hours |
| Phase 4  | Problem Management                     |    10–12 hours |
| Phase 5  | Submission and Judge System            |    25–35 hours |
| Phase 6  | Frontend Development and Integration   |    15–20 hours |
| Phase 7  | Statistics and Leaderboard             |     8–12 hours |
| Phase 8  | Contest Management                     |    12–16 hours |
| Phase 9  | Discussion and Administration          |     8–12 hours |
| Phase 10 | Testing, Security and Deployment       |    12–18 hours |

**Estimated total: 120–163 hours.**

The phases may overlap when frontend and backend development can proceed independently.

## 11.1. Development Milestones

**Milestone 1 – Application Foundation**

- Project structure.
- Database connection.
- Authentication.
- Basic frontend.
- API infrastructure.

**Milestone 2 – Programming Practice**

- Problem management.
- Code editor.
- Submission API.
- Basic submission history.

**Milestone 3 – Automated Judge**

- Redis job queue.
- Judge Worker.
- Docker execution.
- Compilation and execution.
- Verdict calculation.

**Milestone 4 – Platform Features**

- User statistics.
- Leaderboard.
- Contest management.
- Discussion system.

**Milestone 5 – Finalization**

- Integration testing.
- Security testing.
- Performance testing.
- Docker deployment.
- Documentation.

---

# 12. Testing Strategy

## 12.1. Unit Testing

Test individual business logic components:

- Authentication validation.
- Problem filtering.
- Contest scoring.
- Submission state transitions.
- Output comparison.
- Verdict calculation.

## 12.2. Integration Testing

Test interactions between:

- Go API and PostgreSQL.
- Go API and Redis.
- Judge Worker and Redis.
- Judge Worker and PostgreSQL.
- Judge Worker and Docker.

## 12.3. Judge System Testing

Test different execution scenarios:

| Test Scenario               | Expected Result               |
|-----------------------------|-------------------------------|
| Correct solution            | Accepted                      |
| Incorrect output            | Wrong Answer                  |
| Infinite loop               | Time Limit Exceeded           |
| Excessive memory allocation | Memory Limit Exceeded         |
| Invalid syntax              | Compilation Error             |
| Runtime exception           | Runtime Error                 |
| Empty input handling        | Correct evaluation            |
| Multiple test cases         | All cases evaluated correctly |

Additional tests should cover malicious or resource-intensive programs, container cleanup, worker crashes, and duplicate job delivery.

## 12.4. Performance Testing

Evaluate:

- API response times.
- Concurrent submission requests.
- Queue processing throughput.
- Judge Worker concurrency.
- Database query performance.
- Redis queue behavior under load.

## 12.5. Security Testing

Test:

- Unauthorized API access.
- Privilege escalation.
- SQL injection.
- Cross-site scripting.
- Malicious source code execution.
- Filesystem access attempts.
- Network access attempts.
- Resource exhaustion.

---

# 13. Deployment Strategy

The project will use Docker Compose for local development and demonstration deployment.

Suggested services:

| Service      | Responsibility                  |
|--------------|---------------------------------|
| frontend     | React application               |
| api          | Go REST API                     |
| judge-worker | Background submission processor |
| postgres     | Primary database                |
| redis        | Job queue and cache             |
| judge-cpp    | C++ execution image             |
| judge-python | Python execution image          |
| judge-go     | Go execution image              |

Execution containers should be created dynamically by the Judge Worker rather than running as unrestricted permanent services.

The deployment configuration should separate application services from untrusted execution environments.

Environment variables will be used for configuration and sensitive credentials.

---

# 14. Expected Deliverables

At the end of the project, the following deliverables should be available:

1. Complete React frontend source code.
2. Go backend source code.
3. PostgreSQL database schema and migration scripts.
4. Redis-based asynchronous processing implementation.
5. Judge Worker implementation.
6. Docker execution images for supported languages.
7. Docker Compose deployment configuration.
8. API documentation.
9. Database ERD.
10. System architecture diagrams.
11. Test cases and test reports.
12. User and administrator documentation.
13. Final project report and demonstration.

---

# 15. Expected Outcomes

The completed system should allow users to:

- Register and manage their accounts.
- Browse and search programming problems.
- Write solutions in an integrated code editor.
- Submit solutions in multiple programming languages.
- Receive automated evaluation results.
- View execution time and memory usage.
- Track their programming progress.
- Participate in programming contests.
- Compare their performance with other users.
- Discuss programming problems with the community.

Administrators should be able to manage the platform's content, test cases, contests, and users.

The project should demonstrate the ability to design and implement a complete full-stack application while addressing challenging backend engineering problems, particularly asynchronous processing and secure execution of untrusted code.

---

# 16. Conclusion

Arbiter is a full-stack software engineering project that combines web application development with backend infrastructure and automated program evaluation.

The project provides an opportunity to apply a broad range of software engineering concepts, including REST API design, relational database modeling, asynchronous job processing, concurrency, containerization, resource management, and security.

By implementing the Judge System as a separate background component, the platform will have a modular architecture that can be extended to support additional programming languages, more sophisticated evaluation mechanisms, and increased submission workloads.

The expected result is a functional and extensible online programming platform that demonstrates both practical application development skills and deeper technical understanding of backend systems.