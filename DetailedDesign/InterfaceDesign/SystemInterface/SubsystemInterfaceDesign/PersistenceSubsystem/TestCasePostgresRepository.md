# TestCasePostgresRepository — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `TestCasePostgresRepository` |
| Classifier kind | Class |
| Package / subsystem | `Persistence Subsystem (Go)` |
| DCD alias | `PSTestCaseRepository` |
| Design class diagram | [DesignClassDiagram.md](../../../../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../../../ClassDiagram/Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`TestCasePostgresRepository` is a class in the `Persistence Subsystem (Go)` package/subsystem of the design class diagram.

PostgreSQL adapter that realizes `TestCaseRepository`.

- Declared outgoing design relationships: `TestCaseRepository`.
- Realizes: `TestCaseRepository`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|---|---|---|---|---|---|
| `db` | `PostgresDB` | Private | Instance | — | Pooled PostgreSQL database used for test-case metadata and set transactions. |

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|---|---|---|---|---|
| `FindTestCase(ctx: context.Context, id: TestCaseID)` | `(*TestCase, error)` | Public | Instance | Loads one test case. |
| `ReadTestCaseSet(ctx: context.Context, problemID: ProblemID)` | `(*TestCaseSet, error)` | Public | Instance | Loads ordered cases and set version. |
| `ListTestCaseMetadata(ctx: context.Context, problemID: ProblemID)` | `([]TestCaseMetadata, error)` | Public | Instance | Lists ordered metadata. |
| `SaveTestCase(ctx: context.Context, testCase: *TestCase)` | `error` | Public | Instance | Inserts metadata and references. |
| `UpdateTestCase(ctx: context.Context, testCase: *TestCase, expectedVersion: int)` | `error` | Public | Instance | Version-checked metadata update. |
| `DeleteAndCompactTestCases(ctx: context.Context, problemID: ProblemID, testCaseID: TestCaseID)` | `error` | Public | Instance | Deletes and compacts ordinals. |
| `SaveTestCaseOrder(ctx: context.Context, problemID: ProblemID, orderedIDs: []TestCaseID, expectedSetVersion: int)` | `error` | Public | Instance | Persists complete order. |
| `SaveTestCaseType(ctx: context.Context, id: TestCaseID, testCaseType: TestCaseType, expectedVersion: int)` | `error` | Public | Instance | Updates type with optimistic concurrency. |
| `ReadTestCaseType(ctx: context.Context, id: TestCaseID)` | `(TestCaseType, error)` | Public | Instance | Reads test-case type. |
| `ReadTestCaseSetVersion(ctx: context.Context, problemID: ProblemID)` | `(int, error)` | Public | Instance | Reads set version. |

## 4. Parameter design

All operations receive `ctx: context.Context`; all remaining parameters are the exact DCD signature parameters. No protected file content is read.

## 5. Exception

See [SD-PERS-TestCase](../../SubsystemDesign/PersistenceSubsystem/Diagram/SD-PERS-TestCase.md) for read, mutation, conflict, constraint, and `ERR-SYS-003` paths.

## 6. Method

Uses `db` with set-lock and version predicates. Create/update/delete/reorder/type mutations keep the test-case set and affected ordinals atomic. See [TestCasePostgresRepository](../../SubsystemDesign/PersistenceSubsystem/Specification/TestCasePostgresRepository.md).

## 7. Other diagrams

[SD-PERS-TestCase](../../SubsystemDesign/PersistenceSubsystem/Diagram/SD-PERS-TestCase.md)
