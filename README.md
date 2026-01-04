# URL-Shortner 🚀

> Lightweight URL shortening service built with Node.js, Express, EJS and MongoDB.

## Overview

Users can sign up, log in, create short links, preview short links, and track simple visit analytics (timestamps). Admins can view aggregated totals across all users.

Tech stack
- Node.js + Express
- EJS for server-rendered views
- MongoDB with Mongoose
- JWT for cookie-based auth

---

## Quick start

Prerequisites
- Node.js 14+ installed
- MongoDB available (local or remote URI)

1) Install dependencies

```bash
npm install
```

2) Create a `.env` file in the project root with these variables:

```env
MONGO_URL=mongodb://127.0.0.1:27017/short-url
PORT=8001
# (Optional) Replace the default JWT secret in the code or modify service/auth to read from env
# JWT_SECRET=replace_with_secure_secret
```

3) Start the server

```bash
npm start
```

By default the app listens on `http://localhost:8001` unless `PORT` is set.

---

## Important notes about current implementation ⚠️
- The application stores the JWT signing secret in code by default — **update the auth service to use an environment variable (JWT_SECRET)** for production. 
- Passwords are stored as plain text currently. Please **add password hashing (bcrypt)** before deploying to production. 
- The auth cookie used by the app is named `token` (not `uid`).

---

## Key routes & behavior 🔧
- GET `/` — Home page (shows your URLs; admin sees all URLs and a **Total Clicks (all users)** value)
- GET `/signup` — Signup page
- GET `/login` — Login page
- GET `/logout` — Sign out (clears auth cookie)
- POST `/user` — Create user (body: `name`, `email`, `password`)
- POST `/user/login` — Login (body: `email`, `password`) — sets `token` cookie on success

URL management
- POST `/url` — Create a short URL (requires auth; body: `url`)
- GET `/` (Home) — Lists URLs belonging to the logged-in user (admins see all)
- In the home list each row has **Preview**, **Open (track)** and (admin-only) **API** links

Short URL handling
- GET `/:shortId` — **Preview page** (human-friendly page showing original URL and total clicks)
- GET `/r/:shortId` — **Redirect endpoint** (records a visit and redirects to the original URL)
- GET `/api/:shortId` — **Admin-only JSON** endpoint with metadata and total clicks
- GET `/url/analytics/:shortId` — Returns visit timestamps for the shortId (used by analytics)

---

## How to test (quick) ✅
1. Run the server with `npm start`.
2. Sign up a user and log in.
3. Create a short URL using the home form.
4. Open `http://localhost:8001/<shortId>` to see the Preview page.
5. Click **Continue to Destination** (or open `/r/<shortId>`) — this should redirect and increment the click count.
6. Admins can visit `/` to see **Total Clicks (all users)** and the **API** link for each short URL.

---

## Deployment checklist ✅
- Replace hardcoded secrets with environment variables (JWT secret) and keep `.env` out of source control.
- Add password hashing (bcrypt) and input validation.
- Configure MongoDB (replica set / managed DB) for production resiliency.
- Consider adding rate-limiting and CORS rules to the API endpoints.
- Add secure session/cookie flags (Secure, HttpOnly) in production.

---

## Project structure (important files)
- Controllers: `controllers/url.js`, `controllers/user.js`
- Routes: `routes/url.js`, `routes/user.js`, `routes/staticRouter.js`
- Models: `models/url.js`, `models/user.js`
- Middleware: `middlewares/auth.js`
- Auth service: `service/auth.js`
- Views: `views/home.ejs`, `views/preview.ejs`, `views/login.ejs`, `views/signup.ejs`

---

## Contributing
Suggestions, bug reports or PRs are welcome. I can also add a Postman collection, Dockerfile, or CI scripts on request.

---

## License
MIT

