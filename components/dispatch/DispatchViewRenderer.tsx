"use client";

import {
  TimelineView,
  ListView,
  KanbanView,
  CardsView,
  AgendaView,
  WeekView,
  ResourceView,
  DispatchBoardView,
  CrewView,
  MobileAgendaView,
} from "@/components/dispatch/views";
import { useDispatch } from "./dispatch-provider";
import { useMediaQuery } from "@/hooks/use-media-query";

export function DispatchViewRenderer() {
  const { currentView } = useDispatch();
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Mobile: swap timeline for touch-friendly agenda view
  if (isMobile && (currentView === "timeline" || currentView === undefined)) {
    return <MobileAgendaView />;
  }

  switch (currentView) {
    case "timeline":
      return <TimelineView />;
    case "list":
      return <ListView />;
    case "kanban":
      return <KanbanView />;
    case "cards":
      return <CardsView />;
    case "agenda":
      return <AgendaView />;
    case "week":
      return <WeekView />;
    case "resource":
      return <ResourceView />;
    case "dispatch":
      return <DispatchBoardView />;
    case "crew":
      return <CrewView />;
    default:
      return <TimelineView />;
  }
}
