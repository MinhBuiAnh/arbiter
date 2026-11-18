# SD-PTS-ReadTestCaseData — Read Protected Test Case Data

| Field | Value |
|---|---|
| Sequence Diagram ID | `SD-PTS-ReadTestCaseData` |
| Owning subsystem | Protected Test Case Store Subsystem |
| Interface operation | `TestCaseStore.ReadTestCaseData(ctx, testCaseID)` |
| Element specification | [FileSystemTestCaseStore](../Specification/FileSystemTestCaseStore.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-18 |

```plantuml
@startuml SD-PTS-ReadTestCaseData
title SD-PTS-ReadTestCaseData - Read both protected content files
hide footbox
autonumber
skinparam shadowing false
skinparam responseMessageBelowArrow true

participant "TestCaseStore\n<<interface>>" as I
participant "FileSystemTestCaseStore" as FS
participant "Go standard library\ncontext, crypto/sha256,\nencoding/hex, filepath, os" as GO

I -> FS : ReadTestCaseData(ctx, testCaseID)
FS -> GO : ctx.Err()
alt context canceled or deadline exceeded
  GO --> FS : context error
  FS --> I : error; no data
else context active
  FS -> GO : SHA-256(testCaseID), hex encode,\njoin fixed file names below rootDir
  GO --> FS : inputPath, expectedOutputPath
  FS -> GO : ReadFile(inputPath)
  GO --> FS : input bytes or error
  alt input is missing or unreadable
    FS --> I : ERR-RES-002; no data
  else unexpected input read error
    FS --> I : ERR-SYS-001; no data
  else input read
    FS -> GO : ReadFile(expectedOutputPath)
    GO --> FS : expected-output bytes or error
    alt expected output is missing or unreadable
      FS --> I : ERR-RES-002; no partial data
    else unexpected expected-output read error
      FS --> I : ERR-SYS-001; no data
    else both reads succeed
      FS --> I : TestCaseData{Input, ExpectedOutput}
    end
  end
end
note over FS, GO
  File names are fixed beneath the digest-derived case directory.
  Neither content nor content-bearing error text is logged.
end note
@enduml
```
