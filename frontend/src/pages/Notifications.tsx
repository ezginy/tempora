import { useState, useEffect } from "react";
import type { Task } from "../types/Task";
import { getElapsedSeconds } from "../utils/getElapsedSeconds";
import { formatDuration } from "../utils/formatDuration";

const API_URL = import.meta.env.VITE_API_URL;

function Notifications() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch(`${API_URL}/tasks`, {
        credentials: "include",
      });
      if (!response.ok) return;
      const data = await response.json();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(intervalId);
  }, []);

  const overdueTasks = tasks.filter((task) => {
    if (task.estimatedDuration == null) return false;

    if (task.status === "IN_PROGRESS" && task.lastEnteredInProgressAt) {
      const elapsedSeconds = getElapsedSeconds(
        task.lastEnteredInProgressAt,
        now
      );
      return elapsedSeconds > task.estimatedDuration;
    }

    if (task.status === "DONE") {
      return task.actualDuration > task.estimatedDuration;
    }

    return false;
  });

  return (
    <div className="p-4 text-text-primary bg-surface-page flex flex-col flex-1 h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold self-end md:self-start pr-6 pb-2 border-r border-b border-surface-column rounded-br-3xl">
        Notifications
      </h1>
      <div className="mt-4 flex flex-col gap-3 w-full">
        {overdueTasks.length === 0 ? (
          <p className="text-text-muted">No overdue tasks right now.</p>
        ) : (
          overdueTasks.map((task) => {
            const overBy =
              task.status === "DONE"
                ? task.actualDuration - task.estimatedDuration!
                : getElapsedSeconds(task.lastEnteredInProgressAt!, now) -
                  task.estimatedDuration!;

            return (
              <div
                key={task.id}
                className="p-4 rounded-lg bg-surface-card flex flex-col gap-3 md:gap-0"
              >
                <div className="flex gap-2">
                  <p className="text-text-muted/75">Task:</p>
                  <p className="font-medium">{task.title}</p>
                </div>
                <p className="text-sm text-priority-high text-end">
                  ▸ {formatDuration(overBy)} longer than estimated duration
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Notifications;
