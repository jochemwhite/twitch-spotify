import { TwitchAuthAPI } from "@/classes/twitch/twitch-auth";
import { TwitchUsersAPI } from "@/classes/twitch/twitch-users";
import checkTwitchSubscriptions from "@/functions/check-missing-subs";
import { twitch_redirect, twitch_scopes } from "@/lib/const";
import { env } from "@/lib/env";
import { InsertTwitchUser } from "@/queries/twitch-users";
import Elysia, { redirect } from "elysia";

export const TwitchController = new Elysia({ prefix: "/twitch" });

TwitchController.get("/login", () => {
  const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${env.TWITCH_CLIENT_ID}&scope=${twitch_scopes.join(
    " "
  )}&response_type=code&redirect_uri=${twitch_redirect}`;

  return redirect(twitchAuthUrl, 302);
});

TwitchController.get("/callback", async ({ query, set }) => {
  const { code } = query;

  if (!code) {
    return "No code";
  }

  const res = await TwitchAuthAPI.getAccessToken(code);
  const user = await TwitchUsersAPI.getTwitchUsers(res.access_token);

  await InsertTwitchUser({
    channel_id: user.data[0].id,
    username: user.data[0].login,
    access_token: res.access_token,
    refresh_token: res.refresh_token,
  });

  // check for missing events subscriptions
  try {
    await checkTwitchSubscriptions(user.data[0].id);
  } catch (error) {
    console.log(error);

    set.status = 500;
    return "failed to check or update subscriptions";
  }

  return "Callback";
});
