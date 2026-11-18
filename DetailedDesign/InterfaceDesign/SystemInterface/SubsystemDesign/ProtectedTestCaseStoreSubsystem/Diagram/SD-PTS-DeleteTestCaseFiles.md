# SD-PTS-DeleteTestCaseFiles — Delete Protected Test Case Files

| Field | Value |
|---|---|
| Sequence Diagram ID | `SD-PTS-DeleteTestCaseFiles` |
| Owning subsystem | Protected Test Case Store Subsystem |
| Interface operation | `TestCaseStore.DeleteTestCaseFiles(ctx, testCaseID)` |
| Element specification | [FileSystemTestCaseStore](../Specification/FileSystemTestCaseStore.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-18 |

```plantuml
@startuml SD-PTS-DeleteTestCaseFiles
title SD-PTS-DeleteTestCaseFiles - Remove the hashed case directory
hide footbox
autonumber
skinparam shadowing false
skinparam responseMessageBelowArrow true

participant "TestCaseStore\n<<interface>>" as I
participant "FileSystemTestCaseStore" as FS
participant "Go standard library\ncontext, crypto/sha256,\nencoding/hex, filepath, os" as GO

I -> FS : DeleteTestCaseFiles(ctx, testCaseID)
FS -> GO : ctx.Err()
alt context canceled or deadline exceeded
  GO --> FS : context error
  FS --> I : context error; deletion not started
else context active
  FS -> GO : SHA-256(testCaseID), hex encode,\njoin cases/<digest> below rootDir
  GO --> FS : case directory
  FS -> GO : RemoveAll(case directory)
  GO --> FS : success or filesystem error
  alt directory removed or already absent
    FS --> I : nil
  else partial deletion or filesystem failure
    FS --> I : ERR-SYS-001
  end
end
note over FS, GO
  Delete is idempotent and safe to retry after partial removal.
  The caller chooses when to invoke deletion; this operation does not
  set the product's retention policy.
end note
@enduml
```
