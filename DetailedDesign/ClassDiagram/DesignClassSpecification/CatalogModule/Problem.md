# Problem — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `Problem` |
| Classifier kind | Class |
| Package / subsystem | `Catalog Module (Go)` |
| DCD alias | `CATProblem` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`Problem` is a class in the `Catalog Module (Go)` package/subsystem of the design class diagram.

Problem aggregate root holding metadata, limits, languages, lifecycle, publication state, and version.

- Declared outgoing design relationships: `TestCaseSetSummary`.
- Declared incoming design relationships: `ProblemQueryService`, `ProblemAdminService`, `ProblemDetails`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `ID` | `ProblemID` | Public | Instance | — | Unique problem identifier. |
| `Title` | `string` | Public | Instance | — | Problem title. |
| `Statement` | `string` | Public | Instance | — | Problem statement. |
| `InputFormat` | `string` | Public | Instance | — | Problem input-format description. |
| `OutputFormat` | `string` | Public | Instance | — | Problem output-format description. |
| `Constraints` | `string` | Public | Instance | — | Problem constraints description. |
| `Category` | `string` | Public | Instance | — | Problem category. |
| `Difficulty` | `Difficulty` | Public | Instance | — | Problem difficulty classification. |
| `Tags` | `[]string` | Public | Instance | — | Problem tags. |
| `AllowedLanguages` | `[]Language` | Public | Instance | — | Non-empty set of languages accepted for this problem. |
| `TimeLimitMS` | `int` | Public | Instance | — | Per-test time limit in milliseconds. |
| `MemoryLimitMB` | `int` | Public | Instance | — | Per-test memory limit in megabytes. |
| `LifecycleStatus` | `LifecycleStatus` | Public | Instance | — | Problem lifecycle state. |
| `PublicationStatus` | `PublicationStatus` | Public | Instance | — | Problem publication state. |
| `Version` | `int` | Public | Instance | — | Optimistic-concurrency version for problem edits and state changes. |
| `UpdatedAt` | `time.Time` | Public | Instance | — | Last-update timestamp. |

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `IsPublic()` | `bool` | Public | Instance | Derives whether the problem is publicly visible from `LifecycleStatus` and `PublicationStatus`. |
| `IsEditable()` | `bool` | Public | Instance | Derives whether the problem may be edited from `LifecycleStatus`. |
| `Validate()` | `error` | Public | Instance | Checks the required problem fields, limits, and language set against the entity invariants without persisting. |
| `CanPublish(summary: TestCaseSetSummary)` | `error` | Public | Instance | Checks `LifecycleStatus`, `TimeLimitMS`, `MemoryLimitMB`, and the supplied test-case summary for sample and hidden coverage before publication. |
| `ChangeLifecycle(next: LifecycleStatus)` | `error` | Public | Instance | Applies the requested lifecycle transition to `LifecycleStatus` after checking that the transition is allowed. |
| `ChangePublication(next: PublicationStatus)` | `error` | Public | Instance | Applies the requested publication transition to `PublicationStatus` after the caller has checked publication eligibility. |

## 4. Parameter design

### `IsPublic()`

This operation has no parameters.

### `IsEditable()`

This operation has no parameters.

### `Validate()`

This operation has no parameters.

### `CanPublish(summary: TestCaseSetSummary)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `summary` | `TestCaseSetSummary` | — | in | Publication-readiness summary with the case count and required sample/hidden types. |

### `ChangeLifecycle(next: LifecycleStatus)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `next` | `LifecycleStatus` | — | in | Target lifecycle state. |

### `ChangePublication(next: PublicationStatus)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `next` | `PublicationStatus` | — | in | Target publication state. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-VAL-001` | Invalid data for the requested operation. | Validation fails before persistence and the caller receives the field-level error. | [SD-UC-AD-P-02-UpdateProblem](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-02-UpdateProblem.md) |
| `ERR-CONFLICT-001` | Problem is not editable in its current lifecycle state. | The test-case or problem mutation is rejected. | [SD-UC-AD-T-01-CreateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase.md) |
| `ERR-CONFLICT-003` | Problem is inactive. | The publication or update is rejected and reactivation is required. | [SD-UC-AD-P-02-UpdateProblem](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-02-UpdateProblem.md) |
| `ERR-VAL-008` | Publication requirements are unmet. | The publication change is rejected; the problem remains in its current state. | [SD-UC-AD-P-04-ManageProblemPublication](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-04-ManageProblemPublication.md) |
| `ERR-CONFLICT-012` | Problem has no executable test cases. | The operation is rejected; no judge work is scheduled. | [SD-UC-SYS-J-01-ProcessSubmission](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission.md) |

## 6. Method

### `IsPublic()`

Derives whether the problem is publicly visible from `LifecycleStatus` and `PublicationStatus`. It has no parameters. It reads the declared attribute(s) `LifecycleStatus`, `PublicationStatus`. It returns `bool`.

### `IsEditable()`

Derives whether the problem may be edited from `LifecycleStatus`. It has no parameters. It reads the declared attribute(s) `LifecycleStatus`. It returns `bool`.

### `Validate()`

Checks the required problem fields, limits, and language set against the entity invariants without persisting. It has no parameters. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `CanPublish(summary: TestCaseSetSummary)`

Checks `LifecycleStatus`, `TimeLimitMS`, `MemoryLimitMB`, and the supplied test-case summary for sample and hidden coverage before publication. It uses `summary`. It reads the declared attribute(s) `LifecycleStatus`, `TimeLimitMS`, `MemoryLimitMB`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ChangeLifecycle(next: LifecycleStatus)`

Applies the requested lifecycle transition to `LifecycleStatus` after checking that the transition is allowed. It uses `next`. It updates the declared attribute(s) `LifecycleStatus`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ChangePublication(next: PublicationStatus)`

Applies the requested publication transition to `PublicationStatus` after the caller has checked publication eligibility. It uses `next`. It updates the declared attribute(s) `PublicationStatus`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
