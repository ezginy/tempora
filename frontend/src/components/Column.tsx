import type { Task } from "../types/Task";
import TaskCard from "./TaskCard";

type ColumnProps = {
  title: string;
  tasks: Task[];
};

function Column(props: ColumnProps) {
  return (
    <div className="p-8 bg-stone-900 flex flex-col gap-4 min-w-72">
      <h2 className="mb-8 font-semibold text-2xl text-center text-white">
        {props.title}
      </h2>

      {props.tasks.map((task) => (
        <TaskCard task={task} key={task.id} />
      ))}
    </div>
  );
}

export default Column;
