import { useEffect, useState } from "react";
import "./index.css";
import "primeicons/primeicons.css";
import aiIcon from "../../assets/ai.png";
import { CometChat } from "@cometchat/chat-sdk-javascript";

type SidebarProps = {
  onToggleProfile: () => void;
  onToggleChat: () => void;
  onToggleGroup: () => void;
  onToggleSettings: () => void;
  onChatClick: CometChat.Conversation | CometChat.User | CometChat.Group | null;
  onToggleAI: () => void;
  onToggleCalls: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  onToggleProfile,
  onToggleChat,
  onToggleGroup,
  onToggleSettings,
  onChatClick,
  onToggleAI,
  onToggleCalls,
}) => {
  const [activeIcon, setActiveIcon] = useState<string>("messages");
  const user = JSON.parse(localStorage.getItem("cometchat_user") || "{}");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar);
  const [unreadMessagesAll, setUnreadMessagesAll] = useState<number>(0);
  const [unreadMessagesGroup, setUnreadMessagesGroup] = useState<number>(0);

  const fetchUnreadCounts = async () => {
    try {
      const unreadMessages = (await CometChat.getUnreadMessageCount()) as {
        users?: Record<string, number>;
        groups?: Record<string, number>;
      };
      const unreadGroups = await CometChat.getUnreadMessageCountForAllGroups();

      const userCount = unreadMessages?.users
        ? Object.keys(unreadMessages.users).length
        : 0;

      const groupCount = unreadGroups ? Object.keys(unreadGroups).length : 0;

      setUnreadMessagesAll(userCount + groupCount);
      setUnreadMessagesGroup(groupCount);
    } catch (error) {
      console.error("Error fetching unread counts:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCounts();
  }, [onChatClick]);

  useEffect(() => {
    const listenerId = "UNREAD_MESSAGE_LISTENER";

    CometChat.addMessageListener(
      listenerId,
      new CometChat.MessageListener({
        onTextMessageReceived: fetchUnreadCounts,
        onMediaMessageReceived: fetchUnreadCounts,
        onCustomMessageReceived: fetchUnreadCounts,
        onMessageRead: fetchUnreadCounts,
        onMessageDelivered: fetchUnreadCounts,
        onMessageSent: fetchUnreadCounts,
      })
    );

    return () => {
      CometChat.removeMessageListener(listenerId);
    };
  }, []);

  useEffect(() => {
    const updateAvatar = () => {
      const updatedUser = JSON.parse(
        localStorage.getItem("cometchat_user") || "{}"
      );
      setAvatarUrl(updatedUser?.avatar);
    };

    window.addEventListener("userAvatarUpdated", updateAvatar);
    return () => {
      window.removeEventListener("userAvatarUpdated", updateAvatar);
    };
  }, []);

  const handleIconClick = (iconName: string) => {
    if (iconName === "userIcon") {
      onToggleProfile();
    }
    if (iconName === "messages") {
      onToggleChat();
    }
    if (iconName === "group") {
      onToggleGroup();
    }
    setActiveIcon(iconName);

    if (iconName === "settings") {
      onToggleSettings();
    }
    if (iconName === "ai") {
      onToggleAI();
    }
    if (iconName === "calls") {
      onToggleCalls();
    }
  };

  return (
    <div className="sidebar">
      <div className="topSection">
        <div
          className={`iconWrapper ${activeIcon === "messages" ? "active" : ""}`}
          onClick={() => handleIconClick("messages")}
        >
          <i className="pi pi-comments icon"></i>
          <span className="tooltip">Chats</span>
          {unreadMessagesAll > 0 && (
            <span className="badge">{unreadMessagesAll}</span>
          )}
        </div>
        <div
          className={`iconWrapper ${activeIcon === "group" ? "active" : ""}`}
          onClick={() => handleIconClick("group")}
        >
          <i className="pi pi-users icon"></i>
          <span className="tooltip">Groups</span>
          {unreadMessagesGroup > 0 && (
            <span className="badge">{unreadMessagesGroup}</span>
          )}
        </div>
        <div
          className={`iconWrapper ${activeIcon === "calls" ? "active" : ""}`}
          onClick={() => handleIconClick("calls")}
        >
          <i className="pi pi-phone icon"></i>
          <span className="tooltip">Calls</span>
        </div>

        <div
          className={`iconWrapper ${activeIcon === "ai" ? "active" : ""}`}
          onClick={() => handleIconClick("ai")}
        >
          <div className="aiIconContainer">
            <img src={aiIcon} alt="AI" className="aiIcon" />
          </div>
          <span className="tooltip">AI</span>
        </div>
      </div>

      <div className="bottomSection">
        <div
          className={`iconWrapper ${activeIcon === "settings" ? "active" : ""}`}
          onClick={() => handleIconClick("settings")}
        >
          <i className="pi pi-cog icon"></i>
          <span className="tooltip">Settings</span>
        </div>

        <div
          className={`avatarWrapper ${
            activeIcon === "userIcon" ? "activeIcon" : ""
          }`}
          onClick={() => handleIconClick("userIcon")}
        >
          <img key={avatarUrl} src={avatarUrl} alt="User-Icon" />
          <span className="tooltip">Profile</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
