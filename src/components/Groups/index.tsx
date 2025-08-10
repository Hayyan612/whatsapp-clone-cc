import { CometChatGroups } from "@cometchat/chat-uikit-react";
import "./index.css";
import HeaderView from "../HeaderView";

type GroupsProps = {
  onLogout: () => void;
  onToggleChats: () => void;
  onToggleGroups: () => void;
  onToggleUsers: () => void;
};

const Groups: React.FC<GroupsProps> = ({
  onLogout,
  onToggleUsers,
  onToggleChats,
  onToggleGroups,
}) => {
  const handleOnItemClick = (group: CometChat.Group): void => {
    console.log("Group clicked:", group);
  };

  const handleOnError = (error: CometChat.CometChatException): void => {
    console.log("Error loading groups:", error);
  };

  const onSearch = (search: string): void => {
    console.log("---- search triggered ---- ", search);
  };
  return (
    <div className="groups-container">
      <CometChatGroups
        hideSearch={true}
        headerView={
          <HeaderView
            onToggelUsers={onToggleUsers}
            onToggleChats={onToggleChats}
            onToggleGroups={onToggleGroups}
            onLogout={onLogout}
            onSearch={onSearch}
            activeTabString="groups"
          />
        }
        onItemClick={handleOnItemClick}
        onError={handleOnError}
      />
    </div>
  );
};

export default Groups;
