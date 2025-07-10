import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { usePeerConnection } from "../hooks/usePeerConnection";

interface Props {
  myId: string;
}

const CallControls: React.FC<Props> = ({ myId }) => {
  const [friendId, setFriendId] = useState("");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState("");

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const { callUser, remoteStream } = usePeerConnection(myId, localStream, {
    onCallInitiated: () => {
      setIsCalling(true);
      setCallStatus("Calling...");
      toast.loading("Calling your friend...");
      console.log("[Call] Initiating call...");
    },
    onCallConnected: () => {
      setIsCalling(false);
      setCallStatus("Call Connected!");
      toast.dismiss();
      toast.success("Call Connected!");
      console.log("[Call] Call connected!");
    },
    onCallFailed: () => {
      setIsCalling(false);
      setCallStatus("Call Failed or Rejected");
      toast.dismiss();
      toast.error("Call Failed or Rejected");
      console.log("[Call] Call failed or rejected.");
    },
    onCallEnded: () => {
      setIsCalling(false);
      setCallStatus("Call Ended");
      toast.dismiss();
      toast("Call Ended", { icon: "📞" });
      console.log("[Call] Call ended.");
    },
  });

  // Bind local stream to video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Bind remote stream to video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Get user's media stream once on mount
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(setLocalStream)
      .catch(() => toast.error("Could not access webcam or microphone"));

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleCall = () => {
    if (!friendId.trim()) {
      toast.error("Enter a Socket ID to call!");
      return;
    }

    if (isCalling) return;

    setIsCalling(true);
    setCallStatus("Calling...");
    callUser(friendId);
    console.log(`[Call] Calling ${friendId} from ${myId}`);
  };

  return (
    <div className="mt-6 flex flex-col items-center gap-4 w-full">
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full">
        {/* Local Video */}
        <div>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="rounded-lg border shadow-lg w-64"
          />
          <p className="text-center text-gray-600">You</p>
        </div>

        {/* Remote Video */}
        <div>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="rounded-lg border shadow-lg w-64"
          />
          <p className="text-center text-gray-600">Friend</p>
        </div>
      </div>

      {/* Call Controls */}
      <div className="flex flex-col items-center gap-2 w-full max-w-xs mx-auto">
        <input
          className="border px-3 py-1 rounded w-full text-center text-lg"
          placeholder="Enter friend's Socket ID"
          value={friendId}
          onChange={e => setFriendId(e.target.value)}
          disabled={isCalling}
        />

        <button
          onClick={handleCall}
          disabled={isCalling}
          className={`w-full py-2 rounded-lg font-bold text-lg transition bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg hover:from-indigo-600 hover:to-blue-600 disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {isCalling ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              {callStatus || "Calling..."}
            </span>
          ) : (
            "Call"
          )}
        </button>

        {callStatus && (
          <div className="mt-2 text-center text-sm text-indigo-700 font-semibold animate-pulse">
            {callStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default CallControls;
