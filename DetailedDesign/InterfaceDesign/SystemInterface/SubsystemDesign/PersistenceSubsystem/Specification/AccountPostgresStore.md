# AccountPostgresStore — Subsystem Element Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Subsystem element specification |
| Element | `AccountPostgresStore` |
| Owning subsystem | Persistence Subsystem (Go) |
| Classifier kind | Class |
| Realized interface | [AccountStore](../../../../../ClassDiagram/DesignClassSpecification/AccountModule/AccountStore.md) |
| Interface-facing specification | [AccountPostgresStore](../../../SubsystemInterfaceDesign/PersistenceSubsystem/AccountPostgresStore.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-19 |

## 1. Identification

`AccountPostgresStore` is the PostgreSQL adapter for `AccountStore`. It maps account rows and projections to domain objects and provides atomic account writes and optimistic status updates.

## 2. Attribute Design

| Name | Data type | Visibility | Scope | Default value | Description |
|---|---|---|---|---|---|
| `db` | `PostgresDB` | Private | Instance | — | Pooled SQL database used for queries and transactions. |

## 3. Operation Design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|---|---|---|---|---|
| `FindAccount(ctx: context.Context, id: AccountID)` | `(*Account, error)` | Public | Instance | Loads one account aggregate. |
| `FindAccountByIdentifier(ctx: context.Context, identifier: string)` | `(*Account, error)` | Public | Instance | Loads by username or exact e-mail identifier. |
| `AccountExists(ctx: context.Context, username: string, email: string)` | `(bool, error)` | Public | Instance | Checks username/e-mail uniqueness. |
| `SaveAccount(ctx: context.Context, account: *Account)` | `error` | Public | Instance | Inserts or updates account data. |
| `ReadAccountStatus(ctx: context.Context, id: AccountID)` | `(AccountStatus, error)` | Public | Instance | Reads the account status. |
| `UpdateAccountStatus(ctx: context.Context, id: AccountID, expectedVersion: int, status: AccountStatus, actor: AccountID)` | `error` | Public | Instance | Performs a version-checked status change. |
| `QueryAccounts(ctx: context.Context, filter: AccountFilter, page: PageQuery)` | `(PageResult[AccountSummary], error)` | Public | Instance | Queries administrator account summaries. |
| `ReadAccountDetails(ctx: context.Context, id: AccountID)` | `(*AccountDetails, error)` | Public | Instance | Reads administrator account details. |
| `ReadCommittedProfile(ctx: context.Context, id: AccountID)` | `(*AccountProfile, error)` | Public | Instance | Reads committed profile fields. |

## 4. Parameter Design

Each operation uses `ctx` as an in direction `context.Context` parameter and the operation-specific parameters below.

| Operation | Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|---|
| `FindAccount` | `id` | `AccountID` | — | in | Target account identifier. |
| `FindAccountByIdentifier` | `identifier` | `string` | — | in | Username or e-mail to match. |
| `AccountExists` | `username` | `string` | — | in | Username candidate. |
| `AccountExists` | `email` | `string` | — | in | E-mail candidate. |
| `SaveAccount` | `account` | `*Account` | — | in | Account aggregate to persist. |
| `ReadAccountStatus` | `id` | `AccountID` | — | in | Target account identifier. |
| `UpdateAccountStatus` | `id` | `AccountID` | — | in | Target account identifier. |
| `UpdateAccountStatus` | `expectedVersion` | `int` | — | in | Expected optimistic-concurrency version. |
| `UpdateAccountStatus` | `status` | `AccountStatus` | — | in | New account status. |
| `UpdateAccountStatus` | `actor` | `AccountID` | — | in | Account performing the status action. |
| `QueryAccounts` | `filter` | `AccountFilter` | — | in | Search and status filters. |
| `QueryAccounts` | `page` | `PageQuery` | — | in | Pagination and sorting. |
| `ReadAccountDetails` | `id` | `AccountID` | — | in | Target account identifier. |
| `ReadCommittedProfile` | `id` | `AccountID` | — | in | Target account identifier. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-SYS-003` | PostgreSQL connection, query, scan, or transaction failure. | Roll back and return no partial account data. | [SD-PERS-Account](../Diagram/SD-PERS-Account.md) |
| Not found | No account row matches. | Return the adapter not-found result. | [SD-PERS-Account](../Diagram/SD-PERS-Account.md) |
| Optimistic conflict | Status update affects zero rows because the version changed. | Return a conflict result. | [SD-PERS-Account](../Diagram/SD-PERS-Account.md) |
| Constraint violation | Username/e-mail uniqueness or check constraint fails. | Map to validation/conflict behavior without SQL details. | [SD-PERS-Account](../Diagram/SD-PERS-Account.md) |

## 6. Method

`FindAccount`, `FindAccountByIdentifier`, `ReadAccountStatus`, `ReadAccountDetails`, and `ReadCommittedProfile` execute bounded primary/projection queries and map committed rows only. No credential hash or sensitive column is exposed in public projections.

`AccountExists` checks username and e-mail in one query and returns only a boolean. `SaveAccount` inserts or updates the account row, preserving credential metadata and profile fields. Account registration uniqueness and status updates use transactions where required.

`UpdateAccountStatus` executes an `UPDATE ... WHERE id = $1 AND version = $2` predicate, increments the version, records status-change metadata and actor, and commits once. Zero affected rows map to optimistic conflict.

`QueryAccounts` applies safe filter predicates, stable ordering, and bounded pagination, then maps summaries only. Unexpected scan or database errors return `ERR-SYS-003`.

## 7. Other Diagrams

- [Account persistence family](../Diagram/SD-PERS-Account.md)
