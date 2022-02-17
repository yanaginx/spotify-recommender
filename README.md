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

Current issues and todos:

- [x] [ISSUE] ~~Fixing the session cookies containing token (currently testing, expired cookies fixed)~~

  > The expired token (stored in valid session cookies) will be refreshed on launching the application  
  > The token (stored in expired session cookies) will be prompted to re login

- [ ] [TODO] Refactor the codebase
- [ ] [TODO] Improving UI
- [ ] [TODO] Finish the README
