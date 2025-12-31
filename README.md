# URL-Shortner

> Simple URL shortening service built with Node.js, Express and MongoDB.

## Overview

This project lets users sign up and log in, create short URLs that redirect to full URLs, and view analytics (visit timestamps) for each short link.

Tech: Node.js, Express, EJS, MongoDB (Mongoose), JSON Web Tokens (JWT for cookie-based auth)

## Quick Start

Prerequisites:
- Node.js (14+)
- MongoDB running locally or accessible URI

Install dependencies:

```bash
npm install
```

Start the app (development):

```bash
npm start
```

The server listens on port `8001` by default.

## Configuration

- Default MongoDB connection is used in `index.js`:
  `mongodb://127.0.0.1:27017/short-url` — change if needed.
- Auth uses an internal secret in `service/auth.js` for JWTs. For production, replace with a secure secret and environment variable.

## Files of interest
- Controllers: [controllers/url.js](controllers/url.js) and [controllers/user.js](controllers/user.js)
- Routes: [routes/staticRouter.js](routes/staticRouter.js), [routes/url.js](routes/url.js), [routes/user.js](routes/user.js)
- Models: [models/url.js](models/url.js), [models/user.js](models/user.js)
- Middleware: [middlewares/auth.js](middlewares/auth.js)
- Auth service: [service/auth.js](service/auth.js)

## Routes

Public / view routes
- GET `/` — Renders the home page (`views/home.ejs`). If not logged in, redirects to `/login`.
- GET `/signup` — Renders signup page (`views/signup.ejs`).
- GET `/login` — Renders login page (`views/login.ejs`).

User routes (user creation & authentication)
- POST `/user` — Sign up a new user.
  - Body: `{ name, email, password }`
  - On success: renders `home.ejs`.
- POST `/user/login` — Log in an existing user.
  - Body: `{ email, password }`
  - On success: sets an HTTP cookie `uid` (JWT) and redirects to `/`.

Authenticated URL routes
- POST `/url` — Create a new short URL (requires cookie `uid`).
  - Body: `{ url }` (full redirect URL)
  - Returns: renders `home` with `id` containing the generated shortId.
- GET `/url/analytics/:shortId` — Get analytics for a shortId (requires auth).
  - Returns JSON: `{ totalClicks, analytics }` where `analytics` is an array of visit timestamps.

Redirect route (public)
- GET `/:shortId` — Public redirect endpoint. Finds the record by `shortId`, pushes a timestamp into `visitHistory`, and redirects to the stored `redirectURL`. Returns 404 if not found.

## Models

- `User` (`models/user.js`)
  - Fields: `name` (String), `email` (String, unique), `password` (String)

- `URL` (`models/url.js`)
  - Fields: `shortId` (String, unique), `redirectURL` (String), `visitHistory` (array of `{ timestamp }`), `createdBy` (ObjectId ref `users`)

## Auth / Middleware

- Auth tokens are JWTs created in `service/auth.js` via `setUser(user)` and verified via `getUser(token)`.
- `middlewares/auth.js` exports:
  - `restrictToLoggedinUserOnly` — Redirects to `/login` if no valid `uid` cookie.
  - `checkAuth` — Optional; attaches `req.user` if cookie present, otherwise `req.user` is `null`.

Login sets a cookie named `uid`. Protected routes use `restrictToLoggedinUserOnly`.

## Example API usage

Create a new short URL (after login):

```bash
curl -X POST http://localhost:8001/url \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --cookie "uid=<token>" \
  -d "url=https://example.com/some/long/path"
```

Get analytics:

```bash
curl http://localhost:8001/url/analytics/SHORTID --cookie "uid=<token>"
```

Redirect (public):

```bash
curl -v http://localhost:8001/SHORTID
```

## Notes / Next steps
- Replace the inline JWT secret with an environment variable for production.
- Add password hashing (bcrypt) before storing passwords.
- Add input validation and better error handling.
- Consider making analytics paginated and displayable in the UI.

If you'd like, I can add example requests in Postman collection format, add environment variable support, or harden auth (bcrypt + env secrets).
