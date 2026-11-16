# Router — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `Router` |
| Classifier kind | Class |
| Package / subsystem | `HTTP API (Go)` |
| DCD alias | `APIRouter` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`Router` is a class in the `HTTP API (Go)` package/subsystem of the design class diagram.

Go HTTP router that registers resource routes and composes authentication and rate-limiting middleware.

- Declared outgoing design relationships: `AuthMiddleware`, `RateLimiter`, `AuthHandler`, `AccountHandler`, `ProblemHandler`, `TestCaseHandler`, `SubmissionHandler`, `ProgressHandler`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `Handler()` | `http.Handler` | Public | Instance | Builds and returns the composed HTTP handler graph described by the declared middleware and handler relationships. |
| `registerRoutes()` | `void` | Private | Instance | Internal helper that registers every declared resource route and applies the authentication and rate-limiting middleware to the appropriate handler groups. |

## 4. Parameter design

### `Handler()`

This operation has no parameters.

### `registerRoutes()`

This operation has no parameters.

## 5. Exception

None identified in the referenced sequence diagrams.

## 6. Method

### `Handler()`

Builds and returns the composed HTTP handler graph described by the declared middleware and handler relationships. It has no parameters. It returns `http.Handler`.

### `registerRoutes()`

Registers every declared resource route and applies the authentication and rate-limiting middleware to the appropriate handler groups. It has no parameters. No value is returned.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
