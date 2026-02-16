"use client";

import dynamic from "next/dynamic";
import { useEstimatePresentation } from "../hooks/useEstimatePresentation";
import { CustomerEstimatePresentation } from "./CustomerEstimatePresentation";
import { toast } from "sonner";
import type { CallWidget } from "../types";
import type { LobbyBrandKit } from "./ConsultationLobby";

const VideoRoom = dynamic(() => import("./VideoRoom").then((mod) => ({ default: mod.VideoRoom })), { ssr: false });

interface Props {
  roomUrl: string;
  token: string | null;
  userName: string;
  companyName: string;
  logoUrl: string | null;
  primaryColor: string;
  onCallEnded: () => void;
  widgets: CallWidget[];
  brandKit?: LobbyBrandKit;
  consultationId: string;
}

export function CustomerCallView({ roomUrl, token, userName, companyName, logoUrl, primaryColor, onCallEnded, widgets, brandKit, consultationId }: Props) {
  const { presentedEstimate, isApproving, approve, reviewLater } = useEstimatePresentation(consultationId);

  const handleApprove = async () => {
    const result = await approve();
    if (result && "error" in result) { toast.error(result.error); return; }
    toast.success("Estimate approved!");
  };

  if (!presentedEstimate) {
    return (
      <VideoRoom
        roomUrl={roomUrl} token={token} userName={userName} companyName={companyName}
        logoUrl={logoUrl} primaryColor={primaryColor} onCallEnded={onCallEnded}
        widgets={widgets} brandKit={brandKit} isHost={false} consultationId={consultationId}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <div className="h-[200px] shrink-0 relative overflow-hidden bg-gray-900">
        <VideoRoom
          roomUrl={roomUrl} token={token} userName={userName} companyName={companyName}
          logoUrl={logoUrl} primaryColor={primaryColor} onCallEnded={onCallEnded}
          widgets={[]} brandKit={brandKit} isHost={false} consultationId={consultationId}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <CustomerEstimatePresentation
          estimate={presentedEstimate}
          primaryColor={primaryColor}
          isApproving={isApproving}
          onApprove={handleApprove}
          onReviewLater={reviewLater}
        />
      </div>
    </div>
  );
}
