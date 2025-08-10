import "./index.css";
import "primeicons/primeicons.css";
import { useState } from "react";
type WallpaperSettingsProps = {
  onSelectWallpaper: (wallpaper: {
    id: string;
    color: string;
    label: string;
  }) => void;
  onBack: () => void;
  onToggleDoodle: (value: boolean) => void;
  currentWallpaper?: {
    id: string;
    color: string;
    label: string;
  };
  hasDoodle?: boolean;
};
const WallpaperSettings: React.FC<WallpaperSettingsProps> = ({
  onBack,
  onSelectWallpaper,
  onToggleDoodle,
  currentWallpaper,
  hasDoodle,
}) => {
  const [selectedWallpaper, setSelectedWallpaper] = useState(
    currentWallpaper?.id || "default"
  );
  const [showDoodles, setShowDoodles] = useState<boolean>(hasDoodle ?? true);

  const wallpaperColors = [
    { id: "default", color: "#e6ddd4", label: "Default" },
    { id: "light-teal", color: "#c5e4e7", label: "Light Teal" },
    { id: "light-green", color: "#c5e7d0", label: "Light Green" },
    { id: "medium-green", color: "#9ed4a4", label: "Dark Green" },
    { id: "light-blue", color: "#cfd9e7", label: "Light Blue" },
    { id: "teal", color: "#8dd3c8", label: "Teal" },
    { id: "blue-green", color: "#79c2c7", label: "Blue Green" },
    { id: "lavender", color: "#d0cee2", label: "Lavender" },
    { id: "light-gray", color: "#d6d6d6", label: "Light Gray" },
    { id: "light-sage", color: "#d5dbc6", label: "Gray" },
    { id: "light-yellow", color: "#e4e4b0", label: "Yellow" },
    { id: "pale-yellow", color: "#f5eba9", label: "Light Yellow" },
    { id: "peach", color: "#f6d0a0", label: "Peach" },
    { id: "pink", color: "#f1a9a8", label: "Pink" },
    { id: "coral", color: "#ee7e77", label: "Coral" },
    { id: "bright-pink", color: "#eb5160", label: "Bright Pink" },
    { id: "burgundy", color: "#89303c", label: "Burgundy" },
    { id: "terracotta", color: "#cb7057", label: "Terracotta" },
    { id: "dark-brown", color: "#5d4a41", label: "Dark Brown" },
    { id: "teal-green", color: "#3b6963", label: "Teal Green" },
    { id: "blue", color: "#3a7ca8", label: "Blue" },
  ];

  const handleWallpaperSelect = (id: string) => {
    setSelectedWallpaper(id);
    if (onSelectWallpaper) {
      const selectedColor = wallpaperColors.find(
        (wallpaper) => wallpaper.id === id
      );
      onSelectWallpaper(
        selectedColor || { id: "default", color: "#e6ddd4", label: "Default" }
      );
    }
  };

  const toggleDoodles = () => {
    const newValue = !showDoodles;
    setShowDoodles(newValue);
    onToggleDoodle(newValue);
  };

  return (
    <div className="wallpaper-settings">
      <div className="wallpaper-header">
        <button className="back-button" onClick={onBack}>
          <i className="pi pi-arrow-left"></i>
        </button>
        <h2 className="wallpaper-settings-title">Set chat wallpaper</h2>
      </div>

      <div className="wallpaper-options">
        <div className="doodles-option">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={showDoodles}
              onChange={toggleDoodles}
            />
            <span className="checkmark">
              <i className="pi pi-check"></i>
            </span>
            <span className="checkbox-label">Add WhatsApp doodles</span>
          </label>
        </div>

        <div className="color-grid">
          {wallpaperColors.map((wallpaper) => (
            <div
              key={wallpaper.id}
              className={`color-option ${
                selectedWallpaper === wallpaper.id ? "selected" : ""
              } `}
              style={{ backgroundColor: wallpaper.color }}
              onClick={() => handleWallpaperSelect(wallpaper.id)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WallpaperSettings;
