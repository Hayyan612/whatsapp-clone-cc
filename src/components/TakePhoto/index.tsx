import React, { useState, useRef, useEffect } from "react";
import "primeicons/primeicons.css";
import "./index.css";

interface TakePhotoProps {
  onClose: () => void;
  onPhotoTaken: (photo: string) => void;
}

const TakePhoto: React.FC<TakePhotoProps> = ({ onClose, onPhotoTaken }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);

  useEffect(() => {
    // Start camera when component mounts
    startCamera();

    // Clean up when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const userMedia = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      setStream(userMedia);

      if (videoRef.current) {
        videoRef.current.srcObject = userMedia;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && isCameraReady) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const photoData = canvas.toDataURL("image/jpeg");
        onPhotoTaken(photoData);
        stopCamera();
      }
    }
  };

  return (
    <div className="take-photo-overlay">
      <div className="take-photo-container">
        <div className="take-photo-header">
          <span className="take-photo-title">Take photo</span>
          <button className="take-photo-close-btn" onClick={onClose}>
            <i className="pi pi-times"></i>
          </button>
        </div>

        <div className="take-photo-content">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera-preview"
          />
        </div>

        <div className="take-photo-footer">
          <button
            className="capture-btn"
            onClick={capturePhoto}
            disabled={!isCameraReady}
          >
            <i className="pi pi-camera"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TakePhoto;
