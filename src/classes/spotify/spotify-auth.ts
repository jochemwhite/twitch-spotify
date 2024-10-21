import { spotify_redirect } from "@/lib/const";
import { env } from "@/lib/env";
import type { SpotifyAccessToken } from "@/types/spotify-web-api";
import axios from "axios";

class spotifyAuth {
  constructor() {}

  async getTokens(code: string) {
    const spotifyTokens = await axios.post<SpotifyAccessToken>(
      `https://accounts.spotify.com/api/token`,
      {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: spotify_redirect,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_SECRET}`).toString("base64")}`,
        },
      }
    );

    return spotifyTokens.data;
  }

  async RefreshTokens(refreshToken: string) {
    const spotifyTokens = await axios.post<SpotifyAccessToken>(
      `https://accounts.spotify.com/api/token`,
      {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_SECRET}`).toString("base64")}`,
        },
      }
    );

    return spotifyTokens.data;
  }
}

export const SpotifyAuthAPI = new spotifyAuth();
