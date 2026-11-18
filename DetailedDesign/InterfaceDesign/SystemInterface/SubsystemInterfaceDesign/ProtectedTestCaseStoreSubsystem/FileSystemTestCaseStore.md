# FileSystemTestCaseStore — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `FileSystemTestCaseStore` |
| Classifier kind | Class |
| Package / subsystem | `Protected Test Case Store Subsystem (Go)` |
| DCD alias | `FSFileSystemTestCaseStore` |
| Design class diagram | [DesignClassDiagram.md](../../../../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../../../ClassDiagram/Ruleset.md) |
| Internal subsystem design | [ProtectedTestCaseStoreSubsystem.md](../../SubsystemDesign/ProtectedTestCaseStoreSubsystem/ProtectedTestCaseStoreSubsystem.md) |
| Status | Draft |
| Version | 0.2 |
| Date | 2026-11-18 |

## 1. Class identification

`FileSystemTestCaseStore` is the concrete protected-filesystem adapter in the `Protected Test Case Store Subsystem (Go)`. It realizes the `TestCaseStore` interface.

- Declared outgoing design relationships: `TestCaseStore`.
- Realizes: `TestCaseStore`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|---|---|---|---|---|---|
| `rootDir` | `string` | Private | Instance | Configured at construction | Absolute path to the dedicated protected volume's store root. |

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|---|---|---|---|---|
| `ReadTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID)` | `(TestCaseFileRefs, error)` | Public | Instance | Returns deterministic relative references for both protected files after confirming they are regular and readable. |
| `ReadTestCaseData(ctx: context.Context, testCaseID: TestCaseID)` | `(TestCaseData, error)` | Public | Instance | Reads the input and expected-output contents from the protected volume. |
| `StoreTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID, data: TestCaseData)` | `error` | Public | Instance | Creates both protected files and publishes them as one staged case directory. |
| `ReplaceChangedFiles(ctx: context.Context, testCaseID: TestCaseID, data: TestCaseData)` | `error` | Public | Instance | Replaces only changed protected files while retaining the existing relative references. |
| `VerifyTestCaseFilesReadable(ctx: context.Context, testCaseID: TestCaseID)` | `error` | Public | Instance | Confirms both protected files exist as regular readable files. |
| `DeleteTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID)` | `error` | Public | Instance | Removes the case directory; repeated deletion of an absent directory succeeds. |

## 4. Parameter design

### `ReadTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Carries cancellation and request-scoped values. |
| `testCaseID` | `TestCaseID` | — | in | Identifies the case without supplying a filesystem path. |

### `ReadTestCaseData(ctx: context.Context, testCaseID: TestCaseID)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Carries cancellation and request-scoped values. |
| `testCaseID` | `TestCaseID` | — | in | Identifies the case without supplying a filesystem path. |

### `StoreTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID, data: TestCaseData)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Carries cancellation and request-scoped values. |
| `testCaseID` | `TestCaseID` | — | in | Identifies the target case. |
| `data` | `TestCaseData` | — | in | Supplies input and expected-output content. |

### `ReplaceChangedFiles(ctx: context.Context, testCaseID: TestCaseID, data: TestCaseData)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Carries cancellation and request-scoped values. |
| `testCaseID` | `TestCaseID` | — | in | Identifies the target case. |
| `data` | `TestCaseData` | — | in | Supplies the desired input and expected-output content. |

### `VerifyTestCaseFilesReadable(ctx: context.Context, testCaseID: TestCaseID)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Carries cancellation and request-scoped values. |
| `testCaseID` | `TestCaseID` | — | in | Identifies the case to check. |

### `DeleteTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Carries cancellation and request-scoped values. |
| `testCaseID` | `TestCaseID` | — | in | Identifies the case to remove. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-RES-002` | Required case content is absent or unreadable. | Return the error; callers reject the operation or report an internal judging failure as appropriate. | [ReadTestCaseData](../../SubsystemDesign/ProtectedTestCaseStoreSubsystem/Diagram/SD-PTS-ReadTestCaseData.md) |
| `ERR-SYS-001` | An unexpected protected-filesystem operation fails. | Return the error; do not return partial content or log protected content. | [Protected Test Case Store subsystem](../../SubsystemDesign/ProtectedTestCaseStoreSubsystem/ProtectedTestCaseStoreSubsystem.md) |
| Context error | The supplied context is canceled before an operation step. | Return the context error and do not report success. | [StoreTestCaseFiles](../../SubsystemDesign/ProtectedTestCaseStoreSubsystem/Diagram/SD-PTS-StoreTestCaseFiles.md) |
| Conflicting existing content | `StoreTestCaseFiles` finds an existing case with different content. | Return an error without overwriting existing files. | [StoreTestCaseFiles](../../SubsystemDesign/ProtectedTestCaseStoreSubsystem/Diagram/SD-PTS-StoreTestCaseFiles.md) |

## 6. Method

Each operation implements the corresponding `TestCaseStore` contract. The store derives confined file locations from `testCaseID`, returns relative references, and keeps protected content on the configured volume. The implementation and per-operation collaborations are documented in the [internal subsystem element specification](../../SubsystemDesign/ProtectedTestCaseStoreSubsystem/Specification/FileSystemTestCaseStore.md) and its linked sequence diagrams.

## 7. Other diagrams

- [ReadTestCaseFiles](../../SubsystemDesign/ProtectedTestCaseStoreSubsystem/Diagram/SD-PTS-ReadTestCaseFiles.md)
- [ReadTestCaseData](../../SubsystemDesign/ProtectedTestCaseStoreSubsystem/Diagram/SD-PTS-ReadTestCaseData.md)
- [StoreTestCaseFiles](../../SubsystemDesign/ProtectedTestCaseStoreSubsystem/Diagram/SD-PTS-StoreTestCaseFiles.md)
- [ReplaceChangedFiles](../../SubsystemDesign/ProtectedTestCaseStoreSubsystem/Diagram/SD-PTS-ReplaceChangedFiles.md)
- [VerifyTestCaseFilesReadable](../../SubsystemDesign/ProtectedTestCaseStoreSubsystem/Diagram/SD-PTS-VerifyTestCaseFilesReadable.md)
- [DeleteTestCaseFiles](../../SubsystemDesign/ProtectedTestCaseStoreSubsystem/Diagram/SD-PTS-DeleteTestCaseFiles.md)
