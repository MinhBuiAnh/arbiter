# Protected Test Case Store Subsystem Design

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Subsystem design |
| Owning subsystem | Protected Test Case Store Subsystem (Go) |
| External contract | [TestCaseStore](../../../../ClassDiagram/DesignClassSpecification/TestCaseModule/TestCaseStore.md) |
| DCD | [DesignClassDiagram.md](../../../../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Subsystem Design Ruleset](../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-18 |

## 1. Responsibility

The subsystem realizes `TestCaseStore` by persisting test-case input and expected-output content on the configured protected filesystem volume and returning relative references suitable for database metadata. It is an internal part of the modular monolith, not a separately deployed service.

The adapter does not validate test-case semantics, decide whether data is public, or choose when deletion is requested. It must not log protected content or include it in errors. Callers remain responsible for keeping hidden data out of public and submission-facing responses. The open retention question in UC-AD-T-03 remains a system-level policy decision; `DeleteTestCaseFiles` removes files when invoked.

## 2. Realized Interface

| Interface operation | Internal realization | Collaborations | Sequence diagram |
|---|---|---|---|
| `ReadTestCaseFiles(ctx, testCaseID)` | `FileSystemTestCaseStore.ReadTestCaseFiles` | `crypto/sha256`, `encoding/hex`, `path/filepath`, `os` | [SD-PTS-ReadTestCaseFiles](Diagram/SD-PTS-ReadTestCaseFiles.md) |
| `ReadTestCaseData(ctx, testCaseID)` | `FileSystemTestCaseStore.ReadTestCaseData` | `crypto/sha256`, `encoding/hex`, `path/filepath`, `os` | [SD-PTS-ReadTestCaseData](Diagram/SD-PTS-ReadTestCaseData.md) |
| `StoreTestCaseFiles(ctx, testCaseID, data)` | `FileSystemTestCaseStore.StoreTestCaseFiles` | `crypto/sha256`, `encoding/hex`, `path/filepath`, `os` | [SD-PTS-StoreTestCaseFiles](Diagram/SD-PTS-StoreTestCaseFiles.md) |
| `ReplaceChangedFiles(ctx, testCaseID, data)` | `FileSystemTestCaseStore.ReplaceChangedFiles` | `crypto/sha256`, `encoding/hex`, `bytes`, `path/filepath`, `os` | [SD-PTS-ReplaceChangedFiles](Diagram/SD-PTS-ReplaceChangedFiles.md) |
| `VerifyTestCaseFilesReadable(ctx, testCaseID)` | `FileSystemTestCaseStore.VerifyTestCaseFilesReadable` | `crypto/sha256`, `encoding/hex`, `path/filepath`, `os` | [SD-PTS-VerifyTestCaseFilesReadable](Diagram/SD-PTS-VerifyTestCaseFilesReadable.md) |
| `DeleteTestCaseFiles(ctx, testCaseID)` | `FileSystemTestCaseStore.DeleteTestCaseFiles` | `crypto/sha256`, `encoding/hex`, `path/filepath`, `os` | [SD-PTS-DeleteTestCaseFiles](Diagram/SD-PTS-DeleteTestCaseFiles.md) |

`StoreTestCaseFiles` returns only an error. Callers obtain the deterministic references with `ReadTestCaseFiles`; this preserves the existing interface signature.

## 3. Internal Elements

| Element | Kind | Responsibility | Specification |
|---|---|---|---|
| `FileSystemTestCaseStore` | Class | Confines file operations to the configured protected root, protects file permissions, and realizes all `TestCaseStore` operations. | [FileSystemTestCaseStore.md](Specification/FileSystemTestCaseStore.md) |

The interface-facing class specification remains in [Subsystem Interface Design](../../SubsystemInterfaceDesign/ProtectedTestCaseStoreSubsystem/FileSystemTestCaseStore.md).

## 4. Dependencies

| Source element | Target interface or package | Reason | Kind | Exception justification |
|---|---|---|---|---|
| `FileSystemTestCaseStore` | Go standard-library packages (`bytes`, `context`, `crypto/sha256`, `encoding/hex`, `fmt`, `os`, `path/filepath`) | Checks cancellation and content equality, derives confined deterministic paths, and performs protected filesystem operations. | Package | — |

The protected filesystem volume is a deployment resource configured as `rootDir`, not another Arbiter subsystem. The volume must be mounted for the service account with access restricted to that account. The subsystem has no dependency on another Arbiter subsystem implementation.

## 5. Storage and Protection Rules

- `rootDir` is an absolute path configured during application assembly and points to a dedicated protected volume. The store fails with `ERR-SYS-001` if it is unavailable or cannot be accessed.
- A `TestCaseID` is SHA-256 hashed and hex-encoded before it is used in a path. Raw identifiers are never concatenated into filesystem paths.
- The deterministic layout is `cases/<sha256-hex>/input.txt` and `cases/<sha256-hex>/expected-output.txt`. `TestCaseFileRefs` contains paths relative to `rootDir`, never absolute paths.
- Store-owned directories use owner-only `0700` permissions and files use owner-only `0600` permissions, subject to stricter deployment umask or volume policy. Symlinks and non-regular content files are rejected.
- New case content is written to a staging directory on the same volume and published by rename only after both files are complete. Repeating a store with identical content succeeds; conflicting existing content is returned as an error without overwrite.
- Changed content is replaced per file using same-directory temporary files and rename. If a later replacement fails, already-replaced files are restored from backups where possible. A rollback failure is included in the returned error and requires operational reconciliation; the operation never reports success in that state.
- `DeleteTestCaseFiles` removes the hashed case directory and is safe to retry after partial deletion. Its behavior applies when called; it does not decide the product retention policy.
- The subsystem imposes no new content-size limit because none is defined by the interface. Input validation and storage capacity remain caller and deployment responsibilities.
- Content is never logged, included in error text, or returned by the references operation. The SRS specifies a protected filesystem volume but no application-level encryption or key-management contract; encryption-at-rest is therefore a deployment control, not an invented store dependency.
- Context cancellation is checked before filesystem actions and between staged writes. Individual standard-library filesystem calls are not interruptible once started.

## 6. Failure Outcomes

| Error / outcome | Condition | Handling |
|---|---|---|
| `ERR-RES-002` | Required case files are missing, unreadable, symlinked, or not regular files. | Return an error and no partial `TestCaseData` or references. The caller applies management or judging behavior. |
| `ERR-SYS-001` | An unexpected filesystem, staging, permission, or rename operation fails. | Return an error; do not convert it to success. Clean up staging data, attempt replacement rollback, and include cleanup/rollback failures in the returned error. |
| Context error | The supplied context is canceled or its deadline expires before an operation step. | Return `ctx.Err()`; clean up any staging data and do not report success. |
| Conflicting existing content | `StoreTestCaseFiles` finds an existing case directory with different content. | Return an error and preserve the existing files. |
| Partial deletion | Filesystem deletion stops after removing some entries. | Return `ERR-SYS-001`; a retry continues safely because deletion is idempotent. |

## 7. Owned Sequence Diagrams

- [ReadTestCaseFiles](Diagram/SD-PTS-ReadTestCaseFiles.md)
- [ReadTestCaseData](Diagram/SD-PTS-ReadTestCaseData.md)
- [StoreTestCaseFiles](Diagram/SD-PTS-StoreTestCaseFiles.md)
- [ReplaceChangedFiles](Diagram/SD-PTS-ReplaceChangedFiles.md)
- [VerifyTestCaseFilesReadable](Diagram/SD-PTS-VerifyTestCaseFilesReadable.md)
- [DeleteTestCaseFiles](Diagram/SD-PTS-DeleteTestCaseFiles.md)
