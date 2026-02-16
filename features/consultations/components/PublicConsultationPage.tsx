"use client";

import { useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import type { PublicConsultationData } from "../types";
import { ConsultationLobby } from "./ConsultationLobby";
import type { LobbyBrandKit } from "./ConsultationLobby";
import { ConsultationThankYou } from "./ConsultationThankYou";
import { HostPostCallSummary } from "./HostPostCallSummary";

const VideoRoom = dynamic(() => import("./VideoRoom").then((mod) => ({ default: mod.VideoRoom })), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-gray-950">
      <div className="text-gray-400 text-sm">Loading video room...</div>
    </div>
  ),
});

const CustomerCallView = dynamic(() => import("./CustomerCallView").then((mod) => ({ default: mod.CustomerCallView })), { ssr: false });

type CallState = "lobby" | "call" | "ended";

interface PublicConsultationPageProps {
  consultation: PublicConsultationData;
}

export function PublicConsultationPage({ consultation }: PublicConsultationPageProps) {
  const searchParams = useSearchParams();
  const isHost = searchParams.get("role") === "host";

  const [callState, setCallState] = useState<CallState>("lobby");
  const [isJoining, setIsJoining] = useState(false);
  const [meetingToken, setMeetingToken] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [liveEstimateId, setLiveEstimateId] = useState<string | null>(null);

  const primaryColor = consultation.brandKit?.primaryColor || "#2563eb";
  const logoUrl = consultation.brandKit?.logoUrl || null;

  const lobbyBrandKit: LobbyBrandKit | undefined = useMemo(() => {
    const bk = consultation.brandKit;
    if (!bk) return undefined;
    return {
      googleRating: bk.googleRating,
      googleReviewCount: bk.googleReviewCount,
      certifications: bk.certifications,
      companyPhotos: bk.companyPhotos,
      beforeAfterPhotos: bk.beforeAfterPhotos,
      testimonials: bk.testimonials,
      companyDescription: bk.companyDescription,
      yearsInBusiness: bk.yearsInBusiness,
      insuranceInfo: bk.insuranceInfo,
    };
  }, [consultation.brandKit]);

  const handleJoin = useCallback(async () => {
    setIsJoining(true);
    try {
      // Get a meeting token for the customer
      const res = await fetch(`/api/consultations/${consultation.id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: isHost ? "host" : "customer",
          publicToken: window.location.pathname.split("/").pop(),
          userName: isHost ? consultation.hostName : (consultation.customerName || "Guest"),
        }),
      });
      const data = await res.json();
      if (data.data?.token) {
        setMeetingToken(data.data.token);
      }
      setCallState("call");
    } catch {
      setCallState("call"); // Join without token (public room)
    } finally {
      setIsJoining(false);
    }
  }, [consultation.id, consultation.customerName, consultation.hostName, isHost]);

  const handleCallEnded = useCallback(() => {
    setCallState("ended");
  }, []);

  if (callState === "call" && consultation.dailyRoomUrl) {
    if (!isHost) {
      return (
        <CustomerCallView
          roomUrl={consultation.dailyRoomUrl} token={meetingToken}
          userName={consultation.customerName || "Guest"} companyName={consultation.companyName}
          logoUrl={logoUrl} primaryColor={primaryColor} onCallEnded={handleCallEnded}
          widgets={consultation.widgets} brandKit={lobbyBrandKit} consultationId={consultation.id}
        />
      );
    }
    return (
      <VideoRoom
        roomUrl={consultation.dailyRoomUrl} token={meetingToken}
        userName={consultation.hostName} companyName={consultation.companyName}
        logoUrl={logoUrl} primaryColor={primaryColor} onCallEnded={handleCallEnded}
        widgets={consultation.widgets} brandKit={lobbyBrandKit} isHost
        consultationId={consultation.id} onEstimateSaved={setLiveEstimateId}
      />
    );
  }

  if (callState === "ended") {
    if (isHost) {
      return (
        <HostPostCallSummary
          companyName={consultation.companyName} logoUrl={logoUrl} primaryColor={primaryColor}
          durationSeconds={callDuration} consultationId={consultation.id} liveEstimateId={liveEstimateId}
        />
      );
    }
    return (
      <ConsultationThankYou
        companyName={consultation.companyName} logoUrl={logoUrl} primaryColor={primaryColor}
        durationSeconds={callDuration} purpose={consultation.purpose}
      />
    );
  }

  return (
    <ConsultationLobby
      companyName={consultation.companyName}
      logoUrl={logoUrl}
      primaryColor={primaryColor}
      title={consultation.title}
      hostName={consultation.hostName}
      customerName={consultation.customerName}
      onJoin={handleJoin}
      isJoining={isJoining}
      brandKit={lobbyBrandKit}
    />
  );
}
