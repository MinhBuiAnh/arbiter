# QueueMessage — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `QueueMessage` |
| Classifier kind | Class |
| Package / subsystem | `Message Queue Subsystem (Go)` |
| DCD alias | `MQQueueMessage` |
| Design class diagram | [DesignClassDiagram.md](../../../../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../../../ClassDiagram/Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`QueueMessage` is a class in the `Message Queue Subsystem (Go)` package/subsystem of the design class diagram.

Queue message value carrying event, submission, attempt, and enqueue metadata.

- Declared incoming design relationships: `JudgeWorker`, `OutboxDispatcher`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `ID` | `MessageID` | Public | Instance | — | Unique queue-message identifier. |
| `EventID` | `EventID` | Public | Instance | — | Outbox event that produced the message. |
| `SubmissionID` | `SubmissionID` | Public | Instance | — | Submission to judge. |
| `Attempt` | `int` | Public | Instance | — | Delivery attempt number. |
| `EnqueuedAt` | `time.Time` | Public | Instance | — | Timestamp when the message was enqueued. |

## 3. Operation design

No operations are specified for this classifier in the DCD.

## 4. Parameter design

No operations are specified, so there are no parameters.

## 5. Exception

None identified in the referenced sequence diagrams.

## 6. Method

No methods are specified for this classifier in the DCD.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
