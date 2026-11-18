# Security Subsystem Design

**Arbiter — Online Judge Platform**

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Artifact | Security subsystem design |
| Owning subsystem | Security Subsystem (Go) |
| External contract | [CredentialVerifier](../../../../ClassDiagram/DesignClassSpecification/AccountModule/CredentialVerifier.md) |
| DCD | [DesignClassDiagram.md](../../../../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Ruleset | [Subsystem Design Ruleset](../Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-18 |

## 1. Responsibility

The Security Subsystem realizes the `CredentialVerifier` contract with salted Argon2id password hashing, verification, and profile-upgrade detection. It does not own password policy, account persistence, login policy, or JWT signing; those remain in the Account Module.

The subsystem is an internal part of the modular monolith, not a separately deployed service.

## 2. Realized Interface

| Interface operation | Internal realization | Collaborations | Sequence diagram |
|---|---|---|---|
| `Hash(plain)` | `Argon2idVerifier.Hash` | `crypto/rand`; `golang.org/x/crypto/argon2` | [SD-SEC-Hash](Diagram/SD-SEC-Hash.md) |
| `Verify(hash, plain)` | `Argon2idVerifier.Verify` | `golang.org/x/crypto/argon2`; `crypto/subtle` | [SD-SEC-Verify](Diagram/SD-SEC-Verify.md) |
| `NeedsRehash(hash)` | `Argon2idVerifier.NeedsRehash` | PHC parser and current profile | [SD-SEC-NeedsRehash](Diagram/SD-SEC-NeedsRehash.md) |

`Argon2idVerifier` realizes the existing `CredentialVerifier` interface without changing its external signatures.

## 3. Internal Elements

| Element | Kind | Responsibility | Specification |
|---|---|---|---|
| `Argon2idVerifier` | Class | Generates salted PHC-encoded hashes, verifies supported hashes, and identifies hashes requiring profile migration. | [Argon2idVerifier.md](Specification/Argon2idVerifier.md) |

The interface-facing classifier specification remains in [Subsystem Interface Design](../../SubsystemInterfaceDesign/SecuritySubsystem/Argon2idVerifier.md).

## 4. Dependencies

| Source element | Target interface or package | Reason | Kind | Exception justification |
|---|---|---|---|---|
| `Argon2idVerifier` | `golang.org/x/crypto/argon2` package | Provides the Argon2id key-derivation implementation. | Allowed exception | Go's standard library does not provide Argon2id; the dependency is confined to this adapter. |
| `Argon2idVerifier` | Go standard-library packages (`crypto/rand`, `crypto/subtle`, `encoding/base64`, `fmt`, `strconv`, `strings`) | Generates salts, compares derived keys in constant time, and parses/encodes PHC strings. | Package | — |

The subsystem has no dependency on another Arbiter subsystem implementation. `CredentialVerifier` is the realized port; clients depend on that interface.

## 5. Password-Hash Profile and Handling

The current profile is Argon2id version 19 with 19,456 KiB memory, two iterations, one lane, a 16-byte random salt, and a 32-byte derived key. This meets the minimum Argon2id profile in the [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id). The deployment should benchmark authentication load and increase the cost where capacity permits without lowering the security profile.

Hashes use the PHC string format, which stores the algorithm version and parameters alongside the per-password salt and derived key in the existing `credential_hash` text field. The parser bounds encoded input to 256 bytes and accepts only explicitly supported profiles; it never uses arbitrary stored cost parameters for an Argon2id derivation. When changing the current profile, retain prior profiles in a bounded allowlist until their hashes have been migrated.

- A new independent random salt is generated for every hash. Password bytes are passed unchanged; the verifier does not trim or normalize them.
- `Verify` returns `false` for malformed, unsupported, or mismatching hashes and compares derived keys with a constant-time comparison.
- `NeedsRehash` is a metadata check; callers invoke it only after successful verification.
- Plaintext passwords, salts, derived keys, and encoded hashes are never logged or returned in errors.
- Registration and password-change policy is validated by the Account Module before hashing; login rate limiting remains at the API boundary.

## 6. Owned Sequence Diagrams

- [Hash](Diagram/SD-SEC-Hash.md)
- [Verify](Diagram/SD-SEC-Verify.md)
- [NeedsRehash](Diagram/SD-SEC-NeedsRehash.md)
