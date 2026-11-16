# SubmissionTracker — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `SubmissionTracker` |
| Classifier kind | Class |
| Package / subsystem | `React SPA (TypeScript)` |
| DCD alias | `UISubmissionTracker` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`SubmissionTracker` is a class in the `React SPA (TypeScript)` package/subsystem of the design class diagram.

React component that polls a submission until a terminal state and presents the outcome.

- Declared outgoing design relationships: `SubmissionApi`, `usePolling`.
- Declared incoming design relationships: `AppShell`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `startPolling(submissionID: string)` | `void` | Public | Instance | Starts the `usePolling` loop with the declared interval and a task that calls `requestStatus` for the submission. |
| `stopPolling()` | `void` | Public | Instance | Stops the `usePolling` loop after a terminal result or when the view is closed. |
| `pausePolling()` | `void` | Public | Instance | Pauses the `usePolling` loop without discarding the current submission. |
| `requestStatus(submissionID: string)` | `Promise<void>` | Public | Instance | Calls `SubmissionApi.getSubmissionStatus`, passes the response to `displayStatus`, and stops polling when the status is terminal. |
| `displayStatus(status: SubmissionStatusResponse)` | `void` | Public | Instance | Renders the returned status and timestamps and requests the result view once the submission completes. |
| `showRetryNotice()` | `void` | Public | Instance | Renders a retry notice for a recoverable polling failure. |
| `showNetworkOutcomeUnknown()` | `void` | Public | Instance | Renders the unknown-outcome state when a status request fails before a confirmed response is received. |
| `showSubmissionOutcomeUnknown()` | `void` | Public | Instance | Renders the unknown-outcome state when the submission cannot be confirmed as terminal. |

## 4. Parameter design

### `startPolling(submissionID: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `submissionID` | `string` | — | in | Submission to poll. |

### `stopPolling()`

This operation has no parameters.

### `pausePolling()`

This operation has no parameters.

### `requestStatus(submissionID: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `submissionID` | `string` | — | in | Submission whose current status is requested. |

### `displayStatus(status: SubmissionStatusResponse)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `status` | `SubmissionStatusResponse` | — | in | Supplies the requested status value. |

### `showRetryNotice()`

This operation has no parameters.

### `showNetworkOutcomeUnknown()`

This operation has no parameters.

### `showSubmissionOutcomeUnknown()`

This operation has no parameters.

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-PERM-003` | Submission is not owned by the caller. | The result or details read is rejected as not permitted. | [SD-UC-U-S-01-ViewSubmissionStatus](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-01-ViewSubmissionStatus.md) |
| `ERR-RES-005` | Submission not found. | The query is rejected without exposing another user's data. | [SD-UC-U-S-01-ViewSubmissionStatus](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-01-ViewSubmissionStatus.md) |
| `ERR-NET-001` | Network error or interrupted request/response. | The UI cannot confirm the outcome and informs the user rather than assuming success. | [SD-UC-U-S-01-ViewSubmissionStatus-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-01-ViewSubmissionStatus-Exceptions.md) |
| `ERR-LIMIT-001` | Rate limit exceeded. | The request is rejected with retry information; no state is changed. | [SD-UC-U-S-01-ViewSubmissionStatus-Exceptions](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-01-ViewSubmissionStatus-Exceptions.md) |
| `ERR-SYS-001` | Internal system, persistence, or assembly error. | The request fails with an internal error; transactions roll back where applicable. | [SD-UC-U-S-01-ViewSubmissionStatus](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-01-ViewSubmissionStatus.md) |

## 6. Method

### `startPolling(submissionID: string)`

Starts the `usePolling` loop with the declared interval and a task that calls `requestStatus` for the submission. It uses `submissionID`. No value is returned.

### `stopPolling()`

Stops the `usePolling` loop after a terminal result or when the view is closed. It has no parameters. No value is returned.

### `pausePolling()`

Pauses the `usePolling` loop without discarding the current submission. It has no parameters. No value is returned.

### `requestStatus(submissionID: string)`

Calls `SubmissionApi.getSubmissionStatus`, passes the response to `displayStatus`, and stops polling when the status is terminal. It uses `submissionID`. It returns `Promise<void>`.

### `displayStatus(status: SubmissionStatusResponse)`

Renders the returned status and timestamps and requests the result view once the submission completes. It uses `status`. No value is returned.

### `showRetryNotice()`

Renders a retry notice for a recoverable polling failure. It has no parameters. No value is returned.

### `showNetworkOutcomeUnknown()`

Renders the unknown-outcome state when a status request fails before a confirmed response is received. It has no parameters. No value is returned.

### `showSubmissionOutcomeUnknown()`

Renders the unknown-outcome state when the submission cannot be confirmed as terminal. It has no parameters. No value is returned.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
