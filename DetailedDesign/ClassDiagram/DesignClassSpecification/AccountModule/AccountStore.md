# AccountStore — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `AccountStore` |
| Classifier kind | Interface |
| Package / subsystem | `Account Module (Go)` |
| DCD alias | `ACCAccountStore` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`AccountStore` is an interface in the `Account Module (Go)` package/subsystem of the design class diagram.

Persistence port for account lookup, status changes, and account read models.

- Declared outgoing design relationships: `AccountSummary`, `AccountDetails`, `AccountProfile`.
- Declared incoming design relationships: `AuthService`, `AccountService`, `AdminUserService`, `AccountPostgresStore`.
- Realized by: `AccountPostgresStore`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `FindAccount(ctx: context.Context, id: AccountID)` | `(*Account, error)` | Public | Instance | Loads the account with the supplied identifier and returns not-found when no row exists. |
| `FindAccountByIdentifier(ctx: context.Context, identifier: string)` | `(*Account, error)` | Public | Instance | Loads the account matching the username or e-mail identifier. |
| `AccountExists(ctx: context.Context, username: string, email: string)` | `(bool, error)` | Public | Instance | Reports whether either identifier already belongs to an account. |
| `SaveAccount(ctx: context.Context, account: *Account)` | `error` | Public | Instance | Inserts or updates the account record, including profile, role, status, and credential metadata. |
| `ReadAccountStatus(ctx: context.Context, id: AccountID)` | `(AccountStatus, error)` | Public | Instance | Reads only the stored account status for the identifier. |
| `UpdateAccountStatus(ctx: context.Context, id: AccountID, expectedVersion: int, status: AccountStatus, actor: AccountID)` | `error` | Public | Instance | Updates the status with an optimistic-concurrency check on `expectedVersion` and records the actor. |
| `QueryAccounts(ctx: context.Context, filter: AccountFilter, page: PageQuery)` | `(PageResult[AccountSummary], error)` | Public | Instance | Returns the account summaries matching the filter and page. |
| `ReadAccountDetails(ctx: context.Context, id: AccountID)` | `(*AccountDetails, error)` | Public | Instance | Returns the administrator account-details view for the identifier. |
| `ReadCommittedProfile(ctx: context.Context, id: AccountID)` | `(*AccountProfile, error)` | Public | Instance | Returns the committed profile fields for the identifier. |

## 4. Parameter design

### `FindAccount(ctx: context.Context, id: AccountID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `AccountID` | — | in | Identifies the target object. |

### `FindAccountByIdentifier(ctx: context.Context, identifier: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `identifier` | `string` | — | in | Username or e-mail used to locate the account. |

### `AccountExists(ctx: context.Context, username: string, email: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `username` | `string` | — | in | Username to check for an existing account. |
| `email` | `string` | — | in | Supplies the e-mail address. |

### `SaveAccount(ctx: context.Context, account: *Account)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `account` | `*Account` | — | in | Supplies the account used by the operation. |

### `ReadAccountStatus(ctx: context.Context, id: AccountID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `AccountID` | — | in | Identifies the target object. |

### `UpdateAccountStatus(ctx: context.Context, id: AccountID, expectedVersion: int, status: AccountStatus, actor: AccountID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `AccountID` | — | in | Identifies the target object. |
| `expectedVersion` | `int` | — | in | Supplies the optimistic-concurrency version checked by the operation. |
| `status` | `AccountStatus` | — | in | Supplies the requested status value. |
| `actor` | `AccountID` | — | in | Account that performs the status change. |

### `QueryAccounts(ctx: context.Context, filter: AccountFilter, page: PageQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `filter` | `AccountFilter` | — | in | Supplies optional filtering criteria. |
| `page` | `PageQuery` | — | in | Supplies pagination and sort criteria. |

### `ReadAccountDetails(ctx: context.Context, id: AccountID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `AccountID` | — | in | Identifies the target object. |

### `ReadCommittedProfile(ctx: context.Context, id: AccountID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `id` | `AccountID` | — | in | Identifies the target object. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-RES-004` | User not found. | The administrator operation is rejected. | [SD-UC-AD-U-02-ViewUserDetails](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-02-ViewUserDetails.md) |

## 6. Method

### `FindAccount(ctx: context.Context, id: AccountID)`

Loads the account with the supplied identifier and returns not-found when no row exists. It is implemented by `AccountPostgresStore`. It is called by `AuthService`, `AccountService`, `AdminUserService`. It uses `ctx`, `id`. It returns `(*Account, error)`. Failures are returned through the declared error result rather than as a successful value.

### `FindAccountByIdentifier(ctx: context.Context, identifier: string)`

Loads the account matching the username or e-mail identifier. It is implemented by `AccountPostgresStore`. It is called by `AuthService`, `AccountService`, `AdminUserService`. It uses `ctx`, `identifier`. It returns `(*Account, error)`. Failures are returned through the declared error result rather than as a successful value.

### `AccountExists(ctx: context.Context, username: string, email: string)`

Reports whether either identifier already belongs to an account. It is implemented by `AccountPostgresStore`. It is called by `AuthService`, `AccountService`, `AdminUserService`. It uses `ctx`, `username`, `email`. It returns `(bool, error)`. Failures are returned through the declared error result rather than as a successful value.

### `SaveAccount(ctx: context.Context, account: *Account)`

Inserts or updates the account record, including profile, role, status, and credential metadata. It is implemented by `AccountPostgresStore`. It is called by `AuthService`, `AccountService`, `AdminUserService`. It uses `ctx`, `account`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ReadAccountStatus(ctx: context.Context, id: AccountID)`

Reads only the stored account status for the identifier. It is implemented by `AccountPostgresStore`. It is called by `AuthService`, `AccountService`, `AdminUserService`. It uses `ctx`, `id`. It returns `(AccountStatus, error)`. Failures are returned through the declared error result rather than as a successful value.

### `UpdateAccountStatus(ctx: context.Context, id: AccountID, expectedVersion: int, status: AccountStatus, actor: AccountID)`

Updates the status with an optimistic-concurrency check on `expectedVersion` and records the actor. It is implemented by `AccountPostgresStore`. It is called by `AuthService`, `AccountService`, `AdminUserService`. It uses `ctx`, `id`, `expectedVersion`, `status`, `actor`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `QueryAccounts(ctx: context.Context, filter: AccountFilter, page: PageQuery)`

Returns the account summaries matching the filter and page. It is implemented by `AccountPostgresStore`. It is called by `AuthService`, `AccountService`, `AdminUserService`. It uses `ctx`, `filter`, `page`. It returns `(PageResult[AccountSummary], error)`. Failures are returned through the declared error result rather than as a successful value.

### `ReadAccountDetails(ctx: context.Context, id: AccountID)`

Returns the administrator account-details view for the identifier. It is implemented by `AccountPostgresStore`. It is called by `AuthService`, `AccountService`, `AdminUserService`. It uses `ctx`, `id`. It returns `(*AccountDetails, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ReadCommittedProfile(ctx: context.Context, id: AccountID)`

Returns the committed profile fields for the identifier. It is implemented by `AccountPostgresStore`. It is called by `AuthService`, `AccountService`, `AdminUserService`. It uses `ctx`, `id`. It returns `(*AccountProfile, error)`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
