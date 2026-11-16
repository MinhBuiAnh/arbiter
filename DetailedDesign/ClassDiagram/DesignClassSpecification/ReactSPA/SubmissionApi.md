# SubmissionApi — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `SubmissionApi` |
| Classifier kind | Class |
| Package / subsystem | `React SPA (TypeScript)` |
| DCD alias | `UISubmissionApi` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`SubmissionApi` is a class in the `React SPA (TypeScript)` package/subsystem of the design class diagram.

Typed client for submission creation, status polling, history, results, details, and administrative inspection.

- Declared outgoing design relationships: `HttpClient`.
- Declared incoming design relationships: `PracticeWorkspace`, `SubmissionTracker`, `SubmissionBrowser`, `AdminConsole`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `createSubmission(req: CreateSubmissionRequest)` | `Promise<SubmissionStatusResponse>` | Public | Instance | Issues the typed HTTP request for create Submission through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `getSubmissionStatus(id: string)` | `Promise<SubmissionStatusResponse>` | Public | Instance | Issues the typed HTTP request for get Submission Status through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `getSubmissionResult(id: string)` | `Promise<SubmissionDetailsResponse>` | Public | Instance | Issues the typed HTTP request for get Submission Result through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `getSubmissionHistory(query: PageQuery)` | `Promise<PageResult<SubmissionStatusResponse>>` | Public | Instance | Issues the typed HTTP request for get Submission History through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `getSubmissionDetails(id: string)` | `Promise<SubmissionDetailsResponse>` | Public | Instance | Issues the typed HTTP request for get Submission Details through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `listAllSubmissions(query: PageQuery)` | `Promise<PageResult<SubmissionStatusResponse>>` | Public | Instance | Issues the typed HTTP request for list All Submissions through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `getAnySubmissionDetails(id: string)` | `Promise<SubmissionDetailsResponse>` | Public | Instance | Issues the typed HTTP request for get Any Submission Details through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |

## 4. Parameter design

### `createSubmission(req: CreateSubmissionRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `req` | `CreateSubmissionRequest` | — | in | Supplies the request or command payload. |

### `getSubmissionStatus(id: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `id` | `string` | — | in | Identifies the target object. |

### `getSubmissionResult(id: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `id` | `string` | — | in | Identifies the target object. |

### `getSubmissionHistory(query: PageQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `query` | `PageQuery` | — | in | Supplies search, filter, and pagination criteria. |

### `getSubmissionDetails(id: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `id` | `string` | — | in | Identifies the target object. |

### `listAllSubmissions(query: PageQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `query` | `PageQuery` | — | in | Supplies search, filter, and pagination criteria. |

### `getAnySubmissionDetails(id: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `id` | `string` | — | in | Identifies the target object. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-VAL-013` | Unsupported programming language. | The submission is rejected before judging. | [SD-UC-U-P-03-SubmitSolution](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution.md) |
| `ERR-VAL-014` | Invalid submission data. | The submission is rejected; no submission or outbox row is created. | [SD-UC-U-P-03-SubmitSolution](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution.md) |
| `ERR-VAL-004` | Invalid search or filter parameters. | The query is rejected without reading or changing state. | [SD-UC-AD-S-01-ViewAnySubmission](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/SubmissionManagement/SD-UC-AD-S-01-ViewAnySubmission.md) |
| `ERR-VAL-005` | Invalid pagination parameters. | The query is rejected without reading or changing state. | [SD-UC-U-S-03-ViewSubmissionHistory](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-03-ViewSubmissionHistory.md) |
| `ERR-PERM-001` | Problem is not publicly accessible. | The read or submission is rejected as not permitted. | [SD-UC-U-P-03-SubmitSolution-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution-Exceptions.md) |
| `ERR-PERM-003` | Submission is not owned by the caller. | The result or details read is rejected as not permitted. | [SD-UC-U-S-01-ViewSubmissionStatus](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-01-ViewSubmissionStatus.md) |
| `ERR-RES-001` | Problem not found. | The operation is rejected without changing state. | [SD-UC-U-P-03-SubmitSolution-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution-Exceptions.md) |
| `ERR-RES-005` | Submission not found. | The query is rejected without exposing another user's data. | [SD-UC-U-S-01-ViewSubmissionStatus](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-01-ViewSubmissionStatus.md) |
| `ERR-NET-001` | Network error or interrupted request/response. | The UI cannot confirm the outcome and informs the user rather than assuming success. | [SD-UC-U-P-03-SubmitSolution-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution-Exceptions.md) |
| `ERR-LIMIT-001` | Rate limit exceeded. | The request is rejected with retry information; no state is changed. | [SD-UC-U-P-03-SubmitSolution-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution-Exceptions.md) |

## 6. Method

### `createSubmission(req: CreateSubmissionRequest)`

Issues the typed HTTP request for create Submission through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `req`. It returns `Promise<SubmissionStatusResponse>`.

### `getSubmissionStatus(id: string)`

Issues the typed HTTP request for get Submission Status through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `id`. It returns `Promise<SubmissionStatusResponse>`.

### `getSubmissionResult(id: string)`

Issues the typed HTTP request for get Submission Result through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `id`. It returns `Promise<SubmissionDetailsResponse>`.

### `getSubmissionHistory(query: PageQuery)`

Issues the typed HTTP request for get Submission History through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `query`. It returns `Promise<PageResult<SubmissionStatusResponse>>`.

### `getSubmissionDetails(id: string)`

Issues the typed HTTP request for get Submission Details through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `id`. It returns `Promise<SubmissionDetailsResponse>`.

### `listAllSubmissions(query: PageQuery)`

Issues the typed HTTP request for list All Submissions through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `query`. It returns `Promise<PageResult<SubmissionStatusResponse>>`.

### `getAnySubmissionDetails(id: string)`

Issues the typed HTTP request for get Any Submission Details through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `id`. It returns `Promise<SubmissionDetailsResponse>`.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
