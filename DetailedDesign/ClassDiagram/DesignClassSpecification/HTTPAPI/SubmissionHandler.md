# SubmissionHandler — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `SubmissionHandler` |
| Classifier kind | Class |
| Package / subsystem | `HTTP API (Go)` |
| DCD alias | `APISubmissionHandler` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`SubmissionHandler` is a class in the `HTTP API (Go)` package/subsystem of the design class diagram.

HTTP boundary handler for submission command and query routes.

- Declared outgoing design relationships: `SubmissionCommandService`, `SubmissionQueryService`.
- Declared incoming design relationships: `Router`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `Create(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `SubmissionCommandService.CreateSubmission`, and writes the mapped result or error response. |
| `GetStatus(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `SubmissionQueryService.GetStatus`, and writes the mapped result or error response. |
| `GetResult(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `SubmissionQueryService.GetResult`, and writes the mapped result or error response. |
| `GetHistory(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `SubmissionQueryService.GetHistory`, and writes the mapped result or error response. |
| `GetDetails(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `SubmissionQueryService.GetDetails`, and writes the mapped result or error response. |
| `ListAll(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `SubmissionQueryService.ListAll`, and writes the mapped result or error response. |
| `GetAnyDetails(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `SubmissionQueryService.GetAnyDetails`, and writes the mapped result or error response. |

## 4. Parameter design

### `Create(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `GetStatus(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `GetResult(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `GetHistory(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `GetDetails(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `ListAll(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `GetAnyDetails(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-AUTH-003` | Missing, invalid, or expired access token. | The request is rejected as unauthenticated and the client clears authentication state. | [SD-UC-U-P-03-SubmitSolution-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution-Exceptions.md) |
| `ERR-VAL-004` | Invalid search or filter parameters. | The query is rejected without reading or changing state. | [SD-UC-AD-S-01-ViewAnySubmission](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/SubmissionManagement/SD-UC-AD-S-01-ViewAnySubmission.md) |
| `ERR-VAL-005` | Invalid pagination parameters. | The query is rejected without reading or changing state. | [SD-UC-U-S-03-ViewSubmissionHistory](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-03-ViewSubmissionHistory.md) |
| `ERR-VAL-013` | Unsupported programming language. | The submission is rejected before judging. | [SD-UC-U-P-03-SubmitSolution](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution.md) |
| `ERR-VAL-014` | Invalid submission data. | The submission is rejected; no submission or outbox row is created. | [SD-UC-U-P-03-SubmitSolution](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution.md) |
| `ERR-PERM-001` | Problem is not publicly accessible. | The read or submission is rejected as not permitted. | [SD-UC-U-P-03-SubmitSolution-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution-Exceptions.md) |
| `ERR-PERM-002` | Insufficient privileges. | The administrator operation is rejected by authorization. | [SD-UC-AD-S-01-ViewAnySubmission](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/SubmissionManagement/SD-UC-AD-S-01-ViewAnySubmission.md) |
| `ERR-PERM-003` | Submission is not owned by the caller. | The result or details read is rejected as not permitted. | [SD-UC-U-S-01-ViewSubmissionStatus](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-01-ViewSubmissionStatus.md) |
| `ERR-RES-001` | Problem not found. | The operation is rejected without changing state. | [SD-UC-U-P-03-SubmitSolution-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution-Exceptions.md) |
| `ERR-RES-005` | Submission not found. | The query is rejected without exposing another user's data. | [SD-UC-U-S-01-ViewSubmissionStatus](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-01-ViewSubmissionStatus.md) |
| `ERR-LIMIT-001` | Rate limit exceeded. | The request is rejected with retry information; no state is changed. | [SD-UC-U-P-03-SubmitSolution-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution-Exceptions.md) |
| `ERR-SYS-001` | Internal system, persistence, or assembly error. | The request fails with an internal error; transactions roll back where applicable. | [SD-UC-U-P-03-SubmitSolution](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution.md) |

## 6. Method

### `Create(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `SubmissionCommandService.CreateSubmission`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `GetStatus(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `SubmissionQueryService.GetStatus`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `GetResult(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `SubmissionQueryService.GetResult`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `GetHistory(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `SubmissionQueryService.GetHistory`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `GetDetails(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `SubmissionQueryService.GetDetails`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `ListAll(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `SubmissionQueryService.ListAll`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `GetAnyDetails(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `SubmissionQueryService.GetAnyDetails`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
