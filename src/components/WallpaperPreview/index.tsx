import "./index.css";

type WallpaperPreviewProps = {
  wallpaper: {
    id: string;
    color: string;
    label: string;
  };
  showDoodles: boolean;
};
const WallpaperPreview: React.FC<WallpaperPreviewProps> = ({
  wallpaper,
  showDoodles,
}) => {
  const backgroundColor = wallpaper.color;

  // This will generate a pattern similar to WhatsApp doodles if enabled
  const getDoodleClass = () => {
    return showDoodles ? "show-doodles" : "";
  };

  return (
    <div className="wallpaper-preview-container">
      <h2 className="preview-title">Wallpaper preview</h2>
      <div
        className={`preview-area ${getDoodleClass()}`}
        style={{
          backgroundColor,
        }}
      ></div>
    </div>
  );
};

export default WallpaperPreview;
