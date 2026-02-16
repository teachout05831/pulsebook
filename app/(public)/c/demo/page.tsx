"use client";

import { useState } from "react";
import { ConsultationLobby } from "@/features/consultations/components/ConsultationLobby";
import { MockVideoCall } from "@/features/consultations/components/MockVideoCall";
import { ConsultationThankYou } from "@/features/consultations/components/ConsultationThankYou";
import { mockBrandKit, mockWidgets, brand } from "./demoData";

export default function ConsultationDemoPage() {
  const [state, setState] = useState<"lobby" | "call" | "thankyou">("lobby");
  const [callStart] = useState(Date.now());
  const { companyName, logoUrl, primaryColor } = brand;

  if (state === "call") {
    return (
      <MockVideoCall companyName={companyName} logoUrl={logoUrl} primaryColor={primaryColor}
        hostName="Mike Johnson" customerName="Sarah Williams"
        onEndCall={() => setState("thankyou")} brandKit={mockBrandKit} widgets={mockWidgets} />
    );
  }
  if (state === "thankyou") {
    return (
      <ConsultationThankYou companyName={companyName} logoUrl={logoUrl} primaryColor={primaryColor}
        durationSeconds={Math.floor((Date.now() - callStart) / 1000)} purpose="discovery" />
    );
  }
  return (
    <ConsultationLobby companyName={companyName} logoUrl={logoUrl} primaryColor={primaryColor}
      title="Video Consultation" hostName="Mike Johnson" customerName="Sarah Williams"
      onJoin={() => setState("call")} isJoining={false} brandKit={mockBrandKit} />
  );
}
