# SubmissionQueryService — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `SubmissionQueryService` |
| Classifier kind | Class |
| Package / subsystem | `Submission Module (Go)` |
| DCD alias | `SUBSubmissionQueryService` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`SubmissionQueryService` is a class in the `Submission Module (Go)` package/subsystem of the design class diagram.

Application service for submission status, result, history, details, and administrative inspection.

- Declared outgoing design relationships: `SubmissionStore`, `Submission`.
- Declared incoming design relationships: `SubmissionHandler`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `GetStatus(ctx: context.Context, principal: Principal, submissionID: SubmissionID)` | `(*SubmissionStatusResponse, error)` | Public | Instance | Loads the submission, checks ownership, assembles the status view, and discloses the verdict only when the submission is completed. |
| `GetResult(ctx: context.Context, principal: Principal, submissionID: SubmissionID)` | `(*SubmissionDetailsResponse, error)` | Public | Instance | Loads the submission, checks ownership, assembles the stored result, and removes hidden test data. |
| `GetHistory(ctx: context.Context, principal: Principal, page: PageQuery, filter: SubmissionFilter)` | `(PageResult[SubmissionSummary], error)` | Public | Instance | Validates pagination and filters and reads the caller's submission summaries through `SubmissionStore.ReadOwnSubmissionSummaries`. |
| `GetDetails(ctx: context.Context, principal: Principal, submissionID: SubmissionID)` | `(*SubmissionDetailsResponse, error)` | Public | Instance | Loads the submission, checks ownership, assembles the details view, removes hidden test data, and bounds compilation output. |
| `ListAll(ctx: context.Context, principal: Principal, filter: SubmissionFilter, page: PageQuery)` | `(PageResult[SubmissionSummary], error)` | Public | Instance | Authorizes the administrator, validates pagination and filters, and queries all submission summaries. |
| `GetAnyDetails(ctx: context.Context, principal: Principal, submissionID: SubmissionID)` | `(*SubmissionDetailsResponse, error)` | Public | Instance | Authorizes the administrator, loads the submission, assembles details, removes hidden test data, and bounds compilation output. |
| `CheckOwnership(submission: *Submission, principal: Principal)` | `error` | Private | Instance | Internal helper that allows the owner or an administrator and rejects any other caller. |
| `AssembleStatusAndTimestamps(submission: *Submission)` | `*SubmissionStatusResponse` | Private | Instance | Internal helper that maps the submission identity, problem title, language, status, verdict, and timestamps to `SubmissionStatusResponse`. |
| `AssembleStoredResult(submission: *Submission)` | `(*SubmissionDetailsResponse, error)` | Private | Instance | Internal helper that assembles the result view from the persisted submission and its stored case results; the case rows come from the store rather than from a new `Submission` attribute. |
| `AssembleSubmissionDetails(submission: *Submission)` | `(*SubmissionDetailsResponse, error)` | Private | Instance | Internal helper that combines the status view, source, problem summary, compilation output, and executed-case rows into `SubmissionDetailsResponse`. |
| `ExcludeHiddenTestData(details: *SubmissionDetailsResponse)` | `void` | Private | Instance | Internal helper that removes hidden-case input, expected output, and other protected content from `details`. |
| `IncludeVerdictOnlyWhenCompleted(view: *SubmissionStatusResponse, submission: *Submission)` | `void` | Private | Instance | Internal helper that copies the verdict into `view` only when `submission.IsTerminal` and the status is completed. |
| `BoundCompilationInformation(output: string)` | `string` | Private | Instance | Internal helper that truncates compiler output to the display bound and returns the bounded value. |
| `ValidateFilters(filter: SubmissionFilter)` | `error` | Private | Instance | Internal helper that checks optional problem, verdict, and status filters against their declared value sets. |
| `ValidatePagination(page: PageQuery)` | `error` | Private | Instance | Internal helper that checks page number and page size bounds. |
| `HandleQueryFailure(err: error)` | `error` | Private | Instance | Internal helper that maps not-found, ownership, and store failures to the declared query outcomes. |

## 4. Parameter design

### `GetStatus(ctx: context.Context, principal: Principal, submissionID: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `submissionID` | `SubmissionID` | — | in | Identifies the target submission. |

### `GetResult(ctx: context.Context, principal: Principal, submissionID: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `submissionID` | `SubmissionID` | — | in | Identifies the target submission. |

### `GetHistory(ctx: context.Context, principal: Principal, page: PageQuery, filter: SubmissionFilter)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `page` | `PageQuery` | — | in | Supplies pagination and sort criteria. |
| `filter` | `SubmissionFilter` | — | in | Optional problem, verdict, or status filters. |

### `GetDetails(ctx: context.Context, principal: Principal, submissionID: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `submissionID` | `SubmissionID` | — | in | Identifies the target submission. |

### `ListAll(ctx: context.Context, principal: Principal, filter: SubmissionFilter, page: PageQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `filter` | `SubmissionFilter` | — | in | Supplies optional filtering criteria. |
| `page` | `PageQuery` | — | in | Supplies pagination and sort criteria. |

### `GetAnyDetails(ctx: context.Context, principal: Principal, submissionID: SubmissionID)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `ctx` | `context.Context` | — | in | Carries cancellation, deadlines, and request-scoped values. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |
| `submissionID` | `SubmissionID` | — | in | Identifies the target submission. |

### `CheckOwnership(submission: *Submission, principal: Principal)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `submission` | `*Submission` | — | in | Supplies the submission used by the operation. |
| `principal` | `Principal` | — | in | Identifies the authenticated caller and role used for authorization. |

### `AssembleStatusAndTimestamps(submission: *Submission)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `submission` | `*Submission` | — | in | Supplies the submission used by the operation. |

### `AssembleStoredResult(submission: *Submission)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `submission` | `*Submission` | — | in | Supplies the submission used by the operation. |

### `AssembleSubmissionDetails(submission: *Submission)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `submission` | `*Submission` | — | in | Supplies the submission used by the operation. |

### `ExcludeHiddenTestData(details: *SubmissionDetailsResponse)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `details` | `*SubmissionDetailsResponse` | — | in | Details view from which hidden test data is removed. |

### `IncludeVerdictOnlyWhenCompleted(view: *SubmissionStatusResponse, submission: *Submission)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `view` | `*SubmissionStatusResponse` | — | in | Status view to complete. |
| `submission` | `*Submission` | — | in | Submission whose completion state controls verdict disclosure. |

### `BoundCompilationInformation(output: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `output` | `string` | — | in | Compiler output text to bound. |

### `ValidateFilters(filter: SubmissionFilter)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `filter` | `SubmissionFilter` | — | in | Filters to validate before querying. |

### `ValidatePagination(page: PageQuery)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `page` | `PageQuery` | — | in | Supplies pagination and sort criteria. |

### `HandleQueryFailure(err: error)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `err` | `error` | — | in | Supplies the collaborator failure to classify or persist. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-VAL-004` | Invalid search or filter parameters. | The query is rejected without reading or changing state. | [SD-UC-AD-S-01-ViewAnySubmission](../../../../ArchitecturalDesign/SequenceDiagram/Administrator/SubmissionManagement/SD-UC-AD-S-01-ViewAnySubmission.md) |
| `ERR-VAL-005` | Invalid pagination parameters. | The query is rejected without reading or changing state. | [SD-UC-U-S-03-ViewSubmissionHistory](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-03-ViewSubmissionHistory.md) |
| `ERR-PERM-003` | Submission is not owned by the caller. | The result or details read is rejected as not permitted. | [SD-UC-U-S-01-ViewSubmissionStatus](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-01-ViewSubmissionStatus.md) |
| `ERR-RES-005` | Submission not found. | The query is rejected without exposing another user's data. | [SD-UC-U-S-01-ViewSubmissionStatus](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-01-ViewSubmissionStatus.md) |
| `ERR-SYS-001` | Internal system, persistence, or assembly error. | The request fails with an internal error; transactions roll back where applicable. | [SD-UC-U-S-01-ViewSubmissionStatus](../../../../ArchitecturalDesign/SequenceDiagram/User/SubmissionHistory/SD-UC-U-S-01-ViewSubmissionStatus.md) |

## 6. Method

### `GetStatus(ctx: context.Context, principal: Principal, submissionID: SubmissionID)`

Loads the submission, checks ownership, assembles the status view, and discloses the verdict only when the submission is completed. It uses `ctx`, `principal`, `submissionID`. It returns `(*SubmissionStatusResponse, error)`. Failures are returned through the declared error result rather than as a successful value.

### `GetResult(ctx: context.Context, principal: Principal, submissionID: SubmissionID)`

Loads the submission, checks ownership, assembles the stored result, and removes hidden test data. It uses `ctx`, `principal`, `submissionID`. It returns `(*SubmissionDetailsResponse, error)`. Failures are returned through the declared error result rather than as a successful value.

### `GetHistory(ctx: context.Context, principal: Principal, page: PageQuery, filter: SubmissionFilter)`

Validates pagination and filters and reads the caller's submission summaries through `SubmissionStore.ReadOwnSubmissionSummaries`. It uses `ctx`, `principal`, `page`, `filter`. It returns `(PageResult[SubmissionSummary], error)`. Failures are returned through the declared error result rather than as a successful value.

### `GetDetails(ctx: context.Context, principal: Principal, submissionID: SubmissionID)`

Loads the submission, checks ownership, assembles the details view, removes hidden test data, and bounds compilation output. It uses `ctx`, `principal`, `submissionID`. It returns `(*SubmissionDetailsResponse, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ListAll(ctx: context.Context, principal: Principal, filter: SubmissionFilter, page: PageQuery)`

Authorizes the administrator, validates pagination and filters, and queries all submission summaries. It uses `ctx`, `principal`, `filter`, `page`. It returns `(PageResult[SubmissionSummary], error)`. Failures are returned through the declared error result rather than as a successful value.

### `GetAnyDetails(ctx: context.Context, principal: Principal, submissionID: SubmissionID)`

Authorizes the administrator, loads the submission, assembles details, removes hidden test data, and bounds compilation output. It uses `ctx`, `principal`, `submissionID`. It returns `(*SubmissionDetailsResponse, error)`. Failures are returned through the declared error result rather than as a successful value.

### `CheckOwnership(submission: *Submission, principal: Principal)`

Allows the owner or an administrator and rejects any other caller. It uses `submission`, `principal`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `AssembleStatusAndTimestamps(submission: *Submission)`

Maps the submission identity, problem title, language, status, verdict, and timestamps to `SubmissionStatusResponse`. It uses `submission`. It returns `*SubmissionStatusResponse`.

### `AssembleStoredResult(submission: *Submission)`

Assembles the result view from the persisted submission and its stored case results; the case rows come from the store rather than from a new `Submission` attribute. It uses `submission`. It returns `(*SubmissionDetailsResponse, error)`. Failures are returned through the declared error result rather than as a successful value.

### `AssembleSubmissionDetails(submission: *Submission)`

Combines the status view, source, problem summary, compilation output, and executed-case rows into `SubmissionDetailsResponse`. It uses `submission`. It returns `(*SubmissionDetailsResponse, error)`. Failures are returned through the declared error result rather than as a successful value.

### `ExcludeHiddenTestData(details: *SubmissionDetailsResponse)`

Removes hidden-case input, expected output, and other protected content from `details`. It uses `details`. No value is returned.

### `IncludeVerdictOnlyWhenCompleted(view: *SubmissionStatusResponse, submission: *Submission)`

Copies the verdict into `view` only when `submission.IsTerminal` and the status is completed. It uses `view`, `submission`. No value is returned.

### `BoundCompilationInformation(output: string)`

Truncates compiler output to the display bound and returns the bounded value. It uses `output`. It returns `string`.

### `ValidateFilters(filter: SubmissionFilter)`

Checks optional problem, verdict, and status filters against their declared value sets. It uses `filter`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `ValidatePagination(page: PageQuery)`

Checks page number and page size bounds. It uses `page`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

### `HandleQueryFailure(err: error)`

Maps not-found, ownership, and store failures to the declared query outcomes. It uses `err`. It returns `error`. Failures are returned through the declared error result rather than as a successful value.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
