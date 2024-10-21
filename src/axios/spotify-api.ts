import { SpotifyAuthAPI } from "@/classes/spotify/spotify-auth";
import { TwitchAuthAPI } from "@/classes/twitch/twitch-auth";
import { env } from "@/lib/env";
import { getSpotifyUserAccessToken, getSpotifyUserRefreshToken, updateSpotifyUserToken } from "@/queries/spotify-users";
import axios from "axios";

const SpotifyAPI = axios.create({
  baseURL: "https://api.spotify.com/v1/",
  headers: {
    Accept: "application/json",
  },
});

SpotifyAPI.interceptors.request.use(
  async (config) => {
    // Assuming you have a method to get the current token...]
    const broadcaster_id = config.broadcaster_id;

    if (!broadcaster_id) {
      throw new Error("User ID is missing");
    }

    const access_token = await getSpotifyUserAccessToken(broadcaster_id);

    if (!access_token) {
      throw new Error("Access token is missing");
    }

    config.headers["Authorization"] = "Bearer " + access_token;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//twitch response interceptor
SpotifyAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  //handle response error
  async function (error) {
    // originalRequest

    const originalRequest = error.config;

    //if the error status = 401 we update the token and retry
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      //get the channel from the request
      const broadcaster_id = error.response?.config.broadcaster_id;

      // get the refresh token from the database
      const refresh_token = await getSpotifyUserRefreshToken(broadcaster_id);

      //fetch the new accessToken and update the tokens
      const newTokens = await SpotifyAuthAPI.RefreshTokens(refresh_token);

      if (!newTokens) {
        console.log("Error refreshing token");
        return;
      }

      //update the tokens
      await updateSpotifyUserToken(broadcaster_id, {
        access_token: newTokens.access_token,
        refresh_token: newTokens.refresh_token,
      });

      //update the headers for the new request
      originalRequest.headers["Authorization"] = "Bearer " + newTokens.access_token;

      //make the new request
      const res = SpotifyAPI(originalRequest);

      return res;
    }
    return Promise.reject(error);
  }
);

export { SpotifyAPI };
