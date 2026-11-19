# OutboxPostgresStore — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `OutboxPostgresStore` |
| Classifier kind | Class |
| Package / subsystem | `Persistence Subsystem (Go)` |
| DCD alias | `PSOutboxStore` |
| Design class diagram | [DesignClassDiagram.md](../../../../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../../../ClassDiagram/Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`OutboxPostgresStore` is a class in the `Persistence Subsystem (Go)` package/subsystem of the design class diagram.

PostgreSQL adapter that realizes `OutboxStore`.

- Declared outgoing design relationships: `OutboxStore`.
- Realizes: `OutboxStore`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|---|---|---|---|---|---|
| `db` | `PostgresDB` | Private | Instance | — | Pooled PostgreSQL database used for outbox operations. |

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|---|---|---|---|---|
| `FindUnpublishedEvents(ctx: context.Context, limit: int)` | `([]OutboxEvent, error)` | Public | Instance | Finds oldest unpublished events. |
| `MarkEventPublished(ctx: context.Context, eventID: EventID)` | `error` | Public | Instance | Marks an event published. |

## 4. Parameter design

All operations receive `ctx: context.Context`; `FindUnpublishedEvents` receives `limit` and `MarkEventPublished` receives `eventID`.

## 5. Exception

See [SD-PERS-Outbox](../../SubsystemDesign/PersistenceSubsystem/Diagram/SD-PERS-Outbox.md) for read/update and `ERR-SYS-003` paths.

## 6. Method

Uses `db` to scan unpublished events and mark only rows still unpublished. See [OutboxPostgresStore](../../SubsystemDesign/PersistenceSubsystem/Specification/OutboxPostgresStore.md).

## 7. Other diagrams

[SD-PERS-Outbox](../../SubsystemDesign/PersistenceSubsystem/Diagram/SD-PERS-Outbox.md)
