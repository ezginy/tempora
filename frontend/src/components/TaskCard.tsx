import type { Task } from "../types/Task";

type TaskCardProps = {
  task: Task;
};

function TaskCard(props: TaskCardProps) {
  return (
    <div>
      <h3>{props.task.title}</h3>
      <p>{props.task.description}</p>
      <span>{props.task.id}</span>
      <span>{props.task.priority}</span>
    </div>
  );
}

export default TaskCard;
