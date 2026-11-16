# Account — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `Account` |
| Classifier kind | Class |
| Package / subsystem | `Account Module (Go)` |
| DCD alias | `ACCAccount` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`Account` is a class in the `Account Module (Go)` package/subsystem of the design class diagram.

Account aggregate root holding identity, profile, role, status, credential metadata, and version.

- Declared incoming design relationships: `AuthService`, `AccountService`, `AdminUserService`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `ID` | `AccountID` | Public | Instance | — | Unique account identifier. |
| `Username` | `string` | Public | Instance | — | Unique login name; the account is searchable by it. |
| `Email` | `string` | Public | Instance | — | Unique e-mail address used for login and notifications. |
| `DisplayName` | `string` | Public | Instance | — | Profile name shown to users. |
| `Bio` | `string` | Public | Instance | — | Optional profile biography. |
| `Role` | `Role` | Public | Instance | — | Authorization role (`USER` or `ADMINISTRATOR`). |
| `Status` | `AccountStatus` | Public | Instance | — | Account availability (`ACTIVE` or `LOCKED`). |
| `CreatedAt` | `time.Time` | Public | Instance | — | Creation timestamp. |
| `StatusChangedAt` | `time.Time` | Public | Instance | — | Timestamp of the last status change. |
| `StatusChangedBy` | `AccountID` | Public | Instance | — | Identifier of the account that performed the last status change. |
| `CredentialChangedAt` | `time.Time` | Public | Instance | — | Timestamp of the last credential change. |
| `Version` | `int` | Public | Instance | — | Optimistic-concurrency version for profile and status updates. |
| `credentialHash` | `string` | Private | Instance | — | Package-private password hash; never exposed by an API response. |

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `CanLogin()` | `bool` | Public | Instance | Derives whether the account may log in from `Status`. |
| `VerifyCredential(plain: string)` | `bool` | Public | Instance | Checks `plain` against the stored `credentialHash` without exposing or changing the hash. |
| `ChangeStatus(next: AccountStatus, actor: AccountID)` | `error` | Public | Instance | Sets `Status` to `next` and records `actor` in `StatusChangedBy`; the timestamp source is not specified by the DCD. |
| `UpdateProfile(displayName: string, bio: string, email: string)` | `error` | Public | Instance | Replaces `DisplayName`, `Bio`, and `Email` with the supplied values after the caller has validated them. |
| `RecordCredentialChange(now: time.Time)` | `error` | Public | Instance | Sets `CredentialChangedAt` to `now`. |

## 4. Parameter design

### `CanLogin()`

This operation has no parameters.

### `VerifyCredential(plain: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `plain` | `string` | — | in | Supplies the plain credential value. |

### `ChangeStatus(next: AccountStatus, actor: AccountID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `next` | `AccountStatus` | — | in | Target account status. |
| `actor` | `AccountID` | — | in | Account that performs the status change. |

### `UpdateProfile(displayName: string, bio: string, email: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `displayName` | `string` | — | in | Replacement display name. |
| `bio` | `string` | — | in | Replacement biography. |
| `email` | `string` | — | in | Replacement e-mail address. |

### `RecordCredentialChange(now: time.Time)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `now` | `time.Time` | — | in | Supplies the timestamp recorded by the operation. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-VAL-001` | Invalid data for the requested operation. | Validation fails before persistence and the caller receives the field-level error. | [SD-UC-AD-U-03-ManageUserStatus](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-03-ManageUserStatus.md) |
| `ERR-VAL-012` | Invalid account information. | The profile update is rejected before persistence. | [SD-UC-U-A-03-UpdateAccountInformation](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-03-UpdateAccountInformation.md) |
| `ERR-ACC-002` | Account identifier (username or email) already exists. | The registration or profile update is rejected; no duplicate account is created. | [SD-UC-U-A-03-UpdateAccountInformation](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-03-UpdateAccountInformation.md) |
| `ERR-CONFLICT-010` | Concurrent user-status change. | The status change is rejected; the caller reloads the account. | [SD-UC-AD-U-03-ManageUserStatus](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-03-ManageUserStatus.md) |
| `ERR-CONFLICT-011` | Administrator targets their own account. | The status change is rejected to prevent self-lockout. | [SD-UC-AD-U-03-ManageUserStatus](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/UserManagement/SD-UC-AD-U-03-ManageUserStatus.md) |

## 6. Method

### `CanLogin()`

Derives whether the account may log in from `Status`. It has no parameters. It reads the declared attribute(s) `Status`. It returns `bool`.

### `VerifyCredential(plain: string)`

Checks `plain` against the stored `credentialHash` without exposing or changing the hash. It uses `plain`. It reads the declared attribute(s) `credentialHash`. It returns `bool`.

### `ChangeStatus(next: AccountStatus, actor: AccountID)`

Sets `Status` to `next` and records `actor` in `StatusChangedBy`; the timestamp source is not specified by the DCD. It uses `next`, `actor`. It updates the declared attribute(s) `Status`, `StatusChangedBy`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `UpdateProfile(displayName: string, bio: string, email: string)`

Replaces `DisplayName`, `Bio`, and `Email` with the supplied values after the caller has validated them. It uses `displayName`, `bio`, `email`. It updates the declared attribute(s) `DisplayName`, `Bio`, `Email`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `RecordCredentialChange(now: time.Time)`

Sets `CredentialChangedAt` to `now`. It uses `now`. It updates the declared attribute(s) `CredentialChangedAt`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
