import React from "react";
import "./index.css";

interface HeaderViewProps {
  onBack: () => void;
}

const HeaderView: React.FC<HeaderViewProps> = ({ onBack }) => {
  return (
    <div className="users-header">
      <button className="back-button" onClick={onBack}>
        <i className="pi pi-arrow-left"></i>
      </button>
      <p className="header-title">New chat</p>
    </div>
  );
};

export default HeaderView;
