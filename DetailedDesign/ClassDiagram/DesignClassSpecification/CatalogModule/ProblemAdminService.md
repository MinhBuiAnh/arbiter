# ProblemAdminService — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ProblemAdminService` |
| Classifier kind | Class |
| Package / subsystem | `Catalog Module (Go)` |
| DCD alias | `CATProblemAdminService` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ProblemAdminService` is a class in the `Catalog Module (Go)` package/subsystem of the design class diagram.

Application service for problem creation, update, activation, and publication changes.

- Declared outgoing design relationships: `ProblemStore`, `TestCaseSetReader`, `Problem`.
- Declared incoming design relationships: `ProblemHandler`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `CreateProblem(ctx: context.Context, principal: Principal, req: ProblemWriteRequest)` | `(*Problem, error)` | Public | Instance | Authorizes the caller, validates the request fields and business rules, builds a `Problem`, and saves it through `ProblemStore.SaveProblem`. |
| `UpdateProblem(ctx: context.Context, principal: Principal, problemID: ProblemID, req: ProblemWriteRequest, expectedVersion: int)` | `(*Problem, error)` | Public | Instance | Authorizes the caller, loads the problem, compares the version, checks editability, validates the replacement fields, applies them, and saves with the expected version. |
| `DeactivateProblem(ctx: context.Context, principal: Principal, problemID: ProblemID, expectedVersion: int)` | `error` | Public | Instance | Authorizes the caller, loads the problem, applies the inactive lifecycle transition, and saves the state with the expected version. |
| `ReactivateProblem(ctx: context.Context, principal: Principal, problemID: ProblemID, expectedVersion: int)` | `error` | Public | Instance | Authorizes the caller, loads the problem, applies the active lifecycle transition, and saves the state with the expected version. |
| `PublishProblem(ctx: context.Context, principal: Principal, problemID: ProblemID, expectedVersion: int)` | `error` | Public | Instance | Authorizes the caller, checks editability and publication eligibility through `TestCaseSetReader`, applies the published state, and saves it with the expected version. |
| `UnpublishProblem(ctx: context.Context, principal: Principal, problemID: ProblemID, expectedVersion: int)` | `error` | Public | Instance | Authorizes the caller, applies the draft publication state, and saves it with the expected version. |
| `ValidateProblemFields(req: ProblemWriteRequest)` | `error` | Private | Instance | Internal helper that checks the required text, limits, category, difficulty, tags, and allowed languages before the problem is built or changed. |
| `ValidateBusinessRules(problem: *Problem)` | `error` | Private | Instance | Internal helper that checks cross-field problem invariants such as non-empty allowed languages and positive limits. |
| `ValidateUpdate(current: *Problem, next: *Problem)` | `error` | Private | Instance | Internal helper that checks that the replacement problem does not violate invariants or change fields that the update contract does not permit. |
| `CheckProblemEditable(problem: *Problem)` | `error` | Private | Instance | Internal helper that rejects the operation when `Problem.IsEditable` is false. |
| `CheckActiveState(problem: *Problem)` | `error` | Private | Instance | Internal helper that rejects the operation when the problem is not in the active lifecycle state. |
| `CheckPublicationEligibility(ctx: context.Context, problem: *Problem)` | `error` | Private | Instance | Internal helper that obtains the required case types from `TestCaseSetReader`, verifies the test-case files, and applies `Problem.CanPublish`. |
| `CompareVersion(current: int, expected: int)` | `error` | Private | Instance | Internal helper that rejects the operation when the stored version and the expected version differ. |
| `SavePublicationState(ctx: context.Context, problemID: ProblemID, state: PublicationStatus, expectedVersion: int)` | `error` | Private | Instance | Internal helper that persists the publication state through `ProblemStore.SavePublicationState` with the expected version. |
| `HandlePersistenceFailure(err: error)` | `error` | Private | Instance | Internal helper that maps store failures to the declared not-found, conflict, validation, or internal outcomes without reporting success. |

## 4. Parameter design

### `CreateProblem(ctx: context.Context, principal: Principal, req: ProblemWriteRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `req` | `ProblemWriteRequest` | — | in | Problem fields for the new problem. |

### `UpdateProblem(ctx: context.Context, principal: Principal, problemID: ProblemID, req: ProblemWriteRequest, expectedVersion: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |
| `req` | `ProblemWriteRequest` | — | in | Replacement problem fields. |
| `expectedVersion` | `int` | — | in | Version the client last observed. |

### `DeactivateProblem(ctx: context.Context, principal: Principal, problemID: ProblemID, expectedVersion: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |
| `expectedVersion` | `int` | — | in | Supplies the optimistic-concurrency version checked by the operation. |

### `ReactivateProblem(ctx: context.Context, principal: Principal, problemID: ProblemID, expectedVersion: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |
| `expectedVersion` | `int` | — | in | Supplies the optimistic-concurrency version checked by the operation. |

### `PublishProblem(ctx: context.Context, principal: Principal, problemID: ProblemID, expectedVersion: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |
| `expectedVersion` | `int` | — | in | Supplies the optimistic-concurrency version checked by the operation. |

### `UnpublishProblem(ctx: context.Context, principal: Principal, problemID: ProblemID, expectedVersion: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |
| `expectedVersion` | `int` | — | in | Supplies the optimistic-concurrency version checked by the operation. |

### `ValidateProblemFields(req: ProblemWriteRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `req` | `ProblemWriteRequest` | — | in | Supplies the request or command payload. |

### `ValidateBusinessRules(problem: *Problem)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `problem` | `*Problem` | — | in | Supplies the problem used by the operation. |

### `ValidateUpdate(current: *Problem, next: *Problem)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `current` | `*Problem` | — | in | Supplies the current credential value. |
| `next` | `*Problem` | — | in | Supplies the replacement value. |

### `CheckProblemEditable(problem: *Problem)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `problem` | `*Problem` | — | in | Supplies the problem used by the operation. |

### `CheckActiveState(problem: *Problem)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `problem` | `*Problem` | — | in | Supplies the problem used by the operation. |

### `CheckPublicationEligibility(ctx: context.Context, problem: *Problem)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `problem` | `*Problem` | — | in | Problem whose test-case readiness is checked. |

### `CompareVersion(current: int, expected: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `current` | `int` | — | in | Supplies the current credential value. |
| `expected` | `int` | — | in | Supplies expected output text. |

### `SavePublicationState(ctx: context.Context, problemID: ProblemID, state: PublicationStatus, expectedVersion: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `problemID` | `ProblemID` | — | in | Identifies the target problem. |
| `state` | `PublicationStatus` | — | in | Target publication state. |
| `expectedVersion` | `int` | — | in | Supplies the optimistic-concurrency version checked by the operation. |

### `HandlePersistenceFailure(err: error)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `err` | `error` | — | in | Supplies the collaborator failure to classify or persist. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-PERM-002` | Insufficient privileges. | The administrator operation is rejected by authorization. | [SD-UC-AD-P-01-CreateProblem](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-01-CreateProblem.md) |
| `ERR-VAL-001` | Invalid data for the requested operation. | Validation fails before persistence and the caller receives the field-level error. | [SD-UC-AD-P-01-CreateProblem](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-01-CreateProblem.md) |
| `ERR-CONFLICT-001` | Problem is not editable in its current lifecycle state. | The test-case or problem mutation is rejected. | [SD-UC-AD-T-01-CreateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase.md) |
| `ERR-CONFLICT-003` | Problem is inactive. | The publication or update is rejected and reactivation is required. | [SD-UC-AD-P-02-UpdateProblem](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-02-UpdateProblem.md) |
| `ERR-CONFLICT-004` | Concurrent problem update. | The update is rejected by the optimistic-concurrency check; the caller reloads. | [SD-UC-AD-P-02-UpdateProblem](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-02-UpdateProblem.md) |
| `ERR-CONFLICT-005` | Concurrent problem state change. | The state change is rejected; the caller reloads the latest version. | [SD-UC-AD-P-03-DeleteProblem](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-03-DeleteProblem.md) |
| `ERR-CONFLICT-006` | Concurrent publication-state change. | The publication change is rejected; the caller reloads the latest version. | [SD-UC-AD-P-04-ManageProblemPublication](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-04-ManageProblemPublication.md) |
| `ERR-VAL-008` | Publication requirements are unmet. | The publication change is rejected; the problem remains in its current state. | [SD-UC-AD-P-04-ManageProblemPublication](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-04-ManageProblemPublication.md) |
| `ERR-SYS-001` | Internal system, persistence, or assembly error. | The request fails with an internal error; transactions roll back where applicable. | [SD-UC-AD-P-01-CreateProblem](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-01-CreateProblem.md) |

## 6. Method

### `CreateProblem(ctx: context.Context, principal: Principal, req: ProblemWriteRequest)`

Authorizes the caller, validates the request fields and business rules, builds a `Problem`, and saves it through `ProblemStore.SaveProblem`. It uses `ctx`, `principal`, `req`. It returns `(*Problem, error)`. Failures are returned through the declared error result rather than as a successful value.

### `UpdateProblem(ctx: context.Context, principal: Principal, problemID: ProblemID, req: ProblemWriteRequest, expectedVersion: int)`

Authorizes the caller, loads the problem, compares the version, checks editability, validates the replacement fields, applies them, and saves with the expected version. It uses `ctx`, `principal`, `problemID`, `req`, `expectedVersion`. It returns `(*Problem, error)`. Failures are returned through the declared error result rather than as a successful value.

### `DeactivateProblem(ctx: context.Context, principal: Principal, problemID: ProblemID, expectedVersion: int)`

Authorizes the caller, loads the problem, applies the inactive lifecycle transition, and saves the state with the expected version. It uses `ctx`, `principal`, `problemID`, `expectedVersion`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ReactivateProblem(ctx: context.Context, principal: Principal, problemID: ProblemID, expectedVersion: int)`

Authorizes the caller, loads the problem, applies the active lifecycle transition, and saves the state with the expected version. It uses `ctx`, `principal`, `problemID`, `expectedVersion`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `PublishProblem(ctx: context.Context, principal: Principal, problemID: ProblemID, expectedVersion: int)`

Authorizes the caller, checks editability and publication eligibility through `TestCaseSetReader`, applies the published state, and saves it with the expected version. It uses `ctx`, `principal`, `problemID`, `expectedVersion`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `UnpublishProblem(ctx: context.Context, principal: Principal, problemID: ProblemID, expectedVersion: int)`

Authorizes the caller, applies the draft publication state, and saves it with the expected version. It uses `ctx`, `principal`, `problemID`, `expectedVersion`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ValidateProblemFields(req: ProblemWriteRequest)`

Checks the required text, limits, category, difficulty, tags, and allowed languages before the problem is built or changed. It uses `req`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ValidateBusinessRules(problem: *Problem)`

Checks cross-field problem invariants such as non-empty allowed languages and positive limits. It uses `problem`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ValidateUpdate(current: *Problem, next: *Problem)`

Checks that the replacement problem does not violate invariants or change fields that the update contract does not permit. It uses `current`, `next`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `CheckProblemEditable(problem: *Problem)`

Rejects the operation when `Problem.IsEditable` is false. It uses `problem`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `CheckActiveState(problem: *Problem)`

Rejects the operation when the problem is not in the active lifecycle state. It uses `problem`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `CheckPublicationEligibility(ctx: context.Context, problem: *Problem)`

Obtains the required case types from `TestCaseSetReader`, verifies the test-case files, and applies `Problem.CanPublish`. It uses `ctx`, `problem`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `CompareVersion(current: int, expected: int)`

Rejects the operation when the stored version and the expected version differ. It uses `current`, `expected`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `SavePublicationState(ctx: context.Context, problemID: ProblemID, state: PublicationStatus, expectedVersion: int)`

Persists the publication state through `ProblemStore.SavePublicationState` with the expected version. It uses `ctx`, `problemID`, `state`, `expectedVersion`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `HandlePersistenceFailure(err: error)`

Maps store failures to the declared not-found, conflict, validation, or internal outcomes without reporting success. It uses `err`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
