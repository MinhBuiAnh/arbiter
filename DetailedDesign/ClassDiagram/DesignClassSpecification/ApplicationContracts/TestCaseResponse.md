# TestCaseResponse — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `TestCaseResponse` |
| Classifier kind | Class |
| Package / subsystem | `Application Contracts (Go)` |
| DCD alias | `DTOTestCaseResponse` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`TestCaseResponse` is a class in the `Application Contracts (Go)` package/subsystem of the design class diagram.

Administrator test-case view without protected file content.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `id` | `string` | Public | Instance | — | Test-case identifier. |
| `problemID` | `string` | Public | Instance | — | Owning problem identifier. |
| `type` | `string` | Public | Instance | — | Test-case classification. |
| `ordinal` | `int` | Public | Instance | — | One-based position in the set. |
| `version` | `int` | Public | Instance | — | Current optimistic-concurrency version. |
| `inputPreview` | `string` | Public | Instance | — | Bounded preview of the input; hidden content is not disclosed. |
| `expectedOutputPreview` | `string` | Public | Instance | — | Bounded preview of the expected output. |

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
