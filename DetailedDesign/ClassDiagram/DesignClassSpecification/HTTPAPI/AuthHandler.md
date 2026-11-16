# AuthHandler — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `AuthHandler` |
| Classifier kind | Class |
| Package / subsystem | `HTTP API (Go)` |
| DCD alias | `APIAuthHandler` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`AuthHandler` is a class in the `HTTP API (Go)` package/subsystem of the design class diagram.

HTTP boundary handler for registration and login routes.

- Declared outgoing design relationships: `AuthService`.
- Declared incoming design relationships: `Router`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `Register(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `AuthService.Register`, and writes the mapped result or error response. |
| `Login(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `AuthService.Login`, and writes the mapped result or error response. |

## 4. Parameter design

### `Register(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | HTTP response writer for the registration result. |
| `r` | `*http.Request` | — | in | HTTP request carrying the registration payload. |

### `Login(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | HTTP response writer for the login result. |
| `r` | `*http.Request` | — | in | HTTP request carrying the login payload. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-VAL-001` | Invalid data for the requested operation. | Validation fails before persistence and the caller receives the field-level error. | [SD-UC-G-01-RegisterAccount](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-01-RegisterAccount.md) |
| `ERR-VAL-003` | Invalid login input. | Login is rejected before credential verification. | [SD-UC-G-02-Login](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-02-Login.md) |
| `ERR-ACC-001` | Account is unavailable, disabled, locked, or otherwise not allowed to log in. | The operation is rejected without exposing account details. | [SD-UC-G-02-Login](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-02-Login.md) |
| `ERR-ACC-002` | Account identifier (username or email) already exists. | The registration or profile update is rejected; no duplicate account is created. | [SD-UC-G-01-RegisterAccount](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-01-RegisterAccount.md) |
| `ERR-AUTH-001` | Invalid credentials. | The caller receives an authentication error; no token is issued. | [SD-UC-G-02-Login](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-02-Login.md) |
| `ERR-LIMIT-001` | Rate limit exceeded. | The request is rejected with retry information; no state is changed. | [SD-UC-G-01-RegisterAccount](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-01-RegisterAccount.md) |
| `ERR-SYS-001` | Internal system, persistence, or assembly error. | The request fails with an internal error; transactions roll back where applicable. | [SD-UC-G-01-RegisterAccount](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-01-RegisterAccount.md) |

## 6. Method

### `Register(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `AuthService.Register`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `Login(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `AuthService.Login`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
