import { SpotifyPlayerAPI } from "@/classes/spotify/spotify-player";
import { twitchChat } from "@/classes/twitch/twitch-chat";
import type { TrackObjectFull } from "@/types/spotify-web-api";

interface SendChatMessageRequest {
  broadcaster_id: string;
  chatter_id: string;
  chatter_name: string;
}

export default async function HandleSongCommand({ broadcaster_id, chatter_id, chatter_name }: SendChatMessageRequest): Promise<void> {
  const currently_playing_song = await SpotifyPlayerAPI.getCurrentlyPlaying(broadcaster_id);

  if (!currently_playing_song || !currently_playing_song.item || currently_playing_song.currently_playing_type !== "track") {
    return;
  }

  const track_details = currently_playing_song.item as TrackObjectFull;

  await twitchChat.sendMessage({
    message: `🎶 ${chatter_name} just played ${track_details.name} by ${track_details.artists.map((artist) => artist.name).join(", ")}!`,
    broadcaster_id: broadcaster_id,
    sender_id: chatter_id,
  });
}
