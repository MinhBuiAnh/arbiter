# TestCaseApi — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `TestCaseApi` |
| Classifier kind | Class |
| Package / subsystem | `React SPA (TypeScript)` |
| DCD alias | `UITestCaseApi` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`TestCaseApi` is a class in the `React SPA (TypeScript)` package/subsystem of the design class diagram.

Typed client for administrator test-case endpoints.

- Declared outgoing design relationships: `HttpClient`.
- Declared incoming design relationships: `AdminConsole`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `listTestCases(problemID: string)` | `Promise<TestCaseResponse[]>` | Public | Instance | Issues the typed HTTP request for list Test Cases through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `createTestCase(problemID: string, req: TestCaseWriteRequest)` | `Promise<TestCaseResponse>` | Public | Instance | Issues the typed HTTP request for create Test Case through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `updateTestCase(id: string, req: TestCaseWriteRequest)` | `Promise<TestCaseResponse>` | Public | Instance | Issues the typed HTTP request for update Test Case through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `deleteTestCase(id: string, version: number)` | `Promise<void>` | Public | Instance | Issues the typed HTTP request for delete Test Case through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `changeTestCaseType(id: string, type: string, version: number)` | `Promise<TestCaseResponse>` | Public | Instance | Issues the typed HTTP request for change Test Case Type through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `reorderTestCases(problemID: string, req: ReorderRequest)` | `Promise<TestCaseResponse[]>` | Public | Instance | Issues the typed HTTP request for reorder Test Cases through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |

## 4. Parameter design

### `listTestCases(problemID: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `problemID` | `string` | — | in | Identifies the target problem. |

### `createTestCase(problemID: string, req: TestCaseWriteRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `problemID` | `string` | — | in | Identifies the target problem. |
| `req` | `TestCaseWriteRequest` | — | in | Supplies the request or command payload. |

### `updateTestCase(id: string, req: TestCaseWriteRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `id` | `string` | — | in | Identifies the target object. |
| `req` | `TestCaseWriteRequest` | — | in | Supplies the request or command payload. |

### `deleteTestCase(id: string, version: number)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `id` | `string` | — | in | Identifies the target object. |
| `version` | `number` | — | in | Supplies the optimistic-concurrency version checked by the operation. |

### `changeTestCaseType(id: string, type: string, version: number)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `id` | `string` | — | in | Identifies the target object. |
| `type` | `string` | — | in | Supplies the requested classification value. |
| `version` | `number` | — | in | Supplies the optimistic-concurrency version checked by the operation. |

### `reorderTestCases(problemID: string, req: ReorderRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `problemID` | `string` | — | in | Identifies the target problem. |
| `req` | `ReorderRequest` | — | in | Supplies the request or command payload. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-VAL-001` | Invalid data for the requested operation. | Validation fails before persistence and the caller receives the field-level error. | [SD-UC-AD-T-01-CreateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase.md) |
| `ERR-VAL-009` | Duplicate or invalid test-case order. | The reorder or update is rejected; the stored order is unchanged. | [SD-UC-AD-T-01-CreateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase.md) |
| `ERR-CONFLICT-001` | Problem is not editable in its current lifecycle state. | The test-case or problem mutation is rejected. | [SD-UC-AD-T-01-CreateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase.md) |
| `ERR-CONFLICT-002` | Concurrent test-case set or order change. | The reorder is rejected; the caller must reload the current set version. | [SD-UC-AD-T-05-ReorderTestCases-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-05-ReorderTestCases-Exceptions.md) |
| `ERR-CONFLICT-007` | Concurrent test-case update. | The update is rejected; the caller reloads the test case. | [SD-UC-AD-T-02-UpdateTestCase-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-02-UpdateTestCase-Exceptions.md) |
| `ERR-CONFLICT-008` | Concurrent test-case set change. | The delete or reorder is rejected; the caller reloads the set. | [SD-UC-AD-T-03-DeleteTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-03-DeleteTestCase.md) |
| `ERR-RES-002` | Test-case data is missing or unreadable. | The operation is rejected; judging records an internal error rather than a user-code verdict. | [SD-UC-SYS-J-01-ProcessSubmission-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md) |
| `ERR-RES-003` | Test case is missing or belongs to another problem. | The test-case operation is rejected. | [SD-UC-AD-T-02-UpdateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-02-UpdateTestCase.md) |
| `ERR-NET-001` | Network error or interrupted request/response. | The UI cannot confirm the outcome and informs the user rather than assuming success. | [SD-UC-AD-T-01-CreateTestCase-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase-Exceptions.md) |
| `ERR-LIMIT-001` | Rate limit exceeded. | The request is rejected with retry information; no state is changed. | [SD-UC-AD-S-01-ViewAnySubmission](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/SubmissionManagement/SD-UC-AD-S-01-ViewAnySubmission.md) |

## 6. Method

### `listTestCases(problemID: string)`

Issues the typed HTTP request for list Test Cases through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `problemID`. It returns `Promise<TestCaseResponse[]>`.

### `createTestCase(problemID: string, req: TestCaseWriteRequest)`

Issues the typed HTTP request for create Test Case through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `problemID`, `req`. It returns `Promise<TestCaseResponse>`.

### `updateTestCase(id: string, req: TestCaseWriteRequest)`

Issues the typed HTTP request for update Test Case through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `id`, `req`. It returns `Promise<TestCaseResponse>`.

### `deleteTestCase(id: string, version: number)`

Issues the typed HTTP request for delete Test Case through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `id`, `version`. It returns `Promise<void>`.

### `changeTestCaseType(id: string, type: string, version: number)`

Issues the typed HTTP request for change Test Case Type through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `id`, `type`, `version`. It returns `Promise<TestCaseResponse>`.

### `reorderTestCases(problemID: string, req: ReorderRequest)`

Issues the typed HTTP request for reorder Test Cases through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `problemID`, `req`. It returns `Promise<TestCaseResponse[]>`.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
