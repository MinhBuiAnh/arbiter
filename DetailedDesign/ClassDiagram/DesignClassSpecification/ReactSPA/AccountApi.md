# AccountApi — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `AccountApi` |
| Classifier kind | Class |
| Package / subsystem | `React SPA (TypeScript)` |
| DCD alias | `UIAccountApi` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`AccountApi` is a class in the `React SPA (TypeScript)` package/subsystem of the design class diagram.

Typed client for registration, login, own-account, and administrator user-management endpoints.

- Declared outgoing design relationships: `HttpClient`.
- Declared incoming design relationships: `AuthProvider`, `AdminConsole`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `login(req: LoginRequest)` | `Promise<LoginResponse>` | Public | Instance | Issues the typed HTTP request for login through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `register(req: RegisterRequest)` | `Promise<void>` | Public | Instance | Issues the typed HTTP request for register through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `getAccount()` | `Promise<AccountResponse>` | Public | Instance | Issues the typed HTTP request for get Account through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `updateAccount(req: UpdateAccountRequest)` | `Promise<AccountResponse>` | Public | Instance | Issues the typed HTTP request for update Account through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `changePassword(req: ChangePasswordRequest)` | `Promise<void>` | Public | Instance | Issues the typed HTTP request for change Password through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `listUsers(query: PageQuery)` | `Promise<PageResult<AccountResponse>>` | Public | Instance | Issues the typed HTTP request for list Users through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `getUserDetails(id: string)` | `Promise<AccountResponse>` | Public | Instance | Issues the typed HTTP request for get User Details through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |
| `changeUserStatus(id: string, status: string, version: number)` | `Promise<AccountResponse>` | Public | Instance | Issues the typed HTTP request for change User Status through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. |

## 4. Parameter design

### `login(req: LoginRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `req` | `LoginRequest` | — | in | Supplies the request or command payload. |

### `register(req: RegisterRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `req` | `RegisterRequest` | — | in | Supplies the request or command payload. |

### `getAccount()`

This operation has no parameters.

### `updateAccount(req: UpdateAccountRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `req` | `UpdateAccountRequest` | — | in | Supplies the request or command payload. |

### `changePassword(req: ChangePasswordRequest)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `req` | `ChangePasswordRequest` | — | in | Supplies the request or command payload. |

### `listUsers(query: PageQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `query` | `PageQuery` | — | in | Supplies search, filter, and pagination criteria. |

### `getUserDetails(id: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `id` | `string` | — | in | Identifies the target object. |

### `changeUserStatus(id: string, status: string, version: number)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `id` | `string` | — | in | Identifies the target object. |
| `status` | `string` | — | in | Supplies the requested status value. |
| `version` | `number` | — | in | Supplies the optimistic-concurrency version checked by the operation. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-VAL-001` | Invalid data for the requested operation. | Validation fails before persistence and the caller receives the field-level error. | [SD-UC-G-01-RegisterAccount](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-01-RegisterAccount.md) |
| `ERR-VAL-003` | Invalid login input. | Login is rejected before credential verification. | [SD-UC-G-02-Login](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-02-Login.md) |
| `ERR-ACC-002` | Account identifier (username or email) already exists. | The registration or profile update is rejected; no duplicate account is created. | [SD-UC-G-01-RegisterAccount](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-01-RegisterAccount.md) |
| `ERR-AUTH-001` | Invalid credentials. | The caller receives an authentication error; no token is issued. | [SD-UC-G-02-Login](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-02-Login.md) |
| `ERR-ACC-001` | Account is unavailable, disabled, locked, or otherwise not allowed to log in. | The operation is rejected without exposing account details. | [SD-UC-G-02-Login](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-02-Login.md) |
| `ERR-AUTH-004` | Incorrect current password. | The password change is rejected; the stored credential is unchanged. | [SD-UC-U-A-04-ChangePassword](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-04-ChangePassword.md) |
| `ERR-VAL-010` | New password matches the current password. | The password change is rejected. | [SD-UC-U-A-04-ChangePassword](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-04-ChangePassword.md) |
| `ERR-VAL-011` | Invalid new password. | The password change is rejected before persistence. | [SD-UC-U-A-04-ChangePassword](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-04-ChangePassword.md) |
| `ERR-VAL-012` | Invalid account information. | The profile update is rejected before persistence. | [SD-UC-U-A-03-UpdateAccountInformation](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-03-UpdateAccountInformation.md) |
| `ERR-PERM-002` | Insufficient privileges. | The administrator operation is rejected by authorization. | [SD-UC-AD-U-01-ViewUserList](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-01-ViewUserList.md) |
| `ERR-CONFLICT-010` | Concurrent user-status change. | The status change is rejected; the caller reloads the account. | [SD-UC-AD-U-03-ManageUserStatus](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-03-ManageUserStatus.md) |
| `ERR-CONFLICT-011` | Administrator targets their own account. | The status change is rejected to prevent self-lockout. | [SD-UC-AD-U-03-ManageUserStatus](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-03-ManageUserStatus.md) |
| `ERR-RES-004` | User not found. | The administrator operation is rejected. | [SD-UC-AD-U-02-ViewUserDetails](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-02-ViewUserDetails.md) |
| `ERR-NET-001` | Network error or interrupted request/response. | The UI cannot confirm the outcome and informs the user rather than assuming success. | [SD-UC-G-01-RegisterAccount](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-01-RegisterAccount.md) |
| `ERR-LIMIT-001` | Rate limit exceeded. | The request is rejected with retry information; no state is changed. | [SD-UC-G-01-RegisterAccount](../../../../ArchitecturalDesign/SequenceDiagram/GuestCommon/SD-UC-G-01-RegisterAccount.md) |

## 6. Method

### `login(req: LoginRequest)`

Issues the typed HTTP request for login through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `req`. It returns `Promise<LoginResponse>`.

### `register(req: RegisterRequest)`

Issues the typed HTTP request for register through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `req`. It returns `Promise<void>`.

### `getAccount()`

Issues the typed HTTP request for get Account through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It has no parameters. It returns `Promise<AccountResponse>`.

### `updateAccount(req: UpdateAccountRequest)`

Issues the typed HTTP request for update Account through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `req`. It returns `Promise<AccountResponse>`.

### `changePassword(req: ChangePasswordRequest)`

Issues the typed HTTP request for change Password through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `req`. It returns `Promise<void>`.

### `listUsers(query: PageQuery)`

Issues the typed HTTP request for list Users through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `query`. It returns `Promise<PageResult<AccountResponse>>`.

### `getUserDetails(id: string)`

Issues the typed HTTP request for get User Details through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `id`. It returns `Promise<AccountResponse>`.

### `changeUserStatus(id: string, status: string, version: number)`

Issues the typed HTTP request for change User Status through `HttpClient` and returns the decoded response; transport and HTTP failures propagate to the caller. It uses `id`, `status`, `version`. It returns `Promise<AccountResponse>`.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
