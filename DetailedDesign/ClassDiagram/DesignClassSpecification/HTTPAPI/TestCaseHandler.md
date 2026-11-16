# TestCaseHandler — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `TestCaseHandler` |
| Classifier kind | Class |
| Package / subsystem | `HTTP API (Go)` |
| DCD alias | `APITestCaseHandler` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`TestCaseHandler` is a class in the `HTTP API (Go)` package/subsystem of the design class diagram.

HTTP boundary handler for administrator test-case routes.

- Declared outgoing design relationships: `TestCaseService`.
- Declared incoming design relationships: `Router`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `List(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `TestCaseService.GetOrderedTestCases`, and writes the mapped result or error response. |
| `Get(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `TestCaseService.GetTestCase`, and writes the mapped result or error response. |
| `GetOrder(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `TestCaseService.GetOrderedTestCases`, and writes the mapped result or error response. |
| `GetType(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `TestCaseService.GetTestCaseType`, and writes the mapped result or error response. |
| `Create(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `TestCaseService.CreateTestCase`, and writes the mapped result or error response. |
| `Update(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `TestCaseService.UpdateTestCase`, and writes the mapped result or error response. |
| `Delete(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `TestCaseService.DeleteTestCase`, and writes the mapped result or error response. |
| `ChangeType(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `TestCaseService.ChangeTestCaseType`, and writes the mapped result or error response. |
| `Reorder(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `TestCaseService.ReorderTestCases`, and writes the mapped result or error response. |

## 4. Parameter design

### `List(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `Get(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `GetOrder(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `GetType(w http.ResponseWriter, r *http.Request)`

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

### `Delete(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `ChangeType(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `Reorder(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-AUTH-003` | Missing, invalid, or expired access token. | The request is rejected as unauthenticated and the client clears authentication state. | [SD-UC-AD-T-01-CreateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase.md) |
| `ERR-VAL-001` | Invalid data for the requested operation. | Validation fails before persistence and the caller receives the field-level error. | [SD-UC-AD-T-01-CreateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase.md) |
| `ERR-VAL-009` | Duplicate or invalid test-case order. | The reorder or update is rejected; the stored order is unchanged. | [SD-UC-AD-T-01-CreateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase.md) |
| `ERR-PERM-002` | Insufficient privileges. | The administrator operation is rejected by authorization. | [SD-UC-AD-T-01-CreateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase.md) |
| `ERR-CONFLICT-001` | Problem is not editable in its current lifecycle state. | The test-case or problem mutation is rejected. | [SD-UC-AD-T-01-CreateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase.md) |
| `ERR-CONFLICT-002` | Concurrent test-case set or order change. | The reorder is rejected; the caller must reload the current set version. | [SD-UC-AD-T-05-ReorderTestCases-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-05-ReorderTestCases-Exceptions.md) |
| `ERR-CONFLICT-007` | Concurrent test-case update. | The update is rejected; the caller reloads the test case. | [SD-UC-AD-T-02-UpdateTestCase-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-02-UpdateTestCase-Exceptions.md) |
| `ERR-CONFLICT-008` | Concurrent test-case set change. | The delete or reorder is rejected; the caller reloads the set. | [SD-UC-AD-T-03-DeleteTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-03-DeleteTestCase.md) |
| `ERR-RES-001` | Problem not found. | The operation is rejected without changing state. | [SD-UC-AD-T-01-CreateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase.md) |
| `ERR-RES-002` | Test-case data is missing or unreadable. | The operation is rejected; judging records an internal error rather than a user-code verdict. | [SD-UC-SYS-J-01-ProcessSubmission-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md) |
| `ERR-RES-003` | Test case is missing or belongs to another problem. | The test-case operation is rejected. | [SD-UC-AD-T-02-UpdateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-02-UpdateTestCase.md) |
| `ERR-LIMIT-001` | Rate limit exceeded. | The request is rejected with retry information; no state is changed. | [SD-UC-AD-S-01-ViewAnySubmission](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/SubmissionManagement/SD-UC-AD-S-01-ViewAnySubmission.md) |
| `ERR-SYS-001` | Internal system, persistence, or assembly error. | The request fails with an internal error; transactions roll back where applicable. | [SD-UC-AD-T-01-CreateTestCase-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase-Exceptions.md) |

## 6. Method

### `List(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `TestCaseService.GetOrderedTestCases`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `Get(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `TestCaseService.GetTestCase`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `GetOrder(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `TestCaseService.GetOrderedTestCases`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `GetType(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `TestCaseService.GetTestCaseType`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `Create(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `TestCaseService.CreateTestCase`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `Update(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `TestCaseService.UpdateTestCase`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `Delete(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `TestCaseService.DeleteTestCase`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `ChangeType(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `TestCaseService.ChangeTestCaseType`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `Reorder(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `TestCaseService.ReorderTestCases`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
