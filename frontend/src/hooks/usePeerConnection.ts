import { useRef, useEffect, useState } from "react";
import Peer, { type Instance } from "simple-peer";
import socket from "../../socket/socketConnection";

interface PeerEvents {
  onCallInitiated?: () => void;
  onCallConnected?: () => void;
  onCallFailed?: () => void;
  onCallEnded?: () => void;
}

export function usePeerConnection(
  myId: string,
  localStream: MediaStream | null,
  events?: PeerEvents
) {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerRef = useRef<Instance | null>(null);

  useEffect(() => {
    if (!myId || !localStream) return;

    // Listen for call-made (offer)
    socket.on("call-made", ({ offer, from }) => {
      events?.onCallInitiated?.();
      const peer = new Peer({ initiator: false, trickle: false, stream: localStream });
      peer.on("signal", (answer) => {
        socket.emit("make-answer", { answer, to: from });
      });
      peer.on("stream", (stream) => {
        setRemoteStream(stream);
        events?.onCallConnected?.();
      });
      peer.on("close", () => {
        setRemoteStream(null);
        events?.onCallEnded?.();
      });
      peer.on("error", () => {
        setRemoteStream(null);
        events?.onCallFailed?.();
      });
      peer.signal(offer);
      peerRef.current = peer;
    });

    // Listen for answer-made (answer)
    socket.on("answer-made", ({ answer }) => {
      if (peerRef.current) {
        peerRef.current.signal(answer);
      }
    });

    return () => {
      socket.off("call-made");
      socket.off("answer-made");
    };
  }, [myId, localStream]);

  // Initiate a call
  const callUser = (targetId: string) => {
    if (!localStream) {
      events?.onCallFailed?.();
      return;
    }
    events?.onCallInitiated?.();
    const peer = new Peer({ initiator: true, trickle: false, stream: localStream });
    peer.on("signal", (offer) => {
      socket.emit("call-user", { offer, to: targetId });
    });
    peer.on("stream", (stream) => {
      setRemoteStream(stream);
      events?.onCallConnected?.();
    });
    peer.on("close", () => {
      setRemoteStream(null);
      events?.onCallEnded?.();
    });
    peer.on("error", () => {
      setRemoteStream(null);
      events?.onCallFailed?.();
    });
    peerRef.current = peer;
  };

  return { remoteStream, callUser };
}