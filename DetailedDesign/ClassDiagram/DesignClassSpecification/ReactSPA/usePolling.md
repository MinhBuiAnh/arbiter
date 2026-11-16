# usePolling — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `usePolling` |
| Classifier kind | Class |
| Package / subsystem | `React SPA (TypeScript)` |
| DCD alias | `UIUsePolling` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`usePolling` is a class in the `React SPA (TypeScript)` package/subsystem of the design class diagram.

Reusable React hook that runs a task on an interval and supports pause and stop.

- Declared incoming design relationships: `SubmissionTracker`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `start(intervalMS: number, task: () => Promise<boolean>)` | `void` | Public | Instance | Stores the interval and task and begins invoking the task until it returns false or the hook is stopped. |
| `stop()` | `void` | Public | Instance | Clears the active interval and resets the polling state. |
| `pause()` | `void` | Public | Instance | Suspends invocation without discarding the stored interval and task. |
| `isPolling()` | `boolean` | Public | Instance | Reports whether the hook currently has an active polling cycle. |

## 4. Parameter design

### `start(intervalMS: number, task: () => Promise<boolean>)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `intervalMS` | `number` | — | in | Polling interval in milliseconds. |
| `task` | `() => Promise<boolean>` | — | in | Task invoked on each interval; returning false ends polling. |

### `stop()`

This operation has no parameters.

### `pause()`

This operation has no parameters.

### `isPolling()`

This operation has no parameters.

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-NET-001` | Network error or interrupted request/response. | The UI cannot confirm the outcome and informs the user rather than assuming success. | [SD-UC-U-S-01-ViewSubmissionStatus-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-01-ViewSubmissionStatus-Exceptions.md) |

## 6. Method

### `start(intervalMS: number, task: () => Promise<boolean>)`

Stores the interval and task and begins invoking the task until it returns false or the hook is stopped. It uses `intervalMS`, `task`. No value is returned.

### `stop()`

Clears the active interval and resets the polling state. It has no parameters. No value is returned.

### `pause()`

Suspends invocation without discarding the stored interval and task. It has no parameters. No value is returned.

### `isPolling()`

Reports whether the hook currently has an active polling cycle. It has no parameters. It returns `boolean`.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
