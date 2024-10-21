import { env } from "@/lib/env";
import axios from "axios";
import { TwitchAPI } from "../axios/twitchAPI";
import type { getChattersRequest, getChattersResponse } from "../types/twitchAPI";

export class twitch {
  protected clientID = env.TWITCH_CLIENT_ID;
  protected clientSecret = env.TWITCH_SECRET;
  protected broadcasterID?: number;

  constructor() {}
}

const twitchAPI = new twitch();

export default twitchAPI;
