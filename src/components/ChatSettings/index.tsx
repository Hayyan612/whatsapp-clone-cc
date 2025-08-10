// This component assumes PrimeIcons CSS is imported in your index.css file
import "./index.css";
import "primeicons/primeicons.css";
import { useState } from "react";
import WallpaperSettings from "../WallpaperSettings";

type ChatSettingsProps = {
  onBack: () => void;
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
  onWallpaperClick: (value: boolean) => void;
};

const ChatSettings: React.FC<ChatSettingsProps> = ({
  onBack,
  onSelectWallpaper,
  onToggleDoodle,
  selectedWallpaper,
  showDoodle,
  onWallpaperClick,
}) => {
  const [showWallpaperSettings, setShowWallpaperSettings] = useState(false);

  if (showWallpaperSettings) {
    return (
      <WallpaperSettings
        onBack={() => {
          setShowWallpaperSettings(false);
          onWallpaperClick(false);
        }}
        onSelectWallpaper={onSelectWallpaper}
        onToggleDoodle={onToggleDoodle}
        currentWallpaper={selectedWallpaper}
        hasDoodle={showDoodle}
      />
    );
  }

  return (
    <div className="chat-settings-container">
      {/* Header */}
      <div className="chat-settings-header">
        <button className="back-button" onClick={onBack}>
          <i className="pi pi-arrow-left"></i>
        </button>
        <h1 className="header-title"> Chats </h1>
      </div>

      {/* Settings content */}
      <div className="settings-content">
        {/* Display section */}
        <div className="section-header">Display</div>

        <div className="settings-section">
          <div className="settings-item">
            <div className="item-content">
              <div className="item-title">Theme</div>
              <div className="item-subtitle">Light mode</div>
            </div>
            <i className="pi pi-chevron-right"></i>
          </div>

          <div
            className="settings-item"
            onClick={() => {
              setShowWallpaperSettings(true);
              onWallpaperClick(true);
            }}
          >
            <div className="item-content">
              <div className="item-title">Wallpaper</div>
              <div className="item-subtitle">{selectedWallpaper.label}</div>
            </div>
            <i className="pi pi-chevron-right"></i>
          </div>
        </div>

        {/* Chat settings section */}
        <div className="section-header">Chat settings</div>

        <div className="settings-section">
          <div className="settings-item">
            <div className="item-title">Media upload quality</div>
            <i className="pi pi-chevron-right"></i>
          </div>

          <div className="settings-item">
            <div className="item-title">Media auto-download</div>
            <i className="pi pi-chevron-right"></i>
          </div>
        </div>

        {/* Toggle options section */}
        <div className="settings-section">
          <div className="settings-item">
            <div className="item-content">
              <div className="item-title">Spell check</div>
              <div className="item-subtitle">Check spelling while typing</div>
            </div>
            <div className="toggle-checkbox active">
              <i className="pi pi-check"></i>
            </div>
          </div>

          <div className="settings-item">
            <div className="item-content">
              <div className="item-title">Replace text with emoji</div>
              <div className="item-subtitle">
                Emoji will replace specific text as you type
              </div>
            </div>
            <div className="toggle-checkbox active">
              <i className="pi pi-check"></i>
            </div>
          </div>

          <div className="settings-item">
            <div className="item-content">
              <div className="item-title">Enter is send</div>
              <div className="item-subtitle">
                Enter key will send your message
              </div>
            </div>
            <div className="toggle-checkbox active">
              <i className="pi pi-check"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSettings;
