// NotificationMuteDialog.tsx
import React, { useState, useEffect } from "react";
import "./index.css";
import "primeicons/primeicons.css";
import { CometChat } from "@cometchat/chat-sdk-javascript";

interface MuteOverlayProps {
  isGroup: boolean;
  muteChat: string;
  onClose: () => void;
}

const MuteOverlay: React.FC<MuteOverlayProps> = ({
  isGroup,
  muteChat,
  onClose,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<string>("8hours");
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    CometChat.callExtension("push-notification", "GET", "v2/user-settings")
      .then((response) => {
        console.log("fetched user settings for mute:", response);
        const responseData = response as { "user-settings": { chat: { muted_uids: string[] } } };
        if (responseData["user-settings"]?.["chat"]?.["muted_uids"]) {
          console.log("1:", responseData["user-settings"]["chat"]["muted_uids"]);
          // Check if current chat is muted
          const mutedUids = responseData["user-settings"]["chat"]["muted_uids"];
          setIsMuted(mutedUids.includes(muteChat));
        }
      })
      .catch((error) => {
        console.log("Error fetching mute settings", error);
      });
  }, [isGroup, muteChat]);

  const handleMute = () => {
    let timeInMS = 0;
    const now = Date.now();

    switch (selectedDuration) {
      case "8hours":
        timeInMS = now + 8 * 60 * 60 * 1000;
        break;
      case "1week":
        timeInMS = now + 7 * 24 * 60 * 60 * 1000;
        break;
      case "always":
        timeInMS = 4102444800 * 1000; // Already in ms
        break;
    }

    const payload = isGroup
      ? { guids: [muteChat], timeInMS: timeInMS.toString() }
      : { uids: [muteChat], timeInMS: timeInMS.toString() };

    CometChat.callExtension(
      "push-notification",
      "POST",
      "v2/mute-chat",
      payload
    )
      .then(() => {
        console.log(`Notifications muted for ${selectedDuration}`);
        onClose();
      })
      .catch((error) => {
        // Error occured
        console.log(`------ ERROR MUTING NOTIFS ------ \n`, error);
      });
  };

  const handleUnmute = () => {
    const payload = isGroup ? { guids: [muteChat] } : { uids: [muteChat] };

    CometChat.callExtension(
      "push-notification",
      "POST",
      "v2/unmute-chat",
      payload
    )
      .then(() => {
        console.log(`Notifications unmuted`);
        onClose();
      })
      .catch((error) => {
        console.log("------ ERROR UNMUTING NOTIFS ------ \n", error);
      });
  };

  return (
    <div className="overlay">
      <div className="dialog-container">
        <div className="dialog-header">
          <h2>Mute notifications</h2>
        </div>

        <div className="dialog-content">
          <p>
            No one else in this chat will see that you muted it, and you will
            still be notified if you are mentioned.
          </p>

          <div className="options-container">
            <div
              className="option-item"
              onClick={() => setSelectedDuration("8hours")}
            >
              <div
                className={`radio-button ${
                  selectedDuration === "8hours" ? "selected" : ""
                }`}
              >
                {selectedDuration === "8hours" && (
                  <i className="pi pi-check-circle"></i>
                )}
              </div>
              <span>8 hours</span>
            </div>

            <div
              className="option-item"
              onClick={() => setSelectedDuration("1week")}
            >
              <div
                className={`radio-button ${
                  selectedDuration === "1week" ? "selected" : ""
                }`}
              >
                {selectedDuration === "1week" && (
                  <i className="pi pi-check-circle"></i>
                )}
              </div>
              <span>1 week</span>
            </div>

            <div
              className="option-item"
              onClick={() => setSelectedDuration("always")}
            >
              <div
                className={`radio-button ${
                  selectedDuration === "always" ? "selected" : ""
                }`}
              >
                {selectedDuration === "always" && (
                  <i className="pi pi-check-circle"></i>
                )}
              </div>
              <span>Always</span>
            </div>
          </div>
        </div>

        <div className="dialog-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          {isMuted ? (
            <button className="mute-button" onClick={handleUnmute}>
              Unmute
            </button>
          ) : (
            <button className="mute-button" onClick={handleMute}>
              Mute
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MuteOverlay;
