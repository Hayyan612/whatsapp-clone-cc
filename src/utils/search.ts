import { CometChat } from "@cometchat/chat-sdk-javascript";

/**
 * Fetch conversations (optionally filtered by name).
 * @param searchTerm The name to search for (optional).
 */
export const searchConversations = async (searchTerm: string = "") => {
  const limit = 50;
  const conversationsRequest = new CometChat.ConversationsRequestBuilder()
    .setLimit(limit)
    .build();

  try {
    const conversations = await conversationsRequest.fetchNext();

    if (searchTerm.trim() === "") {
      return conversations;
    }

    // Filter by user or group name (case-insensitive)
    const filtered = conversations.filter((conversation) => {
      const name = conversation.getConversationWith().getName();
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return filtered;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};
