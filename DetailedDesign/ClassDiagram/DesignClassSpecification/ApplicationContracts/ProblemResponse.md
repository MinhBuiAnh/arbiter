# ProblemResponse — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ProblemResponse` |
| Classifier kind | Class |
| Package / subsystem | `Application Contracts (Go)` |
| DCD alias | `DTOProblemResponse` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ProblemResponse` is a class in the `Application Contracts (Go)` package/subsystem of the design class diagram.

Public or administrative problem view.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `id` | `string` | Public | Instance | — | Problem identifier. |
| `title` | `string` | Public | Instance | — | Problem title. |
| `statement` | `string` | Public | Instance | — | Problem statement. |
| `inputFormat` | `string` | Public | Instance | — | Input-format description. |
| `outputFormat` | `string` | Public | Instance | — | Output-format description. |
| `constraints` | `string` | Public | Instance | — | Constraints description. |
| `difficulty` | `string` | Public | Instance | — | Difficulty classification. |
| `tags` | `[]string` | Public | Instance | — | Problem tags. |
| `timeLimitMS` | `int` | Public | Instance | — | Per-test time limit in milliseconds. |
| `memoryLimitMB` | `int` | Public | Instance | — | Per-test memory limit in megabytes. |
| `lifecycleStatus` | `string` | Public | Instance | — | Lifecycle state as a string. |
| `publicationStatus` | `string` | Public | Instance | — | Publication state as a string. |
| `version` | `int` | Public | Instance | — | Current optimistic-concurrency version. |
| `sampleCases` | `[]TestCaseResponse` | Public | Instance | — | Public sample cases. |
| `statistics` | `PublicStatisticsResponse` | Public | Instance | — | Public statistics view. |

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
