# URL-Shortner

> Simple URL shortening service built with Node.js, Express and MongoDB.

## Overview

This project lets users sign up and log in, create short URLs that redirect to full URLs, and view analytics (visit timestamps) for each short link.

Tech: Node.js, Express, EJS, MongoDB (Mongoose), JSON Web Tokens (JWT for cookie-based auth)

## Quick Start
# URL Shortner

Lightweight URL shortening service built with Node.js, Express, EJS and MongoDB.

This app lets users sign up / log in, create short links that redirect to long URLs, and view simple visit analytics.

Tech stack
- Node.js + Express
- EJS for server-rendered views
- MongoDB with Mongoose

Features
- User signup and login
- Create short URLs and redirect via `/:shortId`
- Track visit timestamps (analytics) per short URL

Prerequisites
- Node.js 14+ installed
- MongoDB available (local or remote URI)

Quick start

1. Install dependencies

```bash
npm install
```

2. Create an environment file `.env` at the project root (example below)

3. Start the server

```bash
npm start
```

By default the app listens on port `8001` unless overridden by `PORT`.

Environment variables
- `MONGO_URI` — MongoDB connection string (e.g. `mongodb://127.0.0.1:27017/short-url`)
- `PORT` — Port to run the server (default: `8001`)
- `JWT_SECRET` — Secret key used to sign auth tokens (required for production)

Recommended `.env` example

```
MONGO_URI=mongodb://127.0.0.1:27017/short-url
PORT=8001
JWT_SECRET=replace_with_secure_secret
```

Project structure (important files)
- Controllers: [controllers/url.js](controllers/url.js), [controllers/user.js](controllers/user.js)
- Routes: [routes/url.js](routes/url.js), [routes/user.js](routes/user.js), [routes/staticRouter.js](routes/staticRouter.js)
- Models: [models/url.js](models/url.js), [models/user.js](models/user.js)
- Middleware: [middlewares/auth.js](middlewares/auth.js)
- Auth service: [service/auth.js](service/auth.js)
- Views: `views/home.ejs`, `views/login.ejs`, `views/signup.ejs`

Key routes
- GET `/` — Home page
- GET `/signup` — Signup page
- GET `/login` — Login page
- POST `/user` — Create a new user (body: `name`, `email`, `password`)
- POST `/user/login` — Login (body: `email`, `password`) — sets `uid` cookie on success
- POST `/url` — Create a short URL (requires auth; body: `url`)
- GET `/url/analytics/:shortId` — Get analytics for a shortId (requires auth)
- GET `/:shortId` — Public redirect endpoint

Security notes
- Use a strong `JWT_SECRET` in production and do not check secrets into source control.
- Hash passwords (bcrypt) before storing them — consider adding this if not already present.

Development notes
- To change the DB, set `MONGO_URI` in `.env` or modify `index.js` connection.
- The app uses a cookie named `uid` to store JWT tokens for authenticated routes.

Contributing
- Open an issue or submit a PR with improvements.

License
- MIT

If you want, I can add a Postman collection, Dockerfile, or CI scripts next.
