# EditorConfig — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `EditorConfig` |
| Classifier kind | Class |
| Package / subsystem | `React SPA (TypeScript)` |
| DCD alias | `UIEditorConfig` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`EditorConfig` is a class in the `React SPA (TypeScript)` package/subsystem of the design class diagram.

TypeScript editor configuration passed to the practice workspace when the editor initializes.

- Declared incoming design relationships: `PracticeWorkspace`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `language` | `string` | Public | Instance | — | Language the editor should use. |
| `source` | `string` | Public | Instance | — | Initial or restored source text. |
| `readOnly` | `boolean` | Public | Instance | — | Whether the editor disallows source changes. |

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
