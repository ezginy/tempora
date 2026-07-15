import type { Priority, Task } from "../types/Task";

type TaskCardProps = {
  task: Task;
};

const priorityColors = (p: Priority): string => {
  if (p === "HIGH") return "bg-priority-high";
  else if (p === "MEDIUM") return "bg-priority-medium";
  else return "bg-priority-low";
};

function TaskCard(props: TaskCardProps) {
  return (
    <div className="p-4 m-4 rounded-lg shadow-md bg-stone-700 flex flex-col items-center">
      <h3 className="p-1.5 mb-2 w-full bg-stone-400 rounded-lg text-center">
        {props.task.title}
      </h3>
      <p className="p-2 mb-4 w-full bg-stone-500 rounded-md text-center">
        {props.task.description}
      </p>

      <div className="w-full flex justify-between">
        <span className="p-1 rounded-full bg-stone-600">#{props.task.id}</span>
        <span
          className={`p-1.5 rounded-full ${priorityColors(props.task.priority)}`}
        >
          {props.task.priority}
        </span>
      </div>
    </div>
  );
}

export default TaskCard;
