# Analysis Class Diagram Ruleset

**Arbiter — Online Judge Platform**

| Document control | Value |
|------------------|-------|
| Project | Arbiter — Online Judge Platform |
| Applies to | Analysis class diagrams under `ArchitecturalDesign/AnalysisClassDiagram/` |
| Behavioral basis | Existing sequence diagrams under `ArchitecturalDesign/SequenceDiagram/` |
| Related ruleset | [Sequence Diagram Ruleset](../SequenceDiagram/Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-15 |

---

## 1. Purpose and Scope

This ruleset defines the required abstraction and class relationships for Arbiter analysis class diagrams. The existing sequence diagrams are the basis for identifying the classes and communications to represent.

Analysis class diagrams describe the system at an implementation-independent level. They are not a place to introduce behavior or design decisions that are not represented in the sequence diagrams.

## 2. Class Types

Every analysis class must be exactly one of these three types:

| Type | Represents |
|------|------------|
| **Boundary** | User and system interfaces |
| **Control** | Controller classes |
| **Entity** | Model classes |

Do not introduce a fourth class type.

## 3. Sequence Diagram Coverage and Abstraction

Represent everything captured in the sequence diagrams in the analysis class diagrams, while keeping the representation implementation-independent.

Include class attributes and operations (methods) represented by the sequence diagrams, in addition to the classes and their communications.

Do not express implementation-specific choices such as programming languages, frameworks, or particular UI technologies (for example, Go or React).

## 4. Class Communication

Show only which class communicates to which other class.

Do not specify the relationship's type or multiplicity. For example, do not show one-to-one or one-to-many relationships.

## 5. Review Checklist

- [ ] Every class is categorized as Boundary, Control, or Entity.
- [ ] The diagrams represent everything captured in the existing sequence diagrams.
- [ ] Relevant class attributes and operations (methods) from the sequence diagrams are shown.
- [ ] The representation does not include implementation-specific choices.
- [ ] Relationships show only which classes communicate; no relationship type or multiplicity is specified.