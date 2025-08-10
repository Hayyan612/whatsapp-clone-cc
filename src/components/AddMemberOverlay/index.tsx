import React, { useState, useEffect } from "react";
import { CometChatUsers, SelectionMode } from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import "./index.css";

type AddMemberOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
};

const AddMemberOverlay: React.FC<AddMemberOverlayProps> = ({
  isOpen,
  onClose,
  groupId,
}) => {
  const [selectedContacts, setSelectedContacts] = useState<CometChat.User[]>(
    []
  );
  const [isAdding, setIsAdding] = useState(false);
  const [addingSuccess, setAddingSuccess] = useState(false);

  const AddMemberHeaderView = () => {
    return (
      <div className="add-member-overlay-header">
        <h3>Add member</h3>
        <div className="header-actions">
          <button className="close-btn" onClick={onClose}>
            <i className="pi pi-times"></i>
          </button>
        </div>
      </div>
    );
  };
  // Clear selections when the overlay opens or closes
  useEffect(() => {
    if (isOpen) {
      setSelectedContacts([]);
      setAddingSuccess(false);
    }
  }, [isOpen]);

  // Handle selection changes from CometChatUsers
  const handleSelectionChange = (user: CometChat.User, selected: boolean) => {
    setSelectedContacts((prev) => {
      if (selected) {
        return [...prev, user];
      } else {
        return prev.filter((u) => u.getUid() !== user.getUid());
      }
    });
  };

  // Add selected members to the group
  const addMembersToGroup = async () => {
    if (selectedContacts.length === 0) return;

    setIsAdding(true);

    try {
      await addMembersToCometChatGroup(groupId, selectedContacts);

      setAddingSuccess(true);

      // Close the overlay after a short delay on success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error adding members:", error);
    } finally {
      setIsAdding(false);
    }
  };

  // Function to add members to CometChat group
  const addMembersToCometChatGroup = async (
    groupId: string,
    members: CometChat.User[]
  ): Promise<boolean> => {
    // Attempt to unban all selected users
    await Promise.all(
      members.map(async (user) => {
        try {
          await CometChat.unbanGroupMember(groupId, user.getUid());
        } catch (error) {
          console.warn(`User ${user.getUid()} might not be banned.`, error);
        }
      })
    );

    const memberList = members.map(
      (user) =>
        new CometChat.GroupMember(
          user.getUid(),
          CometChat.GROUP_MEMBER_SCOPE.PARTICIPANT
        )
    );

    await CometChat.addMembersToGroup(groupId, memberList, []);
    return true;
  };

  if (!isOpen) return null;

  return (
    <div className="add-member-overlay-container">
      <div className="add-member-overlay-content">
        {/* CometChatUsers Component will handle the user list and selection */}
        <div className="add-member-users">
          <CometChatUsers
            selectionMode={SelectionMode.multiple}
            onSelect={handleSelectionChange}
            headerView={AddMemberHeaderView()}
          />
        </div>

        {/* Add members confirmation button */}
        <div className="action-footer">
          <button
            className={`add-button ${
              selectedContacts.length === 0 ? "disabled" : ""
            } ${isAdding ? "loading" : ""} ${addingSuccess ? "success" : ""}`}
            onClick={addMembersToGroup}
            disabled={
              selectedContacts.length === 0 || isAdding || addingSuccess
            }
          >
            {isAdding ? (
              <i className="pi pi-spinner pi-spin"></i>
            ) : addingSuccess ? (
              <i className="pi pi-check"></i>
            ) : (
              <>
                <span>
                  Add{" "}
                  {selectedContacts.length > 0
                    ? `(${selectedContacts.length})`
                    : ""}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberOverlay;
