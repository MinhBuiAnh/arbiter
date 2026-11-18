# ResourceCleaner — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ResourceCleaner` |
| Classifier kind | Class |
| Package / subsystem | `Judge Module (Go)` |
| DCD alias | `JDGResourceCleaner` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ResourceCleaner` is a class in the `Judge Module (Go)` package/subsystem of the design class diagram.

Judge component that removes temporary and orphaned execution resources.

- Declared outgoing design relationships: `ExecutionEnvironment`.
- Declared incoming design relationships: `JudgeWorker`, `SubmissionProcessor`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `CleanTemporaryWorkspaces(ctx: context.Context, submissionIDs: []SubmissionID)` | `error` | Public | Instance | Removes execution resources for the supplied submissions through `ExecutionEnvironment.Cleanup`. |
| `CleanFailedResources(ctx: context.Context, submissionID: SubmissionID)` | `error` | Public | Instance | Removes the failed submission's resources through `ExecutionEnvironment.Cleanup`. |
| `CleanTemporaryResources(ctx: context.Context, submissionIDs: []SubmissionID)` | `error` | Public | Instance | Removes temporary execution resources only for the supplied submissions. |
| `ScheduleOrphanCleanup(ctx: context.Context, candidateSubmissionIDs: []SubmissionID)` | `error` | Public | Instance | Starts a cleanup pass for the caller-identified orphan candidates. |
| `RemoveOrphanedExecutionResources(ctx: context.Context, candidateSubmissionIDs: []SubmissionID)` | `error` | Public | Instance | Removes resources only for the candidate submissions supplied by the caller. |

## 4. Parameter design

### `CleanTemporaryWorkspaces(ctx: context.Context, submissionIDs: []SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `submissionIDs` | `[]SubmissionID` | — | in | Submission identifiers whose execution resources are to be cleaned. |

### `CleanFailedResources(ctx: context.Context, submissionID: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `submissionID` | `SubmissionID` | — | in | Submission whose failed resources are removed. |

### `CleanTemporaryResources(ctx: context.Context, submissionIDs: []SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `submissionIDs` | `[]SubmissionID` | — | in | Submission identifiers whose temporary resources are to be cleaned. |

### `ScheduleOrphanCleanup(ctx: context.Context, candidateSubmissionIDs: []SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `candidateSubmissionIDs` | `[]SubmissionID` | — | in | IDs already identified by the recovery worker as safe cleanup candidates. |

### `RemoveOrphanedExecutionResources(ctx: context.Context, candidateSubmissionIDs: []SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `candidateSubmissionIDs` | `[]SubmissionID` | — | in | IDs already identified by the recovery worker as safe cleanup candidates. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-SYS-006` | Cleanup fails for one or more supplied submission IDs. | Continue attempting the remaining IDs and return the collected errors; `JudgeWorker` leaves associated messages pending so recovery can retry. | [SD-UC-SYS-J-02-RecoverPendingSubmission](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-02-RecoverPendingSubmission.md), [SD-UC-SYS-J-01-ProcessSubmission](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission.md) |

## 6. Method

### `CleanTemporaryWorkspaces(ctx: context.Context, submissionIDs: []SubmissionID)`

Calls `ExecutionEnvironment.Cleanup` for each supplied submission ID. It attempts all IDs and returns the collected cleanup errors. It uses `ctx`, `submissionIDs`. It returns `error`.

### `CleanFailedResources(ctx: context.Context, submissionID: SubmissionID)`

Removes the failed submission's resources through `ExecutionEnvironment.Cleanup`. It uses `ctx`, `submissionID`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `CleanTemporaryResources(ctx: context.Context, submissionIDs: []SubmissionID)`

Calls `ExecutionEnvironment.Cleanup` for each supplied submission ID. It removes no resources for IDs outside the list and returns collected errors after attempting the full list. It uses `ctx`, `submissionIDs`. It returns `error`.

### `ScheduleOrphanCleanup(ctx: context.Context, candidateSubmissionIDs: []SubmissionID)`

Starts a cleanup pass for the supplied candidates by delegating to `RemoveOrphanedExecutionResources`. It uses `ctx`, `candidateSubmissionIDs`. It returns `error` after the pass; failures are returned through the declared error result.

### `RemoveOrphanedExecutionResources(ctx: context.Context, candidateSubmissionIDs: []SubmissionID)`

Deduplicates the caller-identified candidates, invokes `ExecutionEnvironment.Cleanup` once per unique ID, continues after individual failures, and returns the collected errors. It does not enumerate Docker resources or infer submission liveness. It uses `ctx`, `candidateSubmissionIDs`. It returns `error`.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
