"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";

interface UseDailyCallOptions {
  roomUrl: string;
  token: string | null;
  userName: string;
  onCallEnded?: () => void;
}

export function useDailyCall({ roomUrl, token, userName, onCallEnded }: UseDailyCallOptions) {
  const callRef = useRef<DailyCall | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [remoteJoined, setRemoteJoined] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setCallDuration((d) => d + 1), 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, []);

  useEffect(() => {
    const callObject = DailyIframe.createCallObject({
      url: roomUrl,
      token: token || undefined,
      userName,
      dailyConfig: {} as Record<string, unknown>,
    });
    callRef.current = callObject;

    callObject.on("track-started", (event) => {
      if (!event || !event.track) return;
      const { track, participant } = event;
      if (track.kind === "video") {
        const videoEl = participant?.local ? localVideoRef.current : remoteVideoRef.current;
        if (videoEl) videoEl.srcObject = new MediaStream([track]);
      }
    });

    callObject.on("participant-joined", (event) => {
      if (event?.participant && !event.participant.local) setRemoteJoined(true);
    });

    callObject.on("participant-left", (event) => {
      if (event?.participant && !event.participant.local) {
        setRemoteJoined(false);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      }
    });

    callObject.on("left-meeting", () => onCallEnded?.());
    callObject.join();

    return () => { callObject.leave(); callObject.destroy(); };
  }, [roomUrl, token, userName, onCallEnded]);

  const toggleMute = useCallback(() => {
    callRef.current?.setLocalAudio(isMuted);
    setIsMuted(!isMuted);
  }, [isMuted]);

  const toggleCamera = useCallback(() => {
    callRef.current?.setLocalVideo(isCameraOff);
    setIsCameraOff(!isCameraOff);
  }, [isCameraOff]);

  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) callRef.current?.stopScreenShare();
    else callRef.current?.startScreenShare();
    setIsScreenSharing(!isScreenSharing);
  }, [isScreenSharing]);

  const endCall = useCallback(() => { callRef.current?.leave(); }, []);

  return {
    remoteVideoRef, localVideoRef, callObject: callRef.current,
    isMuted, isCameraOff, isScreenSharing, callDuration, remoteJoined,
    toggleMute, toggleCamera, toggleScreenShare, endCall,
  };
}
