# VerdictEvaluator — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `VerdictEvaluator` |
| Classifier kind | Class |
| Package / subsystem | `Judge Module (Go)` |
| DCD alias | `JDGVerdictEvaluator` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`VerdictEvaluator` is a class in the `Judge Module (Go)` package/subsystem of the design class diagram.

Judge component that determines the final verdict from compilation and case results.

- Declared outgoing design relationships: `TestCaseResult`, `CompileResult`.
- Declared incoming design relationships: `SubmissionProcessor`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `DetermineVerdict(compilation: CompileResult, results: []TestCaseResult, expectedTotal: int)` | `(Verdict, ResultMetrics)` | Public | Instance | Returns `COMPILATION_ERROR` when compilation failed, otherwise maps the first non-passed case outcome to its verdict and aggregates runtime and peak memory from the results. |
| `CompareOutput(expected: string, actual: string)` | `(bool, error)` | Private | Instance | Internal helper that normalizes both values with `NormalizeOutput` and compares the resulting token streams. |
| `NormalizeOutput(value: string)` | `[]string` | Private | Instance | Internal helper that splits the value into lines, removes line-ending and trailing-whitespace differences, and returns the normalized lines. |
| `IsOutputCapped(value: string)` | `bool` | Private | Instance | Internal helper that reports whether the output exceeds the display bound. |

## 4. Parameter design

### `DetermineVerdict(compilation: CompileResult, results: []TestCaseResult, expectedTotal: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `compilation` | `CompileResult` | — | in | Compilation result that may short-circuit the verdict. |
| `results` | `[]TestCaseResult` | — | in | Per-test results produced by execution. |
| `expectedTotal` | `int` | — | in | Number of cases that should have been executed. |

### `CompareOutput(expected: string, actual: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `expected` | `string` | — | in | Expected output text. |
| `actual` | `string` | — | in | Actual output text. |

### `NormalizeOutput(value: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `value` | `string` | — | in | Output text to normalize. |

### `IsOutputCapped(value: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `value` | `string` | — | in | Output text checked against the display cap. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-SYS-005` | Output comparison failure. | The judge records an internal error rather than a wrong-answer verdict. | [SD-UC-SYS-J-01-ProcessSubmission](../../../../ArchitecturalDesign/SequenceDiagram/System/Judge/SD-UC-SYS-J-01-ProcessSubmission.md) |

## 6. Method

### `DetermineVerdict(compilation: CompileResult, results: []TestCaseResult, expectedTotal: int)`

Returns `COMPILATION_ERROR` when compilation failed, otherwise maps the first non-passed case outcome to its verdict and aggregates runtime and peak memory from the results. It uses `compilation`, `results`, `expectedTotal`. It returns `(Verdict, ResultMetrics)`.

### `CompareOutput(expected: string, actual: string)`

Normalizes both values with `NormalizeOutput` and compares the resulting token streams. It uses `expected`, `actual`. It returns `(bool, error)`. Failures are returned through the declared error result rather than as a successful value.

### `NormalizeOutput(value: string)`

Splits the value into lines, removes line-ending and trailing-whitespace differences, and returns the normalized lines. It uses `value`. It returns `[]string`.

### `IsOutputCapped(value: string)`

Reports whether the output exceeds the display bound. It uses `value`. It returns `bool`.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
