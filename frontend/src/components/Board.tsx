import { useState, useEffect } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import type { Priority, Status, Task } from "../types/Task";
import Column from "./Column";

function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("LOW");
  const [titleError, setTitleError] = useState(false);

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

  const handleDragEnd = (event: DragEndEvent) => {
    if (!event.over) return;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === event.active.id
          ? { ...task, status: event.over!.id as Status }
          : task
      )
    );
  };

  const handleSubmitTask = async () => {
    if (!newTitle.trim()) {
      setTitleError(true);
      return;
    }
    setTitleError(false);

    const taskData = {
      title: newTitle,
      description: newDescription,
      priority: newPriority,
    };

    if (editingTaskId) {
      // edit mod: PUT request
      const response = await fetch(
        `http://localhost:8080/tasks/${editingTaskId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        }
      );
      const updatedTask = await response.json();

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTaskId ? updatedTask : task
        )
      );
    } else {
      // create mod: POST request
      const response = await fetch("http://localhost:8080/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      const createdTask = await response.json();

      setTasks((prevTasks) => [...prevTasks, createdTask]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDeleteTask = async (id: number) => {
    await fetch(`http://localhost:8080/tasks/${id}`, {
      method: "DELETE",
    });

    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setNewTitle(task.title);
    setNewDescription(task.description);
    setNewPriority(task.priority);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setNewTitle("");
    setNewDescription("");
    setNewPriority("LOW");
    setTitleError(false);
    setEditingTaskId(null);
  };

  const todoTasks = tasks.filter((task) => task.status === "TODO");
  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((task) => task.status === "DONE");

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="p-4 flex flex-row gap-8 bg-surface-page min-h-screen">
        {isLoading && <p className="text-text-primary">Loading tasks...</p>}
        {error && <p className="text-priority-high">{error}</p>}

        <button
          onClick={() => {
            setIsModalOpen(true);
            resetForm();
          }}
          className="px-3 py-2 rounded-md bg-accent text-surface-page font-semibold hover:opacity-80 transition-opacity self-start"
        >
          + Add Task
        </button>

        <Column
          title="To Do"
          tasks={todoTasks}
          status="TODO"
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
        ></Column>
        <Column
          title="In Progress"
          tasks={inProgressTasks}
          status="IN_PROGRESS"
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
        ></Column>
        <Column
          title="Done"
          tasks={doneTasks}
          status="DONE"
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
        ></Column>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-surface-card p-8 rounded-lg flex flex-col gap-4 min-w-80">
            <input
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className={`p-2 rounded-md bg-surface-card-title text-text-primary 
                ${titleError ? "border border-priority-high" : ""}`}
            />
            {titleError && (
              <p className="text-priority-high text-sm">Title is required</p>
            )}
            <textarea
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="p-2 rounded-md bg-surface-card-desc text-text-primary"
            />
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as Priority)}
              className="p-2 rounded-md bg-surface-card-badge text-text-primary"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

            <div className="flex justify-between mt-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="px-3 py-2 rounded-md border border-text-muted text-text-muted hover:text-text-primary hover:border-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTask}
                className="px-3 py-2 rounded-md bg-priority-low text-surface-page font-semibold hover:opacity-80 transition-opacity"
              >
                {editingTaskId ? "Save" : "Add Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DndContext>
  );
}

export default Board;
