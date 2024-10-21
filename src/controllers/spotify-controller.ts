import { SpotifyAuthAPI } from "@/classes/spotify/spotify-auth";
import { SpotifyUserAPI } from "@/classes/spotify/spotify-user";
import { spotify_redirect, spotify_scopes } from "@/lib/const";
import { env } from "@/lib/env";
import { InsertSpotifyUser } from "@/queries/spotify-users";
import Elysia, { redirect } from "elysia";

export const SpotifyContoller = new Elysia({ prefix: "/spotify" });

SpotifyContoller.get("/login", () => {
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${
    env.SPOTIFY_CLIENT_ID
  }&response_type=code&redirect_uri=${spotify_redirect}&scope=${spotify_scopes.join(" ")}`;

  return redirect(spotifyAuthUrl, 302);
});

SpotifyContoller.get("/callback", async ({ query, set }) => {
  const { code } = query;

  if (!code) {
    console.error("No code");
    return "No code";
  }

  const spotifyTokens = await SpotifyAuthAPI.getTokens(code);

  if (!spotifyTokens) {
    console.error("No access token");
    return "No access token";
  }

  const spotifyUser = await SpotifyUserAPI.getSpotifyUser(spotifyTokens.access_token);

  if (!spotifyUser) {
    console.error("No user");
    return "No user";
  }

  try {
    await InsertSpotifyUser({
      access_token: spotifyTokens.access_token,
      refresh_token: spotifyTokens.refresh_token,
      channel_id: "1234",
      user_id: spotifyUser.id,
      username: spotifyUser.display_name!,
    });
  } catch (error) {
    console.error(error);
  }
});
