import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { ChevronRight, ChevronLeft } from "lucide-react";
import type { Task } from "../types/Task";
import { formatDuration } from "../utils/formatDuration";

const API_URL = import.meta.env.VITE_API_URL;

function Analytics() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [history, setHistory] = useState<
    { fromStatus: string; toStatus: string; changedAt: string }[]
  >([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch(`${API_URL}/tasks`, {
        credentials: "include",
      });
      const data = await response.json();
      setTasks(data);
      setIsLoading(false);
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    if (selectedTaskId === null) return;

    const fetchHistory = async () => {
      setIsHistoryLoading(true);
      const response = await fetch(
        `${API_URL}/tasks/${selectedTaskId}/history`,
        { credentials: "include" }
      );
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
      setIsHistoryLoading(false);
    };

    fetchHistory();
  }, [selectedTaskId]);

  if (isLoading)
    return (
      <p className="p-4 text-text-primary bg-surface-page min-h-screen">
        Loading...
      </p>
    );

  const doneTasks = tasks.filter((task) => task.status === "DONE");

  const chartData = doneTasks.map((task) => ({
    name: task.title,
    Estimated: task.estimatedDuration
      ? Math.round(task.estimatedDuration / 60)
      : 0,
    Actual: Math.round(task.actualDuration / 60),
  }));

  const durationComparisons = doneTasks
    .filter((task) => task.estimatedDuration !== null)
    .map((task) => ({
      ...task,
      diffSeconds: task.actualDuration - task.estimatedDuration!,
    }))
    .sort((a, b) => Math.abs(b.diffSeconds) - Math.abs(a.diffSeconds));

  return (
    <div className="p-4 text-text-primary bg-surface-page flex flex-col flex-1 h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold mb-8 self-end md:self-start pr-6 pb-2 border-r border-b border-surface-column rounded-br-3xl">
        Analytics
      </h1>
      <h2 className="text-lg font-semibold mb-3">
        Estimated vs Actual Duration
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" stroke="#9a9aa5" />
          <YAxis
            stroke="#9a9aa5"
            label={{
              value: "Minutes",
              angle: -90,
              position: "insideLeft",
              fill: "#9a9aa5",
            }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#202028", border: "none" }}
            cursor={{ fill: "rgba(255, 255, 255, 0.03" }}
          />
          <Legend />
          <Bar dataKey="Estimated" fill="#38bdf8">
            <LabelList
              dataKey="Estimated"
              position="top"
              fill="#9a9aa5"
              fontSize={11}
              formatter={(value) =>
                typeof value === "number" ? formatDuration(value * 60) : ""
              }
            />
          </Bar>
          <Bar dataKey="Actual" fill="#34d399">
            <LabelList
              dataKey="Actual"
              position="top"
              fill="#9a9aa5"
              fontSize={11}
              formatter={(value) =>
                typeof value === "number" ? formatDuration(value * 60) : ""
              }
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:pr-8 md:border-r md:border-surface-column">
          <h2 className="text-lg font-semibold mb-3">
            Tasks that ran over estimate
          </h2>
          {durationComparisons.length === 0 ? (
            <p className="text-text-muted text-sm">
              No tasks exceeded their estimate.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {durationComparisons.map((task) => {
                const isOver = task.diffSeconds > 0;
                return (
                  <li
                    key={task.id}
                    className="p-3 rounded-md bg-surface-column flex justify-between"
                  >
                    <span>{task.title}</span>
                    <span
                      className={
                        isOver ? "text-priority-high" : "text-priority-low"
                      }
                    >
                      {isOver ? "+" : "-"}
                      {formatDuration(Math.abs(task.diffSeconds))}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold mb-3">Task History</h2>
            {selectedTaskId !== null && (
              <button
                onClick={() => setSelectedTaskId(null)}
                className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                <ChevronLeft size={16} /> Back to tasks
              </button>
            )}
          </div>

          {selectedTaskId === null ? (
            <ul className="flex flex-col gap-2">
              {tasks.map((task) => (
                <li key={task.id}>
                  <button
                    onClick={() => setSelectedTaskId(task.id)}
                    className="w-full p-3 rounded-md bg-surface-column flex items-center justify-between hover:bg-surface-card transition-colors"
                  >
                    <span>{task.title}</span>
                    <ChevronRight size={16} className="text-text-muted" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col gap-4">
              {isHistoryLoading ? (
                <p className="text-text-muted text-sm">Loading...</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {history.map((entry, index) => (
                    <li key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        {index !== history.length - 1 && (
                          <div className="w-px flex-1 bg-surface-column" />
                        )}
                      </div>
                      <div className="pb-3">
                        <p className="text-sm">
                          {entry.fromStatus} → {entry.toStatus}
                        </p>
                        <p className="text-xs text-text-muted">
                          {new Date(entry.changedAt).toLocaleString("en-US", {
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
