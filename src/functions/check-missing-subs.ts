import type { GetEventSubSubscriptionsResponse } from "@/types/twitchAPI";
import axios from "axios";
import { env } from "@/lib/env";
import { TwitchEventSubscriptions } from "@/lib/const";

// check for missing twitch event subscriptions
export default async function checkTwitchSubscriptions(user_id: string): Promise<void> {
  const res = await axios.get<GetEventSubSubscriptionsResponse>("https://api.twitch.tv/helix/eventsub/subscriptions", {
    params: {
      user_id: user_id,
    },
    headers: {
      Authorization: `Bearer ${env.TWITCH_APP_TOKEN}`,
      "Client-Id": env.TWITCH_CLIENT_ID,
    },
  });

  const subscriptions = TwitchEventSubscriptions(user_id);

  const missingSubs = subscriptions
    .map((sub) => sub.type)
    .filter((sub) => !res.data.data.some((data) => data.type === sub && data.transport.conduit_id === env.TWITCH_CONDUIT_ID));

  console.log(missingSubs);

  if (missingSubs.length > 0) {
    await Promise.all(
      missingSubs.map((sub) =>
        axios.post(
          "https://api.twitch.tv/helix/eventsub/subscriptions",
          {
            ...subscriptions.find((subscription) => subscription.type === sub),
            transport: {
              method: "conduit",
              conduit_id: env.TWITCH_CONDUIT_ID,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${env.TWITCH_APP_TOKEN}`,
              "Client-Id": env.TWITCH_CLIENT_ID,
            },
          }
        )
      )
    );
  }
}
