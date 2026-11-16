# ProblemQueryService — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ProblemQueryService` |
| Classifier kind | Class |
| Package / subsystem | `Catalog Module (Go)` |
| DCD alias | `CATProblemQueryService` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ProblemQueryService` is a class in the `Catalog Module (Go)` package/subsystem of the design class diagram.

Application service for public problem browsing, search, details, and submission context.

- Declared outgoing design relationships: `ProblemStore`, `Problem`.
- Declared incoming design relationships: `ProblemHandler`, `SubmissionCommandService`, `ProblemLookupAdapter`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `ListPublished(ctx: context.Context, query: ProblemQuery)` | `(PageResult[Problem], error)` | Public | Instance | Reads the published problem page through `ProblemStore.ListPublishedProblems` and converts the rows to list previews. |
| `SearchPublished(ctx: context.Context, query: ProblemQuery)` | `(PageResult[Problem], error)` | Public | Instance | Validates the query and reads matching published problems through `ProblemStore.SearchPublishedProblems`, then builds previews. |
| `GetPublicProblem(ctx: context.Context, problemID: ProblemID)` | `(*ProblemDetails, error)` | Public | Instance | Loads the problem, verifies that it is publicly available, and returns `ProblemDetails` with statistics and sample cases. |
| `GetProblemForSubmission(ctx: context.Context, problemID: ProblemID)` | `(*ProblemSubmissionContext, error)` | Public | Instance | Reads the submission context through `ProblemStore.ReadProblemForSubmission` and rejects a problem that is not publicly available. |
| `GetActiveProblem(ctx: context.Context, problemID: ProblemID)` | `(*Problem, error)` | Public | Instance | Loads the problem and rejects it when it is not active or not published. |
| `GetProblemState(ctx: context.Context, problemID: ProblemID)` | `(*ProblemState, error)` | Public | Instance | Reads the lifecycle state, publication state, and version through `ProblemStore.ReadProblemState`. |
| `BuildPreviews(problems: []Problem)` | `[]Problem` | Private | Instance | Internal helper that converts problem rows to bounded list previews without exposing hidden test data; the exact preview fields are not specified by the DCD. |
| `CheckPublicAvailability(problem: *Problem)` | `error` | Private | Instance | Internal helper that checks that the problem satisfies `Problem.IsPublic` and raises the not-permitted outcome otherwise. |
| `CheckPublicVisibility(problem: *Problem)` | `error` | Private | Instance | Internal helper that checks the lifecycle and publication attributes that make a problem visible to users. |
| `VerifyProblemExists(problem: *Problem, err: error)` | `error` | Private | Instance | Internal helper that turns a missing problem or store error into the declared not-found outcome. |

## 4. Parameter design

### `ListPublished(ctx: context.Context, query: ProblemQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `query` | `ProblemQuery` | — | in | Supplies search, filter, and pagination criteria. |

### `SearchPublished(ctx: context.Context, query: ProblemQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `query` | `ProblemQuery` | — | in | Supplies search, filter, and pagination criteria. |

### `GetPublicProblem(ctx: context.Context, problemID: ProblemID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |

### `GetProblemForSubmission(ctx: context.Context, problemID: ProblemID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |

### `GetActiveProblem(ctx: context.Context, problemID: ProblemID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |

### `GetProblemState(ctx: context.Context, problemID: ProblemID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |

### `BuildPreviews(problems: []Problem)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `problems` | `[]Problem` | — | in | Problem rows to convert to list previews. |

### `CheckPublicAvailability(problem: *Problem)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `problem` | `*Problem` | — | in | Supplies the problem used by the operation. |

### `CheckPublicVisibility(problem: *Problem)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `problem` | `*Problem` | — | in | Supplies the problem used by the operation. |

### `VerifyProblemExists(problem: *Problem, err: error)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `problem` | `*Problem` | — | in | Supplies the problem used by the operation. |
| `err` | `error` | — | in | Supplies the collaborator failure to classify or persist. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-VAL-004` | Invalid search or filter parameters. | The query is rejected without reading or changing state. | [SD-UC-COM-02-SearchProblems](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-02-SearchProblems.md) |
| `ERR-VAL-005` | Invalid pagination parameters. | The query is rejected without reading or changing state. | [SD-UC-COM-01-BrowseProblems](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-01-BrowseProblems.md) |
| `ERR-VAL-006` | Invalid sorting parameter. | The query is rejected without reading or changing state. | [SD-UC-COM-01-BrowseProblems](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-01-BrowseProblems.md) |
| `ERR-VAL-007` | Invalid problem identifier. | The problem read is rejected as invalid. | [SD-UC-COM-03-ViewProblemDetails](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-03-ViewProblemDetails.md) |
| `ERR-PERM-001` | Problem is not publicly accessible. | The read or submission is rejected as not permitted. | [SD-UC-COM-03-ViewProblemDetails](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-03-ViewProblemDetails.md) |
| `ERR-RES-001` | Problem not found. | The operation is rejected without changing state. | [SD-UC-COM-03-ViewProblemDetails](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-03-ViewProblemDetails.md) |
| `ERR-SYS-001` | Internal system, persistence, or assembly error. | The request fails with an internal error; transactions roll back where applicable. | [SD-UC-COM-01-BrowseProblems](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-01-BrowseProblems.md) |

## 6. Method

### `ListPublished(ctx: context.Context, query: ProblemQuery)`

Reads the published problem page through `ProblemStore.ListPublishedProblems` and converts the rows to list previews. It uses `ctx`, `query`. It returns `(PageResult[Problem], error)`. Failures are returned through the declared error result rather than as a successful value.

### `SearchPublished(ctx: context.Context, query: ProblemQuery)`

Validates the query and reads matching published problems through `ProblemStore.SearchPublishedProblems`, then builds previews. It uses `ctx`, `query`. It returns `(PageResult[Problem], error)`. Failures are returned through the declared error result rather than as a successful value.

### `GetPublicProblem(ctx: context.Context, problemID: ProblemID)`

Loads the problem, verifies that it is publicly available, and returns `ProblemDetails` with statistics and sample cases. It uses `ctx`, `problemID`. It returns `(*ProblemDetails, error)`. Failures are returned through the declared error result rather than as a successful value.

### `GetProblemForSubmission(ctx: context.Context, problemID: ProblemID)`

Reads the submission context through `ProblemStore.ReadProblemForSubmission` and rejects a problem that is not publicly available. It uses `ctx`, `problemID`. It returns `(*ProblemSubmissionContext, error)`. Failures are returned through the declared error result rather than as a successful value.

### `GetActiveProblem(ctx: context.Context, problemID: ProblemID)`

Loads the problem and rejects it when it is not active or not published. It uses `ctx`, `problemID`. It returns `(*Problem, error)`. Failures are returned through the declared error result rather than as a successful value.

### `GetProblemState(ctx: context.Context, problemID: ProblemID)`

Reads the lifecycle state, publication state, and version through `ProblemStore.ReadProblemState`. It uses `ctx`, `problemID`. It returns `(*ProblemState, error)`. Failures are returned through the declared error result rather than as a successful value.

### `BuildPreviews(problems: []Problem)`

Converts problem rows to bounded list previews without exposing hidden test data; the exact preview fields are not specified by the DCD. It uses `problems`. It returns `[]Problem`.

### `CheckPublicAvailability(problem: *Problem)`

Checks that the problem satisfies `Problem.IsPublic` and raises the not-permitted outcome otherwise. It uses `problem`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `CheckPublicVisibility(problem: *Problem)`

Checks the lifecycle and publication attributes that make a problem visible to users. It uses `problem`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `VerifyProblemExists(problem: *Problem, err: error)`

Turns a missing problem or store error into the declared not-found outcome. It uses `problem`, `err`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
