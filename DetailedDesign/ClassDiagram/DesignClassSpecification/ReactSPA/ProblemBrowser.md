# ProblemBrowser — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ProblemBrowser` |
| Classifier kind | Class |
| Package / subsystem | `React SPA (TypeScript)` |
| DCD alias | `UIProblemBrowser` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ProblemBrowser` is a class in the `React SPA (TypeScript)` package/subsystem of the design class diagram.

React view for browsing, searching, and selecting published problems.

- Declared outgoing design relationships: `ProblemApi`.
- Declared incoming design relationships: `AppShell`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `state` | `ProblemQuery` | Public | Instance | — | Current query and result state for the browser. |

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `submitSearch(query: ProblemQuery)` | `Promise<void>` | Public | Instance | Requests matching problems through `ProblemApi.searchProblems` and replaces `state` with the submitted query before rendering the returned page. |
| `selectProblem(problemID: string)` | `void` | Public | Instance | Records the selected problem and requests its details through `ProblemApi.getProblem` for presentation. |
| `displayProblemList(page: PageResult<ProblemResponse>)` | `void` | Public | Instance | Renders the supplied page of problems in the browser. |
| `displayEmptyState()` | `void` | Public | Instance | Renders the empty-search state when no problems match. |
| `returnToProblemList()` | `void` | Public | Instance | Clears the selected problem and renders the problem list again. |

## 4. Parameter design

### `submitSearch(query: ProblemQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `query` | `ProblemQuery` | — | in | Supplies search, filter, and pagination criteria. |

### `selectProblem(problemID: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `problemID` | `string` | — | in | Identifies the target problem. |

### `displayProblemList(page: PageResult<ProblemResponse>)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `page` | `PageResult<ProblemResponse>` | — | in | Supplies pagination and sort criteria. |

### `displayEmptyState()`

This operation has no parameters.

### `returnToProblemList()`

This operation has no parameters.

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-VAL-004` | Invalid search or filter parameters. | The query is rejected without reading or changing state. | [SD-UC-COM-02-SearchProblems](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-02-SearchProblems.md) |
| `ERR-VAL-005` | Invalid pagination parameters. | The query is rejected without reading or changing state. | [SD-UC-COM-01-BrowseProblems](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-01-BrowseProblems.md) |
| `ERR-VAL-006` | Invalid sorting parameter. | The query is rejected without reading or changing state. | [SD-UC-COM-01-BrowseProblems](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-01-BrowseProblems.md) |
| `ERR-PERM-001` | Problem is not publicly accessible. | The read or submission is rejected as not permitted. | [SD-UC-COM-03-ViewProblemDetails](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-03-ViewProblemDetails.md) |
| `ERR-RES-001` | Problem not found. | The operation is rejected without changing state. | [SD-UC-COM-03-ViewProblemDetails](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-03-ViewProblemDetails.md) |
| `ERR-NET-001` | Network error or interrupted request/response. | The UI cannot confirm the outcome and informs the user rather than assuming success. | [SD-UC-COM-01-BrowseProblems](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-01-BrowseProblems.md) |
| `ERR-LIMIT-001` | Rate limit exceeded. | The request is rejected with retry information; no state is changed. | [SD-UC-COM-01-BrowseProblems](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-01-BrowseProblems.md) |

## 6. Method

### `submitSearch(query: ProblemQuery)`

Requests matching problems through `ProblemApi.searchProblems` and replaces `state` with the submitted query before rendering the returned page. It uses `query`. It reads the declared attribute(s) `state`. It returns `Promise<void>`.

### `selectProblem(problemID: string)`

Records the selected problem and requests its details through `ProblemApi.getProblem` for presentation. It uses `problemID`. No value is returned.

### `displayProblemList(page: PageResult<ProblemResponse>)`

Renders the supplied page of problems in the browser. It uses `page`. No value is returned.

### `displayEmptyState()`

Renders the empty-search state when no problems match. It has no parameters. No value is returned.

### `returnToProblemList()`

Clears the selected problem and renders the problem list again. It has no parameters. No value is returned.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
