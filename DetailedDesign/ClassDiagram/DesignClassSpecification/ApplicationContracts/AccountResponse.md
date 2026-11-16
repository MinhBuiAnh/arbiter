# AccountResponse — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `AccountResponse` |
| Classifier kind | Class |
| Package / subsystem | `Application Contracts (Go)` |
| DCD alias | `DTOAccountResponse` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`AccountResponse` is a class in the `Application Contracts (Go)` package/subsystem of the design class diagram.

Account view returned to the client without credential material.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `id` | `string` | Public | Instance | — | Account identifier. |
| `username` | `string` | Public | Instance | — | Account login name. |
| `email` | `string` | Public | Instance | — | Account e-mail address. |
| `displayName` | `string` | Public | Instance | — | Displayed account name. |
| `bio` | `string` | Public | Instance | — | Account biography. |
| `role` | `string` | Public | Instance | — | Account role as a string. |
| `status` | `string` | Public | Instance | — | Account status as a string. |
| `version` | `int` | Public | Instance | — | Current optimistic-concurrency version. |

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
