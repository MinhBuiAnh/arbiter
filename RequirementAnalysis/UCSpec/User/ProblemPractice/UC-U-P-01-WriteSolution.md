# Use Case Specification

**UC-U-P-01 - Write Solution**

**Version:** 1.1

# 1. General Information

- Use Case ID: UC-U-P-01
- Use Case Name: Write Solution
- Brief Description: Allow User to write, edit, and prepare the source code for a solution to a problem using the integrated source code editor.
- Primary Actor(s): User, Administrator (through inheritance from User)
- Supporting Actor(s): None
- Trigger: User opens the source code editor for a problem.
- Priority: High
- Status: Draft
- Related Use Cases: UC-U-P-02 – Select Programming Language, UC-U-P-03 – Submit Solution
- Related Requirements: FR-013 (proposal); SRS identifiers to be assigned

# 2. Preconditions

- User is authenticated.
- User can access the problem detail page or the solution writing interface.

# 3. Postconditions

## 3.1. Success

- The current source code is displayed in the editor.
- User can continue editing the source code or use the current source code in UC-U-P-03 – Submit Solution.
- No Submission is created solely by writing or editing source code.

## 3.2. Failure

- The editor is not initialized, or its content cannot be displayed.
- No Submission is created.
- No problem or account data is modified.

# 4. Main Flow

1. User opens the source code editor for a problem.
2. System checks that the problem exists and is publicly accessible.
3. System initializes the source code editor and displays the coding interface.
4. System displays the initial source code according to the editor configuration or the corresponding language template, if available.
5. User inputs the solution's source code.
6. The editor updates the content according to User's actions.
7. User continues editing the source code until the solution is complete.
8. User can switch to UC-U-P-02 – Select Programming Language to choose a programming language.
9. User can switch to UC-U-P-03 – Submit Solution to submit the current source code.
10. Use Case ends when User completes the writing action or leaves the editor.

# 5. Alternative Flow

**A1 – Edit Existing Source Code**

1. At step 4, the editor displays the existing source code in the current session.
2. User edits, adds, or deletes content from the source code.
3. The editor updates the content.
4. Use Case continues at step 7 of the Main Flow.

**A2 – Clear Source Code**

1. At step 7, User selects the action to delete all source code.
2. System requests confirmation.
3. User confirms the action.
4. The editor clears the current content.
5. User can rewrite the source code from scratch.
6. Use Case continues at step 5 of the Main Flow.

**A3 – Restore Default Template**

1. At step 7, User selects the action to restore the sample source code.
2. System displays the sample source code corresponding to the selected language.
3. User confirms replacing the current content.
4. The editor updates with the sample source code.
5. Use Case continues at step 5 of the Main Flow.

# 6. Exception Flow

**E1 – ERR-SYS-008: Editor Initialization Error**

1. At step 3, System fails to initialize the source code editor.
2. System halts the editor initialization process.
3. The frontend logs the error for diagnostic purposes.
4. UI notifies that it cannot load the source code editor.
5. User can refresh the page or try again later.
6. Use Case ends.

**E2 – ERR-NET-001: Network Error**

1. During the loading of the page or the resources required by the editor, the network connection is interrupted or times out.
2. UI notifies that it cannot load the full functionality.
3. User can refresh the page when the connection is restored.
4. Use Case ends if continuing is impossible.

**E3 – ERR-RES-001: Problem Not Found**

1. At step 2, System cannot find the corresponding problem.
2. System does not initialize the writing environment for that problem.
3. UI notifies that the problem does not exist or is no longer available.
4. User can return to the problem list.
5. Use Case ends.

**E4 – ERR-PERM-001: Problem Not Publicly Accessible**

1. At step 2, System detects that the problem is not publicly accessible or that User is not permitted to access it.
2. System refuses to provide the problem's content.
3. UI notifies that the problem is not available.
4. Use Case ends.

# 7. Assumptions

- The editor is a client-side component and does not execute source code.
- The current source code is retained in the session while User remains in the editor.
- Only public problems can be opened in the editor.
- The supported languages are C++17 and Python 3.

# 8. Special Requirements

- The editor must not execute or evaluate the entered source code.
- Writing or editing source code must not create a Submission.
- Source code must not be written to logs.
- The editor must not expose administrator-only problem data.

# 9. Open Issues

- None for v1.

# 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-11-13 | Initial specification. |
| 1.1 | 2026-11-13 | Aligned with `SpecStructure.md` v1.1: added metadata, split postconditions, moved problem and editor checks into the main flow, replaced implementation-specific editor naming, and assigned a distinct editor-initialization error code. |
