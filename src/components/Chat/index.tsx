import {
  CometChatMessageHeader,
  CometChatMessageComposer,
  CometChatMessageList,
  CometChatUIKit,
  CometChatMessageComposerAction,
  CometChatMessageTemplate,
  CometChatUIKitConstants,
} from "@cometchat/chat-uikit-react";
import "./index.css";
import "primeicons/primeicons.css";
import whatsappmac from "../../assets/whatsapp-mac.png";
import { CometChat } from "@cometchat/chat-sdk-javascript";

export const locationMessageTemplate = new CometChatMessageTemplate({
  type: "location",
  category: CometChatUIKitConstants.MessageCategory.custom,
  bubbleView: (message: CometChat.BaseMessage) => {
    const customMessage = message as CometChat.CustomMessage;
    const latitude = customMessage.getData().customData.latitude;
    const longitude = customMessage.getData().customData.longitude;
    const label = customMessage.getData().customData.label;

    if (!latitude || !longitude) {
      return <div>Invalid location</div>;
    }

    const radarStaticMapUrl = `https://api.radar.io/v1/static/images/map?center=${latitude},${longitude}&zoom=15&width=300&height=150&markers=${latitude},${longitude}&radar=${
      import.meta.env.VITE_RADAR_API_KEY
    }`;

    return (
      <div style={{ padding: 10, borderRadius: 8, background: "#f0f0f0" }}>
        <a
          href={`https://www.google.com/maps?q=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={radarStaticMapUrl}
            alt="Location Preview"
            style={{ width: "100%", borderRadius: 4 }}
          />
          <div style={{ marginTop: 4 }}>{label || "Shared Location"}</div>
        </a>
      </div>
    );
  },
});

interface ChatProps {
  selectedChat:
    | CometChat.Conversation
    | CometChat.User
    | CometChat.Group
    | null;
  onBack?: () => void;
  onChatInfoClick?: () => void;
  setGroupId: (groupId: string) => void;
  onMessageReplyClick: (msg: CometChat.BaseMessage) => void;
}

const Chat: React.FC<ChatProps> = ({
  selectedChat,
  onBack,
  onChatInfoClick,
  setGroupId,
  onMessageReplyClick,
}) => {
  const isChatSelected = selectedChat;
  let userOrGroup: string = "";
  let chatUser: CometChat.User | undefined = undefined;
  let chatGroup: CometChat.Group | undefined = undefined;

  if (isChatSelected instanceof CometChat.Conversation) {
    const conversationType = isChatSelected.getConversationType();
    const conversationWith = isChatSelected.getConversationWith();

    if (conversationType === CometChat.RECEIVER_TYPE.USER) {
      chatUser = conversationWith as CometChat.User;
      userOrGroup = chatUser.getUid();
    } else if (conversationType === CometChat.RECEIVER_TYPE.GROUP) {
      chatGroup = conversationWith as CometChat.Group;
      userOrGroup = chatGroup.getGuid();
      setGroupId(chatGroup.getGuid());
    }
  } else {
    if (isChatSelected instanceof CometChat.User) {
      chatUser = isChatSelected;
      userOrGroup = chatUser.getUid();

      chatGroup = undefined;
    } else if (isChatSelected instanceof CometChat.Group) {
      chatGroup = isChatSelected;
      userOrGroup = chatGroup.getGuid();
      setGroupId(chatGroup.getGuid());
      chatUser = undefined;
    }
  }

  const defaultOptions = CometChatUIKit.getDataSource().getAttachmentOptions({
    parentMessageId: null,
    user: userOrGroup || null,
    group: userOrGroup || null,
  });
  const customOptions = () => {
    return [
      ...defaultOptions,
      new CometChatMessageComposerAction({
        id: "location",
        title: "Location",
        iconURL:
          "https://img.icons8.com/?size=20&id=7880&format=png&color=000000",
        onClick: () => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;

              const metadata = {
                latitude,
                longitude,
                label: "Shared Location", // or use a reverse geocoder API for an address
              };

              const receiverID = userOrGroup;
              const receiverType = chatUser
                ? CometChat.RECEIVER_TYPE.USER
                : CometChat.RECEIVER_TYPE.GROUP;

              const locationMessage = new CometChat.CustomMessage(
                receiverID,
                receiverType,
                "location",
                metadata
              );

              CometChatUIKit.sendCustomMessage(locationMessage)
                .then((message) => console.log("Location sent", message))
                .catch((err) => console.error("Error", err));
            },
            (error) => {
              console.error("Location error:", error);
            }
          );
        },
      }),
    ];
  };

  const UserDetailsButton = () => (
    <div>
      <button className="chat-info-button" onClick={onChatInfoClick}>
        <i className="pi pi-info-circle"></i>
      </button>
    </div>
  );

  const defaultMessageTemplate =
    CometChatUIKit.getDataSource().getAllMessageTemplates();
  const customMessageTemplate = () => {
    return [...defaultMessageTemplate, locationMessageTemplate];
  };
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {isChatSelected ? (
        <>
          <CometChatMessageHeader
            user={chatUser}
            group={chatGroup}
            hideBackButton={false}
            auxiliaryButtonView={UserDetailsButton()}
            hideVideoCallButton={false}
            onBack={onBack}
          />
          <CometChatMessageList
            user={chatUser}
            group={chatGroup}
            onThreadRepliesClick={onMessageReplyClick}
            templates={customMessageTemplate()}
          />
          <div className="message-composer">
            <CometChatMessageComposer
              user={chatUser}
              group={chatGroup}
              attachmentOptions={customOptions()}
            />
          </div>
        </>
      ) : (
        <div className="whatsapp-download-container">
          <img
            src={whatsappmac}
            alt="WhatsApp for Mac"
            className="whatsapp-image"
          />

          <div className="download-content">
            <h1>Download WhatsApp for Mac</h1>
            <p>
              Make calls and get a faster experience when you download the Mac
              app.
            </p>
            <button className="download-button">Get from App Store</button>
          </div>

          <div className="encryption-notice">
            <i className="pi pi-lock"></i>
            <span>Your personal messages are end-to-end encrypted</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
