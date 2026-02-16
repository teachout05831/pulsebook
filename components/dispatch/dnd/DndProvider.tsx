"use client";

import React, { ReactNode, useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  pointerWithin,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

interface DndProviderProps {
  children: ReactNode;
  onDragStart?: (event: DragStartEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDragCancel?: () => void;
  dragOverlay?: ReactNode;
  autoScroll?: boolean | Record<string, unknown>;
}

// Stable sensor configuration - defined outside component to avoid recreation
const POINTER_SENSOR_OPTIONS = { activationConstraint: { distance: 8 } };
const KEYBOARD_SENSOR_OPTIONS = { coordinateGetter: sortableKeyboardCoordinates };

export function DndProvider({
  children,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDragCancel,
  dragOverlay,
  autoScroll,
}: DndProviderProps) {
  const pointerSensor = useSensor(PointerSensor, POINTER_SENSOR_OPTIONS);
  const keyboardSensor = useSensor(KeyboardSensor, KEYBOARD_SENSOR_OPTIONS);
  const sensors = useMemo(() => [pointerSensor, keyboardSensor], [pointerSensor, keyboardSensor]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
      autoScroll={autoScroll}
    >
      {children}
      {dragOverlay && <DragOverlay>{dragOverlay}</DragOverlay>}
    </DndContext>
  );
}
