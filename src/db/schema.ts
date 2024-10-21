import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const TwitchUsers = pgTable("twitch_users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  channel_id: varchar({ length: 255 }).notNull().unique(),
  username: varchar({ length: 255 }).notNull(),
  access_token: varchar({ length: 255 }).notNull(),
  refresh_token: varchar({ length: 255 }).notNull(),
});

export const SpotifyUsers = pgTable("spotify_users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: varchar({ length: 255 }).notNull().unique(),
  channel_id: varchar({ length: 255 }).notNull().unique(),
  username: varchar({ length: 255 }).notNull(),
  access_token: varchar({ length: 255 }).notNull(),
  refresh_token: varchar({ length: 255 }).notNull(),
});