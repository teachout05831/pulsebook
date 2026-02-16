export type SnapPosition = "collapsed" | "half" | "full" | "custom";

export interface DrawerConfig {
  collapsed: number;
  half: number;
  fullRatio: number;
  maxRatio: number;
}

export const DEFAULT_CONFIG: DrawerConfig = {
  collapsed: 40,
  half: 280,
  fullRatio: 0.5,
  maxRatio: 0.85,
};

export function getMaxHeight(container: HTMLElement | null, maxRatio: number): number {
  const parent = container?.parentElement;
  return parent ? parent.getBoundingClientRect().height * maxRatio : 600;
}

export function getFullHeight(container: HTMLElement | null, fullRatio: number): number {
  const parent = container?.parentElement;
  return parent ? parent.getBoundingClientRect().height * fullRatio : 400;
}

export function clampHeight(h: number, collapsed: number, container: HTMLElement | null, maxRatio: number): number {
  return Math.max(collapsed, Math.min(getMaxHeight(container, maxRatio), h));
}

export function snapToNearest(
  h: number,
  cfg: DrawerConfig,
  container: HTMLElement | null,
): { height: number; position: SnapPosition } {
  const fullH = getFullHeight(container, cfg.fullRatio);
  const allSnaps: { pos: SnapPosition; h: number }[] = [
    { pos: "collapsed" as const, h: cfg.collapsed },
    { pos: "half" as const, h: cfg.half },
    { pos: "full" as const, h: fullH },
  ];
  const snaps = allSnaps.filter(s => s.h > 0);

  for (const snap of snaps) {
    if (Math.abs(h - snap.h) < 40) {
      return { height: snap.h, position: snap.pos };
    }
  }
  return { height: h, position: "custom" };
}
