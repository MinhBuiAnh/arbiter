# ProblemDraft — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ProblemDraft` |
| Classifier kind | Class |
| Package / subsystem | `React SPA (TypeScript)` |
| DCD alias | `UIProblemDraft` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ProblemDraft` is a class in the `React SPA (TypeScript)` package/subsystem of the design class diagram.

TypeScript editor draft containing the current problem, language, source, and supported languages.

- Declared incoming design relationships: `PracticeWorkspace`, `AdminConsole`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `problemID` | `string` | Public | Instance | — | Problem currently loaded in the editor. |
| `title` | `string` | Public | Instance | — | Problem title shown in the workspace. |
| `statement` | `string` | Public | Instance | — | Problem statement shown in the workspace. |
| `language` | `string` | Public | Instance | — | Selected programming language. |
| `source` | `string` | Public | Instance | — | Current source text. |
| `supportedLanguages` | `string[]` | Public | Instance | — | Languages accepted by the problem. |

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
