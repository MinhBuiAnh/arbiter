# AuthState — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `AuthState` |
| Classifier kind | Class |
| Package / subsystem | `React SPA (TypeScript)` |
| DCD alias | `UIAuthState` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`AuthState` is a class in the `React SPA (TypeScript)` package/subsystem of the design class diagram.

TypeScript presentation state for the current token, principal, and authentication flag.

- Declared incoming design relationships: `AuthProvider`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `token` | `string \| null` | Public | Instance | — | Access token, or nil when unauthenticated. |
| `principal` | `AccountResponse \| null` | Public | Instance | — | Authenticated account view, or nil when unauthenticated. |
| `isAuthenticated` | `boolean` | Public | Instance | — | Whether a usable session is present. |

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
