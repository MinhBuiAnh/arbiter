# TestCaseWriteRequest — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `TestCaseWriteRequest` |
| Classifier kind | Class |
| Package / subsystem | `Application Contracts (Go)` |
| DCD alias | `DTOTestCaseWriteRequest` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`TestCaseWriteRequest` is a class in the `Application Contracts (Go)` package/subsystem of the design class diagram.

Administrator test-case create/update contract.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `input` | `string` | Public | Instance | — | Test-case input content. |
| `expectedOutput` | `string` | Public | Instance | — | Expected-output content. |
| `type` | `string` | Public | Instance | — | Test-case classification. |
| `ordinal` | `int` | Public | Instance | — | Desired one-based position. |

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
