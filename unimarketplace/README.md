# UniMarketplace Frontend (Expo + TypeScript)

Mobile frontend for a college-only marketplace built with React Native and Expo Router.
This app currently uses mock data and frontend-only flows so backend/Supabase can be integrated incrementally.

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

## Current frontend screens

- `Home`: search + category chips + latest listings
- `Discover`: category filter + sorting UI
- `Sell`: create-listing form stub
- `Inbox`: chat-thread preview list
- `Profile`: verified student profile + move-out mode toggle

## Key files

- `app/(tabs)/_layout.tsx`: tab navigation config
- `app/(tabs)/index.tsx`: Home screen
- `app/(tabs)/explore.tsx`: Discover screen
- `app/(tabs)/sell.tsx`: Sell screen
- `app/(tabs)/inbox.tsx`: Inbox screen
- `app/(tabs)/profile.tsx`: Profile screen
- `data/mock.ts`: mock listings + inbox data

## Integration notes for backend/Supabase

- Replace `data/mock.ts` reads with API hooks/queries.
- Wire `Sell` form submit to listing create endpoint.
- Wire `Inbox` to real threads/messages.
- Use authenticated user context for `Profile` content.
