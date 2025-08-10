import React, { useState } from "react";
import { CometChatUIKit } from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import "./index.css";

type LoginProps = {
  onLogin: (user: CometChat.User) => void;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const handleLogin = async () => {
    if (!uid.trim()) {
      setError("UID is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = await CometChatUIKit.login(uid);
      onLogin(user);
      localStorage.setItem("cometchat_user", JSON.stringify(user));
    } catch (err) {
      console.error("Login failed:", err);
      setError("UID not found. Do you want to sign up?");
      setShowSignUp(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!name.trim()) {
      setError("Name is required for signup");
      return;
    }

    if (!uid.trim()) {
      setError("UID is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const newUser = await new CometChat.User(uid);
      newUser.setName(name.trim());
      await CometChatUIKit.createUser(newUser);
      const user = await CometChatUIKit.login(uid);
      onLogin(user);
      localStorage.setItem("cometchat_user", JSON.stringify(user));
    } catch (err) {
      console.error("Sign up failed:", err);
      setError("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (showSignUp && name && uid) {
        handleSignUp();
      } else if (!showSignUp) {
        handleLogin();
      }
    }
  };

  const toggleSignUp = () => {
    setShowSignUp(!showSignUp);
    setError("");
  };

  return (
    <div className="container">
      <div className="loginBox">
        <h1 className="title">WhatsApp</h1>
        <p className="subtitle">
          {showSignUp ? "Create a new account" : "Enter your UID to continue"}
        </p>

        <div className="form">
          {showSignUp && (
            <div className="inputGroup">
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="input"
                autoFocus={showSignUp}
              />
            </div>
          )}

          <div className="inputGroup">
            <input
              type="text"
              placeholder="Enter UID"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              onKeyDown={handleKeyDown}
              className="input"
              autoFocus={!showSignUp}
            />
          </div>

          {error && <p className="error">{error}</p>}

          {showSignUp ? (
            <>
              <button
                onClick={handleSignUp}
                disabled={loading}
                className="button"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
              <button
                onClick={toggleSignUp}
                disabled={loading}
                className="button secondaryButton"
              >
                Back to Login
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="button"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <button onClick={toggleSignUp} className="button secondaryButton">
                Create Account
              </button>
            </>
          )}
        </div>
        <div className="footer">
          <p>Powered by CometChat</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
