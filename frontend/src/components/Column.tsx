import { useDroppable } from "@dnd-kit/core";
import type { Status, Task } from "../types/Task";
import TaskCard from "./TaskCard";

type ColumnProps = {
  title: string;
  tasks: Task[];
  status: Status;
  onDeleteTask: (id: number) => void;
  onEditTask: (task: Task) => void;
};

function Column(props: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: props.status,
  });

  return (
    <div
      ref={setNodeRef}
      className="p-8 bg-surface-column rounded-2xl flex flex-col gap-4 min-w-72"
    >
      <div className="flex items-center gap-3 pb-4 border-b border-surface-sidebar px-1">
        <h2 className="font-semibold text-lg text-text-primary tracking-wide">
          {props.title}
        </h2>
        <span className="flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-surface-card-badge text-xs font-semibold text-text-muted">
          {props.tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {props.tasks.map((task) => (
          <TaskCard
            task={task}
            key={task.id}
            onDeleteTask={props.onDeleteTask}
            onEditTask={props.onEditTask}
          />
        ))}
      </div>
    </div>
  );
}

export default Column;
