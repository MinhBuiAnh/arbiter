# Use Case Specification

**UC-U-P-02 - Select Programming Language**

**Version:** 1.1

# 1. General Information

- Use Case ID: UC-U-P-02
- Use Case Name: Select Programming Language
- Brief Description: Allow User to select a supported programming language for writing and submitting a solution to a problem.
- Primary Actor(s): User, Administrator (through inheritance from User)
- Supporting Actor(s): None
- Trigger: User opens the programming language selection area on the solution writing interface.
- Priority: High
- Status: Draft
- Related Use Cases: UC-U-P-01 – Write Solution, UC-U-P-03 – Submit Solution
- Related Requirements: FR-014 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- User is authenticated.
- User can access the solution writing interface for the problem.

# 3. Postconditions

## 3.1. Success

- The selected programming language becomes the current language for the session.
- The editor is configured for the selected language.
- The current language is displayed and is ready to be used in UC-U-P-03 – Submit Solution.
- No Submission is created solely by selecting a language.

## 3.2. Failure

- The previously active language and editor configuration remain in effect when possible.
- No Submission is created.
- No problem or account data is modified.

# 4. Main Flow

1. User opens the programming language selection area on the solution writing interface.
2. System displays the list of supported programming languages. In v1, the supported languages are C++17 and Python 3.
3. User selects a programming language.
4. System checks whether the selected language is in the list of supported languages.
5. System updates the current language for the session.
6. The editor applies the configuration for the selected language, such as syntax highlighting and source code formatting.
7. UI displays the current language.
8. User can continue writing the solution in UC-U-P-01 – Write Solution or proceed to UC-U-P-03 – Submit Solution.
9. Use Case ends.

# 5. Alternative Flow

**A1 – Change Selected Language**

1. At step 3, User selects a different language from the list while another language is active.
2. System checks the newly selected language and updates the current language.
3. The editor applies the configuration for the new language.
4. Use Case continues at step 7 of the Main Flow.

**A2 – Re-select Current Language**

1. At step 3, User selects the language that is already active.
2. System identifies that the current language has not changed.
3. System retains the current language and editor configuration.
4. Use Case ends without any change.

**A3 – Restore Language-specific Template**

1. At step 7, User requests the template source code for the selected language.
2. System displays the template source code for that language.
3. User confirms replacing the current editor content.
4. The editor replaces the current content with the template source code.
5. Use Case continues at step 8 of the Main Flow.

# 6. Exception Flow

**E1 – ERR-VAL-013: Unsupported Programming Language**

1. At step 4, System detects that the selected language is not in the list of supported languages.
2. System rejects the selection.
3. System retains the previously active language and editor configuration.
4. System logs the rejected selection with the request ID without logging source code.
5. System returns `ERR-VAL-013` with the list of supported languages.
6. UI notifies User that the language is unsupported and displays the available languages.
7. User selects a supported language; Use Case continues at step 3. Otherwise, Use Case ends.

**E2 – ERR-SYS-009: Editor Configuration Error**

1. At step 6, the editor fails to apply the configuration for the selected language.
2. System stops the configuration update.
3. System retains the nearest valid editor configuration when possible.
4. System logs the error with the request ID without logging source code.
5. System returns `ERR-SYS-009`.
6. UI notifies User that the editor configuration could not be changed.
7. User can retry the language selection; Use Case continues at step 3. Otherwise, Use Case ends.

**E3 – ERR-NET-001: Network Error**

1. During the loading of the language list or the required editor resources, the network connection is interrupted or times out.
2. UI cannot confirm that the language list or editor configuration is complete.
3. UI notifies User that the required data could not be loaded.
4. User can retry when the network connection is restored; Use Case continues at step 1.
5. Use Case ends if continuing is impossible.

# 7. Assumptions

- The editor is a client-side component and does not execute source code.
- The supported languages in v1 are C++17 and Python 3.
- The language selection is retained for the current session.
- The supported language list is defined by the system and does not change during a session.

# 8. Special Requirements

- The editor must not execute or evaluate the selected language's source code.
- Selecting a language must not create a Submission.
- A failed configuration update must not leave the editor in an inconsistent state.
- Source code must not be written to logs.

# 9. Open Issues

- None for v1.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 1.1 | 2026-11-13 | Aligned with `SpecStructure.md` v1.1: added metadata, split postconditions, added branch and end states, and assigned distinct unsupported-language and editor-configuration error codes. |
