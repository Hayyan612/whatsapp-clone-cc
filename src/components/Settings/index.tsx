import "./index.css";
import "primeicons/primeicons.css";
import { useState } from "react";
import ChatSettings from "../ChatSettings";
import Profile from "../Profile";
import NotificationSettings from "../NotificationSettings";

type SettingsProps = {
  onLogout: () => void;
  onWallpaperClick: (value: boolean) => void;
  onSelectWallpaper: (wallpaper: {
    id: string;
    color: string;
    label: string;
  }) => void;
  onToggleDoodle: (value: boolean) => void;
  selectedWallpaper: {
    id: string;
    color: string;
    label: string;
  };
  showDoodle: boolean;
};
const Settings: React.FC<SettingsProps> = ({
  onLogout,
  onWallpaperClick,
  onSelectWallpaper,
  onToggleDoodle,
  selectedWallpaper,
  showDoodle,
}) => {
  const [showChatSettings, setShowChatSettings] = useState(false);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] =
    useState(false);
  const toggleChatSettings = () => {
    setShowChatSettings((prev) => !prev);
  };
  const toggleProfileDetails = () => setShowProfileDetails((prev) => !prev);
  const toggleNotificationSettings = () => {
    setShowNotificationSettings((prev) => !prev);
  };

  const user = JSON.parse(localStorage.getItem("cometchat_user") || "{}");
  const name = user.name || "Guest";
  const avatar = user.avatar || "/api/placeholder/120/120";

  if (showChatSettings) {
    return (
      <ChatSettings
        onBack={toggleChatSettings}
        onSelectWallpaper={onSelectWallpaper}
        onToggleDoodle={onToggleDoodle}
        selectedWallpaper={selectedWallpaper}
        showDoodle={showDoodle}
        onWallpaperClick={onWallpaperClick}
      />
    );
  }
  if (showProfileDetails) {
    return <Profile />;
  }
  if (showNotificationSettings) {
    return <NotificationSettings />;
  }
  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>

      {/* Search Bar */}
      <div className="search-settings">
        <i className="pi pi-search search-icon"></i>
        <input
          type="text"
          placeholder="Search settings"
          className="search-input"
        />
      </div>

      {/* User Profile */}
      <div className="user-profile" onClick={toggleProfileDetails}>
        <div className="settings-profile-image">
          <img src={avatar} alt="User profile" />
        </div>
        <div className="settings-profile-name">{name}</div>
      </div>

      {/* Settings Menu */}
      <div className="settings-menu">
        <div className="menu-item">
          <i className="pi pi-user"></i>
          <span>Account</span>
        </div>

        <div className="menu-item">
          <i className="pi pi-lock"></i>
          <span>Privacy</span>
        </div>

        <div className="menu-item" onClick={toggleChatSettings}>
          <i className="pi pi-comments"></i>
          <span>Chats</span>
        </div>

        <div className="menu-item" onClick={toggleNotificationSettings}>
          <i className="pi pi-bell"></i>
          <span>Notifications</span>
        </div>

        <div className="menu-item">
          <i className="pi pi-key"></i>
          <span>Keyboard shortcuts</span>
        </div>

        <div className="menu-item">
          <i className="pi pi-question-circle"></i>
          <span>Help</span>
        </div>

        <div className="menu-item logout" onClick={onLogout}>
          <i className="pi pi-sign-out"></i>
          <span>Log out</span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
