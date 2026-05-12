# myApp

Vibes mobile app — Expo + React Native + TypeScript.

## Stack

- **Runtime**: Expo 54, React 19, React Native 0.81, Yarn 1.22.
- **State**: Jotai (atoms) — do NOT use Redux / Zustand / Context for global state.
- **HTTP**: Axios + React Query (cache, retry, invalidation).
- **Navigation**: React Navigation + Bottom Tabs.
- **Maps**: Mapbox.
- **Animation**: Reanimated 3.
- **Icons**: lucide-react-native (via the `ThemedIcon` component).
- **Notifications & Location**: native, via Expo.

## Structure

```
src/
├── app/          # entrypoints, root navigation
├── features/     # feature-folders (each feature isolated)
├── services/     # axios, react-query setup, integrations
└── shared/
    ├── components/   # design system (18 components — REUSE before creating new)
    ├── constants/    # tokens, theme
    ├── hooks/
    └── utils/
```

## Design System (CRITICAL)

**Tokens**: [src/shared/constants/tokens.ts](src/shared/constants/tokens.ts)
**Theme**: [src/shared/constants/theme.ts](src/shared/constants/theme.ts)

### Palette (dark)

| Token | Value | Use |
|-------|-------|-----|
| `theme.colors.background` | `#111111` | Main bg |
| `theme.colors.backgroundSecondary` | `#1A1A1A` | Cards, surfaces |
| `theme.colors.primary` | `#6FE8A8` | Mint — primary CTA |
| `theme.colors.success` | `#2D5A3D` | Forest green (BeReal rebrand) |
| `theme.colors.warning` | `#C8A84B` | Gold |
| `theme.colors.error` | `#C0392B` | Red |
| `theme.colors.info` | `#4A7C59` | Info green |
| `theme.colors.textPrimary` | `#EDEAE4` | Primary text |
| `theme.colors.textSecondary` | `#8a8680` | Secondary text |
| `theme.colors.textTerciary` | `#55524d` | Tertiary text |
| `theme.colors.border` | `rgba(255,255,255,0.08)` | Subtle borders |

### Typography

- **Default**: `Poppins` (loaded in `app.json`).
- **Display**: `InterTight`.
- **Mono**: `JetBrainsMono`.
- Sizes: `theme.sizes.{xxs,xs,sm,md,lg,xl,2xl,3xl,4xl}` (12 to 40px).
- Weights: `theme.weights.{light,regular,medium,semibold,bold}` (300–700).

### Spacing

`theme.spacing.{0,1,2,3,4,5,6,7,8,10,12,16}` — multiples of 4 (0px to 64px). NEVER use a raw literal in `padding`/`margin`.

### Components ready in `src/shared/components/`

`animated-box`, `avatar`, `bottom-tab`, `box`, `button`, `card`, `divider`, `fake-input`, `go-back-button`, `header`, `input`, `loading-application`, `loading-page`, `password-input`, `pill`, `swipeable-modal`, `themed-icon`, `themed-text`.

**RULE**: before creating a new component, list this folder and look for a partial match. If something matches, reuse / extend (e.g. new icon button → use `Button variant="icon"`, do not create another).

### New-component convention

- `kebab-case/` folder inside `src/shared/components/` (or `features/<feat>/components/` if feature-specific).
- File `<name>.component.tsx` + `index.ts` (re-export).
- Explicitly typed props, variants following the `Button` pattern ([reference](src/shared/components/button/button.component.tsx)).
- Accessibility: `accessibilityRole`, `accessibilityLabel` on interactive elements.

## Useful scripts

```bash
yarn start        # Expo dev
yarn ios          # iOS build
yarn android      # Android build
yarn web          # web build
```

---

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **myApp** (601 symbols, 1312 relationships, 21 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## When Debugging

1. `gitnexus_query({query: "<error or symptom>"})` — find execution flows related to the issue
2. `gitnexus_context({name: "<suspect function>"})` — see all callers, callees, and process participation
3. `READ gitnexus://repo/myApp/process/{processName}` — trace the full execution flow step by step
4. For regressions: `gitnexus_detect_changes({scope: "compare", base_ref: "main"})` — see what your branch changed

## When Refactoring

- **Renaming**: MUST use `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` first. Review the preview — graph edits are safe, text_search edits need manual review. Then run with `dry_run: false`.
- **Extracting/Splitting**: MUST run `gitnexus_context({name: "target"})` to see all incoming/outgoing refs, then `gitnexus_impact({target: "target", direction: "upstream"})` to find all external callers before moving code.
- After any refactor: run `gitnexus_detect_changes({scope: "all"})` to verify only expected files changed.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Tools Quick Reference

| Tool | When to use | Command |
|------|-------------|---------|
| `query` | Find code by concept | `gitnexus_query({query: "auth validation"})` |
| `context` | 360-degree view of one symbol | `gitnexus_context({name: "validateUser"})` |
| `impact` | Blast radius before editing | `gitnexus_impact({target: "X", direction: "upstream"})` |
| `detect_changes` | Pre-commit scope check | `gitnexus_detect_changes({scope: "staged"})` |
| `rename` | Safe multi-file rename | `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` |
| `cypher` | Custom graph queries | `gitnexus_cypher({query: "MATCH ..."})` |

## Impact Risk Levels

| Depth | Meaning | Action |
|-------|---------|--------|
| d=1 | WILL BREAK — direct callers/importers | MUST update these |
| d=2 | LIKELY AFFECTED — indirect deps | Should test |
| d=3 | MAY NEED TESTING — transitive | Test if critical path |

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/myApp/context` | Codebase overview, check index freshness |
| `gitnexus://repo/myApp/clusters` | All functional areas |
| `gitnexus://repo/myApp/processes` | All execution flows |
| `gitnexus://repo/myApp/process/{name}` | Step-by-step execution trace |

## Self-Check Before Finishing

Before completing any code modification task, verify:
1. `gitnexus_impact` was run for all modified symbols
2. No HIGH/CRITICAL risk warnings were ignored
3. `gitnexus_detect_changes()` confirms changes match expected scope
4. All d=1 (WILL BREAK) dependents were updated

## Keeping the Index Fresh

After committing code changes, the GitNexus index becomes stale. Re-run analyze to update it:

```bash
npx gitnexus analyze
```

If the index previously included embeddings, preserve them by adding `--embeddings`:

```bash
npx gitnexus analyze --embeddings
```

To check whether embeddings exist, inspect `.gitnexus/meta.json` — the `stats.embeddings` field shows the count (0 means no embeddings). **Running analyze without `--embeddings` will delete any previously generated embeddings.**

> Claude Code users: A PostToolUse hook handles this automatically after `git commit` and `git merge`.

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->

## UI / Styling Rules (enforced)

- NEVER use inline `style={{...}}` in JSX — ALWAYS `StyleSheet.create`.
- NEVER hardcode colors (`'#abc'`, `'rgb(...)'`) — ALWAYS `theme.colors.*`.
- NEVER hardcode spacing — ALWAYS `theme.spacing.*` (multiples of 4).
- NEVER use `fontFamily` outside `Poppins | InterTight | JetBrainsMono`.
- ALWAYS prefer `<Box>` with spacing/layout props over `<View>` with manual styles.
- ALWAYS use `<ThemedText>` instead of raw `<Text>` (inherits theme family/color).