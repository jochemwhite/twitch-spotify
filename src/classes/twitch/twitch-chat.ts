import { TwitchAPI } from "@/axios/twitchAPI";
import type {
  ChannelBadgeResponse,
  ChatSettingsResponse,
  SencChatAnnouncementRequest,
  SendChatMessageRequest,
  SendChatMessageResponse,
  UpdateUserChatColorRequest,
  getChanneleEmotes,
  getChattersRequest,
  getChattersResponse,
  getUserChatColorResponse,
  updateChatSettingsRequest,
} from "@/types/twitchAPI";
import { TwitchAPP } from "@/axios/twitchApp";
import { env } from "@/lib/env";

class TwitchChat {
  constructor() {}

  //get all the chatters in a chat room
  async getChatters({ broadcaster_id, moderator_id, after, first }: getChattersRequest): Promise<getChattersResponse> {
    try {
      const res = await TwitchAPI.get<getChattersResponse>(`/chat/chatters`, {
        params: {
          broadcaster_id,
          moderator_id,
          after,
          first,
        },
        broadcasterID: +broadcaster_id,
      });

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // get channel Emotes
  async getChannelEmotes(broadcaster_id: string): Promise<getChanneleEmotes> {
    try {
      const res = await TwitchAPI.get<getChanneleEmotes>(`/chat/emotes`, {
        params: {
          broadcaster_id,
        },
        broadcasterID: +broadcaster_id,
      });

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // get global Emotes
  async getGlobalEmotes(broadcasterID: number): Promise<getChanneleEmotes> {
    try {
      const res = await TwitchAPI.get<getChanneleEmotes>(`/chat/emotes/global`, {
        broadcasterID: +broadcasterID,
      });

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Get Emote Sets
  async getEmoteSets(broadcaster_id: string, emote_set_id: string): Promise<getChanneleEmotes> {
    try {
      const res = await TwitchAPI.get<getChanneleEmotes>(`/chat/emotes/set`, {
        params: {
          emote_set_id,
        },
        broadcasterID: +broadcaster_id,
      });

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Get Channel Chat Badges
  async getChannelChatBadges(broadcaster_id: string): Promise<ChannelBadgeResponse> {
    try {
      const res = await TwitchAPI.get<ChannelBadgeResponse>(`/chat/badges`, {
        params: {
          broadcaster_id,
        },
        broadcasterID: +broadcaster_id,
      });

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Get Global Chat Badges
  async getGlobalChatBadges(broadcasterID: string): Promise<ChannelBadgeResponse> {
    try {
      const res = await TwitchAPI.get<ChannelBadgeResponse>(`/chat/badges/global`, {
        broadcasterID: +broadcasterID,
      });

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Get Chat Settings
  async getChatSettings(broadcaster_id: string, moderator_id: string): Promise<ChatSettingsResponse> {
    try {
      const res = await TwitchAPI.get<ChatSettingsResponse>(`/chat/settings`, {
        params: {
          broadcaster_id,
          moderator_id,
        },
        broadcasterID: +broadcaster_id,
      });

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Get User Emotes
  async getUserEmotes(user_id: string, broadcaster_id?: string, after?: string): Promise<getChanneleEmotes> {
    try {
      const res = await TwitchAPI.get<getChanneleEmotes>(`/chat/emotes/user`, {
        params: {
          user_id,
          broadcaster_id,
          after,
        },
        broadcasterID: +user_id,
      });

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Update Chat Settings
  async updateChatSettings(broadcaster_id: string, moderator_id: string, settings: updateChatSettingsRequest): Promise<ChatSettingsResponse> {
    try {
      const res = await TwitchAPI.patch<ChatSettingsResponse>(`/chat/settings`, settings, {
        params: {
          broadcaster_id,
          moderator_id,
        },
        broadcasterID: +broadcaster_id,
      });

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Send Chat Announcement
  async sendChatAnnouncement(broadcaster_id: string, announcement: SencChatAnnouncementRequest): Promise<void> {
    try {
      await TwitchAPI.post(`/chat/announcements`, announcement, {
        params: {
          broadcaster_id,
          moderator_id: broadcaster_id,
        },
        // get the accessToken from the moderator
        broadcasterID: +broadcaster_id,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // send shoutout
  async sendShoutout(from_broadcaster_id: string, to_broadcaster_id: string, moderator_id: string): Promise<void> {
    await TwitchAPI.post(`/chat/shoutouts`, null, {
      params: {
        from_broadcaster_id,
        to_broadcaster_id,
        moderator_id,
      },
      // get the accessToken from the moderator
      broadcasterID: +moderator_id,
    });
  }

  // send Message
  async sendMessage(message: SendChatMessageRequest): Promise<SendChatMessageResponse["data"]["0"]> {
    const res = await TwitchAPP.post<SendChatMessageResponse>(`/chat/messages`, message);

    return res.data.data[0];
  }

  // Get User Chat Color
  async getUserChatColor(broadcaster_id: string, user_id: string[]): Promise<getUserChatColorResponse> {
    try {
      const res = await TwitchAPI.get<getUserChatColorResponse[]>(`/chat/color`, {
        params: {
          user_id,
        },
        broadcasterID: +broadcaster_id,
      });

      return res.data[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Update User Chat Color
  async updateUserChatColor({ user_id, color }: UpdateUserChatColorRequest): Promise<void> {
    try {
      await TwitchAPI.put(`/chat/color`, null, {
        params: {
          user_id,
          color,
        },

        broadcasterID: +user_id,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export const twitchChat = new TwitchChat();
