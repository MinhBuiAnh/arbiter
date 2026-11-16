# RedisStreamQueue — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `RedisStreamQueue` |
| Classifier kind | Class |
| Package / subsystem | `Message Queue Subsystem (Go)` |
| DCD alias | `MQRedisStreamQueue` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`RedisStreamQueue` is a class in the `Message Queue Subsystem (Go)` package/subsystem of the design class diagram.

Redis Streams adapter that realizes `SubmissionQueue`.

- Declared outgoing design relationships: `SubmissionQueue`.
- Realizes: `SubmissionQueue`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

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
