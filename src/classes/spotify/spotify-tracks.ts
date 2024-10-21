import { SpotifyAPI } from "@/axios/spotify-api";
import type { SingleTrackResponse } from "@/types/spotify-web-api";

class spotifyTracks {
  constructor() {}

  async getTrackInfo(trackID: string, broadcaster_id: string) {
    try {
      const res = await SpotifyAPI.get<SingleTrackResponse>(`/tracks/${trackID}` , {
        broadcaster_id: broadcaster_id,
      });

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
}

const SpotifyTracksAPI = new spotifyTracks();
export default SpotifyTracksAPI;
