# AccountSummary — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `AccountSummary` |
| Classifier kind | Class |
| Package / subsystem | `Account Module (Go)` |
| DCD alias | `ACCAccountSummary` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`AccountSummary` is a class in the `Account Module (Go)` package/subsystem of the design class diagram.

Read model for administrator account-list rows.

- Declared incoming design relationships: `AccountStore`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `ID` | `AccountID` | Public | Instance | — | Unique identifier for the record. |
| `Username` | `string` | Public | Instance | — | Account login name. |
| `DisplayName` | `string` | Public | Instance | — | Name shown to other users. |
| `Role` | `Role` | Public | Instance | — | Authorization role of the account. |
| `Status` | `AccountStatus` | Public | Instance | — | Current account, submission, or lifecycle status, as declared by the attribute type. |
| `CreatedAt` | `time.Time` | Public | Instance | — | Creation timestamp. |

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
