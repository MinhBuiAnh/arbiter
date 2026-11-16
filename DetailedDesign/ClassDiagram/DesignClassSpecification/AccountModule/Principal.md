# Principal — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `Principal` |
| Classifier kind | Class |
| Package / subsystem | `Account Module (Go)` |
| DCD alias | `ACCPrincipal` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`Principal` is a class in the `Account Module (Go)` package/subsystem of the design class diagram.

Authenticated caller identity and role used by application services.

- Declared incoming design relationships: `AuthService`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `UserID` | `AccountID` | Public | Instance | — | Authenticated account identifier. |
| `Role` | `Role` | Public | Instance | — | Authenticated account role. |
| `IssuedAt` | `time.Time` | Public | Instance | — | Token issue timestamp. |
| `ExpiresAt` | `time.Time` | Public | Instance | — | Token expiry timestamp. |

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
