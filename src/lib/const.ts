export const twitch_scopes = ["user:read:chat", "user:write:chat", "user:bot", "channel:read:redemptions"];

export const spotify_scopes = ["user-modify-playback-state", "user-read-currently-playing"];

export const twitch_redirect = "http://localhost:3000/twitch/callback";
export const spotify_redirect = "http://localhost:3000/spotify/callback";

export function TwitchEventSubscriptions(user_id: string) {
  return [
    {
      type: "channel.chat.message",
      version: "1",
      condition: {
        broadcaster_user_id: user_id,
        user_id: user_id,
      },
    },

    {
      type: "channel.channel_points_custom_reward_redemption.add",
      version: "1",
      condition: {
        broadcaster_user_id: user_id,
        // reward_id: "92af127c-7326-4483-a52b-b0da0be61c01", // optional; gets notifications for a specific reward
      },
    },
  ];
}
