import { useState, useEffect } from "react";
import "primeicons/primeicons.css";
import "./index.css";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Update progress percentage over time
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 30); // Adjust speed as needed

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="whatsapp-loading-screen">
      <div className="loading-content">
        {/* Logo container with PrimeIcons WhatsApp icon */}
        <div className="logo-container">
          <i className="pi pi-whatsapp whatsapp-logo"></i>
        </div>

        {/* WhatsApp text */}
        <h1 className="app-title">WhatsApp</h1>

        {/* Loading bar with dynamic percentage */}
        <div className="loading-progress-container">
          <div className="loading-progress-bar">
            <div
              className="loading-progress-fill-dynamic"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="loading-percentage">Loading Chats: {progress}%</div>
        </div>
      </div>

      {/* Encryption text at bottom with PrimeIcons */}
      <div className="encryption-info">
        <i className="pi pi-lock"></i>
        End-to-end encrypted
      </div>
    </div>
  );
}
