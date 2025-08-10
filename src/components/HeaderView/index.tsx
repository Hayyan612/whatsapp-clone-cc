import { useState, useRef, useEffect } from "react";
import "primeicons/primeicons.css";
import "./index.css";

type HeaderViewProps = {
  onToggelUsers: () => void;
  onToggleChats: () => void;
  onToggleGroups: () => void;
  onLogout: () => void;
  onSearch: (search: string) => void;
  activeTabString: string;
};
const HeaderView: React.FC<HeaderViewProps> = ({
  onToggelUsers,
  onToggleChats,
  onToggleGroups,
  onLogout,
  onSearch,
  activeTabString,
}) => {
  const [activeTab, setActiveTab] = useState<string>(activeTabString);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "all") {
      onToggleChats();
    }
    if (tab === "groups") {
      onToggleGroups();
    }
  };

  return (
    <>
      {/* Header */}
      <div className="conversationsHeader">
        <h1 className="headerTitle">Chats</h1>
        <div className="headerIcons">
          <button
            className="iconButton"
            title="New Chat"
            onClick={onToggelUsers}
          >
            <i className="pi pi-user-plus"></i>
          </button>
          <button
            className="iconButton"
            title="More Options"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <i className="pi pi-ellipsis-v"></i>
          </button>
        </div>
        {isMenuOpen && (
          <div ref={menuRef} className="kebabMenu">
            <button className="kebabItem">New group</button>
            <button className="kebabItem">Select chats</button>
            <button className="kebabItem" onClick={onLogout}>
              Log out
            </button>
          </div>
        )}
      </div>
      {/* Search Bar */}
      <div className="searchContainer">
        <i className="pi pi-search searchIcon"></i>
        <input
          type="text"
          className="searchInput"
          placeholder="Search"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      {/* Tabs */}
      <div className="tabsContainer">
        <button
          className={`tabButton ${activeTab === "all" ? "activeTab" : ""}`}
          onClick={() => handleTabChange("all")}
        >
          All
        </button>
        <button
          className={`tabButton ${activeTab === "unread" ? "activeTab" : ""}`}
          onClick={() => handleTabChange("unread")}
        >
          Unread
        </button>
        <button
          className={`tabButton ${
            activeTab === "favourites" ? "activeTab" : ""
          }`}
          onClick={() => handleTabChange("favourites")}
        >
          Favourites
        </button>
        <button
          className={`tabButton ${activeTab === "groups" ? "activeTab" : ""}`}
          onClick={() => handleTabChange("groups")}
        >
          Groups
        </button>
      </div>
    </>
  );
};

export default HeaderView;
