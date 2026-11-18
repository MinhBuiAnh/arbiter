# SD-PTS-ReplaceChangedFiles — Replace Changed Protected Files

| Field | Value |
|---|---|
| Sequence Diagram ID | `SD-PTS-ReplaceChangedFiles` |
| Owning subsystem | Protected Test Case Store Subsystem |
| Interface operation | `TestCaseStore.ReplaceChangedFiles(ctx, testCaseID, data)` |
| Element specification | [FileSystemTestCaseStore](../Specification/FileSystemTestCaseStore.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-18 |

```plantuml
@startuml SD-PTS-ReplaceChangedFiles
title SD-PTS-ReplaceChangedFiles - Compare and replace changed files
hide footbox
autonumber
skinparam shadowing false
skinparam responseMessageBelowArrow true

participant "TestCaseStore\n<<interface>>" as I
participant "FileSystemTestCaseStore" as FS
participant "Go standard library\ncontext, crypto/sha256,\nencoding/hex, filepath, os, bytes" as GO

I -> FS : ReplaceChangedFiles(ctx, testCaseID, data)
FS -> GO : ctx.Err()
alt context canceled or deadline exceeded
  GO --> FS : context error
  FS --> I : context error; no files changed
else context active
  FS -> GO : derive digest path; ReadFile both current files
  GO --> FS : current bytes or error
  alt either required file missing or unreadable
    FS --> I : ERR-RES-002; no files changed
  else unexpected read error
    FS --> I : ERR-SYS-001; no files changed
  else both reads succeed
    FS -> GO : bytes.Equal for input and expected output
    GO --> FS : changed-file set
    alt no files changed
      FS --> I : nil
    else one or both files changed
      loop each changed file
        FS -> GO : create same-directory temporary file;\nwrite new bytes, Sync, Close
        GO --> FS : prepared file or error
        FS -> GO : Rename temporary file over target
        GO --> FS : replaced or error
      end
      alt all replacements succeed
        FS --> I : nil
      else preparation or rename fails
        FS -> GO : restore every already-replaced file\nfrom retained prior bytes
        GO --> FS : rollback result
        alt rollback succeeds
          FS --> I : ERR-SYS-001; prior files restored
        else rollback fails
          FS --> I : ERR-SYS-001; include operation and rollback errors
        end
      else context is canceled during replacement
        FS -> GO : restore every already-replaced file\nfrom retained prior bytes
        GO --> FS : rollback result
        alt rollback succeeds
          FS --> I : ctx.Err; prior files restored
        else rollback fails
          FS --> I : ctx.Err; include rollback failure
        end
      end
    end
  end
end
note over FS, GO
  Rename makes each individual file replacement atomic. The interface
  does not promise atomic replacement of the input/output pair.
  Content and content-bearing errors are never logged.
end note
@enduml
```
