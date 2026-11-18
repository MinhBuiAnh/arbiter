# Subsystem Design Ruleset

**Arbiter — Online Judge Platform**

| Document control | Value |
|---|---|
| Project | Arbiter — Online Judge Platform |
| Applies to | Internal design of every subsystem shown in the design class diagram |
| Basis | [Design Class Diagram](../../../ClassDiagram/DesignClassDiagram/DesignClassDiagram.md) |
| Class specification basis | [Class Design Specification Index](../../../ClassDiagram/DesignClassSpecification/Index.md) |
| Subsystem interface specifications | [Subsystem Interface Design](../SubsystemInterfaceDesign/) |
| Related ruleset | [Design Class Diagram and Class Specification Ruleset](../../../ClassDiagram/Ruleset.md) |
| Status | Draft |
| Version | 0.1 |
| Date | 2026-11-18 |

---

## 1. Purpose and Scope

This ruleset defines how each subsystem in the design class diagram (DCD) is designed internally. The DCD deliberately omits subsystem internals: it identifies the subsystem, the interfaces it realizes, and the external elements that depend on it. This ruleset governs the next stage, in which those subsystems are decomposed into internal classes, interfaces, and contained subsystems; responsibilities are allocated; internal collaborations are designed; and subsystem elements and dependencies are documented.

The external contract of a subsystem is fixed by the DCD and its interface specifications. Subsystem design must realize that contract; it must not silently change it. If a contract change is genuinely required, update the DCD and the affected interface specifications in the same change.

This ruleset applies to every subsystem package in the DCD, including:

- Persistence Subsystem
- Message Queue Subsystem
- Execution Subsystem
- Protected Test Case Store Subsystem
- Security Subsystem

It also applies to any subsystem introduced inside another subsystem when the behavior of an interface operation is complex enough to warrant one.

Subsystem design is an internal design activity. It does not introduce a new deployable service and does not weaken the modular-monolith architecture defined by the DCD.

## 2. Terms and Conformance

- **Subsystem interface** — an interface realized by a subsystem and used by clients of that subsystem. It defines the subsystem's externally visible operations, parameters, return values, and documented failures.
- **Subsystem element** — a class, interface, enumeration, or contained subsystem inside a subsystem boundary.
- **Internal element** — a subsystem element that is not visible outside its owning subsystem.
- **Client** — a model element outside a subsystem that uses that subsystem.
- **Required interface** — an interface of another subsystem or package that a subsystem element depends on.
- **Subsystem design** — the internal model and documentation of a subsystem: its elements, responsibilities, collaborations, and dependencies.

Use the following terms for conformance:

- **Must** — required for a conforming subsystem design.
- **Should** — expected practice; depart only with a documented reason.
- **May** — optional and permissible when it does not weaken a rule.

Exceptions to a **must** rule are permitted only when this ruleset explicitly allows them. Every exception must be local, minimal, explicit, and justified in the affected subsystem design. An exception must not expose subsystem internals or make an unrelated element depend on them.

## 3. Design Principles

Subsystem design follows these principles:

- **Independence:** Each subsystem should be as independent as possible from other parts of the system. It should be possible to evolve different parts of the system independently.
- **Substitutability:** It should be possible to replace any part of the system with a new part, provided the new part supports the same interfaces.
- **Encapsulation:** A subsystem must not expose any of its contents.
- **Interface-based coupling:** A subsystem should depend only on the interfaces of other model elements, so that it is not directly dependent on any specific model elements outside the subsystem. Exceptions are permitted as defined in section 8.
- **Client isolation:** All dependencies on a subsystem must be dependencies on the subsystem interfaces. Clients of a subsystem are dependent on the subsystem interface or interfaces, not on elements within the subsystem.
- **Responsibility-driven decomposition:** Take the responsibilities allocated to the subsystem and further allocate them to the subsystem elements.
- **Reuse before invention:** Reuse an existing class, interface, or contained subsystem when it already provides the required behavior; create a new element only when the existing elements cannot provide it.
- **No duplicated abstractions:** Avoid having effectively the same class in two different subsystems.

## 4. Subsystem Boundary and Interface Contract

### 4.1 Realized interfaces define external behavior

The external behavior of a subsystem is defined only by the interfaces it realizes.

- A subsystem may realize one or more interfaces.
- When a subsystem realizes an interface, it makes a commitment to support each and every operation defined by that interface.
- A subsystem must not require clients to use an operation, type, or element that is not part of a realized interface.
- The subsystem design must account for every operation on every realized interface. An operation may be realized by:
  1. An operation on a class contained by the subsystem; that operation may require collaboration with other classes or subsystems.
  2. An operation on an interface realized by a contained subsystem.
- Realization may delegate or collaborate, but it must preserve the operation's contract, including parameter meaning, return values, and documented failures.
- If an interface operation cannot be realized within the subsystem without changing the contract, stop and update the DCD and interface specifications rather than inventing a different external contract.

### 4.2 Encapsulation

- A subsystem must not expose any of its contents. Its classes, helper interfaces, internal data, and contained subsystems are implementation details.
- Only the subsystem interfaces are visible to clients. Do not make a client depend on an internal class, an internal operation, an internal type, or the concrete implementation of an interface.
- Public signatures of subsystem elements must use types that are part of the subsystem contract or types owned by an explicitly allowed external dependency. Do not leak an internal implementation type through an interface operation.
- In Go, export only the identifiers that must be visible outside their package; keep subsystem internals package-private. In UML notation, use `+` for exported and `-` for unexported members. Do not use `#` because Go has no protected visibility.
- A subsystem may expose an interface for testing or composition only when that interface is part of its intended contract and is documented as such.

## 5. Responsibility Allocation to Subsystem Elements

For each operation on a realized interface, identify the classes, interfaces, or contained subsystems needed to perform the operation.

- Start from the responsibilities assigned to the subsystem by the DCD, the class specifications, and the architectural sequence diagrams.
- Allocate those responsibilities to cohesive subsystem elements. Every externally visible operation must have an identified internal realization.
- Reuse an existing class, interface, or contained subsystem when it can provide the required behavior.
- Create a new class, interface, or contained subsystem only when no existing element can provide the required behavior without violating cohesion or encapsulation.
- Use a contained subsystem only when the required behavior is complex enough to justify its own boundary and contract. Do not introduce a contained subsystem for a small helper responsibility.
- Prefer a class operation for straightforward behavior. Prefer collaboration between classes when a responsibility spans several cohesive concerns.
- Keep each element focused on one responsibility. Split an element when it would otherwise mix unrelated behavior or become difficult to change independently.
- Keep data and invariants with the element that owns them. Do not create a second class in another subsystem that duplicates the same abstraction or responsibility.
- Record the realization of each interface operation in a traceability table in the subsystem design, naming the responsible element and the operations it uses.

## 6. Internal Collaborations and Sequence Diagrams

The collaborations of model elements within a subsystem must be documented using sequence diagrams that show how the subsystem behavior is realized.

- Each operation on an interface realized by the subsystem must have one or more documenting sequence diagrams.
- A diagram is owned by the subsystem and is used to design the internal behavior of that subsystem.
- Use **design classes** when drawing diagrams, **not analysis classes**. Do not reproduce analysis-level responsibilities or names when the design has refined them.
- Each diagram must begin at the realized interface operation and show the internal elements that participate in fulfilling it, in order, together with the operations they invoke.
- Show collaborations with elements outside the subsystem through their interfaces only. Do not draw the internal elements of another subsystem.
- Show the operation's normal outcome and every documented failure or exceptional path. Keep failure behavior consistent with the interface contract and the architectural sequence diagrams.
- A single operation may need several diagrams when its normal flow and its exceptional flows are too large for one readable view. Link all of them from the operation's realization entry.
- Keep diagrams consistent with the subsystem element specifications. Do not invent participants, operations, or relationships that are absent from the documented design.
- Use a stable diagram identifier that includes the subsystem and the interface operation, and record the diagram path in the realization table.

## 7. Documenting Subsystem Elements

Subsystem elements must be documented in the same design-level manner as design classes in the main system.

- Create one specification for every class, interface, enumeration, or contained subsystem that is part of the internal design.
- Use the classifier's exact name and identify its owning subsystem.
- For each internal class or interface, document the same sections used by the main class specifications:
  1. **Identification** — name, owning subsystem, kind, and responsibility.
  2. **Attribute design** — name, data type, visibility, scope, default value, and description.
  3. **Operation design** — name and signature without return type, return type or types, visibility, scope, and description.
  4. **Parameter design** — one table per operation with name, data type, default value, direction, and description.
  5. **Exception** — documented failure outcomes supported by the subsystem's sequence diagrams or the interface contract.
  6. **Method** — how each operation is implemented, including collaborators, attributes and parameters used, relationships, outcome, and failure handling.
  7. **Other diagrams** — only when a supplementary diagram materially clarifies the internal design.
- Follow the member, signature, type, and visibility consistency rules of the [Design Class Diagram and Class Specification Ruleset](../../../ClassDiagram/Ruleset.md) unless a rule explicitly applies only to the DCD.
- Internal elements are deliberately absent from the DCD. The subsystem design is authoritative for them, but it must remain consistent with the DCD's external contract and must not contradict the class specifications.
- Do not duplicate an external subsystem class specification inside the subsystem design. Keep the interface-facing specifications in [Subsystem Interface Design](../SubsystemInterfaceDesign/) and link to them rather than copying their content.
- Each subsystem must have an overview document that states:
  - the subsystem's responsibility;
  - the interfaces it realizes;
  - the interface operations it must support;
  - its internal elements and their responsibilities;
  - the realization of each interface operation;
  - its dependencies and any approved exceptions;
  - links to its internal element specifications and owned sequence diagrams.
- Place subsystem design artifacts under this directory, one subdirectory per subsystem, so that the internal design is kept together and separate from the external interface specifications.

## 8. Subsystem Dependencies

Describe every dependency of a subsystem element explicitly.

- If the element on which a subsystem element is dependent is within a subsystem, the dependency must be on the subsystem interface, not on the subsystem itself and not on any element inside the subsystem.
- If the element on which a subsystem element is dependent is within a package, the dependency should be on the package itself. This may have exceptions, but each exception must be justified in the subsystem design.
- A client outside a subsystem must depend on the subsystem interface, never on the subsystem implementation or an internal element.
- A subsystem element should depend on an interface rather than on a specific external class or subsystem. A direct dependency on a concrete external element is an exception permitted only when no suitable interface exists or the external element is a stable contract type; record the exception and keep it narrow.
- Dependencies must point in the direction of the contract. Prefer a dependency on an interface over a dependency on a concrete class.
- Do not create a dependency cycle between subsystems. If a cycle appears, move the shared contract to a neutral package or introduce a narrow interface on the side that needs the behavior.
- A subsystem design must include a dependency table with these columns:

| Source element | Target interface or package | Reason | Kind | Exception justification |
|---|---|---|---|---|
| The depending element | The interface or package depended on | Why the dependency exists | Interface, package, or allowed exception | Required only when a rule is intentionally departed from |

- Name the target as the interface or package, not as an implementation class. When the target is inside another subsystem, the dependency must identify that subsystem's interface.
- Keep exceptions rare and local. An exception must not expose another subsystem's internals, bypass an interface contract, or make independent evolution impossible.

## 9. Modeling Notation and Consistency

- Use UML notation and PlantUML, consistent with the DCD.
- Show subsystems, packages, interfaces, classes, realizations, and dependencies with their standard UML notation. A realization is a dashed line with a hollow triangle; a dependency is a dashed arrow.
- Do not add internal subsystem elements to the DCD. Show them in the subsystem design and its owned diagrams, and preserve traceability to the realized interface operation.
- Use the implementation language of the element: Go for subsystem elements in this design. Use explicit Go types, idiomatic names, exported or package-private visibility, and `+`/`-` UML visibility markers.
- Use design classes in all subsystem diagrams. Do not use analysis class names, analysis responsibilities, or analysis-only elements.
- Keep names, signatures, types, visibility, scope, relationships, and multiplicities consistent across the subsystem overview, internal element specifications, and owned sequence diagrams.
- Keep diagrams readable. Split a diagram when it obscures the collaboration; do not omit a required participant or failure path to simplify the picture.

## 10. Review Checklist

- [ ] The subsystem realizes every interface and every operation required by the DCD and its interface specifications.
- [ ] No subsystem internals are exposed to clients; only the subsystem interfaces are visible.
- [ ] Every interface operation has an identified internal realization and one or more owned sequence diagrams.
- [ ] Subsystem sequence diagrams use design classes, not analysis classes, and show normal and documented failure flows.
- [ ] Responsibilities are allocated to cohesive classes, interfaces, or contained subsystems; reuse was considered before new elements were created.
- [ ] No effectively identical class is duplicated in another subsystem.
- [ ] Every internal class, interface, enumeration, and contained subsystem is documented to the same standard as a main-system design class.
- [ ] The subsystem overview states its responsibility, realized interfaces, internal elements, operation realizations, dependencies, and exceptions.
- [ ] Every dependency on another subsystem targets that subsystem's interface, not the subsystem itself or an internal element.
- [ ] Dependencies on a package target the package itself, or the exception is justified in the dependency table.
- [ ] No dependency cycle or unnecessary concrete-class dependency remains.
- [ ] The subsystem design remains consistent with the DCD, the class specifications, and the architectural sequence diagrams.
