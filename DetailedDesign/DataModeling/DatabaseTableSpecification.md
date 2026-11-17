# PostgreSQL Database Table Specification

**Arbiter — Online Judge Platform**

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Database table specification |
| Database | PostgreSQL |
| Entity inventory | [EntityList.md](EntityList.md) |
| Conceptual ERD | [EntityRelationshipDiagram.md](EntityRelationshipDiagram.md) |
| Initial database schema | [InitialDatabaseSchema.sql](InitialDatabaseSchema.sql) |
| Design class diagram | [DesignClassDiagram.md](../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-17 |

## 1. Purpose and Conventions

This specification defines the initial relational tables for the database-persisted entities and their required supporting tables. The corresponding PostgreSQL DDL is provided in [InitialDatabaseSchema.sql](InitialDatabaseSchema.sql).

The tables are normalized for multi-valued Problem tags and allowed languages. `Mandatory = Yes` means the PostgreSQL column is `NOT NULL`; `Mandatory = No` means it is nullable. A default may satisfy a `NOT NULL` column without the application explicitly supplying it. Primary keys, foreign keys, unique constraints, checks, and defaults are listed in the Constraint column.

Conventions:

- DCD identifier types are stored as PostgreSQL `UUID`; IDs are generated with `gen_random_uuid()` unless otherwise noted.
- DCD `string` values use `TEXT`; DCD `int` values use `INTEGER`; DCD `time.Time` values use `TIMESTAMPTZ`.
- Enum-like values use `TEXT` with `CHECK` constraints rather than PostgreSQL enum types, so allowed values can be extended through ordinary migrations.
- No tag, language, test-case-content, progress, or statistics data is duplicated into the Problem or Submission base tables when represented by a separate table or derived projection.
- Foreign keys for historical data follow the DCD/SRS lifecycle: Problems and Accounts are retained, and historical test-case result identifiers remain available after the corresponding Test Case is deleted.

## 2. Tables

### 2.1 `accounts`

Stores the Account aggregate, including credential metadata. Plaintext passwords and access tokens are never stored.

| Column name | Data type | Mandatory | Description | Constraint |
|---|---|---:|---|---|
| `id` | `UUID` | Yes | Unique account identifier. | Primary key; default `gen_random_uuid()`. |
| `username` | `TEXT` | Yes | Unique login name. | `UNIQUE`; must not be empty after trimming. |
| `email` | `TEXT` | Yes | Unique e-mail login identifier. | `UNIQUE`; must not be empty after trimming. |
| `display_name` | `TEXT` | Yes | Public profile display name. | Must not be empty after trimming. |
| `bio` | `TEXT` | Yes | Optional biography; an absent biography is stored as an empty string. | Default `''`. |
| `role` | `TEXT` | Yes | Authorization role. | `CHECK (role IN ('USER', 'ADMINISTRATOR'))`; default `'USER'`. |
| `status` | `TEXT` | Yes | Account availability status. | `CHECK (status IN ('ACTIVE', 'LOCKED'))`; default `'ACTIVE'`. |
| `created_at` | `TIMESTAMPTZ` | Yes | Account creation time. | Default `CURRENT_TIMESTAMP`. |
| `status_changed_at` | `TIMESTAMPTZ` | Yes | Time of the last account-status change. | Default `CURRENT_TIMESTAMP`. |
| `status_changed_by` | `UUID` | No | Account that performed the last status change; null before an actor is recorded. | Foreign key to `accounts(id)`; `ON DELETE RESTRICT`. |
| `credential_changed_at` | `TIMESTAMPTZ` | Yes | Credential change time, used to invalidate older stateless tokens. | Default `CURRENT_TIMESTAMP`. |
| `version` | `INTEGER` | Yes | Optimistic-concurrency version. | `CHECK (version > 0)`; default `1`. |
| `credential_hash` | `TEXT` | Yes | Argon2id password hash. | Must not be empty; never expose through API projections. |

### 2.2 `problems`

Stores the Problem aggregate, including lifecycle and publication state. A Problem is deactivated rather than physically deleted.

| Column name | Data type | Mandatory | Description | Constraint |
|---|---|---:|---|---|
| `id` | `UUID` | Yes | Unique problem identifier. | Primary key; default `gen_random_uuid()`. |
| `title` | `TEXT` | Yes | Problem title. | Must not be empty after trimming. |
| `statement` | `TEXT` | Yes | Problem statement. | Must not be empty after trimming. |
| `input_format` | `TEXT` | Yes | Input format description. | Empty string allowed. |
| `output_format` | `TEXT` | Yes | Output format description. | Empty string allowed. |
| `constraints` | `TEXT` | Yes | Problem constraints description. | Empty string allowed. |
| `category` | `TEXT` | No | Optional problem category. | Null when not specified. |
| `difficulty` | `TEXT` | No | Optional difficulty classification. | `CHECK (difficulty IS NULL OR difficulty IN ('EASY', 'MEDIUM', 'HARD'))`. |
| `time_limit_ms` | `INTEGER` | Yes | Per-test time limit in milliseconds. | `CHECK (time_limit_ms > 0)`. |
| `memory_limit_mb` | `INTEGER` | Yes | Per-test memory limit in megabytes. | `CHECK (memory_limit_mb > 0)`. |
| `lifecycle_status` | `TEXT` | Yes | Active/inactive lifecycle state. | `CHECK (lifecycle_status IN ('ACTIVE', 'INACTIVE'))`; default `'ACTIVE'`. |
| `publication_status` | `TEXT` | Yes | Draft/published state. | `CHECK (publication_status IN ('DRAFT', 'PUBLISHED'))`; default `'DRAFT'`. |
| `version` | `INTEGER` | Yes | Optimistic-concurrency version for edits and state changes. | `CHECK (version > 0)`; default `1`. |
| `updated_at` | `TIMESTAMPTZ` | Yes | Last Problem update time. | Default `CURRENT_TIMESTAMP`; updated in the same transaction as changes. |

### 2.3 `problem_tags`

Stores the normalized `Problem.Tags` collection. Zero rows represent an empty tag collection.

| Column name | Data type | Mandatory | Description | Constraint |
|---|---|---:|---|---|
| `problem_id` | `UUID` | Yes | Problem to which the tag belongs. | Foreign key to `problems(id)`; `ON DELETE CASCADE`; composite primary key with `tag`. |
| `tag` | `TEXT` | Yes | Tag assigned to the Problem. | Composite primary key with `problem_id`; must not be empty after trimming. |

### 2.4 `problem_allowed_languages`

Stores the normalized `Problem.AllowedLanguages` collection. At least one row is required for a Problem to be eligible for submission/publication; enforce that invariant in the Problem write transaction.

| Column name | Data type | Mandatory | Description | Constraint |
|---|---|---:|---|---|
| `problem_id` | `UUID` | Yes | Problem that accepts the language. | Foreign key to `problems(id)`; `ON DELETE CASCADE`; composite primary key with `language`. |
| `language` | `TEXT` | Yes | Supported language accepted by this Problem. | `CHECK (language IN ('CPP17', 'PYTHON3'))`; composite primary key with `problem_id`. |

### 2.5 `test_case_sets`

Stores the per-Problem TestCaseSet version used for atomic ordering and concurrency checks. A set exists even when its draft Problem currently has no Test Cases.

| Column name | Data type | Mandatory | Description | Constraint |
|---|---|---:|---|---|
| `problem_id` | `UUID` | Yes | Problem that owns the TestCaseSet. | Primary key; foreign key to `problems(id)`; `ON DELETE RESTRICT`. |
| `version` | `INTEGER` | Yes | Optimistic-concurrency version for set membership and order. | `CHECK (version > 0)`; default `1`. |

### 2.6 `test_cases`

Stores TestCase metadata and protected-store references. Test-case input and expected-output contents remain on the protected filesystem.

| Column name | Data type | Mandatory | Description | Constraint |
|---|---|---:|---|---|
| `id` | `UUID` | Yes | Unique TestCase identifier. | Primary key; default `gen_random_uuid()`. |
| `problem_id` | `UUID` | Yes | TestCaseSet/Problem that owns this Test Case. | Foreign key to `test_case_sets(problem_id)`; `ON DELETE RESTRICT`. |
| `type` | `TEXT` | Yes | Sample or hidden classification. | `CHECK (type IN ('SAMPLE', 'HIDDEN'))`. |
| `ordinal` | `INTEGER` | Yes | One-based execution order within the Problem. | `CHECK (ordinal > 0)`; `UNIQUE (problem_id, ordinal)`. |
| `version` | `INTEGER` | Yes | Optimistic-concurrency version for the Test Case. | `CHECK (version > 0)`; default `1`. |
| `updated_at` | `TIMESTAMPTZ` | Yes | Last TestCase update time. | Default `CURRENT_TIMESTAMP`. |
| `input_ref` | `TEXT` | Yes | Relative protected-store reference for input content. | Must not be empty after trimming. |
| `expected_output_ref` | `TEXT` | Yes | Relative protected-store reference for expected-output content. | Must not be empty after trimming. |

### 2.7 `submissions`

Stores Submission source, status, result summary, metrics, and retained problem summary. Account and Problem rows are retained, so their references use restrictive foreign keys.

| Column name | Data type | Mandatory | Description | Constraint |
|---|---|---:|---|---|
| `id` | `UUID` | Yes | Unique Submission identifier. | Primary key; default `gen_random_uuid()`. |
| `user_id` | `UUID` | Yes | Account that owns the Submission. | Foreign key to `accounts(id)`; `ON DELETE RESTRICT`. |
| `problem_id` | `UUID` | Yes | Problem submitted against. | Foreign key to `problems(id)`; `ON DELETE RESTRICT`. |
| `language` | `TEXT` | Yes | Submitted programming language. | `CHECK (language IN ('CPP17', 'PYTHON3'))`. |
| `source` | `TEXT` | Yes | Submitted source code. | Must not be empty; `octet_length(source) <= 65536`. |
| `status` | `TEXT` | Yes | Processing lifecycle state. | `CHECK (status IN ('QUEUED', 'COMPILING', 'RUNNING', 'COMPLETED', 'INTERNAL_ERROR'))`; default `'QUEUED'`. |
| `verdict` | `TEXT` | No | User-code verdict; absent until a completed evaluation and always absent for `INTERNAL_ERROR`. | `CHECK (verdict IS NULL OR verdict IN ('ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILATION_ERROR'))`; check that `status = 'COMPLETED'` exactly when `verdict IS NOT NULL`. |
| `judge_attempts` | `INTEGER` | Yes | Number of judge attempts begun. | `CHECK (judge_attempts BETWEEN 0 AND 2)`; default `0`. |
| `created_at` | `TIMESTAMPTZ` | Yes | Submission creation time. | Default `CURRENT_TIMESTAMP`. |
| `started_at` | `TIMESTAMPTZ` | No | Time judging started. | `NULL` until the first attempt begins. |
| `completed_at` | `TIMESTAMPTZ` | No | Time processing reached a terminal state. | `NULL` until a terminal state is persisted. |
| `updated_at` | `TIMESTAMPTZ` | Yes | Last Submission state/result update time. | Default `CURRENT_TIMESTAMP`; updated with each persisted transition. |
| `runtime_ms` | `INTEGER` | Yes | Aggregate runtime in milliseconds. | `CHECK (runtime_ms >= 0)`; default `0`. |
| `peak_memory_kb` | `INTEGER` | Yes | Aggregate peak memory in kilobytes. | `CHECK (peak_memory_kb >= 0)`; default `0`. |
| `compilation_output` | `TEXT` | Yes | Bounded compiler diagnostic output. | Default `''`; API output must remain bounded. |
| `retained_problem_summary` | `TEXT` | Yes | Problem summary retained for historical Submission views. | No separate Problem snapshot table is required. |

### 2.8 `submission_test_case_results`

Stores the executed TestCase results owned by each Submission. Results are durable even if the current TestCase is later deleted.

| Column name | Data type | Mandatory | Description | Constraint |
|---|---|---:|---|---|
| `submission_id` | `UUID` | Yes | Submission that owns the result. | Foreign key to `submissions(id)`; `ON DELETE CASCADE`; composite primary key with `test_case_id`. |
| `test_case_id` | `UUID` | Yes | Identifier of the Test Case evaluated when this result was produced. | Composite primary key with `submission_id`; deliberately no foreign key to `test_cases(id)` because Test Cases may be physically deleted while historical results are retained. |
| `outcome` | `TEXT` | Yes | Per-case evaluation outcome. | `CHECK (outcome IN ('PASSED', 'FAILED', 'SKIPPED'))`. |
| `runtime_ms` | `INTEGER` | Yes | Per-case runtime in milliseconds. | `CHECK (runtime_ms >= 0)`. |
| `peak_memory_kb` | `INTEGER` | Yes | Per-case peak memory in kilobytes. | `CHECK (peak_memory_kb >= 0)`. |
| `message` | `TEXT` | Yes | User-safe per-case result message. | Default `''`; must not contain hidden input or expected output. |

### 2.9 `outbox_events`

Stores durable events to be dispatched to Redis Streams. Submission creation and outbox insertion occur in one transaction.

| Column name | Data type | Mandatory | Description | Constraint |
|---|---|---:|---|---|
| `id` | `UUID` | Yes | Unique OutboxEvent identifier. | Primary key; default `gen_random_uuid()`. |
| `submission_id` | `UUID` | Yes | Submission whose acceptance produced the event. | Foreign key to `submissions(id)`; `ON DELETE RESTRICT`; `UNIQUE` so one creation event is associated with each Submission. |
| `created_at` | `TIMESTAMPTZ` | Yes | Event creation time. | Default `CURRENT_TIMESTAMP`. |
| `published_at` | `TIMESTAMPTZ` | No | Time the event was successfully published. | Null while unpublished. |

## 3. Indexes

In addition to primary-key and unique-constraint indexes, create indexes for these query paths:

| Table | Index | Purpose |
|---|---|---|
| `accounts` | `(lower(username))` and `(lower(email))` are not specified as unique indexes in this draft; decide normalization policy before adding them. | Login lookup by username or e-mail. |
| `problems` | `(lifecycle_status, publication_status, updated_at)` | Browse/search active published Problems and stable administrative lists. |
| `problem_tags` | `(tag, problem_id)` | Filter Problems by tag. |
| `problem_allowed_languages` | `(language, problem_id)` | Filter or validate Problems by allowed language. |
| `test_cases` | `(problem_id, ordinal)` is already unique. | Ordered TestCase listing and judging reads. |
| `submissions` | `(user_id, created_at DESC, id)` | User submission history ordered newest first. |
| `submissions` | `(problem_id, created_at DESC)` | Problem-specific submission and progress aggregates. |
| `submissions` | `(status, updated_at)` | Worker recovery and pending-state scans. |
| `submission_test_case_results` | `(submission_id)` is covered by the composite primary key. | Read per-case results for a Submission. |
| `outbox_events` | Partial index on `created_at` where `published_at IS NULL`. | Dispatch unpublished events in creation order. |

## 4. Transaction and Integrity Requirements

- Insert a `Submission` and its `OutboxEvent` in one PostgreSQL transaction. `outbox_events.submission_id` must reference the inserted Submission.
- Persist a terminal Submission result and all executed `submission_test_case_results` in one transaction. A message is acknowledged only after commit.
- Create each Problem with its `test_case_sets` row and at least one `problem_allowed_languages` row in the same transaction.
- Update TestCase metadata and `test_case_sets.version` atomically when creating, updating, deleting, or reordering Test Cases. Reordering also updates all affected ordinals in one transaction.
- The database enforces unique ordinals per Problem. Contiguous ordinals and at least one sample and one hidden case before publication are transaction-level/application invariants; publication must verify them before changing `publication_status`.
- Draft TestCaseSets may be empty. This matches the delete-last-case use case; publication eligibility still requires sample and hidden cases.
- Do not physically delete Problems or Accounts through application operations. Deactivate/lock them instead. Foreign keys from Submissions and TestCases protect retained history.
- Do not add a foreign key from `submission_test_case_results.test_case_id` to `test_cases`; deleting a TestCase must not delete or invalidate historical results.

## 5. Modeling Decisions and Open Constraints

- UUID storage was selected for DCD string-based identifiers. The initial schema will use PostgreSQL UUID columns and `gen_random_uuid()` defaults.
- `Problem.Tags` and `Problem.AllowedLanguages` are normalized into `problem_tags` and `problem_allowed_languages`.
- `TestCaseResult.TestCaseID` remains a historical identifier, not a foreign key, because the SRS permits physical TestCase deletion while preserving grading results.
- The DCD's `TestCaseSet` to `TestCase` multiplicity was changed from `1..*` to `0..*` to match the SRS/use-case behavior that permits an empty draft set. Publication constraints still require sample and hidden cases.
- Email and username uniqueness is exact-value uniqueness in this draft. Case-folding/normalization behavior is not specified by the SRS and should be settled before applying uniqueness constraints to normalized values.
- Account username/email length and naming constraints, profile-field limits, Problem text limits, and test-case file-reference limits are not fixed here because the SRS/DCD does not provide authoritative numeric limits. Apply application validation and add database limits only after those policies are specified.
- `status_changed_by` is nullable until an account actor is recorded, although the DCD models it as an `AccountID`; confirm this optional initial-state mapping before freezing the implementation schema.
