# TestCasePostgresRepository — Subsystem Element Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Subsystem element specification |
| Element | `TestCasePostgresRepository` |
| Owning subsystem | Persistence Subsystem (Go) |
| Classifier kind | Class |
| Realized interface | [TestCaseRepository](../../../../../ClassDiagram/DesignClassSpecification/TestCaseModule/TestCaseRepository.md) |
| Interface-facing specification | [TestCasePostgresRepository](../../../SubsystemInterfaceDesign/PersistenceSubsystem/TestCasePostgresRepository.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-19 |

## 1. Identification

`TestCasePostgresRepository` realizes `TestCaseRepository` and owns test-case metadata, set versions, ordinal uniqueness, and protected-store references.

## 2. Attribute Design

| Name | Data type | Visibility | Scope | Default value | Description |
|---|---|---|---|---|---|
| `db` | `PostgresDB` | Private | Instance | — | Pooled SQL database used for queries and transactions. |

## 3. Operation Design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|---|---|---|---|---|
| `FindTestCase(ctx: context.Context, id: TestCaseID)` | `(*TestCase, error)` | Public | Instance | Loads one test-case aggregate. |
| `ReadTestCaseSet(ctx: context.Context, problemID: ProblemID)` | `(*TestCaseSet, error)` | Public | Instance | Loads ordered cases and set version. |
| `ListTestCaseMetadata(ctx: context.Context, problemID: ProblemID)` | `([]TestCaseMetadata, error)` | Public | Instance | Lists ordered metadata. |
| `SaveTestCase(ctx: context.Context, testCase: *TestCase)` | `error` | Public | Instance | Inserts metadata and increments set version. |
| `UpdateTestCase(ctx: context.Context, testCase: *TestCase, expectedVersion: int)` | `error` | Public | Instance | Performs a version-checked metadata update. |
| `DeleteAndCompactTestCases(ctx: context.Context, problemID: ProblemID, testCaseID: TestCaseID)` | `error` | Public | Instance | Deletes one case and closes its ordinal gap. |
| `SaveTestCaseOrder(ctx: context.Context, problemID: ProblemID, orderedIDs: []TestCaseID, expectedSetVersion: int)` | `error` | Public | Instance | Persists complete order and set version. |
| `SaveTestCaseType(ctx: context.Context, id: TestCaseID, testCaseType: TestCaseType, expectedVersion: int)` | `error` | Public | Instance | Updates type with optimistic concurrency. |
| `ReadTestCaseType(ctx: context.Context, id: TestCaseID)` | `(TestCaseType, error)` | Public | Instance | Reads the test-case classification. |
| `ReadTestCaseSetVersion(ctx: context.Context, problemID: ProblemID)` | `(int, error)` | Public | Instance | Reads the set optimistic version. |

## 4. Parameter Design

| Operation | Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|---|
| `FindTestCase` | `id` | `TestCaseID` | — | in | Target test case. |
| `ReadTestCaseSet` | `problemID` | `ProblemID` | — | in | Owning problem. |
| `ListTestCaseMetadata` | `problemID` | `ProblemID` | — | in | Owning problem. |
| `SaveTestCase` | `testCase` | `*TestCase` | — | in | Metadata and references to insert. |
| `UpdateTestCase` | `testCase` | `*TestCase` | — | in | Updated metadata. |
| `UpdateTestCase` | `expectedVersion` | `int` | — | in | Test-case optimistic version. |
| `DeleteAndCompactTestCases` | `problemID` | `ProblemID` | — | in | Owning problem. |
| `DeleteAndCompactTestCases` | `testCaseID` | `TestCaseID` | — | in | Case to delete. |
| `SaveTestCaseOrder` | `problemID` | `ProblemID` | — | in | Owning problem. |
| `SaveTestCaseOrder` | `orderedIDs` | `[]TestCaseID` | — | in | Complete desired order. |
| `SaveTestCaseOrder` | `expectedSetVersion` | `int` | — | in | Set optimistic version. |
| `SaveTestCaseType` | `id` | `TestCaseID` | — | in | Target test case. |
| `SaveTestCaseType` | `testCaseType` | `TestCaseType` | — | in | New classification. |
| `SaveTestCaseType` | `expectedVersion` | `int` | — | in | Test-case optimistic version. |
| `ReadTestCaseType` | `id` | `TestCaseID` | — | in | Target test case. |
| `ReadTestCaseSetVersion` | `problemID` | `ProblemID` | — | in | Owning problem. |

All operations receive `ctx: context.Context` as their first in parameter.

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-SYS-003` | PostgreSQL connection, query, or transaction failure. | Roll back and return no partial set. | [SD-PERS-TestCase](../Diagram/SD-PERS-TestCase.md) |
| Not found | Test case or set row is absent. | Return a not-found result. | [SD-PERS-TestCase](../Diagram/SD-PERS-TestCase.md) |
| Stale set/case | Version predicate affects zero rows or the set changed. | Return conflict/stale-write behavior. | [SD-PERS-TestCase](../Diagram/SD-PERS-TestCase.md) |
| Ordinal/type constraint | Duplicate ordinal or invalid type violates a constraint. | Map to validation/conflict without SQL details. | [SD-PERS-TestCase](../Diagram/SD-PERS-TestCase.md) |

## 6. Method

Read operations load ordered metadata and references without reading protected file content. Mutations use a transaction that checks the set row and updates `test_case_sets.version` together with test-case membership or metadata.

`SaveTestCase` inserts at the caller-assigned ordinal and increments the set version. `UpdateTestCase` uses its test-case version in the predicate and increments it on success. `DeleteAndCompactTestCases` deletes one row and decrements all later ordinals. `SaveTestCaseOrder` verifies every identifier belongs to the problem, then applies the complete order and set version in one transaction. `SaveTestCaseType` and reads use only metadata/protected references.

## 7. Other Diagrams

- [Test-case persistence family](../Diagram/SD-PERS-TestCase.md)
