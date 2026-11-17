BEGIN;

CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    bio TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT 'USER',
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status_changed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status_changed_by UUID,
    credential_changed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version INTEGER NOT NULL DEFAULT 1,
    credential_hash TEXT NOT NULL,
    CONSTRAINT accounts_username_not_empty CHECK (btrim(username) <> ''),
    CONSTRAINT accounts_email_not_empty CHECK (btrim(email) <> ''),
    CONSTRAINT accounts_display_name_not_empty CHECK (btrim(display_name) <> ''),
    CONSTRAINT accounts_role_valid CHECK (role IN ('USER', 'ADMINISTRATOR')),
    CONSTRAINT accounts_status_valid CHECK (status IN ('ACTIVE', 'LOCKED')),
    CONSTRAINT accounts_version_positive CHECK (version > 0),
    CONSTRAINT accounts_credential_hash_not_empty CHECK (credential_hash <> ''),
    CONSTRAINT accounts_status_changed_by_fk
        FOREIGN KEY (status_changed_by) REFERENCES accounts(id) ON DELETE RESTRICT
);

CREATE TABLE problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    statement TEXT NOT NULL,
    input_format TEXT NOT NULL,
    output_format TEXT NOT NULL,
    constraints TEXT NOT NULL,
    category TEXT,
    difficulty TEXT,
    time_limit_ms INTEGER NOT NULL,
    memory_limit_mb INTEGER NOT NULL,
    lifecycle_status TEXT NOT NULL DEFAULT 'ACTIVE',
    publication_status TEXT NOT NULL DEFAULT 'DRAFT',
    version INTEGER NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT problems_title_not_empty CHECK (btrim(title) <> ''),
    CONSTRAINT problems_statement_not_empty CHECK (btrim(statement) <> ''),
    CONSTRAINT problems_time_limit_positive CHECK (time_limit_ms > 0),
    CONSTRAINT problems_memory_limit_positive CHECK (memory_limit_mb > 0),
    CONSTRAINT problems_difficulty_valid
        CHECK (difficulty IS NULL OR difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    CONSTRAINT problems_lifecycle_status_valid
        CHECK (lifecycle_status IN ('ACTIVE', 'INACTIVE')),
    CONSTRAINT problems_publication_status_valid
        CHECK (publication_status IN ('DRAFT', 'PUBLISHED')),
    CONSTRAINT problems_version_positive CHECK (version > 0)
);

CREATE TABLE problem_tags (
    problem_id UUID NOT NULL,
    tag TEXT NOT NULL,
    CONSTRAINT problem_tags_pk PRIMARY KEY (problem_id, tag),
    CONSTRAINT problem_tags_problem_fk
        FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
    CONSTRAINT problem_tags_tag_not_empty CHECK (btrim(tag) <> '')
);

CREATE TABLE problem_allowed_languages (
    problem_id UUID NOT NULL,
    language TEXT NOT NULL,
    CONSTRAINT problem_allowed_languages_pk PRIMARY KEY (problem_id, language),
    CONSTRAINT problem_allowed_languages_problem_fk
        FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
    CONSTRAINT problem_allowed_languages_language_valid
        CHECK (language IN ('CPP17', 'PYTHON3'))
);

CREATE TABLE test_case_sets (
    problem_id UUID PRIMARY KEY,
    version INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT test_case_sets_problem_fk
        FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE RESTRICT,
    CONSTRAINT test_case_sets_version_positive CHECK (version > 0)
);

CREATE TABLE test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    problem_id UUID NOT NULL,
    type TEXT NOT NULL,
    ordinal INTEGER NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    input_ref TEXT NOT NULL,
    expected_output_ref TEXT NOT NULL,
    CONSTRAINT test_cases_set_fk
        FOREIGN KEY (problem_id) REFERENCES test_case_sets(problem_id) ON DELETE RESTRICT,
    CONSTRAINT test_cases_type_valid CHECK (type IN ('SAMPLE', 'HIDDEN')),
    CONSTRAINT test_cases_ordinal_positive CHECK (ordinal > 0),
    CONSTRAINT test_cases_version_positive CHECK (version > 0),
    CONSTRAINT test_cases_problem_ordinal_unique UNIQUE (problem_id, ordinal),
    CONSTRAINT test_cases_input_ref_not_empty CHECK (btrim(input_ref) <> ''),
    CONSTRAINT test_cases_expected_output_ref_not_empty CHECK (btrim(expected_output_ref) <> '')
);

CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    problem_id UUID NOT NULL,
    language TEXT NOT NULL,
    source TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'QUEUED',
    verdict TEXT,
    judge_attempts INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    runtime_ms INTEGER NOT NULL DEFAULT 0,
    peak_memory_kb INTEGER NOT NULL DEFAULT 0,
    compilation_output TEXT NOT NULL DEFAULT '',
    retained_problem_summary TEXT NOT NULL,
    CONSTRAINT submissions_user_fk
        FOREIGN KEY (user_id) REFERENCES accounts(id) ON DELETE RESTRICT,
    CONSTRAINT submissions_problem_fk
        FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE RESTRICT,
    CONSTRAINT submissions_language_valid CHECK (language IN ('CPP17', 'PYTHON3')),
    CONSTRAINT submissions_source_valid CHECK (source <> '' AND octet_length(source) <= 65536),
    CONSTRAINT submissions_status_valid
        CHECK (status IN ('QUEUED', 'COMPILING', 'RUNNING', 'COMPLETED', 'INTERNAL_ERROR')),
    CONSTRAINT submissions_verdict_valid
        CHECK (verdict IS NULL OR verdict IN (
            'ACCEPTED',
            'WRONG_ANSWER',
            'TIME_LIMIT_EXCEEDED',
            'MEMORY_LIMIT_EXCEEDED',
            'RUNTIME_ERROR',
            'COMPILATION_ERROR'
        )),
    CONSTRAINT submissions_completed_verdict_consistent
        CHECK ((status = 'COMPLETED') = (verdict IS NOT NULL)),
    CONSTRAINT submissions_judge_attempts_valid CHECK (judge_attempts BETWEEN 0 AND 2),
    CONSTRAINT submissions_runtime_nonnegative CHECK (runtime_ms >= 0),
    CONSTRAINT submissions_peak_memory_nonnegative CHECK (peak_memory_kb >= 0)
);

CREATE TABLE submission_test_case_results (
    submission_id UUID NOT NULL,
    test_case_id UUID NOT NULL,
    outcome TEXT NOT NULL,
    runtime_ms INTEGER NOT NULL,
    peak_memory_kb INTEGER NOT NULL,
    message TEXT NOT NULL DEFAULT '',
    CONSTRAINT submission_test_case_results_pk PRIMARY KEY (submission_id, test_case_id),
    CONSTRAINT submission_test_case_results_submission_fk
        FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
    CONSTRAINT submission_test_case_results_outcome_valid
        CHECK (outcome IN ('PASSED', 'FAILED', 'SKIPPED')),
    CONSTRAINT submission_test_case_results_runtime_nonnegative CHECK (runtime_ms >= 0),
    CONSTRAINT submission_test_case_results_peak_memory_nonnegative CHECK (peak_memory_kb >= 0)
);

CREATE TABLE outbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMPTZ,
    CONSTRAINT outbox_events_submission_fk
        FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE RESTRICT
);

CREATE INDEX problems_lifecycle_publication_updated_idx
    ON problems (lifecycle_status, publication_status, updated_at);

CREATE INDEX problem_tags_tag_problem_idx
    ON problem_tags (tag, problem_id);

CREATE INDEX problem_allowed_languages_language_problem_idx
    ON problem_allowed_languages (language, problem_id);

CREATE INDEX submissions_user_created_id_idx
    ON submissions (user_id, created_at DESC, id);

CREATE INDEX submissions_problem_created_idx
    ON submissions (problem_id, created_at DESC);

CREATE INDEX submissions_status_updated_idx
    ON submissions (status, updated_at);

CREATE INDEX outbox_events_unpublished_created_idx
    ON outbox_events (created_at)
    WHERE published_at IS NULL;

COMMIT;
