# AuthProvider — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `AuthProvider` |
| Classifier kind | Class |
| Package / subsystem | `React SPA (TypeScript)` |
| DCD alias | `UIAuthProvider` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`AuthProvider` is a class in the `React SPA (TypeScript)` package/subsystem of the design class diagram.

React authentication context that stores the session and coordinates login, registration, logout, and restore flows.

- Declared outgoing design relationships: `AccountApi`, `AuthState`.
- Declared incoming design relationships: `AppShell`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `state` | `AuthState` | Public | Instance | — | Current authentication presentation state. |

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `login(identifier: string, password: string)` | `Promise<void>` | Public | Instance | Calls `AccountApi.login`, stores a successful `LoginResponse` through `storeAuthenticationResult`, and leaves `state` unauthenticated when the call fails. |
| `register(req: RegisterRequest)` | `Promise<void>` | Public | Instance | Calls `AccountApi.register`; success returns without creating a session, and validation or duplicate-account failures propagate to the caller. |
| `logout()` | `void` | Public | Instance | Clears the session through `clearAuthenticationInformation` and leaves the shell in the guest state. |
| `storeAuthenticationResult(res: LoginResponse)` | `void` | Public | Instance | Writes `token`, `principal`, and `isAuthenticated` into `AuthState` from the login response so later API calls can use the token. |
| `clearAuthenticationInformation()` | `void` | Public | Instance | Resets the `AuthState` token and principal and marks the session unauthenticated. |
| `restoreAuthentication()` | `void` | Public | Instance | Rebuilds `AuthState` from persisted browser session information and marks the session authenticated only when a usable principal and token are present. |

## 4. Parameter design

### `login(identifier: string, password: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `identifier` | `string` | — | in | Username or e-mail used to log in. |
| `password` | `string` | — | in | Password supplied by the user. |

### `register(req: RegisterRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `req` | `RegisterRequest` | — | in | Registration data submitted by the user. |

### `logout()`

This operation has no parameters.

### `storeAuthenticationResult(res: LoginResponse)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `res` | `LoginResponse` | — | in | Successful login response containing the token and account view. |

### `clearAuthenticationInformation()`

This operation has no parameters.

### `restoreAuthentication()`

This operation has no parameters.

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-VAL-001` | Invalid data for the requested operation. | Validation fails before persistence and the caller receives the field-level error. | [SD-UC-G-01-RegisterAccount](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-01-RegisterAccount.md) |
| `ERR-ACC-002` | Account identifier (username or email) already exists. | The registration or profile update is rejected; no duplicate account is created. | [SD-UC-G-01-RegisterAccount](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-01-RegisterAccount.md) |
| `ERR-AUTH-001` | Invalid credentials. | The caller receives an authentication error; no token is issued. | [SD-UC-G-02-Login](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-02-Login.md) |
| `ERR-ACC-001` | Account is unavailable, disabled, locked, or otherwise not allowed to log in. | The operation is rejected without exposing account details. | [SD-UC-G-02-Login](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-02-Login.md) |
| `ERR-NET-001` | Network error or interrupted request/response. | The UI cannot confirm the outcome and informs the user rather than assuming success. | [SD-UC-G-01-RegisterAccount](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-01-RegisterAccount.md) |
| `ERR-SYS-007` | Browser storage unavailable or worker terminated before acknowledgement. | The session or worker recovers conservatively; work is not acknowledged without a committed result. | [SD-UC-U-A-01-LogOut](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-01-LogOut.md) |

## 6. Method

### `login(identifier: string, password: string)`

Calls `AccountApi.login`, stores a successful `LoginResponse` through `storeAuthenticationResult`, and leaves `state` unauthenticated when the call fails. It uses `identifier`, `password`. It returns `Promise<void>`.

### `register(req: RegisterRequest)`

Calls `AccountApi.register`; success returns without creating a session, and validation or duplicate-account failures propagate to the caller. It uses `req`. It returns `Promise<void>`.

### `logout()`

Clears the session through `clearAuthenticationInformation` and leaves the shell in the guest state. It has no parameters. No value is returned.

### `storeAuthenticationResult(res: LoginResponse)`

Writes `token`, `principal`, and `isAuthenticated` into `AuthState` from the login response so later API calls can use the token. It uses `res`. It reads the declared attribute(s) `state`. No value is returned.

### `clearAuthenticationInformation()`

Resets the `AuthState` token and principal and marks the session unauthenticated. It has no parameters. It reads the declared attribute(s) `state`. No value is returned.

### `restoreAuthentication()`

Rebuilds `AuthState` from persisted browser session information and marks the session authenticated only when a usable principal and token are present. It has no parameters. It reads the declared attribute(s) `state`. No value is returned.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
