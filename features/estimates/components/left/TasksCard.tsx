"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { useEstimateTasks } from "../../hooks/useEstimateTasks";
import type { EstimateTask } from "@/types/estimate";

interface Props {
  estimateId: string;
  initialTasks: EstimateTask[];
}

export function TasksCard({ estimateId, initialTasks }: Props) {
  const { tasks, addTask, toggleTask, removeTask } = useEstimateTasks(estimateId, initialTasks);
  const [newTitle, setNewTitle] = useState("");

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    await addTask(newTitle.trim());
    setNewTitle("");
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-semibold">Tasks</span>
          <span className="text-xs text-slate-400">
            {tasks.filter((t) => t.completed).length}/{tasks.length}
          </span>
        </div>

        {tasks.length === 0 ? (
          <p className="text-center text-slate-400 text-xs py-3">No tasks yet</p>
        ) : (
          <div className="space-y-1.5">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-1.5 group">
                <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} className="h-3.5 w-3.5" />
                <span className={`flex-1 text-xs ${task.completed ? "line-through text-slate-400" : ""}`}>
                  {task.title}
                </span>
                <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100" onClick={() => removeTask(task.id)}>
                  <Trash2 className="h-2.5 w-2.5" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-2">
          <Input
            placeholder="Add task..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="h-7 text-xs"
          />
        </div>
      </CardContent>
    </Card>
  );
}
