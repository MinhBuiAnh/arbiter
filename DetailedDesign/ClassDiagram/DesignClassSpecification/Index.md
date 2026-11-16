# Class Design Specifications

**Arbiter — Online Judge Platform**

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Index of class design specifications |
| Design class diagram | [DesignClassDiagram.md](../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

The [design class diagram](../DesignClassDiagram/DesignClassDiagram.md) is the authoritative source for every class, attribute, operation, parameter, type, visibility, and relationship in these specifications. Each file specifies exactly one DCD classifier and follows the structure required by the ruleset.

| Package / subsystem | Classifiers |
|---|---|
| Shared Domain Types (Go) | 11 |
| React SPA (TypeScript) | 19 |
| HTTP API (Go) | 9 |
| Application Contracts (Go) | 22 |
| Account Module (Go) | 11 |
| Catalog Module (Go) | 10 |
| Test Case Module (Go) | 9 |
| Submission Module (Go) | 10 |
| Progress Module (Go) | 5 |
| Judge Module (Go) | 6 |
| Outbox Module (Go) | 3 |
| Persistence Subsystem (Go) | 6 |
| Message Queue Subsystem (Go) | 3 |
| Execution Subsystem (Go) | 7 |
| Protected Test Case Store Subsystem (Go) | 1 |
| Security Subsystem (Go) | 1 |
| Integration Adapters (Go) | 2 |

## Shared Domain Types (Go)

| Classifier | Kind | Specification |
|---|---|---|
| `Role` | Enumeration | [Role](SharedDomainTypes/Role.md) |
| `AccountStatus` | Enumeration | [AccountStatus](SharedDomainTypes/AccountStatus.md) |
| `Difficulty` | Enumeration | [Difficulty](SharedDomainTypes/Difficulty.md) |
| `LifecycleStatus` | Enumeration | [LifecycleStatus](SharedDomainTypes/LifecycleStatus.md) |
| `PublicationStatus` | Enumeration | [PublicationStatus](SharedDomainTypes/PublicationStatus.md) |
| `TestCaseType` | Enumeration | [TestCaseType](SharedDomainTypes/TestCaseType.md) |
| `Language` | Enumeration | [Language](SharedDomainTypes/Language.md) |
| `SubmissionStatus` | Enumeration | [SubmissionStatus](SharedDomainTypes/SubmissionStatus.md) |
| `Verdict` | Enumeration | [Verdict](SharedDomainTypes/Verdict.md) |
| `TestOutcome` | Enumeration | [TestOutcome](SharedDomainTypes/TestOutcome.md) |
| `TestCaseSetSummary` | Class | [TestCaseSetSummary](SharedDomainTypes/TestCaseSetSummary.md) |

## React SPA (TypeScript)

| Classifier | Kind | Specification |
|---|---|---|
| `AppShell` | Class | [AppShell](ReactSPA/AppShell.md) |
| `AuthProvider` | Class | [AuthProvider](ReactSPA/AuthProvider.md) |
| `HttpClient` | Class | [HttpClient](ReactSPA/HttpClient.md) |
| `AccountApi` | Class | [AccountApi](ReactSPA/AccountApi.md) |
| `ProblemApi` | Class | [ProblemApi](ReactSPA/ProblemApi.md) |
| `TestCaseApi` | Class | [TestCaseApi](ReactSPA/TestCaseApi.md) |
| `SubmissionApi` | Class | [SubmissionApi](ReactSPA/SubmissionApi.md) |
| `ProgressApi` | Class | [ProgressApi](ReactSPA/ProgressApi.md) |
| `ProblemBrowser` | Class | [ProblemBrowser](ReactSPA/ProblemBrowser.md) |
| `PracticeWorkspace` | Class | [PracticeWorkspace](ReactSPA/PracticeWorkspace.md) |
| `SubmissionTracker` | Class | [SubmissionTracker](ReactSPA/SubmissionTracker.md) |
| `SubmissionBrowser` | Class | [SubmissionBrowser](ReactSPA/SubmissionBrowser.md) |
| `ProgressDashboard` | Class | [ProgressDashboard](ReactSPA/ProgressDashboard.md) |
| `AdminConsole` | Class | [AdminConsole](ReactSPA/AdminConsole.md) |
| `usePolling` | Class | [usePolling](ReactSPA/usePolling.md) |
| `AuthState` | Class | [AuthState](ReactSPA/AuthState.md) |
| `ProblemDraft` | Class | [ProblemDraft](ReactSPA/ProblemDraft.md) |
| `EditorConfig` | Class | [EditorConfig](ReactSPA/EditorConfig.md) |
| `TestCaseDraft` | Class | [TestCaseDraft](ReactSPA/TestCaseDraft.md) |

## HTTP API (Go)

| Classifier | Kind | Specification |
|---|---|---|
| `Router` | Class | [Router](HTTPAPI/Router.md) |
| `AuthHandler` | Class | [AuthHandler](HTTPAPI/AuthHandler.md) |
| `AccountHandler` | Class | [AccountHandler](HTTPAPI/AccountHandler.md) |
| `ProblemHandler` | Class | [ProblemHandler](HTTPAPI/ProblemHandler.md) |
| `TestCaseHandler` | Class | [TestCaseHandler](HTTPAPI/TestCaseHandler.md) |
| `SubmissionHandler` | Class | [SubmissionHandler](HTTPAPI/SubmissionHandler.md) |
| `ProgressHandler` | Class | [ProgressHandler](HTTPAPI/ProgressHandler.md) |
| `AuthMiddleware` | Class | [AuthMiddleware](HTTPAPI/AuthMiddleware.md) |
| `RateLimiter` | Class | [RateLimiter](HTTPAPI/RateLimiter.md) |

## Application Contracts (Go)

| Classifier | Kind | Specification |
|---|---|---|
| `PageQuery` | Class | [PageQuery](ApplicationContracts/PageQuery.md) |
| `PageResult` | Class | [PageResult](ApplicationContracts/PageResult.md) |
| `ErrorResponse` | Class | [ErrorResponse](ApplicationContracts/ErrorResponse.md) |
| `RegisterRequest` | Class | [RegisterRequest](ApplicationContracts/RegisterRequest.md) |
| `LoginRequest` | Class | [LoginRequest](ApplicationContracts/LoginRequest.md) |
| `LoginResponse` | Class | [LoginResponse](ApplicationContracts/LoginResponse.md) |
| `AccountResponse` | Class | [AccountResponse](ApplicationContracts/AccountResponse.md) |
| `UpdateAccountRequest` | Class | [UpdateAccountRequest](ApplicationContracts/UpdateAccountRequest.md) |
| `ChangePasswordRequest` | Class | [ChangePasswordRequest](ApplicationContracts/ChangePasswordRequest.md) |
| `ProblemQuery` | Class | [ProblemQuery](ApplicationContracts/ProblemQuery.md) |
| `ProblemResponse` | Class | [ProblemResponse](ApplicationContracts/ProblemResponse.md) |
| `PublicStatisticsResponse` | Class | [PublicStatisticsResponse](ApplicationContracts/PublicStatisticsResponse.md) |
| `ProblemWriteRequest` | Class | [ProblemWriteRequest](ApplicationContracts/ProblemWriteRequest.md) |
| `TestCaseResponse` | Class | [TestCaseResponse](ApplicationContracts/TestCaseResponse.md) |
| `TestCaseWriteRequest` | Class | [TestCaseWriteRequest](ApplicationContracts/TestCaseWriteRequest.md) |
| `ReorderRequest` | Class | [ReorderRequest](ApplicationContracts/ReorderRequest.md) |
| `CreateSubmissionRequest` | Class | [CreateSubmissionRequest](ApplicationContracts/CreateSubmissionRequest.md) |
| `SubmissionStatusResponse` | Class | [SubmissionStatusResponse](ApplicationContracts/SubmissionStatusResponse.md) |
| `SubmissionDetailsResponse` | Class | [SubmissionDetailsResponse](ApplicationContracts/SubmissionDetailsResponse.md) |
| `TestCaseResultResponse` | Class | [TestCaseResultResponse](ApplicationContracts/TestCaseResultResponse.md) |
| `LeaderboardEntryResponse` | Class | [LeaderboardEntryResponse](ApplicationContracts/LeaderboardEntryResponse.md) |
| `UserStatisticsResponse` | Class | [UserStatisticsResponse](ApplicationContracts/UserStatisticsResponse.md) |

## Account Module (Go)

| Classifier | Kind | Specification |
|---|---|---|
| `Account` | Class | [Account](AccountModule/Account.md) |
| `Principal` | Class | [Principal](AccountModule/Principal.md) |
| `AccountStore` | Interface | [AccountStore](AccountModule/AccountStore.md) |
| `CredentialVerifier` | Interface | [CredentialVerifier](AccountModule/CredentialVerifier.md) |
| `AuthService` | Class | [AuthService](AccountModule/AuthService.md) |
| `AccountService` | Class | [AccountService](AccountModule/AccountService.md) |
| `AdminUserService` | Class | [AdminUserService](AccountModule/AdminUserService.md) |
| `AccountFilter` | Class | [AccountFilter](AccountModule/AccountFilter.md) |
| `AccountSummary` | Class | [AccountSummary](AccountModule/AccountSummary.md) |
| `AccountDetails` | Class | [AccountDetails](AccountModule/AccountDetails.md) |
| `AccountProfile` | Class | [AccountProfile](AccountModule/AccountProfile.md) |

## Catalog Module (Go)

| Classifier | Kind | Specification |
|---|---|---|
| `Problem` | Class | [Problem](CatalogModule/Problem.md) |
| `PublicStatistics` | Class | [PublicStatistics](CatalogModule/PublicStatistics.md) |
| `ProblemStore` | Interface | [ProblemStore](CatalogModule/ProblemStore.md) |
| `TestCaseSetReader` | Interface | [TestCaseSetReader](CatalogModule/TestCaseSetReader.md) |
| `ProblemQueryService` | Class | [ProblemQueryService](CatalogModule/ProblemQueryService.md) |
| `ProblemAdminService` | Class | [ProblemAdminService](CatalogModule/ProblemAdminService.md) |
| `ProblemState` | Class | [ProblemState](CatalogModule/ProblemState.md) |
| `ProblemDetails` | Class | [ProblemDetails](CatalogModule/ProblemDetails.md) |
| `ProblemSubmissionContext` | Class | [ProblemSubmissionContext](CatalogModule/ProblemSubmissionContext.md) |
| `SampleCase` | Class | [SampleCase](CatalogModule/SampleCase.md) |

## Test Case Module (Go)

| Classifier | Kind | Specification |
|---|---|---|
| `TestCase` | Class | [TestCase](TestCaseModule/TestCase.md) |
| `TestCaseSet` | Class | [TestCaseSet](TestCaseModule/TestCaseSet.md) |
| `TestCaseRepository` | Interface | [TestCaseRepository](TestCaseModule/TestCaseRepository.md) |
| `TestCaseStore` | Interface | [TestCaseStore](TestCaseModule/TestCaseStore.md) |
| `TestCaseService` | Class | [TestCaseService](TestCaseModule/TestCaseService.md) |
| `TestCaseData` | Class | [TestCaseData](TestCaseModule/TestCaseData.md) |
| `TestCaseFileRefs` | Class | [TestCaseFileRefs](TestCaseModule/TestCaseFileRefs.md) |
| `TestCaseMetadata` | Class | [TestCaseMetadata](TestCaseModule/TestCaseMetadata.md) |
| `ProblemLookup` | Interface | [ProblemLookup](TestCaseModule/ProblemLookup.md) |

## Submission Module (Go)

| Classifier | Kind | Specification |
|---|---|---|
| `Submission` | Class | [Submission](SubmissionModule/Submission.md) |
| `TestCaseResult` | Class | [TestCaseResult](SubmissionModule/TestCaseResult.md) |
| `SubmissionSummary` | Class | [SubmissionSummary](SubmissionModule/SubmissionSummary.md) |
| `JudgeContext` | Class | [JudgeContext](SubmissionModule/JudgeContext.md) |
| `SubmissionStore` | Interface | [SubmissionStore](SubmissionModule/SubmissionStore.md) |
| `SubmissionCommandService` | Class | [SubmissionCommandService](SubmissionModule/SubmissionCommandService.md) |
| `SubmissionQueryService` | Class | [SubmissionQueryService](SubmissionModule/SubmissionQueryService.md) |
| `SubmissionFilter` | Class | [SubmissionFilter](SubmissionModule/SubmissionFilter.md) |
| `JudgeResult` | Class | [JudgeResult](SubmissionModule/JudgeResult.md) |
| `ResultMetrics` | Class | [ResultMetrics](SubmissionModule/ResultMetrics.md) |

## Progress Module (Go)

| Classifier | Kind | Specification |
|---|---|---|
| `LeaderboardEntry` | Class | [LeaderboardEntry](ProgressModule/LeaderboardEntry.md) |
| `UserStatistics` | Class | [UserStatistics](ProgressModule/UserStatistics.md) |
| `Breakdown` | Class | [Breakdown](ProgressModule/Breakdown.md) |
| `ProgressStore` | Interface | [ProgressStore](ProgressModule/ProgressStore.md) |
| `ProgressService` | Class | [ProgressService](ProgressModule/ProgressService.md) |

## Judge Module (Go)

| Classifier | Kind | Specification |
|---|---|---|
| `JudgeWorker` | Class | [JudgeWorker](JudgeModule/JudgeWorker.md) |
| `SubmissionProcessor` | Class | [SubmissionProcessor](JudgeModule/SubmissionProcessor.md) |
| `Compiler` | Class | [Compiler](JudgeModule/Compiler.md) |
| `TestCaseExecutor` | Class | [TestCaseExecutor](JudgeModule/TestCaseExecutor.md) |
| `VerdictEvaluator` | Class | [VerdictEvaluator](JudgeModule/VerdictEvaluator.md) |
| `ResourceCleaner` | Class | [ResourceCleaner](JudgeModule/ResourceCleaner.md) |

## Outbox Module (Go)

| Classifier | Kind | Specification |
|---|---|---|
| `OutboxEvent` | Class | [OutboxEvent](OutboxModule/OutboxEvent.md) |
| `OutboxStore` | Interface | [OutboxStore](OutboxModule/OutboxStore.md) |
| `OutboxDispatcher` | Class | [OutboxDispatcher](OutboxModule/OutboxDispatcher.md) |

## Persistence Subsystem (Go)

| Classifier | Kind | Specification |
|---|---|---|
| `AccountPostgresStore` | Class | [AccountPostgresStore](PersistenceSubsystem/AccountPostgresStore.md) |
| `ProblemPostgresStore` | Class | [ProblemPostgresStore](PersistenceSubsystem/ProblemPostgresStore.md) |
| `TestCasePostgresRepository` | Class | [TestCasePostgresRepository](PersistenceSubsystem/TestCasePostgresRepository.md) |
| `SubmissionPostgresStore` | Class | [SubmissionPostgresStore](PersistenceSubsystem/SubmissionPostgresStore.md) |
| `ProgressPostgresStore` | Class | [ProgressPostgresStore](PersistenceSubsystem/ProgressPostgresStore.md) |
| `OutboxPostgresStore` | Class | [OutboxPostgresStore](PersistenceSubsystem/OutboxPostgresStore.md) |

## Message Queue Subsystem (Go)

| Classifier | Kind | Specification |
|---|---|---|
| `SubmissionQueue` | Interface | [SubmissionQueue](MessageQueueSubsystem/SubmissionQueue.md) |
| `QueueMessage` | Class | [QueueMessage](MessageQueueSubsystem/QueueMessage.md) |
| `RedisStreamQueue` | Class | [RedisStreamQueue](MessageQueueSubsystem/RedisStreamQueue.md) |

## Execution Subsystem (Go)

| Classifier | Kind | Specification |
|---|---|---|
| `ExecutionEnvironment` | Interface | [ExecutionEnvironment](ExecutionSubsystem/ExecutionEnvironment.md) |
| `CompileRequest` | Class | [CompileRequest](ExecutionSubsystem/CompileRequest.md) |
| `ExecutionRequest` | Class | [ExecutionRequest](ExecutionSubsystem/ExecutionRequest.md) |
| `ExecutionLimits` | Class | [ExecutionLimits](ExecutionSubsystem/ExecutionLimits.md) |
| `CompileResult` | Class | [CompileResult](ExecutionSubsystem/CompileResult.md) |
| `ExecutionResult` | Class | [ExecutionResult](ExecutionSubsystem/ExecutionResult.md) |
| `DockerExecutionEnvironment` | Class | [DockerExecutionEnvironment](ExecutionSubsystem/DockerExecutionEnvironment.md) |

## Protected Test Case Store Subsystem (Go)

| Classifier | Kind | Specification |
|---|---|---|
| `FileSystemTestCaseStore` | Class | [FileSystemTestCaseStore](ProtectedTestCaseStoreSubsystem/FileSystemTestCaseStore.md) |

## Security Subsystem (Go)

| Classifier | Kind | Specification |
|---|---|---|
| `Argon2idVerifier` | Class | [Argon2idVerifier](SecuritySubsystem/Argon2idVerifier.md) |

## Integration Adapters (Go)

| Classifier | Kind | Specification |
|---|---|---|
| `TestCaseSetReaderAdapter` | Class | [TestCaseSetReaderAdapter](IntegrationAdapters/TestCaseSetReaderAdapter.md) |
| `ProblemLookupAdapter` | Class | [ProblemLookupAdapter](IntegrationAdapters/ProblemLookupAdapter.md) |
