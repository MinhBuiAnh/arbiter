# AdminConsole — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `AdminConsole` |
| Classifier kind | Class |
| Package / subsystem | `React SPA (TypeScript)` |
| DCD alias | `UIAdminConsole` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`AdminConsole` is a class in the `React SPA (TypeScript)` package/subsystem of the design class diagram.

React administrative surface for user, problem, test-case, and submission management.

- Declared outgoing design relationships: `AccountApi`, `ProblemApi`, `TestCaseApi`, `SubmissionApi`, `ProblemDraft`, `TestCaseDraft`.
- Declared incoming design relationships: `AppShell`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `problemDraft` | `ProblemDraft` | Public | Instance | — | Problem create or update draft held by the console. |
| `testCaseDraft` | `TestCaseDraft` | Public | Instance | — | Test-case create or update draft held by the console. |

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `createProblem(req: ProblemWriteRequest)` | `Promise<void>` | Public | Instance | Sends `req` through `ProblemApi.createProblem` and refreshes the problem view; validation errors are passed to `displayValidationErrors`. |
| `updateProblem(id: string, req: ProblemWriteRequest, version: number)` | `Promise<void>` | Public | Instance | Sends `req` and `version` through `ProblemApi.updateProblem`; validation and conflict errors are surfaced to the operator. |
| `changePublication(id: string, action: string, version: number)` | `Promise<void>` | Public | Instance | Sends the publication action and `version` through `ProblemApi.changePublication` and refreshes the problem state. |
| `createTestCase(problemID: string, req: TestCaseWriteRequest)` | `Promise<void>` | Public | Instance | Sends `req` through `TestCaseApi.createTestCase` for `problemID` and refreshes the test-case list. |
| `updateTestCase(id: string, req: TestCaseWriteRequest, version: number)` | `Promise<void>` | Public | Instance | Sends `req` and `version` through `TestCaseApi.updateTestCase` and refreshes the test-case view. |
| `deleteTestCase(id: string, version: number)` | `Promise<void>` | Public | Instance | Calls `TestCaseApi.deleteTestCase` with `id` and `version` and refreshes the remaining cases. |
| `changeTestCaseType(id: string, type: string, version: number)` | `Promise<void>` | Public | Instance | Calls `TestCaseApi.changeTestCaseType` with the requested type and version and refreshes the case. |
| `reorderTestCases(problemID: string, req: ReorderRequest)` | `Promise<void>` | Public | Instance | Calls `TestCaseApi.reorderTestCases` with the ordered identifiers and expected set version and refreshes the list. |
| `requestUserList(query: PageQuery)` | `Promise<void>` | Public | Instance | Calls `AccountApi.listUsers` with `query` and presents the returned account page. |
| `requestUserDetails(userID: string)` | `Promise<void>` | Public | Instance | Calls `AccountApi.getUserDetails` for `userID` and presents the account details. |
| `changeAccountStatus(userID: string, status: string, version: number)` | `Promise<void>` | Public | Instance | Calls `AccountApi.changeUserStatus` with the requested status and version and refreshes the account row. |
| `requestSubmissionList(query: PageQuery)` | `Promise<void>` | Public | Instance | Calls `SubmissionApi.listAllSubmissions` with `query` and presents the administrative submission page. |
| `requestSubmissionDetails(submissionID: string)` | `Promise<void>` | Public | Instance | Calls `SubmissionApi.getAnySubmissionDetails` for `submissionID` and presents the read-only details. |
| `displayReadOnlyDetails(details: SubmissionDetailsResponse)` | `void` | Public | Instance | Renders the supplied details without offering edit actions for the reviewed submission. |
| `displayValidationErrors(errors: Record<string, string>)` | `void` | Public | Instance | Maps the field errors in `errors` to the corresponding form controls. |
| `verifyStoredState()` | `Promise<void>` | Public | Instance | Re-reads the affected administrative resource through the matching typed API client and compares it with the locally held draft state. |

## 4. Parameter design

### `createProblem(req: ProblemWriteRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `req` | `ProblemWriteRequest` | — | in | Supplies the request or command payload. |

### `updateProblem(id: string, req: ProblemWriteRequest, version: number)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `id` | `string` | — | in | Identifies the target object. |
| `req` | `ProblemWriteRequest` | — | in | Supplies the request or command payload. |
| `version` | `number` | — | in | Problem version the operator last observed. |

### `changePublication(id: string, action: string, version: number)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `id` | `string` | — | in | Identifies the target object. |
| `action` | `string` | — | in | Requested publication action. |
| `version` | `number` | — | in | Problem version the operator last observed. |

### `createTestCase(problemID: string, req: TestCaseWriteRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `problemID` | `string` | — | in | Identifies the target problem. |
| `req` | `TestCaseWriteRequest` | — | in | Supplies the request or command payload. |

### `updateTestCase(id: string, req: TestCaseWriteRequest, version: number)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `id` | `string` | — | in | Identifies the target object. |
| `req` | `TestCaseWriteRequest` | — | in | Supplies the request or command payload. |
| `version` | `number` | — | in | Test-case version the operator last observed. |

### `deleteTestCase(id: string, version: number)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `id` | `string` | — | in | Identifies the target object. |
| `version` | `number` | — | in | Supplies the optimistic-concurrency version checked by the operation. |

### `changeTestCaseType(id: string, type: string, version: number)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `id` | `string` | — | in | Identifies the target object. |
| `type` | `string` | — | in | Target test-case classification. |
| `version` | `number` | — | in | Test-case version the operator last observed. |

### `reorderTestCases(problemID: string, req: ReorderRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `problemID` | `string` | — | in | Identifies the target problem. |
| `req` | `ReorderRequest` | — | in | Supplies the request or command payload. |

### `requestUserList(query: PageQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `query` | `PageQuery` | — | in | Supplies search, filter, and pagination criteria. |

### `requestUserDetails(userID: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `userID` | `string` | — | in | Identifies the target account. |

### `changeAccountStatus(userID: string, status: string, version: number)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `userID` | `string` | — | in | Identifies the target account. |
| `status` | `string` | — | in | Target account status. |
| `version` | `number` | — | in | Account version the operator last observed. |

### `requestSubmissionList(query: PageQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `query` | `PageQuery` | — | in | Supplies search, filter, and pagination criteria. |

### `requestSubmissionDetails(submissionID: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `submissionID` | `string` | — | in | Identifies the target submission. |

### `displayReadOnlyDetails(details: SubmissionDetailsResponse)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `details` | `SubmissionDetailsResponse` | — | in | Details to render in read-only form. |

### `displayValidationErrors(errors: Record<string, string>)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `errors` | `Record<string, string>` | — | in | Field-name to error-message map. |

### `verifyStoredState()`

This operation has no parameters.

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-PERM-002` | Insufficient privileges. | The administrator operation is rejected by authorization. | [SD-UC-AD-P-01-CreateProblem](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-01-CreateProblem.md) |
| `ERR-VAL-001` | Invalid data for the requested operation. | Validation fails before persistence and the caller receives the field-level error. | [SD-UC-AD-P-01-CreateProblem](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-01-CreateProblem.md) |
| `ERR-VAL-004` | Invalid search or filter parameters. | The query is rejected without reading or changing state. | [SD-UC-AD-U-01-ViewUserList](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-01-ViewUserList.md) |
| `ERR-VAL-005` | Invalid pagination parameters. | The query is rejected without reading or changing state. | [SD-UC-AD-U-01-ViewUserList](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-01-ViewUserList.md) |
| `ERR-VAL-008` | Publication requirements are unmet. | The publication change is rejected; the problem remains in its current state. | [SD-UC-AD-P-04-ManageProblemPublication](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-04-ManageProblemPublication.md) |
| `ERR-CONFLICT-001` | Problem is not editable in its current lifecycle state. | The test-case or problem mutation is rejected. | [SD-UC-AD-T-01-CreateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase.md) |
| `ERR-CONFLICT-002` | Concurrent test-case set or order change. | The reorder is rejected; the caller must reload the current set version. | [SD-UC-AD-T-05-ReorderTestCases-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-05-ReorderTestCases-Exceptions.md) |
| `ERR-CONFLICT-003` | Problem is inactive. | The publication or update is rejected and reactivation is required. | [SD-UC-AD-P-02-UpdateProblem](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-02-UpdateProblem.md) |
| `ERR-CONFLICT-004` | Concurrent problem update. | The update is rejected by the optimistic-concurrency check; the caller reloads. | [SD-UC-AD-P-02-UpdateProblem](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-02-UpdateProblem.md) |
| `ERR-CONFLICT-005` | Concurrent problem state change. | The state change is rejected; the caller reloads the latest version. | [SD-UC-AD-P-03-DeleteProblem](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-03-DeleteProblem.md) |
| `ERR-CONFLICT-006` | Concurrent publication-state change. | The publication change is rejected; the caller reloads the latest version. | [SD-UC-AD-P-04-ManageProblemPublication](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-04-ManageProblemPublication.md) |
| `ERR-CONFLICT-007` | Concurrent test-case update. | The update is rejected; the caller reloads the test case. | [SD-UC-AD-T-02-UpdateTestCase-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-02-UpdateTestCase-Exceptions.md) |
| `ERR-CONFLICT-008` | Concurrent test-case set change. | The delete or reorder is rejected; the caller reloads the set. | [SD-UC-AD-T-03-DeleteTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-03-DeleteTestCase.md) |
| `ERR-CONFLICT-010` | Concurrent user-status change. | The status change is rejected; the caller reloads the account. | [SD-UC-AD-U-03-ManageUserStatus](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-03-ManageUserStatus.md) |
| `ERR-CONFLICT-011` | Administrator targets their own account. | The status change is rejected to prevent self-lockout. | [SD-UC-AD-U-03-ManageUserStatus](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-03-ManageUserStatus.md) |
| `ERR-RES-001` | Problem not found. | The operation is rejected without changing state. | [SD-UC-AD-P-02-UpdateProblem](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-02-UpdateProblem.md) |
| `ERR-RES-003` | Test case is missing or belongs to another problem. | The test-case operation is rejected. | [SD-UC-AD-T-02-UpdateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-02-UpdateTestCase.md) |
| `ERR-RES-004` | User not found. | The administrator operation is rejected. | [SD-UC-AD-U-02-ViewUserDetails](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-02-ViewUserDetails.md) |
| `ERR-RES-005` | Submission not found. | The query is rejected without exposing another user's data. | [SD-UC-AD-S-01-ViewAnySubmission](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/SubmissionManagement/SD-UC-AD-S-01-ViewAnySubmission.md) |
| `ERR-NET-001` | Network error or interrupted request/response. | The UI cannot confirm the outcome and informs the user rather than assuming success. | [SD-UC-AD-P-01-CreateProblem](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-01-CreateProblem.md) |
| `ERR-LIMIT-001` | Rate limit exceeded. | The request is rejected with retry information; no state is changed. | [SD-UC-AD-U-01-ViewUserList](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-01-ViewUserList.md) |

## 6. Method

### `createProblem(req: ProblemWriteRequest)`

Sends `req` through `ProblemApi.createProblem` and refreshes the problem view; validation errors are passed to `displayValidationErrors`. It uses `req`. It reads the declared attribute(s) `problemDraft`. It returns `Promise<void>`.

### `updateProblem(id: string, req: ProblemWriteRequest, version: number)`

Sends `req` and `version` through `ProblemApi.updateProblem`; validation and conflict errors are surfaced to the operator. It uses `id`, `req`, `version`. It reads the declared attribute(s) `problemDraft`. It returns `Promise<void>`.

### `changePublication(id: string, action: string, version: number)`

Sends the publication action and `version` through `ProblemApi.changePublication` and refreshes the problem state. It uses `id`, `action`, `version`. It returns `Promise<void>`.

### `createTestCase(problemID: string, req: TestCaseWriteRequest)`

Sends `req` through `TestCaseApi.createTestCase` for `problemID` and refreshes the test-case list. It uses `problemID`, `req`. It reads the declared attribute(s) `testCaseDraft`. It returns `Promise<void>`.

### `updateTestCase(id: string, req: TestCaseWriteRequest, version: number)`

Sends `req` and `version` through `TestCaseApi.updateTestCase` and refreshes the test-case view. It uses `id`, `req`, `version`. It reads the declared attribute(s) `testCaseDraft`. It returns `Promise<void>`.

### `deleteTestCase(id: string, version: number)`

Calls `TestCaseApi.deleteTestCase` with `id` and `version` and refreshes the remaining cases. It uses `id`, `version`. It returns `Promise<void>`.

### `changeTestCaseType(id: string, type: string, version: number)`

Calls `TestCaseApi.changeTestCaseType` with the requested type and version and refreshes the case. It uses `id`, `type`, `version`. It returns `Promise<void>`.

### `reorderTestCases(problemID: string, req: ReorderRequest)`

Calls `TestCaseApi.reorderTestCases` with the ordered identifiers and expected set version and refreshes the list. It uses `problemID`, `req`. It returns `Promise<void>`.

### `requestUserList(query: PageQuery)`

Calls `AccountApi.listUsers` with `query` and presents the returned account page. It uses `query`. It returns `Promise<void>`.

### `requestUserDetails(userID: string)`

Calls `AccountApi.getUserDetails` for `userID` and presents the account details. It uses `userID`. It returns `Promise<void>`.

### `changeAccountStatus(userID: string, status: string, version: number)`

Calls `AccountApi.changeUserStatus` with the requested status and version and refreshes the account row. It uses `userID`, `status`, `version`. It returns `Promise<void>`.

### `requestSubmissionList(query: PageQuery)`

Calls `SubmissionApi.listAllSubmissions` with `query` and presents the administrative submission page. It uses `query`. It returns `Promise<void>`.

### `requestSubmissionDetails(submissionID: string)`

Calls `SubmissionApi.getAnySubmissionDetails` for `submissionID` and presents the read-only details. It uses `submissionID`. It returns `Promise<void>`.

### `displayReadOnlyDetails(details: SubmissionDetailsResponse)`

Renders the supplied details without offering edit actions for the reviewed submission. It uses `details`. No value is returned.

### `displayValidationErrors(errors: Record<string, string>)`

Maps the field errors in `errors` to the corresponding form controls. It uses `errors`. No value is returned.

### `verifyStoredState()`

Re-reads the affected administrative resource through the matching typed API client and compares it with the locally held draft state. It has no parameters. It returns `Promise<void>`.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
