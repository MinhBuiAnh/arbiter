# Design Class Diagram and Class Specification Ruleset

**Arbiter — Online Judge Platform**

| Document control | Value |
|------------------|-------|
| Project | Arbiter — Online Judge Platform |
| Applies to | The design class diagram and its class specifications |
| Diagram-design basis | [Combined Analysis Class Diagram](../../ArchitecturalDesign/AnalysisClassDiagram/Combined/ACD-Combined.md) |
| Specification basis | [Design Class Diagram](DesignClassDiagram.md) |
| Status | Draft |
| Version | 0.2 |
| Date | 2026-11-16 |

---

## 1. Purpose and Scope

This ruleset defines how to transform the combined analysis class diagram (ACD) into a design class diagram (DCD), and how to document each DCD class in a class design specification. The ACD guides the design of the DCD. Once the DCD is approved as the design baseline, it is the sole source of truth for the class specifications: a specification must not add, remove, rename, or change any class, attribute, operation, parameter, or type shown in the DCD.

The DCD must remain traceable to the ACD. It may refine or reorganize the analysis model to make the design simple, reusable, easy to implement, and focused, but it must not silently lose required responsibilities or introduce unrelated product behavior. Specifications explain the DCD; they do not revise it. If a necessary correction is found, update the DCD and its affected specifications together.

## 2. Identifying and Refining Design Elements

For each ACD class, choose the smallest design representation that preserves its responsibility:

1. **Map directly to one design class** when the analysis class is already a simple, cohesive abstraction.
2. **Split into multiple design classes** when the analysis class combines responsibilities that should be independently reusable, testable, or changed.
3. **Represent as a package or subsystem** when the analysis class describes an interface, integration, or cohesive capability whose implementation contains multiple elements.
4. **Combine these strategies** when a subsystem or package also needs explicit design classes for its key data, contracts, or behavior.

Every design class must have one clear purpose. Split classes along cohesive responsibilities, not merely to reduce the number of attributes or operations. Do not retain an analysis class as a design class solely for one-to-one name matching when its design responsibility is no longer cohesive.

Keep a traceable mapping from each ACD class, attribute, and operation to its design destination. When an element is split, moved, consolidated, or intentionally excluded as analysis-only, make that disposition clear in the diagram or its accompanying specification. Do not duplicate an operation across design classes unless the distinct responsibilities are explicit.

## 3. Design Class Kinds

Preserve the ACD's Boundary, Control, and Entity responsibilities, applying the following implementation rules:

### 3.1 Boundary

- **User-interface boundaries** are designed as React components and supporting TypeScript types, hooks, and modules. Use idiomatic React composition and TypeScript types for props, state, events, and API data; represent UI operations as component behavior or appropriate functions/hooks rather than assuming every UI element is a class.
- Keep presentation and interaction state in the UI layer. Do not place domain rules or persistence behavior in UI components.
- **System interfaces**—such as persistence, message queue, execution environment, and protected storage—are usually modeled as subsystems, not as ordinary domain classes. Show the subsystem contract and its relevant provided/required interfaces or ports; represent adapters or implementations only when their design responsibilities need to be explicit.
- Treat the application API as the boundary between the UI or external callers and application controllers. Show request/response contracts and transport responsibilities at this boundary, not domain decision-making.

### 3.2 Entity

- Model entities and other domain data in Go, using Go-appropriate names and types (for example, structs, defined types, slices, maps, pointers, and interfaces where appropriate).
- Keep each entity focused on its domain data and invariants. Refactor the analysis model when needed to avoid oversized entities or represent performance-sensitive data appropriately, while preserving required behavior and making the design decision traceable.
- Distinguish persisted/domain state from derived or transient values. Do not imply that every ACD attribute must be stored.

### 3.3 Control

- Model controllers and application behavior in Go, organized as modules within a modular monolith.
- Controllers coordinate use cases and dependencies; keep domain invariants with the relevant entity/domain behavior and infrastructure details behind subsystem contracts or adapters.
- Keep controllers cohesive around a capability represented in the ACD. Split a controller when it would otherwise own unrelated use cases or become difficult to change independently.

## 4. Packaging and Architecture

- Package the application as a **modular monolith**: one deployable application with cohesive internal modules, not a set of independently deployed services.
- Organize packages primarily around domain capabilities (for example, account/authentication, problem catalog, submissions, judging, test cases, and progress), then separate MVC responsibilities within or across those modules as appropriate.
- Apply MVC responsibilities consistently: Boundary elements handle views and external interaction, Control elements coordinate application use cases, and Entity elements represent domain state and rules. Infrastructure adapters implement system-interface contracts.
- Give each package or subsystem a clear responsibility and an intentional public contract. Prefer interactions through that contract over coupling to another module's internal types or storage.
- Do not create a package for every class. Group related classes, contracts, and adapters where they change together; keep unrelated responsibilities separate.
- Show package/subsystem containment and cross-module dependencies in the DCD. Do not model an internal module as a separately deployed system.

## 5. Attributes, Operations, Types, Visibility, and Scope

### 5.1 Types and names

- Give every design attribute and operation parameter/return value an explicit type, using the implementation language of its element: TypeScript for UI, Go for Go components.
- Use domain-specific types where they improve clarity or protect invariants; use collections and optional values that express the actual cardinality and absence semantics.
- Give operations explicit parameter and result types. Show error results for operations that can fail; do not model failures as valid-looking data.
- Use idiomatic language naming and avoid retaining vague analysis-level names when the design responsibility is more precise.

### 5.2 Visibility

- Follow the visibility model of the implementation language. In Go, identifiers beginning with an uppercase letter are exported and lowercase identifiers are package-private; Go has no `protected` visibility. In TypeScript UI elements, use TypeScript's visibility and module-export conventions.
- In UML notation, use `+` for exported/public and `-` for unexported/package-private members. Do not use `#` to imply Go protected visibility.
- Expose only the members required by callers outside the owning class or package. Keep implementation details private to their owner.

### 5.3 Scope

- Mark a member as **instance scope** when each object/component instance owns its value or behavior; mark it as **classifier scope** only when it is shared by the type or module.
- Use UML `{static}` or an equivalent explicit notation for classifier scope. In Go, represent classifier-level behavior with package-level functions or values rather than implying Go has static methods.
- Prefer instance state and dependency injection. Avoid mutable package-level state unless shared state is an intentional, justified design requirement.

## 6. Relationships and Multiplicity

Unlike the ACD, which shows only communication, the DCD must show the design relationships needed to understand structure and ownership. Add relationships based on the refined design; do not infer them solely from an ACD communication arrow.

- Use **association** for a structural reference or collaboration between design elements, and label navigability where it matters.
- Use **composition** only when the whole owns the part's lifecycle; use **aggregation** only when shared whole-part semantics are intentional. Do not use either as decorative alternatives to association.
- Use **dependency** for a use that does not represent a persistent structural reference.
- Show **generalization** only when a real subtype relationship exists. Prefer Go composition and interface implementation over class inheritance; show interface realization when a Go type fulfills a contract.
- Put role names and multiplicities at association ends whenever they clarify ownership or cardinality. Use UML multiplicity notation (`1`, `0..1`, `0..*`, `1..*`, or an explicit range) and ensure it agrees with the declared types and lifecycle rules.
- Use relationship direction consistently with the design's navigability and dependency direction. Avoid bidirectional relationships unless both directions are genuinely required.

## 7. Diagram Notation and Consistency

- Use UML class-diagram notation and PlantUML, consistent with the combined ACD.
- Show packages and subsystems with clear containment and names. Distinguish a contract/interface from its implementation and show relevant dependencies.
- Keep class names, member names, types, visibility, scope, and relationship ends consistent with the class design specification and the chosen language conventions.
- Keep the diagram readable. If a capability is too detailed for one view, use linked package or subsystem views without omitting its traceability to the combined ACD.

## 8. Review Checklist

- [ ] Every ACD class and relevant member has a traceable design destination or an explicit, justified disposition.
- [ ] Each design class has one cohesive purpose; splits, packages, and subsystems simplify rather than obscure responsibilities.
- [ ] Boundary, Control, and Entity responsibilities are preserved and implemented according to their respective rules.
- [ ] UI design uses React and typed TypeScript; Go components use idiomatic Go types and visibility.
- [ ] System interfaces are modeled as subsystems where appropriate, with clear contracts and adapters.
- [ ] Packages follow modular-monolith and MVC responsibilities without implying independent deployment.
- [ ] Attributes and operations have explicit types, correct visibility, and intentional instance or classifier scope.
- [ ] Structural relationships, ownership, navigability, and multiplicities are explicit and consistent with the design.
- [ ] The diagram introduces no unrelated behavior and remains readable and consistent with the class design specification.

## 9. Class Design Specification Rules

### 9.1 Authority and completeness

- Create one specification for every class, interface, or other classifier whose members are specified in the DCD. Use the classifier's exact name and identify its package or subsystem as shown in the DCD.
- Treat [DesignClassDiagram.md](DesignClassDiagram.md) as the authoritative source for every specified class and member. Do not add, omit, rename, or alter attributes, operations, parameters, types, visibility, scope, or signature details.
- Keep each specification synchronized with the DCD. If a member changes in the DCD, update its specification in the same change; never make a specification-only change to the design model.
- Descriptions, exception notes, method text, and supplementary diagrams may explain existing design elements and behavior, but must not introduce new class members, behavior, or relationships not present in the DCD or supported by its referenced interaction design.
- Use the implementation-language types and notation shown in the DCD. Do not translate, broaden, narrow, or otherwise reinterpret a type in the specification.

### 9.2 Required structure

Use the following sections, in this order, for every class specification:

1. **Class identification** — class name and package/module, matching the DCD.
2. **Attribute design** — one table with the columns below. Include every DCD attribute exactly once. Use `—` when no default is specified; do not treat that marker as a literal default value.
3. **Operation design** — one table with the columns below. Include every DCD operation exactly once. The name column contains the operation name and parameter signature, but excludes all return type notation. Record the return type or types in the separate return-type column; use `void` when the operation has no return value.
4. **Parameter design** — for each operation, a table with the columns below and one row per parameter in its DCD signature, in signature order. Identify the operation above its parameter table. For a parameterless operation, state that it has no parameters.
5. **Exception** — list possible exceptions or error outcomes relevant to the class's operations, with the supporting sequence-diagram references. State `None identified in the referenced sequence diagrams` when none apply; do not invent exceptions.
6. **Method** — describe how each operation is implemented, following §9.5.
7. **Other diagrams** — optional; include only when one of the conditions in §9.6 applies.

The **Attribute design** table must use these columns:

| Name | Data type | Visibility | Scope | Default value | Description |
|------|-----------|------------|-------|---------------|-------------|

The **Operation design** table must use these columns:

| Name (signature without return type) | Return type(s) | Visibility | Scope | Description |
|--------------------------------------|-----------------|------------|-------|-------------|

Each **Parameter design** table must use these columns:

| Name | Data type | Default value | Direction | Description |
|------|-----------|---------------|-----------|-------------|

### 9.3 Exact member and signature consistency

- Verify each specification's attribute and operation sets against the DCD. Do not document an attribute or operation absent from that class in the diagram, even if it seems useful to implementation.
- Preserve attribute names, types, visibility, and scope exactly. A default value is optional only when the DCD specifies one; otherwise use `—`.
- Preserve each operation's name, parameter names and order, parameter types, return type(s), visibility, and scope exactly. The operation name cell must not duplicate return types.
- The parameter table is a breakdown of the operation signature, not a place to invent or change parameters. Preserve any DCD default exactly; use `—` if no default is specified. Use only `in`, `out`, or `inout` for direction, as represented by the DCD; where the DCD does not mark a direction, record the ordinary input direction as `in`.
- An operation with multiple return values must show all return types in DCD order. Do not turn error results or other return values into exceptions, or exceptions into return values.
- A classifier with no attributes or no operations must say so in the corresponding section rather than adding illustrative members.

### 9.4 Exception evidence

- Use the sequence diagrams under `ArchitecturalDesign/SequenceDiagram/` to identify operation failure paths and exceptional outcomes. Check both primary diagrams and their exception supplements.
- Include only exceptions or error outcomes supported by a relevant sequence diagram. Preserve the documented error code/name and explain briefly when it occurs and how the operation or caller handles it.
- Distinguish errors returned by an operation from exceptions or failure outcomes described in interaction flows. Do not claim a language-level exception where the design describes a returned error, rejected response, retry, or unknown client outcome.
- Cite the relevant diagram using a relative Markdown link. If no relevant sequence diagram documents an exception, state that none was identified; do not infer one solely from a technology or operation name.

### 9.5 Method descriptions

Describe the implementation of each DCD operation. Keep the description at design level, and cover the following where applicable:

- **Collaborators:** which DCD objects, interfaces, or operations are called or coordinated, and the order or purpose of their use. Use only relationships and operations supported by the DCD and referenced sequence diagrams.
- **Attributes and parameters:** how the operation reads or changes the class's existing attributes and how it uses each existing parameter. Clarify derived or transient values without turning them into new attributes.
- **Relationships:** how existing associations, dependencies, compositions, or interface contracts are used, including ownership and lifecycle implications where relevant.
- **Outcome and failure handling:** the operation's result and any evidenced exception/error behavior, consistent with the operation table and exception section.

Provide a method description for every operation in the DCD. Do not add helper methods, hidden state, new collaborators, or implementation behavior that changes the DCD. If details are not established by the diagram or sequence design, identify the detail as unspecified rather than inventing it.

### 9.6 Other diagrams

Supplementary diagrams are optional. Include them only when they materially clarify an existing design:

- Use a **flow chart** for a complex or special algorithm that is difficult to follow in prose.
- Use a **sequence diagram** when a complex collaboration among objects or operations needs clarification. It must remain consistent with the DCD and the architectural sequence diagrams.
- Use a **state machine diagram** when the class has multiple meaningful states and/or state transitions.

Every supplementary diagram must describe only the classes, members, relationships, and behavior established by the DCD and its referenced design flows. Keep it linked from the relevant specification and do not use it to introduce a design change.

## 10. Class Specification Review Checklist

- [ ] Every DCD classifier requiring a specification has one, and its name and package match the diagram.
- [ ] The attribute and operation tables contain exactly the members shown for that classifier in the DCD.
- [ ] Attribute names, types, visibility, scope, and any defaults match the DCD.
- [ ] Operation signatures, parameters, return types, visibility, and scope match the DCD; the operation name column excludes return types.
- [ ] Each operation's parameter table has the exact signature parameters in order, with defaults and directions recorded as specified.
- [ ] Exception entries are supported by relevant sequence diagrams and linked; no unsupported exceptions are invented.
- [ ] Every operation has a method description covering applicable collaborators, attributes/parameters, relationships, and outcomes without adding members or behavior.
- [ ] Any optional diagrams clarify existing design and remain consistent with the DCD and sequence diagrams.