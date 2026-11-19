# Design Class Diagram

**Arbiter — Online Judge Platform**

| Document control | Value |
|------------------|-------|
| Project | Arbiter — Online Judge Platform |
| Artifact | Design class diagram (DCD) |
| Basis | [Combined Analysis Class Diagram](../../ArchitecturalDesign/AnalysisClassDiagram/Combined/ACD-Combined.md) |
| Rules | [Design Class Diagram Ruleset](Ruleset.md) |
| Related artifact | [Class Design Specification Ruleset](../ClassDesignSpecification/Ruleset.md) |
| Status | Draft |
| Version | 0.5 |
| Date | 2026-11-19 |

---

## 1. Purpose and Scope

This document transforms the combined analysis class diagram into a design class diagram. The design keeps the ACD responsibilities while adding implementation structure: React and TypeScript for the presentation layer, Go for the modular-monolith backend, explicit types and visibility, package boundaries, and subsystem ports with adapters.

No Boundary, Control, or Entity stereotypes appear in the diagram. UML `interface`, `enum`, and package notation are classifier kinds, not responsibility stereotypes. The ACD remains the authority for responsibilities; this DCD records how those responsibilities are realized.

The application is one deployable modular monolith. The HTTP API and the Judge Worker are separate processes built from the same Go codebase. Persistence, queueing, execution, protected test-case storage, and credential hashing are shown as subsystems whose internal details are intentionally omitted; only their contracts and realizations are shown.

## 2. Design Overview

- **Presentation:** React components, hooks, typed state, and per-capability TypeScript API clients.
- **API boundary:** Go HTTP handlers, routing, authentication middleware, rate limiting, and request/response contract records.
- **Application modules:** account, problem catalog, test cases, submissions, progress, judge, and outbox. Each module owns its use cases and domain types.
- **Domain model:** Go structs and defined types with invariants kept on the entity or aggregate that owns them.
- **Subsystems:** persistence, message queue, execution environment, protected test-case store, and credential hashing. A subsystem adapter realizes the ports declared by the consuming modules.
- **Cross-module references:** modules collaborate through IDs, read models, or narrow interfaces rather than another module's internal storage.

## 3. Design Class Diagram

```plantuml
@startuml DesignClassDiagram
title Arbiter - Design Class Diagram
top to bottom direction
skinparam shadowing false
skinparam packageStyle rectangle
skinparam classAttributeIconSize 0
skinparam defaultFontName "Helvetica"
skinparam defaultFontSize 10
skinparam nodesep 10
skinparam ranksep 24
skinparam ArrowColor #333333
skinparam ClassBorderColor #333333
skinparam ClassBackgroundColor #FFFFFF
skinparam InterfaceBackgroundColor #F2F2F2
skinparam PackageBorderColor #666666
skinparam PackageBackgroundColor #FAFAFA
hide circle

package "Shared Domain Types (Go)" as DomainTypes {
  enum "Role" as DTRole {
    USER
    ADMINISTRATOR
  }

  enum "AccountStatus" as DTAccountStatus {
    ACTIVE
    LOCKED
  }

  enum "Difficulty" as DTDifficulty {
    EASY
    MEDIUM
    HARD
  }

  enum "LifecycleStatus" as DTLifecycleStatus {
    ACTIVE
    INACTIVE
  }

  enum "PublicationStatus" as DTPublicationStatus {
    DRAFT
    PUBLISHED
  }

  enum "TestCaseType" as DTTestCaseType {
    SAMPLE
    HIDDEN
  }

  enum "Language" as DTLanguage {
    CPP17
    PYTHON3
  }

  enum "SubmissionStatus" as DTSubmissionStatus {
    QUEUED
    COMPILING
    RUNNING
    COMPLETED
    INTERNAL_ERROR
  }

  enum "Verdict" as DTVerdict {
    ACCEPTED
    WRONG_ANSWER
    TIME_LIMIT_EXCEEDED
    MEMORY_LIMIT_EXCEEDED
    RUNTIME_ERROR
    COMPILATION_ERROR
  }

  enum "TestOutcome" as DTTestOutcome {
    PASSED
    FAILED
    SKIPPED
  }

  class "TestCaseSetSummary" as DTTestCaseSetSummary {
    +ProblemID: ProblemID
    +Version: int
    +CaseCount: int
    +RequiredTypes: []TestCaseType
    +HasSample(): bool
    +HasHidden(): bool
  }

  note right of DTRole
    Defined identifier types (string-based Go types):
    AccountID, ProblemID, TestCaseID, SubmissionID,
    EventID, MessageID.
  end note
}

package "React SPA (TypeScript)" as UI {
  class "AppShell" as UIAppShell {
    +auth: AuthState
    +render(): JSX.Element
    +navigate(route: string): void
    +showGuestNavigation(): void
    +showAuthenticatedNavigation(): void
  }

  class "AuthProvider" as UIAuthProvider {
    +state: AuthState
    +login(identifier: string, password: string): Promise<void>
    +register(req: RegisterRequest): Promise<void>
    +logout(): void
    +storeAuthenticationResult(res: LoginResponse): void
    +clearAuthenticationInformation(): void
    +restoreAuthentication(): void
  }

  class "HttpClient" as UIHttpClient {
    -baseURL: string
    -token: string | null
    +request<T>(method: string, path: string, body?: unknown): Promise<T>
    +setToken(token: string | null): void
  }

  note right of UIHttpClient
    TypeScript request and response types mirror
    the Go contract records. They are separate
    declarations and are not shared classes.
  end note

  class "AccountApi" as UIAccountApi {
    +login(req: LoginRequest): Promise<LoginResponse>
    +register(req: RegisterRequest): Promise<void>
    +getAccount(): Promise<AccountResponse>
    +updateAccount(req: UpdateAccountRequest): Promise<AccountResponse>
    +changePassword(req: ChangePasswordRequest): Promise<void>
    +listUsers(query: PageQuery): Promise<PageResult<AccountResponse>>
    +getUserDetails(id: string): Promise<AccountResponse>
    +changeUserStatus(id: string, status: string, version: number): Promise<AccountResponse>
  }

  class "ProblemApi" as UIProblemApi {
    +listProblems(query: ProblemQuery): Promise<PageResult<ProblemResponse>>
    +searchProblems(query: ProblemQuery): Promise<PageResult<ProblemResponse>>
    +getProblem(problemID: string): Promise<ProblemResponse>
    +getEditorContext(problemID: string): Promise<ProblemResponse>
    +createProblem(req: ProblemWriteRequest): Promise<ProblemResponse>
    +updateProblem(id: string, req: ProblemWriteRequest): Promise<ProblemResponse>
    +changePublication(id: string, action: string, version: number): Promise<ProblemResponse>
    +changeLifecycle(id: string, action: string, version: number): Promise<ProblemResponse>
  }

  class "TestCaseApi" as UITestCaseApi {
    +listTestCases(problemID: string): Promise<TestCaseResponse[]>
    +createTestCase(problemID: string, req: TestCaseWriteRequest): Promise<TestCaseResponse>
    +updateTestCase(id: string, req: TestCaseWriteRequest): Promise<TestCaseResponse>
    +deleteTestCase(id: string, version: number): Promise<void>
    +changeTestCaseType(id: string, type: string, version: number): Promise<TestCaseResponse>
    +reorderTestCases(problemID: string, req: ReorderRequest): Promise<TestCaseResponse[]>
  }

  class "SubmissionApi" as UISubmissionApi {
    +createSubmission(req: CreateSubmissionRequest): Promise<SubmissionStatusResponse>
    +getSubmissionStatus(id: string): Promise<SubmissionStatusResponse>
    +getSubmissionResult(id: string): Promise<SubmissionDetailsResponse>
    +getSubmissionHistory(query: PageQuery): Promise<PageResult<SubmissionStatusResponse>>
    +getSubmissionDetails(id: string): Promise<SubmissionDetailsResponse>
    +listAllSubmissions(query: PageQuery): Promise<PageResult<SubmissionStatusResponse>>
    +getAnySubmissionDetails(id: string): Promise<SubmissionDetailsResponse>
  }

  class "ProgressApi" as UIProgressApi {
    +getOwnStatistics(): Promise<UserStatisticsResponse>
    +getLeaderboard(query: PageQuery): Promise<PageResult<LeaderboardEntryResponse>>
  }

  class "ProblemBrowser" as UIProblemBrowser {
    +state: ProblemQuery
    +submitSearch(query: ProblemQuery): Promise<void>
    +selectProblem(problemID: string): void
    +displayProblemList(page: PageResult<ProblemResponse>): void
    +displayEmptyState(): void
    +returnToProblemList(): void
  }

  class "PracticeWorkspace" as UIPracticeWorkspace {
    +draft: ProblemDraft
    +initializeEditor(config: EditorConfig): void
    +selectLanguage(language: string): Promise<void>
    +validateSupportedLanguage(language: string): boolean
    +editSource(source: string): void
    +restoreTemplate(): void
    +clearSource(): void
    +submitSolution(): Promise<SubmissionStatusResponse>
    +displaySubmissionReceipt(res: SubmissionStatusResponse): void
  }

  class "SubmissionTracker" as UISubmissionTracker {
    +startPolling(submissionID: string): void
    +stopPolling(): void
    +pausePolling(): void
    +requestStatus(submissionID: string): Promise<void>
    +displayStatus(status: SubmissionStatusResponse): void
    +showRetryNotice(): void
    +showNetworkOutcomeUnknown(): void
    +showSubmissionOutcomeUnknown(): void
  }

  class "SubmissionBrowser" as UISubmissionBrowser {
    +requestHistory(query: PageQuery): Promise<void>
    +displayHistory(page: PageResult<SubmissionStatusResponse>): void
    +selectSubmission(submissionID: string): void
    +requestDetails(submissionID: string): Promise<void>
    +displayDetails(details: SubmissionDetailsResponse): void
    +displayResult(details: SubmissionDetailsResponse): void
  }

  class "ProgressDashboard" as UIProgressDashboard {
    +requestOwnStatistics(): Promise<void>
    +displayStatistics(stats: UserStatisticsResponse): void
    +refreshStatistics(): Promise<void>
    +displayLeaderboard(page: PageResult<LeaderboardEntryResponse>): void
  }

  class "AdminConsole" as UIAdminConsole {
    +problemDraft: ProblemDraft
    +testCaseDraft: TestCaseDraft
    +createProblem(req: ProblemWriteRequest): Promise<void>
    +updateProblem(id: string, req: ProblemWriteRequest, version: number): Promise<void>
    +changePublication(id: string, action: string, version: number): Promise<void>
    +createTestCase(problemID: string, req: TestCaseWriteRequest): Promise<void>
    +updateTestCase(id: string, req: TestCaseWriteRequest, version: number): Promise<void>
    +deleteTestCase(id: string, version: number): Promise<void>
    +changeTestCaseType(id: string, type: string, version: number): Promise<void>
    +reorderTestCases(problemID: string, req: ReorderRequest): Promise<void>
    +requestUserList(query: PageQuery): Promise<void>
    +requestUserDetails(userID: string): Promise<void>
    +changeAccountStatus(userID: string, status: string, version: number): Promise<void>
    +requestSubmissionList(query: PageQuery): Promise<void>
    +requestSubmissionDetails(submissionID: string): Promise<void>
    +displayReadOnlyDetails(details: SubmissionDetailsResponse): void
    +displayValidationErrors(errors: Record<string, string>): void
    +verifyStoredState(): Promise<void>
  }

  class "usePolling" as UIUsePolling {
    +start(intervalMS: number, task: () => Promise<boolean>): void
    +stop(): void
    +pause(): void
    +isPolling(): boolean
  }

  class "AuthState" as UIAuthState {
    +token: string | null
    +principal: AccountResponse | null
    +isAuthenticated: boolean
  }

  class "ProblemDraft" as UIProblemDraft {
    +problemID: string
    +title: string
    +statement: string
    +language: string
    +source: string
    +supportedLanguages: string[]
  }

  class "EditorConfig" as UIEditorConfig {
    +language: string
    +source: string
    +readOnly: boolean
  }

  class "TestCaseDraft" as UITestCaseDraft {
    +testCaseID: string
    +input: string
    +expectedOutput: string
    +type: string
    +ordinal: number
  }
}

package "HTTP API (Go)" as API {
  class "Router" as APIRouter {
    +Handler() http.Handler
    -registerRoutes(): void
  }

  class "AuthHandler" as APIAuthHandler {
    +Register(w http.ResponseWriter, r *http.Request): void
    +Login(w http.ResponseWriter, r *http.Request): void
  }

  class "AccountHandler" as APIAccountHandler {
    +GetOwn(w http.ResponseWriter, r *http.Request): void
    +UpdateOwn(w http.ResponseWriter, r *http.Request): void
    +ChangePassword(w http.ResponseWriter, r *http.Request): void
    +ListUsers(w http.ResponseWriter, r *http.Request): void
    +GetUserDetails(w http.ResponseWriter, r *http.Request): void
    +GetUserStatus(w http.ResponseWriter, r *http.Request): void
    +ChangeUserStatus(w http.ResponseWriter, r *http.Request): void
  }

  class "ProblemHandler" as APIProblemHandler {
    +List(w http.ResponseWriter, r *http.Request): void
    +Search(w http.ResponseWriter, r *http.Request): void
    +Get(w http.ResponseWriter, r *http.Request): void
    +GetEditorContext(w http.ResponseWriter, r *http.Request): void
    +Create(w http.ResponseWriter, r *http.Request): void
    +Update(w http.ResponseWriter, r *http.Request): void
    +GetState(w http.ResponseWriter, r *http.Request): void
    +GetPublicationState(w http.ResponseWriter, r *http.Request): void
    +ChangeLifecycle(w http.ResponseWriter, r *http.Request): void
    +ChangePublication(w http.ResponseWriter, r *http.Request): void
  }

  class "TestCaseHandler" as APITestCaseHandler {
    +List(w http.ResponseWriter, r *http.Request): void
    +Get(w http.ResponseWriter, r *http.Request): void
    +GetOrder(w http.ResponseWriter, r *http.Request): void
    +GetType(w http.ResponseWriter, r *http.Request): void
    +Create(w http.ResponseWriter, r *http.Request): void
    +Update(w http.ResponseWriter, r *http.Request): void
    +Delete(w http.ResponseWriter, r *http.Request): void
    +ChangeType(w http.ResponseWriter, r *http.Request): void
    +Reorder(w http.ResponseWriter, r *http.Request): void
  }

  class "SubmissionHandler" as APISubmissionHandler {
    +Create(w http.ResponseWriter, r *http.Request): void
    +GetStatus(w http.ResponseWriter, r *http.Request): void
    +GetResult(w http.ResponseWriter, r *http.Request): void
    +GetHistory(w http.ResponseWriter, r *http.Request): void
    +GetDetails(w http.ResponseWriter, r *http.Request): void
    +ListAll(w http.ResponseWriter, r *http.Request): void
    +GetAnyDetails(w http.ResponseWriter, r *http.Request): void
  }

  class "ProgressHandler" as APIProgressHandler {
    +GetOwnStatistics(w http.ResponseWriter, r *http.Request): void
    +GetLeaderboard(w http.ResponseWriter, r *http.Request): void
  }

  class "AuthMiddleware" as APIAuthMiddleware {
    +Authenticate(next http.Handler) http.Handler
    +AuthorizeAdministrator(next http.Handler) http.Handler
  }

  class "RateLimiter" as APIRateLimiter {
    +Allow(key string): (bool, time.Duration)
  }
}

package "Application Contracts (Go)" as Contracts {
  class "PageQuery" as DTOPageQuery {
    +page: int
    +pageSize: int
    +sort: string
  }

  class "PageResult" as DTOPageResult {
    +items: []T
    +total: int
    +page: int
    +pageSize: int
  }

  class "ErrorResponse" as DTOErrorResponse {
    +code: string
    +message: string
    +requestID: string
    +details: map[string]string
    +retryAfter: int
  }

  class "RegisterRequest" as DTORegisterRequest {
    +username: string
    +email: string
    +password: string
    +confirmPassword: string
  }

  class "LoginRequest" as DTOLoginRequest {
    +identifier: string
    +password: string
  }

  class "LoginResponse" as DTOLoginResponse {
    +accessToken: string
    +user: AccountResponse
  }

  class "AccountResponse" as DTOAccountResponse {
    +id: string
    +username: string
    +email: string
    +displayName: string
    +bio: string
    +role: string
    +status: string
    +version: int
  }

  class "UpdateAccountRequest" as DTOUpdateAccountRequest {
    +displayName: *string
    +bio: *string
    +email: *string
  }

  class "ChangePasswordRequest" as DTOChangePasswordRequest {
    +currentPassword: string
    +newPassword: string
    +confirmPassword: string
  }

  class "ProblemQuery" as DTOProblemQuery {
    +keywords: string
    +difficulty: string
    +category: string
    +tags: []string
    +page: PageQuery
  }

  class "ProblemResponse" as DTOProblemResponse {
    +id: string
    +title: string
    +statement: string
    +inputFormat: string
    +outputFormat: string
    +constraints: string
    +difficulty: string
    +tags: []string
    +timeLimitMS: int
    +memoryLimitMB: int
    +lifecycleStatus: string
    +publicationStatus: string
    +version: int
    +sampleCases: []TestCaseResponse
    +statistics: PublicStatisticsResponse
  }

  class "PublicStatisticsResponse" as DTOPublicStatisticsResponse {
    +submissionCount: int
    +acceptedSubmissionCount: int
    +acceptanceRate: float64
  }

  class "ProblemWriteRequest" as DTOProblemWriteRequest {
    +title: string
    +statement: string
    +inputFormat: string
    +outputFormat: string
    +constraints: string
    +difficulty: string
    +category: string
    +tags: []string
    +timeLimitMS: int
    +memoryLimitMB: int
    +allowedLanguages: []string
  }

  class "TestCaseResponse" as DTOTestCaseResponse {
    +id: string
    +problemID: string
    +type: string
    +ordinal: int
    +version: int
    +inputPreview: string
    +expectedOutputPreview: string
  }

  class "TestCaseWriteRequest" as DTOTestCaseWriteRequest {
    +input: string
    +expectedOutput: string
    +type: string
    +ordinal: int
  }

  class "ReorderRequest" as DTOReorderRequest {
    +orderedIDs: []string
    +setVersion: int
  }

  class "CreateSubmissionRequest" as DTOCreateSubmissionRequest {
    +problemID: string
    +language: string
    +source: string
  }

  class "SubmissionStatusResponse" as DTOSubmissionStatusResponse {
    +submissionID: string
    +problemTitle: string
    +language: string
    +status: string
    +verdict: *string
    +createdAt: time.Time
    +startedAt: *time.Time
    +completedAt: *time.Time
  }

  class "SubmissionDetailsResponse" as DTOSubmissionDetailsResponse {
    +submission: SubmissionStatusResponse
    +source: string
    +problemSummary: string
    +compilationOutput: string
    +executedCases: []TestCaseResultResponse
  }

  class "TestCaseResultResponse" as DTOTestCaseResultResponse {
    +testCaseID: string
    +outcome: string
    +runtimeMS: int
    +peakMemoryKB: int
    +message: string
  }

  class "LeaderboardEntryResponse" as DTOLeaderboardEntryResponse {
    +rank: int
    +userID: string
    +username: string
    +displayName: string
    +solvedCount: int
    +submissionCount: int
    +acceptanceRate: float64
  }

  class "UserStatisticsResponse" as DTOUserStatisticsResponse {
    +attemptedCount: int
    +solvedCount: int
    +acceptanceRate: float64
    +difficultyBreakdown: map[string]int
    +tagBreakdown: map[string]int
    +recentSubmissions: []SubmissionStatusResponse
  }
}

package "Account Module (Go)" as AccountModule {
  class "Account" as ACCAccount {
    +ID: AccountID
    +Username: string
    +Email: string
    +DisplayName: string
    +Bio: string
    +Role: Role
    +Status: AccountStatus
    +CreatedAt: time.Time
    +StatusChangedAt: time.Time
    +StatusChangedBy: AccountID
    +CredentialChangedAt: time.Time
    +Version: int
    -credentialHash: string
    +CanLogin(): bool
    +VerifyCredential(plain: string): bool
    +ChangeStatus(next: AccountStatus, actor: AccountID): error
    +UpdateProfile(displayName: string, bio: string, email: string): error
    +RecordCredentialChange(now: time.Time): error
  }

  class "Principal" as ACCPrincipal {
    +UserID: AccountID
    +Role: Role
    +IssuedAt: time.Time
    +ExpiresAt: time.Time
  }

  interface "AccountStore" as ACCAccountStore {
    +FindAccount(ctx: context.Context, id: AccountID): (*Account, error)
    +FindAccountByIdentifier(ctx: context.Context, identifier: string): (*Account, error)
    +AccountExists(ctx: context.Context, username: string, email: string): (bool, error)
    +SaveAccount(ctx: context.Context, account: *Account): error
    +ReadAccountStatus(ctx: context.Context, id: AccountID): (AccountStatus, error)
    +UpdateAccountStatus(ctx: context.Context, id: AccountID, expectedVersion: int, status: AccountStatus, actor: AccountID): error
    +QueryAccounts(ctx: context.Context, filter: AccountFilter, page: PageQuery): (PageResult[AccountSummary], error)
    +ReadAccountDetails(ctx: context.Context, id: AccountID): (*AccountDetails, error)
    +ReadCommittedProfile(ctx: context.Context, id: AccountID): (*AccountProfile, error)
  }

  interface "CredentialVerifier" as ACCCredentialVerifier {
    +Hash(plain: string): (string, error)
    +Verify(hash: string, plain: string): bool
    +NeedsRehash(hash: string): bool
  }

  class "AuthService" as ACCAuthService {
    +Register(ctx: context.Context, req: RegisterRequest): (AccountID, error)
    +Login(ctx: context.Context, req: LoginRequest): (LoginResponse, error)
    +ValidateAccessToken(ctx: context.Context, token: string): (Principal, error)
    +ResolvePrincipal(ctx: context.Context, token: string): (Principal, error)
    +AuthorizeAdministrator(ctx: context.Context, principal: Principal): error
    +CheckAccountActive(ctx: context.Context, userID: AccountID): error
    +IssueAccessToken(ctx: context.Context, account: *Account): (string, error)
    -ValidateRegistrationData(req: RegisterRequest): error
    -VerifyCredential(account: *Account, password: string): error
  }

  class "AccountService" as ACCAccountService {
    +GetOwnAccount(ctx: context.Context, principal: Principal): (*AccountResponse, error)
    +UpdateOwnAccount(ctx: context.Context, principal: Principal, req: UpdateAccountRequest): (*AccountResponse, error)
    +ChangePassword(ctx: context.Context, principal: Principal, req: ChangePasswordRequest): error
    -ValidateAccountInformation(req: UpdateAccountRequest): error
    -ValidateNewCredential(current: string, next: string, confirm: string): error
    -VerifyCurrentCredential(account: *Account, current: string): error
    -CheckEmailAvailability(ctx: context.Context, email: string, self: AccountID): error
    -UpdateCredentialChangeTime(account: *Account): void
    -SaveAccountChanges(ctx: context.Context, account: *Account): error
    -RemoveSensitiveFields(account: *Account): AccountResponse
  }

  class "AdminUserService" as ACCAdminUserService {
    +ListUsers(ctx: context.Context, principal: Principal, filter: AccountFilter, page: PageQuery): (PageResult[AccountSummary], error)
    +GetUserDetails(ctx: context.Context, principal: Principal, userID: AccountID): (*AccountDetails, error)
    +ChangeUserStatus(ctx: context.Context, principal: Principal, userID: AccountID, status: AccountStatus, expectedVersion: int): (*AccountResponse, error)
    -ValidateStatusAction(status: AccountStatus): error
    -PreventSelfStatusChange(actor: AccountID, target: AccountID): error
    -CompareStatusVersion(current: int, expected: int): error
    -ValidatePagination(page: PageQuery): error
    -ValidateSearchAndFilters(filter: AccountFilter): error
    -UpdateAccountStatus(ctx: context.Context, account: *Account, status: AccountStatus, actor: AccountID): error
  }

  class "AccountFilter" as ACCAccountFilter {
    +Username: string
    +Email: string
    +Role: *Role
    +Status: *AccountStatus
  }

  class "AccountSummary" as ACCAccountSummary {
    +ID: AccountID
    +Username: string
    +DisplayName: string
    +Role: Role
    +Status: AccountStatus
    +CreatedAt: time.Time
  }

  class "AccountDetails" as ACCAccountDetails {
    +ID: AccountID
    +Username: string
    +Email: string
    +DisplayName: string
    +Bio: string
    +Role: Role
    +Status: AccountStatus
    +Version: int
    +CreatedAt: time.Time
    +StatusChangedAt: time.Time
    +StatusChangedBy: AccountID
  }

  class "AccountProfile" as ACCAccountProfile {
    +DisplayName: string
    +Bio: string
    +Email: string
  }
}

package "Catalog Module (Go)" as CatalogModule {
  class "Problem" as CATProblem {
    +ID: ProblemID
    +Title: string
    +Statement: string
    +InputFormat: string
    +OutputFormat: string
    +Constraints: string
    +Category: string
    +Difficulty: Difficulty
    +Tags: []string
    +AllowedLanguages: []Language
    +TimeLimitMS: int
    +MemoryLimitMB: int
    +LifecycleStatus: LifecycleStatus
    +PublicationStatus: PublicationStatus
    +Version: int
    +UpdatedAt: time.Time
    +IsPublic(): bool
    +IsEditable(): bool
    +Validate(): error
    +CanPublish(summary: TestCaseSetSummary): error
    +ChangeLifecycle(next: LifecycleStatus): error
    +ChangePublication(next: PublicationStatus): error
  }

  class "PublicStatistics" as CATPublicStatistics {
    +SubmissionCount: int
    +AcceptedSubmissionCount: int
    +AcceptanceRate: float64
  }

  interface "ProblemStore" as CATProblemStore {
    +FindProblem(ctx: context.Context, id: ProblemID): (*Problem, error)
    +SaveProblem(ctx: context.Context, problem: *Problem): error
    +UpdateProblem(ctx: context.Context, problem: *Problem, expectedVersion: int): error
    +SaveProblemState(ctx: context.Context, id: ProblemID, state: LifecycleStatus, expectedVersion: int): error
    +SavePublicationState(ctx: context.Context, id: ProblemID, state: PublicationStatus, expectedVersion: int): error
    +ReadProblemState(ctx: context.Context, id: ProblemID): (*ProblemState, error)
    +ListPublishedProblems(ctx: context.Context, query: ProblemQuery): (PageResult[Problem], error)
    +SearchPublishedProblems(ctx: context.Context, query: ProblemQuery): (PageResult[Problem], error)
    +ReadPublicProblem(ctx: context.Context, id: ProblemID): (*ProblemDetails, error)
    +ReadProblemForSubmission(ctx: context.Context, id: ProblemID): (*ProblemSubmissionContext, error)
    +ReadPublicStatistics(ctx: context.Context, id: ProblemID): (PublicStatistics, error)
  }

  interface "TestCaseSetReader" as CATTestCaseSetReader {
    +GetRequiredCaseTypes(ctx: context.Context, problemID: ProblemID): (TestCaseSetSummary, error)
    +VerifyTestCaseFilesReadable(ctx: context.Context, problemID: ProblemID): error
  }

  class "ProblemQueryService" as CATProblemQueryService {
    +ListPublished(ctx: context.Context, query: ProblemQuery): (PageResult[Problem], error)
    +SearchPublished(ctx: context.Context, query: ProblemQuery): (PageResult[Problem], error)
    +GetPublicProblem(ctx: context.Context, problemID: ProblemID): (*ProblemDetails, error)
    +GetProblemForSubmission(ctx: context.Context, problemID: ProblemID): (*ProblemSubmissionContext, error)
    +GetActiveProblem(ctx: context.Context, problemID: ProblemID): (*Problem, error)
    +GetProblemState(ctx: context.Context, problemID: ProblemID): (*ProblemState, error)
    -BuildPreviews(problems: []Problem): []Problem
    -CheckPublicAvailability(problem: *Problem): error
    -CheckPublicVisibility(problem: *Problem): error
    -VerifyProblemExists(problem: *Problem, err: error): error
  }

  class "ProblemAdminService" as CATProblemAdminService {
    +CreateProblem(ctx: context.Context, principal: Principal, req: ProblemWriteRequest): (*Problem, error)
    +UpdateProblem(ctx: context.Context, principal: Principal, problemID: ProblemID, req: ProblemWriteRequest, expectedVersion: int): (*Problem, error)
    +DeactivateProblem(ctx: context.Context, principal: Principal, problemID: ProblemID, expectedVersion: int): error
    +ReactivateProblem(ctx: context.Context, principal: Principal, problemID: ProblemID, expectedVersion: int): error
    +PublishProblem(ctx: context.Context, principal: Principal, problemID: ProblemID, expectedVersion: int): error
    +UnpublishProblem(ctx: context.Context, principal: Principal, problemID: ProblemID, expectedVersion: int): error
    -ValidateProblemFields(req: ProblemWriteRequest): error
    -ValidateBusinessRules(problem: *Problem): error
    -ValidateUpdate(current: *Problem, next: *Problem): error
    -CheckProblemEditable(problem: *Problem): error
    -CheckActiveState(problem: *Problem): error
    -CheckPublicationEligibility(ctx: context.Context, problem: *Problem): error
    -CompareVersion(current: int, expected: int): error
    -SavePublicationState(ctx: context.Context, problemID: ProblemID, state: PublicationStatus, expectedVersion: int): error
    -HandlePersistenceFailure(err: error): error
  }

  class "ProblemState" as CATProblemState {
    +ID: ProblemID
    +LifecycleStatus: LifecycleStatus
    +PublicationStatus: PublicationStatus
    +Version: int
  }

  class "ProblemDetails" as CATProblemDetails {
    +Problem: Problem
    +Statistics: PublicStatistics
    +SampleCases: []SampleCase
  }

  class "ProblemSubmissionContext" as CATProblemSubmissionContext {
    +ID: ProblemID
    +Title: string
    +TimeLimitMS: int
    +MemoryLimitMB: int
    +AllowedLanguages: []Language
    +LifecycleStatus: LifecycleStatus
    +PublicationStatus: PublicationStatus
  }

  class "SampleCase" as CATSampleCase {
    +ID: TestCaseID
    +Ordinal: int
    +InputPreview: string
    +ExpectedOutputPreview: string
  }

}

package "Test Case Module (Go)" as TestCaseModule {
  class "TestCase" as TCTestCase {
    +ID: TestCaseID
    +ProblemID: ProblemID
    +Type: TestCaseType
    +Ordinal: int
    +Version: int
    +UpdatedAt: time.Time
    -inputRef: string
    -expectedOutputRef: string
    +Validate(): error
    +ChangeType(next: TestCaseType): error
    +SetOrdinal(ordinal: int): error
  }

  class "TestCaseSet" as TCTestCaseSet {
    +ProblemID: ProblemID
    +Version: int
    +Cases: []TestCase
    +ValidateCompleteOrder(ids: []TestCaseID): error
    +NormalizeOrdinals(): void
    +Reorder(ids: []TestCaseID): error
    +Summary(): TestCaseSetSummary
  }

  interface "TestCaseRepository" as TCTestCaseRepository {
    +FindTestCase(ctx: context.Context, id: TestCaseID): (*TestCase, error)
    +ReadTestCaseSet(ctx: context.Context, problemID: ProblemID): (*TestCaseSet, error)
    +ListTestCaseMetadata(ctx: context.Context, problemID: ProblemID): ([]TestCaseMetadata, error)
    +SaveTestCase(ctx: context.Context, testCase: *TestCase): error
    +UpdateTestCase(ctx: context.Context, testCase: *TestCase, expectedVersion: int): error
    +DeleteAndCompactTestCases(ctx: context.Context, problemID: ProblemID, testCaseID: TestCaseID): error
    +SaveTestCaseOrder(ctx: context.Context, problemID: ProblemID, orderedIDs: []TestCaseID, expectedSetVersion: int): error
    +SaveTestCaseType(ctx: context.Context, id: TestCaseID, testCaseType: TestCaseType, expectedVersion: int): error
    +ReadTestCaseType(ctx: context.Context, id: TestCaseID): (TestCaseType, error)
    +ReadTestCaseSetVersion(ctx: context.Context, problemID: ProblemID): (int, error)
  }

  interface "TestCaseStore" as TCTestCaseStore {
    +ReadTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID): (TestCaseFileRefs, error)
    +ReadTestCaseData(ctx: context.Context, testCaseID: TestCaseID): (TestCaseData, error)
    +StoreTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID, data: TestCaseData): error
    +ReplaceChangedFiles(ctx: context.Context, testCaseID: TestCaseID, data: TestCaseData): error
    +VerifyTestCaseFilesReadable(ctx: context.Context, testCaseID: TestCaseID): error
    +DeleteTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID): error
  }

  class "TestCaseService" as TCTestCaseService {
    +CreateTestCase(ctx: context.Context, principal: Principal, problemID: ProblemID, req: TestCaseWriteRequest): (*TestCase, error)
    +UpdateTestCase(ctx: context.Context, principal: Principal, testCaseID: TestCaseID, req: TestCaseWriteRequest, expectedVersion: int): (*TestCase, error)
    +DeleteTestCase(ctx: context.Context, principal: Principal, testCaseID: TestCaseID, expectedVersion: int): error
    +ChangeTestCaseType(ctx: context.Context, principal: Principal, testCaseID: TestCaseID, testCaseType: TestCaseType, expectedVersion: int): (*TestCase, error)
    +ReorderTestCases(ctx: context.Context, principal: Principal, problemID: ProblemID, orderedIDs: []TestCaseID, expectedSetVersion: int): ([]TestCase, error)
    +GetOrderedTestCases(ctx: context.Context, problemID: ProblemID): ([]TestCaseMetadata, error)
    +GetTestCase(ctx: context.Context, testCaseID: TestCaseID): (*TestCase, error)
    +GetTestCaseType(ctx: context.Context, testCaseID: TestCaseID): (TestCaseType, error)
    +GetRequiredCaseTypes(ctx: context.Context, problemID: ProblemID): (TestCaseSetSummary, error)
    +VerifyTestCaseAssociation(ctx: context.Context, problemID: ProblemID, testCaseID: TestCaseID): error
    +GetTestCaseFileReferences(ctx: context.Context, testCaseID: TestCaseID): (TestCaseFileRefs, error)
    +VerifyTestCaseFilesReadable(ctx: context.Context, problemID: ProblemID): error
    -ValidateTestCaseData(req: TestCaseWriteRequest): error
    -ValidateType(testCaseType: TestCaseType): error
    -HandlePersistenceFailure(err: error): error
  }

  class "TestCaseData" as TCTestCaseData {
    +Input: string
    +ExpectedOutput: string
  }

  class "TestCaseFileRefs" as TCTestCaseFileRefs {
    +InputRef: string
    +ExpectedOutputRef: string
  }

  class "TestCaseMetadata" as TCTestCaseMetadata {
    +ID: TestCaseID
    +ProblemID: ProblemID
    +Type: TestCaseType
    +Ordinal: int
    +FileRefs: TestCaseFileRefs
  }

  interface "ProblemLookup" as TCProblemLookup {
    +ProblemExists(ctx: context.Context, problemID: ProblemID): (bool, error)
    +GetProblemLifecycle(ctx: context.Context, problemID: ProblemID): (LifecycleStatus, error)
  }
}

package "Submission Module (Go)" as SubmissionModule {
  class "Submission" as SUBSubmission {
    +ID: SubmissionID
    +UserID: AccountID
    +ProblemID: ProblemID
    +Language: Language
    +Source: string
    +Status: SubmissionStatus
    +Verdict: *Verdict
    +JudgeAttempts: int
    +CreatedAt: time.Time
    +StartedAt: *time.Time
    +CompletedAt: *time.Time
    +UpdatedAt: time.Time
    +RuntimeMS: int
    +PeakMemoryKB: int
    +CompilationOutput: string
    +RetainedProblemSummary: string
    +IsTerminal(): bool
    +CanJudge(): bool
    +MarkCompiling(): error
    +MarkRunning(): error
    +Complete(verdict: Verdict, metrics: ResultMetrics): error
    +MarkInternalError(reason: string): error
    +ValidateSource(maxBytes: int): error
  }

  class "TestCaseResult" as SUBTestCaseResult {
    +TestCaseID: TestCaseID
    +Outcome: TestOutcome
    +RuntimeMS: int
    +PeakMemoryKB: int
    +Message: string
    +IsPassed(): bool
  }

  class "SubmissionSummary" as SUBSubmissionSummary {
    +ID: SubmissionID
    +ProblemID: ProblemID
    +ProblemTitle: string
    +Language: Language
    +Status: SubmissionStatus
    +Verdict: *Verdict
    +CreatedAt: time.Time
  }

  class "JudgeContext" as SUBJudgeContext {
    +Submission: Submission
    +Problem: ProblemSubmissionContext
    +TestCases: []TestCaseMetadata
  }

  interface "SubmissionStore" as SUBSubmissionStore {
    +StoreSubmissionAndEvent(ctx: context.Context, submission: *Submission, event: *OutboxEvent): error
    +LoadSubmission(ctx: context.Context, id: SubmissionID): (*Submission, error)
    +LoadSubmissionContext(ctx: context.Context, id: SubmissionID): (*JudgeContext, error)
    +ReadSubmissionStatus(ctx: context.Context, id: SubmissionID): (*SubmissionStatusResponse, error)
    +ReadSubmissionResult(ctx: context.Context, id: SubmissionID): (*SubmissionDetailsResponse, error)
    +ReadSubmissionDetails(ctx: context.Context, id: SubmissionID): (*SubmissionDetailsResponse, error)
    +QuerySubmissionSummaries(ctx: context.Context, filter: SubmissionFilter, page: PageQuery): (PageResult[SubmissionSummary], error)
    +ReadOwnSubmissionSummaries(ctx: context.Context, userID: AccountID, page: PageQuery): (PageResult[SubmissionSummary], error)
    +PersistTerminalResult(ctx: context.Context, result: *JudgeResult): error
    +PersistInternalError(ctx: context.Context, id: SubmissionID, reason: string): error
    +MarkInternalError(ctx: context.Context, id: SubmissionID, reason: string): error
    +ResetToQueued(ctx: context.Context, id: SubmissionID): error
    +UpdateStatus(ctx: context.Context, id: SubmissionID, status: SubmissionStatus): error
    +IncrementAttemptAndSetCompiling(ctx: context.Context, id: SubmissionID): error
    +SetRunning(ctx: context.Context, id: SubmissionID): error
    +RollBackUncommittedChanges(ctx: context.Context): error
  }

  class "SubmissionCommandService" as SUBSubmissionCommandService {
    +CreateSubmission(ctx: context.Context, principal: Principal, req: CreateSubmissionRequest): (SubmissionStatusResponse, error)
    -ValidateSubmission(ctx: context.Context, req: CreateSubmissionRequest, problem: *ProblemSubmissionContext): error
    -BuildSubmission(ctx: context.Context, principal: Principal, req: CreateSubmissionRequest): (*Submission, *OutboxEvent, error)
    -StoreSubmissionAndEvent(ctx: context.Context, submission: *Submission, event: *OutboxEvent): error
    -HandlePersistenceFailure(err: error): error
  }

  class "SubmissionQueryService" as SUBSubmissionQueryService {
    +GetStatus(ctx: context.Context, principal: Principal, submissionID: SubmissionID): (*SubmissionStatusResponse, error)
    +GetResult(ctx: context.Context, principal: Principal, submissionID: SubmissionID): (*SubmissionDetailsResponse, error)
    +GetHistory(ctx: context.Context, principal: Principal, page: PageQuery, filter: SubmissionFilter): (PageResult[SubmissionSummary], error)
    +GetDetails(ctx: context.Context, principal: Principal, submissionID: SubmissionID): (*SubmissionDetailsResponse, error)
    +ListAll(ctx: context.Context, principal: Principal, filter: SubmissionFilter, page: PageQuery): (PageResult[SubmissionSummary], error)
    +GetAnyDetails(ctx: context.Context, principal: Principal, submissionID: SubmissionID): (*SubmissionDetailsResponse, error)
    -CheckOwnership(submission: *Submission, principal: Principal): error
    -AssembleStatusAndTimestamps(submission: *Submission): *SubmissionStatusResponse
    -AssembleStoredResult(submission: *Submission): (*SubmissionDetailsResponse, error)
    -AssembleSubmissionDetails(submission: *Submission): (*SubmissionDetailsResponse, error)
    -ExcludeHiddenTestData(details: *SubmissionDetailsResponse): void
    -IncludeVerdictOnlyWhenCompleted(view: *SubmissionStatusResponse, submission: *Submission): void
    -BoundCompilationInformation(output: string): string
    -ValidateFilters(filter: SubmissionFilter): error
    -ValidatePagination(page: PageQuery): error
    -HandleQueryFailure(err: error): error
  }

  class "SubmissionFilter" as SUBSubmissionFilter {
    +ProblemID: *ProblemID
    +Verdict: *Verdict
    +Status: *SubmissionStatus
  }

  class "JudgeResult" as SUBJudgeResult {
    +SubmissionID: SubmissionID
    +Verdict: Verdict
    +Metrics: ResultMetrics
    +CaseResults: []TestCaseResult
    +CompilationOutput: string
  }

  class "ResultMetrics" as SUBResultMetrics {
    +RuntimeMS: int
    +PeakMemoryKB: int
  }
}

package "Progress Module (Go)" as ProgressModule {
  class "LeaderboardEntry" as PRGLeaderboardEntry {
    +Rank: int
    +UserID: AccountID
    +Username: string
    +DisplayName: string
    +SolvedCount: int
    +SubmissionCount: int
    +AcceptanceRate: float64
  }

  class "UserStatistics" as PRGUserStatistics {
    +UserID: AccountID
    +AttemptedCount: int
    +SolvedCount: int
    +AcceptanceRate: float64
    +DifficultyBreakdown: map[Difficulty]Breakdown
    +TagBreakdown: map[string]Breakdown
    +RecentSubmissions: []SubmissionSummary
  }

  class "Breakdown" as PRGBreakdown {
    +Attempted: int
    +Solved: int
  }

  interface "ProgressStore" as PRGProgressStore {
    +ReadUserActivitySummary(ctx: context.Context, userID: AccountID): (*UserStatistics, error)
    +ReadLeaderboard(ctx: context.Context, page: PageQuery): (PageResult[LeaderboardEntry], error)
    +ReadSubmissionAndProblemAggregates(ctx: context.Context, userID: AccountID): (*UserStatistics, error)
  }

  class "ProgressService" as PRGProgressService {
    +GetOwnStatistics(ctx: context.Context, principal: Principal): (*UserStatistics, error)
    +GetUserActivitySummary(ctx: context.Context, userID: AccountID): (*UserStatistics, error)
    +GetLeaderboard(ctx: context.Context, page: PageQuery): (PageResult[LeaderboardEntry], error)
    -CalculateAcceptanceRate(total: int, accepted: int): float64
    -CalculateAttemptedAndSolvedCounts(rows: []UserStatistics): (int, int)
    -CalculateDifficultyBreakdown(rows: []UserStatistics): map[Difficulty]Breakdown
    -CalculateTagBreakdown(rows: []UserStatistics): map[string]Breakdown
    -AssembleRecentSubmissions(rows: []SubmissionSummary): []SubmissionSummary
    -RankEntries(entries: []LeaderboardEntry): []LeaderboardEntry
    -ValidatePagination(page: PageQuery): error
  }
}

package "Judge Module (Go)" as JudgeModule {
  class "JudgeWorker" as JDGJudgeWorker {
    +Run(ctx: context.Context): error
    +ProcessNext(ctx: context.Context): error
    +RecoverPendingSubmissions(ctx: context.Context): error
    +AcknowledgeAfterCommit(ctx: context.Context, message: QueueMessage): error
    +LeaveMessagePending(ctx: context.Context, message: QueueMessage): void
    -SelectEligibleMessages(ctx: context.Context): ([]QueueMessage, error)
    -InspectSubmission(ctx: context.Context, submissionID: SubmissionID): (*Submission, error)
    -ResetInterruptedSubmission(ctx: context.Context, submission: *Submission): error
    -MarkAttemptLimitReached(ctx: context.Context, submission: *Submission): error
    -WaitForNextCycle(ctx: context.Context): error
    -ValidateConfiguration(): error
  }

  class "SubmissionProcessor" as JDGSubmissionProcessor {
    +Process(ctx: context.Context, submissionID: SubmissionID): error
    +ValidateSubmission(ctx: context.Context, submission: *Submission): error
    +PersistResult(ctx: context.Context, result: *JudgeResult): error
    -HandleInfrastructureFailure(ctx: context.Context, submission: *Submission, err: error): void
    -HandleUnexpectedError(ctx: context.Context, submission: *Submission, err: error): void
    -PersistInternalError(ctx: context.Context, submissionID: SubmissionID, reason: string): error
    -LoadContext(ctx: context.Context, submissionID: SubmissionID): (*JudgeContext, error)
  }

  class "Compiler" as JDGCompiler {
    +Compile(ctx: context.Context, submission: *Submission): (CompileResult, error)
  }

  class "TestCaseExecutor" as JDGTestCaseExecutor {
    +Execute(ctx: context.Context, submission: *Submission, testCases: []TestCaseMetadata): ([]TestCaseResult, error)
    -ExecuteOne(ctx: context.Context, submission: *Submission, testCase: TestCaseMetadata): (TestCaseResult, error)
  }

  class "VerdictEvaluator" as JDGVerdictEvaluator {
    +DetermineVerdict(compilation: CompileResult, results: []TestCaseResult, expectedTotal: int): (Verdict, ResultMetrics)
    -CompareOutput(expected: string, actual: string): (bool, error)
    -NormalizeOutput(value: string): []string
    -IsOutputCapped(value: string): bool
  }

  class "ResourceCleaner" as JDGResourceCleaner {
    +CleanTemporaryWorkspaces(ctx: context.Context, submissionIDs: []SubmissionID): error
    +CleanFailedResources(ctx: context.Context, submissionID: SubmissionID): error
    +CleanTemporaryResources(ctx: context.Context, submissionIDs: []SubmissionID): error
    +ScheduleOrphanCleanup(ctx: context.Context, candidateSubmissionIDs: []SubmissionID): error
    +RemoveOrphanedExecutionResources(ctx: context.Context, candidateSubmissionIDs: []SubmissionID): error
  }
}

package "Outbox Module (Go)" as OutboxModule {
  class "OutboxEvent" as OUTOutboxEvent {
    +ID: EventID
    +SubmissionID: SubmissionID
    +CreatedAt: time.Time
    +PublishedAt: *time.Time
    +IsPublished(): bool
    +MarkPublished(now: time.Time): void
  }

  interface "OutboxStore" as OUTOutboxStore {
    +FindUnpublishedEvents(ctx: context.Context, limit: int): ([]OutboxEvent, error)
    +MarkEventPublished(ctx: context.Context, eventID: EventID): error
  }

  class "OutboxDispatcher" as OUTOutboxDispatcher {
    +Run(ctx: context.Context): error
    +DispatchOnce(ctx: context.Context): error
    -FindUnpublishedEvents(ctx: context.Context): ([]OutboxEvent, error)
    -PublishSubmissionEvent(ctx: context.Context, event: *OutboxEvent): error
    -MarkEventPublished(ctx: context.Context, eventID: EventID): error
  }
}

package "Persistence Subsystem (Go)" as Persistence {
  class "AccountPostgresStore" as PSAccountStore {
    -db: PostgresDB
    +FindAccount(ctx: context.Context, id: AccountID): (*Account, error)
    +FindAccountByIdentifier(ctx: context.Context, identifier: string): (*Account, error)
    +AccountExists(ctx: context.Context, username: string, email: string): (bool, error)
    +SaveAccount(ctx: context.Context, account: *Account): error
    +ReadAccountStatus(ctx: context.Context, id: AccountID): (AccountStatus, error)
    +UpdateAccountStatus(ctx: context.Context, id: AccountID, expectedVersion: int, status: AccountStatus, actor: AccountID): error
    +QueryAccounts(ctx: context.Context, filter: AccountFilter, page: PageQuery): (PageResult[AccountSummary], error)
    +ReadAccountDetails(ctx: context.Context, id: AccountID): (*AccountDetails, error)
    +ReadCommittedProfile(ctx: context.Context, id: AccountID): (*AccountProfile, error)
  }

  class "ProblemPostgresStore" as PSProblemStore {
    -db: PostgresDB
    +FindProblem(ctx: context.Context, id: ProblemID): (*Problem, error)
    +SaveProblem(ctx: context.Context, problem: *Problem): error
    +UpdateProblem(ctx: context.Context, problem: *Problem, expectedVersion: int): error
    +SaveProblemState(ctx: context.Context, id: ProblemID, state: LifecycleStatus, expectedVersion: int): error
    +SavePublicationState(ctx: context.Context, id: ProblemID, state: PublicationStatus, expectedVersion: int): error
    +ReadProblemState(ctx: context.Context, id: ProblemID): (*ProblemState, error)
    +ListPublishedProblems(ctx: context.Context, query: ProblemQuery): (PageResult[Problem], error)
    +SearchPublishedProblems(ctx: context.Context, query: ProblemQuery): (PageResult[Problem], error)
    +ReadPublicProblem(ctx: context.Context, id: ProblemID): (*ProblemDetails, error)
    +ReadProblemForSubmission(ctx: context.Context, id: ProblemID): (*ProblemSubmissionContext, error)
    +ReadPublicStatistics(ctx: context.Context, id: ProblemID): (PublicStatistics, error)
  }

  class "TestCasePostgresRepository" as PSTestCaseRepository {
    -db: PostgresDB
    +FindTestCase(ctx: context.Context, id: TestCaseID): (*TestCase, error)
    +ReadTestCaseSet(ctx: context.Context, problemID: ProblemID): (*TestCaseSet, error)
    +ListTestCaseMetadata(ctx: context.Context, problemID: ProblemID): ([]TestCaseMetadata, error)
    +SaveTestCase(ctx: context.Context, testCase: *TestCase): error
    +UpdateTestCase(ctx: context.Context, testCase: *TestCase, expectedVersion: int): error
    +DeleteAndCompactTestCases(ctx: context.Context, problemID: ProblemID, testCaseID: TestCaseID): error
    +SaveTestCaseOrder(ctx: context.Context, problemID: ProblemID, orderedIDs: []TestCaseID, expectedSetVersion: int): error
    +SaveTestCaseType(ctx: context.Context, id: TestCaseID, testCaseType: TestCaseType, expectedVersion: int): error
    +ReadTestCaseType(ctx: context.Context, id: TestCaseID): (TestCaseType, error)
    +ReadTestCaseSetVersion(ctx: context.Context, problemID: ProblemID): (int, error)
  }

  class "SubmissionPostgresStore" as PSSubmissionStore {
    -db: PostgresDB
    +StoreSubmissionAndEvent(ctx: context.Context, submission: *Submission, event: *OutboxEvent): error
    +LoadSubmission(ctx: context.Context, id: SubmissionID): (*Submission, error)
    +LoadSubmissionContext(ctx: context.Context, id: SubmissionID): (*JudgeContext, error)
    +ReadSubmissionStatus(ctx: context.Context, id: SubmissionID): (*SubmissionStatusResponse, error)
    +ReadSubmissionResult(ctx: context.Context, id: SubmissionID): (*SubmissionDetailsResponse, error)
    +ReadSubmissionDetails(ctx: context.Context, id: SubmissionID): (*SubmissionDetailsResponse, error)
    +QuerySubmissionSummaries(ctx: context.Context, filter: SubmissionFilter, page: PageQuery): (PageResult[SubmissionSummary], error)
    +ReadOwnSubmissionSummaries(ctx: context.Context, userID: AccountID, page: PageQuery): (PageResult[SubmissionSummary], error)
    +PersistTerminalResult(ctx: context.Context, result: *JudgeResult): error
    +PersistInternalError(ctx: context.Context, id: SubmissionID, reason: string): error
    +MarkInternalError(ctx: context.Context, id: SubmissionID, reason: string): error
    +ResetToQueued(ctx: context.Context, id: SubmissionID): error
    +UpdateStatus(ctx: context.Context, id: SubmissionID, status: SubmissionStatus): error
    +IncrementAttemptAndSetCompiling(ctx: context.Context, id: SubmissionID): error
    +SetRunning(ctx: context.Context, id: SubmissionID): error
    +RollBackUncommittedChanges(ctx: context.Context): error
  }

  class "ProgressPostgresStore" as PSProgressStore {
    -db: PostgresDB
    +ReadUserActivitySummary(ctx: context.Context, userID: AccountID): (*UserStatistics, error)
    +ReadLeaderboard(ctx: context.Context, page: PageQuery): (PageResult[LeaderboardEntry], error)
    +ReadSubmissionAndProblemAggregates(ctx: context.Context, userID: AccountID): (*UserStatistics, error)
  }

  class "OutboxPostgresStore" as PSOutboxStore {
    -db: PostgresDB
    +FindUnpublishedEvents(ctx: context.Context, limit: int): ([]OutboxEvent, error)
    +MarkEventPublished(ctx: context.Context, eventID: EventID): error
  }
}

package "Message Queue Subsystem (Go)" as MessageQueue {
  interface "SubmissionQueue" as MQSubmissionQueue {
    +Enqueue(ctx: context.Context, message: QueueMessage): error
    +Read(ctx: context.Context, consumer: string, count: int): ([]QueueMessage, error)
    +Acknowledge(ctx: context.Context, message: QueueMessage): error
    +LeavePending(ctx: context.Context, message: QueueMessage): error
    +ClaimStale(ctx: context.Context, consumer: string, olderThan: time.Duration): ([]QueueMessage, error)
  }

  class "QueueMessage" as MQQueueMessage {
    +ID: MessageID
    +EventID: EventID
    +SubmissionID: SubmissionID
    +Attempt: int
    +EnqueuedAt: time.Time
  }

  class "RedisStreamQueue" as MQRedisStreamQueue {
    -client: RedisStreamClient
    -streamKey: string
    -consumerGroup: string
    +Enqueue(ctx: context.Context, message: QueueMessage): error
    +Read(ctx: context.Context, consumer: string, count: int): ([]QueueMessage, error)
    +Acknowledge(ctx: context.Context, message: QueueMessage): error
    +LeavePending(ctx: context.Context, message: QueueMessage): error
    +ClaimStale(ctx: context.Context, consumer: string, olderThan: time.Duration): ([]QueueMessage, error)
  }
}

package "Execution Subsystem (Go)" as Execution {
  interface "ExecutionEnvironment" as EXEExecutionEnvironment {
    +Compile(ctx: context.Context, request: CompileRequest): (CompileResult, error)
    +Execute(ctx: context.Context, request: ExecutionRequest): (ExecutionResult, error)
    +Cleanup(ctx: context.Context, submissionID: SubmissionID): error
  }

  class "CompileRequest" as EXECompileRequest {
    +SubmissionID: SubmissionID
    +Language: Language
    +Source: string
  }

  class "ExecutionRequest" as EXEExecutionRequest {
    +SubmissionID: SubmissionID
    +ArtifactPath: string
    +Input: string
    +ExpectedOutput: string
    +Limits: ExecutionLimits
  }

  class "ExecutionLimits" as EXEExecutionLimits {
    +TimeLimitMS: int
    +MemoryLimitMB: int
  }

  class "CompileResult" as EXECompileResult {
    +Succeeded: bool
    +Output: string
    +ArtifactPath: string
  }

  class "ExecutionResult" as EXEExecutionResult {
    +Stdout: string
    +Stderr: string
    +ExitCode: int
    +RuntimeMS: int
    +PeakMemoryKB: int
    +TimedOut: bool
    +MemoryExceeded: bool
    +IsSuccessful(): bool
  }

  class "DockerExecutionEnvironment" as EXEDockerExecutionEnvironment
}

package "Protected Test Case Store Subsystem (Go)" as ProtectedStore {
  class "FileSystemTestCaseStore" as FSFileSystemTestCaseStore {
    -rootDir: string
    +ReadTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID): (TestCaseFileRefs, error)
    +ReadTestCaseData(ctx: context.Context, testCaseID: TestCaseID): (TestCaseData, error)
    +StoreTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID, data: TestCaseData): error
    +ReplaceChangedFiles(ctx: context.Context, testCaseID: TestCaseID, data: TestCaseData): error
    +VerifyTestCaseFilesReadable(ctx: context.Context, testCaseID: TestCaseID): error
    +DeleteTestCaseFiles(ctx: context.Context, testCaseID: TestCaseID): error
  }
}

package "Security Subsystem (Go)" as Security {
  class "Argon2idVerifier" as SECArgon2idVerifier {
    +Hash(plain: string): (string, error)
    +Verify(hash: string, plain: string): bool
    +NeedsRehash(hash: string): bool
  }
}

package "Integration Adapters (Go)" as Integration {
  class "TestCaseSetReaderAdapter" as INTTestCaseSetReaderAdapter

  class "ProblemLookupAdapter" as INTProblemLookupAdapter
}

' ---------------------------------------------------------------------------
' Presentation relationships
' ---------------------------------------------------------------------------
UIAppShell --> UIAuthProvider
UIAppShell --> UIProblemBrowser
UIAppShell --> UIPracticeWorkspace
UIAppShell --> UISubmissionTracker
UIAppShell --> UISubmissionBrowser
UIAppShell --> UIProgressDashboard
UIAppShell --> UIAdminConsole

UIAuthProvider --> UIAccountApi
UIAuthProvider ..> UIAuthState

UIAccountApi --> UIHttpClient
UIProblemApi --> UIHttpClient
UITestCaseApi --> UIHttpClient
UISubmissionApi --> UIHttpClient
UIProgressApi --> UIHttpClient

UIProblemBrowser --> UIProblemApi
UIPracticeWorkspace --> UIProblemApi
UIPracticeWorkspace --> UISubmissionApi
UIPracticeWorkspace ..> UIProblemDraft
UIPracticeWorkspace ..> UIEditorConfig

UISubmissionTracker --> UISubmissionApi
UISubmissionTracker ..> UIUsePolling

UISubmissionBrowser --> UISubmissionApi
UIProgressDashboard --> UIProgressApi

UIAdminConsole --> UIAccountApi
UIAdminConsole --> UIProblemApi
UIAdminConsole --> UITestCaseApi
UIAdminConsole --> UISubmissionApi
UIAdminConsole ..> UIProblemDraft
UIAdminConsole ..> UITestCaseDraft

' ---------------------------------------------------------------------------
' HTTP boundary relationships
' ---------------------------------------------------------------------------
API ..> Contracts : request and response records

APIRouter --> APIAuthMiddleware
APIRouter --> APIRateLimiter
APIRouter --> APIAuthHandler
APIRouter --> APIAccountHandler
APIRouter --> APIProblemHandler
APIRouter --> APITestCaseHandler
APIRouter --> APISubmissionHandler
APIRouter --> APIProgressHandler

APIAuthMiddleware --> ACCAuthService

APIAuthHandler --> ACCAuthService
APIAccountHandler --> ACCAccountService
APIAccountHandler --> ACCAdminUserService
APIProblemHandler --> CATProblemQueryService
APIProblemHandler --> CATProblemAdminService
APITestCaseHandler --> TCTestCaseService
APISubmissionHandler --> SUBSubmissionCommandService
APISubmissionHandler --> SUBSubmissionQueryService
APIProgressHandler --> PRGProgressService

' ---------------------------------------------------------------------------
' Account module relationships
' ---------------------------------------------------------------------------
ACCAuthService --> ACCAccountStore
ACCAuthService --> ACCCredentialVerifier
ACCAuthService ..> ACCAccount
ACCAuthService ..> ACCPrincipal

ACCAccountService --> ACCAccountStore
ACCAccountService ..> ACCAccount

ACCAdminUserService --> ACCAccountStore
ACCAdminUserService ..> ACCAccount
ACCAdminUserService ..> ACCAccountFilter
ACCAdminUserService ..> ACCAccountDetails

ACCAccountStore ..> ACCAccountSummary
ACCAccountStore ..> ACCAccountDetails
ACCAccountStore ..> ACCAccountProfile

' ---------------------------------------------------------------------------
' Catalog module relationships
' ---------------------------------------------------------------------------
CATProblemQueryService --> CATProblemStore
CATProblemAdminService --> CATProblemStore
CATProblemAdminService --> CATTestCaseSetReader

CATProblemQueryService ..> CATProblem
CATProblemAdminService ..> CATProblem
CATProblem ..> DTTestCaseSetSummary

CATProblemDetails --> "1" CATProblem
CATProblemDetails *-- "1" CATPublicStatistics
CATProblemDetails *-- "0..*" CATSampleCase

CATProblemStore ..> CATProblemState
CATProblemStore ..> CATProblemDetails
CATProblemStore ..> CATProblemSubmissionContext
CATProblemStore ..> CATPublicStatistics

' ---------------------------------------------------------------------------
' Test Case module relationships
' ---------------------------------------------------------------------------
TCTestCaseService --> TCTestCaseRepository
TCTestCaseService --> TCTestCaseStore
TCTestCaseService --> TCProblemLookup

TCTestCaseSet "1" *-- "0..*" TCTestCase
TCTestCaseMetadata *-- "1" TCTestCaseFileRefs

TCTestCaseRepository ..> TCTestCase
TCTestCaseRepository ..> TCTestCaseMetadata
TCTestCaseStore ..> TCTestCaseData
TCTestCaseStore ..> TCTestCaseFileRefs
TCTestCaseSet ..> DTTestCaseSetSummary

' ---------------------------------------------------------------------------
' Submission module relationships
' ---------------------------------------------------------------------------
SUBSubmissionCommandService --> SUBSubmissionStore
SUBSubmissionCommandService --> CATProblemQueryService
SUBSubmissionCommandService ..> SUBSubmission
SUBSubmissionCommandService ..> OUTOutboxEvent
SUBSubmissionCommandService ..> CATProblemSubmissionContext

SUBSubmissionQueryService --> SUBSubmissionStore
SUBSubmissionQueryService ..> SUBSubmission

SUBSubmission "1" *-- "0..*" SUBTestCaseResult
SUBSubmissionStore ..> SUBJudgeContext
SUBSubmissionStore ..> SUBSubmissionFilter
SUBSubmissionStore ..> SUBSubmissionSummary
SUBSubmissionStore ..> OUTOutboxEvent

SUBJudgeContext --> "1" SUBSubmission
SUBJudgeContext --> "1" CATProblemSubmissionContext
SUBJudgeContext --> "1..*" TCTestCaseMetadata

SUBJudgeResult *-- "0..*" SUBTestCaseResult
SUBJudgeResult *-- "1" SUBResultMetrics

' ---------------------------------------------------------------------------
' Progress module relationships
' ---------------------------------------------------------------------------
PRGProgressService --> PRGProgressStore
PRGProgressService ..> PRGUserStatistics
PRGUserStatistics *-- "0..*" PRGBreakdown
PRGUserStatistics o-- "0..*" SUBSubmissionSummary : recentSubmissions
PRGProgressStore ..> PRGUserStatistics
PRGProgressStore ..> PRGLeaderboardEntry

' ---------------------------------------------------------------------------
' Judge module relationships
' ---------------------------------------------------------------------------
JDGJudgeWorker --> MQSubmissionQueue
JDGJudgeWorker --> SUBSubmissionStore
JDGJudgeWorker --> JDGSubmissionProcessor
JDGJudgeWorker --> JDGResourceCleaner
JDGJudgeWorker ..> MQQueueMessage

JDGSubmissionProcessor --> JDGCompiler
JDGSubmissionProcessor --> JDGTestCaseExecutor
JDGSubmissionProcessor --> JDGVerdictEvaluator
JDGSubmissionProcessor --> JDGResourceCleaner
JDGSubmissionProcessor --> SUBSubmissionStore
JDGSubmissionProcessor --> EXEExecutionEnvironment
JDGSubmissionProcessor ..> SUBJudgeContext
JDGSubmissionProcessor ..> SUBJudgeResult

JDGCompiler --> EXEExecutionEnvironment
JDGCompiler ..> EXECompileRequest

JDGTestCaseExecutor --> EXEExecutionEnvironment
JDGTestCaseExecutor --> TCTestCaseStore
JDGTestCaseExecutor ..> EXEExecutionRequest
JDGTestCaseExecutor ..> EXEExecutionLimits
JDGTestCaseExecutor ..> EXEExecutionResult
JDGVerdictEvaluator ..> SUBTestCaseResult
JDGVerdictEvaluator ..> EXECompileResult
JDGResourceCleaner --> EXEExecutionEnvironment

' ---------------------------------------------------------------------------
' Outbox module relationships
' ---------------------------------------------------------------------------
OUTOutboxDispatcher --> OUTOutboxStore
OUTOutboxDispatcher --> MQSubmissionQueue
OUTOutboxDispatcher ..> OUTOutboxEvent
OUTOutboxDispatcher ..> MQQueueMessage

' ---------------------------------------------------------------------------
' Subsystem realizations
' ---------------------------------------------------------------------------
PSAccountStore ..|> ACCAccountStore
PSProblemStore ..|> CATProblemStore
PSTestCaseRepository ..|> TCTestCaseRepository
PSSubmissionStore ..|> SUBSubmissionStore
PSProgressStore ..|> PRGProgressStore
PSOutboxStore ..|> OUTOutboxStore

MQRedisStreamQueue ..|> MQSubmissionQueue
EXEDockerExecutionEnvironment ..|> EXEExecutionEnvironment
FSFileSystemTestCaseStore ..|> TCTestCaseStore
SECArgon2idVerifier ..|> ACCCredentialVerifier

INTTestCaseSetReaderAdapter ..|> CATTestCaseSetReader
INTTestCaseSetReaderAdapter --> TCTestCaseService
INTProblemLookupAdapter ..|> TCProblemLookup
INTProblemLookupAdapter --> CATProblemQueryService

@enduml
```

## 4. Type and Naming Conventions

- Defined identifier types are string-based Go types: `AccountID`, `ProblemID`, `TestCaseID`, `SubmissionID`, `EventID`, and `MessageID`. Using distinct types prevents accidental identifier interchange.
- Enumerations from the ACD's status, verdict, role, and classification attributes are modeled as Go defined string types with the constants shown in the `Shared Domain Types` package.
- `TestCaseSetSummary` is a shared read model because both the catalog and test-case modules need publication-readiness information without importing each other's internals.
- Optional values use Go pointers (`*T`) where absence is meaningful, for example `*Verdict`, `*time.Time`, and `*ProblemID`.
- Collection types use slices for ordered or bounded collections and maps for keyed breakdowns. Multiplicity in the diagram matches the declared Go types.
- Exported members use `+`; package-private fields and helpers use `-`. No `#` visibility is used because Go has no protected visibility.
- The React types are TypeScript interfaces or type aliases that mirror the HTTP contracts. They are intentionally separate from the Go contract structs so the UI does not import backend code.
- Application services accept request contracts and return response or read-model contracts from `Application Contracts`. That package depends only on primitive and local response types, so module dependencies point toward the contracts package rather than back into domain modules.

## 5. Traceability to the Analysis Class Diagram

### 5.1 ACD class disposition

| ACD class | ACD kind | DCD destination | Disposition |
|---|---|---|---|
| User Interface | Boundary | `React SPA` package: `AppShell`, `AuthProvider`, `ProblemBrowser`, `PracticeWorkspace`, `SubmissionTracker`, `SubmissionBrowser`, `ProgressDashboard`, `usePolling`, typed drafts and auth state | Split by capability; shared shell and cross-cutting hook extracted. |
| Administrator Interface | Boundary | `React SPA` package: `AdminConsole`, `ProblemDraft`, `TestCaseDraft`; administrator actions delegated to typed API clients | Consolidated into one console component with capability-specific API clients. |
| Application API | Boundary | `HTTP API` package: `Router`, handlers, `AuthMiddleware`, `RateLimiter`; DTOs in `Application Contracts` | Split per resource; transport concerns separated from application services. |
| Persistence Interface | Boundary | `Persistence Subsystem` package: module-declared ports realized by Postgres adapters | Modeled as a subsystem. Internal schema and query details are omitted. |
| Message Queue Interface | Boundary | `Message Queue Subsystem` package: `SubmissionQueue` and `RedisStreamQueue` | Modeled as a subsystem with a provided port and one adapter. |
| Execution Environment Interface | Boundary | `Execution Subsystem` package: `ExecutionEnvironment`, limit/result types, `DockerExecutionEnvironment` | Modeled as a subsystem with a provided port and one adapter. |
| Protected Test Case Store Interface | Boundary | `Protected Test Case Store Subsystem` package: `FileSystemTestCaseStore` realizing `TestCaseStore` | Modeled as a subsystem. Protected-volume layout and permissions are detailed in its subsystem design; application-level encryption is not specified. |
| Account and Auth | Control | `Account Module`: `AuthService`, `AccountService`, `AdminUserService` | Split by authentication, self-service, and administration responsibilities. |
| Problem Catalog | Control | `Catalog Module`: `ProblemQueryService`, `ProblemAdminService` | Split read/public behavior from administrative mutation behavior. |
| Test Case Management | Control | `Test Case Module`: `TestCaseService` | Retained as one cohesive service; cross-module problem checks use `ProblemLookup`. |
| Submission Management | Control | `Submission Module`: `SubmissionCommandService`, `SubmissionQueryService` | Split command and query responsibilities. |
| Progress and Leaderboard | Control | `Progress Module`: `ProgressService` | Retained; aggregation helpers remain private. |
| Judge Worker | Control | `Judge Module`: `JudgeWorker`, `SubmissionProcessor`, `Compiler`, `TestCaseExecutor`, `VerdictEvaluator`, `ResourceCleaner` | Split queue lifecycle, orchestration, compilation, execution, verdict evaluation, and cleanup. |
| Outbox Dispatcher | Control | `Outbox Module`: `OutboxDispatcher` | Retained; publication through the queue port. |
| Account | Entity | `Account Module`: `Account`, `AccountSummary`, `AccountDetails`, `AccountProfile`, `AccountFilter` | Entity retained; query projections and filters added as read models. |
| Problem | Entity | `Catalog Module`: `Problem`, `ProblemState`, `ProblemDetails`, `ProblemSubmissionContext`, `SampleCase`; consumes shared `TestCaseSetSummary` | Entity retained; state and read models separated from the aggregate. |
| Test Case | Entity | `Test Case Module`: `TestCase`, `TestCaseSet`, `TestCaseData`, `TestCaseFileRefs`, `TestCaseMetadata`; produces shared `TestCaseSetSummary` | Entity retained; set aggregate and metadata projection added. `TestCaseSetSummary` is a shared publication-readiness read model. |
| Submission | Entity | `Submission Module`: `Submission`, `SubmissionFilter`, `SubmissionSummary`, `JudgeContext`, `JudgeResult`, `ResultMetrics` | Entity retained; read models and judge hand-off types separated. |
| Test Case Result | Entity | `Submission Module`: `TestCaseResult`; used by `JudgeResult` and submission details | Retained as an owned part of the submission result. |
| Leaderboard Entry | Entity | `Progress Module`: `LeaderboardEntry` | Retained as a projection. |
| User Statistics | Entity | `Progress Module`: `UserStatistics`, `Breakdown` | Retained; breakdown extracted as a value type. |
| Outbox Event | Entity | `Outbox Module`: `OutboxEvent` | Retained. |
| Public Statistics | Entity | `Catalog Module`: `PublicStatistics`; owned by `ProblemDetails` | Retained as a derived read model. |

### 5.2 Operation disposition

| ACD operation group | DCD destination |
|---|---|
| Account registration, login, token validation, administrator authorization | `AuthService` |
| Profile view/update, password change | `AccountService` |
| User search, user details, account-status change | `AdminUserService` |
| Problem browse, search, details, editor context, submission context | `ProblemQueryService` |
| Problem create, update, deactivate/reactivate, publish/unpublish | `ProblemAdminService` |
| Test-case create, update, delete, reorder, type change, order/type queries | `TestCaseService` |
| Submission create and immediate status response | `SubmissionCommandService` |
| Submission status, result, history, details, administrative inspection | `SubmissionQueryService` |
| Statistics and leaderboard retrieval | `ProgressService` |
| Queue polling, recovery, retry-limit handling, acknowledgement | `JudgeWorker` |
| Compile, execute cases, evaluate verdict, clean resources | `Compiler`, `TestCaseExecutor`, `VerdictEvaluator`, `ResourceCleaner` |
| Persist submission and event atomically | `SubmissionStore.StoreSubmissionAndEvent` |
| Publish unpublished outbox events | `OutboxDispatcher` |
| Persistence, queueing, execution, protected file access, credential hashing | Subsystem ports and adapters listed in section 3 |

### 5.3 Explicit exclusions

- ACD Boundary elements do not carry domain rules in the DCD. Validation and authorization decisions appear on the application service that owns them.
- Presentation-only display, reload, and retry operations from the ACD are consolidated into component behavior, hooks, or API-client calls rather than reproduced as separate methods.
- Subsystem internals, database schemas, stream key layouts, container-image details, and file-encryption details are deliberately omitted.
- Dependency construction and configuration are performed by a composition root and are not modeled as domain or application-class behavior.
- `INTERNAL_ERROR` remains a `SubmissionStatus` and is not modeled as a `Verdict`, matching the SRS.
- Historical submission data is retained by reference and retained problem summary; the design does not copy full problem or hidden test data into submission records.

## 6. Relationship Summary

| Relationship | Design meaning |
|---|---|
| UI component to typed API client | The component depends on a capability-specific TypeScript client, not on transport details. |
| API handler to application service | The handler translates HTTP and contracts into a service call. |
| Application service to port | The service depends on an interface declared by its module, allowing adapters and tests to substitute implementations. |
| Application service to entity/read model | The service creates, loads, mutates, or returns domain data without owning its persistence. |
| Entity composition | The whole owns the lifecycle of the part, for example `Submission` owns its `TestCaseResult` records and `TestCaseSet` owns its ordered cases. |
| Cross-module association | Modules reference identifiers or read models; they do not reach into another module's store. |
| Interface realization | A subsystem adapter implements the port declared by the consuming module. |
| Integration adapter realization | An adapter implements a narrow cross-module port and delegates to the providing module's service. |

## 7. Review Notes

- Every ACD class has a destination or an explicit disposition in section 5.
- No Boundary, Control, Entity, or subsystem stereotypes appear in the diagram. `interface` and `enum` are UML classifier kinds, not stereotypes.
- Subsystems expose only ports and adapters; their internal components are intentionally not designed here.
- The design stays a modular monolith: the HTTP API and Judge Worker are separate processes built from the same Go modules, not independently deployed services.
- Go visibility uses `+` for exported and `-` for package-private members. Classifier-scope behavior is implemented as package-level functions where needed.
- Multiplicities agree with the declared Go types: optional pointers are `0..1`, slices are `0..*` or `1..*` according to invariant, and single references are `1`.
- The diagram deliberately avoids bidirectional relationships; dependencies point from consumers to contracts, and realizations point from adapters to ports.

