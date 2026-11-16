# ProblemStore — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ProblemStore` |
| Classifier kind | Interface |
| Package / subsystem | `Catalog Module (Go)` |
| DCD alias | `CATProblemStore` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ProblemStore` is an interface in the `Catalog Module (Go)` package/subsystem of the design class diagram.

Persistence port for problem lookup, mutation, public reads, and publication state.

- Declared outgoing design relationships: `ProblemState`, `ProblemDetails`, `ProblemSubmissionContext`, `PublicStatistics`.
- Declared incoming design relationships: `ProblemQueryService`, `ProblemAdminService`, `ProblemPostgresStore`.
- Realized by: `ProblemPostgresStore`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `FindProblem(ctx: context.Context, id: ProblemID)` | `(*Problem, error)` | Public | Instance | Loads the problem aggregate for the identifier. |
| `SaveProblem(ctx: context.Context, problem: *Problem)` | `error` | Public | Instance | Inserts or updates the problem aggregate. |
| `UpdateProblem(ctx: context.Context, problem: *Problem, expectedVersion: int)` | `error` | Public | Instance | Updates the problem with an optimistic-concurrency check on `expectedVersion`. |
| `SaveProblemState(ctx: context.Context, id: ProblemID, state: LifecycleStatus, expectedVersion: int)` | `error` | Public | Instance | Updates only the lifecycle state with the expected version. |
| `SavePublicationState(ctx: context.Context, id: ProblemID, state: PublicationStatus, expectedVersion: int)` | `error` | Public | Instance | Updates only the publication state with the expected version. |
| `ReadProblemState(ctx: context.Context, id: ProblemID)` | `(*ProblemState, error)` | Public | Instance | Returns the lifecycle state, publication state, and version. |
| `ListPublishedProblems(ctx: context.Context, query: ProblemQuery)` | `(PageResult[Problem], error)` | Public | Instance | Returns the page of published problems matching the query. |
| `SearchPublishedProblems(ctx: context.Context, query: ProblemQuery)` | `(PageResult[Problem], error)` | Public | Instance | Returns the page of published problems matching the search and filter criteria. |
| `ReadPublicProblem(ctx: context.Context, id: ProblemID)` | `(*ProblemDetails, error)` | Public | Instance | Returns the public problem details, statistics, and sample cases. |
| `ReadProblemForSubmission(ctx: context.Context, id: ProblemID)` | `(*ProblemSubmissionContext, error)` | Public | Instance | Returns the problem fields needed to validate a submission. |
| `ReadPublicStatistics(ctx: context.Context, id: ProblemID)` | `(PublicStatistics, error)` | Public | Instance | Returns the derived public statistics for the problem. |

## 4. Parameter design

### `FindProblem(ctx: context.Context, id: ProblemID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `ProblemID` | — | in | Identifies the target object. |

### `SaveProblem(ctx: context.Context, problem: *Problem)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `problem` | `*Problem` | — | in | Supplies the problem used by the operation. |

### `UpdateProblem(ctx: context.Context, problem: *Problem, expectedVersion: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `problem` | `*Problem` | — | in | Supplies the problem used by the operation. |
| `expectedVersion` | `int` | — | in | Supplies the optimistic-concurrency version checked by the operation. |

### `SaveProblemState(ctx: context.Context, id: ProblemID, state: LifecycleStatus, expectedVersion: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `ProblemID` | — | in | Identifies the target object. |
| `state` | `LifecycleStatus` | — | in | Target lifecycle state. |
| `expectedVersion` | `int` | — | in | Supplies the optimistic-concurrency version checked by the operation. |

### `SavePublicationState(ctx: context.Context, id: ProblemID, state: PublicationStatus, expectedVersion: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `ProblemID` | — | in | Identifies the target object. |
| `state` | `PublicationStatus` | — | in | Target publication state. |
| `expectedVersion` | `int` | — | in | Supplies the optimistic-concurrency version checked by the operation. |

### `ReadProblemState(ctx: context.Context, id: ProblemID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `ProblemID` | — | in | Identifies the target object. |

### `ListPublishedProblems(ctx: context.Context, query: ProblemQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `query` | `ProblemQuery` | — | in | Supplies search, filter, and pagination criteria. |

### `SearchPublishedProblems(ctx: context.Context, query: ProblemQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `query` | `ProblemQuery` | — | in | Supplies search, filter, and pagination criteria. |

### `ReadPublicProblem(ctx: context.Context, id: ProblemID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `ProblemID` | — | in | Identifies the target object. |

### `ReadProblemForSubmission(ctx: context.Context, id: ProblemID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `ProblemID` | — | in | Identifies the target object. |

### `ReadPublicStatistics(ctx: context.Context, id: ProblemID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `ProblemID` | — | in | Identifies the target object. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-RES-001` | Problem not found. | The operation is rejected without changing state. | [SD-UC-COM-03-ViewProblemDetails](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-03-ViewProblemDetails.md) |

## 6. Method

### `FindProblem(ctx: context.Context, id: ProblemID)`

Loads the problem aggregate for the identifier. It is implemented by `ProblemPostgresStore`. It is called by `ProblemQueryService`, `ProblemAdminService`. It uses `ctx`, `id`. It returns `(*Problem, error)`. Failures are returned through the declared error result rather than as a successful value.

### `SaveProblem(ctx: context.Context, problem: *Problem)`

Inserts or updates the problem aggregate. It is implemented by `ProblemPostgresStore`. It is called by `ProblemQueryService`, `ProblemAdminService`. It uses `ctx`, `problem`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `UpdateProblem(ctx: context.Context, problem: *Problem, expectedVersion: int)`

Updates the problem with an optimistic-concurrency check on `expectedVersion`. It is implemented by `ProblemPostgresStore`. It is called by `ProblemQueryService`, `ProblemAdminService`. It uses `ctx`, `problem`, `expectedVersion`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `SaveProblemState(ctx: context.Context, id: ProblemID, state: LifecycleStatus, expectedVersion: int)`

Updates only the lifecycle state with the expected version. It is implemented by `ProblemPostgresStore`. It is called by `ProblemQueryService`, `ProblemAdminService`. It uses `ctx`, `id`, `state`, `expectedVersion`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `SavePublicationState(ctx: context.Context, id: ProblemID, state: PublicationStatus, expectedVersion: int)`

Updates only the publication state with the expected version. It is implemented by `ProblemPostgresStore`. It is called by `ProblemQueryService`, `ProblemAdminService`. It uses `ctx`, `id`, `state`, `expectedVersion`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ReadProblemState(ctx: context.Context, id: ProblemID)`

Returns the lifecycle state, publication state, and version. It is implemented by `ProblemPostgresStore`. It is called by `ProblemQueryService`, `ProblemAdminService`. It uses `ctx`, `id`. It returns `(*ProblemState, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ListPublishedProblems(ctx: context.Context, query: ProblemQuery)`

Returns the page of published problems matching the query. It is implemented by `ProblemPostgresStore`. It is called by `ProblemQueryService`, `ProblemAdminService`. It uses `ctx`, `query`. It returns `(PageResult[Problem], error)`. Failures are returned through the declared error result rather than as a successful value.

### `SearchPublishedProblems(ctx: context.Context, query: ProblemQuery)`

Returns the page of published problems matching the search and filter criteria. It is implemented by `ProblemPostgresStore`. It is called by `ProblemQueryService`, `ProblemAdminService`. It uses `ctx`, `query`. It returns `(PageResult[Problem], error)`. Failures are returned through the declared error result rather than as a successful value.

### `ReadPublicProblem(ctx: context.Context, id: ProblemID)`

Returns the public problem details, statistics, and sample cases. It is implemented by `ProblemPostgresStore`. It is called by `ProblemQueryService`, `ProblemAdminService`. It uses `ctx`, `id`. It returns `(*ProblemDetails, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ReadProblemForSubmission(ctx: context.Context, id: ProblemID)`

Returns the problem fields needed to validate a submission. It is implemented by `ProblemPostgresStore`. It is called by `ProblemQueryService`, `ProblemAdminService`. It uses `ctx`, `id`. It returns `(*ProblemSubmissionContext, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ReadPublicStatistics(ctx: context.Context, id: ProblemID)`

Returns the derived public statistics for the problem. It is implemented by `ProblemPostgresStore`. It is called by `ProblemQueryService`, `ProblemAdminService`. It uses `ctx`, `id`. It returns `(PublicStatistics, error)`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
