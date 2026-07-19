import { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import type { Task } from "../types/Task";
import Column from "./Column";

function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:8080/tasks");
        const data = await response.json();
        setTasks(data);
      } catch (e) {
        setError("Failed to load tasks. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const todoTasks = tasks.filter((task) => task.status === "TODO");
  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((task) => task.status === "DONE");

  return (
    <DndContext>
      <div className="p-4 flex flex-row gap-8 bg-surface-page min-h-screen">
        {isLoading && <p className="text-text-primary">Loading tasks...</p>}
        {error && <p className="text-priority-high">{error}</p>}

        <Column title="To Do" tasks={todoTasks}></Column>
        <Column title="In Progress" tasks={inProgressTasks}></Column>
        <Column title="Done" tasks={doneTasks}></Column>
      </div>
    </DndContext>
  );
}

export default Board;
