# TestCase — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `TestCase` |
| Classifier kind | Class |
| Package / subsystem | `Test Case Module (Go)` |
| DCD alias | `TCTestCase` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`TestCase` is a class in the `Test Case Module (Go)` package/subsystem of the design class diagram.

Test-case entity holding classification, ordinal, version, and protected file references.

- Declared incoming design relationships: `TestCaseRepository`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `ID` | `TestCaseID` | Public | Instance | — | Unique test-case identifier. |
| `ProblemID` | `ProblemID` | Public | Instance | — | Identifier of the owning problem. |
| `Type` | `TestCaseType` | Public | Instance | — | `SAMPLE` or `HIDDEN`; hidden cases are never exposed publicly. |
| `Ordinal` | `int` | Public | Instance | — | One-based position in the ordered test-case set. |
| `Version` | `int` | Public | Instance | — | Optimistic-concurrency version for test-case edits. |
| `UpdatedAt` | `time.Time` | Public | Instance | — | Last-update timestamp. |
| `inputRef` | `string` | Private | Instance | — | Package-private protected-storage reference for input content. |
| `expectedOutputRef` | `string` | Private | Instance | — | Package-private protected-storage reference for expected output. |

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `Validate()` | `error` | Public | Instance | Checks the required identifiers, classification, ordinal, and file references against the entity invariants. |
| `ChangeType(next: TestCaseType)` | `error` | Public | Instance | Sets `Type` to the supplied classification after validating it. |
| `SetOrdinal(ordinal: int)` | `error` | Public | Instance | Sets `Ordinal` to the supplied one-based position. |

## 4. Parameter design

### `Validate()`

This operation has no parameters.

### `ChangeType(next: TestCaseType)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `next` | `TestCaseType` | — | in | Target test-case classification. |

### `SetOrdinal(ordinal: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ordinal` | `int` | — | in | One-based position to assign. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-VAL-001` | Invalid data for the requested operation. | Validation fails before persistence and the caller receives the field-level error. | [SD-UC-AD-T-02-UpdateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-02-UpdateTestCase.md) |
| `ERR-CONFLICT-001` | Problem is not editable in its current lifecycle state. | The test-case or problem mutation is rejected. | [SD-UC-AD-T-02-UpdateTestCase](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-02-UpdateTestCase.md) |
| `ERR-CONFLICT-007` | Concurrent test-case update. | The update is rejected; the caller reloads the test case. | [SD-UC-AD-T-02-UpdateTestCase-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/TestCaseManagement/SD-UC-AD-T-02-UpdateTestCase-Exceptions.md) |

## 6. Method

### `Validate()`

Checks the required identifiers, classification, ordinal, and file references against the entity invariants. It has no parameters. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ChangeType(next: TestCaseType)`

Sets `Type` to the supplied classification after validating it. It uses `next`. It updates the declared attribute(s) `Type`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `SetOrdinal(ordinal: int)`

Sets `Ordinal` to the supplied one-based position. It uses `ordinal`. It updates the declared attribute(s) `Ordinal`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
