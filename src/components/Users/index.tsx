import { CometChatUsers } from "@cometchat/chat-uikit-react";
import HeaderView from "./HeaderView";

interface UsersProps {
  onBack: () => void;
  onUserClick: (user: CometChat.User) => void;
}

const Users = ({ onBack, onUserClick }: UsersProps) => {
  const handleOnItemClick = (user: CometChat.User): void => {
    onUserClick(user);
  };

  const handleOnEmpty = (): void => {
    console.log("No users found.");
  };

  const handleOnError = (error: CometChat.CometChatException): void => {
    console.log("Error loading users:", error);
  };

  return (
    <div className="usersContainer">
      <div
        style={{
          height: "800px",
        }}
      >
        <CometChatUsers
          onItemClick={handleOnItemClick}
          onEmpty={handleOnEmpty}
          onError={handleOnError}
          headerView={<HeaderView onBack={onBack} />}
        />
      </div>
    </div>
  );
};

export default Users;
