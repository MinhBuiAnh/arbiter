# AuthMiddleware — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `AuthMiddleware` |
| Classifier kind | Class |
| Package / subsystem | `HTTP API (Go)` |
| DCD alias | `APIAuthMiddleware` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`AuthMiddleware` is a class in the `HTTP API (Go)` package/subsystem of the design class diagram.

HTTP middleware that authenticates bearer tokens and enforces administrator authorization.

- Declared outgoing design relationships: `AuthService`.
- Declared incoming design relationships: `Router`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `Authenticate(next http.Handler)` | `http.Handler` | Public | Instance | Extracts the bearer token, validates it through `AuthService.ValidateAccessToken`, stores the resulting principal in the request context, and invokes `next`; failures are rejected before the handler runs. |
| `AuthorizeAdministrator(next http.Handler)` | `http.Handler` | Public | Instance | Reads the authenticated principal, calls `AuthService.AuthorizeAdministrator`, and invokes `next` only when the role check succeeds. |

## 4. Parameter design

### `Authenticate(next http.Handler)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `next` | `http.Handler` | — | in | Next handler invoked after successful authentication. |

### `AuthorizeAdministrator(next http.Handler)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `next` | `http.Handler` | — | in | Next handler invoked after the administrator check. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-AUTH-003` | Missing, invalid, or expired access token. | The request is rejected as unauthenticated and the client clears authentication state. | [SD-UC-U-A-02-ViewAccountInformation](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-02-ViewAccountInformation.md) |
| `ERR-ACC-001` | Account is unavailable, disabled, locked, or otherwise not allowed to log in. | The operation is rejected without exposing account details. | [SD-UC-U-A-02-ViewAccountInformation](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-02-ViewAccountInformation.md) |
| `ERR-PERM-002` | Insufficient privileges. | The administrator operation is rejected by authorization. | [SD-UC-AD-P-01-CreateProblem](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/ProblemManagement/SD-UC-AD-P-01-CreateProblem.md) |

## 6. Method

### `Authenticate(next http.Handler)`

Extracts the bearer token, validates it through `AuthService.ValidateAccessToken`, stores the resulting principal in the request context, and invokes `next`; failures are rejected before the handler runs. It uses `next`. It returns `http.Handler`.

### `AuthorizeAdministrator(next http.Handler)`

Reads the authenticated principal, calls `AuthService.AuthorizeAdministrator`, and invokes `next` only when the role check succeeds. It uses `next`. It returns `http.Handler`.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
