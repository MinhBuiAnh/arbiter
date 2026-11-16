# ProblemHandler — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ProblemHandler` |
| Classifier kind | Class |
| Package / subsystem | `HTTP API (Go)` |
| DCD alias | `APIProblemHandler` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ProblemHandler` is a class in the `HTTP API (Go)` package/subsystem of the design class diagram.

HTTP boundary handler for public and administrative problem routes.

- Declared outgoing design relationships: `ProblemQueryService`, `ProblemAdminService`.
- Declared incoming design relationships: `Router`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `List(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `ProblemQueryService.ListPublished`, and writes the mapped result or error response. |
| `Search(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `ProblemQueryService.SearchPublished`, and writes the mapped result or error response. |
| `Get(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `ProblemQueryService.GetPublicProblem`, and writes the mapped result or error response. |
| `GetEditorContext(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `ProblemQueryService.GetPublicProblem`, and writes the mapped result or error response. |
| `Create(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `ProblemAdminService.CreateProblem`, and writes the mapped result or error response. |
| `Update(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `ProblemAdminService.UpdateProblem`, and writes the mapped result or error response. |
| `GetState(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `ProblemQueryService.GetProblemState`, and writes the mapped result or error response. |
| `GetPublicationState(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `ProblemQueryService.GetProblemState`, and writes the mapped result or error response. |
| `ChangeLifecycle(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads the requested lifecycle action and delegates to `ProblemAdminService.DeactivateProblem` or `ProblemAdminService.ReactivateProblem`, then writes the mapped response. |
| `ChangePublication(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads the requested publication action and delegates to `ProblemAdminService.PublishProblem` or `ProblemAdminService.UnpublishProblem`, then writes the mapped response. |

## 4. Parameter design

### `List(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `Search(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `Get(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `GetEditorContext(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `Create(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `Update(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `GetState(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `GetPublicationState(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `ChangeLifecycle(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `ChangePublication(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-AUTH-003` | Missing, invalid, or expired access token. | The request is rejected as unauthenticated and the client clears authentication state. | [SD-UC-AD-P-01-CreateProblem](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-01-CreateProblem.md) |
| `ERR-VAL-001` | Invalid data for the requested operation. | Validation fails before persistence and the caller receives the field-level error. | [SD-UC-AD-P-01-CreateProblem](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-01-CreateProblem.md) |
| `ERR-VAL-004` | Invalid search or filter parameters. | The query is rejected without reading or changing state. | [SD-UC-COM-02-SearchProblems](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-02-SearchProblems.md) |
| `ERR-VAL-005` | Invalid pagination parameters. | The query is rejected without reading or changing state. | [SD-UC-COM-01-BrowseProblems](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-01-BrowseProblems.md) |
| `ERR-VAL-006` | Invalid sorting parameter. | The query is rejected without reading or changing state. | [SD-UC-COM-01-BrowseProblems](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-01-BrowseProblems.md) |
| `ERR-VAL-007` | Invalid problem identifier. | The problem read is rejected as invalid. | [SD-UC-COM-03-ViewProblemDetails](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-03-ViewProblemDetails.md) |
| `ERR-VAL-008` | Publication requirements are unmet. | The publication change is rejected; the problem remains in its current state. | [SD-UC-AD-P-04-ManageProblemPublication](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-04-ManageProblemPublication.md) |
| `ERR-PERM-001` | Problem is not publicly accessible. | The read or submission is rejected as not permitted. | [SD-UC-COM-03-ViewProblemDetails](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-03-ViewProblemDetails.md) |
| `ERR-PERM-002` | Insufficient privileges. | The administrator operation is rejected by authorization. | [SD-UC-AD-P-01-CreateProblem](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-01-CreateProblem.md) |
| `ERR-CONFLICT-001` | Problem is not editable in its current lifecycle state. | The test-case or problem mutation is rejected. | [SD-UC-AD-T-01-CreateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase.md) |
| `ERR-CONFLICT-003` | Problem is inactive. | The publication or update is rejected and reactivation is required. | [SD-UC-AD-P-02-UpdateProblem](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-02-UpdateProblem.md) |
| `ERR-CONFLICT-004` | Concurrent problem update. | The update is rejected by the optimistic-concurrency check; the caller reloads. | [SD-UC-AD-P-02-UpdateProblem](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-02-UpdateProblem.md) |
| `ERR-CONFLICT-005` | Concurrent problem state change. | The state change is rejected; the caller reloads the latest version. | [SD-UC-AD-P-03-DeleteProblem](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-03-DeleteProblem.md) |
| `ERR-CONFLICT-006` | Concurrent publication-state change. | The publication change is rejected; the caller reloads the latest version. | [SD-UC-AD-P-04-ManageProblemPublication](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-04-ManageProblemPublication.md) |
| `ERR-RES-001` | Problem not found. | The operation is rejected without changing state. | [SD-UC-COM-03-ViewProblemDetails](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-03-ViewProblemDetails.md) |
| `ERR-RES-002` | Test-case data is missing or unreadable. | The operation is rejected; judging records an internal error rather than a user-code verdict. | [SD-UC-SYS-J-01-ProcessSubmission-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md) |
| `ERR-CONFLICT-012` | Problem has no executable test cases. | The operation is rejected; no judge work is scheduled. | [SD-UC-SYS-J-01-ProcessSubmission](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission.md) |
| `ERR-LIMIT-001` | Rate limit exceeded. | The request is rejected with retry information; no state is changed. | [SD-UC-COM-01-BrowseProblems](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-01-BrowseProblems.md) |
| `ERR-SYS-001` | Internal system, persistence, or assembly error. | The request fails with an internal error; transactions roll back where applicable. | [SD-UC-COM-01-BrowseProblems](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-01-BrowseProblems.md) |

## 6. Method

### `List(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `ProblemQueryService.ListPublished`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `Search(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `ProblemQueryService.SearchPublished`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `Get(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `ProblemQueryService.GetPublicProblem`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `GetEditorContext(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `ProblemQueryService.GetPublicProblem`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `Create(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `ProblemAdminService.CreateProblem`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `Update(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `ProblemAdminService.UpdateProblem`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `GetState(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `ProblemQueryService.GetProblemState`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `GetPublicationState(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `ProblemQueryService.GetProblemState`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `ChangeLifecycle(w http.ResponseWriter, r *http.Request)`

Reads the requested lifecycle action and delegates to `ProblemAdminService.DeactivateProblem` or `ProblemAdminService.ReactivateProblem`, then writes the mapped response. It uses `w`, `r`. No value is returned.

### `ChangePublication(w http.ResponseWriter, r *http.Request)`

Reads the requested publication action and delegates to `ProblemAdminService.PublishProblem` or `ProblemAdminService.UnpublishProblem`, then writes the mapped response. It uses `w`, `r`. No value is returned.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
