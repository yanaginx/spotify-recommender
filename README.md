## Spotify recommender

A track recommender with artist seeds using Spotify recommendation API

Some variable needed for the `.env`:

```
COOKIE_SECRET=<YOUR_COOKIE_SECRET>
SPOTIFY_CLIENT_ID=<YOUR_SPOTIFY_APPS_CLIENT_ID>
SPOTIFY_CLIENT_SECRET=<YOUR_SPOTIFY_APPS_CLIENT_SECRET>
SPOTIFY_REDIRECT_URI=<YOUR_SPOTIFY_APPS_REDIRECT_URI>
JWT_SECRET_KEY=<YOUR_JWT_SECRET_KEY>
```

Current issues and TODO:

- [ ] [ISSUE] Fixing the session cookies containing token (currently testing, expired cookies fixed)
- [ ] [TODO] Refactor the codebase
- [ ] [TODO] Improving UI
