import { useEffect, useState, useRef } from "react";
import "./App.css";
import { initializeCometChat } from "../init";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import Login from "./components/Login";
import Home from "./components/Home";
import LoadingScreen from "./components/LoadingScreen";
import AddMemberOverlay from "./components/AddMemberOverlay";
import { setupGeminiBotListener } from "./ai/geminiBot";
import IncomingCall from "./components/IncomingCall";
import {
  CometChatCallEvents,
  CometChatLocalize,
} from "@cometchat/chat-uikit-react";
import { messaging } from "./firebaseConfig";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [groupId, setGroupId] = useState<string>("");
  const homeLoadedRef = useRef(false);
  const [call, setCall] = useState<CometChat.Call | null>(null);

  //Enable Localization
  useEffect(() => {
    CometChatLocalize.setCurrentLanguage("fr");
  }, []);

  // // Enable foreground FCM push notifications
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const unsubscribe = messaging.onMessage((payload) => {
      console.log("📩 Foreground FCM message received:", payload);

      const { title, body, icon } = payload.notification || {};
      if (title && body) {
        new Notification(title, {
          body,
          icon: icon || "/default-icon.png",
        });
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const listenerID = "incoming-call-listener";

    CometChat.addCallListener(
      listenerID,
      new CometChat.CallListener({
        onIncomingCallReceived: (incomingCall: CometChat.Call) => {
          setCall(incomingCall);
        },
        onIncomingCallAccepted: () => {
          setCall(null);
        },
        onIncomingCallCancelled: () => {
          setCall(null);
          CometChatCallEvents.ccCallEnded.subscribe((call: CometChat.Call) => {
            console.log("Call ended:", call);
            setCall(null);
          });
        },
        onOutgoingCallRejected: () => {
          setCall(null);
          CometChatCallEvents.ccCallEnded.subscribe((call: CometChat.Call) => {
            console.log("Call ended:", call);
            setCall(null);
          });
        },
        onIncomingCallRejected: () => {
          setCall(null);
          CometChatCallEvents.ccCallEnded.subscribe((call: CometChat.Call) => {
            console.log("Call ended:", call);
            setCall(null);
          });
        },
        onOutgoingCallAccepted: () => {
          setCall(null);
        },
      })
    );

    return () => {
      CometChat.removeCallListener(listenerID);
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeCometChat();

        const user = await CometChat.getLoggedinUser();
        if (user) {
          setLoggedInUser(user);
          if (user.getUid() === import.meta.env.VITE_AI_UID) {
            setupGeminiBotListener();
          }
          localStorage.setItem("cometchat_user", JSON.stringify(user));
        }
      } catch (error) {
        console.error("CometChat init/login failed:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (loggedInUser) {
      const timer = setTimeout(() => {
        homeLoadedRef.current = true;
        setShowLoadingScreen(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loggedInUser]);

  const handleLogin = async (user: CometChat.User) => {
    setLoggedInUser(user);
    localStorage.setItem("cometchat_user", JSON.stringify(user));
    setShowLoadingScreen(true);

    try {
      if ("serviceWorker" in navigator) {
        await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      }
    } catch (error) {
      console.error("Service worker registration failed:", error);
    }

    setTimeout(() => {
      homeLoadedRef.current = true;
      setShowLoadingScreen(false);
    }, 5000);
  };

  const handleLogout = async () => {
    try {
      try {
        await messaging.deleteToken();
        console.log("FCM token deleted");
      } catch (error) {
        console.error("Error cleaning up push notification token:", error);
      }
      await CometChat.logout();
      setLoggedInUser(null);
      localStorage.removeItem("cometchat_user");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const handleAddMember = () => {
    setIsAddMemberOpen(true);
  };

  const handleCloseAddMember = () => {
    setIsAddMemberOpen(false);
  };

  const handleSetGroupId = (id: string) => {
    setGroupId(id);
  };

  if (loading) return <LoadingScreen />;

  console.log(call);

  return (
    <div className="app-background">
      {loggedInUser ? (
        <>
          <Home
            onLogout={handleLogout}
            setGroupId={handleSetGroupId}
            onAddMemberClick={handleAddMember}
          />
          {showLoadingScreen && (
            <div className="loading-screen-overlay">
              <LoadingScreen />
            </div>
          )}
          {isAddMemberOpen && (
            <AddMemberOverlay
              isOpen={isAddMemberOpen}
              onClose={handleCloseAddMember}
              groupId={groupId}
            />
          )}

          {call && <IncomingCall activeCall={call} />}
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
