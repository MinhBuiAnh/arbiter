# Sequence Diagram — Security Subsystem — Verify

| Field | Value |
|---|---|
| Sequence Diagram ID | SD-SEC-Verify |
| Realized operation | `CredentialVerifier.Verify` |
| Internal realization | `Argon2idVerifier.Verify` |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-18 |

## 1. Scope

Shows bounded PHC validation, Argon2id derivation for a supported profile, constant-time key comparison, and fail-closed handling of malformed or unsupported encodings.

## 2. Diagram

```plantuml
@startuml SD-SEC-Verify
title Security Subsystem - Verify
hide footbox
autonumber
skinparam shadowing false
skinparam responseMessageBelowArrow true
skinparam defaultFontName "Helvetica"
skinparam defaultFontSize 12

participant "CredentialVerifier\n(interface entry)" as Port
participant "Argon2idVerifier" as Verifier
participant "golang.org/x/crypto/argon2" as Argon2
participant "crypto/subtle" as Subtle

Port -> Verifier : Verify(hash, plain)
Verifier -> Verifier : validate bounded PHC encoding\n(maximum 256 bytes)
alt malformed or unsupported profile
  Verifier --> Port : false (no derivation)
else supported profile
  Verifier -> Argon2 : IDKey(plain bytes, decoded salt,\n parameters from supported profile)
  Argon2 --> Verifier : candidate key bytes
  Verifier -> Subtle : ConstantTimeCompare(candidate, stored key)
  Subtle --> Verifier : equal or not equal
  alt keys match
    Verifier --> Port : true
  else keys differ
    Verifier --> Port : false
  end
end
note over Port, Verifier
  Invalid encodings and password mismatches both return false.
  Parsing details and credential values are not exposed or logged.
end note
@enduml
```

## 3. Notes

- Stored parameters are checked against an explicit bounded allowlist before they can control memory or CPU cost.
- Comparison uses equal-length derived keys and `crypto/subtle.ConstantTimeCompare`.
- The caller maps `false` to its generic invalid-credential behavior; the subsystem does not distinguish an absent account from a mismatch.
