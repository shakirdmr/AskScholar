// In short: This code shows your webcam video on the page by asking for permission and putting the stream into a video element.

import React, { useEffect, useRef } from "react";

// This component displays the user's webcam video
const VideoChat: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ask for webcam access when the component mounts
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // Set the video element's source to the webcam stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        // Handle errors (e.g., user denies access)
        alert("Could not access webcam: " + err.message);
      });
  }, []);

  return (
    <div className="  flex flex-col items-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted // Muted so you don't hear your own audio
        className="rounded-lg  shadow-lg w-full max-w-md"
      />
      <p className="mt-2 text-gray-600">📸 Your Camera Preview</p>
    </div>
  );
};

export default VideoChat;