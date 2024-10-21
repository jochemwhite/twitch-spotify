import type { CurrentUsersProfileResponse } from "@/types/spotify-web-api";
import axios from "axios";
class spotifyUser {
  constructor() {}

  async getSpotifyUser(access_token: string) {
    const res = await axios.get<CurrentUsersProfileResponse>(`https://api.spotify.com/v1/me`, {
      headers: {
        "Authorization": `Bearer ${access_token}`,
      },
    });

    return res.data;
  }

}

export const SpotifyUserAPI = new spotifyUser();