import { useState, useEffect } from "react";
import type { Priority, Status, Task } from "../types/Task";
import Column from "../components/Column";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Plus, Pencil } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titleError, setTitleError] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("LOW");
  const [newEstimatedDays, setNewEstimatedDays] = useState("");
  const [newEstimatedHours, setNewEstimatedHours] = useState("");
  const [newEstimatedMinutes, setNewEstimatedMinutes] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_URL}/tasks`);
        const data = await response.json();
        setTasks(data);
      } catch (e) {
        setError("Failed to load tasks. Please try again.");
        console.error("Failed to fetch tasks: ", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    if (!event.over) return;

    const newStatus = event.over.id as Status;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === event.active.id ? { ...task, status: newStatus } : task
      )
    );

    fetch(`${API_URL}/tasks/${event.active.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  const handleSubmitTask = async () => {
    if (!newTitle.trim()) {
      setTitleError(true);
      return;
    }
    setTitleError(false);

    const days = parseInt(newEstimatedDays) || 0;
    const hours = parseInt(newEstimatedHours) || 0;
    const minutes = parseInt(newEstimatedMinutes) || 0;
    const totalSeconds = (days * 24 * 60 + hours * 60 + minutes) * 60;

    const taskData = {
      title: newTitle,
      description: newDescription,
      priority: newPriority,
      estimatedDuration: totalSeconds > 0 ? totalSeconds : null,
    };

    try {
      if (editingTaskId) {
        // edit mod: PUT request
        const response = await fetch(`${API_URL}/tasks/${editingTaskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });
        if (!response.ok) throw new Error(`PUT failed: ${response.status}`);

        const updatedTask = await response.json();

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editingTaskId ? updatedTask : task
          )
        );
      } else {
        // create mod: POST request
        const response = await fetch(`${API_URL}/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });
        if (!response.ok) throw new Error(`POST failed: ${response.status}`);

        const createdTask = await response.json();

        setTasks((prevTasks) => [...prevTasks, createdTask]);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.log("Failed to submit task: ", err);
    }
  };

  const handleDeleteTask = async (id: number) => {
    await fetch(`${API_URL}/tasks/${id}`, {
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
    setNewEstimatedDays("");
    setNewEstimatedHours("");
    setNewEstimatedMinutes("");
    setTitleError(false);
    setEditingTaskId(null);
  };

  const todoTasks = tasks.filter((task) => task.status === "TODO");
  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((task) => task.status === "DONE");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="p-4 flex flex-col gap-6 bg-surface-page min-h-screen flex-1 overflow-x-hidden">
        {isLoading && (
          <p className="text-text-primary text-right w-full">
            Loading tasks...
          </p>
        )}
        {error && (
          <p className="text-priority-high text-right w-full">{error}</p>
        )}

        <button
          onClick={() => {
            setIsModalOpen(true);
            resetForm();
          }}
          className="px-3 py-1.5 rounded-lg bg-accent text-surface-page font-semibold hover:opacity-80 transition-opacity self-end"
        >
          + Add Task
        </button>

        <div className="flex flex-col md:flex-row gap-8 w-full md:justify-center">
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-surface-card p-8 rounded-lg flex flex-col gap-4 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div
              className={`flex items-center justify-center gap-2 text-md font-semibold mb-2
              ${editingTaskId ? "text-priority-medium" : "text-accent"}`}
            >
              {editingTaskId ? <Pencil size={16} /> : <Plus size={16} />}
              <span>{editingTaskId ? "Edit Task" : "Create Task"}</span>
            </div>
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

            <p className="text-xs text-text-muted -mb-2 mt-2">
              Estimated duration (optional)
            </p>
            <div className="flex gap-3">
              <input
                type="number"
                min={0}
                placeholder="Days"
                value={newEstimatedDays}
                onChange={(e) => setNewEstimatedDays(e.target.value)}
                className="p-2 rounded-md bg-surface-card-title text-text-primary w-1/3"
              />
              <input
                type="number"
                min={0}
                placeholder="Hours"
                value={newEstimatedHours}
                onChange={(e) => setNewEstimatedHours(e.target.value)}
                className="p-2 rounded-md bg-surface-card-title text-text-primary w-1/3"
              />
              <input
                type="number"
                min={0}
                placeholder="Minutes"
                value={newEstimatedMinutes}
                onChange={(e) => setNewEstimatedMinutes(e.target.value)}
                className="p-2 rounded-md bg-surface-card-title text-text-primary w-1/3"
              />
            </div>

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
                className={`px-3 py-2 rounded-md text-surface-page font-semibold hover:opacity-80 transition-opacity 
                  ${editingTaskId ? "bg-priority-medium" : "bg-accent"}`}
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
