import React, { useEffect, useRef } from "react";

interface Props {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}

const VideoChat: React.FC<Props> = ({ localStream, remoteStream }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div>
        <video ref={localVideoRef} autoPlay playsInline muted className="rounded-lg border shadow-lg w-64" />
        <p className="text-center text-gray-600">You</p>
      </div>
      <div>
        <video ref={remoteVideoRef} autoPlay playsInline className="rounded-lg border shadow-lg w-64" />
        <p className="text-center text-gray-600">Friend</p>
      </div>
    </div>
  );
};

export default VideoChat;