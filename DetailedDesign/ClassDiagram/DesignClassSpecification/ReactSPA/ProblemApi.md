# ProblemApi — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ProblemApi` |
| Classifier kind | Class |
| Package / subsystem | `React SPA (TypeScript)` |
| DCD alias | `UIProblemApi` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ProblemApi` is a class in the `React SPA (TypeScript)` package/subsystem of the design class diagram.

Typed client for public problem browsing and administrator problem-management endpoints.

- Declared outgoing design relationships: `HttpClient`.
- Declared incoming design relationships: `ProblemBrowser`, `PracticeWorkspace`, `AdminConsole`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `listProblems(query: ProblemQuery)` | `Promise<PageResult<ProblemResponse>>` | Public | Instance | Issues the typed HTTP request for list Problems through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `searchProblems(query: ProblemQuery)` | `Promise<PageResult<ProblemResponse>>` | Public | Instance | Issues the typed HTTP request for search Problems through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `getProblem(problemID: string)` | `Promise<ProblemResponse>` | Public | Instance | Issues the typed HTTP request for get Problem through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `getEditorContext(problemID: string)` | `Promise<ProblemResponse>` | Public | Instance | Issues the typed HTTP request for get Editor Context through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `createProblem(req: ProblemWriteRequest)` | `Promise<ProblemResponse>` | Public | Instance | Issues the typed HTTP request for create Problem through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `updateProblem(id: string, req: ProblemWriteRequest)` | `Promise<ProblemResponse>` | Public | Instance | Issues the typed HTTP request for update Problem through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `changePublication(id: string, action: string, version: number)` | `Promise<ProblemResponse>` | Public | Instance | Issues the typed HTTP request for change Publication through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `changeLifecycle(id: string, action: string, version: number)` | `Promise<ProblemResponse>` | Public | Instance | Issues the typed HTTP request for change Lifecycle through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |

## 4. Parameter design

### `listProblems(query: ProblemQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `query` | `ProblemQuery` | — | in | Supplies search, filter, and pagination criteria. |

### `searchProblems(query: ProblemQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `query` | `ProblemQuery` | — | in | Supplies search, filter, and pagination criteria. |

### `getProblem(problemID: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `problemID` | `string` | — | in | Identifies the target problem. |

### `getEditorContext(problemID: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `problemID` | `string` | — | in | Identifies the target problem. |

### `createProblem(req: ProblemWriteRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `req` | `ProblemWriteRequest` | — | in | Supplies the request or command payload. |

### `updateProblem(id: string, req: ProblemWriteRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `id` | `string` | — | in | Identifies the target object. |
| `req` | `ProblemWriteRequest` | — | in | Supplies the request or command payload. |

### `changePublication(id: string, action: string, version: number)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `id` | `string` | — | in | Identifies the target object. |
| `action` | `string` | — | in | Requested publication action. |
| `version` | `number` | — | in | Supplies the optimistic-concurrency version checked by the operation. |

### `changeLifecycle(id: string, action: string, version: number)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `id` | `string` | — | in | Identifies the target object. |
| `action` | `string` | — | in | Requested lifecycle action. |
| `version` | `number` | — | in | Supplies the optimistic-concurrency version checked by the operation. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-VAL-004` | Invalid search or filter parameters. | The query is rejected without reading or changing state. | [SD-UC-COM-02-SearchProblems](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-02-SearchProblems.md) |
| `ERR-VAL-005` | Invalid pagination parameters. | The query is rejected without reading or changing state. | [SD-UC-COM-01-BrowseProblems](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-01-BrowseProblems.md) |
| `ERR-VAL-007` | Invalid problem identifier. | The problem read is rejected as invalid. | [SD-UC-COM-03-ViewProblemDetails](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-03-ViewProblemDetails.md) |
| `ERR-PERM-001` | Problem is not publicly accessible. | The read or submission is rejected as not permitted. | [SD-UC-COM-03-ViewProblemDetails](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-03-ViewProblemDetails.md) |
| `ERR-RES-001` | Problem not found. | The operation is rejected without changing state. | [SD-UC-COM-03-ViewProblemDetails](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-03-ViewProblemDetails.md) |
| `ERR-CONFLICT-001` | Problem is not editable in its current lifecycle state. | The test-case or problem mutation is rejected. | [SD-UC-AD-T-01-CreateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase.md) |
| `ERR-CONFLICT-003` | Problem is inactive. | The publication or update is rejected and reactivation is required. | [SD-UC-AD-P-02-UpdateProblem](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-02-UpdateProblem.md) |
| `ERR-VAL-008` | Publication requirements are unmet. | The publication change is rejected; the problem remains in its current state. | [SD-UC-AD-P-04-ManageProblemPublication](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-04-ManageProblemPublication.md) |
| `ERR-NET-001` | Network error or interrupted request/response. | The UI cannot confirm the outcome and informs the user rather than assuming success. | [SD-UC-COM-01-BrowseProblems](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-01-BrowseProblems.md) |
| `ERR-LIMIT-001` | Rate limit exceeded. | The request is rejected with retry information; no state is changed. | [SD-UC-COM-01-BrowseProblems](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-01-BrowseProblems.md) |

## 6. Method

### `listProblems(query: ProblemQuery)`

Issues the typed HTTP request for list Problems through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `query`. It returns `Promise<PageResult<ProblemResponse>>`.

### `searchProblems(query: ProblemQuery)`

Issues the typed HTTP request for search Problems through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `query`. It returns `Promise<PageResult<ProblemResponse>>`.

### `getProblem(problemID: string)`

Issues the typed HTTP request for get Problem through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `problemID`. It returns `Promise<ProblemResponse>`.

### `getEditorContext(problemID: string)`

Issues the typed HTTP request for get Editor Context through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `problemID`. It returns `Promise<ProblemResponse>`.

### `createProblem(req: ProblemWriteRequest)`

Issues the typed HTTP request for create Problem through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `req`. It returns `Promise<ProblemResponse>`.

### `updateProblem(id: string, req: ProblemWriteRequest)`

Issues the typed HTTP request for update Problem through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `id`, `req`. It returns `Promise<ProblemResponse>`.

### `changePublication(id: string, action: string, version: number)`

Issues the typed HTTP request for change Publication through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `id`, `action`, `version`. It returns `Promise<ProblemResponse>`.

### `changeLifecycle(id: string, action: string, version: number)`

Issues the typed HTTP request for change Lifecycle through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `id`, `action`, `version`. It returns `Promise<ProblemResponse>`.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
