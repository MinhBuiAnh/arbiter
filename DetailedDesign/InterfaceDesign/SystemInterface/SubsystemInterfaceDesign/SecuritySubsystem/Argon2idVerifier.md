# Argon2idVerifier — Class Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Class design specification |
| Class | `Argon2idVerifier` |
| Classifier kind | Class |
| Package / subsystem | `Security Subsystem (Go)` |
| DCD alias | `SECArgon2idVerifier` |
| Design class diagram | [DesignClassDiagram.md](../../../../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Ruleset.md](../../../../ClassDiagram/Ruleset.md) |
| Status | Draft |
| Version | 0.2 |
| Date | 2026-11-18 |

## 1. Class identification

`Argon2idVerifier` is a class in the `Security Subsystem (Go)` package/subsystem of the design class diagram.

Argon2id adapter that realizes `CredentialVerifier`.

- Declared outgoing design relationships: `CredentialVerifier`.
- Realizes: `CredentialVerifier`.

## 2. Attribute design

No attributes are specified for this classifier in the DCD.

## 3. Operation design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|---|---|---|---|---|
| `Hash(plain: string)` | `(string, error)` | Public | Instance | Produces a salted Argon2id password hash in PHC string format. |
| `Verify(hash: string, plain: string)` | `bool` | Public | Instance | Verifies a plaintext password against a supported encoded Argon2id hash. |
| `NeedsRehash(hash: string)` | `bool` | Public | Instance | Reports whether an encoded hash is malformed, unsupported, or does not use the current profile. |

## 4. Parameter design

### `Hash(plain: string)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `plain` | `string` | — | in | Password bytes to hash; callers enforce the password policy. |

### `Verify(hash: string, plain: string)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `hash` | `string` | — | in | Stored PHC-encoded Argon2id hash. |
| `plain` | `string` | — | in | Password bytes to verify. |

### `NeedsRehash(hash: string)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `hash` | `string` | — | in | Stored PHC-encoded Argon2id hash. |

## 5. Exception

| Error / outcome | Condition | Handling | Evidence |
|---|---|---|---|
| `ERR-SYS-001` | The cryptographic random source fails while generating a salt. | Return an error and no hash; the caller aborts the operation without persisting a credential. | [SD-SEC-Hash](../../SubsystemDesign/SecuritySubsystem/Diagram/SD-SEC-Hash.md) |
| Invalid or unsupported hash | `Verify` receives malformed, oversized, or unsupported encoded data. | Return `false` without deriving a key or exposing parsing details. | [SD-SEC-Verify](../../SubsystemDesign/SecuritySubsystem/Diagram/SD-SEC-Verify.md) |

`NeedsRehash` returns `true` for malformed, unsupported, or non-current encodings; it returns `false` only for a valid current-profile hash.

## 6. Method

### `Hash(plain: string)`

Generates a fresh 16-byte salt using `crypto/rand`, derives a 32-byte key with Argon2id using the current profile (`m=19456 KiB`, `t=2`, `p=1`), and encodes the algorithm, version, parameters, salt, and key as a PHC string. It does not trim, normalize, log, or persist the password. If salt generation fails, it returns an error and no hash. It uses `plain` and the fixed profile. It returns `(string, error)`.

### `Verify(hash: string, plain: string)`

Rejects encodings longer than 256 bytes, malformed PHC strings, and parameters outside the explicit supported-profile allowlist before performing a derivation. For a supported profile, it derives a candidate key and compares it with the stored key using `crypto/subtle.ConstantTimeCompare`. It returns `false` for invalid encodings or a mismatch and does not reveal the reason. It uses `hash`, `plain`, and the supported-profile allowlist. It returns `bool`.

### `NeedsRehash(hash: string)`

Parses the bounded PHC string and compares its algorithm version, parameters, salt length, and key length with the current profile. It returns `true` when the encoding is malformed, unsupported, or non-current, and `false` only when it matches the current profile. Callers use this result only after successful verification. It uses `hash` and the current profile. It returns `bool`; it performs no key derivation.

## 7. Other diagrams

- [Hash](../../SubsystemDesign/SecuritySubsystem/Diagram/SD-SEC-Hash.md)
- [Verify](../../SubsystemDesign/SecuritySubsystem/Diagram/SD-SEC-Verify.md)
- [NeedsRehash](../../SubsystemDesign/SecuritySubsystem/Diagram/SD-SEC-NeedsRehash.md)
