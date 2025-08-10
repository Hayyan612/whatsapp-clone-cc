import React, { useState } from "react";
import "primeicons/primeicons.css";
import "./index.css"; // Import the CSS styles
import firebase from "../../firebaseConfig";
import {
  CometChatNotifications,
  CometChat,
  NotificationPreferences,
  MutePreferences,
  DNDOptions,
} from "@cometchat/chat-sdk-javascript";

interface NotificationSetting {
  id: string;
  title: string;
  description?: string;
  enabled: boolean;
}

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "message-notifications",
      title: "Message notifications",
      description: "Show notifications for new messages",
      enabled: true,
    },
    {
      id: "show-previews",
      title: "Show previews",
      enabled: true,
    },
    {
      id: "reaction-notifications",
      title: "Show reaction notifications",
      enabled: true,
    },
    {
      id: "background-sync",
      title: "Background sync",
      description:
        "Get faster performance by syncing messages in the background",
      enabled: false,
    },
    {
      id: "incoming-sounds",
      title: "Incoming sounds",
      description: "Play sounds for incoming messages",
      enabled: true,
    },
    {
      id: "outgoing-sounds",
      title: "Outgoing sounds",
      description: "Play sounds for outgoing messages",
      enabled: false,
    },
    {
      id: "push-notifications",
      title: "Push notifications",
      description: "Receive notifications even when the app is closed",
      enabled: false,
    },
    {
      id: "dnd",
      title: "DND",
      enabled: false,
    },
  ]);

  const toggleSetting = async (id: string) => {
    const updatedSettings = [...settings];
    const index = updatedSettings.findIndex((s) => s.id === id);
    if (index === -1) return;

    const setting = updatedSettings[index];
    const newEnabledState = !setting.enabled;

    const updateSettingState = (enabled: boolean) => {
      updatedSettings[index] = { ...setting, enabled };
      setSettings(updatedSettings);
    };

    const registerPushNotifications = async () => {
      try {
        const messaging = firebase.messaging();

        const currentPermission = Notification.permission;
        if (currentPermission === "denied") {
          alert(
            "Push notifications are blocked. Enable them in your browser settings."
          );
          return;
        }

        const permission =
          currentPermission === "granted"
            ? currentPermission
            : await Notification.requestPermission();

        if (permission !== "granted") {
          alert("Push notification permission not granted.");
          return;
        }

        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );
        const fcmToken = await messaging.getToken({
          vapidKey:
            "BIZdpyxOVdtsmrS5yYh5FmQMrCp74clzRDh87wRWo_VMJIGlV0fUloSYbb_Bc8TCTP54LL3xopZTRgd5vJbPVBY",
          serviceWorkerRegistration: registration,
        });

        if (!fcmToken) {
          alert("Failed to get FCM token.");
          return;
        }

        localStorage.setItem("fcmToken", fcmToken);

        if (CometChat.isInitialized()) {
          CometChatNotifications.registerPushToken(
            fcmToken,
            CometChatNotifications.PushPlatforms.FCM_WEB,
            "173866097745"
          );
          await updateSettingState(true);
          console.log("Push notifications enabled.");
          console.log("FCM Token:", fcmToken);
        } else {
          alert("Chat service not initialized.");
        }
      } catch (error) {
        console.error("Error registering push notifications:", error);
        alert("Error setting up push notifications.");
      }
    };

    const unregisterPushNotifications = async () => {
      try {
        const messaging = firebase.messaging();
        localStorage.removeItem("fcmToken");
        await messaging.deleteToken();
        updateSettingState(false);
      } catch (error) {
        console.error("Error unregistering push notifications:", error);
        alert("Failed to disable push notifications.");
      }
    };

    if (id === "push-notifications") {
      if (newEnabledState) {
        await registerPushNotifications();
      } else {
        await unregisterPushNotifications();
      }
    } else {
      if (id === "dnd") {
        try {
          const updatedPreferences =
            new CometChatNotifications.NotificationPreferences();
          const mutePreferences = new CometChatNotifications.MutePreferences();
          mutePreferences.setDNDPreference(
            newEnabledState
              ? CometChatNotifications.DNDOptions.ENABLED
              : CometChatNotifications.DNDOptions.DISABLED
          );
          updatedPreferences.setMutePreferences(mutePreferences);
          await CometChatNotifications.updatePreferences(updatedPreferences);
          updateSettingState(newEnabledState);
          console.log("DND setting updated:", newEnabledState);
        } catch (error) {
          console.error("Error updating DND setting:", error);
          alert("Failed to update DND setting.");
        }
        return;
      }
    }
  };

  return (
    <div className="notification-settings">
      <div className="header">
        <button className="back-button">
          <i className="pi pi-arrow-left"></i>
        </button>
        <h1>Notifications</h1>
      </div>

      <div className="section-title">Messages</div>

      <div className="settings-list">
        {settings.map((setting) => (
          <div key={setting.id} className="setting-item">
            <div className="setting-content">
              <div className="setting-text">
                <div className="setting-title">{setting.title}</div>
                {setting.description && (
                  <div className="setting-description">
                    {setting.description}
                  </div>
                )}
              </div>
              <div className="checkbox-wrapper">
                <button
                  className={`checkbox ${
                    setting.enabled ? "checkbox-active" : ""
                  }`}
                  onClick={() => toggleSetting(setting.id)}
                >
                  {setting.enabled && <i className="pi pi-check"></i>}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettings;
