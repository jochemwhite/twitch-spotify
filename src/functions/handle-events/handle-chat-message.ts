import type { ChatMessageEvent } from "@/types/eventsub";
import HandleSkipCommand from "../handle-commands/handle-skip-command";
import HandleSongRequestCommand from "../handle-commands/handle-sr-command";
import HandleSongCommand from "../handle-commands/handle-song-command";
import { TwitchStreamAPI } from "@/classes/twitch/twitch-streams";
import { twitchChat } from "@/classes/twitch/twitch-chat";

export default async function HandleChatMessage({
  broadcaster_user_name,
  broadcaster_user_id,
  chatter_user_name,
  message,
  chatter_user_id,
}: ChatMessageEvent): Promise<void> {
  const { text } = message;
  console.log(`[${broadcaster_user_name}] ${chatter_user_name}: ${text}`);

  if (!text.startsWith("!")) return;

  const args = text.split(" ");
  const command = args.shift()?.substring(1);

  check if the broadcaster is live or not
  const stream = await TwitchStreamAPI.getStreams(broadcaster_user_id, "live");

  if (!stream || stream.data.length === 0) {
    await twitchChat.sendMessage({
      message: `🚫 ${broadcaster_user_name} is not currently streaming!`,
      broadcaster_id: broadcaster_user_id,
      sender_id: broadcaster_user_id,
    });
    return;
  }

  switch (command) {
    case "song":
      await HandleSongCommand({ broadcaster_id: broadcaster_user_id, chatter_id: chatter_user_id, chatter_name: chatter_user_name });
      break;

    case "skip":
      // check if the chatter is a mod
      
      if(chatter_user_id !== broadcaster_user_id) {

        return;
      }


      await HandleSkipCommand({ broadcaster_id: broadcaster_user_id, chatter_id: chatter_user_id, chatter_name: chatter_user_name });
      break;

    case "sr":
      await HandleSongRequestCommand({
        broadcaster_id: broadcaster_user_id,
        chatter_id: chatter_user_id,
        chatter_name: chatter_user_name,
        requested_song: args.join(" "),
      });
      break;
    default:
      break;
  }
}
