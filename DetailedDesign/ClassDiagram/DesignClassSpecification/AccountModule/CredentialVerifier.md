# CredentialVerifier — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `CredentialVerifier` |
| Classifier kind | Interface |
| Package / subsystem | `Account Module (Go)` |
| DCD alias | `ACCCredentialVerifier` |
| Design class diagram | [DesignClassDiagram.md](../../DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-16 |

## 1. Class identification

`CredentialVerifier` is an interface in the `Account Module (Go)` package/subsystem of the design class diagram.

Port for credential hashing and verification, realized by the security subsystem.

- Declared incoming design relationships: `AuthService`, `Argon2idVerifier`.
- Realized by: `Argon2idVerifier`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|
| `Hash(plain: string)` | `(string, error)` | Public | Instance | Derives a password hash from the plain value using the configured credential algorithm. |
| `Verify(hash: string, plain: string)` | `bool` | Public | Instance | Compares a plain value against a stored hash without exposing the hash. |
| `NeedsRehash(hash: string)` | `bool` | Public | Instance | Reports whether a stored hash uses outdated parameters and should be replaced. |

## 4. Parameter design

### `Hash(plain: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `plain` | `string` | — | in | Supplies the plain credential value. |

### `Verify(hash: string, plain: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `hash` | `string` | — | in | Supplies the stored credential hash. |
| `plain` | `string` | — | in | Supplies the plain credential value. |

### `NeedsRehash(hash: string)`

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|
| `hash` | `string` | — | in | Supplies the stored credential hash. |

## 5. Exception

None identified in the referenced sequence diagrams.

## 6. Method

### `Hash(plain: string)`

Derives a password hash from the plain value using the configured credential algorithm. It is implemented by `Argon2idVerifier`. It is called by `AuthService`. It uses `plain`. It returns `(string, error)`. Failures are returned through the declared error result rather than as a successful value.

### `Verify(hash: string, plain: string)`

Compares a plain value against a stored hash without exposing the hash. It is implemented by `Argon2idVerifier`. It is called by `AuthService`. It uses `hash`, `plain`. It returns `bool`.

### `NeedsRehash(hash: string)`

Reports whether a stored hash uses outdated parameters and should be replaced. It is implemented by `Argon2idVerifier`. It is called by `AuthService`. It uses `hash`. It returns `bool`.

## 7. Other diagrams

None required. The design class diagram and the referenced sequence diagrams fully explain this classifier.
