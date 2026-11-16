# AppShell — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `AppShell` |
| Classifier kind | Class |
| Package / subsystem | `React SPA (TypeScript)` |
| DCD alias | `UIAppShell` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`AppShell` is a class in the `React SPA (TypeScript)` package/subsystem of the design class diagram.

Top-level React shell that composes navigation, authentication context, and the capability views.

- Declared outgoing design relationships: `AuthProvider`, `ProblemBrowser`, `PracticeWorkspace`, `SubmissionTracker`, `SubmissionBrowser`, `ProgressDashboard`, `AdminConsole`.

## 2. Attribute design

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|
| `auth` | `AuthState` | Public | Instance | — | Authentication presentation state that controls navigation and views. |

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `render()` | `JSX.Element` | Public | Instance | Renders the shell from `auth` and the active route, selecting the guest or authenticated navigation and the active capability view. |
| `navigate(route: string)` | `void` | Public | Instance | Changes the active route and renders the capability view associated with it. |
| `showGuestNavigation()` | `void` | Public | Instance | Renders the unauthenticated navigation for a `state` without a usable session. |
| `showAuthenticatedNavigation()` | `void` | Public | Instance | Renders the authenticated navigation for the current principal. |

## 4. Parameter design

### `render()`

This operation has no parameters.

### `navigate(route: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `route` | `string` | — | in | Target route to render. |

### `showGuestNavigation()`

This operation has no parameters.

### `showAuthenticatedNavigation()`

This operation has no parameters.

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-AUTH-003` | Missing, invalid, or expired access token. | The request is rejected as unauthenticated and the client clears authentication state. | [SD-UC-U-A-02-ViewAccountInformation](../../../../ArchitecturalDesign/SequenceDiagram/User/AccountAuthentication/SD-UC-U-A-02-ViewAccountInformation.md) |

## 6. Method

### `render()`

Renders the shell from `auth` and the active route, selecting the guest or authenticated navigation and the active capability view. It has no parameters. It reads the declared attribute(s) `auth`. It returns `JSX.Element`.

### `navigate(route: string)`

Changes the active route and renders the capability view associated with it. It uses `route`. No value is returned.

### `showGuestNavigation()`

Renders the unauthenticated navigation for a `state` without a usable session. It has no parameters. No value is returned.

### `showAuthenticatedNavigation()`

Renders the authenticated navigation for the current principal. It has no parameters. No value is returned.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
