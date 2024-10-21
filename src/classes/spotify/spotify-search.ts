import { SpotifyAPI } from "@/axios/spotify-api";
import type { SearchResponse } from "@/types/spotify-web-api";
import { AxiosError } from "axios";

class spotifySearch {
  constructor() {}

  async SearchTrack(query: string, broadcaster_id: string) {
    try {
      const res = await SpotifyAPI.get<SearchResponse>(`/search`, {
        params: {
          q: query,
          type: "track",
        },
        broadcaster_id,
      });
      return res.data;
    } catch (error) {
        if(error instanceof AxiosError){ 
          console.log(error.response?.data);
          
        }
      
    }
  }
}

const SpotifySearchAPI = new spotifySearch();
export default SpotifySearchAPI;
