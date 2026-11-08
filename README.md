# BookNook

BookNook is a Next.js application for browsing and sharing books.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Set the MongoDB connection string, Better Auth secret, and ImgBB API key.
3. Keep the local backend URLs if the API is running at `http://localhost:8000`.
4. Install dependencies and start the app:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

Import this repository into Vercel as a Next.js project. The default install and
build commands (`npm install` and `npm run build`) work without a `vercel.json`.
Add the following variables under **Project Settings → Environment Variables**
for every environment you use (Production, Preview, and Development as needed):

| Variable | Required | Value |
| --- | --- | --- |
| `BETTER_AUTH_SECRET` | Yes | A unique, random secret of at least 32 characters. |
| `BETTER_AUTH_URL` | Yes | The deployed app's origin, for example `https://your-project.vercel.app` (no trailing slash). |
| `MONGO_DB_URL` | Yes | A MongoDB connection string. Ensure the MongoDB deployment accepts connections from the Vercel app. |
| `BACKEND_BASE_URL` | Yes | Publicly reachable backend API origin, with no trailing slash. |
| `NEXT_PUBLIC_BACKEND_BASE_URL` | Yes | Same public backend API origin; this is used by browser-side book listing and add-book requests. |
| `BACKEND_NEW_ARRIVEL_URL` | Yes | Full, publicly reachable New Arrivals endpoint URL. |
| `NEXT_PUBLIC_IMGBB_API_KEY` | For image uploads | ImgBB API key. `NEXT_PUBLIC_` means it is visible to browsers; do not put a private key here. |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | Optional | Set both only when enabling GitHub sign-in. Configure the GitHub OAuth callback for the deployed app. |

Do not use `localhost` for backend URLs in Vercel. Deploy the backend separately
and allow requests from the Vercel app's origin (including Preview origins if
needed). The backend must also set `FRONTEND_BASE_URL` to the public frontend
origin used for Better Auth's `/api/auth/jwks` endpoint, so its JWT verifier can
retrieve the signing keys. Set `BETTER_AUTH_URL` to the exact public app origin
for each Vercel environment. After changing environment variables, redeploy so
the new values are applied. Never commit `.env`, `.env.local`, or production
credentials.

Before deploying, run:

```bash
npm run lint
npm run build
```
