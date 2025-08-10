import React, { useEffect, useState } from "react";
import "./index.css";
import Sidebar from "../Sidebar";
import Conversations from "../Conversations";
import Chat from "../Chat";
import Users from "../Users";
import Profile from "../Profile";
import Groups from "../Groups";
import GroupInfo from "../GroupInfo";
import UserInfo from "../UserInfo";
import Settings from "../Settings"; // Add this at the top with other imports
import WallpaperPreview from "../WallpaperPreview"; // Import WallpaperPreview component
import Threads from "../Threads"; // Import Threads component
import Calls from "../Calls"; // Import Calls component
import { CometChat } from "@cometchat/chat-sdk-javascript";
import doodle from "../../assets/doodle.png"; // Import doodle image

type HomeProps = {
  onLogout: () => void;
  setGroupId: (groupId: string) => void;
  onAddMemberClick: () => void;
};

// Mobile view states
type MobileView = 'conversations' | 'chat' | 'info' | 'threads';

const Home: React.FC<HomeProps> = ({
  onLogout,
  setGroupId,
  onAddMemberClick,
}) => {
  const [showUsers, setShowUsers] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showConversations, setShowConversations] = useState(true);
  const [showGroups, setShowGroups] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWallpaperPreview, setShowWallpaperPreview] = useState(false);
  const [showDoodle, setShowDoodle] = useState(true);
  
  // Mobile responsive states
  const [isMobile, setIsMobile] = useState(false);
  const [currentMobileView, setCurrentMobileView] = useState<MobileView>('conversations');
  
  const [selectedWallpaper, setSelectedWallpaper] = useState<{
    id: string;
    color: string;
    label: string;
  }>({ id: "default", color: "#e6ddd4", label: "Default" });
  const [selectedConversation, setSelectedConversation] = useState<
    CometChat.Conversation | CometChat.User | CometChat.Group | null
  >(null);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [showThreads, setShowThreads] = useState(false);
  const [parentMessage, setParentMessage] =
    useState<CometChat.BaseMessage | null>(null);
  const [parentMessageId, setParentMessageId] = useState<number>(0);
  const [showCalls, setShowCalls] = useState(false);

  // Mobile detection and handling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // const [refreshKey, setRefreshKey] = useState(0);

  // useEffect(() => {
  //   const refreshHandler = () => setRefreshKey((prev) => prev + 1);
  //   document.addEventListener("refreshConversations", refreshHandler);

  //   return () => {
  //     document.removeEventListener("refreshConversations", refreshHandler);
  //   };
  // }, []);

  const toggleUsers = () => {
    setShowUsers((prev) => !prev);
    setSelectedConversation(null);
  };

  useEffect(() => {
    const loggedInUser = JSON.parse(
      localStorage.getItem("cometchat_user") || "{}"
    );
    const wallpaperData = JSON.parse(
      localStorage.getItem("selectedWallpaper") || "{}"
    );
    if (wallpaperData && wallpaperData.uid === loggedInUser.uid) {
      setSelectedWallpaper(wallpaperData.wallpaper);
    }
  }, []);

  const listenerID = "UNIQUE_LISTENERID__011";
  CometChat.addGroupListener(
    listenerID,
    new CometChat.GroupListener({
      onMemberAddedToGroup: () => {
        console.log("onMemberAddedToGroup");

        document.dispatchEvent(new CustomEvent("refreshConversations"));
      },
    })
  );

  useEffect(() => {
    // const groupListenerId = "groupListenerCometChat";
    // CometChat.addGroupListener(
    //   groupListenerId,
    //   new CometChat.GroupListener({
    //     onMemberAddedToGroup: (
    //       message: CometChat.Action,
    //       userAdded: CometChat.User,
    //       addedby: CometChat.User,
    //       addedTo: CometChat.Group
    //     ) => {
    //       console.log("onMemberAddedToGroup", {
    //         message,
    //         userAdded,
    //         addedby,
    //         addedTo,
    //       });
    //       document.dispatchEvent(new CustomEvent("refreshConversations"));
    //     },
    //     onGroupMemberKicked: (
    //       message: CometChat.Action,
    //       userAdded: CometChat.User,
    //       addedby: CometChat.User,
    //       addedTo: CometChat.Group
    //     ) => {
    //       console.log("onMemberKickedToGroup", {
    //         message,
    //         userAdded,
    //         addedby,
    //         addedTo,
    //       });
    //     },
    //   })
    // );
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const chatBody = document.querySelector(
        ".cometchat-message-list__body"
      ) as HTMLElement;

      if (chatBody) {
        chatBody.style.backgroundColor = selectedWallpaper.color;
        chatBody.style.setProperty("--doodle-image", `url(${doodle})`);

        if (showDoodle) {
          chatBody.classList.add("dynamic-chat-bg");
        } else {
          chatBody.classList.remove("dynamic-chat-bg");
        }
      }
    });

    const chatContainer = document.querySelector(".chat");
    if (chatContainer) {
      observer.observe(chatContainer, {
        childList: true,
        subtree: true,
      });
    }

    return () => observer.disconnect();
  }, [selectedWallpaper, showDoodle]);

  const toggleAI = async () => {
    setShowConversations(true);
    setShowChatInfo(false);
    setShowGroups(false);
    setShowUsers(false);
    setShowProfile(false);
    setShowSettings(false);
    setShowWallpaperPreview(false);
    setShowCalls(false);
    const aiBot = await CometChat.getUser("cometchat-uid-ai-bot");
    setSelectedConversation(aiBot);
  };

  const toggleProfile = () => {
    setShowProfile(true);
    setShowUsers(false);
    setShowConversations(false);
    setShowGroups(false);
    setShowSettings(false);
    setSelectedConversation(null);
    setShowWallpaperPreview(false);
    setShowCalls(false);
  };

  const toggleConversations = () => {
    setShowProfile(false);
    setShowUsers(false);
    setShowConversations(true);
    setShowGroups(false);
    setShowSettings(false);
    setShowWallpaperPreview(false);
    setShowCalls(false);
  };

  const toggleGroups = () => {
    setShowProfile(false);
    setShowUsers(false);
    setShowConversations(false);
    setShowGroups(true);
    setShowSettings(false);
    setShowWallpaperPreview(false);
    setShowCalls(false);
  };

  const toggleSettings = () => {
    // Create new callback function
    setShowSettings(true);
    setShowProfile(false);
    setShowUsers(false);
    setShowConversations(false);
    setShowGroups(false);
    setSelectedConversation(null);
    setShowWallpaperPreview(false);
    setShowCalls(false);
  };

  const toggleWallpaperPreview = (value: boolean) =>
    setShowWallpaperPreview(value);

  const handleUserSelect = (
    user: CometChat.Conversation | CometChat.User | CometChat.Group | null
  ) => {
    setSelectedConversation(user);
    setShowCalls(false);
    
    // On mobile, navigate to chat view when user is selected
    if (isMobile && user) {
      setCurrentMobileView('chat');
    }
  };

  const handleToggleDoodle = (value: boolean) => {
    setShowDoodle(value);
  };

  const handleWallpaperSelect = (wallpaper: {
    id: string;
    color: string;
    label: string;
  }) => {
    setSelectedWallpaper(wallpaper);

    const loggedInUser = JSON.parse(
      localStorage.getItem("cometchat_user") || "{}"
    );
    if (loggedInUser.uid) {
      localStorage.setItem(
        "selectedWallpaper",
        JSON.stringify({ uid: loggedInUser.uid, wallpaper })
      );
    }
  };

  const toggleChatInfo = () => {
    setShowChatInfo((prev) => !prev);
    
    // On mobile, navigate to info view when chat info is opened
    if (isMobile && !showChatInfo) {
      setCurrentMobileView('info');
    } else if (isMobile && showChatInfo) {
      setCurrentMobileView('chat');
    }
  };

  const onReplyClick = (message: CometChat.BaseMessage) => {
    setParentMessage(message);
    setParentMessageId(message.getId());
    setShowThreads(true);
    
    // On mobile, navigate to threads view
    if (isMobile) {
      setCurrentMobileView('threads');
    }
  };
  
  const onCloseThread = () => {
    setParentMessage(null);
    setParentMessageId(0);
    setShowThreads(false);
    
    // On mobile, navigate back to chat view
    if (isMobile) {
      setCurrentMobileView('chat');
    }
  };
  
  // Mobile back navigation function
  const handleMobileBack = () => {
    if (currentMobileView === 'chat') {
      setCurrentMobileView('conversations');
      setSelectedConversation(null);
    } else if (currentMobileView === 'info') {
      setShowChatInfo(false);
      setCurrentMobileView('chat');
    } else if (currentMobileView === 'threads') {
      onCloseThread();
    }
  };
  const onToggleCalls = () => {
    setShowCalls(true);
    setShowProfile(false);
    setShowUsers(false);
    setShowConversations(false);
    setShowGroups(false);
    setShowSettings(false);
    setShowWallpaperPreview(false);
    setSelectedConversation(null);
  };

  useEffect(() => {
    setShowChatInfo(false);
  }, [selectedConversation]);

  return (
    <div className="homeContainer">
      <div className="sidebar-container">
        <Sidebar
          onToggleProfile={toggleProfile}
          onToggleChat={toggleConversations}
          onToggleGroup={toggleGroups}
          onToggleSettings={toggleSettings}
          onChatClick={selectedConversation}
          onToggleAI={toggleAI}
          onToggleCalls={onToggleCalls}
        />
      </div>
      
      {/* Conversations Panel */}
      <div 
        className={`conversations ${isMobile && currentMobileView !== 'conversations' ? 'mobile-hidden' : ''}`}
      >
        {showCalls ? (
          <Calls />
        ) : showSettings ? (
          <Settings
            onLogout={onLogout}
            onWallpaperClick={toggleWallpaperPreview}
            onSelectWallpaper={handleWallpaperSelect}
            onToggleDoodle={handleToggleDoodle}
            selectedWallpaper={selectedWallpaper}
            showDoodle={showDoodle}
          />
        ) : showProfile ? (
          <Profile />
        ) : showUsers ? (
          <Users onBack={toggleUsers} onUserClick={handleUserSelect} />
        ) : showConversations ? (
          <Conversations
            // key={refreshKey}
            onToggleUsers={toggleUsers}
            onToggleChats={toggleConversations}
            onToggleGroups={toggleGroups}
            onChatClick={handleUserSelect}
            onLogout={onLogout}
          />
        ) : showGroups ? (
          <Groups
            onToggleUsers={toggleUsers}
            onToggleChats={toggleConversations}
            onToggleGroups={toggleGroups}
            onLogout={onLogout}
          />
        ) : null}
      </div>
      
      {/* Chat Panel */}
      <div 
        className={`chat ${isMobile && currentMobileView === 'chat' ? 'mobile-visible' : ''}`}
      >
        {isMobile && currentMobileView === 'chat' && (
          <button 
            onClick={handleMobileBack}
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              zIndex: 1000,
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        )}
        {showWallpaperPreview ? (
          <WallpaperPreview
            wallpaper={selectedWallpaper}
            showDoodles={showDoodle}
          />
        ) : (
          <Chat
            selectedChat={selectedConversation}
            onChatInfoClick={toggleChatInfo}
            setGroupId={setGroupId}
            onMessageReplyClick={onReplyClick}
          />
        )}
      </div>
      
      {/* Chat Info Panel */}
      {showChatInfo &&
        selectedConversation &&
        selectedConversation instanceof CometChat.Conversation &&
        selectedConversation.getConversationType() ===
          CometChat.RECEIVER_TYPE.GROUP && (
          <div className={`chatInfo ${isMobile && currentMobileView === 'info' ? 'mobile-visible' : ''}`}>
            {isMobile && (
              <button 
                onClick={handleMobileBack}
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  zIndex: 1000,
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer'
                }}
              >
                ← Back
              </button>
            )}
            <GroupInfo
              groupChat={
                selectedConversation.getConversationWith() as CometChat.Group
              }
              onBack={toggleChatInfo}
              onAddMemberClick={onAddMemberClick}
            />
          </div>
        )}
      {showChatInfo &&
        selectedConversation &&
        selectedConversation instanceof CometChat.Conversation &&
        selectedConversation.getConversationType() ===
          CometChat.RECEIVER_TYPE.USER && (
          <div className={`chatInfo ${isMobile && currentMobileView === 'info' ? 'mobile-visible' : ''}`}>
            {isMobile && (
              <button 
                onClick={handleMobileBack}
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  zIndex: 1000,
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer'
                }}
              >
                ← Back
              </button>
            )}
            <UserInfo
              user={
                selectedConversation.getConversationWith() as CometChat.User
              }
              onBack={toggleChatInfo}
            />
          </div>
        )}
        
      {/* Threads Panel */}
      {showThreads && parentMessage && selectedConversation && (
        <div className={`threads ${isMobile && currentMobileView === 'threads' ? 'mobile-visible' : ''}`}>
          {isMobile && (
            <button 
              onClick={handleMobileBack}
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                zIndex: 1000,
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>
          )}
          <Threads
            parentMessage={parentMessage}
            parentMessageId={parentMessageId}
            selectedChat={selectedConversation}
            onBack={onCloseThread}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
