# CompileResult — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `CompileResult` |
| Classifier kind | Class |
| Package / subsystem | `Execution Subsystem (Go)` |
| DCD alias | `EXECompileResult` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`CompileResult` is a class in the `Execution Subsystem (Go)` package/subsystem of the design class diagram.

Execution result value carrying compilation success, output, and artifact path.

- Declared incoming design relationships: `VerdictEvaluator`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `Succeeded` | `bool` | Public | Instance | — | Whether compilation succeeded. |
| `Output` | `string` | Public | Instance | — | Captured compiler or program output. |
| `ArtifactPath` | `string` | Public | Instance | — | Path of the compiled artifact used for execution. |

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
