# TestCaseSet — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `TestCaseSet` |
| Classifier kind | Class |
| Package / subsystem | `Test Case Module (Go)` |
| DCD alias | `TCTestCaseSet` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`TestCaseSet` is a class in the `Test Case Module (Go)` package/subsystem of the design class diagram.

Ordered aggregate of a problem test-case set.

- Declared outgoing design relationships: `TestCaseSetSummary`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `ProblemID` | `ProblemID` | Public | Instance | — | Identifier of the owning problem. |
| `Version` | `int` | Public | Instance | — | Optimistic-concurrency version used to detect conflicting updates. |
| `Cases` | `[]TestCase` | Public | Instance | — | Ordered test cases; order is normalized to one-based ordinals. |

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `ValidateCompleteOrder(ids: []TestCaseID)` | `error` | Public | Instance | Checks that `ids` contains every case in `Cases` exactly once and no unknown case. |
| `NormalizeOrdinals()` | `void` | Public | Instance | Rewrites each case ordinal to its one-based position in `Cases`. |
| `Reorder(ids: []TestCaseID)` | `error` | Public | Instance | Validates the complete order, reorders `Cases` to match `ids`, and normalizes the ordinals. |
| `Summary()` | `TestCaseSetSummary` | Public | Instance | Builds a `TestCaseSetSummary` from `ProblemID`, `Version`, the case count, and the distinct case types in `Cases`. |

## 4. Parameter design

### `ValidateCompleteOrder(ids: []TestCaseID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ids` | `[]TestCaseID` | — | in | Supplies test-case identifiers in the required order. |

### `NormalizeOrdinals()`

This operation has no parameters.

### `Reorder(ids: []TestCaseID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ids` | `[]TestCaseID` | — | in | Supplies test-case identifiers in the required order. |

### `Summary()`

This operation has no parameters.

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-VAL-009` | Duplicate or invalid test-case order. | The reorder or update is rejected; the stored order is unchanged. | [SD-UC-AD-T-01-CreateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-01-CreateTestCase.md) |
| `ERR-CONFLICT-002` | Concurrent test-case set or order change. | The reorder is rejected; the caller must reload the current set version. | [SD-UC-AD-T-05-ReorderTestCases-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-05-ReorderTestCases-Exceptions.md) |
| `ERR-CONFLICT-008` | Concurrent test-case set change. | The delete or reorder is rejected; the caller reloads the set. | [SD-UC-AD-T-03-DeleteTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-03-DeleteTestCase.md) |

## 6. Method

### `ValidateCompleteOrder(ids: []TestCaseID)`

Checks that `ids` contains every case in `Cases` exactly once and no unknown case. It uses `ids`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `NormalizeOrdinals()`

Rewrites each case ordinal to its one-based position in `Cases`. It has no parameters. It updates the declared attribute(s) `Cases`. No value is returned.

### `Reorder(ids: []TestCaseID)`

Validates the complete order, reorders `Cases` to match `ids`, and normalizes the ordinals. It uses `ids`. It updates the declared attribute(s) `Cases`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `Summary()`

Builds a `TestCaseSetSummary` from `ProblemID`, `Version`, the case count, and the distinct case types in `Cases`. It has no parameters. It reads the declared attribute(s) `ProblemID`, `Version`, `Cases`. It returns `TestCaseSetSummary`.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
