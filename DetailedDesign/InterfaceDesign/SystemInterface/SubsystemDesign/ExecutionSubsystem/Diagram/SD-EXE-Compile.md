# Sequence Diagram — Execution Subsystem — Compile

| Field | Value |
|---|---|
| Sequence Diagram ID | SD-EXE-Compile |
| Realized operation | `ExecutionEnvironment.Compile` |
| Internal realization | `DockerExecutionEnvironment.Compile` |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-18 |

## 1. Scope

Shows request validation, workspace preparation, isolated compilation, result mapping, and documented failure paths. A compiler rejection is a normal `CompileResult`; infrastructure and local workspace failures are returned as errors.

## 2. Diagram

```plantuml
@startuml SD-EXE-Compile
title Execution Subsystem - Compile
hide footbox
autonumber
skinparam shadowing false
skinparam responseMessageBelowArrow true
skinparam defaultFontName "Helvetica"
skinparam defaultFontSize 12

participant "Compiler" as Caller
participant "ExecutionEnvironment\n(interface)" as Port
participant "DockerExecutionEnvironment" as DockerEnv
collections "Submission workspace\n(filesystem)" as Workspace
participant "Docker Engine API" as Docker

Caller -> Port : Compile(ctx, request)
Port -> DockerEnv : Compile(ctx, request)
DockerEnv -> DockerEnv : validate SubmissionID, language,\nand source-size limit
alt invalid request (ERR-VAL-002)
  DockerEnv --> Port : error; no container started
  Port --> Caller : error
else valid request
  DockerEnv -> DockerEnv : derive path-safe workspace key\nfrom SubmissionID
  DockerEnv -> Workspace : create or open submission workspace
  alt workspace setup fails (ERR-SYS-001)
    Workspace --> DockerEnv : filesystem error
    DockerEnv -> Workspace : remove partially created workspace
    Workspace --> DockerEnv : removed or cleanup error
    alt partial cleanup also fails (ERR-SYS-006)
      DockerEnv --> Port : return workspace error and cleanup error
      Port --> Caller : error
    else partial cleanup succeeds
      DockerEnv --> Port : return workspace error
      Port --> Caller : error
    end
  else workspace ready
    DockerEnv -> Workspace : write source file
    alt source staging fails (ERR-SYS-001)
      Workspace --> DockerEnv : filesystem error
      DockerEnv -> Workspace : remove partial source/workspace data
      Workspace --> DockerEnv : removed or cleanup error
      alt partial cleanup also fails (ERR-SYS-006)
        DockerEnv --> Port : return source error and cleanup error
        Port --> Caller : error
      else partial cleanup succeeds
        DockerEnv --> Port : return source error
        Port --> Caller : error
      end
    else source staged
      DockerEnv -> Docker : create and start fresh compile container\n(label submission key; 10 s; 512 MiB; no network;\nread-only root; bounded workspace; non-root)
      alt Docker operation fails (ERR-SYS-004)
        Docker --> DockerEnv : Docker/container error
        DockerEnv -> Docker : remove any container created for this run
        alt container removal also fails (ERR-SYS-006)
          Docker --> DockerEnv : cleanup error
          DockerEnv --> Port : return Docker error and cleanup error
          Port --> Caller : error
        else container removed or absent
          Docker --> DockerEnv : removed
          DockerEnv --> Port : return infrastructure error
          Port --> Caller : error
        end
      else container completes
        Docker --> DockerEnv : exit status and bounded compiler output
        DockerEnv -> Docker : remove compile container
        alt container removal fails (ERR-SYS-006)
          Docker --> DockerEnv : cleanup error
          DockerEnv --> Port : cleanup error; do not return a successful compile result
          Port --> Caller : error
        else container removed
          Docker --> DockerEnv : removed
          alt compiler rejected source
            DockerEnv --> Port : CompileResult{Succeeded:false,\nOutput:bounded diagnostics}
            Port --> Caller : compile result
          else compile succeeded
            DockerEnv --> Port : CompileResult{Succeeded:true,\nOutput, ArtifactPath in submission workspace}
            Port --> Caller : compile result
          end
        end
      end
    end
  end
end
@enduml
```

## 3. Notes

- The caller supplies `SubmissionID` from the loaded Submission. The derived workspace key is used for both path containment and the container label; the raw identifier is not concatenated into a path.
- C++17 compilation and Python 3 syntax checking use separate toolchain commands. A compiler's nonzero exit is not an infrastructure error.
- The artifact remains available for `ExecutionEnvironment.Execute` until submission cleanup.
- Source and compiler output beyond the bounded result are not logged.
