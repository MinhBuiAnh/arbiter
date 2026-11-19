# AccountPostgresStore — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `AccountPostgresStore` |
| Classifier kind | Class |
| Package / subsystem | `Persistence Subsystem (Go)` |
| DCD alias | `PSAccountStore` |
| Design class diagram | [DesignClassDiagram.md](../../../../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../../../ClassDiagram/Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`AccountPostgresStore` is a class in the `Persistence Subsystem (Go)` package/subsystem of the design class diagram.

PostgreSQL adapter that realizes `AccountStore`.

- Declared outgoing design relationships: `AccountStore`.
- Realizes: `AccountStore`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|---|---|---|---|---|---|
| `db` | `PostgresDB` | Private | Instance | — | Pooled PostgreSQL database used for account queries and transactions. |

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|---|---|---|---|---|
| `FindAccount(ctx: context.Context, id: AccountID)` | `(*Account, error)` | Public | Instance | Loads an account aggregate. |
| `FindAccountByIdentifier(ctx: context.Context, identifier: string)` | `(*Account, error)` | Public | Instance | Loads by username or e-mail. |
| `AccountExists(ctx: context.Context, username: string, email: string)` | `(bool, error)` | Public | Instance | Checks identifier uniqueness. |
| `SaveAccount(ctx: context.Context, account: *Account)` | `error` | Public | Instance | Inserts or updates account data. |
| `ReadAccountStatus(ctx: context.Context, id: AccountID)` | `(AccountStatus, error)` | Public | Instance | Reads account status. |
| `UpdateAccountStatus(ctx: context.Context, id: AccountID, expectedVersion: int, status: AccountStatus, actor: AccountID)` | `error` | Public | Instance | Performs a version-checked status update. |
| `QueryAccounts(ctx: context.Context, filter: AccountFilter, page: PageQuery)` | `(PageResult[AccountSummary], error)` | Public | Instance | Queries account summaries. |
| `ReadAccountDetails(ctx: context.Context, id: AccountID)` | `(*AccountDetails, error)` | Public | Instance | Reads administrator details. |
| `ReadCommittedProfile(ctx: context.Context, id: AccountID)` | `(*AccountProfile, error)` | Public | Instance | Reads committed profile fields. |

## 4. Parameter design

| Operation | Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| All operations | `ctx` | `context.Context` | — | in | Cancellation and deadline. |
| `FindAccount`, `ReadAccountStatus`, `ReadAccountDetails`, `ReadCommittedProfile` | `id` | `AccountID` | — | in | Target account. |
| `FindAccountByIdentifier` | `identifier` | `string` | — | in | Username or e-mail. |
| `AccountExists` | `username`, `email` | `string` | — | in | Identifier candidates. |
| `SaveAccount` | `account` | `*Account` | — | in | Account aggregate. |
| `UpdateAccountStatus` | `id`, `expectedVersion`, `status`, `actor` | Mixed | — | in | Target, version, status, and actor. |
| `QueryAccounts` | `filter`, `page` | `AccountFilter`, `PageQuery` | — | in | Filters and pagination. |

## 5. Exception

See [SD-PERS-Account](../../SubsystemDesign/PersistenceSubsystem/Diagram/SD-PERS-Account.md) for `ERR-SYS-003`, not-found, conflict, and constraint paths.

## 6. Method

Executes account queries and mutations through `db`, maps only committed account rows, and rolls back transaction failures. Status updates use the expected version in the SQL predicate. See [AccountPostgresStore](../../SubsystemDesign/PersistenceSubsystem/Specification/AccountPostgresStore.md).

## 7. Other diagrams

[SD-PERS-Account](../../SubsystemDesign/PersistenceSubsystem/Diagram/SD-PERS-Account.md)
