# Sequence Diagram — Execution Subsystem — Execute

| Field | Value |
|---|---|
| Sequence Diagram ID | SD-EXE-Execute |
| Realized operation | `ExecutionEnvironment.Execute` |
| Internal realization | `DockerExecutionEnvironment.Execute` |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-18 |

## 1. Scope

Shows one isolated test-case execution and maps normal process termination, timeout, memory-limit termination, and documented infrastructure/local failures into the interface result or error.

## 2. Diagram

```plantuml
@startuml SD-EXE-Execute
title Execution Subsystem - Execute one test case
hide footbox
autonumber
skinparam shadowing false
skinparam responseMessageBelowArrow true
skinparam defaultFontName "Helvetica"
skinparam defaultFontSize 12

participant "TestCaseExecutor" as Caller
participant "ExecutionEnvironment\n(interface)" as Port
participant "DockerExecutionEnvironment" as DockerEnv
collections "Submission workspace\n(filesystem)" as Workspace
participant "Docker Engine API" as Docker

Caller -> Port : Execute(ctx, request)
Port -> DockerEnv : Execute(ctx, request)
DockerEnv -> DockerEnv : derive workspace key;\nvalidate artifact belongs to submission
alt invalid request or artifact (ERR-VAL-002)
  DockerEnv --> Port : error; no container started
  Port --> Caller : error
else valid request
  DockerEnv -> Workspace : stage input in submission workspace
  alt staging fails (ERR-SYS-001)
    Workspace --> DockerEnv : filesystem error
    DockerEnv -> Workspace : remove partial input file
    Workspace --> DockerEnv : removed or cleanup error
    alt partial input cleanup also fails (ERR-SYS-006)
      DockerEnv --> Port : return staging error and cleanup error
      Port --> Caller : error
    else partial input cleanup succeeds
      DockerEnv --> Port : return staging error
      Port --> Caller : error
    end
  else input staged
    DockerEnv -> Docker : create and start fresh execution container\n(label submission key; artifact and input read-only;\nProblem limits; 1 CPU; 64 PIDs; no network;\nread-only root; bounded storage; non-root)
    alt Docker operation fails (ERR-SYS-004)
      Docker --> DockerEnv : Docker/container error
      DockerEnv -> Docker : remove any container created for this run
      Docker --> DockerEnv : removed or cleanup error
      DockerEnv -> Workspace : remove staged input
      Workspace --> DockerEnv : removed or cleanup error
      alt either cleanup operation fails (ERR-SYS-006)
        DockerEnv --> Port : return Docker error and cleanup error(s)
        Port --> Caller : error
      else cleanup succeeds
        DockerEnv --> Port : return infrastructure error
        Port --> Caller : error
      end
    else process completes or reaches a limit
      Docker --> DockerEnv : stdout/stderr (bounded), exit status,\nruntime, peak memory, limit outcome
      DockerEnv -> Docker : remove execution container
      Docker --> DockerEnv : removed or cleanup error
      DockerEnv -> Workspace : remove staged input
      Workspace --> DockerEnv : removed or cleanup error
      alt either cleanup operation fails (ERR-SYS-006)
        DockerEnv --> Port : cleanup error; do not return a successful result
        Port --> Caller : error
      else cleanup succeeds
        alt time limit exceeded
          DockerEnv --> Port : ExecutionResult{TimedOut:true,\nmetrics and bounded output}
        else memory limit exceeded
          DockerEnv --> Port : ExecutionResult{MemoryExceeded:true,\nmetrics and bounded output}
        else normal exit or runtime error
          DockerEnv --> Port : ExecutionResult{ExitCode, metrics,\nbounded output}
        end
        Port --> Caller : execution result
      end
    end
  end
end
note over Caller
  The caller uses ExpectedOutput to evaluate the returned stdout.
  Output mismatch and ERR-SYS-005 are Judge Module behavior;
  this subsystem does not compare outputs.
end note
@enduml
```

## 3. Notes

- Every test case runs in a new container. The execution request's submission ID scopes temporary input, the artifact check, and the container label.
- Captured stdout retains at most one byte beyond the 1 MiB output threshold. This preserves the caller's ability to recognize output-cap overflow without an added result field.
- Time-limit, memory-limit, and program-exit outcomes are execution data, not infrastructure errors.
- Expected-output comparison is intentionally outside this subsystem and remains the responsibility of the Judge Module.
