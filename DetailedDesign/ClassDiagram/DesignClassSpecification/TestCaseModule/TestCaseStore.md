# TestCaseStore — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `TestCaseStore` |
| Classifier kind | Interface |
| Package / subsystem | `Test Case Module (Go)` |
| DCD alias | `TCTestCaseStore` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`TestCaseStore` is an interface in the `Test Case Module (Go)` package/subsystem of the design class diagram.

Protected test-case storage port for file references and file data.

- Declared outgoing design relationships: `TestCaseData`, `TestCaseFileRefs`.
- Declared incoming design relationships: `TestCaseService`, `TestCaseExecutor`, `FileSystemTestCaseStore`.
- Realized by: `FileSystemTestCaseStore`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `ReadTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID)` | `(TestCaseFileRefs, error)` | Public | Instance | Returns the protected input and expected-output references. |
| `ReadTestCaseData(ctx: context.Context, testCaseID: TestCaseID)` | `(TestCaseData, error)` | Public | Instance | Reads the protected input and expected-output content. |
| `StoreTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID, data: TestCaseData)` | `error` | Public | Instance | Writes the input and expected-output content and returns its references. |
| `ReplaceChangedFiles(ctx: context.Context, testCaseID: TestCaseID, data: TestCaseData)` | `error` | Public | Instance | Replaces the files whose content changed. |
| `VerifyTestCaseFilesReadable(ctx: context.Context, testCaseID: TestCaseID)` | `error` | Public | Instance | Checks that the case files exist and are readable. |
| `DeleteTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID)` | `error` | Public | Instance | Removes the protected files for the case. |

## 4. Parameter design

### `ReadTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `testCaseID` | `TestCaseID` | — | in | Identifies the target test case. |

### `ReadTestCaseData(ctx: context.Context, testCaseID: TestCaseID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `testCaseID` | `TestCaseID` | — | in | Identifies the target test case. |

### `StoreTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID, data: TestCaseData)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `testCaseID` | `TestCaseID` | — | in | Identifies the target test case. |
| `data` | `TestCaseData` | — | in | Supplies test-case input and expected-output content. |

### `ReplaceChangedFiles(ctx: context.Context, testCaseID: TestCaseID, data: TestCaseData)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `testCaseID` | `TestCaseID` | — | in | Identifies the target test case. |
| `data` | `TestCaseData` | — | in | Supplies test-case input and expected-output content. |

### `VerifyTestCaseFilesReadable(ctx: context.Context, testCaseID: TestCaseID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `testCaseID` | `TestCaseID` | — | in | Identifies the target test case. |

### `DeleteTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `testCaseID` | `TestCaseID` | — | in | Identifies the target test case. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-RES-002` | Test-case data is missing or unreadable. | The operation is rejected; judging records an internal error rather than a user-code verdict. | [SD-UC-SYS-J-01-ProcessSubmission-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md) |

## 6. Method

### `ReadTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID)`

Returns the protected input and expected-output references. It is implemented by `FileSystemTestCaseStore`. It is called by `TestCaseService`, `TestCaseExecutor`. It uses `ctx`, `testCaseID`. It returns `(TestCaseFileRefs, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ReadTestCaseData(ctx: context.Context, testCaseID: TestCaseID)`

Reads the protected input and expected-output content. It is implemented by `FileSystemTestCaseStore`. It is called by `TestCaseService`, `TestCaseExecutor`. It uses `ctx`, `testCaseID`. It returns `(TestCaseData, error)`. Failures are returned through the declared error result rather than as a successful value.

### `StoreTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID, data: TestCaseData)`

Writes the input and expected-output content and returns its references. It is implemented by `FileSystemTestCaseStore`. It is called by `TestCaseService`, `TestCaseExecutor`. It uses `ctx`, `testCaseID`, `data`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ReplaceChangedFiles(ctx: context.Context, testCaseID: TestCaseID, data: TestCaseData)`

Replaces the files whose content changed. It is implemented by `FileSystemTestCaseStore`. It is called by `TestCaseService`, `TestCaseExecutor`. It uses `ctx`, `testCaseID`, `data`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `VerifyTestCaseFilesReadable(ctx: context.Context, testCaseID: TestCaseID)`

Checks that the case files exist and are readable. It is implemented by `FileSystemTestCaseStore`. It is called by `TestCaseService`, `TestCaseExecutor`. It uses `ctx`, `testCaseID`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `DeleteTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID)`

Removes the protected files for the case. It is implemented by `FileSystemTestCaseStore`. It is called by `TestCaseService`, `TestCaseExecutor`. It uses `ctx`, `testCaseID`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
