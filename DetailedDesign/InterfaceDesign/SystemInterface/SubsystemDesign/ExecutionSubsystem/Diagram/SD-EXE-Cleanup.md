# Sequence Diagram — Execution Subsystem — Cleanup

| Field | Value |
|---|---|
| Sequence Diagram ID | SD-EXE-Cleanup |
| Realized operation | `ExecutionEnvironment.Cleanup` |
| Internal realization | `DockerExecutionEnvironment.Cleanup` |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-18 |

## 1. Scope

Shows idempotent, submission-scoped removal of Docker containers and temporary workspace data, including partial cleanup failures.

## 2. Diagram

```plantuml
@startuml SD-EXE-Cleanup
title Execution Subsystem - Cleanup submission resources
hide footbox
autonumber
skinparam shadowing false
skinparam responseMessageBelowArrow true
skinparam defaultFontName "Helvetica"
skinparam defaultFontSize 12

participant "ResourceCleaner" as Caller
participant "ExecutionEnvironment\n(interface)" as Port
participant "DockerExecutionEnvironment" as DockerEnv
participant "Docker Engine API" as Docker
collections "Submission workspace\n(filesystem)" as Workspace

Caller -> Port : Cleanup(ctx, submissionID)
Port -> DockerEnv : Cleanup(ctx, submissionID)
DockerEnv -> DockerEnv : validate SubmissionID
alt empty or invalid ID (ERR-VAL-002)
  DockerEnv --> Port : error; do not remove resources
  Port --> Caller : error
else valid ID
  DockerEnv -> DockerEnv : derive path-safe submission key
par remove all submission-labeled containers
  DockerEnv -> Docker : remove containers with matching submission label
  alt Docker cleanup fails
    Docker --> DockerEnv : cleanup error
  else containers removed or none exist
    Docker --> DockerEnv : success
  end
else remove submission workspace
  DockerEnv -> Workspace : remove workspace for submission key
  alt workspace cleanup fails
    Workspace --> DockerEnv : filesystem error
  else workspace removed or absent
    Workspace --> DockerEnv : success
  end
end
alt either cleanup operation failed (ERR-SYS-006)
  DockerEnv --> Port : return collected cleanup error(s)
  Port --> Caller : error; retry cleanup later
else both operations succeeded
  DockerEnv --> Port : nil
  Port --> Caller : cleanup complete
end
end
@enduml
```

## 3. Notes

- Both cleanup paths are attempted even if the other fails. The returned error preserves failures from both paths.
- Missing containers and an absent workspace are already-clean states and therefore succeed, making cleanup safe to retry.
- Cleanup does not modify a Submission or its verdict. A committed result remains valid when cleanup must be retried.
