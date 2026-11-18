# SD-PTS-ReadTestCaseFiles — Read Protected File References

| Field | Value |
|---|---|
| Sequence Diagram ID | `SD-PTS-ReadTestCaseFiles` |
| Owning subsystem | Protected Test Case Store Subsystem |
| Interface operation | `TestCaseStore.ReadTestCaseFiles(ctx, testCaseID)` |
| Element specification | [FileSystemTestCaseStore](../Specification/FileSystemTestCaseStore.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-18 |

```plantuml
@startuml SD-PTS-ReadTestCaseFiles
title SD-PTS-ReadTestCaseFiles - Verify and return relative file references
hide footbox
autonumber
skinparam shadowing false
skinparam responseMessageBelowArrow true

participant "TestCaseStore\n<<interface>>" as I
participant "FileSystemTestCaseStore" as FS
participant "Go standard library\ncontext, crypto/sha256,\nencoding/hex, filepath, os" as GO

I -> FS : ReadTestCaseFiles(ctx, testCaseID)
FS -> GO : ctx.Err()
alt context canceled or deadline exceeded
  GO --> FS : context error
  FS --> I : error; no references
else context active
  FS -> GO : SHA-256(testCaseID), hex encode,\njoin fixed relative file names below rootDir
  GO --> FS : inputPath, expectedOutputPath
  FS -> GO : Lstat(inputPath), Lstat(expectedOutputPath)
  GO --> FS : file metadata or filesystem error
  alt either file missing, symlinked, or not regular
    FS --> I : ERR-RES-002; no references
  else unexpected metadata error
    FS --> I : ERR-SYS-001; no references
  else both are regular files
    FS -> GO : Open and Close each file
    GO --> FS : readable, missing/unreadable, or I/O error
    alt either file is missing or unreadable
      FS --> I : ERR-RES-002; no references
    else unexpected read error
      FS --> I : ERR-SYS-001; no references
    else both files readable
      FS --> I : TestCaseFileRefs with paths relative to rootDir
    end
  end
end
note over FS, GO
  Only fixed file names are appended to a digest-derived directory.
  Protected content is not read, logged, or returned.
end note
@enduml
```
