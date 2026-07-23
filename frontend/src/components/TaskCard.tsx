import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Priority, Task } from "../types/Task";
import { Trash2, Pencil } from "lucide-react";

type TaskCardProps = {
  task: Task;
  onDeleteTask: (id: number) => void;
  onEditTask: (task: Task) => void;
};

const priorityStyles = (p: Priority): string => {
  if (p === "HIGH")
    return "border border-priority-high text-priority-high shadow-[0_0_8px_var(--color-priority-high)]";
  else if (p === "MEDIUM")
    return "border border-priority-medium text-priority-medium shadow-[0_0_8px_var(--color-priority-medium)]";
  else
    return "border border-priority-low text-priority-low shadow-[0_0_8px_var(--color-priority-low)]";
};

function TaskCard(props: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: props.task.id,
    });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
      }}
      className="p-4 m-4 rounded-lg shadow-md bg-surface-card flex flex-col items-center"
    >
      <div className="mb-3 w-full flex justify-end gap-2 text-xs">
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => {
            if (window.confirm(`Delete "${props.task.title}"?`)) {
              props.onDeleteTask(props.task.id);
            }
          }}
          className="text-priority-high hover:opacity-70 transition-opacity"
        >
          <Trash2 size={16} />
        </button>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => props.onEditTask(props.task)}
          className="text-priority-medium hover:opacity-70 transition-opacity"
        >
          <Pencil size={16} />
        </button>
      </div>

      <h3 className="p-1.5 mb-2 w-full bg-surface-card-title rounded-lg text-center text-text-primary">
        {props.task.title}
      </h3>
      <p className="p-2 mb-4 w-full bg-surface-card-desc rounded-md text-center text-text-primary/80">
        {props.task.description}
      </p>

      <div className="w-full flex justify-between text-xs">
        <span className="p-1 text-text-muted/60">#{props.task.id}</span>
        <span
          className={`p-1.5 uppercase text-[10px] font-semibold tracking-widest rounded-full bg-surface-card-badge ${priorityStyles(props.task.priority)}`}
        >
          {props.task.priority}
        </span>
      </div>
    </div>
  );
}

export default TaskCard;
