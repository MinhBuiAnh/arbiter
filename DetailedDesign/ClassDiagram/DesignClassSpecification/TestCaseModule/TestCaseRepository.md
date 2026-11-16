# TestCaseRepository — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `TestCaseRepository` |
| Classifier kind | Interface |
| Package / subsystem | `Test Case Module (Go)` |
| DCD alias | `TCTestCaseRepository` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`TestCaseRepository` is an interface in the `Test Case Module (Go)` package/subsystem of the design class diagram.

Persistence port for test-case metadata, ordering, classification, and set version.

- Declared outgoing design relationships: `TestCase`, `TestCaseMetadata`.
- Declared incoming design relationships: `TestCaseService`, `TestCasePostgresRepository`.
- Realized by: `TestCasePostgresRepository`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `FindTestCase(ctx: context.Context, id: TestCaseID)` | `(*TestCase, error)` | Public | Instance | Loads one test case by identifier. |
| `ReadTestCaseSet(ctx: context.Context, problemID: ProblemID)` | `(*TestCaseSet, error)` | Public | Instance | Loads the ordered test-case set and its version. |
| `ListTestCaseMetadata(ctx: context.Context, problemID: ProblemID)` | `([]TestCaseMetadata, error)` | Public | Instance | Returns the ordered metadata for all cases of the problem. |
| `SaveTestCase(ctx: context.Context, testCase: *TestCase)` | `error` | Public | Instance | Inserts the test-case metadata and protected references. |
| `UpdateTestCase(ctx: context.Context, testCase: *TestCase, expectedVersion: int)` | `error` | Public | Instance | Updates the metadata with an optimistic-concurrency check. |
| `DeleteAndCompactTestCases(ctx: context.Context, problemID: ProblemID, testCaseID: TestCaseID)` | `error` | Public | Instance | Deletes the case and closes the ordinal gap. |
| `SaveTestCaseOrder(ctx: context.Context, problemID: ProblemID, orderedIDs: []TestCaseID, expectedSetVersion: int)` | `error` | Public | Instance | Persists the complete order with the expected set version. |
| `SaveTestCaseType(ctx: context.Context, id: TestCaseID, testCaseType: TestCaseType, expectedVersion: int)` | `error` | Public | Instance | Updates the classification with the expected version. |
| `ReadTestCaseType(ctx: context.Context, id: TestCaseID)` | `(TestCaseType, error)` | Public | Instance | Reads only the classification of the case. |
| `ReadTestCaseSetVersion(ctx: context.Context, problemID: ProblemID)` | `(int, error)` | Public | Instance | Reads the current set version for the problem. |

## 4. Parameter design

### `FindTestCase(ctx: context.Context, id: TestCaseID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `TestCaseID` | — | in | Identifies the target object. |

### `ReadTestCaseSet(ctx: context.Context, problemID: ProblemID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |

### `ListTestCaseMetadata(ctx: context.Context, problemID: ProblemID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |

### `SaveTestCase(ctx: context.Context, testCase: *TestCase)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `testCase` | `*TestCase` | — | in | Supplies the test case used by the operation. |

### `UpdateTestCase(ctx: context.Context, testCase: *TestCase, expectedVersion: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `testCase` | `*TestCase` | — | in | Supplies the test case used by the operation. |
| `expectedVersion` | `int` | — | in | Supplies the optimistic-concurrency version checked by the operation. |

### `DeleteAndCompactTestCases(ctx: context.Context, problemID: ProblemID, testCaseID: TestCaseID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |
| `testCaseID` | `TestCaseID` | — | in | Identifies the target test case. |

### `SaveTestCaseOrder(ctx: context.Context, problemID: ProblemID, orderedIDs: []TestCaseID, expectedSetVersion: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |
| `orderedIDs` | `[]TestCaseID` | — | in | Supplies the complete ordered list of test-case identifiers. |
| `expectedSetVersion` | `int` | — | in | Supplies the test-case set version checked by the operation. |

### `SaveTestCaseType(ctx: context.Context, id: TestCaseID, testCaseType: TestCaseType, expectedVersion: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `TestCaseID` | — | in | Identifies the target object. |
| `testCaseType` | `TestCaseType` | — | in | Target test-case classification. |
| `expectedVersion` | `int` | — | in | Supplies the optimistic-concurrency version checked by the operation. |

### `ReadTestCaseType(ctx: context.Context, id: TestCaseID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `TestCaseID` | — | in | Identifies the target object. |

### `ReadTestCaseSetVersion(ctx: context.Context, problemID: ProblemID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-RES-003` | Test case is missing or belongs to another problem. | The test-case operation is rejected. | [SD-UC-AD-T-02-UpdateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-02-UpdateTestCase.md) |

## 6. Method

### `FindTestCase(ctx: context.Context, id: TestCaseID)`

Loads one test case by identifier. It is implemented by `TestCasePostgresRepository`. It is called by `TestCaseService`. It uses `ctx`, `id`. It returns `(*TestCase, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ReadTestCaseSet(ctx: context.Context, problemID: ProblemID)`

Loads the ordered test-case set and its version. It is implemented by `TestCasePostgresRepository`. It is called by `TestCaseService`. It uses `ctx`, `problemID`. It returns `(*TestCaseSet, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ListTestCaseMetadata(ctx: context.Context, problemID: ProblemID)`

Returns the ordered metadata for all cases of the problem. It is implemented by `TestCasePostgresRepository`. It is called by `TestCaseService`. It uses `ctx`, `problemID`. It returns `([]TestCaseMetadata, error)`. Failures are returned through the declared error result rather than as a successful value.

### `SaveTestCase(ctx: context.Context, testCase: *TestCase)`

Inserts the test-case metadata and protected references. It is implemented by `TestCasePostgresRepository`. It is called by `TestCaseService`. It uses `ctx`, `testCase`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `UpdateTestCase(ctx: context.Context, testCase: *TestCase, expectedVersion: int)`

Updates the metadata with an optimistic-concurrency check. It is implemented by `TestCasePostgresRepository`. It is called by `TestCaseService`. It uses `ctx`, `testCase`, `expectedVersion`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `DeleteAndCompactTestCases(ctx: context.Context, problemID: ProblemID, testCaseID: TestCaseID)`

Deletes the case and closes the ordinal gap. It is implemented by `TestCasePostgresRepository`. It is called by `TestCaseService`. It uses `ctx`, `problemID`, `testCaseID`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `SaveTestCaseOrder(ctx: context.Context, problemID: ProblemID, orderedIDs: []TestCaseID, expectedSetVersion: int)`

Persists the complete order with the expected set version. It is implemented by `TestCasePostgresRepository`. It is called by `TestCaseService`. It uses `ctx`, `problemID`, `orderedIDs`, `expectedSetVersion`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `SaveTestCaseType(ctx: context.Context, id: TestCaseID, testCaseType: TestCaseType, expectedVersion: int)`

Updates the classification with the expected version. It is implemented by `TestCasePostgresRepository`. It is called by `TestCaseService`. It uses `ctx`, `id`, `testCaseType`, `expectedVersion`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ReadTestCaseType(ctx: context.Context, id: TestCaseID)`

Reads only the classification of the case. It is implemented by `TestCasePostgresRepository`. It is called by `TestCaseService`. It uses `ctx`, `id`. It returns `(TestCaseType, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ReadTestCaseSetVersion(ctx: context.Context, problemID: ProblemID)`

Reads the current set version for the problem. It is implemented by `TestCasePostgresRepository`. It is called by `TestCaseService`. It uses `ctx`, `problemID`. It returns `(int, error)`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
