# OutboxPostgresStore — Subsystem Element Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Subsystem element specification |
| Element | `OutboxPostgresStore` |
| Owning subsystem | Persistence Subsystem (Go) |
| Classifier kind | Class |
| Realized interface | [OutboxStore](../../../../../ClassDiagram/DesignClassSpecification/OutboxModule/OutboxStore.md) |
| Interface-facing specification | [OutboxPostgresStore](../../../SubsystemInterfaceDesign/PersistenceSubsystem/OutboxPostgresStore.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-19 |

## 1. Identification

`OutboxPostgresStore` realizes `OutboxStore` for transactional outbox event reads and publication markers.

## 2. Attribute Design

| Name | Data type | Visibility | Scope | Default value | Description |
|---|---|---|---|---|---|
| `db` | `PostgresDB` | Private | Instance | — | Pooled SQL database used for outbox queries and updates. |

## 3. Operation Design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|---|---|---|---|---|
| `FindUnpublishedEvents(ctx: context.Context, limit: int)` | `([]OutboxEvent, error)` | Public | Instance | Returns oldest unpublished events. |
| `MarkEventPublished(ctx: context.Context, eventID: EventID)` | `error` | Public | Instance | Marks one event published after Redis enqueue succeeds. |

## 4. Parameter Design

| Operation | Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|---|
| `FindUnpublishedEvents` | `limit` | `int` | — | in | Maximum pending events. |
| `MarkEventPublished` | `eventID` | `EventID` | — | in | Event to mark published. |

Both operations receive `ctx: context.Context` as their first in parameter.

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-SYS-003` | PostgreSQL query or update failure. | Return an error and leave the event unpublished. | [SD-PERS-Outbox](../Diagram/SD-PERS-Outbox.md) |
| Not found/event already published | Mark predicate affects zero rows. | Return a conflict/not-found result so dispatcher does not assume success. | [SD-PERS-Outbox](../Diagram/SD-PERS-Outbox.md) |

## 6. Method

`FindUnpublishedEvents` validates the positive limit and selects rows with `published_at IS NULL` ordered by `created_at`, `id`. It maps only event identifiers and timestamps.

`MarkEventPublished` updates `published_at` with `WHERE id = $1 AND published_at IS NULL`. Zero affected rows is not success. The update occurs only after the OutboxDispatcher receives success from the message queue.

## 7. Other Diagrams

- [Outbox persistence family](../Diagram/SD-PERS-Outbox.md)
