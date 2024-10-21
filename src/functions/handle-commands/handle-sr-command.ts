import { SpotifyPlayerAPI } from "@/classes/spotify/spotify-player";
import SpotifySearchAPI from "@/classes/spotify/spotify-search";
import SpotifyTracksAPI from "@/classes/spotify/spotify-tracks";
import { twitchChat } from "@/classes/twitch/twitch-chat";
import type { TrackObjectFull } from "@/types/spotify-web-api";

interface SendChatMessageRequest {
  broadcaster_id: string;
  chatter_id: string;
  chatter_name: string;
  requested_song: string;
}

export default async function HandleSongRequestCommand({ broadcaster_id, chatter_id, chatter_name, requested_song }: SendChatMessageRequest) {
  const currently_playing_song = await SpotifyPlayerAPI.getCurrentlyPlaying(broadcaster_id);

  if (!currently_playing_song || !currently_playing_song.item || currently_playing_song.currently_playing_type !== "track") {
    return;
  }

  let song_id: string = "";
  let song_name: string = "";
  let song_artists: string = "";

  const spotifyTrackRegex = /(?:spotify:track:|https:\/\/open\.spotify\.com\/track\/)([a-zA-Z0-9]+)/;

  // Try to match the input against the regex
  const match = requested_song.match(spotifyTrackRegex);

  if (match) {
    song_id = match[1];

    const track_details = await SpotifyTracksAPI.getTrackInfo(song_id, broadcaster_id);

    if (!track_details) {
      await twitchChat.sendMessage({
        message: `🚫 ${chatter_name} couldn't find that song!`,
        broadcaster_id: broadcaster_id,
        sender_id: chatter_id,
      });
      return;
    }

    song_name = track_details.name;
    song_artists = track_details.artists.map((artist) => artist.name).join(", ");

    
  } else {
    const searchResult = await SpotifySearchAPI.SearchTrack(requested_song, broadcaster_id);

    if (searchResult && searchResult.tracks && searchResult.tracks.items.length > 0) {
      song_id = searchResult.tracks.items[0].id;
      song_name = searchResult.tracks.items[0].name;
      song_artists = searchResult.tracks.items[0].artists.map((artist) => artist.name).join(", ");
    }
  }

  if (!song_id) {
    await twitchChat.sendMessage({
      message: `🚫 ${chatter_name} couldn't find that song!`,
      broadcaster_id: broadcaster_id,
      sender_id: chatter_id,
    });
    return;
  } else {
    await SpotifyPlayerAPI.addSongToQueue(broadcaster_id, song_id);

    await twitchChat.sendMessage({
      message: `🎶 ${chatter_name} just added ${song_name} by ${song_artists} to the queue!`,
      broadcaster_id: broadcaster_id,
      sender_id: broadcaster_id,
    });
  }
}
