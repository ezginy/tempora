import { useDroppable } from "@dnd-kit/core";
import type { Status, Task } from "../types/Task";
import TaskCard from "./TaskCard";

type ColumnProps = {
  title: string;
  tasks: Task[];
  status: Status;
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
      <h2 className="mb-8 font-semibold text-2xl text-center text-text-primary">
        {props.title}
      </h2>

      {props.tasks.map((task) => (
        <TaskCard task={task} key={task.id} />
      ))}
    </div>
  );
}

export default Column;
