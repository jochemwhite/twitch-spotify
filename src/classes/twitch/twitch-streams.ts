import { TwitchAPI } from "@/axios/twitchAPI";
import type { GetStreamsResponse } from "@/types/twitchAPI";

class twitchStreams {
  constructor() {}

  async getStreams(broadcaster_id: string, type: "live" | "all" = "all") {
    try {
      const res = await TwitchAPI.get<GetStreamsResponse>(`/streams`, {
        params: {
          user_id: broadcaster_id,
          type: type,
        },
        broadcaster_id: broadcaster_id,
      });

      return res.data
    } catch (error) {
      console.log(error);
    }
  }
}

export const TwitchStreamAPI = new twitchStreams();
