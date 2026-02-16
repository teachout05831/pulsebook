"use client";

import { useDispatch } from "../../dispatch-provider";
import { MobileAgendaView } from "./MobileAgendaView";
import { MobileCardsView } from "./cards/MobileCardsView";
import { MobileListView } from "./list/MobileListView";
import { MobileMapView } from "./map/MobileMapView";
import { MobileTimelineView } from "./timeline/MobileTimelineView";

export function MobileViewRenderer() {
  const { currentView, showMap } = useDispatch();

  if (showMap) {
    return <MobileMapView />;
  }

  switch (currentView) {
    case "cards":
      return <MobileCardsView />;
    case "list":
      return <MobileListView />;
    case "timeline":
      return <MobileTimelineView />;
    case "kanban":
    case "agenda":
    case "week":
    case "resource":
    case "dispatch":
    case "crew":
      // These render the existing MobileAgendaView for now
      return <MobileAgendaView />;
    default:
      return <MobileAgendaView />;
  }
}
