import type { Task } from "../types/Task";
import Column from "./Column";

function Board() {
    const todoTasks: Task[] = [
        {
            id: 1,
            title: "Task 111",
            description: "desc",
            priority: "LOW"
        },
        {
            id: 2,
            title: "Task 222",
            description: "desc",
            priority: "MEDIUM"
        },
    ];

    const inProgressTasks: Task[] = [
        {
            id: 3,
            title: "Task 333",
            description: "desc",
            priority: "HIGH"
        },
    ];

    const doneTasks: Task[] = [
        {
            id: 4,
            title: "Task 111",
            description: "desc",
            priority: "MEDIUM"
        },
        {
            id: 5,
            title: "Task 222",
            description: "desc",
            priority: "MEDIUM"
        },
    ];

    return(
        <>
        <Column title="To Do" tasks={todoTasks}></Column>
        <Column title="In Progress" tasks={inProgressTasks}></Column>
        <Column title="Done" tasks={doneTasks}></Column>
        </>
    );
}

export default Board;