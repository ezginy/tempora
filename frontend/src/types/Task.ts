export type Priority = "LOW" | "MEDIUM" | "HIGH";

export type Task = {
  id: number;
  title: string;
  description: string;
  priority: Priority;
};
