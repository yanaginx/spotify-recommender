const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const router = express.Router();

const AUTH_URL = new URL("https://accounts.spotify.com/authorize");
AUTH_URL.search = new URLSearchParams({
  response_type: "code",
  client_id: process.env.SPOTIFY_CLIENT_ID,
  redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
});

const GET_TOKEN_URL = "https://accounts.spotify.com/api/token";

router.get("/login", (req, res) => {
  res.redirect(AUTH_URL);
});

router.get("/callback", async (req, res) => {
  const query = req.query;
  // if we don't have a code, prompt to re-login
  if (query.error) {
    return res.redirect("/auth/login");
  }
  const code = query.code;
  console.log("[DEBUG] ", query.code);
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
  const grant_type = "authorization_code";
  const data_params = {
    grant_type: grant_type,
    code: code,
    redirect_uri: redirect_uri,
  };
  const params = new URLSearchParams(data_params);

  const basicHeader = Buffer.from(`${clientId}:${secret}`).toString("base64");
  const { data } = await axios.post(GET_TOKEN_URL, params.toString(), {
    headers: {
      Authorization: `Basic ${basicHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const sessionJWTObject = {
    token: data.access_token,
    refreshToken: data.refresh_token,
  };

  req.session.jwt = jwt.sign(sessionJWTObject, process.env.JWT_SECRET_KEY);
  return res.redirect("/");
});

router.get("/current-session", (req, res) => {
  jwt.verify(
    req.session.jwt,
    process.env.JWT_SECRET_KEY,
    (err, decodedToken) => {
      if (err || !decodedToken) {
        if (err) {
          res.send(err);
        } else {
          res.send(false);
        }
      } else {
        res.send(decodedToken);
      }
    }
  );
});

router.get("/logout", (req, res) => {
  req.session = null;
  res.redirect(`/`);
});

router.get("/refresh-token", async (req, res) => {
  let refreshToken = "";
  let oldToken = "";

  // Get refresh token from session
  try {
    const decodedToken = jwt.verify(
      req.session.jwt,
      process.env.JWT_SECRET_KEY
    );
    refreshToken = decodedToken.refreshToken;
    oldToken = decodedToken.token;
  } catch (err) {
    return res.redirect("/auth/error");
  }

  // Sending request to get new token
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const grant_type = "refresh_token";
  const data_params = {
    grant_type: grant_type,
    refresh_token: refreshToken,
  };
  const params = new URLSearchParams(data_params);
  const basicHeader = Buffer.from(`${clientId}:${secret}`).toString("base64");
  const { data } = await axios
    .post(GET_TOKEN_URL, params.toString(), {
      headers: {
        Authorization: `Basic ${basicHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .catch((err) => {
      return res.redirect("/auth/error");
    });

  // Update the session with new token
  const sessionJWTObject = {
    token: data.access_token,
    refreshToken: refreshToken,
  };
  console.log(
    "[DEBUG] from server",
    sessionJWTObject,
    " ",
    new Date().getTime()
  );
  req.session.jwt = jwt.sign(sessionJWTObject, process.env.JWT_SECRET_KEY);
  res.status(200).send("SUCCESS");
});

router.get("/error", (req, res) => {
  res.status(500).send("Internal Server Error");
});

router.get("*", (req, res) => {
  res.status(404).write("<h1>Page NOT FOUND</h1>");
});

module.exports = router;
