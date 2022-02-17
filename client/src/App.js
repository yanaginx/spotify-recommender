import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Home from "./Home";
import Loading from "./Loading";
import SpotifyRecommender from "./SpotifyRecommender";

function App() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    axios.get("/auth/current-session").then(({ data }) => {
      console.log(data);
      if (data.token) {
        console.log("[DEBUG] first run token fetch: ", data.token);
        // check if the token is valid
        if (data.iat * 1000 - Date.now() < 3000) {
          console.log("[DEBUG] token is still valid");
          setAuth(data.token);
        } else {
          // refresh the token
          axios
            .get("/auth/refresh-token")
            .then((res) => {
              console.log("[DEBUG] token refreshed: ", res);
              // fetch the new token
              axios.get("/auth/current-session").then(({ data }) => {
                console.log(data);
                console.log("[DEBUG] New token fetch: ", data.token);
                setAuth(data.token);
              });
            })
            .catch(() => {
              console.log("[DEBUG] token refresh failed");
            });
        }
      }
    });
  }, []);

  // call refresh token route every 50 minutes
  useEffect(() => {
    setInterval(() => {
      axios.get("/auth/refresh-token").then((res) => {
        console.log("[DEBUG] interval refresh: ", res);
      });
    }, 1000 * 60 * 50);
  }, []);

  // if (auth === null) {
  //   return <Loading />;
  // }

  if (auth) {
    console.log("[DEBUG] auth token on App: ", auth);
    return <SpotifyRecommender auth={auth} />;
  }
  return <Home />;
}
export default App;
