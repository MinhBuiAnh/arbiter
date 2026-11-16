# Compiler — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `Compiler` |
| Classifier kind | Class |
| Package / subsystem | `Judge Module (Go)` |
| DCD alias | `JDGCompiler` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`Compiler` is a class in the `Judge Module (Go)` package/subsystem of the design class diagram.

Judge component that compiles a submission through the execution environment.

- Declared outgoing design relationships: `ExecutionEnvironment`, `CompileRequest`.
- Declared incoming design relationships: `SubmissionProcessor`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `Compile(ctx: context.Context, submission: *Submission)` | `(CompileResult, error)` | Public | Instance | Maps the submission language and source to a `CompileRequest`, invokes `ExecutionEnvironment.Compile`, and returns the compilation result. |

## 4. Parameter design

### `Compile(ctx: context.Context, submission: *Submission)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `submission` | `*Submission` | — | in | Submission whose language and source are compiled. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-VAL-002` | Invalid language or source configuration. | The submission is rejected before judging; no verdict is produced. | [SD-UC-SYS-J-01-ProcessSubmission](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission.md) |
| `ERR-SYS-004` | Docker Engine or container failure. | Judging fails as an infrastructure error; no user-code verdict is inferred. | [SD-UC-SYS-J-01-ProcessSubmission-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md) |

## 6. Method

### `Compile(ctx: context.Context, submission: *Submission)`

Maps the submission language and source to a `CompileRequest`, invokes `ExecutionEnvironment.Compile`, and returns the compilation result. It uses `ctx`, `submission`. It returns `(CompileResult, error)`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
