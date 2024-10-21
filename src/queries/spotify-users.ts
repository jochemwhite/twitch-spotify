import { db } from "@/db/";
import { SpotifyUsers } from "../db/schema";
import { eq } from "drizzle-orm";

export async function InsertSpotifyUser({
  user_id,
  channel_id,
  username,
  access_token,
  refresh_token,
}: {
  user_id: string;
  channel_id: string;
  username: string;
  access_token: string;
  refresh_token: string;
}) {
  const res = await db
    .insert(SpotifyUsers)
    .values({
      user_id,
      channel_id,
      username,
      access_token,
      refresh_token,
    })
    .returning();
  return res;
}

// get the user access token based on the channel id
export async function getSpotifyUserAccessToken(channel_id: string): Promise<string> {
  const res = await db
    .select({
      access_token: SpotifyUsers.access_token,
    })
    .from(SpotifyUsers)
    .where(eq(SpotifyUsers.channel_id, channel_id))
    .limit(1);

  return res[0].access_token;
}


// get the user refresh token based on the channel id
export async function getSpotifyUserRefreshToken(channel_id: string): Promise<string> {
  const res = await db
    .select({
      refresh_token: SpotifyUsers.refresh_token,
    })
    .from(SpotifyUsers)
    .where(eq(SpotifyUsers.channel_id, channel_id))
    .limit(1);

  return res[0].refresh_token;
}

// update the user access tokens based on the channel id
export async function updateSpotifyUserToken(channel_id: string, tokens: { access_token: string; refresh_token: string }) {
  await db
    .update(SpotifyUsers)
    .set(tokens)
    .where(eq(SpotifyUsers.channel_id, channel_id));
}