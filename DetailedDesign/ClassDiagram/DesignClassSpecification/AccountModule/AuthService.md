# AuthService — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `AuthService` |
| Classifier kind | Class |
| Package / subsystem | `Account Module (Go)` |
| DCD alias | `ACCAuthService` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`AuthService` is a class in the `Account Module (Go)` package/subsystem of the design class diagram.

Application service for registration, login, access-token validation, and administrator authorization.

- Declared outgoing design relationships: `AccountStore`, `CredentialVerifier`, `Account`, `Principal`.
- Declared incoming design relationships: `AuthMiddleware`, `AuthHandler`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `Register(ctx: context.Context, req: RegisterRequest)` | `(AccountID, error)` | Public | Instance | Validates the registration data, checks identifier availability, hashes the credential through `CredentialVerifier`, builds the `Account`, and saves it through `AccountStore`. |
| `Login(ctx: context.Context, req: LoginRequest)` | `(LoginResponse, error)` | Public | Instance | Finds the account by identifier, checks that it may log in, verifies the credential, and issues an access token for the account. |
| `ValidateAccessToken(ctx: context.Context, token: string)` | `(Principal, error)` | Public | Instance | Resolves the token to a `Principal` and rejects missing, invalid, or expired credentials. |
| `ResolvePrincipal(ctx: context.Context, token: string)` | `(Principal, error)` | Public | Instance | Resolves `token` to the caller identity and verifies that the referenced account is still eligible. |
| `AuthorizeAdministrator(ctx: context.Context, principal: Principal)` | `error` | Public | Instance | Checks that `principal` carries the administrator role and rejects any other role. |
| `CheckAccountActive(ctx: context.Context, userID: AccountID)` | `error` | Public | Instance | Loads the account through `AccountStore` and rejects it when `Account.CanLogin` is false. |
| `IssueAccessToken(ctx: context.Context, account: *Account)` | `(string, error)` | Public | Instance | Builds a `Principal` from the account and signs the access token; the signing and lifetime details are supplied by the security configuration. |
| `ValidateRegistrationData(req: RegisterRequest)` | `error` | Private | Instance | Internal helper that checks the required registration fields, password confirmation, and identifier formats before any store call. |
| `VerifyCredential(account: *Account, password: string)` | `error` | Private | Instance | Internal helper that delegates the stored-hash comparison to `CredentialVerifier.Verify`. |

## 4. Parameter design

### `Register(ctx: context.Context, req: RegisterRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `req` | `RegisterRequest` | — | in | Registration data containing username, e-mail, password, and confirmation. |

### `Login(ctx: context.Context, req: LoginRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `req` | `LoginRequest` | — | in | Login identifier and password. |

### `ValidateAccessToken(ctx: context.Context, token: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `token` | `string` | — | in | Bearer token to validate and resolve. |

### `ResolvePrincipal(ctx: context.Context, token: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `token` | `string` | — | in | Bearer token whose principal is resolved. |

### `AuthorizeAdministrator(ctx: context.Context, principal: Principal)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Authenticated caller whose role is checked. |

### `CheckAccountActive(ctx: context.Context, userID: AccountID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `userID` | `AccountID` | — | in | Account whose availability is checked. |

### `IssueAccessToken(ctx: context.Context, account: *Account)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `account` | `*Account` | — | in | Verified account for which a token is issued. |

### `ValidateRegistrationData(req: RegisterRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `req` | `RegisterRequest` | — | in | Registration data to validate before persistence. |

### `VerifyCredential(account: *Account, password: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `account` | `*Account` | — | in | Account whose stored credential is verified. |
| `password` | `string` | — | in | Plain password supplied by the caller. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-VAL-001` | Invalid data for the requested operation. | Validation fails before persistence and the caller receives the field-level error. | [SD-UC-G-01-RegisterAccount](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-01-RegisterAccount.md) |
| `ERR-VAL-003` | Invalid login input. | Login is rejected before credential verification. | [SD-UC-G-02-Login](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-02-Login.md) |
| `ERR-ACC-001` | Account is unavailable, disabled, locked, or otherwise not allowed to log in. | The operation is rejected without exposing account details. | [SD-UC-G-02-Login](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-02-Login.md) |
| `ERR-ACC-002` | Account identifier (username or email) already exists. | The registration or profile update is rejected; no duplicate account is created. | [SD-UC-G-01-RegisterAccount](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-01-RegisterAccount.md) |
| `ERR-AUTH-001` | Invalid credentials. | The caller receives an authentication error; no token is issued. | [SD-UC-G-02-Login](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-02-Login.md) |
| `ERR-AUTH-003` | Missing, invalid, or expired access token. | The request is rejected as unauthenticated and the client clears authentication state. | [SD-UC-U-A-02-ViewAccountInformation](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-02-ViewAccountInformation.md) |
| `ERR-PERM-002` | Insufficient privileges. | The administrator operation is rejected by authorization. | [SD-UC-AD-U-01-ViewUserList](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-01-ViewUserList.md) |
| `ERR-SYS-001` | Internal system, persistence, or assembly error. | The request fails with an internal error; transactions roll back where applicable. | [SD-UC-G-01-RegisterAccount](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-01-RegisterAccount.md) |

## 6. Method

### `Register(ctx: context.Context, req: RegisterRequest)`

Validates the registration data, checks identifier availability, hashes the credential through `CredentialVerifier`, builds the `Account`, and saves it through `AccountStore`. It uses `ctx`, `req`. It returns `(AccountID, error)`. Failures are returned through the declared error result rather than as a successful value.

### `Login(ctx: context.Context, req: LoginRequest)`

Finds the account by identifier, checks that it may log in, verifies the credential, and issues an access token for the account. It uses `ctx`, `req`. It returns `(LoginResponse, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ValidateAccessToken(ctx: context.Context, token: string)`

Resolves the token to a `Principal` and rejects missing, invalid, or expired credentials. It uses `ctx`, `token`. It returns `(Principal, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ResolvePrincipal(ctx: context.Context, token: string)`

Resolves `token` to the caller identity and verifies that the referenced account is still eligible. It uses `ctx`, `token`. It returns `(Principal, error)`. Failures are returned through the declared error result rather than as a successful value.

### `AuthorizeAdministrator(ctx: context.Context, principal: Principal)`

Checks that `principal` carries the administrator role and rejects any other role. It uses `ctx`, `principal`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `CheckAccountActive(ctx: context.Context, userID: AccountID)`

Loads the account through `AccountStore` and rejects it when `Account.CanLogin` is false. It uses `ctx`, `userID`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `IssueAccessToken(ctx: context.Context, account: *Account)`

Builds a `Principal` from the account and signs the access token; the signing and lifetime details are supplied by the security configuration. It uses `ctx`, `account`. It returns `(string, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ValidateRegistrationData(req: RegisterRequest)`

Checks the required registration fields, password confirmation, and identifier formats before any store call. It uses `req`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `VerifyCredential(account: *Account, password: string)`

Delegates the stored-hash comparison to `CredentialVerifier.Verify`. It uses `account`, `password`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
