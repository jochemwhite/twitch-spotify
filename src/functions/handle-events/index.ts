import HandleChatMessage from "./handle-chat-message";

interface HandleEventsTypes {
  "channel.chat.message": typeof HandleChatMessage;
  // custom_reward_update: typeof updateCustomReward;
}

export const HandleEvents: HandleEventsTypes = {
  "channel.chat.message": HandleChatMessage,
};
