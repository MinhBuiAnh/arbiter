# Use Case Specification

**UC-U-P-01 - Write Solution**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-U-P-01
- Use Case Name: Write Solution
- Brief Description: Allow User to write, edit, and prepare the source code for a solution to a problem using the integrated source code editor on the platform.
- Participating Actors: User, Administrator (can also use this feature through inheritance from User).

# 2. Preconditions

- The User has logged into the system.
- The User can access a publicly available problem.
- The source code editor can be loaded and used.
- The User is on the problem detail page or the solution writing interface.

# 3. Postconditions

- The current source code is displayed in the editor.
- The User can continue editing the source code or use the current source code in UC-U-P-03 – Submit Solution.
- No Submission is created solely by writing or editing the source code.

# 4. Main Flow

1. User accesses the detail page of a problem.
2. User opens the source code editor area.
3. System initializes the Monaco editor and displays the coding interface.
4. System displays the initial source code according to the editor's configuration or the corresponding source code template if available.
5. User inputs the solution's source code.
6. The editor updates the content according to User's actions.
7. User continues to edit the source code until the solution is complete.
8. User can switch to UC-U-P-02 – Select Programming Language to choose a programming language.
9. User can switch to UC-U-P-03 – Submit Solution to submit the current source code.
10. The Use Case ends when User completes the writing action or leaves the editor.

# 5. Alternative Flow

**A1 – Edit Existing Source Code**

1. At step 4, the editor displays the existing source code in the current session.
2. User edits, adds, or deletes content from the source code.
3. The editor updates the new content.
4. The Use Case continues from step 7 of the Main Flow.

**A2 – Clear Source Code**

1. User selects the action to delete all source code.
2. The system requests confirmation if necessary.
3. User confirms the action.
4. The editor clears the current content.
5. User can rewrite the source code from scratch.

**A3 – Restore Default Template**

1. User selects to restore the sample source code.
2. System displays the sample source code corresponding to the selected language.
3. User confirms replacing the current content.
4. The editor updates with the sample source code.
5. User continues to edit the source code.

# 6. Exception Flow

**E1 – ERR-SYS-001: Editor Initialization Error**

1. At step 3, System fails to initialize the Monaco editor.  
2. System halts the editor initialization process.  
3. Frontend logs the error for diagnostic purposes.  
4. UI notifies that it cannot load the source code editor.  
5. User can refresh the page or try again later. 

**E2 – ERR-NET-001: Network Error**

1. During the loading of the page or necessary resources for the editor, the network connection is interrupted.
2. UI notifies that it cannot load the full functionality.
3. User can try to refresh the page when the connection is restored.

**E3 – ERR-RES-001: Problem Not Found**

1. During the access to the problem, System cannot find the corresponding problem.
2. System does not continue to initialize the writing environment for that problem.
3. UI notifies that the problem does not exist or is no longer available.
4. User can return to the problem list.

**E4 – ERR-PERM-001: Problem Not Publicly Accessible**

1. System detects that the problem is no longer in a public state or the User is not permitted to access it.
2. System refuses to provide the problem's content.
3. UI notifies that the problem is not available.
4. The Use Case ends.