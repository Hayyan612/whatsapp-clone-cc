import "primeicons/primeicons.css";
import "./index.css";
import {
  CometChatConversations,
  CometChatOption,
} from "@cometchat/chat-uikit-react";
import HeaderView from "../HeaderView";
import { useState, useEffect } from "react"; // Add this if not already present
import { CometChat } from "@cometchat/chat-sdk-javascript";
import "primeicons/primeicons.css";
import MuteOverlay from "../MuteOverlay";

type ConversationsProps = {
  onToggleUsers: () => void;
  onToggleChats: () => void;
  onToggleGroups: () => void;
  onChatClick: (conversation: CometChat.Conversation) => void;
  onLogout: () => void;
};
const Conversations: React.FC<ConversationsProps> = ({
  onToggleUsers,
  onToggleChats,
  onToggleGroups,
  onChatClick,
  onLogout,
}) => {
  const [searchText, setSearchText] = useState("");
  const [conversationBuilder, setConversationBuilder] = useState(
    new CometChat.ConversationsRequestBuilder().setLimit(50)
  );
  const [showMuteOption, setShowMuteOption] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isGroup, setIsGroup] = useState(false);

  useEffect(() => {
    const builder = new CometChat.ConversationsRequestBuilder().setLimit(30);

    // The SDK doesn't support server-side search by name, so we manually filter after fetching
    if (searchText.trim()) {
      builder.setConversationType("user"); // Optional: limit to user conversations
    }

    setConversationBuilder(builder);
  }, [searchText]);

  const onSearch = (search: string) => {
    setSearchText(search);
  };

  const getOptions = (conversation: CometChat.Conversation) => {
    // Logic to get id of chat
    let chat: CometChat.Group | CometChat.User;
    let chatId: string;

    if (conversation.getConversationType() === CometChat.RECEIVER_TYPE.USER) {
      chat = conversation.getConversationWith() as CometChat.User;
      chatId = chat.getUid();
      setIsGroup(false);
    } else if (
      conversation.getConversationType() === CometChat.RECEIVER_TYPE.GROUP
    ) {
      chat = conversation.getConversationWith() as CometChat.Group;
      chatId = chat.getGuid();
      setIsGroup(true);
    }

    return [
      new CometChatOption({
        title: "Delete Conversation",
        id: "delete",
        iconURL: "g",
        onClick: () => {
          //
        },
      }),
      new CometChatOption({
        title: "Mute Notification",
        id: "mute",
        onClick: () => {
          setSelectedChatId(chatId);
          setShowMuteOption(true);
        },
      }),
      new CometChatOption({
        title: "Mark as Unread",
        id: "unread",
        onClick: () => {
          //
        },
      }),
      new CometChatOption({
        title: "Add to Favorites",
        id: "favorite",
        onClick: () => {
          //
        },
      }),
      new CometChatOption({
        title: "Block",
        id: "block",
        onClick: () => {
          //
        },
      }),
      new CometChatOption({
        title: "Delete chat",
        id: "deleteChat",
        onClick: () => {
          //
        },
      }),
    ];
  };

  return (
    <div className="conversationsContainer">
      <CometChatConversations
        conversationsRequestBuilder={conversationBuilder}
        options={getOptions}
        headerView={
          <HeaderView
            onToggelUsers={onToggleUsers}
            onToggleChats={onToggleChats}
            onToggleGroups={onToggleGroups}
            onLogout={onLogout}
            onSearch={onSearch}
            activeTabString="all"
          />
        }
        onItemClick={(chat) => {
          onChatClick(chat);
        }}
      />
      {/* Encryption Footer */}
      <div className="encryptionFooter">
        <i className="pi pi-lock"></i>
        <span className="encryptionText">
          Your personal messages are{" "}
          <span className="encryptionHighlight">end-to-end encrypted</span>
        </span>
      </div>
      {showMuteOption && selectedChatId && (
        <MuteOverlay
          isGroup={isGroup}
          muteChat={selectedChatId}
          onClose={() => {
            setShowMuteOption(false);
            setSelectedChatId(null);
          }}
        />
      )}
    </div>
  );
};

export default Conversations;
