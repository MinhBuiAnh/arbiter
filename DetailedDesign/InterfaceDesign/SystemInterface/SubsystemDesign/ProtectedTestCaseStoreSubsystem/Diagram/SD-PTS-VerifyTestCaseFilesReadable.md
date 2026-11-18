# SD-PTS-VerifyTestCaseFilesReadable — Verify Protected Files

| Field | Value |
|---|---|
| Sequence Diagram ID | `SD-PTS-VerifyTestCaseFilesReadable` |
| Owning subsystem | Protected Test Case Store Subsystem |
| Interface operation | `TestCaseStore.VerifyTestCaseFilesReadable(ctx, testCaseID)` |
| Element specification | [FileSystemTestCaseStore](../Specification/FileSystemTestCaseStore.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-18 |

```plantuml
@startuml SD-PTS-VerifyTestCaseFilesReadable
title SD-PTS-VerifyTestCaseFilesReadable - Check both protected files
hide footbox
autonumber
skinparam shadowing false
skinparam responseMessageBelowArrow true

participant "TestCaseStore\n<<interface>>" as I
participant "FileSystemTestCaseStore" as FS
participant "Go standard library\ncontext, crypto/sha256,\nencoding/hex, filepath, os" as GO

I -> FS : VerifyTestCaseFilesReadable(ctx, testCaseID)
FS -> GO : ctx.Err()
alt context canceled or deadline exceeded
  GO --> FS : context error
  FS --> I : context error
else context active
  FS -> GO : derive digest path; Lstat both fixed file names
  GO --> FS : metadata or error
  alt file missing, symlinked, or not regular
    FS --> I : ERR-RES-002
  else unexpected metadata error
    FS --> I : ERR-SYS-001
  else both are regular files
    FS -> GO : Open and Close each file
    GO --> FS : readable, missing/unreadable, or I/O error
    alt either file is missing or unreadable
      FS --> I : ERR-RES-002
    else unexpected I/O error
      FS --> I : ERR-SYS-001
    else both readable
      FS --> I : nil
    end
  end
end
note over FS, GO
  Verification reads no content and returns no path or data.
end note
@enduml
```
