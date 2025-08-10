import React, { useCallback, useEffect, useState } from "react";
import {
  CometChatThreadHeader,
  CometChatMessageList,
  CometChatMessageComposer,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import "./index.css";

type ThreadsProps = {
  parentMessage: CometChat.BaseMessage;
  parentMessageId: number;
  onBack: () => void;
  selectedChat:
    | CometChat.Conversation
    | CometChat.User
    | CometChat.Group
    | null;
};

const Threads: React.FC<ThreadsProps> = ({
  parentMessage,
  parentMessageId,
  onBack,
  selectedChat,
}) => {
  const [customMessageRequest, setCustomMessageRequest] =
    useState<CometChat.MessagesRequestBuilder>(
      new CometChat.MessagesRequestBuilder()
    );
  const isChatSelected = selectedChat;
  let chatUser: CometChat.User | undefined = undefined;
  let chatGroup: CometChat.Group | undefined = undefined;

  if (isChatSelected instanceof CometChat.Conversation) {
    const conversationType = isChatSelected.getConversationType();
    const conversationWith = isChatSelected.getConversationWith();

    if (conversationType === CometChat.RECEIVER_TYPE.USER) {
      chatUser = conversationWith as CometChat.User;
    } else if (conversationType === CometChat.RECEIVER_TYPE.GROUP) {
      chatGroup = conversationWith as CometChat.Group;
    }
  } else {
    if (isChatSelected instanceof CometChat.User) {
      chatUser = isChatSelected;
      chatGroup = undefined;
    } else if (isChatSelected instanceof CometChat.Group) {
      chatGroup = isChatSelected;
      chatUser = undefined;
    }
  }
  const reqBuilder = useCallback(() => {
    const builder = new CometChat.MessagesRequestBuilder()
      .hideReplies(false)
      .setParentMessageId(Number(parentMessage.getId()))
      .setLimit(10);
    setCustomMessageRequest(builder);
  }, [parentMessage]);

  useEffect(() => {
    reqBuilder();
  }, [reqBuilder]);
  console.log("chatUser", chatUser);
  console.log("chatGroup", chatGroup);
  return (
    <div className="threads-container">
      <CometChatThreadHeader parentMessage={parentMessage} onClose={onBack} />
      {customMessageRequest.parentMessageId == parentMessage.getId() && (
        <>
          <div className="thread-message-list">
            <CometChatMessageList
              messagesRequestBuilder={customMessageRequest}
              user={chatUser}
              group={chatGroup}
              parentMessageId={parentMessageId}
            />
          </div>
          <CometChatMessageComposer
            parentMessageId={parentMessageId}
            user={chatUser}
            group={chatGroup}
          />
        </>
      )}
    </div>
  );
};

export default Threads;
