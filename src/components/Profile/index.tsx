import "./index.css";
import "primeicons/primeicons.css";
import { useState, useRef } from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

function Profile() {
  const [showImageOptions, setShowImageOptions] = useState(false);
  const user = JSON.parse(localStorage.getItem("cometchat_user") || "{}");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar);
  const userName = user?.name || "User Name";
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageIconClick = () => {
    setShowImageOptions((prev) => !prev);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // Replace with your preset

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        console.log("Image uploaded to Cloudinary:", data.secure_url);
        await CometChat.updateCurrentUserDetails({ avatar: data.secure_url });
        const updatedUser = { ...user, avatar: data.secure_url };
        localStorage.setItem("cometchat_user", JSON.stringify(updatedUser));
        setAvatarUrl(data.secure_url);
        window.dispatchEvent(new Event("userAvatarUpdated")); // custom event
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleCameraClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context?.drawImage(video, 0, 0);
          resolve(null);
        };
      });

      stream.getTracks().forEach((track) => track.stop());
      const dataUrl = canvas.toDataURL("image/png");
      const blob = await (await fetch(dataUrl)).blob();

      const formData = new FormData();
      formData.append("file", blob, "camera.png");
      formData.append("upload_preset", "ml_default");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        console.log("Image uploaded to Cloudinary:", data.secure_url);
        await CometChat.updateCurrentUserDetails({ avatar: data.secure_url });
        const updatedUser = { ...user, avatar: data.secure_url };
        localStorage.setItem("cometchat_user", JSON.stringify(updatedUser));
        setAvatarUrl(data.secure_url);
        window.dispatchEvent(new Event("userAvatarUpdated"));
      }
    } catch (error) {
      console.error("Error using camera:", error);
    }
  };

  const handleOptionClick = async (option: string) => {
    console.log("Selected:", option);
    setShowImageOptions(false);
    if (option === "upload" && fileInputRef.current) {
      fileInputRef.current.click();
    }
    if (option === "camera") {
      handleCameraClick();
    }
    if (option === "remove") {
      try {
        await CometChat.updateCurrentUserDetails({ avatar: "" });
        const updatedUser = { ...user, avatar: "" };
        localStorage.setItem("cometchat_user", JSON.stringify(updatedUser));
        setAvatarUrl("");
        window.dispatchEvent(new Event("userAvatarUpdated"));
      } catch (error) {
        console.error("Error removing avatar:", error);
      }
    }
  };

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <h1>Profile</h1>
      </div>

      {/* Profile Image Section */}
      <div className="profile-image-section">
        <div className="profile-image-container">
          <img src={avatarUrl} alt="Profile" className="profile-image" />
          <div className="image-overlay" onClick={handleImageIconClick}>
            <i className="pi pi-pencil edit-icon"></i>
            {showImageOptions && (
              <div className="profile-image-edit-options">
                <div
                  className="option"
                  onClick={() => handleOptionClick("camera")}
                >
                  <i className="pi pi-camera option-icon"></i> Camera
                </div>
                <div
                  className="option"
                  onClick={() => handleOptionClick("upload")}
                >
                  <i className="pi pi-upload option-icon"></i> Upload from
                  Device
                </div>
                <div
                  className="option"
                  onClick={() => handleOptionClick("remove")}
                >
                  <i className="pi pi-trash option-icon"></i> Remove Icon
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Name Section */}
      <div className="profile-info-section">
        <p className="info-label">Your name</p>
        <div className="info-content">
          <p className="info-value">{userName}</p>
          <i className="pi pi-pencil edit-icon"></i>
        </div>
      </div>
      <div className="empty-section">
        <p className="info-description">
          This is not your username or PIN. This name will be visible to your
          WhatsApp contacts.
        </p>
      </div>

      {/* About Section */}
      <div className="profile-info-section">
        <p className="info-label">About</p>
        <div className="info-content">
          <span className="info-value">{"Hey there! I'm using CometChat"}</span>
          <i className="pi pi-pencil edit-icon"></i>
        </div>
      </div>

      {/* Empty Space */}
      <div className="empty-space"></div>
    </div>
  );
}

export default Profile;
