# OutboxEvent — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `OutboxEvent` |
| Classifier kind | Class |
| Package / subsystem | `Outbox Module (Go)` |
| DCD alias | `OUTOutboxEvent` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`OutboxEvent` is a class in the `Outbox Module (Go)` package/subsystem of the design class diagram.

Durable outbox record for a submission event awaiting publication.

- Declared incoming design relationships: `SubmissionCommandService`, `SubmissionStore`, `OutboxDispatcher`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `ID` | `EventID` | Public | Instance | — | Unique identifier for the record. |
| `SubmissionID` | `SubmissionID` | Public | Instance | — | Submission whose acceptance produced this event. |
| `CreatedAt` | `time.Time` | Public | Instance | — | Creation timestamp used to order and recover pending events. |
| `PublishedAt` | `*time.Time` | Public | Instance | — | Publication timestamp; nil while the event is unpublished. |

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `IsPublished()` | `bool` | Public | Instance | Derives whether `PublishedAt` has been set. |
| `MarkPublished(now: time.Time)` | `void` | Public | Instance | Sets `PublishedAt` to `now`. |

## 4. Parameter design

### `IsPublished()`

This operation has no parameters.

### `MarkPublished(now: time.Time)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `now` | `time.Time` | — | in | Publication timestamp to record. |

## 5. Exception

None identified in the referenced sequence diagrams.

## 6. Method

### `IsPublished()`

Derives whether `PublishedAt` has been set. It has no parameters. It reads the declared attribute(s) `PublishedAt`. It returns `bool`.

### `MarkPublished(now: time.Time)`

Sets `PublishedAt` to `now`. It uses `now`. It updates the declared attribute(s) `PublishedAt`. No value is returned.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
