# PracticeWorkspace — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `PracticeWorkspace` |
| Classifier kind | Class |
| Package / subsystem | `React SPA (TypeScript)` |
| DCD alias | `UIPracticeWorkspace` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`PracticeWorkspace` is a class in the `React SPA (TypeScript)` package/subsystem of the design class diagram.

React editor workspace that manages source and language drafts and submits solutions.

- Declared outgoing design relationships: `ProblemApi`, `SubmissionApi`, `ProblemDraft`, `EditorConfig`.
- Declared incoming design relationships: `AppShell`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `draft` | `ProblemDraft` | Public | Instance | — | Current editor draft containing the problem, language, source, and supported languages. |

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `initializeEditor(config: EditorConfig)` | `void` | Public | Instance | Applies `EditorConfig` language, source, and read-only values to the `draft` and initializes the editor surface. |
| `selectLanguage(language: string)` | `Promise<void>` | Public | Instance | Checks the requested language with `validateSupportedLanguage`, updates `draft.language`, and obtains the matching editor context from `ProblemApi.getEditorContext` when the draft has a problem. |
| `validateSupportedLanguage(language: string)` | `boolean` | Public | Instance | Checks the requested language against `draft.supportedLanguages` without changing the draft. |
| `editSource(source: string)` | `void` | Public | Instance | Stores the edited text in `draft.source`. |
| `restoreTemplate()` | `void` | Public | Instance | Replaces `draft.source` with the starter template for the selected language; the template content itself is not specified by the DCD. |
| `clearSource()` | `void` | Public | Instance | Sets `draft.source` to an empty value. |
| `submitSolution()` | `Promise<SubmissionStatusResponse>` | Public | Instance | Submits `draft.problemID`, `draft.language`, and `draft.source` through `SubmissionApi.createSubmission` and passes the receipt to `displaySubmissionReceipt`. |
| `displaySubmissionReceipt(res: SubmissionStatusResponse)` | `void` | Public | Instance | Presents the accepted submission identifier and initial status so the tracker can begin polling. |

## 4. Parameter design

### `initializeEditor(config: EditorConfig)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `config` | `EditorConfig` | — | in | Editor language, source, and read-only configuration. |

### `selectLanguage(language: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `language` | `string` | — | in | Language selected in the editor. |

### `validateSupportedLanguage(language: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `language` | `string` | — | in | Language to check against the draft-supported set. |

### `editSource(source: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `source` | `string` | — | in | Edited source text. |

### `restoreTemplate()`

This operation has no parameters.

### `clearSource()`

This operation has no parameters.

### `submitSolution()`

This operation has no parameters.

### `displaySubmissionReceipt(res: SubmissionStatusResponse)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `res` | `SubmissionStatusResponse` | — | in | Accepted submission status returned by the API. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-VAL-002` | Invalid language or source configuration. | The submission is rejected before judging; no verdict is produced. | [SD-UC-SYS-J-01-ProcessSubmission](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission.md) |
| `ERR-VAL-013` | Unsupported programming language. | The submission is rejected before judging. | [SD-UC-U-P-02-SelectProgrammingLanguage](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-02-SelectProgrammingLanguage.md) |
| `ERR-VAL-014` | Invalid submission data. | The submission is rejected; no submission or outbox row is created. | [SD-UC-U-P-03-SubmitSolution](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-03-SubmitSolution.md) |
| `ERR-PERM-001` | Problem is not publicly accessible. | The read or submission is rejected as not permitted. | [SD-UC-U-P-01-WriteSolution](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-01-WriteSolution.md) |
| `ERR-RES-001` | Problem not found. | The operation is rejected without changing state. | [SD-UC-U-P-01-WriteSolution](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-01-WriteSolution.md) |
| `ERR-NET-001` | Network error or interrupted request/response. | The UI cannot confirm the outcome and informs the user rather than assuming success. | [SD-UC-U-P-01-WriteSolution](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-01-WriteSolution.md) |
| `ERR-SYS-008` | Editor initialization error. | The workspace reports that the editor cannot be initialized. | [SD-UC-U-P-01-WriteSolution](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-01-WriteSolution.md) |
| `ERR-SYS-009` | Editor or judge configuration error. | The operation reports a configuration failure. | [SD-UC-U-P-02-SelectProgrammingLanguage](../../../../ArchitecturalDesign/SequenceDiagram/User/ProblemPractice/SD-UC-U-P-02-SelectProgrammingLanguage.md) |

## 6. Method

### `initializeEditor(config: EditorConfig)`

Applies `EditorConfig` language, source, and read-only values to the `draft` and initializes the editor surface. It uses `config`. It reads the declared attribute(s) `draft`. No value is returned.

### `selectLanguage(language: string)`

Checks the requested language with `validateSupportedLanguage`, updates `draft.language`, and obtains the matching editor context from `ProblemApi.getEditorContext` when the draft has a problem. It uses `language`. It reads the declared attribute(s) `draft`. It returns `Promise<void>`.

### `validateSupportedLanguage(language: string)`

Checks the requested language against `draft.supportedLanguages` without changing the draft. It uses `language`. It reads the declared attribute(s) `draft`. It returns `boolean`.

### `editSource(source: string)`

Stores the edited text in `draft.source`. It uses `source`. It reads the declared attribute(s) `draft`. No value is returned.

### `restoreTemplate()`

Replaces `draft.source` with the starter template for the selected language; the template content itself is not specified by the DCD. It has no parameters. It reads the declared attribute(s) `draft`. No value is returned.

### `clearSource()`

Sets `draft.source` to an empty value. It has no parameters. It reads the declared attribute(s) `draft`. No value is returned.

### `submitSolution()`

Submits `draft.problemID`, `draft.language`, and `draft.source` through `SubmissionApi.createSubmission` and passes the receipt to `displaySubmissionReceipt`. It has no parameters. It reads the declared attribute(s) `draft`. It returns `Promise<SubmissionStatusResponse>`.

### `displaySubmissionReceipt(res: SubmissionStatusResponse)`

Presents the accepted submission identifier and initial status so the tracker can begin polling. It uses `res`. No value is returned.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
