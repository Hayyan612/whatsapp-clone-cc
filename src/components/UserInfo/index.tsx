import { useState, useEffect } from "react";
import "./index.css";

type UserInfoProps = {
  user: CometChat.User;
  onBack: () => void;
};

function UserInfo({ user, onBack }: UserInfoProps) {
  const [userData, setUserData] = useState<CometChat.User | null>(user);
  const [status, setStatus] = useState<string>(user.getStatus());

  useEffect(() => {
    setUserData(user);
    setStatus(user.getStatus());
  }, [user]);

  return (
    <div className="user-info-container">
      {/* Header */}
      <div className="user-header">
        <button className="close-button" onClick={onBack}>
          <i className="pi pi-times"></i>
        </button>
        <p>User details</p>
      </div>

      {userData && (
        <>
          {/* User Image Section */}
          <div className="user-image-section">
            <div className="user-image-container">
              <img
                src={userData.getAvatar() || ""}
                alt={userData.getName()}
                className="user-image"
              />
              {status === "online" && (
                <div className="status-indicator online"></div>
              )}
            </div>
            <div className="user-name-container">
              <h2 className="user-name">{userData.getName()}</h2>
            </div>
            <p className="user-status">
              {status === "online" ? "Online" : "Last seen recently"}
            </p>
          </div>

          {/* About Section */}
          <div className="info-section">
            <p className="info-text">About</p>
            <div className="description-container">
              <span className="description-text">
                {userData.getStatusMessage() ||
                  "Hey there! I am using CometChat"}
              </span>
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

          {/* Encryption */}
          <div className="info-section">
            <div className="setting-item">
              <div className="setting-left">
                <i className="pi pi-lock setting-icon"></i>
                <span>Encryption</span>
              </div>
              <div className="setting-right">
                <span className="setting-status">
                  Messages and calls are end-to-end encrypted
                </span>
              </div>
            </div>
          </div>

          {/* Block User */}
          <div className="danger-section">
            <div className="danger-item">
              <i className="pi pi-ban danger-icon"></i>
              <span className="danger-text">Block</span>
            </div>
          </div>

          {/* Report User */}
          <div className="danger-section">
            <div className="danger-item">
              <i className="pi pi-exclamation-triangle danger-icon"></i>
              <span className="danger-text">Report User</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserInfo;
