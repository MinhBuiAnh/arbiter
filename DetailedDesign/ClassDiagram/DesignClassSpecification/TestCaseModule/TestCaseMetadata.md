# TestCaseMetadata — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `TestCaseMetadata` |
| Classifier kind | Class |
| Package / subsystem | `Test Case Module (Go)` |
| DCD alias | `TCTestCaseMetadata` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`TestCaseMetadata` is a class in the `Test Case Module (Go)` package/subsystem of the design class diagram.

Read model carrying test-case identity, classification, order, and file references.

- Declared outgoing design relationships: `TestCaseFileRefs`.
- Declared incoming design relationships: `TestCaseRepository`, `JudgeContext`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `ID` | `TestCaseID` | Public | Instance | — | Unique identifier for the record. |
| `ProblemID` | `ProblemID` | Public | Instance | — | Identifier of the owning problem. |
| `Type` | `TestCaseType` | Public | Instance | — | Test-case classification. |
| `Ordinal` | `int` | Public | Instance | — | One-based position in the ordered test-case set. |
| `FileRefs` | `TestCaseFileRefs` | Public | Instance | — | Protected file references for the test case. |

## 3. Operation design

No operations are specified for this classifier in the DCD.

## 4. Parameter design

No operations are specified, so there are no parameters.

## 5. Exception

None identified in the referenced sequence diagrams.

## 6. Method

No methods are specified for this classifier in the DCD.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
