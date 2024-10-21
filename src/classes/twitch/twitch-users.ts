import type { getUserResponse } from "@/types/twitchAPI";
import axios from "axios";
import { env } from "bun";

class twitchUsers {
  constructor() {}

  async getTwitchUsers(access_token: string) {
    const res = await axios.get<getUserResponse>(`https://api.twitch.tv/helix/users`, {
      headers: {
        "Client-ID": env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res.data;
  }
}


export const TwitchUsersAPI = new twitchUsers();