import { TwitchAuthAPI } from "@/classes/twitch/twitch-auth";
import { env } from "@/lib/env";
import { getTwitchUserAccessToken, getTwitchUserRefreshToken } from "@/queries/twitch-users";
// import { getRefreshToken } from "@/queries/spotify-users";
import axios from "axios";

const TwitchAPI = axios.create({
  baseURL: "https://api.twitch.tv/helix",
  headers: {
    Accept: "application/json",
    "Client-ID": env.TWITCH_CLIENT_ID,
  },
});

TwitchAPI.interceptors.request.use(
  async (config) => {
    // Assuming you have a method to get the current token...]
    const broadcaster_id = config.broadcaster_id;

    if (!broadcaster_id) {
      throw new Error("User ID is missing");
    }

    const access_token = await getTwitchUserAccessToken(broadcaster_id);

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
TwitchAPI.interceptors.response.use(
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

      const refresh_token = await getTwitchUserRefreshToken(broadcaster_id);

      if (!refresh_token) {
        throw new Error("Refresh token is missing");
        return;
      }

      //fetch the new accessToken and update the tokens
      const newToken = await TwitchAuthAPI.RefreshToken(refresh_token, broadcaster_id);

      if (!newToken) {
        console.log("Error refreshing token");
        return;
      }

      //update the headers for the new request
      originalRequest.headers["Authorization"] = "Bearer " + newToken.access_token;

      //make the new request
      const res = TwitchAPI(originalRequest);

      return res;
    }
    return Promise.reject(error);
  }
);

export { TwitchAPI };
