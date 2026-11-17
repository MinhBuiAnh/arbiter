# Entity-Relationship Diagram

**Arbiter — Online Judge Platform**

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Conceptual entity-relationship diagram |
| Entity inventory | [EntityList.md](EntityList.md) |
| Design class diagram | [DesignClassDiagram.md](../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-17 |

## 1. Purpose and Notation

This conceptual model shows all database-persisted entities identified in the [entity inventory](EntityList.md), their design attributes, and the structural relationships specified in the DCD.

The diagram is implementation-independent: attributes are shown without data types, visibility, or key markings. Attribute names are retained from the DCD. Composition diamonds and multiplicities use the same ownership and cardinality as the DCD. No physical tables or additional relationships are inferred.

## 2. Diagram

```plantuml
@startuml ArbiterConceptualERD
title Arbiter - Conceptual Entity-Relationship Diagram
top to bottom direction
skinparam shadowing false
skinparam classAttributeIconSize 0
skinparam defaultFontName "Helvetica"
skinparam defaultFontSize 10
skinparam nodesep 30
skinparam ranksep 35

class "Account" as Account {
  ID
  Username
  Email
  DisplayName
  Bio
  Role
  Status
  CreatedAt
  StatusChangedAt
  StatusChangedBy
  CredentialChangedAt
  Version
  credentialHash
}

class "Problem" as Problem {
  ID
  Title
  Statement
  InputFormat
  OutputFormat
  Constraints
  Category
  Difficulty
  Tags
  AllowedLanguages
  TimeLimitMS
  MemoryLimitMB
  LifecycleStatus
  PublicationStatus
  Version
  UpdatedAt
}

class "TestCaseSet" as TestCaseSet {
  ProblemID
  Version
  Cases
}

class "TestCase" as TestCase {
  ID
  ProblemID
  Type
  Ordinal
  Version
  UpdatedAt
  inputRef
  expectedOutputRef
}

class "Submission" as Submission {
  ID
  UserID
  ProblemID
  Language
  Source
  Status
  Verdict
  JudgeAttempts
  CreatedAt
  StartedAt
  CompletedAt
  UpdatedAt
  RuntimeMS
  PeakMemoryKB
  CompilationOutput
  RetainedProblemSummary
}

class "TestCaseResult" as TestCaseResult {
  TestCaseID
  Outcome
  RuntimeMS
  PeakMemoryKB
  Message
}

class "OutboxEvent" as OutboxEvent {
  ID
  SubmissionID
  CreatedAt
  PublishedAt
}

TestCaseSet "1" *-- "0..*" TestCase
Submission "1" *-- "0..*" TestCaseResult

@enduml
```

## 3. Relationship Traceability

| Whole / owner | Relationship | Part | Multiplicity | DCD basis |
|---|---|---|---|---|
| `TestCaseSet` | Composition | `TestCase` | One set contains zero or more cases; each case belongs to one set. A draft set may be empty. | `TestCaseSet "1" *-- "0..*" TestCase` |
| `Submission` | Composition | `TestCaseResult` | One submission owns zero or more case results; each result belongs to one submission. | `Submission "1" *-- "0..*" TestCaseResult` |

## 4. Modeling Notes

- The composition diamonds remain at the owning ends, as in the DCD.
- `ID`, `ProblemID`, `UserID`, `SubmissionID`, and `TestCaseID` are shown as ordinary attributes. The conceptual diagram does not identify any attribute as a primary or foreign key.
- The DCD does not declare direct structural associations between the other persisted entities. Identifier attributes are retained as attributes and are not converted into additional relationships.
- `TestCaseData` content is held by the protected file store and is not included as database entity data. `inputRef` and `expectedOutputRef` are shown as attributes of `TestCase`, consistent with the DCD.
- `TestCaseSet` and `TestCaseResult` are logical persisted entities/owned records; this diagram does not prescribe whether either has a separate physical table.
