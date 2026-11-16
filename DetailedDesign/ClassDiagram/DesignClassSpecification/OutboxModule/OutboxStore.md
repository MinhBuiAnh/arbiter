# OutboxStore — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `OutboxStore` |
| Classifier kind | Interface |
| Package / subsystem | `Outbox Module (Go)` |
| DCD alias | `OUTOutboxStore` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`OutboxStore` is an interface in the `Outbox Module (Go)` package/subsystem of the design class diagram.

Persistence port for unpublished outbox events.

- Declared incoming design relationships: `OutboxDispatcher`, `OutboxPostgresStore`.
- Realized by: `OutboxPostgresStore`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `FindUnpublishedEvents(ctx: context.Context, limit: int)` | `([]OutboxEvent, error)` | Public | Instance | Returns up to `limit` events whose `PublishedAt` is nil. |
| `MarkEventPublished(ctx: context.Context, eventID: EventID)` | `error` | Public | Instance | Sets the publication timestamp for the event. |

## 4. Parameter design

### `FindUnpublishedEvents(ctx: context.Context, limit: int)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `limit` | `int` | — | in | Maximum number of pending events to return. |

### `MarkEventPublished(ctx: context.Context, eventID: EventID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `eventID` | `EventID` | — | in | Identifies the target outbox event. |

## 5. Exception

None identified in the referenced sequence diagrams.

## 6. Method

### `FindUnpublishedEvents(ctx: context.Context, limit: int)`

Returns up to `limit` events whose `PublishedAt` is nil. It is implemented by `OutboxPostgresStore`. It is called by `OutboxDispatcher`. It uses `ctx`, `limit`. It returns `([]OutboxEvent, error)`. Failures are returned through the declared error result rather than as a successful value.

### `MarkEventPublished(ctx: context.Context, eventID: EventID)`

Sets the publication timestamp for the event. It is implemented by `OutboxPostgresStore`. It is called by `OutboxDispatcher`. It uses `ctx`, `eventID`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
