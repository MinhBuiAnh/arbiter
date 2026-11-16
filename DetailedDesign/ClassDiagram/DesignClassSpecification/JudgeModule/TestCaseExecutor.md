# TestCaseExecutor — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `TestCaseExecutor` |
| Classifier kind | Class |
| Package / subsystem | `Judge Module (Go)` |
| DCD alias | `JDGTestCaseExecutor` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`TestCaseExecutor` is a class in the `Judge Module (Go)` package/subsystem of the design class diagram.

Judge component that executes test cases through the execution environment.

- Declared outgoing design relationships: `ExecutionEnvironment`, `TestCaseStore`, `ExecutionRequest`, `ExecutionLimits`, `ExecutionResult`.
- Declared incoming design relationships: `SubmissionProcessor`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `Execute(ctx: context.Context, submission: *Submission, testCases: []TestCaseMetadata)` | `([]TestCaseResult, error)` | Public | Instance | Iterates the supplied metadata in order and executes each case through `ExecuteOne`, collecting the per-test results. |
| `ExecuteOne(ctx: context.Context, submission: *Submission, testCase: TestCaseMetadata)` | `(TestCaseResult, error)` | Private | Instance | Internal helper that reads the protected input and expected output, builds `ExecutionLimits` and an `ExecutionRequest`, invokes `ExecutionEnvironment.Execute`, and maps the `ExecutionResult` to a `TestCaseResult`. |

## 4. Parameter design

### `Execute(ctx: context.Context, submission: *Submission, testCases: []TestCaseMetadata)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `submission` | `*Submission` | — | in | Supplies the submission used by the operation. |
| `testCases` | `[]TestCaseMetadata` | — | in | Ordered test-case metadata to execute. |

### `ExecuteOne(ctx: context.Context, submission: *Submission, testCase: TestCaseMetadata)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `submission` | `*Submission` | — | in | Supplies the submission used by the operation. |
| `testCase` | `TestCaseMetadata` | — | in | One test case to execute. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-RES-002` | Test-case data is missing or unreadable. | The operation is rejected; judging records an internal error rather than a user-code verdict. | [SD-UC-SYS-J-01-ProcessSubmission-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md) |
| `ERR-SYS-004` | Docker Engine or container failure. | Judging fails as an infrastructure error; no user-code verdict is inferred. | [SD-UC-SYS-J-01-ProcessSubmission-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission-Exceptions.md) |

## 6. Method

### `Execute(ctx: context.Context, submission: *Submission, testCases: []TestCaseMetadata)`

Iterates the supplied metadata in order and executes each case through `ExecuteOne`, collecting the per-test results. It uses `ctx`, `submission`, `testCases`. It returns `([]TestCaseResult, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ExecuteOne(ctx: context.Context, submission: *Submission, testCase: TestCaseMetadata)`

Reads the protected input and expected output, builds `ExecutionLimits` and an `ExecutionRequest`, invokes `ExecutionEnvironment.Execute`, and maps the `ExecutionResult` to a `TestCaseResult`. It uses `ctx`, `submission`, `testCase`. It returns `(TestCaseResult, error)`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
