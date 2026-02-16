"use client";

import { useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Eye, EyeOff, Trash2, Link2, Save } from "lucide-react";
import { SECTION_LABELS } from "../../types";
import type { PageSection, SectionType } from "../../types";

interface SectionListProps {
  sections: PageSection[];
  selectedSectionId: string | null;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onRemove: (id: string) => void;
  onReorder: (reordered: PageSection[]) => void;
  onSaveAsBlock?: (section: PageSection) => void;
}

function SortableItem({
  section,
  isSelected,
  onSelect,
  onToggleVisibility,
  onRemove,
  onSaveAsBlock,
}: {
  section: PageSection;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onRemove: () => void;
  onSaveAsBlock?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors ${
        isSelected ? "bg-accent border border-primary/30" : "hover:bg-muted"
      }`}
    >
      <span {...attributes} {...listeners} className="touch-none">
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 cursor-grab" />
      </span>
      {section.universalBlockId && section.isConnected && (
        <span title="Connected Universal Block"><Link2 className="h-3 w-3 text-blue-600 flex-shrink-0" /></span>
      )}
      <span className={`flex-1 truncate ${!section.visible ? "text-muted-foreground line-through" : ""}`}>
        {section.customLabel || SECTION_LABELS[section.type as SectionType] || section.type}
      </span>
      {onSaveAsBlock && !section.universalBlockId && (
        <button
          onClick={(e) => { e.stopPropagation(); onSaveAsBlock(); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity" title="Save as Universal Block"
        >
          <Save className="h-3.5 w-3.5 text-muted-foreground hover:text-blue-600" />
        </button>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {section.visible
          ? <Eye className="h-3.5 w-3.5 text-muted-foreground" />
          : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-3.5 w-3.5 text-destructive" />
      </button>
    </div>
  );
}

export function SectionList({ sections, selectedSectionId, onSelect, onToggleVisibility, onRemove, onReorder, onSaveAsBlock }: SectionListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = [...sections];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);
      onReorder(reordered);
    },
    [sections, onReorder],
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-1 px-2">
          {sections.map((s) => (
            <SortableItem
              key={s.id}
              section={s}
              isSelected={selectedSectionId === s.id}
              onSelect={() => onSelect(s.id)}
              onToggleVisibility={() => onToggleVisibility(s.id)}
              onRemove={() => onRemove(s.id)}
              onSaveAsBlock={onSaveAsBlock ? () => onSaveAsBlock(s) : undefined}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
