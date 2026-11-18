# Sequence Diagram — Security Subsystem — Hash

| Field | Value |
|---|---|
| Sequence Diagram ID | SD-SEC-Hash |
| Realized operation | `CredentialVerifier.Hash` |
| Internal realization | `Argon2idVerifier.Hash` |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-18 |

## 1. Scope

Shows generation of a fresh random salt, Argon2id derivation with the current profile, PHC encoding, and the documented entropy-source failure.

## 2. Diagram

```plantuml
@startuml SD-SEC-Hash
title Security Subsystem - Hash
hide footbox
autonumber
skinparam shadowing false
skinparam responseMessageBelowArrow true
skinparam defaultFontName "Helvetica"
skinparam defaultFontSize 12

participant "CredentialVerifier\n(interface entry)" as Port
participant "Argon2idVerifier" as Verifier
participant "crypto/rand" as Random
participant "golang.org/x/crypto/argon2" as Argon2

Port -> Verifier : Hash(plain)
Verifier -> Random : Read 16-byte salt
alt entropy source fails (ERR-SYS-001)
  Random -x Verifier : random read error
  Verifier --> Port : ("", error); no hash produced
else salt generated
  Random --> Verifier : salt bytes
  Verifier -> Argon2 : IDKey(plain bytes, salt,\n time=2, memory=19456 KiB, threads=1, keyLen=32)
  Argon2 --> Verifier : derived key bytes
  Verifier -> Verifier : encode version, parameters, salt, and key as PHC string
  Verifier --> Port : (encoded hash, nil)
end
note over Port, Verifier
  Plaintext, salt, derived key, and encoded hash values
  are not logged. The caller receives the encoded hash
  only as the operation result.
end note
@enduml
```

## 3. Notes

- The encoded string uses the Argon2id PHC identifier and version 19 with `m=19456,t=2,p=1`.
- The random salt is unique per invocation; the hash operation does not persist credentials.
- `ERR-SYS-001` is propagated to the caller, which aborts persistence.
