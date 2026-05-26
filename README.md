# Citabac — Web

Web version of the Citabac Android app. Same Supabase backend, same UX:
filters → vertical-snap swipe → flippable explanation cards → local favorites.

Stack: Next.js 14 (static export), React 18, Tailwind, Supabase.

## Local dev

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy on Cloudflare Pages

1. Push this folder to a GitHub repo.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Pick the repo. Build settings:
   - Framework preset: **Next.js (Static HTML Export)**
   - Build command: `npm run build`
   - Build output directory: `out`
4. Add environment variables (Settings → Environment variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy. Then add the custom domain `citabac.com` under the Custom domains tab.

## Notes

- This is a static export (`output: 'export'`). All data fetching happens
  client-side against Supabase — no server runtime needed.
- Favorites use `localStorage`, matching the Flutter app's SharedPreferences.
- Mouvement / Objet filters use the same client-side mapping fallback as the
  Flutter app. Flip `USE_SERVER_SIDE_MOUVEMENT_OBJET` in `lib/citations.ts`
  once those columns exist in Supabase.
- The Supabase table must have RLS enabled with a public SELECT policy.
