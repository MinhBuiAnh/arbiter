# TestCaseFileRefs — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `TestCaseFileRefs` |
| Classifier kind | Class |
| Package / subsystem | `Test Case Module (Go)` |
| DCD alias | `TCTestCaseFileRefs` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`TestCaseFileRefs` is a class in the `Test Case Module (Go)` package/subsystem of the design class diagram.

Value object carrying protected test-case file references.

- Declared incoming design relationships: `TestCaseMetadata`, `TestCaseStore`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `InputRef` | `string` | Public | Instance | — | Protected storage reference for input content. |
| `ExpectedOutputRef` | `string` | Public | Instance | — | Protected storage reference for expected output. |

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
