# AccountService — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `AccountService` |
| Classifier kind | Class |
| Package / subsystem | `Account Module (Go)` |
| DCD alias | `ACCAccountService` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`AccountService` is a class in the `Account Module (Go)` package/subsystem of the design class diagram.

Application service for own-account profile and password operations.

- Declared outgoing design relationships: `AccountStore`, `Account`.
- Declared incoming design relationships: `AccountHandler`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `GetOwnAccount(ctx: context.Context, principal: Principal)` | `(*AccountResponse, error)` | Public | Instance | Loads the caller account through `AccountStore` and returns it through `RemoveSensitiveFields`. |
| `UpdateOwnAccount(ctx: context.Context, principal: Principal, req: UpdateAccountRequest)` | `(*AccountResponse, error)` | Public | Instance | Loads the caller account, validates the optional fields, checks e-mail availability when it changes, applies `UpdateProfile`, and saves the account. |
| `ChangePassword(ctx: context.Context, principal: Principal, req: ChangePasswordRequest)` | `error` | Public | Instance | Loads the caller account, validates the credential change, verifies the current credential, hashes the new value through `CredentialVerifier`, records the change time, and saves the account. |
| `ValidateAccountInformation(req: UpdateAccountRequest)` | `error` | Private | Instance | Internal helper that checks the optional profile fields for length and format without reading or writing the store. |
| `ValidateNewCredential(current: string, next: string, confirm: string)` | `error` | Private | Instance | Internal helper that checks that the current value is present, the new value satisfies the password policy, both new values match, and the new value differs from the current one. |
| `VerifyCurrentCredential(account: *Account, current: string)` | `error` | Private | Instance | Internal helper that delegates the current-password comparison to `Account.VerifyCredential` and rejects a mismatch. |
| `CheckEmailAvailability(ctx: context.Context, email: string, self: AccountID)` | `error` | Private | Instance | Internal helper that looks up the proposed e-mail and rejects it when another account already owns it. |
| `UpdateCredentialChangeTime(account: *Account)` | `void` | Private | Instance | Internal helper that delegates the timestamp update to `Account.RecordCredentialChange`; the service supplies the time value. |
| `SaveAccountChanges(ctx: context.Context, account: *Account)` | `error` | Private | Instance | Internal helper that persists the modified account through `AccountStore.SaveAccount`. |
| `RemoveSensitiveFields(account: *Account)` | `AccountResponse` | Private | Instance | Internal helper that maps the account to `AccountResponse` and omits the credential hash and other internal fields. |

## 4. Parameter design

### `GetOwnAccount(ctx: context.Context, principal: Principal)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |

### `UpdateOwnAccount(ctx: context.Context, principal: Principal, req: UpdateAccountRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `req` | `UpdateAccountRequest` | — | in | Optional profile fields to change. |

### `ChangePassword(ctx: context.Context, principal: Principal, req: ChangePasswordRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `req` | `ChangePasswordRequest` | — | in | Current, new, and confirmation credential values. |

### `ValidateAccountInformation(req: UpdateAccountRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `req` | `UpdateAccountRequest` | — | in | Supplies the request or command payload. |

### `ValidateNewCredential(current: string, next: string, confirm: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `current` | `string` | — | in | Current password value. |
| `next` | `string` | — | in | Proposed new password. |
| `confirm` | `string` | — | in | Confirmation value that must match the new password. |

### `VerifyCurrentCredential(account: *Account, current: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `account` | `*Account` | — | in | Supplies the account used by the operation. |
| `current` | `string` | — | in | Current password to verify against the account. |

### `CheckEmailAvailability(ctx: context.Context, email: string, self: AccountID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `email` | `string` | — | in | Proposed e-mail address. |
| `self` | `AccountID` | — | in | Account performing the change, excluded from the availability check. |

### `UpdateCredentialChangeTime(account: *Account)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `account` | `*Account` | — | in | Account whose credential-change timestamp is updated. |

### `SaveAccountChanges(ctx: context.Context, account: *Account)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `account` | `*Account` | — | in | Supplies the account used by the operation. |

### `RemoveSensitiveFields(account: *Account)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `account` | `*Account` | — | in | Supplies the account used by the operation. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-ACC-001` | Account is unavailable, disabled, locked, or otherwise not allowed to log in. | The operation is rejected without exposing account details. | [SD-UC-U-A-02-ViewAccountInformation](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-02-ViewAccountInformation.md) |
| `ERR-ACC-002` | Account identifier (username or email) already exists. | The registration or profile update is rejected; no duplicate account is created. | [SD-UC-U-A-03-UpdateAccountInformation](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-03-UpdateAccountInformation.md) |
| `ERR-VAL-011` | Invalid new password. | The password change is rejected before persistence. | [SD-UC-U-A-04-ChangePassword](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-04-ChangePassword.md) |
| `ERR-VAL-012` | Invalid account information. | The profile update is rejected before persistence. | [SD-UC-U-A-03-UpdateAccountInformation](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-03-UpdateAccountInformation.md) |
| `ERR-AUTH-004` | Incorrect current password. | The password change is rejected; the stored credential is unchanged. | [SD-UC-U-A-04-ChangePassword](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-04-ChangePassword.md) |
| `ERR-VAL-010` | New password matches the current password. | The password change is rejected. | [SD-UC-U-A-04-ChangePassword](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-04-ChangePassword.md) |
| `ERR-SYS-001` | Internal system, persistence, or assembly error. | The request fails with an internal error; transactions roll back where applicable. | [SD-UC-U-A-02-ViewAccountInformation](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-02-ViewAccountInformation.md) |

## 6. Method

### `GetOwnAccount(ctx: context.Context, principal: Principal)`

Loads the caller account through `AccountStore` and returns it through `RemoveSensitiveFields`. It uses `ctx`, `principal`. It returns `(*AccountResponse, error)`. Failures are returned through the declared error result rather than as a successful value.

### `UpdateOwnAccount(ctx: context.Context, principal: Principal, req: UpdateAccountRequest)`

Loads the caller account, validates the optional fields, checks e-mail availability when it changes, applies `UpdateProfile`, and saves the account. It uses `ctx`, `principal`, `req`. It returns `(*AccountResponse, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ChangePassword(ctx: context.Context, principal: Principal, req: ChangePasswordRequest)`

Loads the caller account, validates the credential change, verifies the current credential, hashes the new value through `CredentialVerifier`, records the change time, and saves the account. It uses `ctx`, `principal`, `req`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ValidateAccountInformation(req: UpdateAccountRequest)`

Checks the optional profile fields for length and format without reading or writing the store. It uses `req`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ValidateNewCredential(current: string, next: string, confirm: string)`

Checks that the current value is present, the new value satisfies the password policy, both new values match, and the new value differs from the current one. It uses `current`, `next`, `confirm`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `VerifyCurrentCredential(account: *Account, current: string)`

Delegates the current-password comparison to `Account.VerifyCredential` and rejects a mismatch. It uses `account`, `current`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `CheckEmailAvailability(ctx: context.Context, email: string, self: AccountID)`

Looks up the proposed e-mail and rejects it when another account already owns it. It uses `ctx`, `email`, `self`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `UpdateCredentialChangeTime(account: *Account)`

Delegates the timestamp update to `Account.RecordCredentialChange`; the service supplies the time value. It uses `account`. No value is returned.

### `SaveAccountChanges(ctx: context.Context, account: *Account)`

Persists the modified account through `AccountStore.SaveAccount`. It uses `ctx`, `account`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `RemoveSensitiveFields(account: *Account)`

Maps the account to `AccountResponse` and omits the credential hash and other internal fields. It uses `account`. It returns `AccountResponse`.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
