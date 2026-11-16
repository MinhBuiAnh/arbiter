# ErrorResponse — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `ErrorResponse` |
| Classifier kind | Class |
| Package / subsystem | `Application Contracts (Go)` |
| DCD alias | `DTOErrorResponse` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`ErrorResponse` is a class in the `Application Contracts (Go)` package/subsystem of the design class diagram.

Common HTTP error response contract carrying code, message, request identifier, field details, and retry information.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `code` | `string` | Public | Instance | — | Machine-readable error code. |
| `message` | `string` | Public | Instance | — | Human-readable error message. |
| `requestID` | `string` | Public | Instance | — | Request correlation identifier. |
| `details` | `map[string]string` | Public | Instance | — | Field-level error details. |
| `retryAfter` | `int` | Public | Instance | — | Retry delay in seconds. |

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
