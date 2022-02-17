import React, { useState } from "react";
import "./App.css";
import axios from "axios";

import { Grid, TextField, Button, Typography } from "@material-ui/core";
import { Search } from "@material-ui/icons";

import ArtistResults from "./components/ArtistResults";
import SearchResults from "./components/SearchResults";
import TrackResults from "./components/TrackResults";
import NobBoard from "./components/NobBoard";
import ResultsList from "./components/ResultsList";

function SpotifyRecommender({ auth }) {
  const [token, setToken] = useState(auth);
  // get new token from the session variable
  axios.get("/auth/current-session").then(({ data }) => {
    setToken(data.token);
  });
  console.log("[DEBUG] recommender token: ", token);

  const [seeds, setSeeds] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [trackResults, setTrackResults] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [nobValues, setNobValues] = useState({});
  const [results, setResults] = useState(null);

  // const searchSpotify = async () => {
  //   const url = "https://api.spotify.com/v1/search";
  //   const searchQuery = encodeURIComponent(searchString);
  //   const typeQuery = `type=artist`;
  //   const { data } = await axios.get(
  //     `${url}?q=${searchQuery}&${typeQuery}&limit=1`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   console.log("[DEBUG] ", data);

  //   if (data && data.artists) {
  //     console.log("[DEBUG] Artists: ", data.artists.items);
  //     setSearchResults(data.artists.items);
  //   }
  // };

  const searchSpotify = async () => {
    let recommendSeeds = [];
    let searchResults = [];

    const url = "https://api.spotify.com/v1/search";
    if (searchString === "") {
      return;
    }
    let subSearchQuery = searchString.split(", ");
    console.log("[DEBUG] splitted queries", subSearchQuery);
    for (let i = 0; i < subSearchQuery.length; i++) {
      const searchQuery = encodeURIComponent(subSearchQuery[i]);
      if (searchQuery.length <= 0) continue;
      const typeQuery = `type=artist`;
      const { data } = await axios.get(
        `${url}?q=${searchQuery}&${typeQuery}&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data && data.artists) {
        searchResults.push(data.artists.items[0]);
        recommendSeeds.push(data.artists.items[0].id);
      }
    }
    console.log("[DEBUG] Sub query artists: ", recommendSeeds);
    setSeeds(recommendSeeds);
    setSearchResults(searchResults);
  };

  const getRecommendations = async () => {
    const url = "https://api.spotify.com/v1/recommendations";
    // get artists
    // let selectedArtistsString;
    // if (selectedArtists.length <= 0) {
    //   return;
    // } else {
    //   selectedArtistsString = `seed_artists=${selectedArtists.join(",")}`;
    // }
    let seedString;
    if (seeds.length <= 0) {
      return;
    } else {
      seedString = `seed_artists=${seeds.join(",")}`;
    }

    // // get nobs
    // let min = [];
    // let max = [];
    // Object.keys(nobValues).forEach((nob) => {
    //   if (nobValues[nob].enabled) {
    //     // then we add our min and max values
    //     min.push(`min_${nob}=${nobValues[nob].value[0]}`);
    //     max.push(`max_${nob}=${nobValues[nob].value[1]}`);
    //   }
    // });
    // const minString = min.join("&");
    // const maxString = max.join("&");

    const { data } = await axios.get(
      // `${url}?${selectedArtistsString}&${minString}&${maxString}`,
      `${url}?${seedString}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("[DEBUG] Recommended tracks", data);
    setResults(data);
  };

  return (
    <div className={"App"}>
      <Grid container style={{ padding: 20 }} spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h2">Spotify Recommender</Typography>
        </Grid>
        <Grid item xs={2}>
          {/* offset grid */}
        </Grid>
        <Grid item xs={8}>
          <Grid item xs={12}>
            {selectedArtists.map((artist, index) => (
              <Typography>
                {index + 1}. {artist}
              </Typography>
            ))}
          </Grid>
          <Grid item xs={12} style={{ display: "flex", flexDirection: "row" }}>
            <TextField
              variant={"outlined"}
              label={"Search"}
              style={{ backgroundColor: "white" }}
              fullWidth
              onChange={(event) => setSearchString(event.target.value)}
              value={searchString}
              helperText={
                "Search for some artists, seperated by commas, maximum 5 items, e.g. 'artist1, artist2, artist3,...'"
              }
            />
            <Button
              style={{ backgroundColor: "#ff905b" }}
              onClick={searchSpotify}
            >
              <Search />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <SearchResults
              onChange={setSelectedArtists}
              results={searchResults}
            />
          </Grid>
          <Grid item xs={12}>
            <TrackResults onChange={setTrackResults} results={trackResults} />
          </Grid>
        </Grid>
        {/* <Grid item xs={6}>
          <NobBoard onChange={setNobValues} />
        </Grid> */}
        <Grid item xs={12}>
          <Button variant={"contained"} onClick={getRecommendations}>
            Get Recommendations
          </Button>
        </Grid>
        <Grid item xs={12}>
          {results && <ResultsList results={results} />}
        </Grid>
      </Grid>
    </div>
  );
}

export default SpotifyRecommender;
