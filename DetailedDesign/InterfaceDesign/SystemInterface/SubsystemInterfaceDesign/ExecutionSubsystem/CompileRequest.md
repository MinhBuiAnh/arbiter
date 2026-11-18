# CompileRequest — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `CompileRequest` |
| Classifier kind | Class |
| Package / subsystem | `Execution Subsystem (Go)` |
| DCD alias | `EXECompileRequest` |
| Design class diagram | [DesignClassDiagram.md](../../../../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../../../ClassDiagram/Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`CompileRequest` is a class in the `Execution Subsystem (Go)` package/subsystem of the design class diagram.

Execution request value carrying the language and source to compile.

- Declared incoming design relationships: `Compiler`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `SubmissionID` | `SubmissionID` | Public | Instance | — | Identifies the submission that owns the compilation workspace and resources. |
| `Language` | `Language` | Public | Instance | — | Submission programming language. |
| `Source` | `string` | Public | Instance | — | Submitted source code. |

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
