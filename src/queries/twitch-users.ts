import { db } from "@/db";
import { TwitchUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function InsertTwitchUser({
  channel_id,
  username,
  access_token,
  refresh_token,
}: {
  channel_id: string;
  username: string;
  access_token: string;
  refresh_token: string;
}) {
  const res = await db
    .insert(TwitchUsers)
    .values({
      channel_id,
      username,
      access_token,
      refresh_token,
    })
    .returning();
  return res;
}

// get the broadcasters access token based on the channel id
export async function getTwitchUserAccessToken(broadcaster_id: string): Promise<string> {
  const res = await db
    .select({
      access_token: TwitchUsers.access_token,
    })
    .from(TwitchUsers)
    .where(eq(TwitchUsers.channel_id, broadcaster_id))
    .limit(1);

  return res[0].access_token;
}

// get the broadcasters refresh token based on the channel id
export async function getTwitchUserRefreshToken(broadcaster_id: string): Promise<string> {
  const res = await db
    .select({
      refresh_token: TwitchUsers.refresh_token,
    })
    .from(TwitchUsers)
    .where(eq(TwitchUsers.channel_id, broadcaster_id))
    .limit(1);

  return res[0].refresh_token;
}

// update the broadcasters access tokens based on the channel id
export async function updateTwitchUserTokens(broadcaster_id: string, tokens: { access_token: string; refresh_token: string }) {
  await db.update(TwitchUsers).set(tokens).where(eq(TwitchUsers.channel_id, broadcaster_id));
}
