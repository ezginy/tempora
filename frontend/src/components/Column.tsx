import type { Task } from "../types/Task";
import TaskCard from "./TaskCard";

type ColumnProps = {
    title: string;
    tasks: Task[];
}

function Column(props: ColumnProps) {
    return(
        <div>
            <h2>{props.title}</h2>

            {props.tasks.map((task) => (
                <TaskCard task={task} key={task.id} />
            ))}
        </div>
    );
}

export default Column;