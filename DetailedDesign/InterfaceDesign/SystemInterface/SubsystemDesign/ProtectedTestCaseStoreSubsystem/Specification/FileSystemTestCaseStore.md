# FileSystemTestCaseStore — Subsystem Element Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Subsystem element specification |
| Element | `FileSystemTestCaseStore` |
| Owning subsystem | Protected Test Case Store Subsystem (Go) |
| Classifier kind | Class |
| Realized interface | [TestCaseStore](../../../../../ClassDiagram/DesignClassSpecification/TestCaseModule/TestCaseStore.md) |
| Interface-facing class specification | [FileSystemTestCaseStore](../../../SubsystemInterfaceDesign/ProtectedTestCaseStoreSubsystem/FileSystemTestCaseStore.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-18 |

## 1. Identification

`FileSystemTestCaseStore` is the concrete adapter that realizes all operations of `TestCaseStore`. It confines content to a configured protected volume and gives database metadata stable, relative file references.

## 2. Attribute Design

| Name | Data type | Visibility | Scope | Default value | Description |
|---|---|---|---|---|---|
| `rootDir` | `string` | Private | Instance | Configured at construction | Absolute path to the dedicated protected volume's store root. |

## 3. Operation Design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|---|---|---|---|---|
| `ReadTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID)` | `(TestCaseFileRefs, error)` | Public | Instance | Returns deterministic relative references after verifying both files. |
| `ReadTestCaseData(ctx: context.Context, testCaseID: TestCaseID)` | `(TestCaseData, error)` | Public | Instance | Reads both protected content files without returning partial data. |
| `StoreTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID, data: TestCaseData)` | `error` | Public | Instance | Stages and publishes both files; an identical retry succeeds and conflicting existing content is not overwritten. |
| `ReplaceChangedFiles(ctx: context.Context, testCaseID: TestCaseID, data: TestCaseData)` | `error` | Public | Instance | Replaces only changed files with rollback attempts on failure. |
| `VerifyTestCaseFilesReadable(ctx: context.Context, testCaseID: TestCaseID)` | `error` | Public | Instance | Confirms both files are regular and readable. |
| `DeleteTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID)` | `error` | Public | Instance | Removes the case directory; safe to retry after partial deletion. |

## 4. Parameter Design

### `ReadTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Carries cancellation and request-scoped values. |
| `testCaseID` | `TestCaseID` | — | in | Selects a case; it is hashed before path construction. |

### `ReadTestCaseData(ctx: context.Context, testCaseID: TestCaseID)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Carries cancellation and request-scoped values. |
| `testCaseID` | `TestCaseID` | — | in | Selects a case; it is hashed before path construction. |

### `StoreTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID, data: TestCaseData)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Carries cancellation and request-scoped values. |
| `testCaseID` | `TestCaseID` | — | in | Selects the target case. |
| `data` | `TestCaseData` | — | in | Supplies the input and expected-output content. |

### `ReplaceChangedFiles(ctx: context.Context, testCaseID: TestCaseID, data: TestCaseData)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Carries cancellation and request-scoped values. |
| `testCaseID` | `TestCaseID` | — | in | Selects the target case. |
| `data` | `TestCaseData` | — | in | Supplies the desired input and expected-output content. |

### `VerifyTestCaseFilesReadable(ctx: context.Context, testCaseID: TestCaseID)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Carries cancellation and request-scoped values. |
| `testCaseID` | `TestCaseID` | — | in | Selects the case to check. |

### `DeleteTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `ctx` | `context.Context` | — | in | Carries cancellation and request-scoped values. |
| `testCaseID` | `TestCaseID` | — | in | Selects the case to remove. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-RES-002` | Required case content is missing, unreadable, symlinked, or not a regular file. | Return an error and no partial data or references. | [ReadTestCaseData](../Diagram/SD-PTS-ReadTestCaseData.md) |
| `ERR-SYS-001` | Filesystem access, staging, permission, or rename fails unexpectedly. | Return an error; clean up staging and attempt replacement rollback. Report rollback or cleanup failures; never return success-shaped data. | [ReplaceChangedFiles](../Diagram/SD-PTS-ReplaceChangedFiles.md) |
| Context error | The context is canceled before an operation step. | Return `ctx.Err()` and clean up staged data. | [StoreTestCaseFiles](../Diagram/SD-PTS-StoreTestCaseFiles.md) |
| Conflicting existing content | A store operation finds an existing directory, symlink, or non-regular file with different or invalid content. | Return an error without overwriting existing files. | [StoreTestCaseFiles](../Diagram/SD-PTS-StoreTestCaseFiles.md) |
| Partial deletion | `RemoveAll` fails after removing part of the case directory. | Return `ERR-SYS-001`; the operation is safe to retry. | [DeleteTestCaseFiles](../Diagram/SD-PTS-DeleteTestCaseFiles.md) |

## 6. Method

### `ReadTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID)`

Rejects a canceled context before filesystem access. Hashes `testCaseID` with SHA-256 and hex-encodes the digest to derive fixed `input.txt` and `expected-output.txt` paths below `rootDir/cases`. It checks each path with `Lstat`, rejects symlinks and non-regular files, and opens and closes both files to verify readability. It returns relative paths only after both checks succeed. Missing or unreadable files return `ERR-RES-002`; other filesystem failures return `ERR-SYS-001`. It returns no partial references and never reads content into logs.

### `ReadTestCaseData(ctx: context.Context, testCaseID: TestCaseID)`

Checks the context, derives the same confined paths, and reads both files. It returns `TestCaseData` only after both reads succeed; if either is missing or unreadable it returns an empty result and `ERR-RES-002`, never one file as a success-shaped partial value. Other filesystem errors return `ERR-SYS-001`. Content is neither logged nor included in error messages.

### `StoreTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID, data: TestCaseData)`

Derives the case directory from the hashed ID and ensures the parent directory has owner-only access. Before publication, it checks any existing destination and rejects symlinks or non-regular files. It creates a staging directory beside the final directory, writes both files with mode `0600`, synchronizes and closes them, and checks the context between writes. It publishes the complete directory with a same-volume rename. If the destination already contains regular files with byte-identical content, the operation treats the call as an idempotent retry; different content is not overwritten and returns an error. On any failure before publication, it removes the staging directory and returns the original and any cleanup errors. Since this operation returns only `error`, the caller obtains references through a subsequent `ReadTestCaseFiles`.

### `ReplaceChangedFiles(ctx: context.Context, testCaseID: TestCaseID, data: TestCaseData)`

Reads both current files first; missing or unreadable content returns `ERR-RES-002`. It compares each file with the supplied string using byte equality and leaves unchanged files untouched. For each changed file, it retains the prior bytes, writes and synchronizes a temporary file in the same directory, then renames that file over the target. If a later step fails, it attempts to restore every file already replaced using the retained bytes. The operation returns an error in all failure cases. If rollback itself fails, the error includes both failures and operators must reconcile the file state before treating the test case as healthy. The interface does not promise an atomic two-file replacement.

### `VerifyTestCaseFilesReadable(ctx: context.Context, testCaseID: TestCaseID)`

Checks the context and both derived file paths. It rejects missing paths, symlinks, non-regular files, or failed open/close checks with `ERR-RES-002`; unexpected I/O failures return `ERR-SYS-001`. It returns no file content.

### `DeleteTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID)`

Checks the context, derives the case directory from the hashed ID, and removes it with `RemoveAll`. An absent directory is success, making retries safe after partial deletion. A filesystem error returns `ERR-SYS-001`; it is not suppressed. The operation deletes immediately when invoked, while the caller owns the product-level decision about whether and when to invoke it.

## 7. Other Diagrams

- [ReadTestCaseFiles](../Diagram/SD-PTS-ReadTestCaseFiles.md)
- [ReadTestCaseData](../Diagram/SD-PTS-ReadTestCaseData.md)
- [StoreTestCaseFiles](../Diagram/SD-PTS-StoreTestCaseFiles.md)
- [ReplaceChangedFiles](../Diagram/SD-PTS-ReplaceChangedFiles.md)
- [VerifyTestCaseFilesReadable](../Diagram/SD-PTS-VerifyTestCaseFilesReadable.md)
- [DeleteTestCaseFiles](../Diagram/SD-PTS-DeleteTestCaseFiles.md)
