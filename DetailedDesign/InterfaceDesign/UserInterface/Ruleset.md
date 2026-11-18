# User Interface Design Ruleset

**Arbiter — Online Judge Platform**

---

## 1. Purpose and Scope

This ruleset defines the visual design language of Arbiter, a reusable token system for color, typography, spacing, surfaces, states, and components. It applies to every screen in the screen inventory and to every shared component used by those screens.

The ruleset governs presentation, not behavior. A visual treatment must never hide a required status, weaken a warning, or make a prohibited data exposure possible.

The product uses a dark theme as its canonical theme. If a light theme is added later, it must preserve the semantic roles in this ruleset and be contrast-tested independently; it must not be a simple inversion of these colors.

Use the following terms:

- Must: Required for visual conformance.
- Should: Expected practice; depart only with a documented reason.
- May: Optional and permissible when it does not weaken a requirement.

## 2. Design Principles

- Judgment is legible: Contrast, hierarchy, and state clarity outrank atmosphere. A verdict, error, or required action must be readable before it is dramatic.
- Crimson is reserved: Crimson marks judgment, primary action, selection, and failure. It is not a decorative wash for ordinary surfaces.
- Teal is counsel: Teal marks guidance, information, focus, links, and secondary emphasis. It should feel quieter than crimson.
- Geometry: Use angular alignment, thin borders, small radii, and restrained lattice motifs.
- Dark by default: The page is an obsidian field with layered charcoal surfaces. Pure white is an emphasis color, not a page background.
- Motion reports state: Transitions confirm hover, focus, disclosure, and state change. They do not perform spectacle.

## 3. Palette Derivation

#18161A: Obsidian canvas and base surfaces 
#FE1551: Crimson accent, glow, and judgment motif
#8E0D2B: Pressed and destructive crimson
#1C4150: Deep teal secondary and borders
#2F7382: Interactive teal and focus support
#F5F1EA: Primary text and inverse contrast
#3A3745: Default borders and dividers
#FFFFFF: Maximum-emphasis text only; never the app canvas

Use the palette in approximately these proportions:

- 60%: Obsidian and charcoal surfaces
- 25%: Ivory, muted neutrals, and teal guidance
- 10%: Crimson action, selection, and judgment accents
- 5%: Semantic support colors for warning, success, and verdict nuances

Large crimson fills are reserved for primary actions, destructive confirmations, selection marks, and small judgment accents. Do not use neon crimson as a page background or as a large decorative panel.


## 4. Core Color Tokens

All palette colors are sRGB hex values; translucent variants are expressed as `rgba`. Components must consume the semantic tokens in §4.5–§4.7 and §5, not raw palette values, except inside token definitions.

### 4.1 Neutral scale

| Token | Hex | Use |
|---|---|---|
| `--ink-950` | `#08080C` | Page canvas, shell background |
| `--ink-900` | `#0B0B10` | App base, navigation background |
| `--ink-850` | `#101016` | Inset panels, input backgrounds, table headers |
| `--ink-800` | `#15151C` | Cards, panels, modal surfaces |
| `--ink-750` | `#1A1A22` | Hover surface, selected-neutral background |
| `--ink-700` | `#1E1E27` | Raised surface, disabled background |
| `--ink-600` | `#2A2833` | Quiet borders, dividers |
| `--ink-500` | `#3A3745` | Structural neutral borders and inactive control fill |
| `--ink-450` | `#5E5968` | Low-emphasis decoration and disabled fill |
| `--ink-400` | `#7A7482` | Disabled text, placeholder text |
| `--ink-300` | `#8A8494` | Muted text, metadata |
| `--ink-200` | `#B8B2C0` | Secondary text, inactive navigation |
| `--ink-100` | `#D9D4DC` | High-emphasis secondary text |
| `--ink-050` | `#F5F1EA` | Primary text |
| `--white` | `#FFFFFF` | Maximum-emphasis text and button labels |

### 4.2 Crimson scale

| Token | Hex | Use |
|---|---|---|
| `--crimson-900` | `#4A0617` | Deepest crimson, pressed states |
| `--crimson-800` | `#6E0A22` | Destructive solid background |
| `--crimson-700` | `#8E0D2B` | Destructive hover, deep accents |
| `--crimson-600` | `#A80E30` | Primary action pressed |
| `--crimson-500` | `#C11238` | Primary action, active navigation, selection |
| `--crimson-400` | `#E01545` | Primary action hover |
| `--crimson-300` | `#FE1551` | Judgment accent, glow, underline, large display text only |
| `--crimson-200` | `#FF7A93` | Danger text and icons on dark surfaces |
| `--crimson-100` | `#FFD0DB` | Text on destructive solid backgrounds |

`--crimson-300` is the sampled neon accent. It must not be used as a background behind white body text, because that combination does not meet normal-text contrast. Use `--crimson-500` or a darker crimson for filled controls.

### 4.3 Teal scale

| Token | Hex | Use |
|---|---|---|
| `--teal-900` | `#06161C` | Deepest teal, inset accents |
| `--teal-800` | `#0B242C` | Secondary-button hover, quiet emphasis |
| `--teal-700` | `#12333D` | Teal borders, selected teal surface |
| `--teal-600` | `#1C4150` | Sampled sash teal, secondary borders |
| `--teal-500` | `#235563` | Secondary controls, chart series |
| `--teal-400` | `#2F7382` | Teal hover and active support |
| `--teal-300` | `#4FA9B7` | Teal icons and secondary emphasis |
| `--teal-200` | `#8FE3EA` | Link hover, bright teal text |
| `--teal-100` | `#D6F7FA` | Text on deep teal backgrounds |

### 4.4 Semantic support colors

| Token | Hex | Use |
|---|---|---|
| `--success` | `#4FD1A5` | Accepted verdict, successful operation |
| `--warning` | `#E8B86D` | Caution, conflict, rate limit, unknown outcome |
| `--system` | `#F2B45C` | Internal or system failure; never a user-code verdict |
| `--danger` | `#FF5C7A` | Error borders, icons, and strong error accents |
| `--danger-text` | `#FF7A93` | Error text on dark surfaces |
| `--info` | `#67C7D6` | Informational status and guidance |
| `--limit` | `#F2B45C` | Resource-limit and memory-limit emphasis |
| `--runtime-error` | `#F08A6A` | Runtime-failure emphasis |
| `--compilation-error` | `#D98BA8` | Compilation-failure emphasis |
| `--focus` | `#5EC8D4` | Focus ring and active control outline |
| `--link` | `#5EC8D4` | Default link text |
| `--link-hover` | `#8FE3EA` | Link hover and active link |

### 4.5 Backgrounds and surfaces

| Token | Value | Use |
|---|---|---|
| `--bg-canvas` | `#08080C` | Page canvas |
| `--bg-base` | `#0B0B10` | App base |
| `--bg-inset` | `#101016` | Inputs, code gutter, inset panels |
| `--bg-surface` | `#15151C` | Cards, panels, tables, modals |
| `--bg-surface-raised` | `#1E1E27` | Dropdowns, popovers, raised cards |
| `--bg-surface-hover` | `#1A1A22` | Row and card hover |
| `--bg-overlay` | `rgba(5, 5, 8, 0.78)` | Modal and drawer scrim |
| `--bg-selection` | `rgba(254, 21, 81, 0.10)` | Selected row or card |
| `--bg-focus-ring` | `rgba(94, 200, 212, 0.24)` | Focus halo |
| `--bg-danger-soft` | `rgba(255, 92, 122, 0.12)` | Error banner and destructive hover |
| `--bg-warning-soft` | `rgba(232, 184, 109, 0.12)` | Warning banner and caution fill |
| `--bg-success-soft` | `rgba(79, 209, 165, 0.12)` | Success banner and accepted fill |
| `--bg-info-soft` | `rgba(103, 199, 214, 0.12)` | Informational banner and status fill |

### 4.6 Borders and dividers

| Token | Hex | Use |
|---|---|---|
| `--border-subtle` | `#24222C` | Quiet decorative separation inside a surface |
| `--border-default` | `#34313D` | Non-essential card and panel outline |
| `--border-control` | `#6F6A78` | Inputs, selects, secondary buttons, and meaningful control boundaries |
| `--border-strong` | `#7A7482` | Emphasized neutral control |
| `--border-accent` | `#E01545` | Active navigation, selected card, judgment accent |
| `--border-focus` | `#5EC8D4` | Keyboard focus |
| `--border-danger` | `#FF5C7A` | Invalid field and error surface |
| `--divider` | `#2A2833` | Decorative table rows and section dividers |

### 4.7 Text colors

| Token | Hex | Use | Minimum contrast target |
|---|---|---|---|
| `--text-primary` | `#F5F1EA` | Headings, body, primary labels | 4.5:1 |
| `--text-secondary` | `#B8B2C0` | Supporting copy, inactive navigation | 4.5:1 |
| `--text-muted` | `#8A8494` | Metadata, helper text, captions | 4.5:1 |
| `--text-disabled` | `#7A7482` | Disabled labels only | 3:1, not for required information |
| `--text-inverse` | `#08080C` | Text on light or ivory surfaces | 4.5:1 |
| `--text-link` | `#5EC8D4` | Links and inline actions | 4.5:1 |
| `--text-link-hover` | `#8FE3EA` | Link hover and focus | 4.5:1 |
| `--text-danger` | `#FF7A93` | Validation, error, destructive emphasis | 4.5:1 |
| `--text-success` | `#4FD1A5` | Accepted and success text | 4.5:1 |
| `--text-warning` | `#E8B86D` | Caution, conflict, rate-limit text | 4.5:1 |
| `--text-info` | `#67C7D6` | Informational text | 4.5:1 |
| `--text-system` | `#F2B45C` | System-failure text | 4.5:1 |
| `--text-limit` | `#F2B45C` | Memory-limit text | 4.5:1 |
| `--text-runtime` | `#F08A6A` | Runtime-error text | 4.5:1 |
| `--text-compilation` | `#D98BA8` | Compilation-error text | 4.5:1 |

### 4.8 Contrast verification

Key combinations must meet the following measured ratios on their intended surfaces:

| Foreground | Background | Ratio | Use |
|---|---|---|---|
| `#F5F1EA` | `#0B0B10` | 17.4:1 | Primary text on base |
| `#B8B2C0` | `#0B0B10` | 9.5:1 | Secondary text on base |
| `#8A8494` | `#0B0B10` | 5.4:1 | Muted text on base |
| `#FF7A93` | `#15151C` | 7.3:1 | Danger text on surface |
| `#4FD1A5` | `#15151C` | 9.5:1 | Success text on surface |
| `#E8B86D` | `#15151C` | 10.0:1 | Warning text on surface |
| `#5EC8D4` | `#15151C` | 9.3:1 | Link text on surface |
| `#FFFFFF` | `#C11238` | 6.2:1 | Primary button label |
| `#FFD0DB` | `#8E0D2B` | 6.8:1 | Destructive solid button label |

Normal text must meet at least 4.5:1. Large text (24px regular or 18.66px bold and above) and meaningful non-text boundaries must meet at least 3:1. Disabled text is exempt from the normal-text requirement but must remain distinguishable. Never use color as the only carrier of meaning.

## 5. Semantic Text, Difficulty, Status, and Verdict Colors

### 5.1 Difficulty text and badges

Difficulty is shown as a text label plus a one-, two-, or three-bar meter. Color supports the label; it never replaces it.

| Difficulty | Text token | Text hex | Background | Border | Meter |
|---|---|---|---|---|---|
| `EASY` | `--text-success` | `#4FD1A5` | `rgba(79, 209, 165, 0.12)` | `rgba(79, 209, 165, 0.34)` | One bar |
| `MEDIUM` | `--text-warning` | `#E8B86D` | `rgba(232, 184, 109, 0.12)` | `rgba(232, 184, 109, 0.34)` | Two bars |
| `HARD` | `--text-danger` | `#FF7A93` | `rgba(255, 92, 122, 0.12)` | `rgba(255, 92, 122, 0.36)` | Three bars |

Use a 2px radius for difficulty badges. Do not use a pill shape for difficulty; the angular badge reinforces the armor geometry.

### 5.2 Submission status colors

| Status | Text token | Text hex | Background | Treatment |
|---|---|---|---|---|
| `QUEUED` | `--text-secondary` | `#B8B2C0` | `rgba(184, 178, 192, 0.10)` | Neutral badge; waiting |
| `COMPILING` | `--text-info` | `#67C7D6` | `rgba(103, 199, 214, 0.12)` | Info badge with activity indicator |
| `RUNNING` | `--text-link` | `#5EC8D4` | `rgba(94, 200, 212, 0.12)` | Info badge with activity indicator |
| `COMPLETED` | `--text-secondary` | `#B8B2C0` | `rgba(184, 178, 192, 0.10)` | Neutral completion badge; does not imply acceptance |
| `INTERNAL_ERROR` | `--text-system` | `#F2B45C` | `rgba(242, 180, 92, 0.12)` | System-failure badge with warning icon; never a verdict |

`COMPLETED` means judging finished, not that the submission was accepted. Do not style `COMPLETED` with the success color. The verdict carries the success or failure meaning.

### 5.3 Verdict colors

| Verdict | Text token | Text hex | Background | Notes |
|---|---|---|---|---|
| `ACCEPTED` | `--text-success` | `#4FD1A5` | `rgba(79, 209, 165, 0.12)` | Success; use a check or shield icon |
| `WRONG_ANSWER` | `--text-danger` | `#FF7A93` | `rgba(255, 92, 122, 0.12)` | Error; use an x or alert icon |
| `TIME_LIMIT_EXCEEDED` | `--text-warning` | `#E8B86D` | `rgba(232, 184, 109, 0.12)` | Caution; use a clock icon |
| `MEMORY_LIMIT_EXCEEDED` | `--text-limit` | `#F2B45C` | `rgba(242, 180, 92, 0.12)` | Caution; use a memory or gauge icon |
| `RUNTIME_ERROR` | `--text-runtime` | `#F08A6A` | `rgba(240, 138, 106, 0.12)` | Execution failure; use a terminal or alert icon |
| `COMPILATION_ERROR` | `--text-compilation` | `#D98BA8` | `rgba(217, 139, 168, 0.12)` | Compilation failure; use a code or alert icon |
| `INTERNAL_ERROR` | `--text-system` | `#F2B45C` | `rgba(242, 180, 92, 0.12)` | Not a verdict. Present as a system-failure banner, never in the verdict badge slot. |

Verdict badges must include the verdict text. Do not rely on the color or icon alone. `INTERNAL_ERROR` is a terminal processing status, not a user-code verdict, and must not be offered as a valid grading outcome.

### 5.4 Feedback and error mapping

| UI condition | Text token | Icon | Presentation |
|---|---|---|---|
| Field validation | `--text-danger` | Alert circle | Inline at the field; focus the first invalid control |
| Authentication or permission failure | `--text-danger` | Lock or shield | Inline banner or access-denied state |
| Stale version or conflict | `--text-warning` | Refresh or warning | Banner with reload or compare action |
| Rate limited | `--text-warning` | Clock | Banner with retry condition or time |
| Not found | `--text-secondary` | Search or empty | Empty-state treatment, not an error color |
| Network outcome unknown | `--text-warning` | Question or warning | Persistent banner; state that the outcome is unknown |
| System or internal failure | `--text-system` | Warning triangle | Persistent system-failure banner with request ID |
| Success | `--text-success` | Check | Inline confirmation or toast |
| Information | `--text-info` | Info circle | Inline note or toast |

Error text must be actionable. Include the stable error code and request ID where available. Render request IDs in the mono font at `--text-muted` or `--text-secondary`, never as decorative red text.

### 5.5 Links, selection, and focus

- Links use `--text-link`. Hover and focus use `--text-link-hover`.
- Do not rely on color alone to identify a link in body copy. Underline links in prose and inside dense text.
- Selected rows and cards use `--bg-selection` with a 3px `--border-accent` left edge and `--text-primary` content.
- Active navigation uses `--text-primary` with a 2px `--border-accent` underline or left bar. Inactive navigation uses `--text-secondary`.
- Keyboard focus uses a 2px `--border-focus` ring with a 2px offset. On a crimson-filled surface, use an ivory ring instead so the focus remains visible.
- Hover must not be the only way to reveal an action. Focus and touch must expose the same action.

## 6. Typography

### 6.1 Font families

| Role | Token | Family | Use |
|---|---|---|---|
| Display | `--font-display` | `"Cinzel", "Trajan Pro", "Palatino Linotype", Georgia, serif` | Brand wordmark, page hero, major empty-state headline |
| UI and body | `--font-sans` | `"Inter", "Segoe UI", system-ui, -apple-system, sans-serif` | Navigation, body copy, labels, forms, tables |
| Code and data | `--font-mono` | `"JetBrains Mono", "Cascadia Code", "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` | Source editor, code, identifiers, request IDs, numeric code values |

Use the display face sparingly. It may carry the brand, a page title, or a single empty-state headline. Do not use it for body copy, form labels, table cells, or long headings.

Self-host fonts where possible and use `font-display: swap`. Provide the listed fallbacks so the interface remains usable if a webfont is unavailable. Do not allow font loading to shift the layout of primary actions or tables.

### 6.2 Type scale

| Token | Size / line height | Weight | Family | Use |
|---|---|---|---|---|
| `--text-display-1` | 48px / 52px | 700 | Display | Brand or landing hero only |
| `--text-display-2` | 36px / 40px | 700 | Display | Page hero or major empty state |
| `--text-h1` | 32px / 40px | 600 | Sans | Screen title |
| `--text-h2` | 24px / 32px | 600 | Sans | Major section |
| `--text-h3` | 20px / 28px | 600 | Sans | Subsection or card title |
| `--text-h4` | 18px / 24px | 600 | Sans | Compact card or panel title |
| `--text-body-lg` | 18px / 28px | 400 | Sans | Introductory copy |
| `--text-body` | 16px / 26px | 400 | Sans | Default body |
| `--text-body-sm` | 14px / 22px | 400 | Sans | Supporting copy, table cells |
| `--text-label` | 14px / 20px | 600 | Sans | Form labels and buttons |
| `--text-caption` | 12px / 18px | 500 | Sans | Metadata and helper text |
| `--text-overline` | 12px / 16px | 600 | Sans | Uppercase table headers and section eyebrows |
| `--text-code` | 14px / 22px | 400 | Mono | Source, commands, identifiers |
| `--text-code-sm` | 12px / 18px | 400 | Mono | Inline IDs, timestamps, request IDs |

### 6.3 Typography rules

- Use sentence case for headings, labels, buttons, and navigation. Use uppercase only for `--text-overline` and compact badge labels.
- Use no more than three font weights on one screen. Body is 400; labels and headings are usually 600; the display face may use 700.
- Keep body measure between 55 and 75 characters. Data-dense tables may exceed this, but prose must not.
- Use `font-variant-numeric: tabular-nums` for counts, ranks, runtimes, memory values, scores, and test-case order.
- Do not set text below 12px. Twelve-pixel text is reserved for captions, metadata, and overlines.
- Use line height 1.5–1.65 for body copy. Headings use 1.08–1.3.
- Left-align body copy and form labels. Center only short empty-state or hero content.
- Render identifiers, code, and request IDs in the mono font. Do not set whole paragraphs in mono.
- Do not truncate a status, verdict, difficulty, or error message. Truncate secondary metadata only, with a title or tooltip that reveals the full value.
- Do not use text shadows or outlined text. Legibility comes from contrast and spacing.

## 7. Spacing, Layout, Radii, and Motion

### 7.1 Spacing scale

The spacing system uses a 4px base grid.

| Token | Value | Use |
|---|---|---|
| `--space-0` | 0 | Reset |
| `--space-1` | 4px | Icon-to-label gap, tight inline spacing |
| `--space-2` | 8px | Inline control gap, compact stack |
| `--space-3` | 12px | Button gap, dense form spacing |
| `--space-4` | 16px | Default stack and paragraph gap |
| `--space-5` | 20px | Form field vertical gap |
| `--space-6` | 24px | Card padding, section inner gap |
| `--space-8` | 32px | Section gap, page padding |
| `--space-10` | 40px | Large section gap |
| `--space-12` | 48px | Page section separation |
| `--space-16` | 64px | Hero or major vertical separation |
| `--space-20` | 80px | Rare large-screen separation |

### 7.2 Macro layout

| Element | Rule |
|---|---|
| Page padding | 32px on desktop; 48px at 1280px and above |
| Section gap | 32px; 48px between major page sections |
| Card padding | 24px; 16px for compact cards |
| Form field gap | 20px between fields; 12px between label and control |
| Button gap | 12px between adjacent actions |
| Icon gap | 8px between icon and label |
| Maximum content width | 1200px; 1440px for administrative tables |
| Reading width | 68ch for prose |
| Form width | 640px for focused forms; 720px for multi-column forms |
| Modal width | 480px for confirmations; 560px for forms |
| Navigation height | 64px desktop |
| Sidebar width | 280px when a side panel is used |

Use a 12-column grid with a 24px gutter on desktop. Collapse multi-column layouts before they force horizontal scrolling. Administrative tables may scroll horizontally, but the row identity and primary row action must remain discoverable.

### 7.3 Breakpoints

| Token | Width | Behavior |
|---|---|---|
| `--bp-sm` | 640px | Compact single-column forms and cards |
| `--bp-md` | 768px | Collapse secondary columns; compact navigation |
| `--bp-lg` | 1024px | Standard desktop layout |
| `--bp-xl` | 1280px | Wider content and 48px page padding |
| `--bp-2xl` | 1536px | Maximum administrative table width |

Desktop and laptop sizes are the primary target. Do not define a separate mobile screen inventory. At narrower widths, preserve screen identity, required actions, and all warnings; reflow rather than remove.

### 7.4 Radii, borders, and shadows

| Token | Value | Use |
|---|---|---|
| `--radius-xs` | 2px | Badges, difficulty markers, small chips |
| `--radius-sm` | 4px | Buttons, inputs, selects |
| `--radius-md` | 6px | Inline panels, segmented controls |
| `--radius-lg` | 8px | Cards, modals, dropdowns |
| `--radius-xl` | 12px | Large feature panels only |
| `--radius-pill` | 999px | Tags and count pills only |

| Token | Value | Use |
|---|---|---|
| `--border-width` | 1px | Default border |
| `--border-width-strong` | 2px | Active navigation and focus-adjacent emphasis |
| `--border-width-accent` | 3px | Selected row, error banner, toast accent |

| Token | Value | Use |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.40)` | Cards and inputs at rest |
| `--shadow-md` | `0 8px 24px rgba(0, 0, 0, 0.35)` | Dropdowns and raised panels |
| `--shadow-lg` | `0 20px 60px rgba(0, 0, 0, 0.50)` | Modals and major overlays |
| `--shadow-crimson` | `0 0 24px rgba(254, 21, 81, 0.18)` | Selected judgment accent only |
| `--shadow-teal` | `0 0 20px rgba(94, 200, 212, 0.16)` | Focus or informational emphasis only |

Do not use text shadows, glossy bevels, metallic gradients, or heavy drop shadows. Depth comes from surface lightness, a thin border, and a restrained shadow.

### 7.5 Motion

| Token | Value | Use |
|---|---|---|
| `--duration-fast` | 120ms | Hover, focus, color change |
| `--duration-base` | 180ms | Disclosure, tab change, small panel |
| `--duration-slow` | 240ms | Modal or drawer entrance |
| `--ease-standard` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Default easing |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Dismissal and exit |

Respect `prefers-reduced-motion: reduce` by removing non-essential transitions and disabling looping decorative motion. Loading indicators may continue to communicate progress, but they must not flash or strobe.

### 7.6 Z-index

| Token | Value | Use |
|---|---|---|
| `--z-base` | 0 | Page content |
| `--z-sticky` | 100 | Sticky table headers and toolbars |
| `--z-dropdown` | 200 | Menus and popovers |
| `--z-overlay` | 300 | Modal scrim |
| `--z-modal` | 400 | Modal surface |
| `--z-toast` | 500 | Toast stack |
| `--z-tooltip` | 600 | Tooltips |

## 8. Component Rules

### 8.1 Buttons

| Variant | Background | Text | Border | Hover | Active |
|---|---|---|---|---|---|
| Primary | `--crimson-500` | `--white` | `--crimson-500` | `--crimson-400` | `--crimson-600` |
| Secondary | transparent | `--teal-200` | `--teal-400` | `--teal-800` background | `--teal-700` background |
| Ghost | transparent | `--text-secondary` | transparent | `--bg-surface-hover` | `--bg-surface-raised` |
| Danger outline | transparent | `--text-danger` | `--border-danger` | `--bg-danger-soft` | `--bg-danger-soft` |
| Danger solid | `--crimson-800` | `--crimson-100` | `--crimson-500` | `--crimson-700` | `--crimson-900` |
| Disabled | `--ink-700` | `--text-disabled` | `--border-subtle` | No change | No change |

Buttons use `--radius-sm`, `--text-label`, and a minimum height of 40px. Primary buttons use 12px vertical and 20px horizontal padding. Use one primary button per screen state. Destructive actions must not look like the primary action unless the screen's purpose is confirmation.

A submitting button must remain labelled, show a progress indicator, and prevent a duplicate submission. Do not replace the label with an unlabeled spinner.

### 8.2 Inputs and forms

- Input background: `--bg-inset`.
- Input border: `--border-control`; focus border: `--border-focus` with a focus halo.
- Input text: `--text-primary`; placeholder: `--text-disabled`.
- Invalid input: `--border-danger` with an inline error message in `--text-danger`.
- Disabled input: `--ink-700` background, `--text-disabled` text, and no hover treatment.
- Inputs use `--radius-sm` and a minimum height of 40px.
- Labels use `--text-label`; helper text and errors use `--text-caption`.
- Textareas for test-case input and expected output use `--font-mono`. The source editor uses the code tokens in §8.10.
- Select menus use the input surface and a `--bg-surface-raised` menu with `--shadow-md`.
- Checkboxes and radio buttons use `--crimson-500` for the selected mark and `--focus` for the focus ring.

Do not use placeholder text as a label. Do not hide validation errors in a toast when the field itself can show the error.

### 8.3 Cards and panels

- Card background: `--bg-surface`.
- Card border: `--border-default` or `--border-subtle`.
- Card radius: `--radius-lg`.
- Card padding: `--space-6`.
- Card shadow: `--shadow-sm`.
- Card header: title in `--text-h3` or `--text-h4`, separated by `--divider`.
- Interactive card hover: `--bg-surface-hover` with `--border-strong`.
- Selected card: `--bg-selection` with `--border-accent` and a subtle crimson glow.
- Do not nest cards more than two levels deep. Use inset panels or dividers for inner grouping.
- Card borders are decorative separation; do not rely on a low-contrast card border alone to identify an interactive control. Interactive cards must also change surface or border on hover and focus.

### 8.4 Navigation

- Shell background: `--ink-900`; bottom border: `--divider`.
- Brand: display face, `--text-primary`, with an optional abstract crimson emblem.
- Navigation links: `--text-body-sm`, weight 500, `--text-secondary`.
- Hover: `--text-primary` with a subtle `--bg-surface-hover` background.
- Active: `--text-primary` with a 2px `--border-accent` underline or left bar.
- Administrator mode: use a teal outline badge labelled `Admin`; do not recolor the entire shell crimson.
- Account menu: `--bg-surface-raised`, `--border-control`, `--shadow-md`.
- At compact widths, collapse navigation into a menu; preserve the active destination and session actions.

### 8.5 Tables and lists

- Table background: `--bg-surface`.
- Header background: `--bg-inset`; header text: `--text-overline`, `--text-muted`, uppercase.
- Row height: at least 48px.
- Row divider: `--divider`.
- Row hover: `--bg-surface-hover`.
- Selected row: `--bg-selection` with a 3px `--border-accent` left edge and `--text-primary`.
- Numeric columns: right-aligned with tabular numerals.
- Status, verdict, and difficulty cells use the badges in §5.
- Empty tables show an empty-state row or panel, never a blank header.
- Pagination controls use secondary buttons and muted text; the current page is `--text-primary`.

### 8.6 Tabs and segmented controls

- Inactive tab: `--text-secondary`.
- Hover tab: `--text-primary`.
- Active tab: `--text-primary` with a 2px `--border-accent` underline.
- Focus: `--border-focus` ring.
- Segmented control background: `--bg-inset`; selected segment: `--bg-surface-raised` with `--border-strong` and `--text-primary`.
- Do not fill the selected segment with crimson; crimson is reserved for the active underline or primary action.

### 8.7 Badges, chips, and tags

- Difficulty, status, and verdict badges use the colors in §5 and `--radius-xs`.
- Badge text uses `--text-caption` or `--text-overline` with 600 weight.
- Always include a text label. Icons may support the label but must not replace it.
- Tags use a `--teal-700` border, `--teal-100` text on a transparent or `--teal-900` background, and `--radius-pill`.
- Count pills use `--bg-surface-raised` with `--text-secondary`; use a crimson count only for a critical unread or actionable count.
- Do not use a badge as a button unless it has a clear hover, focus, and pressed state.

### 8.8 Modals and confirmation overlays

- Scrim: `--bg-overlay`.
- Surface: `--bg-surface`; border: `--border-strong`; radius: `--radius-lg`; shadow: `--shadow-lg`.
- Confirmation width: 480px; form modal width: 560px.
- Padding: `--space-6`.
- Title: `--text-h3`; body: `--text-body-sm` or `--text-body`.
- Actions: right-aligned with a 12px gap; cancel is secondary or ghost; confirmation uses primary or danger solid according to consequence.
- Destructive confirmations use the danger solid button and state the consequence in the body, not only in the title.
- The dialog must trap focus, support Escape as cancel where safe, and return focus to the invoking control.
- Only one modal may be open at a time.

The nine required overlays remain those defined by the screen inventory. Visual treatment must not add a tenth confirmation or remove a required one.

### 8.9 Toasts and inline feedback

- Toast surface: `--bg-surface-raised`; border: `--border-default`; shadow: `--shadow-md`.
- Accent: 3px left border in the semantic color.
- Icon: semantic icon in the same color as the accent.
- Message: `--text-body-sm`; supporting detail: `--text-caption`.
- Success and informational toasts may dismiss automatically after a short interval. Warnings, errors, and unknown-outcome messages must remain until dismissed or resolved.
- Stack at most three toasts; place them below the shell header and away from the primary action.
- Inline validation belongs at the field. Do not use a toast as the only place for a field error.

### 8.10 Code editor

| Element | Color |
|---|---|
| Editor background | `#0D0D12` |
| Gutter background | `--ink-900` |
| Default text | `--ink-050` |
| Line numbers | `--text-disabled` |
| Current line | `rgba(94, 200, 212, 0.08)` |
| Selection | `rgba(254, 21, 81, 0.16)` |
| Caret | `--crimson-300` |
| Keyword | `#FF7A93` |
| String | `#8FE3EA` |
| Number | `#E8B86D` |
| Comment | `--text-disabled`, italic |
| Function | `#5EC8D4` |
| Type | `--ink-050` |
| Variable | `--ink-100` |
| Operator | `--ink-200` |
| Error underline | `#FF5C7A`, wavy |

The editor uses `--font-mono` at 14px / 22px. It must remain usable at 1024px width and provide the standard capabilities such as syntax highlighting, line numbers, indentation, and code navigation. Syntax color must not be the only way to identify an error; pair the underline with a gutter marker and an accessible message.

### 8.11 Data visualization

Use this categorical order when a chart needs distinguishable series:

1. `--crimson-500`
2. `--teal-300`
3. `--warning`
4. `--success`
5. `--teal-200`
6. `--compilation-error`

Charts use `--bg-surface` as their background, `--divider` for gridlines, and `--text-muted` for axis labels. Every series must have a label or legend. Do not use 3D charts, gradients as data encoding, or color alone to distinguish series.

### 8.12 Empty, loading, and error states

- Empty: Use an optional teal outline icon, a display or `--text-h2` headline, `--text-secondary` supporting copy, and one primary action.
- Loading: Use a restrained skeleton in `--bg-surface-hover` or a teal progress indicator. Preserve layout and avoid a full-page blank.
- Error: Use the feedback mapping in §5.4. Keep the failed context visible and provide a recovery action.
- Unknown outcome: Use a persistent warning banner. Do not show a success toast or a confirmed failure message.
- System failure: Use a persistent system banner with `--text-system`, a warning icon, and the request ID. Never render `INTERNAL_ERROR` in a verdict badge.

## 9. Iconography and Decoration

- Use line icons with a consistent 1.5px stroke and 16px, 20px, or 24px sizes.
- Icons inherit `currentColor` unless they carry a semantic color from §5.
- Use icons to support labels, not replace them, except for universally understood controls with an accessible name and tooltip.
- The brand may use an abstract crescent or angular emblem in `--crimson-300` on `--ink-950`.
- The armor lattice may appear as a 1px geometric motif at 4–8% opacity behind hero or empty-state content. Never place it behind code, tables, forms, or dense text.
- Do not reproduce the reference image, armor textures, metallic gradients, or character likeness.
- Do not use decorative crimson lines or glows around ordinary content. Crimson decoration is reserved for judgment, selection, and primary action.

## 10. Accessibility and Color Use

- Meet 4.5:1 for normal text and 3:1 for large text and meaningful non-text boundaries.
- Never use color as the only indicator of difficulty, status, verdict, error, selection, or focus. Pair color with text, icon, shape, or position.
- Test the interface in grayscale. Difficulty must remain readable through its label and bar count; verdicts must remain readable through their text and icon.
- Keep focus visible on every interactive control. The default ring is 2px `--border-focus` with a 2px offset.
- Support keyboard operation for navigation, menus, tabs, tables, modals, and the editor.
- Keep pointer targets at least 44×44px where practical; dense table actions may be 32×32px with adequate spacing.
- Respect `prefers-reduced-motion`.
- Support browser zoom to 200% without hiding actions, statuses, or validation messages.
- Do not use pure white page backgrounds or pure black text on white surfaces except in an explicitly inverted component.
- Provide a `prefers-contrast: more` refinement that strengthens borders and raises muted text toward `--text-secondary`.
- Use semantic tokens in components. A component must not hard-code a raw palette value such as `#C11238`; it must use `--crimson-500` or, preferably, a semantic token such as `--text-danger`.

## 11. Implementation Token Contract

The following CSS custom properties are the canonical token surface. Components should consume the semantic layer and the scales above. Add new raw colors only by extending this file and documenting their role.

```css
:root {
  color-scheme: dark;

  /* Neutral scale */
  --ink-950: #08080C;
  --ink-900: #0B0B10;
  --ink-850: #101016;
  --ink-800: #15151C;
  --ink-750: #1A1A22;
  --ink-700: #1E1E27;
  --ink-600: #2A2833;
  --ink-500: #3A3745;
  --ink-450: #5E5968;
  --ink-400: #7A7482;
  --ink-300: #8A8494;
  --ink-200: #B8B2C0;
  --ink-100: #D9D4DC;
  --ink-050: #F5F1EA;
  --white: #FFFFFF;

  /* Crimson scale */
  --crimson-900: #4A0617;
  --crimson-800: #6E0A22;
  --crimson-700: #8E0D2B;
  --crimson-600: #A80E30;
  --crimson-500: #C11238;
  --crimson-400: #E01545;
  --crimson-300: #FE1551;
  --crimson-200: #FF7A93;
  --crimson-100: #FFD0DB;

  /* Teal scale */
  --teal-900: #06161C;
  --teal-800: #0B242C;
  --teal-700: #12333D;
  --teal-600: #1C4150;
  --teal-500: #235563;
  --teal-400: #2F7382;
  --teal-300: #4FA9B7;
  --teal-200: #8FE3EA;
  --teal-100: #D6F7FA;

  /* Semantic support */
  --success: #4FD1A5;
  --warning: #E8B86D;
  --system: #F2B45C;
  --danger: #FF5C7A;
  --danger-text: #FF7A93;
  --info: #67C7D6;
  --limit: #F2B45C;
  --runtime-error: #F08A6A;
  --compilation-error: #D98BA8;
  --focus: #5EC8D4;
  --link: #5EC8D4;
  --link-hover: #8FE3EA;

  /* Surfaces */
  --bg-canvas: var(--ink-950);
  --bg-base: var(--ink-900);
  --bg-inset: var(--ink-850);
  --bg-surface: var(--ink-800);
  --bg-surface-raised: var(--ink-700);
  --bg-surface-hover: var(--ink-750);
  --bg-overlay: rgba(5, 5, 8, 0.78);
  --bg-selection: rgba(254, 21, 81, 0.10);
  --bg-focus-ring: rgba(94, 200, 212, 0.24);
  --bg-danger-soft: rgba(255, 92, 122, 0.12);
  --bg-warning-soft: rgba(232, 184, 109, 0.12);
  --bg-success-soft: rgba(79, 209, 165, 0.12);
  --bg-info-soft: rgba(103, 199, 214, 0.12);

  /* Borders */
  --border-subtle: #24222C;
  --border-default: #34313D;
  --border-control: #6F6A78;
  --border-strong: #7A7482;
  --border-accent: var(--crimson-400);
  --border-focus: var(--focus);
  --border-danger: var(--danger);
  --divider: var(--ink-600);

  /* Text */
  --text-primary: var(--ink-050);
  --text-secondary: var(--ink-200);
  --text-muted: var(--ink-300);
  --text-disabled: var(--ink-400);
  --text-inverse: var(--ink-950);
  --text-link: var(--link);
  --text-link-hover: var(--link-hover);
  --text-danger: var(--danger-text);
  --text-success: var(--success);
  --text-warning: var(--warning);
  --text-info: var(--info);
  --text-system: var(--system);
  --text-limit: var(--limit);
  --text-runtime: var(--runtime-error);
  --text-compilation: var(--compilation-error);

  /* Typography */
  --font-display: "Cinzel", "Trajan Pro", "Palatino Linotype", Georgia, serif;
  --font-sans: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", "Cascadia Code", "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  --text-display-1: 3rem;
  --text-display-2: 2.25rem;
  --text-h1: 2rem;
  --text-h2: 1.5rem;
  --text-h3: 1.25rem;
  --text-h4: 1.125rem;
  --text-body-lg: 1.125rem;
  --text-body: 1rem;
  --text-body-sm: 0.875rem;
  --text-label: 0.875rem;
  --text-caption: 0.75rem;
  --text-overline: 0.75rem;
  --text-code: 0.875rem;
  --text-code-sm: 0.75rem;

  /* Spacing */
  --space-0: 0;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;

  /* Radii */
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-pill: 999px;

  /* Borders and shadows */
  --border-width: 1px;
  --border-width-strong: 2px;
  --border-width-accent: 3px;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.40);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.35);
  --shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.50);
  --shadow-crimson: 0 0 24px rgba(254, 21, 81, 0.18);
  --shadow-teal: 0 0 20px rgba(94, 200, 212, 0.16);

  /* Motion */
  --duration-fast: 120ms;
  --duration-base: 180ms;
  --duration-slow: 240ms;
  --ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);

  /* Layout */
  --bp-sm: 640px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
  --bp-2xl: 1536px;
  --content-max: 1200px;
  --admin-max: 1440px;
  --reading-max: 68ch;
  --form-max: 640px;
  --modal-confirm-max: 480px;
  --modal-form-max: 560px;
  --nav-height: 64px;

  /* Z-index */
  --z-base: 0;
  --z-sticky: 100;
  --z-dropdown: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-toast: 500;
  --z-tooltip: 600;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0.01ms;
    --duration-base: 0.01ms;
    --duration-slow: 0.01ms;
  }
}
```