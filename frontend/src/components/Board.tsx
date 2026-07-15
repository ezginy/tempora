import { useState, useEffect } from "react";
import type { Task } from "../types/Task";
import Column from "./Column";

function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch("http://localhost:8080/tasks");
      const data = await response.json();
      setTasks(data);
    };

    fetchTasks();
  }, []);

  const todoTasks: Task[] = [
    {
      id: 1,
      title: "Task 111",
      description: "desc",
      priority: "LOW",
      status: "TODO",
    },
    {
      id: 2,
      title: "Task 222",
      description: "desc",
      priority: "MEDIUM",
      status: "DONE",
    },
  ];

  const inProgressTasks: Task[] = [
    {
      id: 3,
      title: "Task 333",
      description: "desc",
      priority: "HIGH",
      status: "IN_PROGRESS",
    },
  ];

  const doneTasks: Task[] = [
    {
      id: 4,
      title: "Task 111",
      description: "desc",
      priority: "MEDIUM",
      status: "IN_PROGRESS",
    },
    {
      id: 5,
      title: "Task 222",
      description: "desc",
      priority: "MEDIUM",
      status: "DONE",
    },
  ];

  return (
    <div className="p-4 flex flex-row gap-8 bg-surface-page min-h-screen">
      <Column title="To Do" tasks={todoTasks}></Column>
      <Column title="In Progress" tasks={inProgressTasks}></Column>
      <Column title="Done" tasks={doneTasks}></Column>
    </div>
  );
}

export default Board;
