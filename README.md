# myApp

Vibes mobile app — discover places near you, post photo reviews, and organize events with the people you follow.

Expo 54 · React Native 0.81 · React 19 · TypeScript

## What the app does

- **Map** — nearby places on Mapbox, based on the device location.
- **Feed** — reviews from people you follow, shareable via deep link.
- **Post** — 3-step flow: pick the place → take/select a photo → write the review. Eligibility is checked before a review is allowed.
- **Social** — events (create, view detail, share by token), follows with approval (follow requests), and user blocking.
- **Profile** — user reviews, badges, streak, favorites, profile and username editing.
- **Notifications** — Expo push, in-app inbox, unread count, and a preferences screen.

Tabs: `Map · Feed · Post · Social · You`.

## Stack

| Area | Choice |
|------|--------|
| Global state | Jotai (atoms) |
| HTTP / cache | Axios + React Query |
| Navigation | React Navigation (bottom tabs + native stack) |
| Maps | `@rnmapbox/maps` |
| Auth | better-auth (`@better-auth/expo`) + Google Sign-In + Apple Sign-In + email OTP |
| Animation | Reanimated 4 |
| Icons | `lucide-react-native` via `ThemedIcon` |
| i18n | i18next — `pt`, `en`, `es` |
| Storage | `expo-secure-store` (session) |

## Requirements

- Node + Yarn 1.22 (pinned via `packageManager` in `package.json`)
- Xcode (iOS) / Android Studio (Android)
- A native build is required — the app uses Mapbox, Google Sign-In, and Apple Sign-In, so it **does not run on Expo Go**.

## Setup

```bash
yarn install
cp .env.example .env
```

Fill in `.env`:

| Variable | Used for |
|----------|----------|
| `EXPO_PUBLIC_MAPBOX_TOKEN` | map rendering |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Google Sign-In |

## Running

```bash
yarn start      # Expo dev server
yarn ios        # build + run iOS
yarn android    # build + run Android
yarn web        # web
```

The app expects both monorepo APIs running locally:

- `vibe-api` → `http://localhost:3000` (auth, reviews, social, notifications)
- `vibe-places` → `http://localhost:3001` (place search)

Base URLs are hardcoded in [src/services/api/core-api.ts](src/services/api/core-api.ts), [src/services/api/auth-client.ts](src/services/api/auth-client.ts), and [src/services/api/places-api.ts](src/services/api/places-api.ts). To test on a physical device, replace `localhost` with your machine's IP.

In `__DEV__`, `coreApi` logs requests/responses (with `Authorization` and `Cookie` masked) and prints the equivalent `curl`.

## Structure

```
src/
├── app/          # App.tsx, providers, navigators, deep linking
├── features/     # one folder per feature, isolated
├── services/     # axios, react-query, auth client, storage
└── shared/
    ├── components/   # design system (18 components)
    ├── constants/    # tokens, theme
    ├── hooks/
    ├── i18n/
    └── utils/
modules/
└── vibes-keyboard-accessory/   # local native module
```

Each feature uses `screens/ components/ hooks/ services/ domain/ state/ storage/` as needed. Import alias: `@src/*`.

### Deep links

Scheme `vibes://`. Routes registered in [src/app/navigation/linking.ts](src/app/navigation/linking.ts):

```
vibes://events/share/:token
vibes://reviews/share/:reviewId
vibes://social/profile/:userId
vibes://social/events/:eventId
vibes://social/follow-requests/:type
```

Push notifications route through here too — `getInitialURL` falls back to the URL of the notification that opened the app.

## Design system

Tokens in [src/shared/constants/tokens.ts](src/shared/constants/tokens.ts), theme in [src/shared/constants/theme.ts](src/shared/constants/theme.ts). Dark palette: background `#111111`, mint primary `#6FE8A8`, forest green `#2D5A3D`. Fonts: Poppins (default), InterTight (display), JetBrainsMono (mono).

Enforced rules:

- No inline `style={{...}}` — use `StyleSheet.create`.
- No hardcoded colors — use `theme.colors.*`.
- No hardcoded spacing — use `theme.spacing.*` (multiples of 4).
- Prefer `<Box>` over `<View>`, and `<ThemedText>` over `<Text>`.
- Before creating a new component, look for a partial match in `src/shared/components/` and reuse/extend it.

Full details and the new-component convention: [CLAUDE.md](CLAUDE.md).

## Code intelligence

Indexed by GitNexus as `vibe-app`. Run impact analysis before editing a symbol, and `gitnexus_detect_changes()` before committing. Rules in [AGENTS.md](AGENTS.md).
