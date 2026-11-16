# SubmissionBrowser — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `SubmissionBrowser` |
| Classifier kind | Class |
| Package / subsystem | `React SPA (TypeScript)` |
| DCD alias | `UISubmissionBrowser` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`SubmissionBrowser` is a class in the `React SPA (TypeScript)` package/subsystem of the design class diagram.

React view for submission history, result, and details.

- Declared outgoing design relationships: `SubmissionApi`.
- Declared incoming design relationships: `AppShell`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `requestHistory(query: PageQuery)` | `Promise<void>` | Public | Instance | Calls `SubmissionApi.getSubmissionHistory` and passes the returned page to `displayHistory`. |
| `displayHistory(page: PageResult<SubmissionStatusResponse>)` | `void` | Public | Instance | Renders the submission-history page. |
| `selectSubmission(submissionID: string)` | `void` | Public | Instance | Records the selected submission and calls `requestDetails` for it. |
| `requestDetails(submissionID: string)` | `Promise<void>` | Public | Instance | Calls `SubmissionApi.getSubmissionDetails` and passes the response to `displayDetails`. |
| `displayDetails(details: SubmissionDetailsResponse)` | `void` | Public | Instance | Renders the submission details and exposes the result section. |
| `displayResult(details: SubmissionDetailsResponse)` | `void` | Public | Instance | Renders the verdict, metrics, and executed-case rows from the details response. |

## 4. Parameter design

### `requestHistory(query: PageQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `query` | `PageQuery` | — | in | Supplies search, filter, and pagination criteria. |

### `displayHistory(page: PageResult<SubmissionStatusResponse>)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `page` | `PageResult<SubmissionStatusResponse>` | — | in | Supplies pagination and sort criteria. |

### `selectSubmission(submissionID: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `submissionID` | `string` | — | in | Submission selected in the history view. |

### `requestDetails(submissionID: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `submissionID` | `string` | — | in | Submission whose details are requested. |

### `displayDetails(details: SubmissionDetailsResponse)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `details` | `SubmissionDetailsResponse` | — | in | Supplies the details view to sanitize. |

### `displayResult(details: SubmissionDetailsResponse)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `details` | `SubmissionDetailsResponse` | — | in | Supplies the details view to sanitize. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-VAL-004` | Invalid search or filter parameters. | The query is rejected without reading or changing state. | [SD-UC-AD-S-01-ViewAnySubmission](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/SubmissionManagement/SD-UC-AD-S-01-ViewAnySubmission.md) |
| `ERR-VAL-005` | Invalid pagination parameters. | The query is rejected without reading or changing state. | [SD-UC-U-S-03-ViewSubmissionHistory](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-03-ViewSubmissionHistory.md) |
| `ERR-PERM-003` | Submission is not owned by the caller. | The result or details read is rejected as not permitted. | [SD-UC-U-S-04-ViewSubmissionDetails](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-04-ViewSubmissionDetails.md) |
| `ERR-RES-005` | Submission not found. | The query is rejected without exposing another user's data. | [SD-UC-U-S-04-ViewSubmissionDetails](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-04-ViewSubmissionDetails.md) |
| `ERR-NET-001` | Network error or interrupted request/response. | The UI cannot confirm the outcome and informs the user rather than assuming success. | [SD-UC-U-S-03-ViewSubmissionHistory](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-03-ViewSubmissionHistory.md) |
| `ERR-LIMIT-001` | Rate limit exceeded. | The request is rejected with retry information; no state is changed. | [SD-UC-U-S-03-ViewSubmissionHistory](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-03-ViewSubmissionHistory.md) |
| `ERR-SYS-001` | Internal system, persistence, or assembly error. | The request fails with an internal error; transactions roll back where applicable. | [SD-UC-U-S-03-ViewSubmissionHistory](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-03-ViewSubmissionHistory.md) |

## 6. Method

### `requestHistory(query: PageQuery)`

Calls `SubmissionApi.getSubmissionHistory` and passes the returned page to `displayHistory`. It uses `query`. It returns `Promise<void>`.

### `displayHistory(page: PageResult<SubmissionStatusResponse>)`

Renders the submission-history page. It uses `page`. No value is returned.

### `selectSubmission(submissionID: string)`

Records the selected submission and calls `requestDetails` for it. It uses `submissionID`. No value is returned.

### `requestDetails(submissionID: string)`

Calls `SubmissionApi.getSubmissionDetails` and passes the response to `displayDetails`. It uses `submissionID`. It returns `Promise<void>`.

### `displayDetails(details: SubmissionDetailsResponse)`

Renders the submission details and exposes the result section. It uses `details`. No value is returned.

### `displayResult(details: SubmissionDetailsResponse)`

Renders the verdict, metrics, and executed-case rows from the details response. It uses `details`. No value is returned.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
