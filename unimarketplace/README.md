# UniMarketplace Frontend (Expo + TypeScript)

Mobile frontend for a college-only marketplace built with React Native and Expo Router.
This app has onboarding + browse UI and supports backend integration with fallback mock data.

## Stack

- Expo
- React Native
- TypeScript
- Expo Router (file-based routing)

## Run locally

```bash
npm install
npx expo start
```

Then press:

- `i` for iOS simulator
- `a` for Android emulator
- `w` for web

## Backend integration (teammate repo)

This frontend is wired to the backend contract in:
`https://github.com/Philemon-a/unimarketplace-backend`

Supported endpoints used by frontend:

- `GET /health`
- `GET /api/items`

Set API URL with Expo public env var:

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000 npx expo start
```

If backend is unreachable or `/api/items` returns an empty array, the app falls back to local mock data.

## Current frontend screens

- Onboarding flow: college selection, email verification, profile completion
- `Browse`: search + category chips + latest listings
- `Sell`: create-listing form stub
- `Messages`: chat-thread preview list

## Key files

- `app/_layout.tsx`: stack routing and onboarding entry
- `app/index.tsx`: root redirect to onboarding
- `app/onboarding/*`: onboarding screens
- `app/(tabs)/_layout.tsx`: tab navigation config
- `app/(tabs)/index.tsx`: Browse screen (backend + fallback mock)
- `lib/api.ts`: backend client utilities
- `data/mock.ts`: mock listings + inbox data
