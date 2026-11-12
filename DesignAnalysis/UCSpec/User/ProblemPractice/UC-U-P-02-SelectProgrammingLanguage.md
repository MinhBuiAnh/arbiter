# Use Case Specification

**UC-U-P-02 - Select Programming Language**

**Version:** 1.0

# 1. General Information

- Use Case ID: UC-U-P-02
- Use Case Name: Select Programming Language
- Brief Description: Allow User to select a supported programming language to write and submit solutions for the problem.
- Participating Actors: User, Administrator (can also use this feature through inheritance from User).

# 2. Preconditions

- The user has logged into the system.
- The user is accessing the interface to write a solution for a problem.
- The system has a list of supported programming languages.

# 3. Postconditions

- The selected programming language becomes the current language for the session.
- The editor is configured according to the chosen language.
- The selected language is ready to be used when submitting a solution.
- No submissions are created solely by selecting a language.

# 4. Main Flow

1. User accesses the programming language selection area on the solution writing interface.
2. System displays the list of supported programming languages.
3. User selects a programming language.
4. System checks if the selected language is in the list of supported languages.
5. System updates the current language for the session.
6. The editor updates its configuration according to the selected language, such as syntax and source code highlighting.
7. UI displays the current language.
8. User can continue writing the solution or proceed to UC-U-P-03 – Submit Solution.

# 5. Alternative Flow

**A1 – Change Selected Language**

1. User has previously selected a language.
2. User selects a different language from the list.
3. System checks the new language.
4. System updates the current language.
5. The editor updates its corresponding configuration.
6. The use case ends.

**A2 – Re-select Current Language**

1. User reselects the language currently in use.
2. System identifies that the language has not changed.
3. System retains the current configuration.
4. The use case ends.

**A3 – Restore Language-specific Template**

1. After selecting a new language, User requests to restore the corresponding template code.
2. System displays the template code for the selected language.
3. User confirms replacing the current content.
4. The editor updates the template code.
5. The use case ends.

# 6. Exception Flow

**E1 – ERR-VAL-001: Unsupported Programming Language**

1. At step 4, System detects that the requested language is not in the list of supported languages.
2. System rejects the selection.
3. System retains the current language.
4. UI notifies that the language is unsupported.
5. User selects a valid language again.

****E2 – ERR-SYS-001: Editor Configuration Error**

1. At step 6, the editor fails to update its configuration according to the new language.
2. System logs the error.
3. UI notifies that the editor configuration cannot be changed.
4. System retains the nearest valid configuration if possible.
5. User can try selecting the language again.

**E3 – ERR-NET-001: Network Error**

1. During the loading of the language list or necessary configuration, the connection is interrupted.
2. UI notifies that it cannot load the necessary data.
3. User can retry when the connection is restored.