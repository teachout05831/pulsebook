"use client";

import { useState } from "react";
import { ConsultationLobby } from "./ConsultationLobby";
import { MockVideoCall } from "./MockVideoCall";
import { ConsultationThankYou } from "./ConsultationThankYou";
import type { PreviewConsultationData } from "../types";

interface Props {
  data: PreviewConsultationData;
}

export function PreviewConsultationPage({ data }: Props) {
  const [state, setState] = useState<"lobby" | "call" | "thankyou">("lobby");
  const [callStart] = useState(Date.now());
  const { companyName, logoUrl, primaryColor, hostName, defaultTitle, brandKit, widgets } = data;

  const lobbyBrandKit = brandKit ? {
    googleRating: brandKit.googleRating,
    googleReviewCount: brandKit.googleReviewCount,
    certifications: brandKit.certifications,
    companyPhotos: brandKit.companyPhotos,
    beforeAfterPhotos: brandKit.beforeAfterPhotos,
    testimonials: brandKit.testimonials,
    companyDescription: brandKit.companyDescription,
    yearsInBusiness: brandKit.yearsInBusiness,
    insuranceInfo: brandKit.insuranceInfo,
  } : undefined;

  if (state === "call") {
    return (
      <MockVideoCall companyName={companyName} logoUrl={logoUrl} primaryColor={primaryColor}
        hostName={hostName} customerName="Sample Customer"
        onEndCall={() => setState("thankyou")} brandKit={lobbyBrandKit} widgets={widgets} />
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
      title={defaultTitle} hostName={hostName} customerName="Sample Customer"
      onJoin={() => setState("call")} isJoining={false} brandKit={lobbyBrandKit} />
  );
}
