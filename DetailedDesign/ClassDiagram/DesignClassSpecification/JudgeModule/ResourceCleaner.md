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
- Declared incoming design relationships: `SubmissionProcessor`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `CleanTemporaryWorkspaces(ctx: context.Context)` | `error` | Public | Instance | Removes temporary judge workspaces through `ExecutionEnvironment.Cleanup` where a submission identifier is available; the DCD does not declare a workspace attribute. |
| `CleanFailedResources(ctx: context.Context, submissionID: SubmissionID)` | `error` | Public | Instance | Removes the failed submission's resources through `ExecutionEnvironment.Cleanup`. |
| `CleanTemporaryResources(ctx: context.Context)` | `error` | Public | Instance | Removes temporary execution resources that are no longer referenced. |
| `ScheduleOrphanCleanup(ctx: context.Context)` | `error` | Public | Instance | Schedules the orphan-removal pass through `RemoveOrphanedExecutionResources`. |
| `RemoveOrphanedExecutionResources(ctx: context.Context)` | `error` | Public | Instance | Identifies and removes execution resources that have no live submission through `ExecutionEnvironment.Cleanup`. |

## 4. Parameter design

### `CleanTemporaryWorkspaces(ctx: context.Context)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |

### `CleanFailedResources(ctx: context.Context, submissionID: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `submissionID` | `SubmissionID` | — | in | Submission whose failed resources are removed. |

### `CleanTemporaryResources(ctx: context.Context)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |

### `ScheduleOrphanCleanup(ctx: context.Context)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |

### `RemoveOrphanedExecutionResources(ctx: context.Context)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-SYS-006` | Orphan-resource cleanup failure. | Cleanup is retried; the failure is logged and does not change a verdict. | [SD-UC-SYS-J-01-ProcessSubmission](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission.md) |

## 6. Method

### `CleanTemporaryWorkspaces(ctx: context.Context)`

Removes temporary judge workspaces through `ExecutionEnvironment.Cleanup` where a submission identifier is available; the DCD does not declare a workspace attribute. It uses `ctx`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `CleanFailedResources(ctx: context.Context, submissionID: SubmissionID)`

Removes the failed submission's resources through `ExecutionEnvironment.Cleanup`. It uses `ctx`, `submissionID`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `CleanTemporaryResources(ctx: context.Context)`

Removes temporary execution resources that are no longer referenced. It uses `ctx`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ScheduleOrphanCleanup(ctx: context.Context)`

Schedules the orphan-removal pass through `RemoveOrphanedExecutionResources`. It uses `ctx`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `RemoveOrphanedExecutionResources(ctx: context.Context)`

Identifies and removes execution resources that have no live submission through `ExecutionEnvironment.Cleanup`. It uses `ctx`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
