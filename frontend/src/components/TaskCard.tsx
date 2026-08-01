import { useState, useEffect, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Priority, Task } from "../types/Task";
import { Trash2, Pencil, MoreHorizontal } from "lucide-react";

type TaskCardProps = {
  task: Task;
  onDeleteTask: (id: number) => void;
  onEditTask: (task: Task) => void;
};

const priorityStyles = (p: Priority): string => {
  if (p === "HIGH")
    return "border border-priority-high/20 text-priority-high bg-priority-high/10";
  else if (p === "MEDIUM")
    return "border border-priority-medium/20 text-priority-medium bg-priority-medium/10";
  else
    return "border border-priority-low/20 text-priority-low bg-priority-low/10";
};

const formatDuration = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);

  return parts.join(" ");
};

function TaskCard(props: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: props.task.id,
    });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      props.task.status !== "IN_PROGRESS" ||
      !props.task.lastEnteredInProgressAt
    ) {
      return;
    }

    const startTime = new Date(props.task.lastEnteredInProgressAt).getTime();

    const updateElapsed = () => {
      const now = Date.now();
      setElapsedSeconds(Math.floor((now - startTime) / 1000));
    };

    updateElapsed();
    const intervalId = setInterval(updateElapsed, 1000);

    return () => clearInterval(intervalId);
  }, [props.task.status, props.task.lastEnteredInProgressAt]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        touchAction: "none",
      }}
      className="p-4 rounded-xl border border-surface-sidebar bg-surface-card flex flex-col gap-3 w-full group hover:border-text-muted/30 transition-colors relative"
    >
      <div className="flex justify-between items-start w-full">
        <span
          className={`w-fit px-2.5 py-1 uppercase text-[10px] font-bold tracking-wider rounded-full ${priorityStyles(props.task.priority)}`}
        >
          {props.task.priority}
        </span>

        <div className="relative">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-text-muted hover:text-text-primary p-1 rounded-md hover:bg-surface-sidebar transition-colors"
          >
            <MoreHorizontal size={16} />
          </button>

          {isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 top-full mt-1 w-28 bg-surface-column border border-surface-sidebar rounded-md shadow-lg overflow-hidden z-10 flex flex-col"
            >
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => {
                  setIsMenuOpen(false);
                  props.onEditTask(props.task);
                }}
                className="flex items-center gap-2 px-3 py-2 text-xs text-text-primary hover:bg-surface-sidebar text-left transition-colors"
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => {
                  setIsMenuOpen(false);
                  if (window.confirm(`Delete "${props.task.title}"?`)) {
                    props.onDeleteTask(props.task.id);
                  }
                }}
                className="flex items-center gap-2 px-3 py-2 text-xs text-priority-high hover:bg-priority-high/10 text-left transition-colors"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 w-full text-left">
        <h3 className="text-sm font-medium text-text-primary leading-snug">
          {props.task.title}
        </h3>
        {props.task.description && (
          <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
            {props.task.description}
          </p>
        )}
      </div>

      <div className="w-full mt-1 flex justify-between items-center">
        <span className="text-[10px] text-text-muted/40 font-mono font-medium">
          #{props.task.id}
        </span>
        <span className="text-[12px] text-text-muted">
          {props.task.status === "TODO" && props.task.estimatedDuration != null
            ? `≈ ${formatDuration(props.task.estimatedDuration)}`
            : props.task.status === "IN_PROGRESS"
              ? `> ${formatDuration(elapsedSeconds)}`
              : props.task.status === "DONE"
                ? `: ${formatDuration(props.task.actualDuration)}`
                : null}
        </span>
      </div>
    </div>
  );
}

export default TaskCard;
