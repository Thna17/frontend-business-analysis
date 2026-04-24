# Analytics SaaS UI/UX Redesign Prompt Pack

This file contains a production-ready prompt package for using Codex to audit and redesign this business analytics SaaS frontend.

Use the prompts in this order:

1. `Master Prompt`
2. `Phase 1 Prompt`
3. `Phase 2 Prompt`
4. `Phase 3 Prompt`
5. `Phase 4 Prompt`
6. `Phase 5 Prompt`

The prompts are intentionally written for this repository's actual product shape:

- `frontend`: Next.js App Router dashboard app
- `backend`: Express + TypeScript + MongoDB API
- Product type: business analytics SaaS
- Major areas: auth, dashboards, analytics, reports, sales records, products, settings, subscriptions, notifications, payments, team, Telegram, AI insights

The visual direction should be inspired by the provided reference image:

- dark top chrome
- soft neutral surfaces
- rounded KPI cards
- generous whitespace
- restrained accent usage
- cleaner chart hierarchy
- premium analytics dashboard feel

Do not use these prompts as POS prompts. They explicitly forbid POS assumptions.

---

## Master Prompt

```text
Act as a senior product designer, senior UI/UX designer, senior frontend architect, and senior SaaS dashboard engineer.

Your job is to deeply audit and redesign my business analytics SaaS frontend and produce a practical, phase-by-phase UI/UX modernization plan that fits my real codebase.

This is NOT a POS project.
This is NOT a restaurant system.
This is NOT a cafe workflow.
Do not frame the system as POS, checkout-terminal software, or store-counter software unless you verify an actual feature in the code that truly behaves that way.

I do NOT want a shallow review.
I want you to inspect my actual codebase first, map what exists, detect UI/UX inconsistency and frontend architecture issues, and then create a concrete redesign strategy that Codex can implement phase by phase.

Your primary objective is to improve the UI/UX across the full frontend so the product feels:

- clean
- modern
- highly consistent
- premium
- readable
- professional
- production-ready

Use the provided design reference image only as a visual direction, not as a layout to copy literally.

The reference should influence:

- dashboard polish
- surface treatment
- hierarchy
- spacing rhythm
- card composition
- filters and controls
- chart framing
- premium visual clarity

But you must adapt the redesign to my real modules, routes, and workflows.

==================================================
CORE RULES
==================================================

1. Do not assume features exist unless you verify them from the code.
2. Do not give generic UI advice.
3. Do not only review styling or code quality in isolation.
4. Review the system from:
   - UI quality
   - UX flow quality
   - information architecture
   - frontend architecture
   - design-system consistency
   - accessibility
   - responsiveness
   - maintainability
   - production-readiness of the frontend experience
5. Be critical and honest.
6. If something is visually inconsistent, structurally weak, or badly designed, say it clearly.
7. If something is acceptable for now, say that too.
8. Prefer practical improvements over theoretical perfection.
9. Separate recommendations clearly into:
   - A. must fix now
   - B. should improve soon
   - C. nice to have later
10. Before recommending redesign work, create an evidence-based system map from the codebase.
11. Use actual files, routes, components, modules, and patterns when possible.
12. If the codebase contains legacy template leftovers, identify them clearly.
13. Do not blindly clone the reference image.
14. Redesign the system as an analytics SaaS product, not as a generic marketing site and not as a POS interface.

==================================================
MISSION
==================================================

Analyze my current codebase and determine:

- what frontend pages and dashboard areas already exist
- what the current visual system is
- where the UI is inconsistent
- where the UX is weak, clumsy, confusing, or fragmented
- where the design system is missing or conflicting
- which components are too large or too hard to maintain
- which frontend patterns should be standardized
- which backend/data flows are affecting the frontend UX
- what should be redesigned first
- what should stay
- what should be refactored
- what should be removed

Then create a phase-by-phase redesign roadmap for Codex to implement.

==================================================
AREAS TO AUDIT
==================================================

1. Product and UX flow review

Review the user experience across the actual SaaS modules, including where present in code:

- authentication
- signup / login / reset / verify flows
- owner dashboard
- admin dashboard
- analytics pages
- reports pages
- sales record flows
- products management
- settings
- notifications
- subscriptions and billing
- payment flow
- team / access-control areas
- Telegram-related flows
- AI insights panels
- profile and account pages

For each major area:

- explain current status based on code evidence
- identify UI/UX gap
- explain user impact
- recommend redesign direction
- assign urgency

2. Design-system review

Audit:

- color system
- surface hierarchy
- typography
- spacing system
- radii
- shadows
- button patterns
- input patterns
- card patterns
- tabs
- tables
- charts
- filters
- dialogs
- empty states
- loading states
- error states
- success states
- toasts / feedback systems
- motion / micro-interactions
- dark mode handling
- responsive behavior

Tell me:

- what is consistent
- what conflicts
- what is duplicated
- what needs a canonical pattern
- what should become shared reusable primitives

3. Frontend architecture review

Audit:

- route organization
- layout shells
- navigation consistency
- component modularity
- monolith components
- styling architecture
- custom CSS versus utility styling conflicts
- repeated page-specific UI logic
- state/data flow issues affecting UX
- API integration patterns affecting loading and feedback states
- reusability of shared UI components

Tell me:

- what architecture style the frontend currently follows
- whether it is appropriate
- which components are too large
- which patterns are tightly coupled
- which parts should be extracted
- what should remain unchanged
- what should be refactored first

4. Backend/data fit review for frontend UX

Inspect only the backend areas that matter for frontend fit and redesign planning:

- route groups
- API boundaries
- model coverage that impacts UI workflows
- auth and role enforcement as it affects dashboards
- subscription/billing/payment flow support
- reporting and analytics payload support
- notifications/team/settings support

Tell me where backend structure or API behavior limits the frontend UX.

5. Production-readiness from the frontend perspective

Review:

- loading quality
- empty-state quality
- error recovery UX
- accessibility gaps
- mobile and tablet usability
- visual consistency across dashboard pages
- launch/demo readiness
- trust and polish level

Classify the current frontend maturity level and explain why.

==================================================
REQUIRED VISUAL DIRECTION
==================================================

Use the reference image as inspiration for these principles:

- premium analytics dashboard composition
- dark navigation chrome/header treatment
- soft light dashboard surfaces
- large, rounded, clean KPI cards
- clear spacing between content blocks
- restrained accent colors
- charts presented cleanly with strong readability
- modern, calm interface with less noise

Do not copy the screenshot literally.
Adapt it to the real page structures and real modules in my codebase.

==================================================
REQUIRED REDESIGN GOALS
==================================================

Your redesign recommendations must prioritize:

- one canonical visual language across all dashboard pages
- one spacing/radius/shadow/typography/color token system
- one reusable button/input/card/table/filter pattern library
- consistent chart styling and chart density rules
- consistent shell and page-header structure
- better mobile navigation and responsive behavior
- consistent loading/empty/error/success feedback
- improved readability and hierarchy without making the interface too sparse
- decomposition of oversized frontend components where needed
- practical implementation fit for the existing codebase

If dark mode is unstable or implemented poorly, say so and recommend stabilizing light mode first before expanding dark theme support.

==================================================
REQUIRED OUTPUT FORMAT
==================================================

Give me the answer in this exact structure:

A. Executive Summary

- current maturity level
- main strengths
- main weaknesses
- biggest UI/UX risks
- overall verdict

B. Observed System Map

Include:

- frontend apps/pages/routes
- dashboard shells/layouts/navigation
- major workspace components
- shared UI primitives and reusable patterns
- backend/API route groups
- database models affecting product flows
- auth/access flow
- subscription/billing/payment flow
- analytics/reporting flow
- notifications/team/settings flow

C. Current UI/UX Status Table

For every major area:

- current state from code evidence
- inconsistency/gap
- user impact
- redesign direction
- urgency

D. Design System Review

Cover:

- colors, surfaces, typography, spacing, radius, shadows
- buttons, inputs, cards, tabs, tables, filters, charts, dialogs
- dark mode handling
- motion/interaction quality
- responsive behavior

E. Frontend Architecture Review

Cover:

- styling architecture
- component modularity
- duplicated patterns
- monolith components
- page-shell consistency
- state/data-flow issues affecting UX

F. Critical Issues List

Group by:

- visual consistency
- UX flow
- design system
- frontend architecture
- responsiveness
- accessibility
- production readiness

G. Redesign Roadmap

Classify work into:

- must fix now
- should improve soon
- nice to have later

For each phase include:

- phase name
- objective
- why this phase comes now
- exact UI/UX/frontend tasks
- affected modules/pages/components if identifiable
- expected outcome
- difficulty
- priority
- dependencies
- risk level

H. Quick Wins

Include fast, high-impact fixes.

I. Launch Blockers

List what must be fixed before demo, investor review, or production launch.

J. Optional Advanced Upgrades

Only include genuinely valuable future enhancements.

K. Final Action Lists

At the end, provide:

- top 10 UI/UX fixes
- top 10 frontend consistency fixes
- top 10 redesign priorities before launch/demo
- best recommended implementation sequence

==================================================
REVIEW STYLE
==================================================

Be specific.
Reference actual files, functions, components, routes, and patterns when possible.
Do not say vague things like "improve the UI" or "make design consistent" without explaining:

- what is wrong
- why it is wrong
- how to improve it
- how urgent it is

If the codebase is large, first map the system before judging it.
If some areas are unclear, state assumptions clearly.
If a feature is missing from the repository, say so clearly instead of guessing.

Now start by:

1. mapping the project structure
2. identifying implemented frontend modules and dashboard areas
3. identifying the current design-system and styling architecture
4. auditing the system deeply
5. producing the final structured report
```

---

## Phase 1 Prompt

```text
Act as a senior UI systems designer and senior frontend architect.

Work only on Phase 1 of my analytics SaaS UI/UX redesign.

Before making changes, inspect the real code.
Do not assume structure.
Do not redesign as a POS system.

Phase 1 objective:
Create the foundation for a cleaner, more consistent analytics SaaS interface.

Focus on:

- UI inventory
- design-token consolidation
- shell/layout cleanup
- navigation consistency
- loading states
- empty states
- error states
- success/feedback states

Required tasks:

1. Map the existing global styling systems and identify conflicts.
2. Identify the canonical place for tokens and shared visual rules.
3. Define or refine the base token layer for:
   - colors
   - surfaces
   - typography
   - spacing
   - radius
   - shadows
   - borders
4. Standardize the dashboard shell and top-level layout patterns.
5. Standardize navigation behavior, including mobile behavior if missing or weak.
6. Standardize page headers, content spacing, and shared page scaffolding.
7. Redesign global loading, empty, error, and confirmation states so they match the premium analytics SaaS direction.
8. Detect and flag any stale template styling or legacy CSS patterns that break consistency.
9. Use the reference image only as inspiration for polish, spacing, and hierarchy.

Implementation rules:

- favor reusable shared primitives over page-specific one-offs
- prefer one clean visual language
- keep analytics data readability high
- avoid overdecorating
- if dark mode is unstable, stabilize light mode foundations first
- inspect existing components before replacing them

Expected output:

- summary of current phase-1 problems
- proposed design-system foundation
- exact components/layouts/states to update
- file-level implementation plan when identifiable
- clear acceptance criteria for phase completion
```

---

## Phase 2 Prompt

```text
Act as a senior SaaS product designer and senior dashboard frontend engineer.

Work only on Phase 2 of my analytics SaaS UI/UX redesign.

Before making changes, inspect the real code and actual dashboard routes/components.
Do not assume a generic dashboard structure.
Do not redesign this like a POS terminal.

Phase 2 objective:
Redesign the main dashboard and workspace experiences so the core product feels premium, cohesive, and easy to scan.

Primary areas to review and redesign:

- owner dashboard
- admin dashboard
- analytics pages
- reporting pages
- KPI sections
- charts and chart cards
- filter bars
- summary cards
- section headers
- top navigation behavior

Required goals:

1. Align the dashboard shell with a premium analytics SaaS direction inspired by the reference image.
2. Improve hierarchy, spacing, readability, and grouping of content blocks.
3. Standardize KPI card composition and states.
4. Standardize analytics cards and chart containers.
5. Improve filters, date-range controls, and action placements.
6. Make charts feel cleaner, more legible, and more consistent.
7. Ensure dashboard pages feel like one product, not several design styles mixed together.
8. Preserve information density where useful, but remove visual clutter.

Implementation rules:

- do not blindly mimic the screenshot layout
- adapt the visual direction to the real route/component structure
- keep interactions practical for business analytics workflows
- identify misleading chart patterns and weak data visualization choices
- prefer reusable dashboard primitives over page-specific custom patterns

Expected output:

- current dashboard UX weaknesses
- redesign direction by page/workspace
- exact dashboard components to standardize
- visual and interaction rules for cards/charts/filters
- acceptance criteria for phase completion
```

---

## Phase 3 Prompt

```text
Act as a senior product designer, senior frontend systems engineer, and senior UX reviewer for complex SaaS workflows.

Work only on Phase 3 of my analytics SaaS UI/UX redesign.

Before making changes, inspect the real code and identify the actual complex modules that exist.
Do not assume e-commerce or POS flows.

Phase 3 objective:
Redesign the more complex, high-friction product areas so they become consistent, maintainable, and easier to use.

Focus on the complex modules present in the codebase, including where applicable:

- sales records
- settings
- products management
- subscriptions
- payments
- notifications
- profile/account management
- Telegram-related views
- AI insights-related panels

Required goals:

1. Identify which complex pages are visually inconsistent, overloaded, or structurally hard to use.
2. Redesign large workflows into clearer sections and more digestible interactions.
3. Standardize forms, tables, dialogs, confirmation flows, and status messaging.
4. Improve action hierarchy so destructive, primary, and secondary actions are clearer.
5. Improve trust and clarity in billing/payment/subscription flows.
6. Improve readability and navigation in settings-heavy interfaces.
7. Reduce one-off layout and styling patterns.
8. Make these modules feel part of the same analytics SaaS product as the dashboards.

Implementation rules:

- inspect real components before suggesting decomposition
- call out monolith components and UI fragmentation clearly
- prefer consistent system patterns over custom page-specific styling
- keep workflows practical for real users, not just pretty visually

Expected output:

- complex-module UX audit
- redesign priorities by module
- component and layout standardization plan
- file/component references where possible
- acceptance criteria for phase completion
```

---

## Phase 4 Prompt

```text
Act as a senior frontend architect and senior design-system engineer.

Work only on Phase 4 of my analytics SaaS UI/UX redesign.

Before making changes, inspect the real code and architecture.
This phase is about refactoring the frontend architecture so the redesign is maintainable.

Phase 4 objective:
Refactor the frontend structure to support a consistent, reusable, scalable UI system.

Focus on:

- reusable shared components
- decomposition of oversized modules
- chart standardization
- accessibility
- responsive behavior
- maintainable styling architecture

Required goals:

1. Identify oversized or tightly coupled components that block consistent UI work.
2. Break monolith components into smaller reusable pieces where it materially improves maintainability.
3. Consolidate duplicated UI patterns into shared components or shared composition rules.
4. Standardize chart wrappers, legends, labels, tooltips, and loading states.
5. Improve accessibility for forms, dialogs, tables, navigation, and interactive controls.
6. Improve responsive behavior across dashboard and complex pages.
7. Reduce styling conflicts between global CSS, custom CSS blocks, and utility-driven components.
8. Leave the architecture in a state that supports future UI phases cleanly.

Implementation rules:

- refactor in practical increments
- do not overengineer abstractions
- keep existing product behavior intact unless a behavior is clearly broken
- prefer architecture changes that directly improve consistency and implementation speed

Expected output:

- frontend architecture blockers
- refactor plan for reusable primitives and page decomposition
- accessibility and responsiveness correction plan
- chart system standardization plan
- acceptance criteria for phase completion
```

---

## Phase 5 Prompt

```text
Act as a senior product-quality frontend engineer and senior UI polish reviewer.

Work only on Phase 5 of my analytics SaaS UI/UX redesign.

Before making changes, inspect the real code and the earlier redesign outputs.
This phase is for polish, QA, and production hardening of the redesigned frontend.

Phase 5 objective:
Make the redesigned frontend feel polished, trustworthy, performant, and demo-ready.

Focus on:

- motion and micro-interactions
- visual polish
- UX QA
- consistency verification
- performance-sensitive UX issues
- final frontend readiness checks

Required goals:

1. Add motion only where it improves clarity, perceived quality, or transition smoothness.
2. Verify that major pages now share one coherent visual language.
3. Audit hover, focus, active, loading, empty, error, and success states for consistency.
4. Identify final visual rough edges, spacing mismatches, contrast issues, and interaction inconsistencies.
5. Check that charts, cards, tables, dialogs, forms, and navigation feel cohesive.
6. Review for visual regression risk across responsive breakpoints.
7. Review for frontend performance issues caused by unnecessary visual complexity or poor component structure.
8. Produce a final polish checklist before demo or production rollout.

Implementation rules:

- avoid decorative motion that harms usability
- preserve readability and speed
- keep the interface premium but not flashy
- focus on high-signal polish that users will actually feel

Expected output:

- final polish audit
- micro-interaction recommendations
- final QA checklist
- visual consistency verification summary
- launch/demo readiness verdict
```

---

## Suggested Usage Notes

Use the `Master Prompt` first when you want Codex to perform the full audit and produce the redesign roadmap.

Then use the phase prompts one at a time to drive implementation work in a controlled order:

1. foundation
2. dashboards
3. complex modules
4. architecture refactor
5. polish and hardening

If you want, you can paste the relevant phase prompt after the master audit and add:

```text
Implement this phase directly in the codebase. Inspect first, then make changes. Keep the redesign aligned with the existing architecture unless a structural refactor is necessary for consistency.
```
