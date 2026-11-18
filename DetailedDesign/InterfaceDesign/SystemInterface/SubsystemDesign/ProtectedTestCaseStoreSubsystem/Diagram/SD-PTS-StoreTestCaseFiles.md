# SD-PTS-StoreTestCaseFiles — Store Protected Test Case Files

| Field | Value |
|---|---|
| Sequence Diagram ID | `SD-PTS-StoreTestCaseFiles` |
| Owning subsystem | Protected Test Case Store Subsystem |
| Interface operation | `TestCaseStore.StoreTestCaseFiles(ctx, testCaseID, data)` |
| Element specification | [FileSystemTestCaseStore](../Specification/FileSystemTestCaseStore.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-18 |

```plantuml
@startuml SD-PTS-StoreTestCaseFiles
title SD-PTS-StoreTestCaseFiles - Stage and publish both files
hide footbox
autonumber
skinparam shadowing false
skinparam responseMessageBelowArrow true

participant "TestCaseStore\n<<interface>>" as I
participant "FileSystemTestCaseStore" as FS
participant "Go standard library\ncontext, crypto/sha256,\nencoding/hex, filepath, os, bytes" as GO

I -> FS : StoreTestCaseFiles(ctx, testCaseID, data)
FS -> GO : ctx.Err()
alt context canceled or deadline exceeded
  GO --> FS : context error
  FS --> I : context error
else context active
  FS -> GO : derive digest path; create protected parent\nand same-volume staging directory
  GO --> FS : stage path or filesystem error
  alt staging directory created
    loop input and expected-output files
      FS -> GO : ctx.Err(); WriteFile(content, 0600);\nSync and Close
      GO --> FS : success, context error, or I/O error
      alt write succeeds
        note right of FS : Continue with the next file, if any.
      else context canceled
        FS -> GO : RemoveAll(stage directory)
        GO --> FS : cleanup result
        FS --> I : ctx.Err; include cleanup failure if any
      else write or sync fails
        FS -> GO : RemoveAll(stage directory)
        GO --> FS : cleanup result
        FS --> I : ERR-SYS-001; include cleanup failure if any
      end
    end
    FS -> GO : ctx.Err()
    alt context canceled before publish
      GO --> FS : context error
      FS -> GO : RemoveAll(stage directory)
      GO --> FS : cleanup result
      FS --> I : ctx.Err; include cleanup failure if any
    else context active
      GO --> FS : nil
      FS -> GO : Rename(stage directory, final case directory)
      GO --> FS : published or destination exists
      alt publish succeeds
        FS --> I : nil
      else destination exists
        FS -> GO : Lstat existing directory and files;\nread only regular non-symlink files; compare bytes
        GO --> FS : identical, conflicting, invalid, or I/O error
        alt identical content
          FS -> GO : RemoveAll(stage directory)
          GO --> FS : cleanup result
          alt cleanup succeeds
            FS --> I : nil (idempotent retry)
          else cleanup fails
            FS --> I : ERR-SYS-001; include cleanup error
          end
        else conflicting or invalid existing content
          FS -> GO : RemoveAll(stage directory)
          GO --> FS : cleanup result
          alt cleanup succeeds
            FS --> I : error; existing files preserved
          else cleanup fails
            FS --> I : error; include cleanup failure
          end
        else existing-entry inspection fails
          FS -> GO : RemoveAll(stage directory)
          GO --> FS : cleanup result
          FS --> I : ERR-SYS-001; include cleanup failure if any
        end
      else rename fails unexpectedly
        FS -> GO : RemoveAll(stage directory)
        GO --> FS : cleanup result
        FS --> I : ERR-SYS-001; include cleanup failure if any
      end
    end
  else staging setup fails
    FS --> I : ERR-SYS-001
  end
end
note over FS, GO
  The staging directory is on the same volume as the final directory.
  The operation returns no references; call ReadTestCaseFiles separately.
end note
@enduml
```
