import { z } from "zod";

const envSchema = z.object({
  // twitch
  TWITCH_CLIENT_ID: z.string(),
  TWITCH_SECRET: z.string(),
  TWITCH_APP_TOKEN: z.string(),
  TWITCH_CONDUIT_ID: z.string(),

  // spotify
  SPOTIFY_CLIENT_ID: z.string(),
  SPOTIFY_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
