import { useState, useEffect } from "react";
import { CometChatGroupMembers } from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import "./index.css";

type GroupInfoProps = {
  groupChat: CometChat.Group;
  onBack: () => void;
  onAddMemberClick: () => void;
};

function GroupInfo({ groupChat, onBack, onAddMemberClick }: GroupInfoProps) {
  const [group, setGroup] = useState<CometChat.Group | null>(groupChat);
  const [memberCount, setMemberCount] = useState<number>(0);
  const [ownerName, setOwnerName] = useState<string>("");
  const [isAdminOrOwner, setIsAdminOrOwner] = useState(false);

  useEffect(() => {
    setGroup(groupChat);
    setMemberCount(groupChat.getMembersCount());
    CometChat.getUser(groupChat.getOwner())
      .then((user) => setOwnerName(user.getName()))
      .catch(() => setOwnerName(groupChat.getOwner()));

    const checkUserRole = async () => {
      const loggedInUser = await CometChat.getLoggedinUser();
      if (loggedInUser) {
        const userUid = loggedInUser.getUid();
        const groupOwner = groupChat.getOwner();
        if (userUid === groupOwner) {
          setIsAdminOrOwner(true);
        } else {
          const groupMembersRequest = new CometChat.GroupMembersRequestBuilder(
            groupChat.getGuid()
          )
            .setLimit(100)
            .build();
          const members = await groupMembersRequest.fetchNext();
          const member = members.filter((m) => m.getUid() === userUid)[0];
          if (
            member &&
            member.getScope() === CometChat.GROUP_MEMBER_SCOPE.ADMIN
          ) {
            setIsAdminOrOwner(true);
          }
        }
      }
    };

    checkUserRole();
  }, [groupChat]);

  const handleExitGroup = async () => {
    if (!group) return;
    try {
      await CometChat.leaveGroup(group.getGuid());
      alert("You have left the group.");
      onBack(); // Optionally redirect back
    } catch (error) {
      console.error("Error leaving group:", error);
      alert("Failed to leave the group.");
    }
  };

  const groupsHeader = () => {
    return (
      <div className="members-header-options">
        <div className="member-option" onClick={onAddMemberClick}>
          <i className="pi pi-user-plus option-icon"></i>
          Add member
        </div>
        <div className="member-option">
          <i className="pi pi-link option-icon"></i>
          Invite via link
        </div>
      </div>
    );
  };

  return (
    <div className="group-info-container">
      {/* Header */}
      <div className="group-header">
        <button className="close-button" onClick={onBack}>
          <i className="pi pi-times"></i>
        </button>
        <h1>Group info</h1>
      </div>

      {group && (
        <>
          {/* Group Image Section */}
          <div className="group-image-section">
            <div className="group-image-container">
              <img
                src={group.getIcon() || ""}
                alt="Group"
                className="group-image"
              />
              <div className="image-overlay">
                <i className="pi pi-camera camera-icon"></i>
              </div>
            </div>
            <div className="group-name-container">
              <h2 className="group-name">{group.getName()}</h2>
              <i className="pi pi-pencil edit-icon"></i>
            </div>
            <p className="group-created">Group created by {ownerName}</p>
          </div>

          {/* Group Description */}
          <div className="info-section">
            <p className="info-text">Group description</p>
            <div className="description-container">
              <span className="description-text">
                {group.getDescription() || "No description added"}
              </span>
              <i className="pi pi-pencil edit-icon"></i>
            </div>
          </div>

          {/* Media, Links, Docs Section */}
          <div className="info-section">
            <div className="media-section">
              <div className="media-item">
                <i className="pi pi-images media-icon"></i>
                <span>Media, links, and docs</span>
              </div>
              <i className="pi pi-chevron-right chevron-icon"></i>
            </div>
          </div>

          {/* Mute Notifications */}
          <div className="info-section">
            <div className="setting-item">
              <div className="setting-left">
                <i className="pi pi-volume-off setting-icon"></i>
                <span>Mute notifications</span>
              </div>
              <div className="toggle-switch"></div>
            </div>
          </div>

          {/* Disappearing Messages */}
          <div className="info-section">
            <div className="setting-item">
              <div className="setting-left">
                <i className="pi pi-clock setting-icon"></i>
                <span>Disappearing messages</span>
              </div>
              <div className="setting-right">
                <span className="setting-status">Off</span>
                <i className="pi pi-chevron-right chevron-icon"></i>
              </div>
            </div>
          </div>

          {/* Group Settings */}
          <div className="info-section">
            <div className="setting-item">
              <div className="setting-left">
                <i className="pi pi-cog setting-icon"></i>
                <span>Group settings</span>
              </div>
              <i className="pi pi-chevron-right chevron-icon"></i>
            </div>
          </div>

          {/* Members Section */}
          <div className="members-section">
            <div className="members-header">
              <span className="members-count">{memberCount} members</span>
            </div>

            {/* CometChatGroupMembers component */}
            <div className="member-list-wrapper">
              <CometChatGroupMembers
                group={group}
                headerView={isAdminOrOwner ? groupsHeader() : undefined}
                hideSearch={true}
              />
            </div>
          </div>

          {/* Exit Group */}
          <div className="danger-section">
            <div className="danger-item" onClick={handleExitGroup}>
              <i className="pi pi-sign-out danger-icon"></i>
              <span className="danger-text">Exit group</span>
            </div>
          </div>

          {/* Report Group */}
          <div className="danger-section">
            <div className="danger-item">
              <i className="pi pi-exclamation-triangle danger-icon"></i>
              <span className="danger-text">Report group</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default GroupInfo;
