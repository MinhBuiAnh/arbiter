# TestCaseService — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `TestCaseService` |
| Classifier kind | Class |
| Package / subsystem | `Test Case Module (Go)` |
| DCD alias | `TCTestCaseService` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`TestCaseService` is a class in the `Test Case Module (Go)` package/subsystem of the design class diagram.

Application service for administrator test-case lifecycle operations.

- Declared outgoing design relationships: `TestCaseRepository`, `TestCaseStore`, `ProblemLookup`.
- Declared incoming design relationships: `TestCaseHandler`, `TestCaseSetReaderAdapter`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `CreateTestCase(ctx: context.Context, principal: Principal, problemID: ProblemID, req: TestCaseWriteRequest)` | `(*TestCase, error)` | Public | Instance | Authorizes the caller, verifies that the problem exists and is editable, validates the data, creates and validates the `TestCase`, stores the metadata, and stores the protected files. |
| `UpdateTestCase(ctx: context.Context, principal: Principal, testCaseID: TestCaseID, req: TestCaseWriteRequest, expectedVersion: int)` | `(*TestCase, error)` | Public | Instance | Authorizes the caller, loads the case, verifies its problem association, validates the replacement data, applies the type and ordinal changes, updates the metadata with the expected version, and replaces changed files. |
| `DeleteTestCase(ctx: context.Context, principal: Principal, testCaseID: TestCaseID, expectedVersion: int)` | `error` | Public | Instance | Authorizes the caller, loads the case, verifies the association and version, deletes and compacts the metadata, and removes the protected files. |
| `ChangeTestCaseType(ctx: context.Context, principal: Principal, testCaseID: TestCaseID, testCaseType: TestCaseType, expectedVersion: int)` | `(*TestCase, error)` | Public | Instance | Authorizes the caller, loads the case, verifies the association, validates the classification, applies the change, and saves it with the expected version. |
| `ReorderTestCases(ctx: context.Context, principal: Principal, problemID: ProblemID, orderedIDs: []TestCaseID, expectedSetVersion: int)` | `([]TestCase, error)` | Public | Instance | Authorizes the caller, reads the set, checks the expected set version, applies `TestCaseSet.Reorder`, and saves the new order. |
| `GetOrderedTestCases(ctx: context.Context, problemID: ProblemID)` | `([]TestCaseMetadata, error)` | Public | Instance | Reads ordered test-case metadata through `TestCaseRepository.ListTestCaseMetadata`. |
| `GetTestCase(ctx: context.Context, testCaseID: TestCaseID)` | `(*TestCase, error)` | Public | Instance | Loads one test case through `TestCaseRepository.FindTestCase`. |
| `GetTestCaseType(ctx: context.Context, testCaseID: TestCaseID)` | `(TestCaseType, error)` | Public | Instance | Reads the stored classification through `TestCaseRepository.ReadTestCaseType`. |
| `GetRequiredCaseTypes(ctx: context.Context, problemID: ProblemID)` | `(TestCaseSetSummary, error)` | Public | Instance | Reads the set and returns `TestCaseSet.Summary` for publication checks. |
| `VerifyTestCaseAssociation(ctx: context.Context, problemID: ProblemID, testCaseID: TestCaseID)` | `error` | Public | Instance | Checks that the loaded test case belongs to the supplied problem. |
| `GetTestCaseFileReferences(ctx: context.Context, testCaseID: TestCaseID)` | `(TestCaseFileRefs, error)` | Public | Instance | Reads the protected file references through `TestCaseStore.ReadTestCaseFiles`. |
| `VerifyTestCaseFilesReadable(ctx: context.Context, problemID: ProblemID)` | `error` | Public | Instance | Checks each case in the problem through `TestCaseStore.VerifyTestCaseFilesReadable`. |
| `ValidateTestCaseData(req: TestCaseWriteRequest)` | `error` | Private | Instance | Internal helper that checks that input and expected output are present, the type is valid, and the ordinal is positive. |
| `ValidateType(testCaseType: TestCaseType)` | `error` | Private | Instance | Internal helper that accepts only the test-case classifications declared by `TestCaseType`. |
| `HandlePersistenceFailure(err: error)` | `error` | Private | Instance | Internal helper that maps repository and store failures to the declared not-found, conflict, validation, or internal outcomes. |

## 4. Parameter design

### `CreateTestCase(ctx: context.Context, principal: Principal, problemID: ProblemID, req: TestCaseWriteRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |
| `req` | `TestCaseWriteRequest` | — | in | Input, expected output, type, and ordinal for the new test case. |

### `UpdateTestCase(ctx: context.Context, principal: Principal, testCaseID: TestCaseID, req: TestCaseWriteRequest, expectedVersion: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `testCaseID` | `TestCaseID` | — | in | Identifies the target test case. |
| `req` | `TestCaseWriteRequest` | — | in | Replacement test-case content and metadata. |
| `expectedVersion` | `int` | — | in | Supplies the optimistic-concurrency version checked by the operation. |

### `DeleteTestCase(ctx: context.Context, principal: Principal, testCaseID: TestCaseID, expectedVersion: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `testCaseID` | `TestCaseID` | — | in | Identifies the target test case. |
| `expectedVersion` | `int` | — | in | Supplies the optimistic-concurrency version checked by the operation. |

### `ChangeTestCaseType(ctx: context.Context, principal: Principal, testCaseID: TestCaseID, testCaseType: TestCaseType, expectedVersion: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `testCaseID` | `TestCaseID` | — | in | Identifies the target test case. |
| `testCaseType` | `TestCaseType` | — | in | Target test-case classification. |
| `expectedVersion` | `int` | — | in | Supplies the optimistic-concurrency version checked by the operation. |

### `ReorderTestCases(ctx: context.Context, principal: Principal, problemID: ProblemID, orderedIDs: []TestCaseID, expectedSetVersion: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |
| `orderedIDs` | `[]TestCaseID` | — | in | Complete ordered list of test-case identifiers. |
| `expectedSetVersion` | `int` | — | in | Set version the client last observed. |

### `GetOrderedTestCases(ctx: context.Context, problemID: ProblemID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |

### `GetTestCase(ctx: context.Context, testCaseID: TestCaseID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `testCaseID` | `TestCaseID` | — | in | Identifies the target test case. |

### `GetTestCaseType(ctx: context.Context, testCaseID: TestCaseID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `testCaseID` | `TestCaseID` | — | in | Identifies the target test case. |

### `GetRequiredCaseTypes(ctx: context.Context, problemID: ProblemID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |

### `VerifyTestCaseAssociation(ctx: context.Context, problemID: ProblemID, testCaseID: TestCaseID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `problemID` | `ProblemID` | — | in | Problem that must own the test case. |
| `testCaseID` | `TestCaseID` | — | in | Test case whose association is checked. |

### `GetTestCaseFileReferences(ctx: context.Context, testCaseID: TestCaseID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `testCaseID` | `TestCaseID` | — | in | Identifies the target test case. |

### `VerifyTestCaseFilesReadable(ctx: context.Context, problemID: ProblemID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |

### `ValidateTestCaseData(req: TestCaseWriteRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `req` | `TestCaseWriteRequest` | — | in | Test-case content and metadata to validate. |

### `ValidateType(testCaseType: TestCaseType)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `testCaseType` | `TestCaseType` | — | in | Classification to validate. |

### `HandlePersistenceFailure(err: error)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `err` | `error` | — | in | Supplies the collaborator failure to classify or persist. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-PERM-002` | Insufficient privileges. | The administrator operation is rejected by authorization. | [SD-UC-AD-T-01-CreateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase.md) |
| `ERR-VAL-001` | Invalid data for the requested operation. | Validation fails before persistence and the caller receives the field-level error. | [SD-UC-AD-T-01-CreateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase.md) |
| `ERR-VAL-009` | Duplicate or invalid test-case order. | The reorder or update is rejected; the stored order is unchanged. | [SD-UC-AD-T-01-CreateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase.md) |
| `ERR-RES-001` | Problem not found. | The operation is rejected without changing state. | [SD-UC-AD-T-01-CreateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase.md) |
| `ERR-RES-003` | Test case is missing or belongs to another problem. | The test-case operation is rejected. | [SD-UC-AD-T-02-UpdateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-02-UpdateTestCase.md) |
| `ERR-CONFLICT-001` | Problem is not editable in its current lifecycle state. | The test-case or problem mutation is rejected. | [SD-UC-AD-T-01-CreateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase.md) |
| `ERR-CONFLICT-002` | Concurrent test-case set or order change. | The reorder is rejected; the caller must reload the current set version. | [SD-UC-AD-T-05-ReorderTestCases-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-05-ReorderTestCases-Exceptions.md) |
| `ERR-CONFLICT-007` | Concurrent test-case update. | The update is rejected; the caller reloads the test case. | [SD-UC-AD-T-02-UpdateTestCase-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-02-UpdateTestCase-Exceptions.md) |
| `ERR-CONFLICT-008` | Concurrent test-case set change. | The delete or reorder is rejected; the caller reloads the set. | [SD-UC-AD-T-03-DeleteTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-03-DeleteTestCase.md) |
| `ERR-SYS-001` | Internal system, persistence, or assembly error. | The request fails with an internal error; transactions roll back where applicable. | [SD-UC-AD-T-01-CreateTestCase-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase-Exceptions.md) |

## 6. Method

### `CreateTestCase(ctx: context.Context, principal: Principal, problemID: ProblemID, req: TestCaseWriteRequest)`

Authorizes the caller, verifies that the problem exists and is editable, validates the data, creates and validates the `TestCase`, stores the metadata, and stores the protected files. It uses `ctx`, `principal`, `problemID`, `req`. It returns `(*TestCase, error)`. Failures are returned through the declared error result rather than as a successful value.

### `UpdateTestCase(ctx: context.Context, principal: Principal, testCaseID: TestCaseID, req: TestCaseWriteRequest, expectedVersion: int)`

Authorizes the caller, loads the case, verifies its problem association, validates the replacement data, applies the type and ordinal changes, updates the metadata with the expected version, and replaces changed files. It uses `ctx`, `principal`, `testCaseID`, `req`, `expectedVersion`. It returns `(*TestCase, error)`. Failures are returned through the declared error result rather than as a successful value.

### `DeleteTestCase(ctx: context.Context, principal: Principal, testCaseID: TestCaseID, expectedVersion: int)`

Authorizes the caller, loads the case, verifies the association and version, deletes and compacts the metadata, and removes the protected files. It uses `ctx`, `principal`, `testCaseID`, `expectedVersion`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ChangeTestCaseType(ctx: context.Context, principal: Principal, testCaseID: TestCaseID, testCaseType: TestCaseType, expectedVersion: int)`

Authorizes the caller, loads the case, verifies the association, validates the classification, applies the change, and saves it with the expected version. It uses `ctx`, `principal`, `testCaseID`, `testCaseType`, `expectedVersion`. It returns `(*TestCase, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ReorderTestCases(ctx: context.Context, principal: Principal, problemID: ProblemID, orderedIDs: []TestCaseID, expectedSetVersion: int)`

Authorizes the caller, reads the set, checks the expected set version, applies `TestCaseSet.Reorder`, and saves the new order. It uses `ctx`, `principal`, `problemID`, `orderedIDs`, `expectedSetVersion`. It returns `([]TestCase, error)`. Failures are returned through the declared error result rather than as a successful value.

### `GetOrderedTestCases(ctx: context.Context, problemID: ProblemID)`

Reads ordered test-case metadata through `TestCaseRepository.ListTestCaseMetadata`. It uses `ctx`, `problemID`. It returns `([]TestCaseMetadata, error)`. Failures are returned through the declared error result rather than as a successful value.

### `GetTestCase(ctx: context.Context, testCaseID: TestCaseID)`

Loads one test case through `TestCaseRepository.FindTestCase`. It uses `ctx`, `testCaseID`. It returns `(*TestCase, error)`. Failures are returned through the declared error result rather than as a successful value.

### `GetTestCaseType(ctx: context.Context, testCaseID: TestCaseID)`

Reads the stored classification through `TestCaseRepository.ReadTestCaseType`. It uses `ctx`, `testCaseID`. It returns `(TestCaseType, error)`. Failures are returned through the declared error result rather than as a successful value.

### `GetRequiredCaseTypes(ctx: context.Context, problemID: ProblemID)`

Reads the set and returns `TestCaseSet.Summary` for publication checks. It uses `ctx`, `problemID`. It returns `(TestCaseSetSummary, error)`. Failures are returned through the declared error result rather than as a successful value.

### `VerifyTestCaseAssociation(ctx: context.Context, problemID: ProblemID, testCaseID: TestCaseID)`

Checks that the loaded test case belongs to the supplied problem. It uses `ctx`, `problemID`, `testCaseID`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `GetTestCaseFileReferences(ctx: context.Context, testCaseID: TestCaseID)`

Reads the protected file references through `TestCaseStore.ReadTestCaseFiles`. It uses `ctx`, `testCaseID`. It returns `(TestCaseFileRefs, error)`. Failures are returned through the declared error result rather than as a successful value.

### `VerifyTestCaseFilesReadable(ctx: context.Context, problemID: ProblemID)`

Checks each case in the problem through `TestCaseStore.VerifyTestCaseFilesReadable`. It uses `ctx`, `problemID`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ValidateTestCaseData(req: TestCaseWriteRequest)`

Checks that input and expected output are present, the type is valid, and the ordinal is positive. It uses `req`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ValidateType(testCaseType: TestCaseType)`

Accepts only the test-case classifications declared by `TestCaseType`. It uses `testCaseType`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `HandlePersistenceFailure(err: error)`

Maps repository and store failures to the declared not-found, conflict, validation, or internal outcomes. It uses `err`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
