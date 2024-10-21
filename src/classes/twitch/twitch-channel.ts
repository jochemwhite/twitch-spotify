import { TwitchAPI } from "@/axios/twitchAPI";
import type { getChannelFollowersReponse, getChannelSubscriptionsReponse, ModifyChannelInformationRequest } from "@/types/twitchAPI";
import { twitch } from "../twitch";

class twitchChannel extends twitch {
  constructor() {
    super();
  }

  // Modify Channel Information
  async modifyChannelInformation(broadcaster_id: string, user_id: string, data: ModifyChannelInformationRequest) {
    try {
      const res = await TwitchAPI.patch(`/channels`, data, {
        params: {
          broadcaster_id,
        },
        user_id: user_id,
      });
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // get channel followers
  async getFollowers(broadcaster_id: string, chatter_id: string, user_id: string, first?: string, after?: string) {
    try {
      const res = await TwitchAPI.get<getChannelFollowersReponse>(`/channels/followers`, {
        params: {
          broadcaster_id,
          user_id: chatter_id,
          first,
          after,
        },
        user_id: user_id,
      });
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // get channel subscribers
  async getSubsribers(broadcaster_id: string, user_id: string, chatter_id?: string, first?: string, after?: string) {
    try {
      const res = await TwitchAPI.get<getChannelSubscriptionsReponse>(`/subscriptions`, {
        params: {
          broadcaster_id,
          user_id: chatter_id,
          first,
          after,
        },
        user_id: user_id,
      });
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // get channel vip
  async getVip(broadcaster_id: string, chatter_id: string, user_id: string) {
    try {
      const res = await TwitchAPI.get(`/channels/vips`, {
        params: {
          broadcaster_id,
          user_id: chatter_id,
        },
        user_id: user_id,
      });
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // add vip
  async add_vip(broadcaster_id: string, user_id: string) {
    await TwitchAPI.post("/channels/vips", null, {
      params: {
        broadcaster_id,
        user_id,
      },
      broadcasterID: +broadcaster_id,
    });
  }

  // check if a channel is live
  async getStream(broadcaster_id: string, user_id: string) {
    try {
      const res = await TwitchAPI.get(`/streams`, {
        params: {
          user_id: broadcaster_id,
        },
        user_id: user_id,
      });
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Get Ad Schedule
  async get_ad_schedule(broadcaster_id: string) {
    const res = await TwitchAPI.get("/channels/ads", {
      params: {
        broadcaster_id,
      },
      broadcasterID: +broadcaster_id,
    });
    return res.data;
  }
}

export const TwitchChannel = new twitchChannel();
