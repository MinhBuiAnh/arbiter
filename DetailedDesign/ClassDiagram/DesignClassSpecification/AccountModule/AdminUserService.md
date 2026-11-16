# AdminUserService — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `AdminUserService` |
| Classifier kind | Class |
| Package / subsystem | `Account Module (Go)` |
| DCD alias | `ACCAdminUserService` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`AdminUserService` is a class in the `Account Module (Go)` package/subsystem of the design class diagram.

Application service for administrator user search, details, and account-status changes.

- Declared outgoing design relationships: `AccountStore`, `Account`, `AccountFilter`, `AccountDetails`.
- Declared incoming design relationships: `AccountHandler`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `ListUsers(ctx: context.Context, principal: Principal, filter: AccountFilter, page: PageQuery)` | `(PageResult[AccountSummary], error)` | Public | Instance | Authorizes the caller, validates pagination and filters, and queries accounts through `AccountStore.QueryAccounts`. |
| `GetUserDetails(ctx: context.Context, principal: Principal, userID: AccountID)` | `(*AccountDetails, error)` | Public | Instance | Authorizes the caller and reads the requested account details through `AccountStore.ReadAccountDetails`. |
| `ChangeUserStatus(ctx: context.Context, principal: Principal, userID: AccountID, status: AccountStatus, expectedVersion: int)` | `(*AccountResponse, error)` | Public | Instance | Authorizes the caller, validates the requested status, prevents self-lockout, compares the version, applies the change to the account, and saves it through `AccountStore.UpdateAccountStatus`. |
| `ValidateStatusAction(status: AccountStatus)` | `error` | Private | Instance | Internal helper that accepts only the account statuses declared by `AccountStatus`. |
| `PreventSelfStatusChange(actor: AccountID, target: AccountID)` | `error` | Private | Instance | Internal helper that rejects the change when `actor` and `target` are the same account. |
| `CompareStatusVersion(current: int, expected: int)` | `error` | Private | Instance | Internal helper that rejects the change when `current` and `expected` differ. |
| `ValidatePagination(page: PageQuery)` | `error` | Private | Instance | Internal helper that checks page number and page size bounds. |
| `ValidateSearchAndFilters(filter: AccountFilter)` | `error` | Private | Instance | Internal helper that checks the optional username, e-mail, role, and status filters for valid values and lengths. |
| `UpdateAccountStatus(ctx: context.Context, account: *Account, status: AccountStatus, actor: AccountID)` | `error` | Private | Instance | Internal helper that loads the account, applies `ChangeStatus`, and persists it with the expected version. |

## 4. Parameter design

### `ListUsers(ctx: context.Context, principal: Principal, filter: AccountFilter, page: PageQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `filter` | `AccountFilter` | — | in | Supplies optional filtering criteria. |
| `page` | `PageQuery` | — | in | Supplies pagination and sort criteria. |

### `GetUserDetails(ctx: context.Context, principal: Principal, userID: AccountID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `userID` | `AccountID` | — | in | Identifies the target account. |

### `ChangeUserStatus(ctx: context.Context, principal: Principal, userID: AccountID, status: AccountStatus, expectedVersion: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `userID` | `AccountID` | — | in | Identifies the target account. |
| `status` | `AccountStatus` | — | in | Requested account status. |
| `expectedVersion` | `int` | — | in | Version the client last observed. |

### `ValidateStatusAction(status: AccountStatus)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `status` | `AccountStatus` | — | in | Requested status value to validate. |

### `PreventSelfStatusChange(actor: AccountID, target: AccountID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `actor` | `AccountID` | — | in | Administrator performing the change. |
| `target` | `AccountID` | — | in | Account whose status would change. |

### `CompareStatusVersion(current: int, expected: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `current` | `int` | — | in | Current stored version. |
| `expected` | `int` | — | in | Version supplied by the client. |

### `ValidatePagination(page: PageQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `page` | `PageQuery` | — | in | Supplies pagination and sort criteria. |

### `ValidateSearchAndFilters(filter: AccountFilter)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `filter` | `AccountFilter` | — | in | Supplies optional filtering criteria. |

### `UpdateAccountStatus(ctx: context.Context, account: *Account, status: AccountStatus, actor: AccountID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `account` | `*Account` | — | in | Supplies the account used by the operation. |
| `status` | `AccountStatus` | — | in | Supplies the requested status value. |
| `actor` | `AccountID` | — | in | Administrator performing the status change. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-PERM-002` | Insufficient privileges. | The administrator operation is rejected by authorization. | [SD-UC-AD-U-01-ViewUserList](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-01-ViewUserList.md) |
| `ERR-VAL-004` | Invalid search or filter parameters. | The query is rejected without reading or changing state. | [SD-UC-AD-U-01-ViewUserList](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-01-ViewUserList.md) |
| `ERR-VAL-005` | Invalid pagination parameters. | The query is rejected without reading or changing state. | [SD-UC-AD-U-01-ViewUserList](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-01-ViewUserList.md) |
| `ERR-CONFLICT-010` | Concurrent user-status change. | The status change is rejected; the caller reloads the account. | [SD-UC-AD-U-03-ManageUserStatus](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-03-ManageUserStatus.md) |
| `ERR-CONFLICT-011` | Administrator targets their own account. | The status change is rejected to prevent self-lockout. | [SD-UC-AD-U-03-ManageUserStatus](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-03-ManageUserStatus.md) |
| `ERR-RES-004` | User not found. | The administrator operation is rejected. | [SD-UC-AD-U-02-ViewUserDetails](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-02-ViewUserDetails.md) |
| `ERR-SYS-001` | Internal system, persistence, or assembly error. | The request fails with an internal error; transactions roll back where applicable. | [SD-UC-AD-U-01-ViewUserList](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-01-ViewUserList.md) |

## 6. Method

### `ListUsers(ctx: context.Context, principal: Principal, filter: AccountFilter, page: PageQuery)`

Authorizes the caller, validates pagination and filters, and queries accounts through `AccountStore.QueryAccounts`. It uses `ctx`, `principal`, `filter`, `page`. It returns `(PageResult[AccountSummary], error)`. Failures are returned through the declared error result rather than as a successful value.

### `GetUserDetails(ctx: context.Context, principal: Principal, userID: AccountID)`

Authorizes the caller and reads the requested account details through `AccountStore.ReadAccountDetails`. It uses `ctx`, `principal`, `userID`. It returns `(*AccountDetails, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ChangeUserStatus(ctx: context.Context, principal: Principal, userID: AccountID, status: AccountStatus, expectedVersion: int)`

Authorizes the caller, validates the requested status, prevents self-lockout, compares the version, applies the change to the account, and saves it through `AccountStore.UpdateAccountStatus`. It uses `ctx`, `principal`, `userID`, `status`, `expectedVersion`. It returns `(*AccountResponse, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ValidateStatusAction(status: AccountStatus)`

Accepts only the account statuses declared by `AccountStatus`. It uses `status`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `PreventSelfStatusChange(actor: AccountID, target: AccountID)`

Rejects the change when `actor` and `target` are the same account. It uses `actor`, `target`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `CompareStatusVersion(current: int, expected: int)`

Rejects the change when `current` and `expected` differ. It uses `current`, `expected`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ValidatePagination(page: PageQuery)`

Checks page number and page size bounds. It uses `page`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ValidateSearchAndFilters(filter: AccountFilter)`

Checks the optional username, e-mail, role, and status filters for valid values and lengths. It uses `filter`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `UpdateAccountStatus(ctx: context.Context, account: *Account, status: AccountStatus, actor: AccountID)`

Loads the account, applies `ChangeStatus`, and persists it with the expected version. It uses `ctx`, `account`, `status`, `actor`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
