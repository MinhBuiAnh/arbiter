# Argon2idVerifier — Subsystem Element Specification

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Subsystem element specification |
| Element | `Argon2idVerifier` |
| Owning subsystem | Security Subsystem (Go) |
| Classifier kind | Class |
| Realized interface | [CredentialVerifier](../../../../../ClassDiagram/DesignClassSpecification/AccountModule/CredentialVerifier.md) |
| Interface-facing class specification | [Argon2idVerifier](../../../SubsystemInterfaceDesign/SecuritySubsystem/Argon2idVerifier.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-18 |

## 1. Identification

`Argon2idVerifier` is the concrete, stateless adapter that realizes the Account Module's `CredentialVerifier` interface. It owns the Argon2id profile, PHC parsing and formatting, and safe verification behavior.

## 2. Attribute Design

No instance attributes are required. The current Argon2id profile and encoded-input limit are package constants.

## 3. Operation Design

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|---|---|---|---|---|
| `Hash(plain: string)` | `(string, error)` | Public | Instance | Generates a unique salted Argon2id hash in PHC string format. |
| `Verify(hash: string, plain: string)` | `bool` | Public | Instance | Verifies a password against a supported PHC-encoded hash. |
| `NeedsRehash(hash: string)` | `bool` | Public | Instance | Detects malformed, unsupported, or non-current hash profiles. |

## 4. Parameter Design

### `Hash(plain: string)`

| Name | Data type | Default value | Direction | Description |
|---|---|---|---|---|
| `plain` | `string` | — | in | Password bytes to hash; the Account Module enforces the password policy. |

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
| `ERR-SYS-001` | `crypto/rand` cannot provide the salt bytes. | Return an error and no hash; the caller does not persist a credential. | [SD-SEC-Hash](../Diagram/SD-SEC-Hash.md) |
| Invalid or unsupported hash | `Verify` receives an oversized, malformed, or unsupported hash. | Return `false` without running Argon2id or exposing parsing details. | [SD-SEC-Verify](../Diagram/SD-SEC-Verify.md) |
| Rehash required | The hash is malformed, unsupported, or does not match the current profile. | `NeedsRehash` returns `true`; callers use it only after successful verification. | [SD-SEC-NeedsRehash](../Diagram/SD-SEC-NeedsRehash.md) |

## 6. Method

### `Hash(plain: string)`

Reads a fresh 16-byte salt from `crypto/rand`, derives a 32-byte key with `golang.org/x/crypto/argon2.IDKey` using Argon2id version 19 and the current profile (`m=19456 KiB`, `t=2`, `p=1`), then serializes the parameters, salt, and key as an unpadded-base64 PHC string. It does not trim, normalize, log, or persist `plain`. If the random read fails, it returns an error and no hash. It uses `plain` and the package-level profile constants. It returns `(string, error)`.

### `Verify(hash: string, plain: string)`

Rejects strings over 256 bytes, malformed PHC encodings, and profiles outside the explicit supported-profile allowlist before deriving a key. For an allowed profile, it derives a candidate key and compares it to the stored key with `crypto/subtle.ConstantTimeCompare`. Invalid encodings and mismatches both return `false`; neither condition is exposed as a detailed error. It uses `hash`, `plain`, the profile allowlist, `argon2.IDKey`, and `subtle.ConstantTimeCompare`. It returns `bool`.

### `NeedsRehash(hash: string)`

Parses the bounded PHC string and compares its algorithm version, parameter tuple, salt length, and key length with the current profile. It returns `true` for malformed, unsupported, or non-current profiles and `false` only for a valid current-profile hash. It does not derive a key. It uses `hash` and the package-level profile constants. It returns `bool`.

## 7. Other Diagrams

- [Hash](../Diagram/SD-SEC-Hash.md)
- [Verify](../Diagram/SD-SEC-Verify.md)
- [NeedsRehash](../Diagram/SD-SEC-NeedsRehash.md)
