# AccountHandler — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `AccountHandler` |
| Classifier kind | Class |
| Package / subsystem | `HTTP API (Go)` |
| DCD alias | `APIAccountHandler` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`AccountHandler` is a class in the `HTTP API (Go)` package/subsystem of the design class diagram.

HTTP boundary handler for own-account and administrator user-management routes.

- Declared outgoing design relationships: `AccountService`, `AdminUserService`.
- Declared incoming design relationships: `Router`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `GetOwn(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `AccountService.GetOwnAccount`, and writes the mapped result or error response. |
| `UpdateOwn(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `AccountService.UpdateOwnAccount`, and writes the mapped result or error response. |
| `ChangePassword(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `AccountService.ChangePassword`, and writes the mapped result or error response. |
| `ListUsers(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `AdminUserService.ListUsers`, and writes the mapped result or error response. |
| `GetUserDetails(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `AdminUserService.GetUserDetails`, and writes the mapped result or error response. |
| `GetUserStatus(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `AdminUserService.GetUserDetails`, and writes the mapped result or error response. |
| `ChangeUserStatus(w http.ResponseWriter, r *http.Request)` | `void` | Public | Instance | Reads and validates the HTTP request, delegates to `AdminUserService.ChangeUserStatus`, and writes the mapped result or error response. |

## 4. Parameter design

### `GetOwn(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `UpdateOwn(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `ChangePassword(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `ListUsers(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `GetUserDetails(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `GetUserStatus(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

### `ChangeUserStatus(w http.ResponseWriter, r *http.Request)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `w` | `http.ResponseWriter` | — | in | Supplies the HTTP response writer. |
| `r` | `*http.Request` | — | in | Supplies the HTTP request. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-AUTH-003` | Missing, invalid, or expired access token. | The request is rejected as unauthenticated and the client clears authentication state. | [SD-UC-U-A-02-ViewAccountInformation](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-02-ViewAccountInformation.md) |
| `ERR-VAL-004` | Invalid search or filter parameters. | The query is rejected without reading or changing state. | [SD-UC-AD-U-01-ViewUserList](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-01-ViewUserList.md) |
| `ERR-VAL-005` | Invalid pagination parameters. | The query is rejected without reading or changing state. | [SD-UC-AD-U-01-ViewUserList](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-01-ViewUserList.md) |
| `ERR-VAL-011` | Invalid new password. | The password change is rejected before persistence. | [SD-UC-U-A-04-ChangePassword](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-04-ChangePassword.md) |
| `ERR-VAL-012` | Invalid account information. | The profile update is rejected before persistence. | [SD-UC-U-A-03-UpdateAccountInformation](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-03-UpdateAccountInformation.md) |
| `ERR-AUTH-004` | Incorrect current password. | The password change is rejected; the stored credential is unchanged. | [SD-UC-U-A-04-ChangePassword](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-04-ChangePassword.md) |
| `ERR-VAL-010` | New password matches the current password. | The password change is rejected. | [SD-UC-U-A-04-ChangePassword](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-04-ChangePassword.md) |
| `ERR-ACC-001` | Account is unavailable, disabled, locked, or otherwise not allowed to log in. | The operation is rejected without exposing account details. | [SD-UC-U-A-02-ViewAccountInformation](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-02-ViewAccountInformation.md) |
| `ERR-ACC-002` | Account identifier (username or email) already exists. | The registration or profile update is rejected; no duplicate account is created. | [SD-UC-U-A-03-UpdateAccountInformation](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-03-UpdateAccountInformation.md) |
| `ERR-PERM-002` | Insufficient privileges. | The administrator operation is rejected by authorization. | [SD-UC-AD-U-01-ViewUserList](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-01-ViewUserList.md) |
| `ERR-CONFLICT-010` | Concurrent user-status change. | The status change is rejected; the caller reloads the account. | [SD-UC-AD-U-03-ManageUserStatus](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-03-ManageUserStatus.md) |
| `ERR-CONFLICT-011` | Administrator targets their own account. | The status change is rejected to prevent self-lockout. | [SD-UC-AD-U-03-ManageUserStatus](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-03-ManageUserStatus.md) |
| `ERR-RES-004` | User not found. | The administrator operation is rejected. | [SD-UC-AD-U-02-ViewUserDetails](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-02-ViewUserDetails.md) |
| `ERR-LIMIT-001` | Rate limit exceeded. | The request is rejected with retry information; no state is changed. | [SD-UC-U-A-04-ChangePassword-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-04-ChangePassword-Exceptions.md) |
| `ERR-SYS-001` | Internal system, persistence, or assembly error. | The request fails with an internal error; transactions roll back where applicable. | [SD-UC-U-A-02-ViewAccountInformation](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-02-ViewAccountInformation.md) |

## 6. Method

### `GetOwn(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `AccountService.GetOwnAccount`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `UpdateOwn(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `AccountService.UpdateOwnAccount`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `ChangePassword(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `AccountService.ChangePassword`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `ListUsers(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `AdminUserService.ListUsers`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `GetUserDetails(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `AdminUserService.GetUserDetails`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `GetUserStatus(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `AdminUserService.GetUserDetails`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

### `ChangeUserStatus(w http.ResponseWriter, r *http.Request)`

Reads and validates the HTTP request, delegates to `AdminUserService.ChangeUserStatus`, and writes the mapped result or error response. It uses `w`, `r`. No value is returned.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
