# HttpClient — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `HttpClient` |
| Classifier kind | Class |
| Package / subsystem | `React SPA (TypeScript)` |
| DCD alias | `UIHttpClient` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`HttpClient` is a class in the `React SPA (TypeScript)` package/subsystem of the design class diagram.

Typed browser HTTP client that attaches the access token, serializes requests, and parses responses.

- Declared incoming design relationships: `AccountApi`, `ProblemApi`, `TestCaseApi`, `SubmissionApi`, `ProgressApi`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `baseURL` | `string` | Private | Instance | — | Base URL prepended to every API path. |
| `token` | `string \| null` | Private | Instance | — | Current bearer token, or nil when unauthenticated. |

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `request<T>(method: string, path: string, body?: unknown)` | `Promise<T>` | Public | Instance | Builds a request from `baseURL`, `method`, `path`, and optional `body`, attaches `token` as a bearer credential, sends it, and decodes the typed response or error contract. |
| `setToken(token: string \| null)` | `void` | Public | Instance | Replaces `token` so subsequent requests use or omit the bearer credential. |

## 4. Parameter design

### `request<T>(method: string, path: string, body?: unknown)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `method` | `string` | — | in | HTTP method to use. |
| `path` | `string` | — | in | API path to request. |
| `body` | `unknown` | — | in | Optional serialized request body. |

### `setToken(token: string | null)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `token` | `string \| null` | — | in | Access token to use, or nil to clear it. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-AUTH-003` | Missing, invalid, or expired access token. | The request is rejected as unauthenticated and the client clears authentication state. | [SD-UC-U-A-02-ViewAccountInformation](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-02-ViewAccountInformation.md) |
| `ERR-NET-001` | Network error or interrupted request/response. | The UI cannot confirm the outcome and informs the user rather than assuming success. | [SD-UC-G-02-Login](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-02-Login.md) |
| `ERR-SYS-001` | Internal system, persistence, or assembly error. | The request fails with an internal error; transactions roll back where applicable. | [SD-UC-G-02-Login](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-02-Login.md) |

## 6. Method

### `request<T>(method: string, path: string, body?: unknown)`

Builds a request from `baseURL`, `method`, `path`, and optional `body`, attaches `token` as a bearer credential, sends it, and decodes the typed response or error contract. It uses `method`, `path`, `body`. It reads the declared attribute(s) `baseURL`, `token`. It returns `Promise<T>`.

### `setToken(token: string | null)`

Replaces `token` so subsequent requests use or omit the bearer credential. It uses `token`. It reads the declared attribute(s) `token`. No value is returned.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
