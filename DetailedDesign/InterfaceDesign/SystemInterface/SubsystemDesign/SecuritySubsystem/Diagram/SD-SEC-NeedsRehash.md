# Sequence Diagram — Security Subsystem — NeedsRehash

| Field | Value |
|---|---|
| Sequence Diagram ID | SD-SEC-NeedsRehash |
| Realized operation | `CredentialVerifier.NeedsRehash` |
| Internal realization | `Argon2idVerifier.NeedsRehash` |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-18 |

## 1. Scope

Shows the bounded, non-cryptographic inspection that reports whether a hash should be replaced with the current Argon2id profile.

## 2. Diagram

```plantuml
@startuml SD-SEC-NeedsRehash
title Security Subsystem - NeedsRehash
hide footbox
autonumber
skinparam shadowing false
skinparam responseMessageBelowArrow true
skinparam defaultFontName "Helvetica"
skinparam defaultFontSize 12

participant "CredentialVerifier\n(interface entry)" as Port
participant "Argon2idVerifier" as Verifier

Port -> Verifier : NeedsRehash(hash)
Verifier -> Verifier : parse bounded PHC encoding\n(maximum 256 bytes)
alt valid current profile
  Verifier --> Port : false
else malformed, unsupported, or non-current profile
  Verifier --> Port : true
end
note over Port, Verifier
  This operation does not derive a key. Callers use the result
  only after Verify has succeeded for the same stored hash.
end note
@enduml
```

## 3. Notes

- Current-profile matching includes algorithm, version, memory, iterations, parallelism, salt length, and derived-key length; the random salt value itself is not compared.
- A `true` result is a migration signal, not proof that the supplied password is valid.
