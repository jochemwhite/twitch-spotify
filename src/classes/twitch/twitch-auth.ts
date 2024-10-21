import { db } from "@/db";
import { TwitchUsers } from "@/db/schema";
import { twitch_redirect } from "@/lib/const";
import { env } from "@/lib/env";
import axios from "axios";

class TwitchAuth {
  protected clientID = env.TWITCH_CLIENT_ID;
  protected clientSecret = env.TWITCH_SECRET;
  constructor() {}
  async getAccessToken(code: string) {
    try {
      const res = await axios.post(`https://id.twitch.tv/oauth2/token`, {
        client_id: this.clientID,
        client_secret: this.clientSecret,
        grant_type: "authorization_code",
        redirect_uri: twitch_redirect,
        code: code,
      });

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  async RefreshToken(refreshToken: string, channelID: number) {
    try {
      const res = await axios.post(
        `https://id.twitch.tv/oauth2/token?client_id=${env.TWITCH_CLIENT_ID}&client_secret=${env.TWITCH_SECRET}&grant_type=refresh_token&refresh_token=${refreshToken}`
      );

      // console.log(res)

      await db.update(TwitchUsers).set({ access_token: res.data.access_token, refresh_token: res.data.refresh_token });

      return res.data;
    } catch (error) {
      console.error("error refreshing token");
      console.log(error);
    }
  }

  async createAppToken() {
    try {
      const res = await axios.post(
        `https://id.twitch.tv/oauth2/token?client_id=${this.clientID}&client_secret=${this.clientSecret}&grant_type=client_credentials`
      );

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
}

export const TwitchAuthAPI = new TwitchAuth();
