import { useState, useEffect } from "react";
import type { Task } from "../types/Task";
import Column from "./Column";

function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch("http://localhost:8080/tasks");
      const data = await response.json();

      setTasks(data);
      setIsLoading(false);
    };

    fetchTasks();
  }, []);

  const todoTasks = tasks.filter((task) => task.status === "TODO");
  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((task) => task.status === "DONE");

  return (
    <div className="p-4 flex flex-row gap-8 bg-surface-page min-h-screen">
      {isLoading && <p className="text-text-primary">Loading tasks...</p>}

      <Column title="To Do" tasks={todoTasks}></Column>
      <Column title="In Progress" tasks={inProgressTasks}></Column>
      <Column title="Done" tasks={doneTasks}></Column>
    </div>
  );
}

export default Board;
