# RateLimiter — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `RateLimiter` |
| Classifier kind | Class |
| Package / subsystem | `HTTP API (Go)` |
| DCD alias | `APIRateLimiter` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`RateLimiter` is a class in the `HTTP API (Go)` package/subsystem of the design class diagram.

HTTP-boundary rate limiter that admits or rejects a request key.

- Declared incoming design relationships: `Router`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `Allow(key string)` | `(bool, time.Duration)` | Public | Instance | Evaluates `key` against the configured rate-limit policy and returns whether the request may proceed plus the retry delay when it may not. |

## 4. Parameter design

### `Allow(key string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `key` | `string` | — | in | Rate-limit key, usually derived from the caller or route. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-LIMIT-001` | Rate limit exceeded. | The request is rejected with retry information; no state is changed. | [SD-UC-COM-01-BrowseProblems](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-COM-01-BrowseProblems.md) |

## 6. Method

### `Allow(key string)`

Evaluates `key` against the configured rate-limit policy and returns whether the request may proceed plus the retry delay when it may not. It uses `key`. It returns `(bool, time.Duration)`.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
