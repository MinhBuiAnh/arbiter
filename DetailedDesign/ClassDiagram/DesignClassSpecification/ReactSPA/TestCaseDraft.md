# TestCaseDraft — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `TestCaseDraft` |
| Classifier kind | Class |
| Package / subsystem | `React SPA (TypeScript)` |
| DCD alias | `UITestCaseDraft` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`TestCaseDraft` is a class in the `React SPA (TypeScript)` package/subsystem of the design class diagram.

TypeScript draft for creating or updating an administrator test case.

- Declared incoming design relationships: `AdminConsole`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `testCaseID` | `string` | Public | Instance | — | Test case being edited, or empty for a new case. |
| `input` | `string` | Public | Instance | — | Draft test-case input. |
| `expectedOutput` | `string` | Public | Instance | — | Draft expected output. |
| `type` | `string` | Public | Instance | — | Draft test-case classification. |
| `ordinal` | `number` | Public | Instance | — | Draft one-based position. |

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
