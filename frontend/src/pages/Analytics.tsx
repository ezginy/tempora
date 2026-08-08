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
import type { Task } from "../types/Task";
import { formatDuration } from "../utils/formatDuration";

const API_URL = import.meta.env.VITE_API_URL;

function Analytics() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch(`${API_URL}/tasks`, {
        credentials: "include",
      });
      const data = await response.json();
      setTasks(data.filter((t: Task) => t.status === "DONE"));
      setIsLoading(false);
    };
    fetchTasks();
  }, []);

  if (isLoading)
    return (
      <p className="p-4 text-text-primary bg-surface-page min-h-screen">
        Loading...
      </p>
    );

  const chartData = tasks.map((task) => ({
    name: task.title,
    Estimated: task.estimatedDuration
      ? Math.round(task.estimatedDuration / 60)
      : 0,
    Actual: Math.round(task.actualDuration / 60),
  }));

  const durationComparisons = tasks
    .filter((task) => task.estimatedDuration !== null)
    .map((task) => ({
      ...task,
      diffSeconds: task.actualDuration - task.estimatedDuration!,
    }))
    .sort((a, b) => Math.abs(b.diffSeconds) - Math.abs(a.diffSeconds));

  return (
    <div className="p-4 text-text-primary bg-surface-page flex flex-col flex-1 h-screen">
      <h1 className="text-2xl font-bold mb-8 text-center">Analytics</h1>
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

      <div className="mt-16">
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
    </div>
  );
}

export default Analytics;
