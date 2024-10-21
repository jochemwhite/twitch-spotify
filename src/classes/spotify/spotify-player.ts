import { SpotifyAPI } from "@/axios/spotify-api";
import type { CurrentlyPlayingObject, TrackObjectFull } from "@/types/spotify-web-api";
import { t } from "elysia";

class spotifyPlayer {
  constructor() {}

  async getCurrentlyPlaying(broadcaster_id: string) {
    const res = await SpotifyAPI.get<CurrentlyPlayingObject>(`/me/player/currently-playing`, {
      broadcaster_id: broadcaster_id,
    });

    return res.data;
  }

  async skipSong(broadcaster_id: string) {
    const res = await SpotifyAPI.post(`/me/player/next`, null, {
      broadcaster_id: broadcaster_id,
    });
  }

  // add song to queue
  async addSongToQueue(broadcaster_id: string, track_id: string) {
    try {
      await SpotifyAPI.post(`/me/player/queue`, null, {
        params: {
          uri: `spotify:track:${track_id}`,
        },
        broadcaster_id: broadcaster_id,
      });
    } catch (error: any) {
      console.log(error.response.data);
      return error;
    }
  }
}

export const SpotifyPlayerAPI = new spotifyPlayer();
